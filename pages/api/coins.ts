import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../src/lib/prisma';
import { redisHandler } from 'utils/redis';
import axios from 'axios';

interface QuoteUSD {
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  fdv: number;
  volume_24h: number;
  total_supply: number;
  circulating_supply: number;
  max_supply: number | null;
  last_updated: string;
}

interface CoinData {
  quote: {
    USD: QuoteUSD;
  };
  circulating_supply: number;
}

interface CMCApiResponse {
  data: {
    [key: string]: CoinData;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const cacheKey = `coins`;
  let cachedData = await redisHandler.get(cacheKey);

  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    const tokens = await prisma.token.findMany({
      take: 20,
      orderBy: {
        rank: 'asc',
      },
      select: {
        id: true,
        slug: true,
        ticker: true,
        name: true,
        rank: true,
        currentPrice: true,
        marketData: true,
        priceChanges: true,
        cmcId: true,
      },
      where: {
        rank: {
          not: null,
        },
      },
    });

    const cmcIds = tokens
      .filter((token) => token.cmcId)
      .map((token) => String(token.cmcId))
      .join(',');

    let latestPriceData: { [key: string]: CoinData } = {};

    if (cmcIds) {
      try {
        const response = await axios.get<CMCApiResponse>(
          `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${cmcIds}`,
          {
            headers: {
              'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string,
            },
            timeout: 10000,
          }
        );

        if (response.data?.data) {
          latestPriceData = response.data.data;
        }
      } catch (error: any) {
        console.error('Error fetching latest prices from CMC:', error.message || error);
      }
    }

    const formattedTokens = await Promise.all(
      tokens.map(async (token) => {
        const cmcIdStr = token.cmcId?.toString();
        const latestData = cmcIdStr && latestPriceData[cmcIdStr] ? latestPriceData[cmcIdStr].quote.USD : null;

        let circulatingSupply = token.marketData?.circulatingSupply ?? null;

        if ((circulatingSupply === null || circulatingSupply === undefined) && token.cmcId && !latestData) {
          try {
            const supplyResponse = await axios.get<CMCApiResponse>(
              `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${token.cmcId}`,
              {
                headers: {
                  'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string,
                },
                timeout: 8000,
              }
            );

            const coinKey = String(token.cmcId);
            if (supplyResponse.data?.data?.[coinKey]) {
              const freshData = supplyResponse.data.data[coinKey];
              circulatingSupply = freshData.circulating_supply ?? 0;

              if (circulatingSupply > 0) {
                await prisma.token
                  .update({
                    where: { id: token.id },
                    data: {
                      marketData: {
                        update: {
                          circulatingSupply,
                        },
                      },
                    },
                  })
                  .catch((err) => {
                    console.error(`Failed to update circulatingSupply for ${token.name}:`, err);
                  });
              }

              Object.assign(latestPriceData, supplyResponse.data.data);
            }
          } catch (error: any) {
            console.error(`Error fetching supply for ${token.name}:`, error.message || error);
            circulatingSupply = 0;
          }
        } else if (latestData) {
          circulatingSupply = latestPriceData[String(token.cmcId)].circulating_supply || 0;
        }

        const currentPrice = latestData
          ? { usd: latestData.price, lastUpdated: latestData.last_updated }
          : { usd: token.currentPrice?.usd || 0, lastUpdated: token.currentPrice?.lastUpdated || new Date().toISOString() };

        const priceChanges = {
          hour1: latestData?.percent_change_1h ?? token.priceChanges?.hour1 ?? 0,
          day1: latestData?.percent_change_24h ?? token.priceChanges?.day1 ?? 0,
          day7: latestData?.percent_change_7d ?? token.priceChanges?.week1 ?? 0,
        };

        const marketData = {
          marketCap: latestData?.market_cap ?? token.marketData?.marketCap ?? 0,
          fdv: latestData?.fdv ?? token.marketData?.fdv ?? 0,
          volume24h: latestData?.volume_24h ?? token.marketData?.volume24h ?? 0,
          totalSupply: latestData?.total_supply ?? token.marketData?.totalSupply ?? 0,
          circulatingSupply: circulatingSupply ?? 0,
          maxSupply: latestData?.max_supply ?? token.marketData?.maxSupply ?? null,
        };

        return {
          id: token.id,
          slug: token.slug,
          ticker: token.ticker,
          name: token.name,
          rank: token.rank,
          cmcId: token.cmcId,
          currentPrice,
          priceChanges,
          marketData,
          lastUpdated: latestData?.last_updated ?? token.currentPrice?.lastUpdated ?? new Date().toISOString(),
        };
      })
    );

    const data = { tokens: formattedTokens };

    await redisHandler.set(cacheKey, data, { expirationTime: 15 * 60 });

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching coins:', error);
    return res.status(500).json({ message: 'Error fetching coins' });
  }
}
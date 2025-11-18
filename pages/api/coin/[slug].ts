import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'src/lib/prisma';
import { redisHandler } from 'utils/redis';
import axios from 'axios';
import { parseTokenSlug } from 'utils/url';

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
  id: number;
  name: string;
  symbol: string;
  slug: string;
  logo?: string;
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

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Invalid ticker parameter' });
  }

  const cacheKey = `coin_${slug}`;
  const cached = await redisHandler.get(cacheKey);

  if (cached) {
    return res.status(200).json(cached);
  }

  let latestPriceData: { [key: string]: CoinData } = {};

  try {
    const token = await prisma.token.findFirst({
      where: {
        slug: slug,
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
    });

    if (token && token.cmcId) {
      const cmcIdStr = String(token.cmcId);

      try {
        const response = await axios.get<CMCApiResponse>(
          `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${token.cmcId}`,
          {
            headers: {
              'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY!,
            },
            timeout: 8000,
          }
        );

        if (response.data?.data?.[cmcIdStr]) {
          latestPriceData[cmcIdStr] = response.data.data[cmcIdStr];
        }
      } catch (error: any) {
        console.error(`CMC price fetch failed for ${token.slug}:`, error.message);
      }

      if (!latestPriceData[cmcIdStr]) {
        try {
          const infoResponse = await axios.get<CMCApiResponse>(
            `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${token.cmcId}`,
            {
              headers: {
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY!,
              },
              timeout: 8000,
            }
          );

          if (infoResponse.data?.data?.[cmcIdStr]) {
            latestPriceData[cmcIdStr] = infoResponse.data.data[cmcIdStr];
          }
        } catch (error: any) {
          console.error(`CMC info fetch failed for ${slug}:`, error.message);
        }
      }

      const latestData = latestPriceData[cmcIdStr]?.quote?.USD || null;

      let circulatingSupply = token.marketData?.circulatingSupply ?? null;
      if ((circulatingSupply === null || circulatingSupply === 0) && latestPriceData[cmcIdStr]?.circulating_supply) {
        circulatingSupply = latestPriceData[cmcIdStr].circulating_supply;
        await prisma.token.update({
          where: { id: token.id },
          data: {
            marketData: {
              update: { circulatingSupply },
            },
          },
        }).catch(console.error);
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
        volume24h: latestData?.volume_24h ?? token.marketData?.volume24h ?? 0,
        circulatingSupply: circulatingSupply ?? 0,
      };

      const coin = {
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

      await redisHandler.set(cacheKey, coin, { expirationTime: 3600 });
      return res.status(200).json(coin);
    }

    try {
      const ticker = parseTokenSlug(slug)?.ticker;
      const searchResponse = await axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?symbol=${ticker?.toUpperCase()}`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY!,
          },
          timeout: 8000,
        }
      );

      const coinEntry = searchResponse.data?.data?.[0];
      if (!coinEntry) {
        return res.status(404).json({ message: 'Coin not found' });
      }

      const result = {
        id: coinEntry.id,
        name: coinEntry.name,
        ticker: coinEntry.symbol,
        cmcId: coinEntry.id,
        slug: coinEntry.slug,
        logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coinEntry.id}.png`
      };

      await redisHandler.set(cacheKey, result, { expirationTime: 3600 });
      return res.status(200).json(result);
    } catch (error: any) {
      console.error(`CMC search failed for ${slug}:`, error.message);
    }

    return res.status(404).json({ message: 'Coin not found' });
  } catch (error: any) {
    console.error('Error fetching coin info:', error.message || error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
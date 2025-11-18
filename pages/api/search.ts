import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../src/lib/prisma';
import { getCoinPriceRedis } from './coin/price/[id]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchTerm = q.toLowerCase();

    const results = await prisma.token.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            ticker: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        ]
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
      orderBy: {
        rank: 'asc',
      },
      take: 20
    });

    const resultsWithPrice = await Promise.all(
      results.map(async (result) => {
        try {
          if (result.cmcId) {
            const priceData:any = await getCoinPriceRedis(result.cmcId);
            
            return {
              ...result,
              currentPrice: {
                usd: priceData.price,
                lastUpdated: new Date()
              },
              marketData: {
                marketCap: priceData.market_cap,
                volume24h: priceData.volume,
                circulatingSupply: priceData.circulating_supply
              },
              priceChanges: {
                hour1: result.priceChanges.hour1 || 0,
                day1: priceData.volume_change_24h || 0,
                week1: result.priceChanges.week1 || 0,
                lastUpdated: new Date()
              }
            };
          }
          return result;
        } catch (error) {
          console.error(`[Search API] Error fetching price for ${result.name}:`, error);
          return result;
        }
      })
    );

    return res.status(200).json(resultsWithPrice);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
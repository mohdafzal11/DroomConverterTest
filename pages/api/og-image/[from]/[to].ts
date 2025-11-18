import { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas, loadImage, registerFont } from 'canvas';
import prisma from '../../../../src/lib/prisma';
import { redisHandler } from '../../../../src/utils/redis';
import path from 'path';
import fs from 'fs';
import { parseTokenSlug } from '../../../../src/utils/url';
import { CURRENCIES } from '../../../../src/context/CurrencyContext';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { from, to } = req.query;
    
    if (!from || !to || typeof from !== 'string' || typeof to !== 'string') {
      return res.status(400).json({ error: 'Invalid from/to parameters' });
    }
        
    const cacheKey = `og_image_${from}_${to}`;
    let cachedImage = null;
    try {
      cachedImage = await redisHandler.get(cacheKey);
    } catch (redisError) {
      console.error('Redis cache error:', redisError);
    }
    
    if (cachedImage) {
      // Return cached image
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=60'); // 1 min
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).send(Buffer.from(cachedImage as string, 'base64'));
    }
    
    let fromTokenInfo = parseTokenSlug(from);
    let toTokenInfo = parseTokenSlug(to);
    // Special case handling for Tether with duplicate usdt in the URL
    if (!toTokenInfo && to.includes('tether') && to.includes('usdt-usdt')) {
      console.log('Handling special case for Tether with duplicate USDT');
      toTokenInfo = {
        name: 'Tether',
        ticker: 'USDT'
      };
    }
    
    if (!fromTokenInfo || !toTokenInfo) {
      return res.status(400).json({ error: 'Invalid token slugs' });
    }
    
    // Check if tokens are fiat currencies
    const isFiatFrom = Object.keys(CURRENCIES).includes(fromTokenInfo.ticker);
    const isFiatTo = Object.keys(CURRENCIES).includes(toTokenInfo.ticker);
    
    // Get token data from database if they're not fiat currencies
    let fromToken = null;
    let toToken = null;
    
    if (!isFiatFrom) {
      fromToken = await prisma.token.findFirst({
        where: { ticker: fromTokenInfo.ticker },
        select: {
          id: true,
          name: true,
          ticker: true,
          cmcId: true,
        },
      });
    }
    
    if (!isFiatTo) {
      toToken = await prisma.token.findFirst({
        where: { ticker: toTokenInfo.ticker },
        select: {
          id: true,
          name: true,
          ticker: true,
          cmcId: true,
        },
      });
    }
    
    // Create canvas
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Load background image
    try {
      const bgImage = await loadImage(process.cwd() + '/public/Converter_Tokens.png');
      ctx.drawImage(bgImage, 0, 0, width, height);
    } catch (error) {
      console.error('Error loading background image:', error);
      // Fallback to solid color if background image fails to load
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
    }
    
    // Load and draw the 'from' token image
    let fromLogoImg;
    try {
      if (isFiatFrom) {
        // Load flag for fiat currency
        const countryCode = fromTokenInfo.ticker.toLowerCase().slice(0, 2);
        let flagUrl = `https://flagcdn.com/w80/${countryCode}.png`;
        
        try {
          fromLogoImg = await loadImage(flagUrl);
        } catch (flagError) {
          // Fallback to a generic currency icon if flag loading fails
          console.error(`Error loading flag for ${fromTokenInfo.ticker}:`, flagError);
          flagUrl = 'https://s2.coinmarketcap.com/static/cloud/img/fiat/128x128/usd.png';
          fromLogoImg = await loadImage(flagUrl);
        }
      } else if (fromToken && fromToken.cmcId) {
        // Load crypto logo from CMC
        const logoUrl = `https://s2.coinmarketcap.com/static/img/coins/128x128/${fromToken.cmcId}.png`;
        fromLogoImg = await loadImage(logoUrl);
      }
    } catch (error) {
      console.error('Error loading from logo:', error);
    }
    
    let toLogoImg;
    try {
      if (isFiatTo) {
        // Load flag for fiat currency
        const countryCode = toTokenInfo.ticker.toLowerCase().slice(0, 2);
        let flagUrl = `https://flagcdn.com/w80/${countryCode}.png`;
        
        try {
          toLogoImg = await loadImage(flagUrl);
        } catch (flagError) {
          console.error(`Error loading flag for ${toTokenInfo.ticker}:`, flagError);
          flagUrl = 'https://s2.coinmarketcap.com/static/cloud/img/fiat/128x128/usd.png';
          toLogoImg = await loadImage(flagUrl);
        }
      } else if (toToken && toToken.cmcId) {
        const logoUrl = `https://s2.coinmarketcap.com/static/img/coins/128x128/${toToken.cmcId}.png`;
        toLogoImg = await loadImage(logoUrl);
      }
    } catch (error) {
      console.error('Error loading to logo:', error);
    }
    
    if (fromLogoImg) {
      const logoX = 142; 
      const logoY = 192;
      const logoSize = 300;
      
      ctx.save();
      
      ctx.beginPath();
      ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      // No background fill - transparent background
      
      ctx.drawImage(fromLogoImg, logoX, logoY, logoSize, logoSize);
      
      ctx.restore();
    }
    
    if (toLogoImg) {
      const logoX = 758;
      const logoY = 192;
      const logoSize = 300;
      
      ctx.save();

      ctx.beginPath();
      ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      // No background fill - transparent background
      
      ctx.drawImage(toLogoImg, logoX, logoY, logoSize, logoSize);
      
      ctx.restore();
    }
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    
    const fromName = isFiatFrom ? CURRENCIES[fromTokenInfo.ticker as keyof typeof CURRENCIES]?.name : (fromToken?.name || fromTokenInfo.name);
    const fromTicker = fromTokenInfo.ticker;
    // ctx.fillText(`${fromName} (${fromTicker})`, 150, 550);
    
    ctx.font = 'bold 40px Arial';
    // ctx.fillText('to', 550, 550);
    
    ctx.font = 'bold 60px Arial';
    const toName = isFiatTo ? CURRENCIES[toTokenInfo.ticker as keyof typeof CURRENCIES]?.name : (toToken?.name || toTokenInfo.name);
    const toTicker = toTokenInfo.ticker;
    // ctx.fillText(`${toName} (${toTicker})`, 650, 550);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    // ctx.fillText('DroomDroom.com', 500, 600);
    
    const buffer = canvas.toBuffer('image/png');
    
    try {
      await redisHandler.set(cacheKey, buffer.toString('base64'));
    } catch (redisError) {
      console.error('Redis cache storage error:', redisError);
    }
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
    res.setHeader('X-Cache', 'MISS');
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    if (req.query && req.query.from && req.query.to) {
      console.error(`Failed request parameters: from=${req.query.from}, to=${req.query.to}`);
    }
    
    try {
      const fallbackPath = path.join(process.cwd(), 'public', 'og-fallback.png');
      if (fs.existsSync(fallbackPath)) {
        const fallbackImage = fs.readFileSync(fallbackPath);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=60'); // 1 minute
        return res.status(200).send(fallbackImage);
      } else {
        console.error('Fallback image not found at:', fallbackPath);
      }
    } catch (fallbackError) {
      console.error('Error serving fallback image:', fallbackError);
    }
    
    res.status(500).json({ error: 'Error generating image' });
  }
}
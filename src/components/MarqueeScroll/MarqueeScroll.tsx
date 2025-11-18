import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import axios from 'axios';
import { formatPercentageValue } from '../../utils/formatValues';
import { getApiUrl } from 'utils/config';
import { useRouter } from 'next/router';
import { MarqueeContainer, MarqueeContent, TokenItem, TokenInfo, TokenName, TokenPrice, PriceChange, ArrowIcon, TokenImage, TokenTicker } from './MarqueeScroll.styled';
import MarqueeScrollShimmer from './MarqueeScrollShimmer';


interface MarqueeToken {
  id: string;
  name: string;
  ticker: string;
  price: number;
  priceChange24h: number;
  imageUrl: string;
}

const MarqueeScroll: React.FC = () => {
  const [tokens, setTokens] = useState<MarqueeToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { formatPrice: formatCurrencyPrice } = useCurrency();
  const { fiatCurrencies } = useCurrency();
  const contentRef = useRef<HTMLDivElement>(null);

  const renderTokenItem = (token: MarqueeToken, key: string) => (
    <TokenItem
      key={key}
      onClick={() => handleCardClick(token.ticker)}
    >
      <TokenInfo>
        <TokenImage>
          <img
            src={token.imageUrl}
            width={24}
            height={24}
            alt={token.name}
            style={{ objectFit: 'cover' }}
          />
        </TokenImage>
        <TokenInfo>
          <div>
            <TokenName>{token.name}</TokenName>
            <TokenTicker>({token.ticker})</TokenTicker>
          </div>
          <TokenPrice>{formatCurrencyPrice(token.price)}</TokenPrice>
          <PriceChange isPositive={token.priceChange24h >= 0}>
            <ArrowIcon>
              {token.priceChange24h >= 0 ? '▲' : '▼'}
            </ArrowIcon>
            {formatPercentageValue(token.priceChange24h)}%
          </PriceChange>
        </TokenInfo>
      </TokenInfo>
    </TokenItem>
  );

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(getApiUrl(`/marquee-tokens`));
        let limitedTokens = response.data;

        if (limitedTokens.length < 8) {
          while (limitedTokens.length < 8) {
            limitedTokens = [...limitedTokens, ...limitedTokens];
          }
          limitedTokens = limitedTokens.slice(0, 8);
        }

        setTokens(limitedTokens);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching marquee tokens:', error);
        setIsLoading(false);
      }
    };

    fetchTokens();

    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  if (isLoading) {
    return <MarqueeScrollShimmer />;
  }

  return (
    <MarqueeContainer className="MarqueeContainer" ref={containerRef}>
      <MarqueeContent ref={contentRef}>
        {tokens.map((token, index) => renderTokenItem(token, `${token.id}-${index}`))}
      </MarqueeContent>
    </MarqueeContainer>
  );
};

export default MarqueeScroll;

import React, { useCallback } from 'react';
import * as S from './Explore.styled';
import { useRouter } from 'next/router';
import { IconsWrapper } from './Explore.styled';
import { CryptoIcon } from 'components/MoreConversions/MoreConversions.styled';
import { Token } from 'src/types';

interface ExploreProps {
  tokens: Token[];
  onCardClick: (fromToken: Token, toToken: Token) => void;
}

const Explore: React.FC<ExploreProps> = ({ tokens, onCardClick }) => {
  const router = useRouter();

  // Get USDT token for conversions
  const usdtToken = tokens.find(t => t.ticker === 'USDT');
  
  const handleCardClick = useCallback((crypto: Token) => {
    if (usdtToken) {
      onCardClick(crypto, usdtToken);
    }
  }, [onCardClick, usdtToken]);

  if (!usdtToken) return null;

  // Get top coins + ensure BTC and ETH are included
  const btcToken = tokens.find(t => t.ticker === 'BTC');
  const ethToken = tokens.find(t => t.ticker === 'ETH');
  
  let topCoins = tokens
    .filter(token => token.ticker !== 'USDT')
    .slice(0, 20); // Top 20 coins

  // Ensure BTC and ETH are at the beginning if they exist
  if (btcToken && !topCoins.find(t => t.ticker === 'BTC')) {
    topCoins = [btcToken, ...topCoins.slice(0, 19)];
  }
  if (ethToken && !topCoins.find(t => t.ticker === 'ETH')) {
    const hasBtc = topCoins.find(t => t.ticker === 'BTC');
    if (hasBtc) {
      topCoins = [btcToken!, ethToken, ...topCoins.filter(t => t.ticker !== 'BTC').slice(0, 18)];
    } else {
      topCoins = [ethToken, ...topCoins.slice(0, 19)];
    }
  }

  const formatPriceChange = (change: number) => {
    const isPositive = change >= 0;
    const formattedValue = Math.abs(change).toFixed(2);
    return {
      value: `${isPositive ? '+' : '-'}${formattedValue}%`,
      color: isPositive ? '#16c784' : '#ea3943'
    };
  };

  const duplicateForScroll = (items: any[]) => {
    return [...items, ...items, ...items];
  };

  const ITEMS_PER_ROW = 8;
  const TOTAL_ROWS = 3; 
  const MIN_ITEMS = ITEMS_PER_ROW * TOTAL_ROWS;

  const ensureMinimumItems = (items: any[]) => {
    if (items.length === 0) return [];
    const repeats = Math.ceil(MIN_ITEMS / items.length);
    return Array(repeats).fill(items).flat().slice(0, MIN_ITEMS);
  };

  const cryptoRows = [];
  const extendedCryptoConversions = ensureMinimumItems(topCoins);
  
  // Create exactly 3 rows
  for (let i = 0; i < TOTAL_ROWS; i++) {
    const startIndex = i * ITEMS_PER_ROW;
    const row = extendedCryptoConversions.slice(startIndex, startIndex + ITEMS_PER_ROW);
    // If the row is not complete, take items from the beginning to fill it
    while (row.length < ITEMS_PER_ROW) {
      row.push(extendedCryptoConversions[row.length % extendedCryptoConversions.length]);
    }
    cryptoRows.push(row);
  }

  return (
    <S.ExploreContainer>
      <S.SectionHeading>Explore</S.SectionHeading>
      <S.SectionDescription>
        A selection of relevant cryptocurrencies in which you might be interested.
      </S.SectionDescription>

      <S.CardGrid>
        {cryptoRows.map((row, rowIndex) => (
          <S.CardRow key={`crypto-row-${rowIndex}`}>
            <S.CardRowInner isReverse={rowIndex % 2 === 1}>
              {duplicateForScroll(row).map((crypto, index) => {
                const price = crypto.price / usdtToken.price;
                const priceChange = formatPriceChange(crypto.priceChanges['day1']);

                return (
                  <S.CryptoCard
                    href="#"
                    key={`${crypto.cmcId}-${index}`}
                    onClick={() => handleCardClick(crypto)}
                  >
                    <IconsWrapper>
                      <CryptoIcon src={crypto.logo} alt={crypto.name} />
                      <CryptoIcon src={usdtToken.logo} alt={usdtToken.name} />
                    </IconsWrapper>
                    <S.CryptoCardContent>
                      <S.CryptoCardTicker>{crypto.ticker}/{usdtToken.ticker}</S.CryptoCardTicker>
                      <S.CryptoCardPrice>${price.toFixed(2)} {usdtToken.ticker}</S.CryptoCardPrice>
                      <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        color: priceChange.color
                      }}>
                        {priceChange.value}
                      </div>
                    </S.CryptoCardContent>
                  </S.CryptoCard>
                );
              })}
            </S.CardRowInner>
          </S.CardRow>
        ))}
      </S.CardGrid>
    </S.ExploreContainer>
  );
};

export default Explore;

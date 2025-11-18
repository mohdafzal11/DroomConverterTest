import React, { useCallback } from 'react';
import * as S from './Market.styled';
import FiatTable from 'components/FiatCoinTable/FiatTable';
import router from 'next/router';
import { useCurrency } from 'src/context/CurrencyContext';
import { Token } from 'src/types';
import { calculateConversionRate } from 'utils/rates';

interface CryptoMarketProps {
  fromToken: Token;
  toToken: Token;
  id?: string;
  tokens?: Token[];
  fiatCurrencies?: any[];
}

const Market: React.FC<CryptoMarketProps> = ({
  fromToken,
  toToken,
  id,
  tokens,
  fiatCurrencies
}) => {
  const { rates } = useCurrency();

  const formatCurrency = (value: number) => {
    if (value >= 1000000000000) {
      return `$${(value / 1000000000000).toFixed(2)}T`;
    } else if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

 const getDecimalPlaces = (token: Token) => {
  if (!token.isCrypto) return 8;
  if (token.ticker === 'USDT' || token.ticker === 'USDC' || token.ticker === 'DAI' || token.ticker === 'BUSD') return 2;
  return 8;
};

  const formatPrice = (price: number, token: Token): string => {
    if (price === null || price === undefined) return '0';
    if (price < 0.00001) {
      return price.toExponential(4);
    }
    return price.toFixed(getDecimalPlaces(token));
  };

  const fromToRate = calculateConversionRate(fromToken, toToken , rates);
  const toFromRate = calculateConversionRate(toToken, fromToken , rates);

  const formatSupply = (value: number, unit: string) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B ${unit}`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ${unit}`;
    } else {
      return `${value.toFixed(1)} ${unit}`;
    }
  };

  const getSymbol = (coin: any): string => {
    return typeof coin.symbol === 'string' ? coin.symbol : '';
  };

 
  const getTokenStatus = (token: Token) => {
    return token?.priceChanges && token?.priceChanges['week1'] && token?.priceChanges['week1'] > 0 ? 'climbing' : 'falling';
  };

  const getTokenSlug = (ticker: string) => {
    if (fiatCurrencies?.find((currency: any) => currency.ticker === ticker)) {
      const fiatName = fiatCurrencies?.find((currency: any) => currency.ticker === ticker)?.name || ticker;
      return `${fiatName.toLowerCase().replace(/\s+/g, '-')}-${ticker.toLowerCase()}`;
    } else {
        const token  = tokens?.find((token: any) => token.ticker === ticker);
        return `${token?.name.toLowerCase().replace(/\s+/g, '-')}-${ticker.toLowerCase()}`;
    }
  };

  const handleCellClick = useCallback((fromTokenTicker: string, toTokenTicker: string) => {    
    const fromSlug = getTokenSlug(fromTokenTicker);
    const toSlug = getTokenSlug(toTokenTicker);
    
    router.push(`/${fromSlug}/${toSlug}`, undefined, { shallow: true });    
  }, [router, getTokenSlug]);
  
  if (!fromToken || !toToken) {
    return (
      <S.MarketContainer id={id}>
        <S.MarketHeading>Market latest</S.MarketHeading>
        <p>No market data available</p>
      </S.MarketContainer>
    );
  }

  return (
    <S.MarketContainer id={id}>
      {(fromToken?.isCrypto || toToken?.isCrypto) && <S.MarketHeading>Market latest</S.MarketHeading>}

      {fromToken.isCrypto && <div key={fromToken.id || 0}>
        <S.MarketStatusSection>
          <S.MarketStatusTitle>
            {fromToken.name} is <span style={{ color: getTokenStatus(fromToken) === 'climbing' ? '#4ca777' : '#e15241' }}>{getTokenStatus(fromToken)}</span> this week
          </S.MarketStatusTitle>

          <S.MarketStatusText>
            The current {fromToken.ticker} to {toToken.ticker} conversion rate is <strong>{formatPrice(fromToRate, toToken)}</strong>.
            Inversely, this means that if you convert 1 {fromToken.ticker} you will get {formatPrice(fromToRate, toToken)} {toToken.ticker}.
            <br />
            The conversion rate of {fromToken.ticker}/{toToken.ticker} has
            <span style={{ color: (fromToken.priceChanges?.['hour1'] || 0) > 0 ? '#4ca777' : '#e15241' }}>
              {' '}{(fromToken.priceChanges?.['hour1'] || 0) > 0 ? 'increased' : 'decreased'} by {Math.abs(fromToken.priceChanges?.['hour1'] || 0).toFixed(2)}%
            </span> in the last hour and
            <span style={{ color: (fromToken.priceChanges?.['day1'] || 0) > 0 ? '#4ca777' : '#e15241' }}>
              {' '}{(fromToken.priceChanges?.['day1'] || 0) > 0 ? 'grown' : 'shrunk'} by {Math.abs(fromToken.priceChanges?.['day1'] || 0).toFixed(2)}%
            </span> in the last 24 hours.
          </S.MarketStatusText>
        </S.MarketStatusSection>

        <S.MarketStatsGrid>
          <S.MarketItemContainer>
            <S.MarketItemValue>{formatCurrency(Number(fromToken.marketCap) || 0)}</S.MarketItemValue>
            <S.MarketItemSubtitle>MARKET CAP</S.MarketItemSubtitle>
          </S.MarketItemContainer>

          <S.MarketItemContainer>
            <S.MarketItemValue>{formatCurrency(Number(fromToken.volume24h) || 0)}</S.MarketItemValue>
            <S.MarketItemSubtitle>VOLUME (24H)</S.MarketItemSubtitle>
          </S.MarketItemContainer>

          <S.MarketItemContainer>
            <S.MarketItemValue>{formatSupply(Number(fromToken.circulatingSupply) || 0, getSymbol(fromToken))}</S.MarketItemValue>
            <S.MarketItemSubtitle>CIRCULATING SUPPLY</S.MarketItemSubtitle>
          </S.MarketItemContainer>
        </S.MarketStatsGrid>

        <S.SeeMoreButton
          onClick={() => {
            window.open('https://droomdroom.com/price', '_blank');
          }}
        >
          See more stats
          <span style={{ marginLeft: '8px', fontSize: '1.1rem' }}>→</span>
        </S.SeeMoreButton>
      </div>
      }

      {toToken.isCrypto && !(toToken.name.includes('USD') && toToken.price > 0.8 && toToken.price < 1.2) && <div key={toToken.id || 0}>
        <S.MarketStatusSection>
          <S.MarketStatusTitle>
            {toToken.name} is <span style={{ color: getTokenStatus(toToken) === 'climbing' ? '#4ca777' : '#e15241' }}>{getTokenStatus(toToken)}</span> this week
          </S.MarketStatusTitle>

          <S.MarketStatusText>
            The current {toToken.ticker} to {fromToken.ticker} conversion rate is <strong>{formatPrice(toFromRate, fromToken)}</strong>.
            The current {toToken.ticker} to {fromToken.ticker} conversion rate is <strong>{formatPrice(toFromRate, fromToken)}</strong>.
            Inversely, this means that if you convert 1 {toToken.ticker} you will get {formatPrice(toFromRate, fromToken)} {fromToken.ticker}.
            <br />
            The conversion rate of {toToken.ticker}/{fromToken.ticker} has
            <span style={{ color: (toToken.priceChanges?.['hour1'] || 0) > 0 ? '#4ca777' : '#e15241' }}>
              {' '}{(toToken.priceChanges?.['hour1'] || 0) > 0 ? 'increased' : 'decreased'} by {Math.abs(toToken.priceChanges?.['hour1'] || 0).toFixed(2)}%
            </span> in the last hour and
            <span style={{ color: (toToken.priceChanges?.['day1'] || 0) > 0 ? '#4ca777' : '#e15241' }}>
              {' '}{(toToken.priceChanges?.['day1'] || 0) > 0 ? 'grown' : 'shrunk'} by {Math.abs(toToken.priceChanges?.['day1'] || 0).toFixed(getDecimalPlaces(toToken))}%
            </span> in the last 24 hours.
          </S.MarketStatusText>
        </S.MarketStatusSection>

        <S.MarketStatsGrid>
          <S.MarketItemContainer>
            <S.MarketItemValue>{formatCurrency(Number(toToken.marketCap) || 0)}</S.MarketItemValue>
            <S.MarketItemSubtitle>MARKET CAP</S.MarketItemSubtitle>
          </S.MarketItemContainer>

          <S.MarketItemContainer>
            <S.MarketItemValue>{formatCurrency(Number(toToken.volume24h) || 0)}</S.MarketItemValue>
            <S.MarketItemSubtitle>VOLUME (24H)</S.MarketItemSubtitle>
          </S.MarketItemContainer>

          <S.MarketItemContainer>
            <S.MarketItemValue>{formatSupply(Number(toToken.circulatingSupply) || 0, getSymbol(toToken))}</S.MarketItemValue>
            <S.MarketItemSubtitle>CIRCULATING SUPPLY</S.MarketItemSubtitle>
          </S.MarketItemContainer>
        </S.MarketStatsGrid>

        <S.SeeMoreButton
          onClick={() => {
            window.open('https://droomdroom.com/price', '_blank');
          }}
        >
          See more stats
          <span style={{ marginLeft: '8px', fontSize: '1.1rem' }}>→</span>
        </S.SeeMoreButton>
      </div>}


      <S.FiatTableContainer>
        <FiatTable heading={"Popular crypto to fiat markets"} tokens={tokens ?? []} fiatCurrencies={fiatCurrencies?.slice(0, 10) ?? []} handleCellClick={handleCellClick} />
      </S.FiatTableContainer>



    </S.MarketContainer>
  );
};

export default Market; 
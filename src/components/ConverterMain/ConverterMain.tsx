import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { getApiUrl } from 'utils/config';
import SEO from 'components/SEO/SEO';
import Navbar from 'components/Navbar/Navbar';
import Market from 'src/components/Market/Market';
import About from 'src/components/About/About';
import AboutShimmer from 'src/components/About/AboutShimmer';
import FAQ from 'src/components/FAQ';
import FAQShimmer from 'src/components/FAQ/FAQShimmer';
import Related from 'src/components/Related';
import RelatedShimmer from 'src/components/Related/RelatedShimmer';
import ConversionTables from 'src/components/ConversionTables';
import ConversionTablesShimmer from 'src/components/ConversionTables/ConversionTablesShimmer';
import SimilarCrypto from 'src/components/SimilarCrypto/SimilarCrypto';
import SimilarCryptoShimmer from 'src/components/SimilarCrypto/SimilarCryptoShimmer';
import { useCurrency, CURRENCIES } from 'src/context/CurrencyContext';
import { useRouter } from 'next/router';
import ConverterCard from 'src/components/ConverterCard/ConverterCard';
import ConverterCardShimmer from 'src/components/ConverterCard/ConverterCardShimmer';
import NavbarShimmer from 'src/components/Navbar/NavbarShimmer';
import MarketShimmer from 'src/components/Market/MarketShimmer';
import Explore from 'src/components/Explore/Explore';
import { ConverterContainer, HomepageCenter } from './ConverterMain.styled';
import { Token } from "src/types";
import { calculateConversionRate } from 'utils/rates';

interface ConverterProps {
  tokens: Token[];
  initialFromSlug: string | null;
  initialToSlug: string | null;
  initialFromToken: Token | null;
  initialToToken: Token | null;
  structuredData: any | null;
  title: string | null;
  description: string | null;
  ogImage: string | null;
  isHomepage: boolean | null;
  notFound: boolean | null;
  error: boolean | null;
}

const ConverterMain: React.FC<ConverterProps> = ({ 
  tokens, 
  initialFromSlug, 
  initialToSlug,
  initialFromToken,
  initialToToken,
  structuredData, 
  title, 
  description, 
  ogImage, 
  isHomepage = false ,
  notFound,
  error, 
}) => {
  const router = useRouter();
  const [fromToken, setFromToken] = useState<Token | null>(initialFromToken);
  const [toToken, setToToken] = useState<Token | null>(initialToToken);
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmount, setToAmount] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('');
  const sections = useRef<{ [key: string]: HTMLElement }>({});
  const sectionIds = ['markets', 'about', 'faq', 'related', 'conversion-tables', 'more'];
  const navRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isUpdatingUrl = useRef(false);
  const lastUrlUpdate = useRef('');

  const { fiatCurrencies, rates, currency, setCurrency } = useCurrency();

  useEffect(() => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    setHeaderHeight(headerPlaceholder?.offsetHeight || 0);
  }, []);

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      if (isHomepage && initialFromSlug === null && initialToSlug === null) {
        return;
      }

      const fromTokenFound = tokens.find((t) => t.slug === initialFromSlug);
      const toTokenFound = tokens.find((t) => t.slug === initialToSlug);

      if (fromTokenFound) {
        setFromToken(fromTokenFound);
      } else if (initialFromSlug) {
        const fiatCurrency = fiatCurrencies.find(
          (currency: any) => currency.slug === initialFromSlug,
        );
        setFromToken(fiatCurrency);
      } else if (!isHomepage) {
        const btcToken = tokens.find((t) => t.ticker === 'BTC') || tokens[0];
        setFromToken(btcToken);
      }

      if (toTokenFound) {
        setToToken(toTokenFound);
      } else if (initialToSlug) {
        const fiatCurrency = fiatCurrencies.find(
          (currency: any) => currency.slug === initialToSlug,
        );
        setToToken(fiatCurrency);
      } else if (!isHomepage) {
        const usdtToken = tokens.find((t) => t.ticker === 'USDT') || tokens[1] || tokens[0];
        setToToken(usdtToken);
      }
    }
  }, [tokens, initialFromSlug, initialToSlug, fiatCurrencies, isHomepage]);

  useEffect(() => {
    if (router.isReady && tokens.length > 0 && !isUpdatingUrl.current) {
      const { asPath } = router;
      if (!asPath || asPath === '/' || !asPath.includes('/')) return;

      if (lastUrlUpdate.current === asPath) {
        return;
      }

      const [fromSlug, toSlug] = asPath.split('/').filter(Boolean);

      if (!fromSlug || !toSlug) return;

      const fromTicker = fromSlug.split('-').pop()?.toUpperCase();
      const toTicker = toSlug.split('-').pop()?.toUpperCase();

      if (!fromTicker || !toTicker) return;

      const fromTokenMatch = tokens.find((t) => t.ticker.toUpperCase() === fromTicker);
      const toTokenMatch = tokens.find((t) => t.ticker.toUpperCase() === toTicker);

      const shouldUpdateFrom = fromTokenMatch &&
        (!fromToken || fromTokenMatch.ticker !== fromToken.ticker);

      const shouldUpdateTo = toTokenMatch &&
        (!toToken || toTokenMatch.ticker !== toToken.ticker);

      if (shouldUpdateFrom) {
        setFromToken(fromTokenMatch);
      } else if (!fromTokenMatch && fromTicker) {
        const fiatMatch = fiatCurrencies.find(
          (currency: any) => currency.ticker === fromTicker,
        );
        if (fiatMatch && (!fromToken || fiatMatch.ticker !== fromToken.ticker)) {
          setFromToken(fiatMatch);
        }
      }

      if (shouldUpdateTo) {
        setToToken(toTokenMatch);
      } else if (!toTokenMatch && toTicker) {
        const fiatMatch = fiatCurrencies.find(
          (currency: any) => currency.ticker === toTicker,
        );
        if (fiatMatch && (!toToken || fiatMatch.ticker !== toToken.ticker)) {
          setToToken(fiatMatch);
        }
      }
    }
  }, [router.isReady, router.asPath, tokens, fromToken, toToken, fiatCurrencies]);

  useEffect(() => {
    sections.current = {
      converter: document.getElementById('converter') as HTMLElement,
      markets: document.getElementById('markets') as HTMLElement,
      about: document.getElementById('about') as HTMLElement,
      faq: document.getElementById('faq') as HTMLElement,
      related: document.getElementById('related') as HTMLElement,
      'conversion-tables': document.getElementById('conversion-tables') as HTMLElement,
      more: document.getElementById('more') as HTMLElement,
    };

    const handleScroll = () => {
      const headerPlaceholder = document.getElementById('header-placeholder');
      const headerHeight = headerPlaceholder ? headerPlaceholder.offsetHeight : 0;
      const navbarHeight = navRef.current ? navRef.current.offsetHeight : 0;

      const scrollPosition = window.scrollY + headerHeight + navbarHeight + 50;

      const currentSection = sectionIds.find((id) => {
        const section = document.getElementById(id);
        if (!section) return false;
        const { offsetTop, offsetHeight } = section;
        return scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight;
      }) || 'converter';

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sectionIds.includes(hash)) {
      setActiveSection(hash);
    }
  }, []);


  const getDecimalPlaces = useCallback((token: Token, value: number, otherToken?: Token): number => {
    const baseDecimals = token.isCrypto
      ? token.ticker === 'USDT' || token.ticker === 'USDC' || token.ticker === 'DAI' || token.ticker === 'BUSD'
        ? 2
        : 8
      : 2;

    if (otherToken && token.price && otherToken.price) {
      const percentDiff = Math.abs(token.price - otherToken.price) / ((token.price + otherToken.price) / 2) * 100;

      if (percentDiff < 0.1) {
        return 2;
      }

      const priceRatio = token.price / otherToken.price;
      if (priceRatio >= 0.8 && priceRatio <= 1.2) {
        return 2;
      }
    }

    if (value === 0) return baseDecimals;

    if (value > 0 && value < 0.00001) return 8;

    if (value > 0 && value < 0.01) return 6;

    if (value >= 0.01 && value < 1) return baseDecimals;

    if (value >= 1 && value < 1000) return Math.min(baseDecimals, 4);

    return 2;
  }, []);

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      const amount = parseFloat(fromAmount);
      if (!isNaN(amount)) {
        const rate = calculateConversionRate(fromToken, toToken  , rates);
        if (rate === 0) {
          if (toAmount !== 'Price unavailable') {
            setToAmount('Price unavailable');
          }
        } else {
          const convertedAmount = amount * rate;
          const formattedAmount = convertedAmount.toFixed(getDecimalPlaces(toToken, convertedAmount, fromToken));

          if (toAmount !== formattedAmount) {
            setToAmount(formattedAmount);
          }
        }
      } else {
        if (toAmount !== '0') {
          setToAmount('0');
        }
      }
    }
  }, [fromToken, toToken, fromAmount]);

  const generateAdvancedOptions = useCallback(() => {
    const from = tokens.find((t) => t.ticker === fromToken?.ticker);
    const to = tokens.find((t) => t.ticker === toToken?.ticker);

    const topCryptos = tokens
      .filter((t) => !['USDT', 'USDC', 'DAI', 'BUSD'].includes(t.ticker))
      .sort((a, b) => (b.marketCap) - (a.marketCap))
      .slice(0, 10);

    const options = [];

    if (from) {
      topCryptos.forEach((crypto, index) => {
        options.push({
          id: `advanced-${index}`,
          name: `${crypto.name} to Tether`,
          fromToken: crypto.name,
          toToken: 'Tether',
          fromTicker: crypto.ticker,
          toTicker: 'USDT',
          logo: crypto.logo,
        });
      });
    }

    if (to) {
      topCryptos.slice(0, 3).forEach((crypto, index) => {
        options.push({
          id: `advanced-usdc-${index}`,
          name: `${crypto.name} to USDC`,
          fromToken: crypto.name,
          toToken: 'USDC',
          fromTicker: crypto.ticker,
          toTicker: 'USDC',
          logo: crypto.logo,
        });
      });
    }

    for (let i = 0; i < Math.min(4, topCryptos.length - 1); i++) {
      const fromCrypto = topCryptos[i];
      const toCrypto = topCryptos[i + 1];

      options.push({
        id: `advanced-cross-${i}`,
        name: `${fromCrypto.name} to ${toCrypto.name}`,
        fromToken: fromCrypto.name,
        toToken: toCrypto.name,
        fromTicker: fromCrypto.ticker,
        toTicker: toCrypto.ticker,
        logo: fromCrypto.logo,
      });
    }

    return options.slice(0, 12);
  }, [tokens, fromToken, toToken]);

  const generateCurrencyOptions = useCallback(() => {
    const fiatCurrencies = Object.values(CURRENCIES);

    const diverseCryptos = tokens
      .filter((t, index) => index % 10 === 0)
      .slice(0, 8);

    return diverseCryptos.map((crypto, index) => ({
      id: `currency-${index}`,
      name: `${crypto.name} to ${fiatCurrencies[index].name}`,
      fromToken: crypto.name,
      toToken: fiatCurrencies[index].name,
      fromTicker: crypto.ticker,
      toTicker: fiatCurrencies[index].code,
      logo: crypto.logo,
    }));
  }, [tokens]);

  const advancedOptions = useMemo(() => generateAdvancedOptions(), [generateAdvancedOptions]);
  const currencyOptions = useMemo(() => generateCurrencyOptions(), [generateCurrencyOptions]);

  useEffect(() => {
    if (notFound && router && typeof window !== 'undefined') {
      const fetchTokens = async () => {
        try {
          const response = await axios.get(getApiUrl(`/coins`), {
            params: {
              page: 1,
              pageSize: 200,
            },
          });

          const fetchedTokens = response.data.tokens.map((token: any) => ({
            id: token.id || '',
            ticker: token.ticker || '',
            name: token.name || '',
            price: token.price || 0,
            cmcId: token.cmcId || '',
            rank: token.rank || 0,
            iconUrl: token.cmcId ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.cmcId}.png` : '',
            status: token.status || 'stable',
            priceChange: token.priceChange || { hour1: 0, day1: 0, week1: 0 },
            marketCap: token.marketCap || 0,
            volume24h: token.volume24h || 0,
            circulatingSupply: token.circulatingSupply || 0,
            lastUpdated: token.lastUpdated || new Date().toISOString(),
            isCrypto: !fiatCurrencies.includes(token.ticker),
          }));

          const fromToken = fetchedTokens.find((t: any) => t.slug.toLowerCase() === initialFromSlug);
          const toToken = fetchedTokens.find((t: any) => t.slug.tLowerCase() === initialToSlug);

          if (fromToken && toToken) {
            setFromToken(fromToken);
            setToToken(toToken);
          } else {
            if (!fromToken) {
              const fiatCurrency = fiatCurrencies.find(
                (currency: any) => currency.slug === initialFromSlug,
              );
              setFromToken(fiatCurrency);
            }

            if (!toToken) {
              const fiatCurrency = fiatCurrencies.find(
                (currency: any) => currency.slug === initialToSlug,
              );
              setToToken(fiatCurrency);
            }
          }
        } catch (error) {
          console.error('Error fetching tokens:', error);
        }
      };

      fetchTokens();
    }
  }, [notFound, router, initialFromSlug, initialToSlug]);

  useEffect(() => {
    if (fromToken && toToken && router && router.isReady) {
      const fiatTickers = fiatCurrencies.map((currency: any) => currency.ticker);

      let fromSlug = '';
      let toSlug = '';

      if (fiatTickers.includes(fromToken.ticker)) {
        fromSlug = `${fromToken.name.toLowerCase().replace(/\s+/g, '-')}-${fromToken.ticker.toLowerCase()}`;
      } else {
        fromSlug = `${fromToken.name.toLowerCase().replace(/\s+/g, '-')}-${fromToken.ticker.toLowerCase()}`;
      }

      if (fiatTickers.includes(toToken.ticker)) {
        toSlug = `${toToken.name.toLowerCase().replace(/\s+/g, '-')}-${toToken.ticker.toLowerCase()}`;
      } else {
        toSlug = `${toToken.name.toLowerCase().replace(/\s+/g, '-')}-${toToken.ticker.toLowerCase()}`;
      }

      const newPath = `/${fromSlug}/${toSlug}`;
      const currentPath = router.asPath;

      if (currentPath === newPath || lastUrlUpdate.current === newPath) {
        return;
      }

      if (isHomepage) {
        if (!isAnimating) {
          setIsAnimating(true);
          isUpdatingUrl.current = true;
          lastUrlUpdate.current = newPath;
          setTimeout(() => {
            router.push(newPath).finally(() => {
              isUpdatingUrl.current = false;
            });
          }, 1100); 
        }
      } else {
        isUpdatingUrl.current = true;
        lastUrlUpdate.current = newPath;
        router.replace(newPath, undefined, { shallow: true }).finally(() => {
          setTimeout(() => {
            isUpdatingUrl.current = false;
          }, 100);
        });
      }
    }
  }, [fromToken, toToken, isHomepage, router, isAnimating, fiatCurrencies]);

  const handleExploreCardClick = useCallback((fromToken: Token, toToken: Token) => {
    if (isHomepage && !isAnimating) {
      // Set the tokens first
      setFromToken(fromToken);
      setToToken(toToken);
      
      // Trigger the same animation as converter
      setIsAnimating(true);
      
      // Navigate after animation
      const fiatTickers = fiatCurrencies.map((currency: any) => currency.ticker);
      
      let fromSlug = '';
      let toSlug = '';

      if (fiatTickers.includes(fromToken.ticker)) {
        fromSlug = `${fromToken.name.toLowerCase().replace(/\s+/g, '-')}-${fromToken.ticker.toLowerCase()}`;
      } else {
        fromSlug = `${fromToken.name.toLowerCase().replace(/\s+/g, '-')}-${fromToken.ticker.toLowerCase()}`;
      }

      if (fiatTickers.includes(toToken.ticker)) {
        toSlug = `${toToken.name.toLowerCase().replace(/\s+/g, '-')}-${toToken.ticker.toLowerCase()}`;
      } else {
        toSlug = `${toToken.name.toLowerCase().replace(/\s+/g, '-')}-${toToken.ticker.toLowerCase()}`;
      }

      const newPath = `/${fromSlug}/${toSlug}`;
      
      setTimeout(() => {
        router.push(newPath);
      }, 1100);
    }
  }, [isHomepage, isAnimating, setFromToken, setToToken, fiatCurrencies, router]);

  useEffect(() => {
    const fetchPlaceholderPrices = async () => {
      if (!fromToken || !toToken) return;


      try {
        const fiatTickers = fiatCurrencies.map((currency: any) => currency.ticker);

        if (fiatTickers.includes(fromToken.slug)) {
          setFromToken(prev => ({
            ...prev!,
            price: 1,
            lastUpdated: new Date().toISOString(),
          }));
        }

        if (fiatTickers.includes(toToken.slug)) {
          setToToken(prev => ({
            ...prev!,
            price: 1,
            lastUpdated: new Date().toISOString(),
          }));
        }

        if (!fiatTickers.includes(fromToken.slug)) {
          try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${fromToken.ticker.toLowerCase()}&vs_currencies=usd`);
            const price = response.data[fromToken.ticker.toLowerCase()]?.usd;

            if (price) {
              setFromToken(prev => ({
                ...prev!,
                price,
                lastUpdated: new Date().toISOString(),
              }));
            }
          } catch (error) {
            console.error(`[Converter Main-1]Error fetching price for ${fromToken.ticker}:`, error);
          }
        }

        if (!fiatTickers.includes(toToken.slug)) {
          try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${toToken.ticker.toLowerCase()}&vs_currencies=usd`);
            const price = response.data[toToken.ticker.toLowerCase()]?.usd;

            if (price) {
              setToToken(prev => ({
                ...prev!,
                price,
                lastUpdated: new Date().toISOString(),
              }));
            }
          } catch (error) {
            console.error(`[Converter Main-2]Error fetching price for ${toToken.ticker}:`, error);
          }
        }
      } catch (error) {
        console.error('Error fetching placeholder prices:', error);
      }
    };

    fetchPlaceholderPrices();
  }, [fromToken, toToken]);


  return (
    <ConverterContainer>
      <SEO
        title={isHomepage ? `Crypto Converter Tool | Real-Time Cryptocurrency Exchange Rate Calculator` : (title || `Convert ${fromToken?.name || 'Bitcoin'} to ${toToken?.name || 'Tether'} | DroomDroom`)}
        description={isHomepage ? `Convert crypto prices instantly with our free converter and calculator tool. Get real-time exchange rates and calculate values online between any digital assets or currencies.` : (description || `Convert between cryptocurrencies like ${fromToken?.name || 'Bitcoin'} and stablecoins like ${toToken?.name || 'Tether'} with real-time exchange rates.`)}
        keywords={`cryptocurrency converter, ${fromToken?.ticker || 'BTC'} to ${toToken?.ticker || 'USDT'}, cryptocurrency calculator, crypto exchange rates`}
        ogType="website"
        ogImage={ogImage!}
        structuredData={structuredData || {
          "@context": "https://schema.org",
          "@type": "FinancialProduct",
          "name": `${fromToken?.name || 'Cryptocurrency'} to ${toToken?.name || 'Cryptocurrency'} Converter`,
          "description": `Convert ${fromToken?.name || 'cryptocurrencies'} (${fromToken?.ticker || ''}) to ${toToken?.name || 'cryptocurrencies'} (${toToken?.ticker || ''}) with real-time exchange rates and market data. Live price calculator with up-to-date conversion rates.`,
          "category": "CurrencyExchange",
          "image": ogImage,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "fromCurrency",
              "value": fromToken?.ticker || ""
            },
            {
              "@type": "PropertyValue",
              "name": "toCurrency",
              "value": toToken?.ticker || ""
            },
            {
              "@type": "PropertyValue",
              "name": "conversionRate",
              "value": fromToken && toToken ? calculateConversionRate(fromToken, toToken , rates) : ""
            }
          ],
          "provider": {
            "@type": "Organization",
            "name": "DroomDroom",
            "url": "https://droomdroom.com"
          }
        }}
      />

      {(!fromToken || !toToken) && !isHomepage ? (
        <ConverterCardShimmer />
      ) : isHomepage ? (
        <HomepageCenter className={isAnimating ? 'animating' : ''}>
          <div className="converter-anim">
            <ConverterCard
              id="converter"
              tokens={tokens}
              fromToken={fromToken}
              toToken={toToken}
              setFromToken={setFromToken}
              setToToken={setToToken}
              fromAmount={fromAmount}
              toAmount={toAmount}
              setFromAmount={setFromAmount}
              setToAmount={setToAmount}
              isNavSticky={isNavSticky}
              setIsNavSticky={setIsNavSticky}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>
          {isAnimating && (
            <div className="shimmers">
              <NavbarShimmer />
              <MarketShimmer />
              <AboutShimmer />
              <FAQShimmer />
              <RelatedShimmer />
              <div id="conversion-tables">
                <ConversionTablesShimmer />
              </div>
              <div id="more">
                <SimilarCryptoShimmer />
              </div>
            </div>
          )}
        </HomepageCenter>
      ) : (
        <ConverterCard
          id="converter"
          tokens={tokens}
          fromToken={fromToken}
          toToken={toToken}
          setFromToken={setFromToken}
          setToToken={setToToken}
          fromAmount={fromAmount}
          toAmount={toAmount}
          setFromAmount={setFromAmount}
          setToAmount={setToAmount}
          isNavSticky={isNavSticky}
          setIsNavSticky={setIsNavSticky}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}

      {/* Hide all sections on homepage - only show converter */}
      {!isHomepage && (
        <>
          {(!fromToken || !toToken) ? (
            <NavbarShimmer />
          ) : (
            <Navbar headerHeight={headerHeight} fromToken={fromToken} toToken={toToken} activeTab={activeSection} setActiveTab={setActiveSection} isNavSticky={isNavSticky} setIsNavSticky={setIsNavSticky}   />
          )}

          {(!fromToken || !toToken) || !tokens || !fiatCurrencies ? (
            <MarketShimmer />
          ) : (
            <Market id="markets" fromToken={fromToken} toToken={toToken} tokens={tokens} fiatCurrencies={fiatCurrencies} />
          )}

          {(!fromToken || !toToken) ? (
            <AboutShimmer />
          ) : (
            <About id="about" fromToken={fromToken} toToken={toToken} />
          )}

          {(!fromToken || !toToken) ? (
            <FAQShimmer />
          ) : (
            <FAQ id="faq" tokens={tokens ?? []} fromToken={fromToken} toToken={toToken} />
          )}

          {(!fromToken || !toToken) || !tokens || !fiatCurrencies ? (
            <RelatedShimmer />
          ) : (
            <Related
              id="related"
              fromToken={fromToken}
              toToken={toToken}
              tokens={tokens}
              setFromToken={setFromToken}
              setToToken={setToToken}
              fiatCurrencies={fiatCurrencies}
            />
          )}

          {(!fromToken || !toToken) ? (
            <div id="conversion-tables">
              <ConversionTablesShimmer />
            </div>
          ) : (
            <div id="conversion-tables">
              <ConversionTables
                id="conversion"
                fromToken={fromToken}
                toToken={toToken}
                fromAmount={fromAmount}
                toAmount={toAmount}
              />
            </div>
          )}
          {(!fromToken && !isHomepage) || !tokens ? (
            <div id="more">
              <SimilarCryptoShimmer />
            </div>
          ) : (
            <div id="more">
              <SimilarCrypto coin={fromToken} tokens={tokens} />
            </div>
          )}
        </>
      )}

      {/* Show Explore section below converter on homepage, but hide when both tokens selected */}
      {isHomepage && (!fromToken || !toToken) && (
        <Explore 
          tokens={tokens}
          onCardClick={handleExploreCardClick}
        />
      )}

      {/* <MoreConversions
        id="more"
        advancedOptions={advancedOptions}
        currencyOptions={currencyOptions}
        allTokens={[...tokens, ...fiatCurrencies]}
        setFromToken={setFromToken}
        setToToken={setToToken}
      /> */}
    </ConverterContainer>
  );
};

export default ConverterMain;
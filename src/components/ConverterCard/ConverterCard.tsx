import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeftRight,
  Loader,
  Share2,
} from "lucide-react";
import {
  ConversionHeader,
  TitleWrapper,
  IconsWrapper,
  CryptoIcon,
  Title,
  ExchangeRate,
  ConversionForm,
  InputRow,
  InputWrapper,
  Input,
  SelectButton,
  SwapIconWrapper,
  SwapButton,
  BuyButtonWrapper,
  BuyButton,
  ShareButton,
  LastUpdated,
  RefreshButton,
  TokenName,
  TokenText,
  SelectArrow,
  SearchWrapper,
  ConverterContainer,
} from "./ConverterCard.styled";
import SearchCoin from "src/components/SearchCoin/SearchCoin";
import { useCurrency } from "src/context/CurrencyContext";
import { formatDate } from "date-fns";
import { config } from "src/utils/config";
import router from "next/router";
import { extractDominantColor } from "src/utils/imageUtils";
import { Token } from "src/types";
import { calculateConversionRate } from "utils/rates";

interface ConverterCardProps {
  id: string;
  tokens: Token[];
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setFromToken: (token: Token) => void;
  setToToken: (token: Token) => void;
  isNavSticky: boolean;
  setIsNavSticky: (isSticky: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ConverterCard: React.FC<ConverterCardProps> = ({
  id,
  tokens,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  setFromAmount,
  setToAmount,
  setFromToken,
  setToToken,
  isNavSticky,
  setIsNavSticky,
  activeSection,
  setActiveSection,
}) => {
  const [showFromSearch, setShowFromSearch] = useState<boolean>(false);
  const [showToSearch, setShowToSearch] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [fromTokenColor, setFromTokenColor] = useState<string | undefined>(
    undefined
  );
  const [toTokenColor, setToTokenColor] = useState<string | undefined>(
    undefined
  );

  const fromButtonRef = useRef<HTMLButtonElement>(null);
  const toButtonRef = useRef<HTMLButtonElement>(null);

  const { fiatCurrencies, rates } = useCurrency();

  const getFromTokenImageColor = async (token: Token) => {
    try {
      setFromTokenColor(undefined);
      const imageUrl = token.isCrypto
        ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.cmcId}.png`
        : `https://flagcdn.com/w80/${
            token.ticker?.toLowerCase()?.slice(0, 2) || "us"
          }.png`;

      const color = await extractDominantColor(imageUrl);
      setFromTokenColor(color || "#6188ff");
    } catch (error) {
      console.error("Error extracting from token color:", error);
      setFromTokenColor("#6188ff");
    }
  };

  const getToTokenImageColor = async (token: Token) => {
    try {
      setToTokenColor(undefined);

      let imageUrl;
      if (token.isCrypto && token.cmcId) {
        imageUrl = `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.cmcId}.png`;
      } else if (token.ticker) {
        imageUrl = `https://flagcdn.com/w80/${token.ticker
          .toLowerCase()
          .slice(0, 2)}.png`;
      } else {
        imageUrl = "https://flagcdn.com/w80/us.png";
      }

      console.log("Using image URL:", imageUrl);

      const color = await extractDominantColor(imageUrl);
      console.log("Extracted color:", color);
      setToTokenColor(color || "#6188ff");
    } catch (error) {
      console.error("Error extracting to token color:", error);
      setToTokenColor("#6188ff");
    }
  };

  const getDecimalPlaces = useCallback(
    (token: Token, value: number, otherToken?: Token): number => {
      const baseDecimals = token.isCrypto
        ? token.ticker === "USDT" ||
          token.ticker === "USDC" ||
          token.ticker === "DAI" ||
          token.ticker === "BUSD"
          ? 2
          : 8
        : 2;

      if (otherToken && token.price && otherToken.price) {
        const percentDiff =
          (Math.abs(token.price - otherToken.price) /
            ((token.price + otherToken.price) / 2)) *
          100;

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
    },
    []
  );

  const formatAmount = useCallback(
    (value: number, token: Token, otherToken?: Token): string => {
      if (isNaN(value)) return "0";

      const decimals = getDecimalPlaces(token, value, otherToken);

      const multiplier = Math.pow(10, decimals);
      const roundedValue = Math.round(value * multiplier) / multiplier;

      return (
        roundedValue
          .toFixed(decimals)
          .replace(/\.?0+$/, "")
          .replace(/\.$/, "") || "0"
      );
    },
    [getDecimalPlaces]
  );

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);

    if (!fromToken || !toToken) {
      setToAmount("0");
      return;
    }

    const rate = calculateConversionRate(fromToken, toToken, rates);
    if (rate === 0 || rate === Infinity) {
      setToAmount("Price unavailable");
    } else {
      const convertedAmount = parseFloat(value) * rate;
      setToAmount(formatAmount(convertedAmount, toToken, fromToken));
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAmount(value);

    if (!fromToken || !toToken) {
      setFromAmount("0");
      return;
    }

    const rate = calculateConversionRate(fromToken, toToken, rates);
    if (rate === 0 || rate === Infinity) {
      setFromAmount("Price unavailable");
    } else {
      const convertedAmount = parseFloat(value) / rate;
      setFromAmount(formatAmount(convertedAmount, fromToken, toToken));
    }
  };

  const handleSwapTokens = useCallback(() => {
    if (!fromToken || !toToken) return;

    const tempToken = fromToken;
    const tempAmount = fromAmount;

    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  }, [
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    setFromToken,
    setToToken,
    setFromAmount,
    setToAmount,
  ]);

  const toggleFromSearch = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (showToSearch) {
        setShowToSearch(false);
      }
      setShowFromSearch(!showFromSearch);
    },
    [showToSearch, showFromSearch]
  );

  const toggleToSearch = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (showFromSearch) {
        setShowFromSearch(false);
      }
      setShowToSearch(!showToSearch);
    },
    [showFromSearch, showToSearch]
  );

  useEffect(() => {
    if (fromToken) {
      getFromTokenImageColor(fromToken);
    }
  }, [fromToken]);

  useEffect(() => {
    if (toToken) {
      getToTokenImageColor(toToken);
    }
  }, [toToken]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (fromButtonRef.current &&
          !fromButtonRef.current.contains(event.target as Node)) ||
        (toButtonRef.current &&
          !toButtonRef.current.contains(event.target as Node))
      ) {
        setShowFromSearch(false);
        setShowToSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchCoinPrice = async (token: Token | null) => {
    if (!token || !token.cmcId) {
      console.warn("Invalid token or missing cmcId:", token);
      return null;
    }

    try {
      const basePath = config.basePath || "";
      const url = `${basePath}/api/coin/price/${token.cmcId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch price");
      }

      const data = await response.json();

      if (
        !data ||
        typeof data.price !== "number" ||
        isNaN(data.price) ||
        data.price <= 0
      ) {
        console.warn("Invalid price data received:", data);
        return null;
      }

      return data;
    } catch (error) {
      console.error(
        `[Converter Card]Error fetching price for ${token.ticker}:`,
        error
      );
      return null;
    }
  };

  const handleRefresh = useCallback(async () => {
    if (isRefreshing || !fromToken || !toToken) return;
    setIsRefreshing(true);

    try {
      const [fromPrice, toPrice] = await Promise.all([
        fetchCoinPrice(fromToken),
        fetchCoinPrice(toToken),
      ]);

      if (!fromPrice?.price || !toPrice?.price) {
        console.warn("Failed to fetch valid price data");
        setIsRefreshing(false);
        return;
      }

      const fromPriceChanged = fromPrice.price !== fromToken.price;
      const toPriceChanged = toPrice.price !== toToken.price;

      if (fromPriceChanged || toPriceChanged) {
        const updatedFromToken: Token = {
          ...fromToken,
          price: fromPrice.price,
          priceChanges: {
            hour1: 0,
            day1: fromPrice.price_change_24h || 0,
            week1: 0,
          },
          lastUpdated: new Date().toISOString(),
        };

        const updatedToToken: Token = {
          ...toToken,
          price: toPrice.price,
          priceChanges: {
            hour1: 0,
            day1: toPrice.price_change_24h || 0,
            week1: 0,
          },
          lastUpdated: new Date().toISOString(),
        };

        if (fromPriceChanged) {
          setFromToken(updatedFromToken);
        }

        if (toPriceChanged) {
          setToToken(updatedToToken);
        }

        const amount = parseFloat(fromAmount);
        if (!isNaN(amount)) {
          const rate = calculateConversionRate(
            fromPriceChanged ? updatedFromToken : fromToken,
            toPriceChanged ? updatedToToken : toToken,
            rates
          );

          if (rate === 0) {
            setToAmount("Price unavailable");
          } else {
            const convertedAmount = amount * rate;
            const updatedFrom = fromPriceChanged ? updatedFromToken : fromToken;
            const updatedTo = toPriceChanged ? updatedToToken : toToken;
            setToAmount(formatAmount(convertedAmount, updatedTo, updatedFrom));
          }
        }
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [
    isRefreshing,
    fromToken,
    toToken,
    fromAmount,
    calculateConversionRate,
    formatAmount,
  ]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  }, []);

  const handleCoinClick = useCallback(
    (coin: any, side: "from" | "to") => {
      const getTokenSlug = (token: any) => {
        const fiatTickers = fiatCurrencies.map(
          (currency: any) => currency.ticker
        );

        if (fiatTickers.includes(token.ticker)) {
          const fiatName =
            token.name ||
            fiatCurrencies.find(
              (currency: any) => currency.ticker === token.ticker
            )?.name ||
            token.ticker;
          return `${fiatName
            .toLowerCase()
            .replace(/\s+/g, "-")}-${token.ticker.toLowerCase()}`;
        } else {
          return `${token.name
            .toLowerCase()
            .replace(/\s+/g, "-")}-${token.ticker.toLowerCase()}`;
        }
      };

      if (side === "from") {
        if (toToken && router && typeof window !== "undefined") {
          const fromSlug = getTokenSlug(coin);
          const toSlug = getTokenSlug(toToken);

          const newPath = `/${fromSlug}/${toSlug}`;

          router.push(newPath, undefined, { shallow: true });
        } else {
          console.log(
            "Could not update URL - missing toToken, router, or window"
          );
        }
      } else {
        if (fromToken && router && typeof window !== "undefined") {
          const fromSlug = getTokenSlug(fromToken);
          const toSlug = getTokenSlug(coin);
          const newPath = `/${fromSlug}/${toSlug}`;
          router.push(newPath, undefined, { shallow: true });
        } else {
          console.log(
            "Could not update URL - missing fromToken, router, or window"
          );
        }
      }
    },
    [fromToken, toToken, router, fiatCurrencies]
  );

  console.log("From token:", fromToken);
  console.log("To token:", toToken);

  return (
    <ConverterContainer
      id={id}
      isNavSticky={isNavSticky}
      activeSection={activeSection}
    >
      <ConversionHeader>
        <TitleWrapper>
          {(fromToken || toToken) && (
            <IconsWrapper>
              {fromToken &&
                (fromToken.isCrypto ? (
                  <CryptoIcon
                    key={`crypto-from-${
                      fromToken.id || fromToken.cmcId || fromToken.ticker
                    }`}
                    src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${fromToken.cmcId}.png`}
                    alt={fromToken.ticker}
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${
                        fromToken.ticker || "BTC"
                      }&background=random`;
                    }}
                  />
                ) : (
                  <CryptoIcon
                    key={`fiat-from-${fromToken.id || fromToken.ticker}`}
                    src={`https://flagcdn.com/w80/${fromToken.ticker
                      .toLowerCase()
                      .slice(0, 2)}.png`}
                    alt={fromToken.ticker || "USD"}
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${
                        fromToken.ticker || "USD"
                      }&background=random`;
                    }}
                  />
                ))}
              {toToken &&
                (toToken.isCrypto ? (
                  <CryptoIcon
                    key={`crypto-to-${
                      toToken.id ||
                      toToken.cmcId ||
                      toToken.ticker ||
                      Date.now()
                    }`}
                    src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${toToken.cmcId}.png`}
                    alt={toToken.ticker || "BTC"}
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${
                        toToken.ticker || "BTC"
                      }&background=random`;
                    }}
                  />
                ) : (
                  <CryptoIcon
                    key={`fiat-to-${
                      toToken.id || toToken.ticker || Date.now()
                    }`}
                    src={`https://flagcdn.com/w80/${toToken.ticker
                      .toLowerCase()
                      .slice(0, 2)}.png`}
                    alt={toToken.ticker || "USD"}
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${
                        toToken.ticker || "USD"
                      }&background=random`;
                    }}
                  />
                ))}
            </IconsWrapper>
          )}
          <Title>
            Convert and swap{" "}
            <TokenName ticker={fromToken?.ticker} imageColor={fromTokenColor}>
              {fromToken?.name || "[Select]"}
            </TokenName>{" "}
            to{" "}
            <TokenName ticker={toToken?.ticker} imageColor={toTokenColor}>
              {toToken?.name || "[Select]"}
            </TokenName>
          </Title>
        </TitleWrapper>

        <ExchangeRate>
          {fromToken && toToken ? (
            <>
              {fromToken.ticker}/{toToken.ticker} {fromAmount}{" "}
              {fromToken.ticker} equals {toAmount} {toToken.ticker}
            </>
          ) : (
            "Select any token or currency to view conversion rate"
          )}
        </ExchangeRate>

        {fromToken?.logo && (
          <div style={{ display: "none" }}>
            <img
              src={fromToken.logo}
              alt={fromToken.name}
              width="40"
              height="40"
            />
          </div>
        )}
        {toToken?.logo && (
          <div style={{ display: "none" }}>
            <img src={toToken.logo} alt={toToken.name} width="40" height="40" />
          </div>
        )}

        {fromToken && (
          <BuyButtonWrapper>
            <BuyButton
              onClick={() => {
                window.open(
                  "https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-12RA4q",
                  "_blank"
                );
              }}
            >
              Buy {fromToken.name}
            </BuyButton>
          </BuyButtonWrapper>
        )}
      </ConversionHeader>

      <ConversionForm>
        <InputRow onClick={(e) => e.stopPropagation()}>
          <InputWrapper>
            <Input
              type="number"
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder="1"
              min="0"
              onClick={(e) => e.stopPropagation()}
            />
            <SelectButton
              onClick={toggleFromSearch}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <TokenText>{fromToken?.ticker || "Select"}</TokenText>
              <SelectArrow>
                {showFromSearch ? <ChevronUp /> : <ChevronDown />}
              </SelectArrow>
            </SelectButton>
            {showFromSearch && (
              <SearchWrapper>
                <SearchCoin
                  coins={(tokens ?? []).filter(
                    (t) => !toToken || t.ticker !== toToken.ticker
                  )}
                  fiatCurrencies={(fiatCurrencies ?? []).filter(
                    (fc: any) => !toToken || fc.ticker !== toToken.ticker
                  )}
                  onSelectToken={(token) => {
                    const isFiat =
                      !token.cmcId ||
                      fiatCurrencies.some(
                        (fc: any) => fc.ticker === token.ticker
                      );

                    const completeToken = {
                      ...(token as Token),
                      id: token.id || `temp-${token.ticker}`,
                      ticker: token.ticker || "",
                      isCrypto: !isFiat,
                      _timestamp: Date.now(),
                    };

                    setFromToken(completeToken);
                    setShowFromSearch(false);
                    handleCoinClick(completeToken, "from");
                  }}
                  isVisible={showFromSearch}
                  onClose={() => setShowFromSearch(false)}
                />
              </SearchWrapper>
            )}
          </InputWrapper>

          <SwapIconWrapper>
            <SwapButton onClick={handleSwapTokens}>
              <ArrowLeftRight />
            </SwapButton>
          </SwapIconWrapper>

          <InputWrapper>
            <Input
              type="number"
              value={toAmount}
              onChange={handleToAmountChange}
              placeholder="0"
              min="0"
              onClick={(e) => e.stopPropagation()}
            />
            <SelectButton
              onClick={toggleToSearch}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <TokenText>{toToken?.ticker || "Select"}</TokenText>
              <SelectArrow>
                {showToSearch ? <ChevronUp /> : <ChevronDown />}
              </SelectArrow>
            </SelectButton>
            {showToSearch && (
              <SearchWrapper>
                <SearchCoin
                  coins={(tokens ?? []).filter(
                    (t) => !fromToken || t.ticker !== fromToken.ticker
                  )}
                  fiatCurrencies={(fiatCurrencies ?? []).filter(
                    (fc: any) => !fromToken || fc.ticker !== fromToken.ticker
                  )}
                  onSelectToken={(token) => {
                    const isFiat =
                      !token.cmcId ||
                      fiatCurrencies.some(
                        (fc: any) => fc.ticker === token.ticker
                      );

                    const completeToken = {
                      ...(token as Token),
                      id: token.id || `temp-${token.ticker}`,
                      ticker: token.ticker || "",
                      isCrypto: !isFiat,
                      _timestamp: Date.now(),
                    };

                    setToToken(completeToken);
                    setShowToSearch(false);
                    handleCoinClick(completeToken, "to");
                  }}
                  isVisible={showToSearch}
                  onClose={() => setShowToSearch(false)}
                />
              </SearchWrapper>
            )}
          </InputWrapper>
        </InputRow>
      </ConversionForm>

      <LastUpdated>
        Last update:{" "}
        {formatDate(fromToken?.lastUpdated || new Date(), "MMM d, yyyy h:mm a")}
        <RefreshButton onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <>
              <Loader size={14} />
              Refreshing...
            </>
          ) : (
            "Refresh"
          )}
        </RefreshButton>
        <ShareButton onClick={handleShare}>
          <Share2 size={14} />
          {copied ? "Copied!" : "Share"}
        </ShareButton>
      </LastUpdated>
    </ConverterContainer>
  );
};

export default ConverterCard;

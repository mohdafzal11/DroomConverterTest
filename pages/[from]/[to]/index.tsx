import { GetStaticProps, GetStaticPaths } from "next";
import axios from "axios";
import { getApiUrl } from "utils/config";
import ConverterMain from "components/ConverterMain/ConverterMain";
import prisma from "../../../src/lib/prisma";
import { generateTokenUrl } from "../../../src/utils/url";
import { CURRENCIES, CurrencyCode } from "../../../src/context/CurrencyContext";
import { Token } from "src/types";
import { parseTokenSlug } from "../../../src/utils/url";
import { calculateConversionRate } from "utils/rates";

interface PageProps {
  tokens: Token[];
  initialFromSlug: string | null;
  initialToSlug: string | null;
  initialFromToken: Token | null;
  initialToToken: Token | null;
  rates: Record<string, number> | null;
  notFound: boolean | null;
  error: boolean | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const tokens = await prisma.token.findMany({
      select: { id: true, name: true, ticker: true, rank: true },
      orderBy: { rank: "asc" },
      where: { rank: { lte: 2000 } },
    });

    const fiatCurrencies = Object.keys(CURRENCIES);

    const btc = tokens.find((t) => t.ticker.toUpperCase() === "BTC");
    const eth = tokens.find((t) => t.ticker.toUpperCase() === "ETH");
    const usdt = tokens.find((t) => t.ticker.toUpperCase() === "USDT");

    if (!btc || !eth || !usdt) {
      throw new Error("Missing BTC, ETH, or USDT");
    }

    const btcSlug = generateTokenUrl(btc.name, btc.ticker);
    const ethSlug = generateTokenUrl(eth.name, eth.ticker);
    const usdtSlug = generateTokenUrl(usdt.name, usdt.ticker);

    const paths: { params: { from: string; to: string } }[] = [];

    // BTC → Fiat
    for (const fiat of fiatCurrencies) {
      paths.push({ params: { from: btcSlug, to: fiat.toLowerCase() } });
    }

    // ETH → Fiat
    for (const fiat of fiatCurrencies) {
      paths.push({ params: { from: ethSlug, to: fiat.toLowerCase() } });
    }

    const top100Tokens = tokens.filter(
      (t) => t.rank && t.rank <= 100 && t.ticker.toUpperCase() !== "USDT"
    );

    // USDT → Top 100
    for (const token of top100Tokens) {
      const slug = generateTokenUrl(token.name, token.ticker);
      paths.push({ params: { from: usdtSlug, to: slug } });
    }

    // BTC → Top 100 (exclude BTC)
    for (const token of top100Tokens.filter(
      (t) => t.ticker.toUpperCase() !== "BTC"
    )) {
      const slug = generateTokenUrl(token.name, token.ticker);
      paths.push({ params: { from: btcSlug, to: slug } });
    }

    // ETH → Top 100 (exclude ETH)
    for (const token of top100Tokens.filter(
      (t) => t.ticker.toUpperCase() !== "ETH"
    )) {
      const slug = generateTokenUrl(token.name, token.ticker);
      paths.push({ params: { from: ethSlug, to: slug } });
    }

    // Top 100 → USD
    for (const token of top100Tokens) {
      const slug = generateTokenUrl(token.name, token.ticker);
      paths.push({ params: { from: slug, to: "usd" } });
    }

    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error("getStaticPaths error:", error);
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const { from, to } = context.params as { from: string; to: string };
  const fromSlug = from.toLowerCase();
  const toSlug = to.toLowerCase();

  let tokens: Token[] = [];
  let fromToken: Token | null = null;
  let toToken: Token | null = null;
  let rates: Record<string, number> = {};

  try {
    const response = await axios.get(getApiUrl(`/coins`), {
      params: { page: 1, pageSize: 50 },
    });

    const fiatSlugs = Object.keys(CURRENCIES).map((k) => k.toLowerCase());

    tokens = response.data.tokens.map((token: any) => ({
      id: token.id || "",
      slug: token.slug || "",
      ticker: token.ticker || "",
      cmcId: token.cmcId || "",
      name: token.name || "",
      rank: token.rank || 0,
      isCrypto: !fiatSlugs.includes(token.slug?.toLowerCase()),
      status: token.status || "stable",
      price: token.currentPrice?.usd || 0,
      logo: token.cmcId
        ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.cmcId}.png`
        : "",
      marketCap: token.marketData?.marketCap || 0,
      volume24h: token.marketData?.volume24h || 0,
      circulatingSupply: token.marketData?.circulatingSupply || 0,
      priceChanges: token.priceChanges || { hour1: 0, day1: 0, week1: 0 },
      lastUpdated: token.lastUpdated || new Date().toISOString(),
    }));

    fromToken = tokens.find((t) => t.slug.toLowerCase() === fromSlug) || null;
    toToken = tokens.find((t) => t.slug.toLowerCase() === toSlug) || null;

    if (!fromToken) {
      const parsed = parseTokenSlug(fromSlug);
      const ticker = parsed?.ticker?.toUpperCase() || "USD";

      if (CURRENCIES[fromSlug as CurrencyCode]) {
        fromToken = {
          id: `fiat-${ticker}`,
          slug: fromSlug,
          ticker,
          name: CURRENCIES[fromSlug as CurrencyCode].name,
          price: 1,
          cmcId: "0",
          rank: 0,
          isCrypto: false,
          status: "stable",
          logo: `https://flagcdn.com/w80/${ticker
            .toLowerCase()
            .slice(0, 2)}.png`,
          marketCap: 0,
          volume24h: 0,
          circulatingSupply: 0,
          priceChanges: { hour1: 0, day1: 0, week1: 0 },
          lastUpdated: new Date().toISOString(),
        };
        tokens.push(fromToken);
      } else {
        try {
          const res = await axios.get(getApiUrl(`/coin/${fromSlug}`));
          const data = res.data;

          const newToken: Token = {
            id: data.id || "",
            slug: data.slug || fromSlug,
            ticker: data.ticker || "",
            name: data.name || "Unknown",
            price: data.currentPrice?.usd || 0,
            cmcId: data.cmcId || "",
            rank: data.rank || 0,
            isCrypto: true,
            status: data.status || "stable",
            logo: data.cmcId
              ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${data.cmcId}.png`
              : "",
            marketCap: data.marketData?.marketCap || 0,
            volume24h: data.marketData?.volume24h || 0,
            circulatingSupply: data.marketData?.circulatingSupply || 0,
            priceChanges: data.priceChanges || { hour1: 0, day1: 0, week1: 0 },
            lastUpdated:
              data.currentPrice?.lastUpdated || new Date().toISOString(),
          };

          tokens.push(newToken);
          fromToken = newToken;
        } catch (error) {
          console.warn(`Failed to fetch token data for ${fromSlug}`, error);
        }
      }
    }

    if (!toToken) {
      const parsed = parseTokenSlug(toSlug);
      const ticker = parsed?.ticker?.toUpperCase() || "USD";

      if (CURRENCIES[toSlug as CurrencyCode]) {
        toToken = {
          id: `fiat-${ticker}`,
          slug: toSlug,
          ticker,
          name: CURRENCIES[toSlug as CurrencyCode].name,
          price: 1,
          cmcId: "0",
          rank: 0,
          isCrypto: false,
          status: "stable",
          logo: `https://flagcdn.com/w80/${ticker
            .toLowerCase()
            .slice(0, 2)}.png`,
          marketCap: 0,
          volume24h: 0,
          circulatingSupply: 0,
          priceChanges: { hour1: 0, day1: 0, week1: 0 },
          lastUpdated: new Date().toISOString(),
        };
        tokens.push(toToken);
      } else {
        try {
          const res = await axios.get(getApiUrl(`/coin/${toSlug}`));
          const data = res.data;

          const newToken: Token = {
            id: data.id || "",
            slug: data.slug || toSlug,
            ticker: data.ticker || "",
            name: data.name || "Unknown",
            price: data.currentPrice?.usd || 0,
            cmcId: data.cmcId || "",
            rank: data.rank || 9999,
            isCrypto: true,
            status: data.status || "stable",
            logo: data.cmcId
              ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${data.cmcId}.png`
              : "",
            marketCap: data.marketData?.marketCap || 0,
            volume24h: data.marketData?.volume24h || 0,
            circulatingSupply: data.marketData?.circulatingSupply || 0,
            priceChanges: data.priceChanges || { hour1: 0, day1: 0, week1: 0 },
            lastUpdated:
              data.currentPrice?.lastUpdated || new Date().toISOString(),
          };

          tokens.push(newToken);
          toToken = newToken;
        } catch (error) {
          console.warn(`Failed to fetch token data for ${toSlug}`, error);
        }
      }
    }

    if (fromToken && toToken && (!fromToken.isCrypto || !toToken.isCrypto)) {
      try {
        const res = await axios.get("https://open.er-api.com/v6/latest/USD");
        const data = res.data;
        if (data?.rates) {
          rates = Object.keys(CURRENCIES).reduce((acc, code) => {
            if (data.rates[code]) {
              acc[code] = data.rates[code];
            }
            return acc;
          }, {} as Record<string, number>);
        }
      } catch (err) {
        console.error("Failed to fetch fiat rates:", err);
      }
    }

    const btcToken = tokens.find((t) => t.ticker === "BTC") || tokens[0];
    const usdtToken =
      tokens.find((t) => t.ticker === "USDT") || tokens[1] || tokens[0];

    if (!fromToken) fromToken = btcToken;
    if (!toToken) toToken = usdtToken;

    return {
      props: {
        tokens,
        initialFromSlug: fromSlug,
        initialToSlug: toSlug,
        initialFromToken: fromToken,
        initialToToken: toToken,
        rates,
        notFound: false,
        error: false,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("[getStaticProps] Critical error:", error);
    return {
      props: {
        tokens: [],
        initialFromSlug: fromSlug,
        initialToSlug: toSlug,
        initialFromToken: null,
        initialToToken: null,
        rates: {},
        notFound: true,
        error: true,
      },
      revalidate: 60,
    };
  }
};

export default function ConverterPage(props: PageProps) {
  const {
    tokens,
    initialFromSlug,
    initialToSlug,
    initialFromToken,
    initialToToken,
    rates,
    notFound,
    error,
  } = props;

  if (notFound) {
    return <div>Pair not found. Please try again later.</div>;
  }

  if (error) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  const rate =
    initialFromToken &&
    initialToToken &&
    rates &&
    calculateConversionRate(initialFromToken, initialToToken, rates);

  const fromName = initialFromToken?.name;
  const toName = initialToToken?.name;
  const fromTicker = initialFromToken?.ticker;
  const toTicker = initialToToken?.ticker;
  const fromSlug = initialFromSlug;
  const toSlug = initialToSlug;

  const seoTitle =
    `Calculate ${fromName} to ${toName} Live Today (${fromTicker}-${toTicker})`.trim();
  const seoDescription =
    `Use our free converter to calculate ${fromName} to ${toName}. The current conversion rate is ${
      rate! > 0 ? rate?.toFixed(8) : "N/A"
    } ${toName}.`.trim();
  const ogImage = `https://droomdroom.com/converter/api/og-image/${fromSlug}/${toSlug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DroomDroom Cryptocurrency Converter",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Convert between cryptocurrencies and fiat currencies with our real-time cryptocurrency converter. Get accurate prices for Bitcoin, Ethereum, and thousands of altcoins.",
  };

  return (
    <ConverterMain
      tokens={tokens}
      initialFromSlug={initialFromSlug}
      initialToSlug={initialToSlug}
      initialFromToken={initialFromToken}
      initialToToken={initialToToken}
      title={seoTitle}
      description={seoDescription}
      ogImage={ogImage}
      structuredData={structuredData}
      isHomepage={false}
      notFound={notFound}
      error={error}
    />
  );
}

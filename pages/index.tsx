import { GetStaticProps } from "next";
import axios from "axios";
import { getApiUrl } from "utils/config";
import ConverterMain from "../src/components/ConverterMain/ConverterMain";
import { CURRENCIES } from "../src/context/CurrencyContext";
import { Token } from "src/types";

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

export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await axios.get(getApiUrl("/coins"), {
      params: {
        page: 1,
        pageSize: 50,
      },
    });

    const fiatSlugs = Object.keys(CURRENCIES).map((k) => k.toLowerCase());
    
    const tokens = response.data.tokens.map((token: any) => ({
      id: token.id || "",
      slug: token.slug || "",
      ticker: token.ticker || "",
      cmcId: token.cmcId || "",
      name: token.name || "",
      rank: token.rank || 0,
      isCrypto: !fiatSlugs.includes(token.slug?.toLowerCase()),
      status: token.status || "stable",
      price: token.currentPrice.usd || 0,
      logo: token.cmcId
        ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.cmcId}.png`
        : "",
      marketCap: token.marketData.marketCap || 0,
      volume24h: token.marketData.volume24h || 0,
      circulatingSupply: token.marketData.circulatingSupply || 0,
      priceChanges: token.priceChanges || { hour1: 0, day1: 0, week1: 0 },
      lastUpdated: token.lastUpdated || new Date().toISOString(),
    }));

    return {
      props: {
        tokens,
        rates: {},
        initialFromSlug: null,
        initialToSlug: null,
        initialFromToken:null,
        initialToToken: null,
        toToken: null,
        notFound: false,
        error: false,
      },
      revalidate: 3600,
    };
  } catch (error) {
    return {
      props: {
        tokens: [],
        initialFromSlug: null,
        initialToSlug: null,
        initialFromToken: null,
        initialToToken: null,
        notFound: true,
        error: true,
        rates: {},
      },
      revalidate: 60,
    };
  }
};

export default function ConverterIndex(props: PageProps) {

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

  const seoTitle =
    "DroomDroom Cryptocurrency Converter | Real-Time Crypto Price Calculator";
  const seoDescription =
    "Convert between cryptocurrencies and fiat currencies with our real-time cryptocurrency converter. Get accurate prices for Bitcoin, Ethereum, and 10000+ other cryptocurrencies.";
  const ogImage = "https://www.droomdroom.com/converter/Converter.png";

  return (
    <ConverterMain
      {...props}
      title={seoTitle}
      description={seoDescription}
      ogImage={ogImage}
      structuredData={structuredData}
      isHomepage={true}
    />
  );
}

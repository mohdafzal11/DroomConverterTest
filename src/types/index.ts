export interface Token {
  id: string;
  slug: string;
  ticker: string;
  cmcId: string;
  name: string;
  rank: number;
  isCrypto: boolean;
  status: string;
  price: number;
  logo: string;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  priceChanges: {
    hour1?: number;
    day1?: number;
    week1?: number;
    month1?: number;
    year1?: number;
    lastUpdated?: Date;
  };
  lastUpdated: string;
}



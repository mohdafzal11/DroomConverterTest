import type { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import CategoriesTable from 'components/pages/categories/CategoriesTable/CategoriesTable';
import SEO from 'components/SEO/SEO';
import { useRouter } from 'next/router';

export interface Category {
	id: string;
	name: string;
	market_cap: number;
	market_cap_change_24h: number;
	top_3_coins: string[];
	volume_24h: number;
	index: number;
}

interface CategoriesProps {
	categories: Category[];
}

export const getServerSideProps: GetServerSideProps = async () => {
	const res = await axios.get(`${process.env.API_URL}/coins/categories`);

	return {
		props: {
			categories: res.data,
		},
	};
};

const Categories: NextPage<CategoriesProps> = ({ categories }) => {
	const router = useRouter();
	const isLoading = router.isFallback;

	// Create structured data for the categories page
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Table",
		"about": "Cryptocurrency Market Sectors",
		"name": "Cryptocurrency Sectors by 24h Price Change",
		"description": "A comprehensive table of cryptocurrency market sectors and categories with market capitalization and price change data.",
		"image": "https://droomdroom.com/images/categories-overview.png",
		"mainEntity": {
			"@type": "ItemList",
			"numberOfItems": categories.length,
			"itemListElement": categories.slice(0, 10).map((category, index) => ({
				"@type": "ListItem",
				"position": index + 1,
				"name": category.name,
				"description": `${category.name} cryptocurrency market sector with ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(category.market_cap)} market cap.`,
				"image": category.top_3_coins && category.top_3_coins.length > 0 
					? `https://s2.coinmarketcap.com/static/img/coins/64x64/${category.top_3_coins[0]}.png` 
					: "https://droomdroom.com/images/category-placeholder.png",
				"url": `https://droomdroom.com/categories/${category.id}`,
				"additionalProperty": [
					{
						"@type": "PropertyValue",
						"name": "MarketCap",
						"value": category.market_cap
					},
					{
						"@type": "PropertyValue",
						"name": "MarketCapChange24h",
						"value": category.market_cap_change_24h
					},
					{
						"@type": "PropertyValue",
						"name": "Volume24h",
						"value": category.volume_24h
					},
					{
						"@type": "PropertyValue",
						"name": "TopCoins",
						"value": category.top_3_coins ? category.top_3_coins.join(", ") : ""
					}
				]
			}))
		}
	};

	return (
		<>
			<SEO
				title="Cryptocurrency Sectors by 24h Price Change | CoinMarketCap"
				description="Cryptocurrency category by 24h price change. Find out which parts of the crypto market are hot right now."
				structuredData={structuredData}
				ogImage="https://droomdroom.com/images/categories-overview.png"
			/>
			<CategoriesTable categories={categories} isLoading={isLoading} />
		</>
	);
};

export default Categories;

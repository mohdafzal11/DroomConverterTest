import axios from 'axios';
import HomeTable from 'components/pages/home/HomeTable/HomeTable';
import Pagination from 'components/Pagination/Pagination';
import SEO from 'components/SEO/SEO';
import { capitalize } from 'lodash';
import type { GetServerSideProps, NextPage } from 'next';


interface CategoryProps {
	coins: any[];
	category: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const res = await axios.get(`${process.env.API_URL}/coins/markets`, {
		params: {
			vs_currency: 'usd',
			order: 'market_cap_desc',
			per_page: 100,
			category: query.slug,
			sparkline: 'true',
			page: query.page ?? 1,
			price_change_percentage: '1h,24h,7d',
		},
	});

	return {
		props: {
			coins: res.data,
			category: query.slug,
		},
	};
};


const Category: NextPage<CategoryProps> = ({ coins, category }) => {

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"name": `Top ${capitalize(category)} Cryptocurrency Tokens`,
		"description": `List of top ${capitalize(category)} cryptocurrencies sorted by market capitalization with price and market data.`,
		"mainEntity": {
			"@type": "ItemList",
			"numberOfItems": coins.length,
			"itemListElement": coins.slice(0, 10).map((coin, index) => ({
				"@type": "ListItem",
				"position": index + 1,
				"item": {
					"@type": "FinancialProduct",
					"name": coin.name,
					"description": `${coin.name} (${coin.symbol}) cryptocurrency token in the ${capitalize(category)} category.`,
					"category": capitalize(category),
					"image": coin.image || (coin.cmcId ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.cmcId}.png` : ''),
					"ticker": coin.symbol,
					"price": coin.current_price,
					"priceCurrency": "USD",
					"priceChange24h": coin.price_change_percentage_24h,
					"marketCap": coin.market_cap,
					"additionalProperty": [
						{
							"@type": "PropertyValue",
							"name": "Volume24h",
							"value": coin.total_volume
						},
						{
							"@type": "PropertyValue",
							"name": "CategoryName",
							"value": capitalize(category)
						}
					]
				}
			}))
		}
	};

	// Get an image URL for Open Graph from the first coin in the category
	const categoryOgImage = coins.length > 0 && coins[0].image 
		? coins[0].image 
		: coins.length > 0 && coins[0].cmcId 
			? `https://s2.coinmarketcap.com/static/img/coins/200x200/${coins[0].cmcId}.png` 
			: "https://droomdroom.com/images/categories-overview.png";

	return (
		<>
			<SEO
				title={`Top ${capitalize(
					category
				)} Tokens by Market Capitalization | CoinMarketCap`}
				description={`See today's latest prices of ${capitalize(
					category
				)} crypto tokens listed by market capitalization ✔️ 24h volume ✔️ 24h price change ✔️`}
				structuredData={structuredData}
				ogImage={categoryOgImage}
			/>
			<HomeTable initialCoins={coins} />
			<Pagination
				totalItems={4400}
				itemsPerPage={100}
				uri={`/categories/${category}`}
			/>
		</>
	);
};

export default Category;

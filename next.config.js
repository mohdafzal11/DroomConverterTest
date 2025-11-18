/** @type {import('next').NextConfig} */


const nextConfig = {
	async headers() {
		return [
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      },
		  {
			source: '/:path*',
			headers: [
			  {
				key: 'Access-Control-Allow-Origin',
				value: '*'
			  },
			  {
				key: 'Cache-Control',
				value: 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=14400'
			  }
			]
		  },
      // Add cache headers for static assets
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Add cache headers for API image endpoints
      {
        source: '/api/coin-image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=60'
          }
        ]
      },
      // Add special headers for price pages
      {
        source: '/:slug/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300'
          }
        ]
      }
		]
	  },
  basePath: '/converter',
  assetPrefix: '/converter',
  publicRuntimeConfig: {
    basePath: '/converter',
    apiPath: '/converter/api',
    cmcImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64',
    // Add any other public config values here
  },
	swcMinify: true,
	compiler: {
		styledComponents: true,
	},
	images: {
		domains: ['assets.coingecko.com', 'res.cloudinary.com', 's2.coinmarketcap.com', 'upload.wikimedia.org', 'api.iconify.design'],
		formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
	},
  // Add service worker configuration
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    newNextLinkBehavior: true,
  },
	async redirects() {
		return [
			{
				source: '/community/profile',
				destination: '/community/articles',
				permanent: true,
			},
			{
				source: '/favicon.ico',
				destination: '/favicon.png',
				permanent: true,
			},
		];
	},
	typescript: {

		ignoreBuildErrors: true,
	  },
    webpack: (config, { dev, isServer }) => {
      // Split chunks more aggressively
      if (!dev && !isServer) {
        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        };
      }
      
      const webpack = require('webpack');
      
     
      
      config.plugins.push(
        new webpack.DefinePlugin({
          __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })'
        })
      );
      
      if (!dev) {
        config.optimization.minimizer = config.optimization.minimizer || [];
        config.optimization.minimizer.forEach(minimizer => {
          if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options.terserOptions = minimizer.options.terserOptions || {};
            minimizer.options.terserOptions.warnings = false;
          }
        });
      }
      
      return config;
    },
};

module.exports = nextConfig;

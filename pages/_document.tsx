import Document, {
	DocumentContext,
	Html,
	Head,
	Main,
	NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { getPageUrl } from 'utils/config';

export default class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const sheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
				});

			const initialProps = await Document.getInitialProps(ctx);
			
			return {
				...initialProps,
				styles: [
					initialProps.styles, 
					sheet.getStyleElement()
				],
			};
		} finally {
			sheet.seal();
		}
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					{/* Google Analytics 4 (GA4) Measurement */}
					<script async src={`https://www.googletagmanager.com/gtag/js?id=G-HJ72K23V10`} />
					<script
						dangerouslySetInnerHTML={{
							__html: `
								window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
								gtag('config', 'G-HJ72K23V10', {
									page_path: window.location.pathname,
								});
							`
						}}
					/>
					
					<link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
					<link rel="dns-prefetch" href="https://s2.coinmarketcap.com" />
					
					<link rel="icon" href={getPageUrl('/favicon.ico')} />
					<link rel="icon" href={getPageUrl('/favicon.png')} sizes="any" />
					<link rel="apple-touch-icon" sizes="180x180" href={getPageUrl('/favicon-192x192.png')} />
					<meta name="theme-color" content="#000000" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
					<meta name="application-name" content="DroomDroom" />
					
					<meta name="back-forward-cache" content="enabled" />
					<meta httpEquiv="Cache-Control" content="public, max-age=3600" />
					
					<link 
						rel="preload" 
						href={getPageUrl('/_next/static/chunks/main.js')} 
						as="script" 
						data-fetchpriority="high" 
					/>
					
					<style dangerouslySetInnerHTML={{ __html: `
						html, body {
							height: 100%;
						}
						body {
							display: flex;
							flex-direction: column;
							margin: 0;
							padding: 0;
						}
						@font-face {
							font-display: swap;
						}
					`}} />
				</Head>
				<body>
					<Main />
					<NextScript />
					
					<script
						dangerouslySetInnerHTML={{
							__html: `
								/* Performance measurement */
								window.perfMetrics = window.perfMetrics || {};
								window.perfMetrics.onFirstInputDelay = function(delay, evt) {
									window.dataLayer = window.dataLayer || [];
									window.dataLayer.push({
										'event': 'first-input-delay',
										'first_input_delay': delay
									});
								};
							`
						}}
					/>
					
					<script dangerouslySetInnerHTML={{
						__html: `
							window.addEventListener('pageshow', function(event) {
								if (event.persisted) {
									if (window._sockets && window._sockets.length > 0) {
										window._sockets.forEach(socket => {
											if (socket && socket.close) {
												socket.close();
											}
										});
										window._sockets = [];
									}
								}
							});

							(function() {
								if (!window._sockets) window._sockets = [];
								
								const OriginalWebSocket = window.WebSocket;
								
								window.WebSocket = function(...args) {
									const socket = new OriginalWebSocket(...args);
									window._sockets.push(socket);
									return socket;
								};
								
								Object.keys(OriginalWebSocket).forEach(key => {
									window.WebSocket[key] = OriginalWebSocket[key];
								});
							})();

							const runWhenIdle = window.requestIdleCallback || function(cb) {
								const start = Date.now();
								return setTimeout(function() {
									cb({
										didTimeout: false,
										timeRemaining: function() {
											return Math.max(0, 50 - (Date.now() - start));
										}
									});
								}, 1);
							};

							document.addEventListener('DOMContentLoaded', function() {
								function loadNoFollowScript() {
									const script = document.createElement('script');
									script.src = '${getPageUrl('/scripts/add-nofollow.js')}';
									script.async = true;
									document.body.appendChild(script);
									
									document.removeEventListener('scroll', loadNoFollowScript);
									document.removeEventListener('mousemove', loadNoFollowScript);
									document.removeEventListener('touchstart', loadNoFollowScript);
								}
								
								document.addEventListener('scroll', loadNoFollowScript, { once: true });
								document.addEventListener('mousemove', loadNoFollowScript, { once: true });
								document.addEventListener('touchstart', loadNoFollowScript, { once: true });
								
								runWhenIdle(function() {
									setTimeout(loadNoFollowScript, 3000);
								});
							});
						`
					}} />
				</body>
			</Html>
		);
	}
}

import type  AppProps  from 'next/app';
import Layout from 'components/layout/Layout/Layout';
import Header from 'components/Header/Header';
// STYLES
import GlobalStyles from 'styled/GlobalStyles';
import 'styled/styles.css';
import 'styled/nprogress.css'; // Custom NProgress styles
import 'styled/numberFonts.css'; // Custom number font styles
// FONTAWESOME
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
// REDUX
import { Provider } from 'react-redux';
import store from 'app/store';
import { SessionProvider } from 'next-auth/react'
import { authConfig } from 'src/utils/authConfig';
import { ComponentType, ReactElement, useEffect } from 'react';
import { NextPage } from 'next/types';
import ThemeProvider from 'src/theme/ThemeProvider';
import { CurrencyProvider } from '../src/context/CurrencyContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Router from 'next/router';
import NProgress from 'nprogress';
import { pageview, initEnhancedTracking } from '../src/utils/analytics';

// Configure NProgress
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

const queryClient = new QueryClient();

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	NestedLayout?: ComponentType<{ children: ReactElement }>;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Setup NProgress
  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleStop);
    Router.events.on('routeChangeError', handleStop);

    return () => {
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleStop);
      Router.events.off('routeChangeError', handleStop);
    };
  }, []);

  // Initialize Google Analytics
  useEffect(() => {
    // Track initial page view
    pageview(window.location.pathname + window.location.search);
    
    // Track route changes for page views
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    
    // Initialize enhanced tracking features
    initEnhancedTracking();
    
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  // Check if the current page is a widget page
  const isWidgetPage = Component.displayName === 'WidgetPage' || 
    (typeof window !== 'undefined' && window.location.pathname.startsWith('/widget/'));

	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider session={pageProps.session} basePath={authConfig.basePath}>
				<Provider store={store}>
					<ThemeProvider>
						<CurrencyProvider>
							<GlobalStyles />
							{isWidgetPage ? (
								// Render widget pages without the Layout
								<Component {...pageProps} />
							) : (
								// Render regular pages with the Layout
								<Layout>
									{Component.NestedLayout ? (
										<Component.NestedLayout>
											<Component {...pageProps} />
										</Component.NestedLayout>
									) : (
										<Component {...pageProps} />
									)}
								</Layout>
							)}
						</CurrencyProvider>
					</ThemeProvider>
				</Provider>
			</SessionProvider>
		</QueryClientProvider>
	);
}

export default MyApp;

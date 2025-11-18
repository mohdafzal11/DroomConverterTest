/**
 * Analytics utility for comprehensive event tracking throughout the converter app
 */

export const GA_MEASUREMENT_ID = 'G-HJ72K23V10';

// Track page views
export const pageview = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  });
};

// Core event tracking function
export const trackEvent = (action: string, category: string, label: string, value?: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Pre-defined common events for easier tracking
export const trackEvents = {
  // Converter-specific events
  converter: {
    conversion: (fromCurrency: string, toCurrency: string, amount: number) => 
      trackEvent('conversion', 'converter', `${fromCurrency}_to_${toCurrency}`, amount),
    currencySelect: (currency: string, position: 'from' | 'to') => 
      trackEvent('currency_select', 'converter', `${position}_${currency}`),
    amountChange: (amount: number) => 
      trackEvent('amount_change', 'converter', 'input_value', amount),
    swapCurrencies: (fromCurrency: string, toCurrency: string) => 
      trackEvent('swap_currencies', 'converter', `${fromCurrency}_${toCurrency}`),
    rateView: (rate: string) => 
      trackEvent('rate_view', 'converter', rate),
    saveCalculation: (fromCurrency: string, toCurrency: string, amount: number) => 
      trackEvent('save_calculation', 'converter', `${fromCurrency}_${toCurrency}`, amount),
    share: (fromCurrency: string, toCurrency: string, platform?: string) => 
      trackEvent('share_conversion', 'converter', platform ? `${fromCurrency}_${toCurrency}_${platform}` : `${fromCurrency}_${toCurrency}`),
  },
  
  // Cryptocurrency specific events
  crypto: {
    tokenView: (tokenName: string, ticker: string) => 
      trackEvent('token_view', 'crypto', `${tokenName}_${ticker}`),
    pairView: (fromToken: string, toToken: string) => 
      trackEvent('pair_view', 'crypto', `${fromToken}_${toToken}`),
    chartInteraction: (chartType: string, timeframe: string) => 
      trackEvent('chart_interaction', 'crypto', `${chartType}_${timeframe}`),
    priceAlert: (ticker: string, pricePoint: number) => 
      trackEvent('price_alert', 'crypto', ticker, pricePoint),
    marketCapView: (ticker: string) => 
      trackEvent('market_cap_view', 'crypto', ticker),
    volumeView: (ticker: string) => 
      trackEvent('volume_view', 'crypto', ticker),
    rangeChange: (range: string) => 
      trackEvent('range_change', 'crypto', range),
  },
  
  // Navigation events
  navigation: {
    menuClick: (menuItem: string) => trackEvent('menu_click', 'navigation', menuItem),
    tabChange: (tabName: string) => trackEvent('tab_change', 'navigation', tabName),
    search: (searchTerm: string) => trackEvent('search', 'navigation', searchTerm),
    searchResult: (searchTerm: string, resultCount: number) => 
      trackEvent('search_result', 'navigation', searchTerm, resultCount),
    pagination: (pageNumber: number) => trackEvent('pagination', 'navigation', 'page_change', pageNumber),
    filter: (filterName: string, value: string) => 
      trackEvent('filter', 'navigation', `${filterName}_${value}`),
    externalLink: (url: string) => 
      trackEvent('external_link', 'navigation', url),
  },
  
  // User engagement events
  userEngagement: {
    login: () => trackEvent('login', 'engagement', 'user_login'),
    signup: () => trackEvent('signup', 'engagement', 'user_signup'),
    logout: () => trackEvent('logout', 'engagement', 'user_logout'),
    settingsChange: (setting: string) => trackEvent('settings_change', 'engagement', setting),
    themeToggle: (theme: string) => trackEvent('theme_toggle', 'engagement', theme),
    languageChange: (language: string) => trackEvent('language_change', 'engagement', language),
    newsletterSignup: (source: string) => trackEvent('newsletter_signup', 'engagement', source),
    favouriteAdd: (itemId: string) => trackEvent('favourite_add', 'engagement', itemId),
    favouriteRemove: (itemId: string) => trackEvent('favourite_remove', 'engagement', itemId),
  },
  
  // Form interaction events
  form: {
    start: (formName: string) => trackEvent('form_start', 'form', formName),
    complete: (formName: string) => trackEvent('form_complete', 'form', formName),
    error: (formName: string, errorField: string) => 
      trackEvent('form_error', 'form', `${formName}_${errorField}`),
    fieldFocus: (formName: string, fieldName: string) => 
      trackEvent('field_focus', 'form', `${formName}_${fieldName}`),
    submit: (formName: string) => trackEvent('form_submit', 'form', formName),
  },
  
  // Widget events
  widget: {
    view: (widgetType: string) => trackEvent('widget_view', 'widget', widgetType),
    embed: (widgetType: string, domain: string) => 
      trackEvent('widget_embed', 'widget', `${widgetType}_${domain}`),
    customize: (widgetType: string, property: string) => 
      trackEvent('widget_customize', 'widget', `${widgetType}_${property}`),
    download: (widgetType: string) => trackEvent('widget_download', 'widget', widgetType),
  },
  
  // Performance tracking
  performance: {
    timing: (metricName: string, durationMs: number) => 
      trackEvent('timing', 'performance', metricName, durationMs),
    error: (errorType: string, errorMessage: string) => 
      trackEvent('error', 'performance', `${errorType}_${errorMessage}`),
    apiCall: (endpoint: string, statusCode: number, durationMs: number) => 
      trackEvent('api_call', 'performance', `${endpoint}_${statusCode}`, durationMs),
    loadTime: (component: string, durationMs: number) => 
      trackEvent('load_time', 'performance', component, durationMs),
  },
  
  // Custom event for anything else
  custom: (action: string, category: string, label: string, value?: number) => 
    trackEvent(action, category, label, value),
};

// Enhanced measurement for scroll depth tracking
export const initScrollTracking = () => {
  if (typeof window === 'undefined') return;
  
  let scrollDepthTriggered = {
    25: false,
    50: false,
    75: false,
    90: false
  };
  
  const calculateScrollDepth = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = Math.max(
      document.body.scrollHeight, 
      document.documentElement.scrollHeight,
      document.body.offsetHeight, 
      document.documentElement.offsetHeight
    );
    const windowHeight = window.innerHeight;
    const scrollPercent = scrollTop / (docHeight - windowHeight) * 100;
    
    Object.entries(scrollDepthTriggered).forEach(([depth, triggered]) => {
      if (!triggered && scrollPercent >= parseInt(depth)) {
        trackEvent('scroll_depth', 'engagement', `${depth}%`);
        scrollDepthTriggered[depth as unknown as keyof typeof scrollDepthTriggered] = true;
      }
    });
  };
  
  window.addEventListener('scroll', throttle(calculateScrollDepth, 500));
};

// Utility function to limit the rate of event firing
function throttle(callback: Function, delay: number) {
  let lastCall = 0;
  return function(...args: any[]) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return callback(...args);
  };
}

// Function to start tracking user session duration
export const startSessionTracking = () => {
  if (typeof window === 'undefined') return;
  
  const sessionStart = Date.now();
  
  // Track session duration every 30 seconds
  const sessionInterval = setInterval(() => {
    const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000);
    trackEvent('session_duration', 'engagement', 'seconds', sessionDuration);
  }, 30000);
  
  // Clear interval when page is hidden or unloaded
  const clearSessionTracking = () => {
    clearInterval(sessionInterval);
    const finalDuration = Math.floor((Date.now() - sessionStart) / 1000);
    trackEvent('session_ended', 'engagement', 'seconds', finalDuration);
  };
  
  window.addEventListener('beforeunload', clearSessionTracking);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      clearSessionTracking();
    }
  });
};

// Track conversion interactions
export const trackConversionInteractions = () => {
  if (typeof window === 'undefined') return;
  
  // Track time spent on conversion page
  let conversionStartTime = Date.now();
  let isTracking = true;
  
  // Track conversion completion
  const trackConversionCompletion = () => {
    if (!isTracking) return;
    
    const timeSpent = Math.floor((Date.now() - conversionStartTime) / 1000);
    trackEvent('conversion_time', 'converter', 'seconds', timeSpent);
    isTracking = false;
  };
  
  // Listen for conversion actions
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    
    // Track clicks on conversion-related buttons
    if (target.closest('.converter-submit-btn')) {
      trackEvent('converter_submit', 'converter', 'button_click');
      trackConversionCompletion();
    }
    
    if (target.closest('.swap-currencies-btn')) {
      trackEvent('swap_currencies', 'converter', 'button_click');
    }
  });
  
  // Stop tracking when user leaves page
  window.addEventListener('beforeunload', trackConversionCompletion);
};

// Initialize all enhanced tracking features
export const initEnhancedTracking = () => {
  initScrollTracking();
  startSessionTracking();
  trackConversionInteractions();
  
  // Track outbound links
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (anchor && anchor.href && anchor.hostname !== window.location.hostname) {
      trackEvent('outbound_link', 'navigation', anchor.href);
    }
  });
  
  // Track file downloads
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (anchor && anchor.href) {
      const fileExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar'];
      const isDownload = fileExtensions.some(ext => anchor.href.toLowerCase().endsWith(ext));
      
      if (isDownload) {
        trackEvent('file_download', 'engagement', anchor.href);
      }
    }
  });
}; 
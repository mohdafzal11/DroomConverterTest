import { Token } from "src/types";

export const calculateConversionRate = (
  fromToken: Token,
  toToken: Token,
  rates: Record<string, number>
) => {
  console.log('[DEBUG] calculateConversionRate called with:', {
    fromToken: {
      slug: fromToken?.slug,
      price: fromToken?.price,
      isCrypto: fromToken?.isCrypto,
    },
    toToken: {
      slug: toToken?.slug,
      price: toToken?.price,
      isCrypto: toToken?.isCrypto,
    },
    ratesKeys: Object.keys(rates),
  });

  if (
    !fromToken?.price ||
    !toToken?.price ||
    isNaN(fromToken.price) ||
    isNaN(toToken.price) ||
    fromToken.price <= 0 ||
    toToken.price <= 0
  ) {
    console.warn('[DEBUG] Invalid price data - returning 0', {
      fromPrice: fromToken?.price,
      toPrice: toToken?.price,
    });
    return 0;
  }

  let rate = 0;

  if (!fromToken?.isCrypto && !toToken?.isCrypto) {
    console.log('[DEBUG] Case: Fiat → Fiat');
    const fromRate = rates[fromToken.slug as keyof typeof rates] || 1;
    const toRate = rates[toToken.slug as keyof typeof rates] || 1;

    console.log('[DEBUG] Fiat rates:', { fromRate, toRate, fromSlug: fromToken.slug, toSlug: toToken.slug });
    rate = toRate / fromRate;
    console.log('[DEBUG] Calculated rate (Fiat→Fiat):', rate);
  } 
  else if (!fromToken?.isCrypto && toToken?.isCrypto) {
    console.log('[DEBUG] Case: Fiat → Crypto');
    const fiatRate = rates[fromToken.slug as keyof typeof rates] || 1;

    console.log('[DEBUG] Fiat rate for', fromToken.slug, ':', fiatRate);
    console.log('[DEBUG] Crypto price for', toToken.slug, ':', toToken.price);
    rate = fiatRate / toToken.price;
    console.log('[DEBUG] Calculated rate (Fiat→Crypto):', rate);
  } 
  else if (fromToken?.isCrypto && !toToken?.isCrypto) {
    console.log('[DEBUG] Case: Crypto → Fiat');
    const fiatRate = rates[toToken.slug as keyof typeof rates] || 1;

    console.log('[DEBUG] Crypto price for', fromToken.slug, ':', fromToken.price);
    console.log('[DEBUG] Fiat rate for', toToken.slug, ':', fiatRate);
    rate = fromToken.price * fiatRate;
    console.log('[DEBUG] Calculated rate (Crypto→Fiat):', rate);
  } 
  else {
    console.log('[DEBUG] Case: Crypto → Crypto');
    console.log('[DEBUG] Prices:', { from: fromToken.price, to: toToken.price });
    rate = fromToken.price / toToken.price;
    console.log('[DEBUG] Calculated rate (Crypto→Crypto):', rate);
  }

  console.log('[DEBUG] Final conversion rate:', rate);
  return rate;
};
// Currency configuration for Bangladesh (BDT)
export const CURRENCY_CONFIG = {
  code: 'BDT',
  symbol: '৳',
  name: 'Bangladeshi Taka',
  position: 'before', // 'before' or 'after' the amount
  decimalPlaces: 2,
  thousandsSeparator: ',',
  decimalSeparator: '.'
};

/**
 * Format price with BDT currency
 * @param {number} price - The price to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: true)
 * @returns {string} Formatted price string
 */
export const formatCurrency = (price, showDecimals = true) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return `${CURRENCY_CONFIG.symbol}0${showDecimals ? '.00' : ''}`;
  }

  const formattedNumber = showDecimals 
    ? price.toFixed(CURRENCY_CONFIG.decimalPlaces)
    : Math.round(price).toString();

  // Add thousands separator
  const parts = formattedNumber.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, CURRENCY_CONFIG.thousandsSeparator);
  
  const finalAmount = parts.join(CURRENCY_CONFIG.decimalSeparator);

  return CURRENCY_CONFIG.position === 'before' 
    ? `${CURRENCY_CONFIG.symbol}${finalAmount}`
    : `${finalAmount}${CURRENCY_CONFIG.symbol}`;
};

/**
 * Format price for display (legacy support)
 * @param {number} price - The price to format
 * @param {string} currency - Currency symbol (defaults to BDT)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = CURRENCY_CONFIG.symbol) => {
  if (typeof price !== 'number') return `${currency}0.00`;
  return `${currency}${price.toFixed(2)}`;
};

/**
 * Get currency symbol
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = () => CURRENCY_CONFIG.symbol;

/**
 * Get currency code
 * @returns {string} Currency code
 */
export const getCurrencyCode = () => CURRENCY_CONFIG.code;

/**
 * Parse price string to number
 * @param {string} priceString - Price string to parse
 * @returns {number} Parsed price
 */
export const parseCurrency = (priceString) => {
  if (typeof priceString === 'number') return priceString;
  const cleaned = String(priceString)
    .replace(CURRENCY_CONFIG.symbol, '')
    .replace(/[,\s]/g, '');
  return parseFloat(cleaned) || 0;
};

const currencyUtils = {
  formatCurrency,
  formatPrice,
  getCurrencySymbol,
  getCurrencyCode,
  parseCurrency,
  CURRENCY_CONFIG
};

export default currencyUtils;

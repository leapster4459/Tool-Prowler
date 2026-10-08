// Tool Prowler - Pricing & Markup Engine

const MIN_PROFIT = 2.00;

// Default markup settings
const DEFAULT_MARKUP_PERCENT = 20;
const DEFAULT_MIN_MARKUP = 5.00;

function calculateMarkup(sourcePrice, markupPercent = DEFAULT_MARKUP_PERCENT) {
  const price = Number(sourcePrice) || 0;
  const percent = Number(markupPercent) || 0;

  return price * (percent / 100);
}

function calculateSellingPrice(
  sourcePrice,
  markupPercent = DEFAULT_MARKUP_PERCENT,
  minMarkup = DEFAULT_MIN_MARKUP
) {
  const price = Number(sourcePrice) || 0;

  if (price <= 0) {
    return 0;
  }

  const percentageMarkup = calculateMarkup(price, markupPercent);
  const markup = Math.max(percentageMarkup, minMarkup);

  return Number((price + markup).toFixed(2));
}

function calculateNetProfit(
  sellingPrice,
  sourcePrice,
  fees = 0,
  shipping = 0
) {
  const sale = Number(sellingPrice) || 0;
  const source = Number(sourcePrice) || 0;
  const marketplaceFees = Number(fees) || 0;
  const deliveryCost = Number(shipping) || 0;

  return Number(
    (sale - source - marketplaceFees - deliveryCost).toFixed(2)
  );
}

function passesProfitFilter(netProfit) {
  return Number(netProfit) >= MIN_PROFIT;
}

function priceProduct(product, options = {}) {
  const markupPercent =
    options.markupPercent ?? DEFAULT_MARKUP_PERCENT;

  const minMarkup =
    options.minMarkup ?? DEFAULT_MIN_MARKUP;

  const sellingPrice = calculateSellingPrice(
    product.sourcePrice,
    markupPercent,
    minMarkup
  );

  const netProfit = calculateNetProfit(
    sellingPrice,
    product.sourcePrice,
    product.fees,
    product.shipping
  );

  return {
    ...product,
    sellingPrice,
    markup: Number(
      (sellingPrice - (Number(product.sourcePrice) || 0)).toFixed(2)
    ),
    netProfit,
    profitable: passesProfitFilter(netProfit)
  };
}

module.exports = {
  MIN_PROFIT,
  DEFAULT_MARKUP_PERCENT,
  DEFAULT_MIN_MARKUP,
  calculateMarkup,
  calculateSellingPrice,
  calculateNetProfit,
  passesProfitFilter,
  priceProduct
}; 

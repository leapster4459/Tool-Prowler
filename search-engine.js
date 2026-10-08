// Tool Prowler - Search & Comparison Engine

const { priceProduct } = require("./pricing-engine");

const MIN_PROFIT = 2.00;

function calculateProfit(salePrice, sourcePrice, fees = 0, shipping = 0) {
  return salePrice - sourcePrice - fees - shipping;
}

function compareProducts(products) {
  return products
    .map(product => {
      const profit = calculateProfit(
        product.salePrice,
        product.sourcePrice,
        product.fees || 0,
        product.shipping || 0
      );

      return {
        ...product,
        expectedProfit: Number(profit.toFixed(2)),
        profitable: profit >= MIN_PROFIT
      };
    })
    .filter(product => product.profitable)
    .sort((a, b) => b.expectedProfit - a.expectedProfit);
}

function searchProducts(query, products) {
  const search = query.toLowerCase().trim();

  return products.filter(product =>
    product.title.toLowerCase().includes(search)
  );
}

function normalizeProduct(product, source = "unknown") {
  return {
    id: product.id || null,
    title: product.title || "Untitled Product",
    source,
    url: product.url || null,
    image: product.image || null,
    salePrice: Number(product.salePrice) || 0,
    sourcePrice: Number(product.sourcePrice) || 0,
    fees: Number(product.fees) || 0,
    shipping: Number(product.shipping) || 0
  };
}

function processProduct(product, options = {}) {
  const pricedProduct = priceProduct(product, options);

  return {
    ...pricedProduct,
    profitable: pricedProduct.netProfit >= MIN_PROFIT
  };
}

module.exports = {
  MIN_PROFIT,
  calculateProfit,
  compareProducts,
  searchProducts,
  normalizeProduct,
  processProduct
}; 

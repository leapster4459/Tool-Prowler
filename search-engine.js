// Tool Prowler - Search & Comparison Engine

const { priceProduct } = require("./pricing-engine");

const MIN_PROFIT = 2.00;

  function compareProducts(products) {
  const pricedProducts = products.map((product) =>
    priceProduct(product)
  );

  return pricedProducts
    .filter((product) => product.profitable)
    .sort((a, b) => b.netProfit - a.netProfit);
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
  compareProducts,
  searchProducts,
  normalizeProduct,
  processProduct
}; 

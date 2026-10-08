// Tool Prowler - Search & Comparison Engine

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

module.exports = {
  MIN_PROFIT,
  calculateProfit,
  compareProducts,
  searchProducts
}; 

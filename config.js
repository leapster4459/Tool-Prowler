// Tool Prowler - Core Configuration

const config = {
  siteName: "Tool Prowler",

  search: {
    sources: ["ebay", "amazon"],
    maxResultsPerSource: 25
  },

  profit: {
    minimumNetProfit: 2.00,
    rejectBelowMinimum: true
  },

  ranking: {
    prioritizeProfit: true,
    comparePrice: true,
    compareShipping: true
  },

  fulfillment: {
    automated: true,
    customerShipsDirect: true
  }
};

module.exports = config; 

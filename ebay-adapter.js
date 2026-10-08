// Tool Prowler - eBay Used Product Adapter

const { normalizeProduct } = require("./search-engine");

const EBAY_API_URL = "https://api.ebay.com";
const EBAY_MARKETPLACE = "EBAY_US";

async function getEbayApplicationToken() {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing EBAY_CLIENT_ID or EBAY_CLIENT_SECRET environment variable."
    );
  }

  const credentials = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const response = await fetch(
    `${EBAY_API_URL}/identity/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`
      },
      body: "grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope"
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `eBay authentication failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();
  return data.access_token;
}

async function searchEbayUsedProducts(query, limit = 20) {
  if (!query || !query.trim()) {
    throw new Error("A product search query is required.");
  }

  const token = await getEbayApplicationToken();

  const params = new URLSearchParams({
    q: query.trim(),
    limit: String(Math.min(limit, 200)),
    filter: "conditions:{USED}"
  });

  const response = await fetch(
    `${EBAY_API_URL}/buy/browse/v1/item_summary/search?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-EBAY-C-MARKETPLACE-ID": EBAY_MARKETPLACE
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `eBay search failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  return (data.itemSummaries || []).map((item) => {
    const price = Number(item.price?.value) || 0;

    const shipping =
      Number(
        item.shippingOptions?.[0]?.shippingCost?.value
      ) || 0;

    return normalizeProduct(
      {
        id: item.itemId,
        title: item.title,
        url: item.itemWebUrl,
        image: item.image?.imageUrl,
        salePrice: price,
        sourcePrice: price,
        fees: 0,
        shipping
      },
      "eBay"
    );
  });
}

module.exports = {
  searchEbayUsedProducts,
  getEbayApplicationToken
}; 

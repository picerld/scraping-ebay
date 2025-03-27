const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://www.ebay.com/sch/i.html?_nkw=";

const scrapeEbay = async (query = "nike", page = 1) => {
  try {
    const url = `${BASE_URL}${query}&_pgn=${page}`;
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(data);

    const products = $(".s-item")
      .map((_, item) => ({
        id: extractItemId($(item).find(".s-item__link").attr("href") || "-"),
        title: $(item).find(".s-item__title").text() || "-",
        price: $(item).find(".s-item__price").text() || "-",
        link: $(item).find(".s-item__link").attr("href") || "-",
        image: $(item).find(".s-item__image img").attr("src") || "-",
      }))
      .get();

    return { status: "success", query, page, results: products };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to scrape eBay products.",
      error: error.message,
    };
  }
};

const getItemDetails = async (id) => {
  try {
    const url = `https://www.ebay.com/itm/${id}`;
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(data);

    const product = {
      status: "success",
      id,
      image: $("#icImg").attr("src") || "-",
      description: await extractDescription($),
    };

    // AI-generated description: Uncomment to enable
    // product.description = await processWithAI(product.description);

    return product;
  } catch (error) {
    return {
      status: "error",
      message: "Failed to fetch item details.",
      error: error.message,
    };
  }
};

const extractItemId = (url) => {
  const match = url?.match(/\/itm\/(\d+)/);
  return match ? match[1] : null;
};

const extractDescription = async ($) => {
  const iframeSrc = $("#desc_ifr").attr("src");

  if (!iframeSrc) {
    return "-";
  }

  return await fetchDescription(iframeSrc);
};

const fetchDescription = async (iframeUrl) => {
  try {
    const { data } = await axios.get(iframeUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const $ = cheerio.load(data);

    $("script, style, noscript, iframe").remove();

    let description = $("body").text().trim();

    description = description.replace(/\s+/g, " ");

    return description.length > 50
      ? description
      : "No detailed description provided by the seller.";
  } catch (error) {
    return "Failed to retrieve product description.";
  }
};

const processWithAI = async (description) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that extracts meaningful product details from raw descriptions.",
        },
        {
          role: "user",
          content: `Clean and extract meaningful product information from this description: "${description}"`,
        },
      ],
      max_tokens: 200,
    });

    return response.choices[0].message.content.trim() || description;
  } catch (error) {
    console.error("AI processing failed:", error.message);
    return description;
  }
};

module.exports = { scrapeEbay, getItemDetails };

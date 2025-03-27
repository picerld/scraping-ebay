require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ebay = require("./ebay");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ROUTES
app.get("/api/search", async (req, res) => {
  const { query = "nike", page = 1 } = req.query;

  try {
    const data = await ebay.scrapeEbay(query, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch eBay search results", error: error.message });
  }
});

app.get("/api/item/:id", async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^\d+$/)) {
    return res.status(400).json({ status: "error", message: "Invalid item ID" });
  }

  try {
    const data = await ebay.getItemDetails(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch item details", error: error.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

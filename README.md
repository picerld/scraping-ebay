# eBay Product Scraper API

This project is a Node.js-based web scraper that extracts product data from eBay using OpenAI API. It fetches product details such as name, price, and description using AI-powered extraction.

## Features

- Scrape product listings from eBay
- Retrieve product details including title, price, image, and description
- Use OpenAI API to enhance data extraction
- Return results in JSON format
- CORS-enabled for cross-origin access

## Technologies Used

- **Node.js**
- **Express.js**
- **Axios** (for HTTP requests)
- **Cheerio** (for web scraping)
- **dotenv** (for environment variables)
- **OpenAI API** (for AI-powered data extraction)

---

## Installation

### 1. Clone the Repository

```sh
git clone https://github.com/picerld/scraping-ebay.git
cd scraping-ebay
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory by following:

```sh
cp .env.example .env
```

```sh
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000  # Optional, default is 3000
```

### 4. Run the Server

```sh
node server.js
```

The server will start on `http://localhost:3000`

---

## API Endpoints

### **1. Search for Products**

**Endpoint:** `GET /api/search`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Search term (default: `nike`) |
| `page` | number | Page number (default: `1`) |

**Example Request:**

```sh
GET http://localhost:3000/api/search?query=nike&page=1
```

**Success Response:**

```json
{
  "status": "success",
  "query": "nike",
  "page": 1,
  "results": [
    {
      "id": "135652856190",
      "title": "Nike Air Jordan 1 Low Shattered Backboard 2019 Size 13 553558-128",
      "price": "IDR830,433.88",
      "link": "https://www.ebay.com/itm/135652856190",
      "image": "https://i.ebayimg.com/images/g/aeUAAeSwolln5L0L/s-l500.jpg"
    }
  ]
}
```

**Error Responses:**

```json
{
  "status": "error",
  "message": "Failed to fetch eBay search results",
  "error": "Request failed with status code 403"
}
```

---

### **2. Get Product Details**

**Endpoint:** `GET /api/item/:id`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | eBay product ID |

**Example Request:**

```sh
GET http://localhost:3000/api/item/123456789
```

**Success Response:**

```json
{
  "status": "success",
  "id": "135652856190",
  "image": "https://i.ebayimg.com/images/g/aeUAAeSwolln5L0L/s-l500.jpg",
  "description": "Nike Air Jordan 1 Low Shattered Backboard 2019 Size 13 553558-128. See pictures for full condition!"
}
```

**Error Responses:**

- **Invalid Item ID Format:**

```json
{
  "status": "error",
  "message": "Invalid item ID"
}
```

- **Product Not Found:**

```json
{
  "status": "error",
  "message": "Failed to fetch item details",
  "error": "Request failed with status code 404"
}
```

- **Failed to Retrieve Description:**

```json
{
  "status": "error",
  "message": "Failed to retrieve product description."
}
```

---

## Notes

- Ensure you have a valid `OPENAI_API_KEY` for the AI-powered extraction.
- The scraper may break if eBay changes its HTML structure.
- Use a `User-Agent` header to avoid being blocked by eBay.

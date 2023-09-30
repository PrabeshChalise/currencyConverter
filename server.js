const express = require("express");
const CC = require("currency-converter-lt");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post("/convert", async (req, res) => {
  try {
    const fromCurrency = req.body.convertFrom;
    const toCurrency = req.body.convertTo;
    const amountToConvert = parseFloat(req.body.convertMoney); // Parse as a float

    if (isNaN(amountToConvert)) {
      throw new Error("Invalid amount");
    }

    const currencyConverter = new CC({
      from: fromCurrency,
      to: toCurrency,
      amount: amountToConvert,
    });

    currencyConverter.convert().then((response) => {
      if (typeof response === "number") {
        res.json({
          result: `${amountToConvert} ${fromCurrency} is equal to ${response} ${toCurrency}`,
        });
      } else {
        console.error("Currency conversion error:", response);
        res.status(500).json({ error: "Error occurred during conversion" });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

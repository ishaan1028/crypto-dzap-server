const axios = require("axios");
const options = {
  headers: {
    "X-CMC_PRO_API_KEY": process.env.CMC_PRO_API_KEY,
  },
};

const getAllCryptoAndFiat = async (req, res) => {
  try {
    const cryptoURL = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=100`;
    const fiatURL = `https://pro-api.coinmarketcap.com/v1/fiat/map`;

    const [cryptoResponse, fiatResponse] = await Promise.all([
      axios.get(cryptoURL, options),
      axios.get(fiatURL, options),
    ]);

    if (cryptoResponse.data.status.error_code) {
      throw new Error(cryptoResponse.data.status.error_message);
    }

    if (fiatResponse.data.status.error_code) {
      throw new Error(fiatResponse.data.status.error_message);
    }

    const cryptoData = cryptoResponse.data.data.map((crypto) => {
      return {
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
      };
    });

    const fiatData = fiatResponse.data.data;

    res.send({
      status: "success",
      data: {
        crypto_list: cryptoData,
        fiat_list: fiatData,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "something went wrong",
    });
  }
};

const cryptoToFiat = async (req, res) => {
  try {
    const { crypto, amount, fiat } = req.query;

    const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${crypto}&convert=${fiat}`;

    const { data } = await axios.get(url, options);

    if (data.status.error_code || data.status.error_message) {
      throw new Error(data.status.error_message);
    }

    const price = data.data[crypto][0].quote[fiat].price;
    const conversion = price * amount;
    res.status(200).send({
      status: "success",
      data: {
        unit_price: price,
        conversion: conversion,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      message: "something went wrong",
    });
  }
};

module.exports = {
  getAllCryptoAndFiat,
  cryptoToFiat,
};

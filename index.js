const PORT = 8000;
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());

app.get("/monthly-bugs", (req, res) => {
  const options = {
    method: "GET",
    url: "https://api.nookipedia.com/nh/bugs",
    headers: {
      "X-API-KEY": process.env.X_API_KEY,
      "Accepted-Version": "1.0.0",
    },
    params: { month: req.query.month },
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/monthly-fish", (req, res) => {
  const options = {
    method: "GET",
    url: "https://api.nookipedia.com/nh/fish",
    headers: {
      "X-API-KEY": process.env.X_API_KEY,
      "Accepted-Version": "1.0.0",
    },
    params: { month: req.query.month },
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/monthly-sea-creatures", (req, res) => {
  const options = {
    method: "GET",
    url: "https://api.nookipedia.com/nh/sea",
    headers: {
      "X-API-KEY": process.env.X_API_KEY,
      "Accepted-Version": "1.0.0",
    },
    params: { month: req.query.month },
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(8000, () => console.log(`Server is running on port ${PORT}`));

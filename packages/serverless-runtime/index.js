const express = require("express");

const app = express();

const METHOD = process.env.SERVERLESS_METHOD;
const ENDPOINT = process.env.SERVERLESS_ENDPOINT;
const CODE = process.env.SERVERLESS_CODE;
const ACCESS_TOKEN = process.env.SERVERLESS_TOKEN;
const ENDPOINT_URL = process.env.SERVERLESS_ENDPOINT_URL;

const codeup = {
  database: {
    get: async (key) => {
      const res = await fetch(ENDPOINT_URL + "/api/@codeup/database/get", {
        method: "GET",
        headers: {
          "X-SF-Access": ACCESS_TOKEN,
          "x-codeup-database-key": key,
        },
      });

      const text = await res.text();

      console.log(text);

      if (res.status === 200) {
        return text;
      } else {
        return null;
      }
    },
    set: async (key, value) => {
      const res = await fetch(ENDPOINT_URL + "/api/@codeup/database/set", {
        method: "POST",
        headers: {
          "X-SF-Access": ACCESS_TOKEN,
          "x-codeup-database-key": key,
        },
        body: JSON.stringify({
          value,
        }),
      });

      console.log(await res.text());

      return res.status === 200;
    },
  },
};

if (METHOD === "POST") {
  app.post(ENDPOINT, async (req, res) => {
    eval(`(async () => {${CODE}})()`);
  });
} else {
  app.get(ENDPOINT, async (req, res) => {
    eval(`(async () => {${CODE}})()`);
  });
}

app.listen(3000);

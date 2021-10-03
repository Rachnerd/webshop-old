import { NextApiRequest, NextApiResponse } from "next";
import numeral from "numeral";
import { getCart, PRICES } from "@webshop/data";

const PERFORMANCE_DELAY = 2000;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET": {
      const cart = getCart();
      const total = Object.keys(cart)
        .map((id) => {
          const price = PRICES[id];
          const quantity = cart[id];
          return numeral(price).multiply(quantity).value();
        })
        .reduce((total, value) => total.add(value), numeral(0));

      // await delay(PERFORMANCE_DELAY);

      res.status(200).json(JSON.stringify(total.format("0,0.00")));
      break;
    }
    default: {
      res.status(405).end();
    }
  }
};

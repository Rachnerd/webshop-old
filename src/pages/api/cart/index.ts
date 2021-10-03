import type { NextApiRequest, NextApiResponse } from "next";
import numeral from "numeral";
import { getCart, PRICES, updateCart } from "@webshop/data";

const PERFORMANCE_DELAY = 1000;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET": {
      const cart = getCart();
      const cartAsArray = Object.keys(cart).map((id) => ({
        id,
        quantity: cart[id],
        total: numeral(PRICES[id]).multiply(cart[id]).format("0,0.00"),
      }));

      // await delay(PERFORMANCE_DELAY);

      res.status(200).json(cartAsArray);
      break;
    }
    case "POST": {
      const { id, quantity } = req.body;
      const cart = getCart();
      cart[id] = quantity;
      updateCart(cart);
      res.status(204).end();
      break;
    }
    default: {
      res.status(405).end();
    }
  }
};

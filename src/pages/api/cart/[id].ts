import type { NextApiRequest, NextApiResponse } from "next";
import numeral from "numeral";
import { getCart, PRICES, updateCart } from "@webshop/data";

const PERFORMANCE_DELAY = 1000;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;

  const cart = getCart();

  if (cart[id] === undefined) {
    res.status(404).end();
    return;
  }

  switch (req.method) {
    case "GET": {
      // await delay(PERFORMANCE_DELAY);
      const price = PRICES[id];
      const amountInCart = cart[id];
      res.status(200).json({
        id,
        quantity: cart[id],
        total: numeral(price).multiply(amountInCart).format("0,0.00"),
      });
      break;
    }
    case "DELETE": {
      delete cart[id];
      res.status(204).end();
      updateCart(cart);
      break;
    }
    case "PUT": {
      if (cart[id] === undefined) {
        res.status(404).end();
      } else {
        const quantity = req.body.quantity;
        if (quantity) {
          cart[id] = req.body.quantity;
          updateCart(cart);
        }
        res.status(204).end();
      }
      break;
    }
    default: {
      res.status(405).end();
    }
  }
};

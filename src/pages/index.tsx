import React, { useEffect, useState } from "react";
import { Paging, RemoteCartItem, RemoteItem } from "@webshop/models";
import { HomePage } from "@webshop/pages";
import { normalize, Paged } from "@webshop/utils";
import { useQuery } from "react-query";
import { ClientItem } from "../models/client/client-item.model";
import {
  addItemToCartRequest,
  getCartRequest,
  getItemsRequest,
} from "@webshop/requests";

const PAGING: Paging = {
  size: 6,
  page: 0,
};

export default function Index() {
  /**
   * Fetch remote items to display.
   */
  const itemsQuery = useQuery<Paged<RemoteItem>>("items", async () =>
    getItemsRequest({ paging: PAGING })
  );

  /**
   * Fetch remote cart information.
   */
  const cartQuery = useQuery<RemoteCartItem[]>("cart", async () =>
    getCartRequest()
  );

  /**
   * Keeping items as local states allows to modify and populate it with cart data (aggregation).
   */
  const [items, setItems] = useState<ClientItem[] | undefined>(undefined);

  /**
   * Aggregation logic that populates items with `amountInCart` based on Cart data.
   * RemoteItem -> ClientItem
   */
  useEffect(() => {
    const remoteItems = itemsQuery.data?.content;
    const cart = cartQuery.data;

    if (remoteItems && cart) {
      const normalizedCart = normalize(cart);
      const clientItems = remoteItems.map((item) => ({
        ...item,
        amountInCart: normalizedCart[item.id]?.quantity || 0,
      }));
      setItems(clientItems);
    }
  }, [itemsQuery.data, cartQuery.data]);

  /**
   * Add item to cart remotely and update local state accordingly.
   */
  const addToCart = (id: number, quantity: number) => {
    (async () => {
      try {
        await addItemToCartRequest(id, quantity);
        const updatedItems = items?.map((item) => {
          if (item.id === id) {
            item.amountInCart = quantity;
          }
          return item;
        });
        setItems(updatedItems);
      } catch (error) {
        console.error("Add item to cart failed", error);
      }
    })();
  };

  return (
    <HomePage
      addToCart={addToCart}
      items={{
        loading: itemsQuery.isLoading,
        error: itemsQuery.error,
        data: items || itemsQuery.data?.content,
      }}
    />
  );
}

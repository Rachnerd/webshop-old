import React, { useEffect, useState } from "react";
import { CategoryPage } from "@webshop/pages";
import {
  ClientItem,
  Paging,
  RemoteCartItem,
  RemoteItem,
} from "@webshop/models";
import { NextPageContext } from "next";
import {
  addItemToCartRequest,
  getCartRequest,
  getItemsByCategoryRequest,
} from "@webshop/requests";
import { normalize } from "@webshop/utils";
import { useQuery } from "react-query";

const QUERY_PARAM_NAME = "category";

interface CategoryInitialProps {
  category: string;
}

const PAGING = {
  page: 0,
  size: 6,
};

export default function Category({ category }: CategoryInitialProps) {
  const itemsQuery = useQuery<Paging<RemoteItem[]>>(
    `itemsByCategory:${category}`,
    async () => getItemsByCategoryRequest({ category, paging: PAGING })
  );

  const [items, setItems] = useState<ClientItem[] | undefined>(undefined);

  const cartQuery = useQuery<RemoteCartItem[]>("cart", async () =>
    getCartRequest()
  );

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
  }, [itemsQuery.data !== undefined, cartQuery.data !== undefined]);

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
    <CategoryPage
      category={{ title: category }}
      itemsState={{
        loading: itemsQuery.isLoading,
        data: items || itemsQuery.data?.content,
        error: itemsQuery.error,
      }}
      addToCart={addToCart}
    />
  );
}

Category.getInitialProps = ({
  query,
}: NextPageContext): CategoryInitialProps => ({
  category: query[QUERY_PARAM_NAME] as string,
});

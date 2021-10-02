import React, { useEffect, useState } from "react";
import { CartItemModel, RemoteCartItem, RemoteItem } from "@webshop/models";
import { normalize } from "@webshop/utils";
import {
  getCartItemRequest,
  getCartRequest,
  getCartTotalPriceRequest,
  getItemsRequest,
  removeCartItemRequest,
  updateCartItemRequest,
} from "@webshop/requests";
import { CartPage } from "@webshop/pages";
import { useQuery } from "react-query";

export default function Cart() {
  const [cart, setCart] = useState<CartItemModel[] | undefined>(undefined);

  const totalPriceQuery = useQuery<string>("totalPrice", async () =>
    getCartTotalPriceRequest()
  );

  const cartQuery = useQuery<RemoteCartItem[]>("cart", async () =>
    getCartRequest()
  );

  const cartItemIds = cartQuery.data?.map((cartItem) => cartItem.id);

  const itemsQuery = useQuery<RemoteItem[]>(
    ["cartItems", { cartItemIds }],
    async () =>
      getItemsRequest({
        ids: cartItemIds,
      }).then((data) => data.content),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    (async () => {
      if (cartQuery.data && cartQuery.data.length > 0) {
        const { data } = await itemsQuery.refetch();
        if (data === undefined) {
          return;
        }
        const normalizedCart = normalize(cartQuery.data);
        const cartItems: CartItemModel[] = data.map((item) => ({
          ...item,
          quantity: normalizedCart[item.id].quantity,
          total: normalizedCart[item.id].total,
        }));
        setCart(cartItems);
      }
    })();
  }, [cartQuery.data?.length || 0]);

  /**
   * Remove item from cart, update local state and trigger total price request if cart is not empty.
   */
  const removeItem = (id: number) => {
    (async () => {
      try {
        await removeCartItemRequest(id);

        const updatedCart = cart!.filter((item) => item.id !== id);
        setCart(updatedCart);

        await totalPriceQuery.refetch();
      } catch (error) {
        console.error("Failed to save cart item", id);
      }
    })();
  };

  /**
   * Add item to cart, update local state and trigger total price request.
   */
  const saveItem = (id: number, quantity: number) => {
    (async () => {
      try {
        await updateCartItemRequest({ id, quantity });
        setCart((cart) =>
          cart!.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity,
                  total: "",
                }
              : item
          )
        );

        const cartItem = await getCartItemRequest(id);
        setCart((cart) =>
          cart!.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...cartItem,
                }
              : item
          )
        );

        await totalPriceQuery.refetch();
      } catch (error) {
        console.error("Failed to save cart item", id);
      }
    })();
  };

  return (
    <CartPage
      cartState={{
        error: cartQuery.error || itemsQuery.error,
        data: cart,
        loading: cartQuery.isLoading || itemsQuery.isLoading,
      }}
      totalPriceState={{
        loading: totalPriceQuery.isLoading,
        data: totalPriceQuery.data,
        error: totalPriceQuery.error,
      }}
      removeItem={removeItem}
      saveItem={saveItem}
    />
  );
}

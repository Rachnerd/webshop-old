import React, { useEffect, useState } from "react";
import { ClientItem, Paging } from "@webshop/models";
import { HomePage } from "@webshop/pages";
import { useAddToCartMutation, useItemsQuery } from "@webshop/graphql";

const PAGING: Paging = {
  size: 6,
  page: 0,
};

export default function Index() {
  const [items, setItems] = useState<ClientItem[]>([]);

  const itemsQuery = useItemsQuery({
    variables: {
      paging: PAGING,
    },
  });

  useEffect(() => {
    if (itemsQuery.data) {
      setItems(itemsQuery.data.items.content);
    }
  }, [itemsQuery.data]);

  const [addToCartMutation] = useAddToCartMutation();
  /**
   * Add item to cart remotely and update local state accordingly.
   */
  const addToCart = (id: number, quantity: number) => {
    (async () => {
      try {
        await addToCartMutation({
          variables: { id, quantity },
        });
        setItems((items) =>
          items.map((item) =>
            item.id !== id
              ? item
              : {
                  ...item,
                  amountInCart: quantity,
                }
          )
        );
      } catch (error) {
        console.error("Add item to cart failed", error);
      }
    })();
  };

  return (
    <HomePage
      addToCart={addToCart}
      itemsState={{
        loading: itemsQuery.loading,
        data: items,
        error: itemsQuery.error,
      }}
    />
  );
}

// export async function getStaticProps() {
//   const apolloClient = initializeApollo();
//
//   await apolloClient.query({
//     query: ItemsDocument,
//     variables: {
//       paging: {
//         page: 0,
//         size: 6,
//       },
//     },
//   });
//
//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//   };
// }

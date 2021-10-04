import React, { useEffect, useState } from "react";
import { ClientItem, Paging } from "@webshop/models";
import { HomePage } from "@webshop/pages";
import {
  useAddToCartMutation,
  useFastItemsQuery,
  useSlowItemsQuery,
} from "@webshop/graphql";
import { normalize } from "@webshop/utils";
import gql from "graphql-tag";

const PAGING: Paging = {
  size: 6,
  page: 0,
};

export default function Index() {
  const [items, setItems] = useState<ClientItem[]>([]);

  const fastItemsQuery = useFastItemsQuery({
    variables: PAGING,
  });

  const slowItemsQuery = useSlowItemsQuery({
    variables: PAGING,
  });

  const fastItems = fastItemsQuery.data;
  const slowItems = slowItemsQuery.data;

  useEffect(() => {
    if (fastItems) {
      setItems(fastItems.items.content);
    }
  }, [fastItems]);

  useEffect(() => {
    if (fastItems && slowItems) {
      const slowUpdates = normalize(slowItems.items.content);
      setItems((items) =>
        items.map((item) => ({
          ...item,
          ...(slowUpdates[item.id] || {}),
        }))
      );
    }
  }, [fastItems, slowItems]);

  const [addToCartMutation] = useAddToCartMutation();
  /**
   * Add item to cart remotely and update local state accordingly.
   */
  const addToCart = (id: number, quantity: number) => {
    (async () => {
      try {
        await addToCartMutation({
          variables: { id, quantity },
          update: (cache) =>
            cache.writeFragment({
              id: `Item:${id}`,
              fragment: gql`
                fragment UpdatedItem on Item {
                  amountInCart
                }
              `,
              data: {
                amountInCart: quantity,
              },
            }),
        });
      } catch (error) {
        console.error("Add item to cart failed", error);
      }
    })();
  };

  return (
    <HomePage
      addToCart={addToCart}
      items={{
        loading: fastItemsQuery.loading,
        data: items,
        error: fastItemsQuery.error,
      }}
    />
  );
}

// export async function getStaticProps() {
//   const apolloClient = initializeApollo();
//
//   await apolloClient.query({
//     query: FastItemsDocument,
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

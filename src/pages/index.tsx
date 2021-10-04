import React from "react";
import { Paging } from "@webshop/models";
import { HomePage } from "@webshop/pages";
import { useAddToCartMutation, useItemsQuery } from "@webshop/graphql";
import gql from "graphql-tag";

const PAGING: Paging = {
  size: 6,
  page: 0,
};

export default function Index() {
  const itemsQuery = useItemsQuery({
    variables: {
      paging: PAGING,
    },
  });

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
        loading: itemsQuery.loading,
        data: itemsQuery.data?.items.content,
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

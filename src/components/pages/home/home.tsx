import { ClientItem, RequestState } from "@webshop/models";
import React from "react";
import { ItemResult } from "@webshop/organisms";
import { Spinner } from "@webshop/atoms";
import { List } from "@webshop/molecules";
import styled from "styled-components";

interface HomeProps {
  items: RequestState<ClientItem[]>;
  addToCart: (id: number, quantity: number) => void;
}

export const HomePage: React.FunctionComponent<HomeProps> = ({
  items: { data, error, loading },
  addToCart,
}) =>
  loading ? (
    <Spinner style={{ alignSelf: "center" }}>Loading items...</Spinner>
  ) : error ? (
    <p style={{ alignSelf: "center" }}>Error</p>
  ) : data ? (
    <List>
      {data.map((item) => (
        <ListItem key={`item--${item.id}`}>
          <ItemResult item={item} onAddToCart={addToCart} />
        </ListItem>
      ))}
    </List>
  ) : (
    <p>No data</p>
  );

const ListItem = styled.li`
  padding: 8px;
`;

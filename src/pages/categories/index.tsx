import React from "react";
import { CategoriesPage } from "@webshop/pages";
import { getCategoriesRequest } from "@webshop/requests";
import { useQuery } from "react-query";

export default function Categories() {
  const categoriesQuery = useQuery<string[]>("categories", () =>
    getCategoriesRequest()
  );

  return (
    <CategoriesPage
      categoriesState={{
        loading: categoriesQuery.isLoading,
        data: categoriesQuery.data,
        error: categoriesQuery.error,
      }}
    />
  );
}

import { Paged, toQueryParams } from "@webshop/utils";
import { ClientItem, Paging, RemoteItem } from "@webshop/models";

export interface RemoteGetItemsParams {
  ids?: string[];
  paging?: Paging;
}

export const getItemsRequest = ({
  ids,
  paging,
}: RemoteGetItemsParams): Promise<Paged<RemoteItem>> =>
  fetch(
    `/api/items${toQueryParams({
      ...(paging || {}),
      ids: ids !== undefined ? ids.join(",") : undefined,
    })}`
  ).then((res) => res.json());

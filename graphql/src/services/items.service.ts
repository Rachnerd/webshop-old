import fetch from "node-fetch";
import { GQLPagingParams } from "../../.generated";
import { RemoteItem } from "../../../src/models";
import { Paged } from "../../../src/utils";

export class ItemsService {
  async get({
    page,
    size,
  }: GQLPagingParams): Promise<Paged<Required<RemoteItem>>> {
    return fetch(
      `http://localhost:3000/api/items?page=${page}&size=${size}`
    ).then((res) => res.json());
  }
}

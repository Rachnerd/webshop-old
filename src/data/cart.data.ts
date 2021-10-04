import cache from "memory-cache";

/**
 * Inmemory cart
 * Key value: id - quantity
 */
interface Cart {
  [id: string]: number;
}

const CART_CACHE_KEY = "cart";

const INITIAL_STATE: Cart = {
  "1": 2,
};

export const getCart = (): Cart =>
  cache.get(CART_CACHE_KEY) || cache.put(CART_CACHE_KEY, INITIAL_STATE);

export const updateCart = (cart: Cart): Cart => cache.put(CART_CACHE_KEY, cart);

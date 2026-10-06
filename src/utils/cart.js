export const getCartItemKey = (item) => JSON.stringify([
  item._id, item.selectedSize || '', item.selectedColor || '',
]);

export const mergeCartItem = (cart, product, quantity, selection = {}) => {
  const next = { ...product, selectedSize: selection.selectedSize || '', selectedColor: selection.selectedColor || '', quantity };
  const key = getCartItemKey(next);
  return cart.some((item) => getCartItemKey(item) === key)
    ? cart.map((item) => getCartItemKey(item) === key ? { ...item, quantity: item.quantity + quantity } : item)
    : [...cart, next];
};

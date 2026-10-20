// Store-wide settings. Update these with the real details before launch.
export const storeConfig = {
  email: "hello@velora.store",
  // Full international number, digits only (country code first, no + or spaces).
  whatsappNumber: "212608185151",
  hours: "Mon–Sat, 9am–6pm",
  freeShippingThreshold: 500,
  shippingCost: 30,
  // Must match STORE_MAX_QUANTITY_PER_ITEM in the backend
  maxQuantityPerItem: 10,
};

export function getShipping(subtotal: number) {
  return subtotal >= storeConfig.freeShippingThreshold
    ? 0
    : storeConfig.shippingCost;
}

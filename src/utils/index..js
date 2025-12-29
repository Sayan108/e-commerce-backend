import crypto from "crypto";

export const getAddressString = (address) => {
  return `${address.lineOne}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
};

export function generateOrderId() {
  const random = crypto.randomInt(100000, 999999); // 6 digits

  return `od-${random}`;
}

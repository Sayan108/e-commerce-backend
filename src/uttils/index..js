export const getAddressString = (address) => {
  return `${address.lineOne}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
};

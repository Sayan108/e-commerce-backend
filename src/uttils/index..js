export const getAddressString = (address) => {
  return `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
};

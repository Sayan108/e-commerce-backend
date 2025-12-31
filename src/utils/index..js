import crypto from "crypto";

class Utils {
  static getAddressString(address) {
    return `${address.lineOne}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
  }

  static generateOrderId() {
    const random = crypto.randomInt(100000, 999999); // 6 digits
    return `od-${random}`;
  }
}

export default Utils;

import { Messages } from "../config/messages.js";
import addressModel from "../models/address.model.js";

export const createAddress = async (req, res) => {
  try {
    const address = await addressModel.createAddress(req.body);

    res.json({
      address: {
        userId: address.userId,
        addressType: address.addressType,
        lineOne: address.lineOne,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
      },
      message: Messages.ADDRESS.ADDRESS_CREATED,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: Messages.ADDRESS.ERROR_ADDRESS_CREATION });
  }
};

export const getAllAddresses = async (req, res) => {
  try {
    const list = await addressModel.listAddressesByUserId(req.user.id);
    res.json({ list, message: Messages.ADDRESS.ADDRESS_FETCH_SUCCESS });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: Messages.ADDRESS.ERROR_ADDRESS_FETCH });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Address ID is required." });
    }
    const existingAddress = await addressModel.getAddressById(id);
    if (!existingAddress) {
      return res.status(404).json({ error: "Address not found." });
    }
    await addressModel.deleteAddress(id);
    res.json({ message: Messages.ADDRESS.ADDRESS_DELETED });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: Messages.ADDRESS.ERROR_ADDRESS_FETCH });
  }
};
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Address ID is required." });
    }
    const existingAddress = await addressModel.getAddressById(id);
    if (!existingAddress) {
      return res.status(404).json({ error: "Address not found." });
    }
    const updated = await addressModel.updateAddress(id, req.body);
    res.json({
      updated: { ...req.body },
      message: Messages.ADDRESS.ADDRESS_UPDATED,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error, message: Messages.ADDRESS.ERROR_ADDRESS_FETCH });
  }
};

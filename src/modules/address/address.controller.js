import { Messages } from "../../config/messages.js";
import AddressModel from "./address.model.js";

class AddressController {
  async createAddress(req, res) {
    try {
      const address = await AddressModel.createAddress(req.body);

      res.json({
        address,
        message: Messages.ADDRESS.ADDRESS_CREATED,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: Messages.ADDRESS.ERROR_ADDRESS_CREATION });
    }
  }

  async getAllAddresses(req, res) {
    try {
      const list = await AddressModel.listAddressesByUserId(req.user.id);
      res.json({ list, message: Messages.ADDRESS.ADDRESS_FETCH_SUCCESS });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: Messages.ADDRESS.ERROR_ADDRESS_FETCH });
    }
  }

  async deleteAddress(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Address ID is required." });
      }
      const existingAddress = await AddressModel.getAddressById(id);
      if (!existingAddress) {
        return res.status(404).json({ error: "Address not found." });
      }
      await AddressModel.deleteAddress(id);
      res.json({ message: Messages.ADDRESS.ADDRESS_DELETED });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: Messages.ADDRESS.ERROR_ADDRESS_FETCH });
    }
  }

  async updateAddress(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Address ID is required." });
      }
      const existingAddress = await AddressModel.getAddressById(id);
      if (!existingAddress) {
        return res.status(404).json({ error: "Address not found." });
      }
      const updated = await AddressModel.updateAddress(id, req.body);
      res.json({
        updated: { ...req.body },
        message: Messages.ADDRESS.ADDRESS_UPDATED,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error, message: Messages.ADDRESS.ERROR_ADDRESS_FETCH });
    }
  }
}

export default AddressController;

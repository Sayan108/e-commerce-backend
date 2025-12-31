import CartModel from "./cart.model.js";
import { Messages } from "../../config/messages.js";
import UserModel from "../auth/user.model.js";

class CartController {
  /* ===========================
     ✅ ADD TO CART
  ============================ */
  async addToCart(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found " });
      }
      if (req.body.quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Cart count can never be negative " });
      }
      const data = {
        userId: req.user.id,
        productId: req.body.productId,
        quantity: req.body.quantity || 1,
        itemname: req.body.itemname,
        price: req.body.price,
      };

      const cartItem = await CartModel.addToCart(data);

      await UserModel.updateUser(req.user.id, {
        cartItemCount: user.cartItemCount + 1,
      });

      res.json({
        cartItem,
        message: Messages.CART.ITEM_ADDED,
      });
    } catch (error) {
      res.status(500).json({
        error,
        message: Messages.CART.ERROR_ADD,
      });
    }
  }

  /* ===========================
     ✅ GET USER CART
  ============================ */
  async getCart(req, res) {
    try {
      const cart = await CartModel.getCartByUserId(req.user.id);

      res.json({
        cart,
        message: Messages.CART.FETCH_SUCCESS,
      });
    } catch (error) {
      res.status(500).json({
        error,
        message: Messages.CART.ERROR_FETCH,
      });
    }
  }

  /* ===========================
     ✅ UPDATE CART ITEM
  ============================ */
  async updateCart(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      if (quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Cart count can never be negative " });
      }

      const updated = await CartModel.updateCartItem(id, quantity);

      res.json({
        updated,
        message: Messages.CART.UPDATED,
      });
    } catch (error) {
      res.status(500).json({
        error,
        message: Messages.CART.ERROR_UPDATE,
      });
    }
  }

  /* ===========================
     ✅ DELETE CART ITEM
  ============================ */
  async deleteCartItem(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found " });
      }

      await CartModel.deleteCartItem(id);

      res.json({
        message: Messages.CART.DELETED,
      });
      await UserModel.updateUser(req.user.id, {
        cartItemCount: user.cartItemCount + 1,
      });
    } catch (error) {
      res.status(500).json({
        error,
        message: Messages.CART.ERROR_DELETE,
      });
    }
  }

  /* ===========================
     ✅ CLEAR FULL CART
  ============================ */
  async clearCart(req, res) {
    try {
      await CartModel.clearCart(req.user.id);

      res.json({
        message: Messages.CART.CART_CLEARED,
      });
    } catch (error) {
      res.status(500).json({
        error,
        message: Messages.CART.ERROR_CLEAR,
      });
    }
  }
}

export default CartController;

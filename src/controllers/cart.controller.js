import cartModel from "../models/cart.model.js";
import { Messages } from "../config/messages.js";

/* ===========================
   ✅ ADD TO CART
=========================== */
export const addToCart = async (req, res) => {
  try {
    const data = {
      userId: req.user.id,
      productId: req.body.productId,
      quantity: req.body.quantity || 1,
      itemname: req.body.itemname,
      price: req.body.price,
    };

    const cartItem = await cartModel.addToCart(data);

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
};

/* ===========================
   ✅ GET USER CART
=========================== */
export const getCart = async (req, res) => {
  try {
    const cart = await cartModel.getCartByUserId(req.user.id);

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
};

/* ===========================
   ✅ UPDATE CART ITEM
=========================== */
export const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const updated = await cartModel.updateCartItem(id, quantity);

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
};

/* ===========================
   ✅ DELETE CART ITEM
=========================== */
export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;

    await cartModel.deleteCartItem(id);

    res.json({
      message: Messages.CART.DELETED,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: Messages.CART.ERROR_DELETE,
    });
  }
};

/* ===========================
   ✅ CLEAR FULL CART
=========================== */
export const clearCart = async (req, res) => {
  try {
    await cartModel.clearCart(req.user.id);

    res.json({
      message: Messages.CART.CART_CLEARED,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: Messages.CART.ERROR_CLEAR,
    });
  }
};

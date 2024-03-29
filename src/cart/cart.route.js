import express from "express";
import { isBuyer } from "../middleware/authentication.middleware.js";
import validateReqBody from "../middleware/validation.middleware.js";
import {
  addItemToCartValidationSchema,
  updateCartQuantityValidationSchema,
} from "./cart.validation.js";
import mongoose from "mongoose";
import Cart from "./cart.model.js";
import Product from "../product/product.model.js";
import validateIdFromReqParams from "../middleware/validate.id.middleware.js";

const router = express.Router();

// add item to cart
router.post(
  "/cart/item/add",
  isBuyer,
  validateReqBody(addItemToCartValidationSchema),
  async (req, res) => {
    // extract cart data from req.body
    const cartData = req.body;

    // check product id from mongo id validity
    const isValidMongoId = mongoose.isValidObjectId(cartData.productId);

    // if not valid mongo id, throw error
    if (!isValidMongoId) {
      return res.status(400).send({ message: "Invalid mongo id." });
    }

    // find product using product id
    const product = await Product.findOne({ _id: cartData.productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // check if ordered quantity is less than or equal to product available quantity
    if (cartData.orderedQuantity > product.availableQuantity) {
      return res.status(409).send({
        message: "Ordered quantity is greater than available quantity.",
      });
    }

    // find cart using productId and buyerId
    const cartItem = await Cart.findOne({
      buyerId: req.loggedInUserId,
      productId: cartData.productId,
    });

    // if cart item is present
    if (cartItem) {
      return res.status(409).send({
        message:
          "Item is already added to cart. Try updating quantity from cart.",
      });
    }

    // add item to cart
    await Cart.create({
      buyerId: req.loggedInUserId,
      productId: cartData.productId,
      orderedQuantity: cartData.orderedQuantity,
    });

    return res
      .status(200)
      .send({ message: "Item is added to cart successfully." });
  }
);

// clear/flush cart
router.delete("/cart/clear", isBuyer, async (req, res) => {
  const loggedInUserId = req.loggedInUserId;

  // remove cart items for logged in user
  await Cart.deleteMany({ buyerId: loggedInUserId });

  return res.status(200).send({ message: "Cart is cleared successfully." });
});

// remove single product from cart
router.delete(
  "/cart/item/remove/:id",
  isBuyer,
  validateIdFromReqParams,
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    // find product by id
    const product = await Product.findOne({ _id: productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // remove product for this user from cart
    await Cart.deleteOne({ buyerId: req.loggedInUserId, productId: productId });

    // send res
    return res
      .status(200)
      .send({ message: "Item is removed from cart successfully." });
  }
);
// update quantity in cart
router.put(
  "/cart/item/update/quantity/:id",
  isBuyer,
  validateIdFromReqParams,
  validateReqBody(updateCartQuantityValidationSchema),
  async (req, res) => {
    // extract productId from req.params
    const productId = req.params.id;

    // extract buyerId from req.loggedInUserId
    const buyerId = req.loggedInUserId;

    // extract action from req.body
    const actionData = req.body;

    // find product using product id
    const product = await Product.findOne({ _id: productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    //product's available quantity
    const productAvailableQuantity = product?.availableQuantity;

    // find cart
    const cartItem = await Cart.findOne({
      buyerId: buyerId,
      productId: productId,
    });

    // if not cart item, throw error
    if (!cartItem) {
      return res.status(404).send({ message: "Cart item does not exist." });
    }

    // previous ordered quantity from cart item
    let previousOrderedQuantity = cartItem.orderedQuantity;

    let newOrderedQuantity;

    if (actionData.action === "inc") {
      newOrderedQuantity = previousOrderedQuantity + 1;
    } else {
      newOrderedQuantity = previousOrderedQuantity - 1;
    }

    if (newOrderedQuantity < 1) {
      return res
        .status(403)
        .send({ message: "Ordered quantity cannot be zero." });
    }

    if (newOrderedQuantity > productAvailableQuantity) {
      return res
        .status(403)
        .send({ message: "Product reached available quantity." });
    }

    // update cart item with new ordered quantity
    await Cart.updateOne(
      { buyerId: buyerId, productId: productId },
      {
        $set: {
          orderedQuantity: newOrderedQuantity,
        },
      }
    );

    return res
      .status(200)
      .send({ message: "Cart item quantity is updated successfully." });
  }
);

export default router;

import express from "express";
import { isBuyer } from "../middlewares/authentication.middleware.js";
import validateReqBody from "../middlewares/validation.middleware.js";
import { addItemToCartValidationSchema } from "./cart.validation.js";
import mongoose from "mongoose";
import Cart from "./cart.model.js";
import Product from "../product/product.model.js";

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

// clear cart
router.delete("/cart/clear", isBuyer, async (req, res) => {
  const loggedInUserId = req.loggedInUserId;

  // remove cart items from logged in user
  await Cart.deleteMany({ buyerId: loggedInUserId });

  return res.status(200).send({ message: "Cart is cleared successfully." });
});
// list cart items
router.get("/cart/item/list", isBuyer, async (req, res) => {
  // extract buyerId from req.loggedInUserId
  const buyerId = req.loggedInUserId;

  const cartData = await Cart.aggregate([
    {
      $match: {
        buyerId: buyerId,
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $project: {
        name: { $first: "$productDetails.name" },
        brand: { $first: "$productDetails.brand" },
        unitPrice: { $first: "$productDetails.price" },
        image: { $first: "$productDetails.image" },
        orderedQuantity: 1,
      },
    },
  ]);

  return res.status(200).send({ message: "success", cartData: cartData });
});
export default router;

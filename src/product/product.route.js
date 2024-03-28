import { Router } from "express";
import { isSeller, isUser } from "../middleware/authentication.middleware.js";
import validateReqBody from "../middleware/validation.middleware.js";
import { addProductValidationSchema } from "./product.validation.js";
import Product from "./product.model.js";
import validateIdFromReqParams from "../middleware/validate.id.middleware.js";
const router = Router();
// add product
router.post(
  "/product/add",
  isSeller,
  validateReqBody(addProductValidationSchema),
  async (req, res) => {
    //extract new product from req.body
    const newProduct = req.body;
    // extract loginUserId
    const loggedInUserId = req.loggedInUserId;
    newProduct.sellerId = loggedInUserId;
    // create product

    await Product.create(newProduct);
    // send response
    return res.status(200).send({ message: "product is added successfully" });
  }
);

router.get(
  "/product/details/:id",
  isUser,
  validateIdFromReqParams,
  async (req, res) => {
    // extract product
    const productId = req.params.id;
    // find product
    const product = await Product.findOne({ _id: productId });
    // if no product throw error
    if (!product) {
      return res.status(400).send({ message: "product does not exist" });
    }
    // send response
    return res
      .status(200)
      .send({ message: "success", productdetails: product });
  }
);
// delete product
router.delete(
  "/product/delete/:id",
  isSeller,
  validateIdFromReqParams,
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    // find product
    const product = await Product.findOne({ _id: productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist." });
    }

    // check product ownership

    // to be product owner: product sellerId must be equal to logged in user id
    const sellerId = product.sellerId;

    const loggedInUserId = req.loggedInUserId;

    // const isProductOwner = String(sellerId) === String(loggedInUserId);
    // alternative code
    const isProductOwner = sellerId.equals(loggedInUserId);

    // if not product owner, throw error
    if (!isProductOwner) {
      return res
        .status(403)
        .send({ message: "You are not owner of this product." });
    }

    // delete product
    await Product.deleteOne({ _id: productId });

    // send response
    return res
      .status(200)
      .send({ message: "Product is removed successfully." });
  }
);
// edit product details

export default router;

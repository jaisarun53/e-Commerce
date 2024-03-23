import { Router } from "express";
import { isSeller } from "../middleware/authentication.middleware.js";
import validateReqBody from "../middleware/validation.middleware.js";
import { addProductValidationSchema } from "./product.validation.js";
import Product from "./product.model.js";
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
export default router;

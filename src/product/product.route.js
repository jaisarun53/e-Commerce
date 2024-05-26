import { Router } from "express";
import {
  isBuyer,
  isSeller,
  isUser,
} from "../middleware/authentication.middleware.js";
import validateReqBody from "../middleware/validation.middleware.js";
import {
  addProductValidationSchema,
  paginationValidationSchema,
} from "./product.validation.js";
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
router.put(
  "/product/edit/:id",
  isSeller,
  validateIdFromReqParams,
  validateReqBody(addProductValidationSchema),
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;
    // find product by id
    const product = await Product.findOne({ _id: productId });
    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "product doesnot exist" });
    }
    // check for product ownership
    // product's sellerId must be same with loggedInUserId
    const productOwnerId = product.sellerId;
    const loggedInUserId = req.loggedInUserId;
    const isProductOwner = productOwnerId.equals(loggedInUserId);
    // if not owner of product, throw error
    if (!isProductOwner) {
      return res
        .status(403)
        .send({ message: "you are not the owner of this product" });
    }
    // extract newValues from req.body
    const newValues = req.body;
    // edit product
    await Product.updateOne({ _id: productId }, { $set: { ...newValues } });
    // send response
    return res.status(200).send({ message: "Product is Updated Successfully" });
  }
);
// list product by buyer
router.post(
  "/product/list/buyer",
  isBuyer,
  async (req, res, next) => {
    //  extract new values from req.body
    const newValues = req.body;
    // validate new values using yup schema
    try {
      const validatedData = await paginationValidationSchema.validate(
        newValues
      );
      req.body = validatedData;
    } catch (error) {
      // if validation fails throw error
      return res.status(400).send({ message: error.message });
    }

    // call next function
    next();
  },
  async (req, res) => {
    const { page, limit } = req.body;
    const skip = (page - 1) * limit;
    const products = await Product.aggregate([
      { $match: {} },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          name: 1,
          brand: 1,
          price: 1,
          category: 1,
          freeShipping: 1,
          image: 1,
          availableQuantity: 1,
          description: 1,
        },
      },
    ]);
    // send response
    return res.status(200).send({ message: "success", productList: products });
  }
);

// list product by seller
router.post(
  "/product/list/seller",
  isSeller,
  validateReqBody(paginationValidationSchema),
  async (req, res) => {
    // extract pagination data from req.body
    const { page, limit } = req.body;

    // calculate skip
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      {
        $match: {
          sellerId: req.loggedInUserId,
        },
      },

      { $skip: skip },

      { $limit: limit },

      {
        $project: {
          sellerId: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);

    return res.status(200).send({ message: "success", productList: products });
  }
);
export default router;

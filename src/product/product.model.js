import mongoose from "mongoose";
// set rules
const productScema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
      maxlength: 60,
    },
    brand: {
      type: String,
      require: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      trim: true,
      enum: [
        "grocery",
        "electronics",
        "furniture",
        "electrical",
        "kitchen",
        "kids",
        "sports",
        "auto",
        "clothes",
        "shoes",
        "pharmaceuticals",
        "stationery",
        "cosmetics",
      ],
    },
    freeShiping: {
      type: Boolean,
      default: false,
    },
    sellerId: {
      type: mongoose.ObjectId,
      required: true,
      ref: "users",
    },
    availableQuantity: {
      type: "Number",
      min: 1,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      required: true,
      min: 200,
    },
    image: {
      type: String,
      default: null,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
// create collection
const Product = mongoose.model("Product", productScema);
export default Product;

import mongoose from "mongoose";

// set rule
const cartSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.ObjectId,
    ref: "users",
    required: true,
  },

  productId: {
    type: mongoose.ObjectId,
    ref: "products",
    required: true,
  },

  orderedQuantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

// create table
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;

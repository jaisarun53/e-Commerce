import expresss from "express";
import connectDB from "./connect.db.js";
import userRoutes from "./src/user/user.route.js";
import productRoutes from "./src/product/product.route.js";
import cartRoutes from "./src/cart/cart.route.js";
import cors from "cors";
const app = expresss();
// to make  app understand json
app.use(expresss.json());
// database connection

// enable cors
// cross origin resource sharing
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cors());
connectDB();
// regiater routes
app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);
// server and port
const PORT = 8001;
app.listen(PORT, () => {
  console.log(`the app is listening on port ${PORT}`);
});

import expresss from "express";
import connectDB from "./connect.db.js";
import userRoutes from "./src/user/user.route.js";
import productRoutes from "./src/product/product.route.js";
const app = expresss();
// to make  app understand json
app.use(expresss.json());
// database connection
connectDB();
// regiater routes
app.use(userRoutes);
app.use(productRoutes);
// server and port
const PORT = 8001;
app.listen(PORT, () => {
  console.log(`the app is listening on port ${PORT}`);
});

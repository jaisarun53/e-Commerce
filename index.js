import expresss from "express";
import connectDB from "./connect.db.js";
import userRoutes from "./src/user/user.route.js";
const app = expresss();
// to make  app understand json
app.use(expresss.json());
// database connection
connectDB();
// regiater routs
app.use(userRoutes);
// server and port
const PORT = 8001;
app.listen(PORT, () => {
  console.log(`the app is listening on port ${PORT}`);
});

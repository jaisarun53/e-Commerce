import Yup from "yup";

export const addProductValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required.")
    .trim()
    .max(60, "Name must be at max 60 characters."),
  brand: Yup.string()
    .required("Brand is required.")
    .trim()
    .max(60, "Brand must be at max 60 characters."),
  price: Yup.number()
    .min(0, "Price cannot be negative number.")
    .required("Price is required."),
  category: Yup.string()
    .trim()
    .required("Category is required.")
    .oneOf([
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
    ]),
  freeShipping: Yup.boolean(),
  availableQuantity: Yup.number()
    .min(1, "Available quantity must be at least 1.")
    .integer("Available quantity cannot be float number."),
  description: Yup.string()
    .required("Description is required.")
    .min(10, "Description must be at least 10 characters.")
    .max(1000, "Description must be at max 1000 characters."),
});

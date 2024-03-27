import Yup from "yup";

export const addItemToCartValidationSchema = Yup.object({
  productId: Yup.string().required("Product id is required.").trim(),
  orderedQuantity: Yup.number()
    .min(1, "Ordered quantity must be at least 1.")
    .required("Ordered quantity is required."),
});

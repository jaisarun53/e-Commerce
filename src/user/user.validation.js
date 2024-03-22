import yup from "yup";
export const registerUserValidateSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .max(30, "first name must be at max 30 characters")
    .required("first name must be required"),
  lastName: yup
    .string()
    .trim()
    .max(30, "lastname must be at max 30 characters")
    .required("last name must be required"),
  email: yup
    .string()
    .email("must be a valid email")
    .required("email is required")
    .max(65, "email must be at max 65 characters")
    .trim()
    .lowercase(),
  password: yup
    .string()
    .min(6, "password must be at least 6 character")
    .max(20, "password must be at max 20 character")
    .required("password must be required"),
  role: yup
    .string()
    .required("role must be required")
    .trim()
    .oneOf(["buyer", "seller"], "role must be either buyer or seller"),
  gender: yup
    .string()
    .trim()
    .oneOf(
      ["male", "female", "preferNotToSay"],
      "gender must be either male or female or preferNotToSay"
    ),
});

export const loginUserValidationSchema = yup.object({
  email: yup
    .string()
    .required("email must be required")
    .email("must be a valid email")
    .lowercase()
    .trim(),
  password: yup.string().required("password must be required"),
});

const validateReqBody = (ValidationSchema) => {
  return async (req, res, next) => {
    // extract new data from req.body
    const newData = req.body;
    // validate new data
    try {
      const validatedData = await ValidationSchema.validate(newData);
      req.body = validatedData;
    } catch (error) {
      // if fails throw error
      return res.status(400).send({ message: error.message });
    }

    // next function
    next();
  };
};
export default validateReqBody;

const validateForm = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      errors: {
        wrap: {
          label: "",
        },
      },
    });

    if (error) {
      //   const errorsList = error.details.map((error) => error.message);
      //   return res.status(400).send(errorsList);
      return res.status(400).send(error);
    }
    next();
  };
};

module.exports = validateForm;

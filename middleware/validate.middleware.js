const { body } = require("express-validator");

const valdite = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage({ msg: "this title not provided" })
      .isLength({ min: 2 })
      .withMessage({ msg: "at least 2 digit" }),
    body("price").notEmpty().withMessage({
      msg: "this price not provided",
    }),
  ];
};

module.exports = valdite;

const { check } = require('express-validator');

exports.add_product_validation = [
  check('product_name', 'Product Name must be minimum 3 character').exists().isLength({ min: 3 }),
  check('product_stock', 'Product Stock must be maximum 10000').exists().isNumeric().isLength({ max: 10000 })
]
const router = require('express').Router()
const Product = require('../controllers')

router.post('/product', Product.getProducts)
router.get('/categories', Product.getCategory)

module.exports = router
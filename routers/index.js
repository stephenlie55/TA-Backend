const router = require('express').Router()
const Product = require('../controllers')

router.get('/product', Product.getProducts)

module.exports = router
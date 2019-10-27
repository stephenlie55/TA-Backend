const fs = require('fs')

class ProductController {
    static getProducts(req, res) {
        fs.readFile('./source/finalData.json', (err, data) => {
            if (data) {
                res.status(200).json(JSON.parse(data))
            } else if (err) {
                res.status(500).json({
                    message: 'Internal server error',
                })
            }
        })
    }
}

module.exports = ProductController
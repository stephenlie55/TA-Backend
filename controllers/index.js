const fs = require('fs')
const { Connection, Request } = require('tedious')

const connectionInfo = {
    userName: "knight",
    password: "Arief-1305",
    databaseName: "ecommerceanalysis",
    databaseUrl: "ecommerceanalysis.database.windows.net",
    queryList: {
        getCategory: `
            SELECT distinct kategori
            FROM [dbo].[ecommercetrends_produk]
        `,
        getUlasan: function(category) {
            return `
            SELECT db_produk.nama_produk, [dbo].[ecommercetrends_ulasan].produk_id, [dbo].[ecommercetrends_ulasan].tanggal
            FROM [dbo].[ecommercetrends_ulasan]
            INNER JOIN (SELECT nama_produk, urlproduk FROM [dbo].[ecommercetrends_produk] WHERE kategori LIKE '%${category}%')
            AS db_produk
            ON db_produk.urlproduk=[dbo].[ecommercetrends_ulasan].produk_id
        `
        }
    }
}

const config = {
    authentication: {
        options: {
            userName: connectionInfo.userName,
            password: connectionInfo.password
        },
        type: "default"
    },
    server: connectionInfo.databaseUrl,
    options: {
        database: connectionInfo.databaseName,
        encrypt: true
    }
}

const connection = new Connection(config)

function queryDatabase(query, cb) {
    console.log("Start queryDatabase")
    let dataObj = {}
    let datum = {}

    const request = new Request( query, ( err, rowCount) => {
        if (err) {
            console.log(err.message)
        } else {
            console.log(`${rowCount} row(s) returned`)
            cb(dataObj)
        }
    })

    request.on("row", (columns) => {
        columns.forEach( (column) => {
            datum[column.metadata.colName] = column.value
        })

        if (query !== connectionInfo.queryList.getCategory) {
            let tanggal = new Date(datum.tanggal)
            datum.tanggal = `${tanggal.getFullYear()}-${String(tanggal.getMonth()).length === 2 ? tanggal.getMonth() : "0" + String(tanggal.getMonth())}-${String(tanggal.getDate()).length === 2 ? tanggal.getDate() : "0" + String(tanggal.getDate())}`
            if (!dataObj[datum.nama_produk]) {
                dataObj[datum.nama_produk] = {
                    data: []
                }
                dataObj[datum.nama_produk].data.push(datum)
            } else {
                dataObj[datum.nama_produk].data.push(datum)
            }
        } else {
            dataObj[datum.kategori] = datum
        }

        datum = {}
    })

    connection.execSql(request)
    
}

class ProductController {
    static getProducts(req, res) {
        console.log(connectionInfo.queryList.getUlasan(req.body.category))
        queryDatabase(connectionInfo.queryList.getUlasan(req.body.category), (data) => {
            res.status(200).json(data)
        })
    }

    static getCategory(req, res) {
        queryDatabase(connectionInfo.queryList.getCategory, (data) => {
            res.status(200).json(data)
        })
    }
}

module.exports = ProductController
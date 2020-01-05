const { Connection, Request } = require("tedious");

let connectionInfo = {
    userName: "knight",
    password: "Arief-1305",
    databaseName: "ecommerceanalysis",
    databaseUrl: "ecommerceanalysis.database.windows.net"
}

let queryList = {
    getCategory: `
        SELECT SUM(jumlah_ulasan) as total_jumlah_ulasan, kategori
        FROM [dbo].[ecommercetrends_produk] 
        GROUP BY kategori
    `,
    getUlasan: `
        SELECT produk_id, tanggal
        FROM [dbo].[ecommercetrends_ulasan]
    `

}
    
// Create connection to database
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
};

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    queryDatabase();
  }
});

function queryDatabase() {
  console.log("Reading rows from the Table...");
  // Read all rows from table
  const request = new Request(
    queryList.getCategory,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  let datum = {}
  request.on("row", columns => {
    columns.forEach(column => {
        datum[column.metadata.colName] = column.value
    });
    // let tanggal = new Date(datum.tanggal)
    // datum.tanggal = `${tanggal.getFullYear()}-${String(tanggal.getMonth()).length === 2 ? tanggal.getMonth() : "0" + String(tanggal.getMonth())}-${String(tanggal.getDate()).length === 2 ? tanggal.getDate() : "0"+String(tanggal.getDate())}`
    
    console.log(datum)
    datum = {}
  });

  connection.execSql(request);
}
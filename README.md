# Clustering Data with EM Algorithm
## Requirements: 
- Node.js with version 10.x or above
- NPM with version 6.x or above

## How to use:
-----
1. Open your command prompt / terminal
2. Change to specific directory where `preprocessing.js` file is located
3. Run `npm install`
3. Run `node ./preprocessing.js`
4. Output file will be stored as JSON file in `./source/finalData.json`

## REST API Routes:
-----
GET `/product`
### Response
- Status code 200:
`
    {
        "Delli Aldo M-19261 Mens Slip On Loafers": {
            "avgRating": 3.84,
            "data": [
                {
                    "productName": "Delli Aldo M-19261 Mens Slip On Loafers",
                    "rating": "5.0 out of 5 stars",
                    "productShortName": "Delli Aldo M-",
                    "date": "June 3, 2015"
                },
                {
                    "productName": "Delli Aldo M-19261 Mens Slip On Loafers",
                    "rating": "5.0 out of 5 stars",
                    "productShortName": "Delli Aldo M-",
                    "date": "July 15, 2015"
                },
            ]
        "ALDO Mens Galerrang-r Oxford": {
            "avgRating": 5,
            "data": [
                {
                    "productName": "ALDO Mens Galerrang-r Oxford",
                    "rating": "5.0 out of 5 stars",
                    "productShortName": "ALDO",
                    "date": "April 4, 2018"
                }
            ]
        }
    }
`
- Status code 500:
`
    {
        "message": "Internal server error
    }
`

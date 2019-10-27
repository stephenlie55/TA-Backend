let fs = require('fs')
let data = fs.readFileSync('../source/sample_data.csv', 'utf8')
let { parsing, separateSame, countAvgRating, sortingByDate } = require('./library')

let finalData = sortingByDate(countAvgRating(separateSame(parsing(data.split('\n')))))

fs.writeFileSync('../source/finalData.json', JSON.stringify(finalData), 'utf8')
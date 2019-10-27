class MethodList {
    
    static parsing(data) {
        let parsedData = []
        for (var i=0; i<data.length; i++) {
            let index = []
            for (var k=0; k<data[i].length; k++) {
                if (data[i][k] == `"`) {
                    index.push(k)
                }
            }
            let date = data[i].substr(index[0], (index[1]-index[0])+1)
            let date2 = data[i].substr(index[0]+1, index[1]-index[0]-1)
            data[i] = data[i].replace(`${date},`, '' )
            let temp = data[i].split(',')
            let obj = {
                productName: temp[0],
                rating: temp[1],
                productShortName: temp[2],
                date: date2,
            }
            parsedData.push(obj)
        }
        return parsedData
    }

    static separateSame(data) {
        let obj = {}
        data.forEach( (datum) => {
            if (obj[datum.productName] === undefined) {
                obj[datum.productName] = {
                    avgRating: 0,
                    data: []
                }
                obj[datum.productName].data.push(datum)
            } else {
                obj[datum.productName].data.push(datum)
            }
        })
        return obj
    }

    static countAvgRating(obj) {
        for (var key in obj) {
                obj[key].data.forEach( (datum) => {
                        if (datum.rating !== 'NA') {
                                obj[key].avgRating += Number(datum.rating.substr(0,2))
                        } else {
                                obj[key].avgRating += 0
                        }
                })
                obj[key].avgRating = obj[key].avgRating / obj[key].data.length
        }
        return obj
    }

    static sortingByDate(obj) {
        let index = 0
        for (var key in obj) {
            for (var i=0; i<obj[key].data.length; i++) {
                for (var j=0; j<(obj[key].data.length-i-1); j++) {
                    let temp
                    if (obj[key].data[j].date === 'Unknown Date') {
                        temp = obj[key].data[j]
                        obj[key].data[j] = obj[key].data[j+1]
                        obj[key].data[j+1] = temp
                    } else if (obj[key].data[j+1].date === 'Unknown Date') {
                        continue
                    } else {
                            if (new Date(obj[key].data[j].date) > new Date(obj[key].data[j+1].date)) {
                                temp = obj[key].data[j]
                                obj[key].data[j] = obj[key].data[j+1]
                                obj[key].data[j+1] = temp
                            }
                    }
                }
            }
        }
        return obj
    }

}

module.exports = MethodList
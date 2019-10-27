require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 3000 
const index=require('./routers/index.js')
const cors= require('cors')
const mongoose = require('mongoose')
const connection = 'mongodb://localhost:27017/testingdb'

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/', index)

app.listen(port, () => {
    console.log('Running on port: ', port)
    // mongoose.connect(connection, {useNewUrlParser: true})
    // .then( () => {
    //     console.log('Connected to db')
    // })
    // .catch((err)=>{
    //     console.log(err)
    // })
})
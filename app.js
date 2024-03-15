//Import the path library 
const path = require('path')
//Import Express
const express = require('express')
const zipdb = require('zippity-do-dah')
//Import the forcast library
const forecastIo = require('forecastio')


//Init the instance of express app
const app = express()

//Init the instance of forecastio library with a unique api key 
const weather  = new forecastIo("Your forecastio api key")

//Establish a public path as dir to display from.
app.use(express.static(path.resolve(__dirname, "public")))

//Establish the views dir path
app.use('views', path.resolve(__dirname, "views"))

//Establish express view engine that supports the ejs format
app.set('view engine', 'ejs')

//Make root renders for index.js
app.get("/", (req, res) => {
    res.render("index")
})

//Regexto filter throught the api call
app.get(/^\/(\d{5})$/, (req, res, next) => {
    //Provide variables to use as arguments in the .forecast() method
    const zipcode = req.params[0]
    const location = zipdb.zipcode(zipcode)

    if(!location.zipcode) {
        next()
        return
    } 

    //Callback for forecast() method with args stated below
    weather.forecast(latitude, longtitude, (err, data) => {
        //Handle the errors
        if(err) {
            next()
            return
        } 

        //Format and return a response as .json
        res.json({
            zipcode: zipcode,
            temperature: data.currently.temperature,
        })
    })
})

//Create a 404 view page
app.use((req, res) => {
    res.status(404).render("404")
})

//A simple server method
app.listen(3000)
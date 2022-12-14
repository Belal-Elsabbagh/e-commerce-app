const config = require('./config')
const express = require('express');
const {
    usersController,
    productsController,
    ordersController,
    categoriesController
} = require('./controllers');
const {
    errorHandler,
    requestLogger,
    authenticateBearerToken,
    paginationDefaultValues
} = require('./middleware');
const { STATUS_CODES } = require('./config/constants');
const bodyParser = require('body-parser').json({})

let app = express()
try {
    app.use(bodyParser)
    app.use(requestLogger)
    // Deactivate to test the api without authentication
    app.use(authenticateBearerToken)
    app.use(paginationDefaultValues)
    usersController(app)
    productsController(app)
    ordersController(app)
    categoriesController(app)
    app.use(errorHandler)
    app.listen(config.server.port, config.server.host)
    console.log(`Server started on http://${config.server.host}:${config.server.port}`)
} catch (err) {
    console.log(err)
    process.exit(STATUS_CODES.Default)
}
module.exports = app

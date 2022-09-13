const {productServices, orderServices} = require('../services');
const {validate} = require('../validation')
const authorize = require('../auth')
const {AUTHORIZATION_RESOURCE_NAMES: resource} = require('../config/constants');
const {productSchema} = require('../validation').validationSchemas

/**
 * The products controller
 * @param {Express} app
 */
module.exports = (app) => {
    app.get('/products', async (req, res, next) => {
        try {
            authorize(req.tokenData, 'read:any', resource.product)
            res.status(200).json(await productServices.get(req.query))
        } catch (err) {
            next(err)
        }
    });

    app.get('/products/bestseller', async (req, res, next) => {
        try {
            authorize(req.tokenData, 'read:any', resource.product)
            res.status(200).json(await orderServices.getMostOrderedProduct())
        } catch (err) {
            next(err)
        }
    });

    app.post('/products', async (req, res, next) => {
        try {
            authorize(req.tokenData, 'create:any', resource.product)
            let newProduct = await validate(productSchema, req.body)
            res.status(201).json(await productServices.add(newProduct));
        } catch (err) {
            next(err)
        }
    });
}
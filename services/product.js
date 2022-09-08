const {NotFoundError} = require('../errors');
const {productModel} = require('../models');
const BaseService = require("./BaseService");

class ProductServices extends BaseService {
    constructor() {
        super(productModel);
    }

    async get(filter = {}) {
        const queryResult = await this.model.find(filter).populate('category');
        if (queryResult === null) throw new NotFoundError("No product was found having these parameters")
        return queryResult
    }
}

module.exports = new ProductServices();
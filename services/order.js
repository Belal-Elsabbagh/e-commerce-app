const {ForbiddenError} = require('../errors');
const {orderModel} = require('../models');
const productServices = require('./product')
const BaseService = require("../models/BaseService");

class OrderServices extends BaseService {
    constructor() {
        super(orderModel);
    }

    async add(orderObject) {
        orderObject.products = await Promise.all(orderObject.products.map(async i => {
            return await productServices.getById(i)
        }))
        return await this.model.create(orderObject)
    }

    async deleteOwnOrder(orderId, userId) {
        const order = await super.getById(orderId)
        if (order.userId !== userId) throw new ForbiddenError('You are not authorized to delete this order.')
        return await this.model.findByIdAndDelete(orderId)
    }

    async getMostOrderedProduct() {
        const aggregationResult = await this.model.aggregate([
            {'$unwind': '$products'},
            {'$sortByCount': '$products._id'},
            {'$limit': 1}
        ])
        const productData = aggregationResult[0]
        const doc = await productServices.getById(productData._id.toString())
        return {...(doc._doc), timesOrdered: productData.count}
    }
}

module.exports = new OrderServices();
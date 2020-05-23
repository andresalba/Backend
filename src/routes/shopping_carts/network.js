/**Network to manage endpoints about user's shopping cart
 * @module routes/shopping_carts/network
 */
const express = require('express');
const router = express.Router();
const response = require('../../../network/response');
const ControllerShoppingCart = require('./index')

/**
 * Router endpoint of Shopping cart
 *@type {router} - Routs to manage Shopping carts
 */
router.post('/', addProductToCart);
router.patch('/', updateQtyProductOfCart);
router.delete('/', removeProductFromCart);
router.get('/:id', getShoppingCartUser);

/**
 * API Endpoint to Create a shopping cart and insert a product into.
 * @method POST 
 * @param {Object} req - The User and product information 
 * @returns {Object} res - result of the addition product into a shopping cart
 */
async function addProductToCart(req, res, next){
    try {
        const addProductRes = await ControllerShoppingCart.addProductToCart(req.body);
        response.success(req, res, addProductRes, 201);
    } catch( err){
        response.error(req, res, err.message, 500, 'error network add product to cart');
    }
}
/**
* API Endpoint to get the shopping cart of an user id target.
* @method GET 
* @param {Object} req - The User ID 
* @returns {Array.<Object>} res - shopping cart
*/
async function getShoppingCartUser(req, res, next){
    try {
        const cartGetByUserId = await ControllerShoppingCart.getUserShoppingCart(req.params.id);
        response.success(req, res, cartGetByUserId, 200);
    } catch( err){
        response.error(req, res, err.message, 500, 'error network user shopping cart');
    }
}
/**
* API Endpoint to remove a product from shopping cart
* @method GET 
* @param {Object} req - id_user, id_product: Information to find the product and remove it.
* @returns {Array.<Object>} res - remove operation result
*/
async function removeProductFromCart(req, res, next){
    try {
        const removeProductCartResult = await ControllerShoppingCart.removeProductFromCart(req.body.id_user, req.body.id_product);
        response.success(req, res, removeProductCartResult, 201);
    } catch( err){
        response.error(req, res, err.message, 500, 'error network shopping cart - remove product from shopping cart');
    }
}
/**
* API Endpoint to update the quantiry of a product from shopping cart
* @method PATCH 
* @param {Object} req - id_user, id_product, new_qty: Information to find the product and update it.
* @returns {Array.<Object>} res - update operation result
*/
async function updateQtyProductOfCart(req, res, next){
    try {
        const updateQtyProductCartRes = await ControllerShoppingCart.updateQtyProductOfCart(req.body.id_user, req.body.id_product, req.body.new_qty);
        response.success(req, res, updateQtyProductCartRes, 201);
    } catch( err){
        response.error(req, res, err.message, 500, 'error network shopping cart - update qty of product from shopping cart');
    }
}
module.exports = router;
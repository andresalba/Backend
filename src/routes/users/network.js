/**Network to manage endpoints about Users
 * @module routes/user/network
 */
const express = require('express');
const router = express.Router();
const response = require('../../../network/response');
const ControllerUser = require('./index')

/**
 * Router endpoint of User
 *@type {router} - Routs to manage Users
 */
router.post('/signup', insertUser);
router.put('/', updateUser);
router.get('/:id', get);
/**
 * API Endpoint to insert an User in the data base.
 * @method POST 
 * @param {Object} req - The User information 
 * @returns {Object} res - result of User insertion
 * @example
 *      body = {
 *          "email": "email@host.com"
 * 	        "password": "1234"     
 *      }
 */
async function insertUser(req, res, next){
    try {
        const userRes = await ControllerUser.insertUser(req.body);
        response.success(req, res, userRes, 201);
    } catch( err){
        response.error(req, res, err.message, 500, 'error network user Insert');
    }
}

/**
 * API Endpoint to update an User information.
 * @method PUT 
 * @param {Object} req - The User information to be updated
 * @returns {Object} res - result of User update
 * @example
 *      body = {
 *          "email": "email@host.com"
 * 	        "password": "1234"     
 *      }
 */
async function updateUser(req, res, next){
    try {
        const updateRes = await ControllerUser.updateUser(req.body);
        response.success(req, res, updateRes, 201);
    } catch( err){
        response.error(req, res, err.message, 500, 'error network user update');
    }
}

/**
 * API Endpoint to get an User with an ID target.
 * @method GET 
 * @param {params} req - The User ID 
 * @returns {Array.<Object>} res - User
 */
async function get(req, res, next){
    try {
        const userGetById = await ControllerUser.getUser(req.params.id);
        response.success(req, res, userGetById, 200);
    } catch( err){
        response.error(req, res, err.message, 500, 'error network user');
    }
}
module.exports = router;
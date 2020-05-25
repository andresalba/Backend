/**Controller to manage store of shopping carts endpoint
 * @module routes/shopping_carts/controller
 */
const { nanoid } = require('nanoid');

const TABLA_PRODUCTS = 'Products';
const TABLA_PHOTOS = 'Product_photos';
const TABLA_SHOPCART = 'Shopping_carts';
const TABLA_PRODUCTS_CART =  'Shopping_cart_products';


function controllerShoppingCart(injectedStore){
    let store = injectedStore;
    if (!store) {
        store = require('../../store/mysql');
    }
    /**
     * Logic to create a shopping cart and add products into it.
     * @param {Object} body - The User and product info to be added into shopping cart 
     * @returns {Promise<object[]>} res - result of add product to shopping cart
     */
    async function addProductToCart(body) {

        const productShoppingCart = {
            id_shopping_cart_products: nanoid(),
            id_products: body.id_product,
            quantity: body.quantity,
            legacy_cost: 0,
            creation_date: new Date(),
            id_currencies:'na',
            id_payments_history:'na',
        };

        const query = `SELECT id_shopping_carts FROM ${TABLA_SHOPCART} WHERE id_users='${body.id_user}' and historic_order=false LIMIT 1`;
        let id_cart;
        try{
            id_cart = await store.get(query);
        }catch(err){
            throw err;
        } 
        if(id_cart.length > 0){
            productShoppingCart.id_shopping_carts = id_cart[0].id_shopping_carts;
        }else{
            try {
                const shopping_cart = {
                    id_shopping_carts: nanoid(),
                    creation_date: new Date(),
                    purchase_date: null,
                    id_payments_history:'na',
                    id_users: body.id_user,
                    historic_order: false,
                };
                await store.insert(TABLA_SHOPCART, shopping_cart);
                productShoppingCart.id_shopping_carts = shopping_cart.id_shopping_carts;
            } catch (err) {
                throw err;
            }
        }
        return await store.insert(TABLA_PRODUCTS_CART, productShoppingCart)
    }
    /**
     * Logic to fetch the shopping cart of an user.
     * @param {string} user_id - The User id own of shopping cart 
     * @returns {Promise<object[]>} res - shopping cart if it exists.
     */
    async function getUserShoppingCart(user_id){
    try{
        const query = `
            SELECT p.id_products ,p.title, p.description, photo.photo, photo.description alt, p.cost, res.quantity, p.quantity as 'stock'
                FROM ${TABLA_PRODUCTS} as p JOIN
                    (SELECT id_products, quantity FROM ${TABLA_PRODUCTS_CART} 
                        WHERE id_shopping_carts=(SELECT id_shopping_carts FROM ${TABLA_SHOPCART} 
                            WHERE id_users='${user_id}')) as res 
                ON p.id_products=res.id_products
                LEFT JOIN (SELECT pf.id_albums,p.id_products, pf.description, pf.photo 
                    FROM ${TABLA_PRODUCTS} as p 
                    JOIN ${TABLA_PHOTOS} as pf ON p.id_albums=pf.id_albums) as photo
                ON p.id_products=photo.id_products
            `
            return await store.get(query);     
        }catch(err){
            throw err;
        }
    }
    /**
     * Logic to remove a product from shopping cart of an user.
     * @param {string} id_user - The User id own of shopping cart 
     * @param {string} id_product - The product that will be deleted
     * @returns {Promise<object[]>} res - shopping cart if it exists.
     */
    async function removeProductFromCart(id_user, id_product){
        const query = `
        DELETE FROM ${TABLA_PRODUCTS_CART} 
            WHERE id_shopping_carts=(select id_shopping_carts from ${TABLA_SHOPCART} as sp 
                WHERE sp.id_users='${id_user}') and id_products='${id_product}'
        `
        return await store.remove(query);
    }

    /**
     * Logic to Update the qty of products of a product into shopping cart of an user.
     * @param {string} id_user - The User id own of shopping cart 
     * @param {string} id_product - The product that will be updated
     * @param {string} newQty - The quantity to be updated
     * @returns {Promise<object[]>} res - update operation result.
     */
    async function updateQtyProductOfCart(id_user, id_product, newQty){
        //UPDATE shopping_cart_products SET quantity=3 WHERE id_products='rObClQxTqfx_nTuVXWOGz' and id_shopping_carts=(SELECT id_shopping_carts FROM shopping_carts WHERE id_users='0kfJIxZCKeRopOjtx4fVg')
        const quantity = {
            quantity: newQty,
        }
        const query = `
            UPDATE ${TABLA_PRODUCTS_CART} SET ? 
                WHERE id_products='${id_product}' and id_shopping_carts=
                (SELECT id_shopping_carts FROM ${TABLA_SHOPCART} WHERE id_users='${id_user}')
        `
        return await store.update(query, quantity);
    }

    return {
        addProductToCart,
        getUserShoppingCart,
        removeProductFromCart,
        updateQtyProductOfCart,
    }

}

module.exports = controllerShoppingCart;
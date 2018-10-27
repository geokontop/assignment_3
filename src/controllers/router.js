/*
 * Routing overview
 * 
 */

// Dependencies
const handlers = require('./handlers')

// Define a request router
const router = {
    '' : handlers.index,
    'account/create' : handlers.accountCreate,
    'account/edit' : handlers.accountEdit,
    'account/deleted' : handlers.accountDeleted,
    'session/create' : handlers.sessionCreate,
    'session/deleted' : handlers.sessionDeleted,
    'pizzas/all' : handlers.menuHtml,
    'pizzas/create' : handlers.pizzasCreate,
    'pizzas/edit' : handlers.pizzasEdit,
    'showCart' : handlers.showCart,
    'showOrder' : handlers.showOrder,
    'showCart' : handlers.showCart,
    'transaction' : handlers.showTransactionResult,
    'api/order' : handlers.order,
    'api/carts' : handlers.carts,
    'api/cart/remove' : handlers.cartRemove,
    'api/menu' : handlers.menu,
    'api/pizzas' : handlers.pizzas,
    'api/users' : handlers.users,
    'api/tokens' : handlers.tokens,
    'ping' : handlers.ping,
    'notFound' : handlers.notFound,
    'favicon.ico' : handlers.favicon,
    'public' : handlers.public
}

module.exports = router;
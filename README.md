# Assignment_3
## GUI

1. User
    - Signup on the site
    - Login
    - Logout
    - Modify own account elements
    - Modify own password
    - Delete own account

1. Menu (Authentication not required)
    - View all the items available to order

1. Shopping cart (Authentication required)
    - Add item to cart
    - Delete item from cart
    - Procced to order

1. Place an order (with fake credit card credentials), and receive an email receipt
    - payment with stripe
    - show order review
    - show the transaction outcome

## API 
### /api/users
#### post
- **Description :**  Creates a new user
- **Happy-case response :** 200
- **Required payload data :** name, email, address, password
- **Required header data :** none
- **Example payload :** {'name':'Joe Doe', 'email':'joe@doe.com, 'address':'gjgjg 76', 'password':'oooooooo'}

#### get
- **Description :** Returns user's own data
- **Happy-case response :** 200, user data (except password)
- **Required query data :** email
- **Required header data :** token
- **Example use :** localhost:3000/api/users?email=joe@doe.com
- **Restrictions :** Every user can access only his own data

#### put
- **Description** : Updates user's data
- **Happy-case response** : 200, user data (except password)
- **Required payload data** : email
- **Optional payload data** : At least one of name, address, password
- **Required header data** : token
- **Example payload :** {"name":"John Doe", "email":"joe@doe.com", "password":"nnooiiio"}
- **Restrictions** : Authentication, every user can update only his own data

#### delete
- **Description** : Deletes user's record(file)
- **Happy-case response** : 200
- **Required query data** : email
- **Required header data** : token
- **Example request** : localhost:3000/api/users?email=joe@doe.com
- **Restrictions** : Authentication, every user can delete only his own record (file)

### /api/tokens
#### post
- **Description** : Creates a new token
- **Happy-case response** : 200, token object
- **Required payload data** : email, password
- **Required header data** : none
- **Example payload** : {'email':'joe@doe.com, 'password':'nnooiiio'}

#### get
- **Description** : Returns token data
- **Happy-case response** : 200, token object e.g. {"email":"joe@doe.com","id":"1ul3xreihg4gmmg8uxk1","expires":1539295461773}
- **Required query data** : id
- **Required header data** : none
- **Example request** : localhost:3000/api/tokens?id="tnls7gwmq2zd740pzao5"

#### put
- **Description** : Extends expiration
- **Happy-case response** : 200
- **Required payload data** : id, extend
- **Optional payload data** : none
- **Required header data** : none
- **Example payload** : {"id": "51kw0181psothvlxmlso", "extend": true}

#### delete
- **Description** : Deletes token 
- **Happy-case response** : 200
- **Required query data** : id
- **Required header data** : none
- **Example request** : localhost:3000/api/tokens?id=51kw0181psothvlxmlso


### /api/pizzas
#### post
- **Description** : Adds a new pizza file in system
- **Happy-case response** : 200
- **Required payload data** : id, name, ingredients, size, price
- **Required header data** : token
- **Example payload** : {"id":"siciliana_med", "name":"Siciliana", "ingredients": ["Tomato sauce", "mozzarella",  "spicy salami", "onions", "garlic", "oregano"], "size":"medium", "price" : 6.80 }
- **Restrictions** : Only administrator can post a new pizza (hardcoded admin@admin.com)

#### get
- **Description** : Returns pizza details
- **Happy-case response** : 200, pizza object 
- **Required query data** : id 
- **Required header data** : none
- **Example request :** localhost:3000/api/pizzas?id=gorgonzola_med (returns specific pizza details)
- **Example response :** 
  {
        "id": "gorgonzola_med",
        "name": "Gorgonzola",
        "ingredients": ["Tomato sauce", "mozzarella", "gorgonzola", "oregano" ],
        "size": "medium",
        "price": 7.8
    }

#### put
- **Description** : Changes pizza's attributes
- **Happy-case response** : 200
- **Required payload data** : id
- **Optional payload data** : At least one of name, ingredients, size, price
- **Required header data** : token
- **Example payload** : {"id":"pugliese_med", "price" : 6.40}
- **Restrictions** : Only administrator can update a pizza (hardcoded admin@admin.com)

#### delete
- **Description** : Deletes pizza 
- **Happy-case response** : 200
- **Required query data** : id
- **Required header data** : token
- **Example request** : localhost:3000/api/pizzas?id=gorgonzola_med
- **Restrictions** : Only administrator can delete a pizza (hardcoded admin@admin.com)


### /api/menu
#### get
- **Description** : Returns menu. The menu is generated from the pizza files saved to the system
- **Happy-case response** : 200, pizzas array
- **Required query data** : none
- **Required header data** : none
- **Example request :** localhost:3000/api/menu 
- **Example response :** 
[
    {
        "id": "gorgonzola_med",
        "name": "Gorgonzola",
        "ingredients": ["Tomato sauce", "mozzarella", "gorgonzola", "oregano" ],
        "size": "medium",
        "price": 7.8
    },

    ...

    {
        "id": "mushroom_sma",
        "name": "Mushroom",
        "ingredients": ["Tomato sauce", "mozzarella", "mushrooms", "oregano" ],
        "size": "small",
        "price": 5
    }
]

### /api/cart/remove

#### delete
- **Description** : Removes the cart from the system
- **Happy-case response** : 200
- **Required query data** : none
- **Required header data** : token

### /api/carts

#### post
- **Description** : Add a new item in shopping cart. If cart does not exist, create one with id the token id.
- **Happy-case response** : 200
- **Required payload data** : id, quantity
- **Required header data** : token
- **Example payload** : {"id":"marinara_med","quantity" : 1}

#### get
- **Description** : Returns shopping cart details
- **Happy-case response** : 200, cart details
- **Required query data** : none
- **Required header data** : id
- **Example request** : localhost:3000/api/carts
- **Example response** : 
{
    "cart": [
        {
            "id": "margherita_big",
            "name": "Margherita",
            "ingredients": ["Tomato sauce", "mozzarella", "oregano"],
            "size": "big",
            "price": 9.5,
            "quantity": 2,
            "subtotal": 19
        },
        {
            "id": "marinara_med",
            "name": "Marinara",
            "ingredients": ["Tomato sauce", "garlic", "oregano"],
            "size": "big",
            "price": 5,
            "quantity": 3,
            "subtotal": 15
        }
    ],
    "total": 34
}

#### put
- **Description** : Changes item's quantity
- **Happy-case response** : 200, cart contents
- **Required payload data** : id, quantity
- **Optional payload data** : none
- **Required header data** : token
- **Example payload** : {"id":"margherita_big", "quantity" : 2}
- **Example response** : 
[ 
    {
        "id": "margherita_big", 
        "quantity": 2
    },
    {
        "id": "marinara_med", 
        "quantity": 3
    } 
]

#### delete
- **Description** : Deletes item from cart 
- **Happy-case response** : 200, cart contents (after the deletion)
- **Required query data** : id
- **Required header data** : token
- **Example request** : localhost:3000/api/carts?id=marinara_med
- **Example response** : 
[ 
    {
        "id": "margherita_big", 
        "quantity": 2
    } 
]


### /api/order

#### post
- **Description** : Order the cart contents. Accept payment with stripe and acknowledge with mailgun.
- **Happy-case response** : 200, message
- **Required payload data** : none
- **Optional payload data** : none
- **Required header data** : token


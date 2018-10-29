/*
 * Frontend Logic for application
 *
 */

 
// Container for frontend application
var app = {};

// Config
app.config = {
  'sessionToken' : false
};

// AJAX Client (for RESTful API)
app.client = {}

// Interface for making API calls
app.client.request = function(headers,path,method,queryStringObject,payload,callback){

  // Set defaults
  headers = typeof(headers) == 'object' && headers !== null ? headers : {};
  path = typeof(path) == 'string' ? path : '/';
  method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
  payload = typeof(payload) == 'object' && payload !== null ? payload : {};
  callback = typeof(callback) == 'function' ? callback : false;

  // For each query string parameter sent, add it to the path
  var requestUrl = path+'?';
  var counter = 0;
  for(var queryKey in queryStringObject){
     if(queryStringObject.hasOwnProperty(queryKey)){
        counter++;
        // If at least one query string parameter has already been added, preprend new ones with an ampersand
        if(counter > 1){
          requestUrl+='&';
        }
        // Add the key and value
        requestUrl+=queryKey+'='+queryStringObject[queryKey];
     }
  }

  // Form the http request as a JSON type
  var xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/json");

  // For each header sent, add it to the request
  for(var headerKey in headers){
     if(headers.hasOwnProperty(headerKey)){
       xhr.setRequestHeader(headerKey, headers[headerKey]);
     }
  }

  // If there is a current session token set, add that as a header
  if(app.config.sessionToken){
    xhr.setRequestHeader("token", app.config.sessionToken.id);
  }

  // When the request comes back, handle the response
  xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE) {
        var statusCode = xhr.status;
        var responseReturned = xhr.responseText;

        // Callback if requested
        if(callback){
          try{
            var parsedResponse = JSON.parse(responseReturned);
            callback(statusCode,parsedResponse);
          } catch(e){
            callback(statusCode,false);
          }

        }
      }
  }

  // Send the payload as JSON
  var payloadString = JSON.stringify(payload);
  xhr.send(payloadString);

};

// Bind the logout button
app.bindLogoutButton = function(){
  document.getElementById("logoutButton").addEventListener("click", function(e){

    // Stop it from redirecting anywhere
    e.preventDefault();

    // Log the user out
    app.logUserOut();

  });
};

// Log the user out then redirect them
app.logUserOut = function(){
  // Get the current token id
  const tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

  // Send the current token to the tokens endpoint to delete it
  const queryStringObject = {
    'id' : tokenId
  };
  app.client.request(undefined,'api/tokens','DELETE',queryStringObject,undefined,function(statusCode,responsePayload){
    // Set the app.config token as false
    app.setSessionToken(false);

    // Send the user to the logged out page
    window.location = '/session/deleted';
  });
};

// Bind the forms
app.bindForms = function(){
  if(document.querySelector("form")){

    var allForms = document.querySelectorAll("form");
    for(var i = 0; i < allForms.length; i++){
        allForms[i].addEventListener("submit", function(e){
        // Stop it from submitting
        e.preventDefault();
        var formId = this.id;
        var path = this.action;
        var method = this.method.toUpperCase();

        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#"+formId+" .formError").style.display = 'none';

        // Hide the success message (if it's currently shown due to a previous error)
        if(document.querySelector("#"+formId+" .formSuccess")){
          document.querySelector("#"+formId+" .formSuccess").style.display = 'none';
        }


        // Turn the inputs into a payload
        var payload = {};
        var elements = this.elements;
        for(var i = 0; i < elements.length; i++){
          if(elements[i].type !== 'submit'){
            var valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
            if(elements[i].name == '_method'){
              method = valueOfElement;
            } else {
              payload[elements[i].name] = valueOfElement;
            }
          }
        }

        // Call the API
        app.client.request(undefined,path,method,undefined,payload,function(statusCode,responsePayload){
          // Display an error on the form if needed
          if(statusCode !== 200){

            if(statusCode == 403){
              // log the user out
              app.logUserOut();

            } else {

              // Try to get the error from the api, or set a default error message
              var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

              // Set the formError field with the error text
              document.querySelector("#"+formId+" .formError").innerHTML = error;

              // Show (unhide) the form error field on the form
              document.querySelector("#"+formId+" .formError").style.display = 'block';
            }
          } else {
            // If successful, send to form response processor
            app.formResponseProcessor(formId,payload,responsePayload);
          }

        });
      });
    }
  }
};

// Form response processor
app.formResponseProcessor = function(formId,requestPayload,responsePayload){
  // If account creation was successful, try to immediately log the user in
  if(formId == 'accountCreate'){
    // Take the email and password, and use it to log the user in
    var newPayload = {
      'email' : requestPayload.email,
      'password' : requestPayload.password
    };

    app.client.request(undefined,'api/tokens','POST',undefined,newPayload,function(newStatusCode,newResponsePayload){
      // Display an error on the form if needed
      if(newStatusCode !== 200){

        // Set the formError field with the error text
        document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';

        // Show (unhide) the form error field on the form
        document.querySelector("#"+formId+" .formError").style.display = 'block';

      } else {
        // If successful, set the token and redirect the user
        app.setSessionToken(newResponsePayload);
        window.location = '/pizzas/all';
      }
    });
  }
  // If login was successful, set the token in localstorage and redirect the user
  if(formId == 'sessionCreate'){
    app.setSessionToken(responsePayload);
    window.location = '/pizzas/all';
  }

  // If forms saved successfully and they have success messages, show them
  var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2'];
  if(formsWithSuccessMessages.indexOf(formId) > -1){
    document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
  }

  // If the user just deleted their account, redirect them to the account-delete page
  if(formId == 'accountEdit3'){
    app.logUserOut(false);
    window.location = '/account/deleted';
  }
  // After adding item to the cart continue ordering
  if(formId == 'addToCartForm'){
    window.location = '/pizzas/all';
  }
};

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = function(){
  var tokenString = localStorage.getItem('token');
  if(typeof(tokenString) == 'string' && tokenString.length>0){
    try{
      var token = JSON.parse(tokenString);
      app.config.sessionToken = token;
      if(typeof(token) == 'object'){
        app.setLoggedInClass(true);
      } else {
        app.setLoggedInClass(false);
      }
    }catch(e){
      app.setLoggedInClass(false);
    }
  }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function(add){
  var target = document.querySelector("body");
  if(add){
    target.classList.add('loggedIn');
  } else {
    target.classList.remove('loggedIn');
  }
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = function(token){
  app.config.sessionToken = token;
  var tokenString = JSON.stringify(token);
  localStorage.setItem('token',tokenString);
  if(typeof(token) == 'object'){
    app.setLoggedInClass(true);
  } else {
    app.setLoggedInClass(false);
  }
};

// Renew the token
app.renewToken = function(callback){
  var currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
  if(currentToken){
    // Update the token with a new expiration
    var payload = {
      'id' : currentToken.id,
      'extend' : true,
    };
    app.client.request(undefined,'api/tokens','PUT',undefined,payload,function(statusCode,responsePayload){
      // Display an error on the form if needed
      if(statusCode == 200){
        // Get the new token details
        var queryStringObject = {'id' : currentToken.id};
        app.client.request(undefined,'api/tokens','GET',queryStringObject,undefined,function(statusCode,responsePayload){
          // Display an error on the form if needed
          if(statusCode == 200){
            app.setSessionToken(responsePayload);
            callback(false);
          } else {
            app.setSessionToken(false);
            callback(true);
          }
        });
      } else {
        app.setSessionToken(false);
        callback(true);
      }
    });
  } else {
    app.setSessionToken(false);
    callback(true);
  }
};

// Load data on the page
app.loadDataOnPage = function(){
  // Get the current page from the body class
  var bodyClasses = document.querySelector("body").classList;
  var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

  // Logic for account settings page
  if(primaryClass == 'accountEdit'){
    app.loadAccountEditPage();
  }

  // Logic for menu page
  if(primaryClass == 'menu'){
    app.loadMenuPage();
  }
  
  // Logic for show cart page
  if(primaryClass == 'show-cart'){
    app.loadShowCartPage();
  }

  // Logic for show order page
  if(primaryClass == 'show-order'){
    app.loadShowOrderPage();
  }

  // Logic for show thank you page
  if(primaryClass == 'transaction-result'){
    app.loadThankYouPage();
  }
};

// Logic for add to cart
app.addToCartFunction = (id,quantity)=>{
  id = typeof(id) == 'string' && id.length > 0? id : false;
  quantity = typeof(quantity) == 'number' && quantity > 0? quantity : false;

  if(id && quantity){
    payload = {"id":id , 
    "quantity":quantity}
    app.client.request(undefined,'api/carts','POST',undefined,payload,(statusCode, err)=>{
    if(statusCode==200){
      document.getElementById("addCartSuccess").innerHTML = String(quantity)+' ' + id +' added to cart';
      document.getElementById("addCartSuccess").style.display="block";
      setTimeout(()=>{
      document.getElementById("addCartSuccess").style.display="none";
      },2000);
    }else{
      document.getElementById("addCartError").innerHTML = 'Failure ' + err ;
      document.getElementById("addCartError").style.display="block";
      setTimeout(()=>{
      document.getElementById("addCartError").style.display="none";
      },2000)
    }
    })  
  }else{

  }
  
}

// Load the account edit page specifically
app.loadAccountEditPage = function(){
  // Get the email  from the current token, or log the user out if none is there
  var email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;
  if(email){
    // Fetch the user data
    var queryStringObject = {
      'email' : email
    };
    app.client.request(undefined,'api/users','GET',queryStringObject,undefined,function(statusCode,responsePayload){
      if(statusCode == 200){
        // Put the data into the forms as values where needed
        document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.name;
        document.querySelector("#accountEdit1 .streetAddressInput").value = responsePayload.address;
        document.querySelector("#accountEdit1 .displayEmailInput").value = responsePayload.email;

        // Put the hidden email field into both forms
        var hiddenEmailInputs = document.querySelectorAll("input.hiddenEmailInput");
        for(var i = 0; i < hiddenEmailInputs.length; i++){
            hiddenEmailInputs[i].value = responsePayload.email;
        }

      } else {
        // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
        app.logUserOut();
      }
    });
  } else {
    app.logUserOut();
  }

};

// Load the pizzas menu page specifically
app.loadMenuPage = function(){
  // Request the menu with the respective API call
  app.client.request(undefined,'api/menu','GET',undefined,undefined,function(statusCode,responsePayload){
    // Get the element in which the elements will be rendered
    const table = document.getElementById('menu');
    if(statusCode == 200){
      // Successfull response
      if(responsePayload.length>0){
        // Response has items in it. 
        // Prepare an HTML table header
        tableContent = '<table id="pizzaTable"> <tr> <th>Pizza</th> <th>Size</th> <th>Ingredients</th> <th>Price</th> <th>Add To Cart</th> </tr> '
        // For each item (pizza) in the menu
        responsePayload.forEach(element => {
          // Prepare a variable to hold the respective add-to-cart form
          let addToCartForm = '';
          // The user has to be authenticeted, otherwise promt to login
          if(app.config.sessionToken){
            // The add-to-cart form
            addToCartForm = '<button type="button" class="cta ctb green" onclick="app.addToCartFunction(\''+element.id +'\','+1+')">Add to cart</button> </form>';
          }else{
            // The go to login button
            addToCartForm = '<a class="cta ctb blue" href="session/create">Login to order</a>';
          }
          // Join the parts
          tableContent += '<tr><td>' + element.name +'</td><td>' + element.size +'</td><td>' + element.ingredients +'</td><td>' + element.price +'</td><td>' + addToCartForm +'</td></tr>'
        });
        tableContent += ' </table>'    
        // Render 
        table.innerHTML = tableContent;
      }else{
        table.innerHTML = '<h2>Nothing to show </h2>'
      }
      
    }else{
      table.innerHTML = '<hr><h2>Status code: ' + statusCode + '. Error retrieving menu items</h2>'
    }
  })
};

// Load the show cart page 
app.loadShowCartPage = function(){
  app.client.request(undefined,'api/carts','GET',undefined,undefined,function(statusCode,responsePayload){
    // Get the element that hosts the cart contents
    const table = document.getElementById('show-cart');
    if(statusCode == 200){
      // We have successfull return of the cart's contents
      if(responsePayload.cart.length>0){
        // Create the string that holds the html table with the cart contents. Headers first.
        tableContent = '<table id="pizzaTable"> <tr> <th>Pizza</th> <th>Size</th> <th>Ingredients</th>' + 
        ' <th>Price</th> <th>Quantity</th>  <th>Subtotal</th>  <th>Remove</th> </tr>'
        responsePayload.cart.forEach(element => {
          // For each element a row with an additional remove button 
          tableContent += '<tr><td>' + element.name +'</td><td>' + element.size +'</td><td>' + 
                        element.ingredients +'</td><td>' + element.price +'</td><td>' + 
                        element.quantity +'</td><td>' + element.subtotal +'</td>' + 
                        '<td><button class="ctb red" type="button" onclick="app.removePizza(\''+
                        element.id +'\')">X</button></td></tr>';
        });
        tableContent += '<tr><td colspan= 7 ><hr> </td></tr>';
        tableContent += '<tr><td> </td><td> </td><td> </td><td> </td><td> <b>Total</b> </td><td>' 
                        + Math.round(responsePayload.total*100)/100 +'</td></tr>';

        tableContent += ' </table>';

        // Write the html string to the html element.. Add buttons to order or continue shopping
        table.innerHTML = tableContent +
        '<hr><div class="ctaWrapper">' +
          '<a class="cta blue" href="pizzas/all">More pizza</a> ' +
          '<a class="cta green" href="showOrder">Procced to Checkout</a>' +
        '</div>';

      }else{
        // Cart is empty
        table.innerHTML = '<h2>Your Shopping Cart is empty </h2>'  +
        '<div class="ctaWrapper">' +
          '<a class="cta blue" href="pizzas/all">Menu</a>' +
        '</div>'
      }
      
    }else{
      // Cart is not created yet. No items selected yet.
      table.innerHTML = '<hr><h2>You have not selected any pizzas. </h2>' +
            '<div class="ctaWrapper">' +
              '<a class="cta blue" href="pizzas/all">Menu</a>' +
            '</div>'
      
    }
  })
};

// Load the show order page 
app.loadShowOrderPage = function(){
  if(app.config.sessionToken){
    // Request the cart details to render the order elements
    app.client.request(undefined,'api/carts','GET',undefined,undefined,function(statusCode,responsePayload){
      if(statusCode == 200){
        if(responsePayload.cart.length>0){
          // Contents exist. Make an html table string with the desired attributes and order
          const htmlString = app.makeHtmlTable(responsePayload.cart,[1,3,4,5,6]);
          // Write to the html elements
          document.getElementById('orderReview').innerHTML = htmlString;
          document.getElementById('total').innerHTML = Math.round(responsePayload.total*100)/100;
          // Show the stripe pay button 
          document.getElementById('buttonPay').style.display = "block"
        }else{
          // Nothing inside the cart
          document.getElementById('orderReview').innerHTML = '<h2>Nothing to purchase </h2>'  
          document.getElementById('total').innerHTML = '';
        }
        
      }
    })
  }else{
    window.location = 'session/create';
  }
  
};

// Load the thank you page and order review. End of the story
app.loadThankYouPage = function(){
      // Request the cart details to render the order review
      app.client.request(undefined,'api/carts','GET',undefined,undefined,function(statusCode,responseCart){
        
        if(statusCode == 200){
          // Make the html table string with the desired fields and order
          htmlString = app.makeHtmlTable(responseCart.cart,[1,3,4,5,6]);
          // Write to the document 
          if(htmlString){
            document.getElementById('show-order').innerHTML = htmlString;
            document.getElementById('total').innerHTML = 'Total $' + Math.round(responseCart.total*100)/100;
          }else{
            document.getElementById('show-order').innerHTML = ''
            document.getElementById('header1').innerHTML = 'We apologize for that'
            document.getElementById('total').innerHTML = 'It looks like some error occured while proccessing your request. Please contact'
          } 
          // Emptu the cart by deleting it.
          app.client.request(undefined,'api/cart/remove','DELETE',undefined,undefined,function(statusCode,responseCart){
            if(statusCode == 200){
              console.log('Transaction done, shopping cart deleted')
            }else{
              console.log('Transaction done, could not delete shopping cart')
            }            
          })

          // Having the order elements, get the user address for given token.email. 
          queryStringObject = {"email":app.config.sessionToken.email}
          app.client.request(undefined,'api/users','GET',queryStringObject,undefined,function(statusCode,responsePayload){
            if(statusCode == 200 && responsePayload.address.length > 0){
              // Render the address
              document.getElementById('address').innerHTML = 'To be delivered at ' + responsePayload.address;
            }else{
              // Failed to produce a sane address
              document.getElementById('address').innerHTML = 'Error proccessing the address please call 1234567777' ;
            }
          })
        }else{
          document.getElementById('show-order').innerHTML = ''
          document.getElementById('header1').innerHTML = 'We apologize for that'
          document.getElementById('total').innerHTML = 'It looks like some error occured while proccessing your request. Please contact'
        }         
      });
}


// Loop to renew token often
app.tokenRenewalLoop = function(){
  setInterval(function(){
    app.renewToken(function(err){
      if(!err){
        console.log("Token renewed successfully @ "+Date.now());
      }else{
        console.log(err+Date.now());
      }
    });
  },1000 * 60 );
};

// Init (bootstrapping)
app.init = function(){

  // Bind all form submissions
  app.bindForms();

  // Bind logout logout button
  app.bindLogoutButton();

  // Get the token from localstorage
  app.getSessionToken();

  // Renew token
  app.tokenRenewalLoop();

  // Load data on page
  app.loadDataOnPage();

};


// Call the init processes after the window loads
window.onload = function(){
  app.init();
};

// Constract an html table from an array of objects.Array of desired fields and order
app.makeHtmlTable = (objArr, order)=>{  

  // If array has elements
  if(objArr.length>0){

    // Initialize table string
    let tableHtml = '<table><tr>';
    
    // The keys of the elements
    const keys = Object.keys(objArr[0])
    // For each key add table header
    order.forEach(indx=>{
      tableHtml += '<th>'+keys[indx] +'</th>'
    })
    tableHtml += '</tr>'
    // For each array element add the desired fields in the desired order
    objArr.forEach(element=>{
      tableHtml += '<tr>';
      order.forEach(indx=>{
        tableHtml +='<td>'+element[keys[indx]] +'</td>'
      })
      tableHtml += '</tr>';
    })


    // Close the table tag
    tableHtml += '</table>'
    // Return the table
    return tableHtml;
  }else {
    return false
  }
}

// Calls the api to remove the pizza from the cart
app.removePizza = (id)=>{
  // Form the query string object
  queryStringObject = { "id":id};
  //localhost:3000/api/carts?id=marinara_med
  app.client.request(undefined,'api/carts','DELETE',queryStringObject,undefined,function(statusCode,responsePayload){
    if(statusCode == 200){
      window.location = '/showCart';
      
    } 
  });
}




var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    start();
});

function start() {
    inquirer
    .prompt({
        name: "buyerAction",
        type: "list",
        message: "Would you like to [BUY] and item or [EXIT]?",
        choices: ["BUY", "EXIT"]
    })
    .then(function(answer){
        if(answer.buyerAction === "BUY"){
            purchase();
        } else {
            connection.end();
        }
    });
}

function purchase(){
    connection.query("SELECT * FROM items", function(err, results){
        if (err) throw err;

        inquirer
          .prompt([
              {
                  name: "choice",
                  type: "rawlist",
                  choices: function(){
                      var choiceArray = [];
                      for (var i= 0; i < results.length; i++) {
                          choiceArray.push(results[i].product_name);
                      }
                      return choiceArray;
                  },
                  message: "What item would you like to purchase?"
              },
              {
                  name: "quantity",
                  type: "input",
                  message: "How many would you like to purchase?"
              }
          ])
          .then(function(answer){
              var chosenItem;
              for (var i = 0; i < results.length; i++) {
                  if (results[i].product_name === answer.choice) {
                      chosenItem = results[i];
                  }
              }
              if(chosenItem.stock_quantity >= parseInt(answer.quantity)) {
                  console.log("Quantity avalible for purchase")
                  var newQuantity = chosenItem.stock_quantity - answer.quantity;
                  console.log(newQuantity + "remain in stock")
                  connection.query(
                      "UPDATE items SET ? WHERE ?",
                      [
                          {
                              stock_quantity: newQuantity
                          },
                          {
                              id: chosenItem.id
                          }
                          
                      ],
                      function(error) {
                          if (error) throw err;
                          console.log("Transaction completed successfully!");
                          var totalCost = chosenItem.price * answer.quantity
                          console.log("Total cost: $" + totalCost);
                          start();
                      }
                  );
              } else {
                  console.log("Insufficent quantity. Please try another amount.");
                  start();
              }
          });
    });
}
DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE items(
    id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100),
    department_name VARCHAR(30),
    price DECIMAL(10,2),
    stock_quantity INT(50),
    PRIMARY KEY (id)
);
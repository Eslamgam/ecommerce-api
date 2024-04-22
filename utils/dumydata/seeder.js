const fs = require('fs');
require('colors');
const Product = require('../../models/product.model');
const dbConnection = require('../../database/dbConnection');
// require('dotenv').config()
dbConnection()


const products = JSON.parse(fs.readFileSync('./product.json'));



const insertData = async () => {
  try {
    await Product.create(products);
    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

//  process.argv[2] => node seeder.js -d
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}
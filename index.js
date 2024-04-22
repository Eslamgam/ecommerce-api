const express = require('express')
const cors = require('cors');
const path = require('path');
const morgan = require('morgan')
const categoryRoute = require('./routes/category.route')
const subCategoryRoute = require('./routes/subCategory.route')
const brandRoute = require('./routes/brand.route')
const productRoute = require('./routes/product.route')
const userRoute = require('./routes/user.route')
const authRoute = require('./routes/auth.route')
const reviewRoute = require('./routes/review.route')
const addressRoute = require('./routes/address.route')
const wishlistRoute = require('./routes/wishlist.route')
const couponRoute = require('./routes/coupon.route')
const cartRoute = require('./routes/cart.route')
const orderRoute = require('./routes/order.route')

const globalHandelar = require('./ErrorHandelar/globalHandelar')
const routeHandelar = require('./ErrorHandelar/routeHandelar')
const dbConnection = require('./database/dbConnection')
require('dotenv').config()
const app = express()

app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads/brands')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads/category')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads/product')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads/users')));

app.use(express.json());
app.use(morgan('combined'))
dbConnection()
app.use('/api/ecommerce/category', categoryRoute)
app.use('/api/ecommerce/subCategories',subCategoryRoute)
app.use('/api/ecommerce/brand',brandRoute)
app.use('/api/ecommerce/product',productRoute)
app.use('/api/ecommerce/user',userRoute)
app.use('/api/ecommerce/auth',authRoute)
app.use('/api/ecommerce/reviews',reviewRoute)
app.use('/api/ecommerce/address',addressRoute)
app.use('/api/ecommerce/wishlist',wishlistRoute)
app.use('/api/ecommerce/coupon',couponRoute)
app.use('/api/ecommerce/cart',cartRoute)
app.use('/api/ecommerce/order',orderRoute)












app.all('*', routeHandelar)
app.use(globalHandelar)
const server = app.listen(process.env.PORT || 8000, (req, res) => {
    console.log('server running');
})
process.on('unhandledRejection', (err)=>{
    console.error('unhandledRejection', err);
server.close(()=>{
    console.error('server closed');
    process.exit(1)
})
})
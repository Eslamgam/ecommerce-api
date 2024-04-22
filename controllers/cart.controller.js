const asyncWrapper = require('../middelware.js/asyncWrapper');
const appError = require('../utils/appError')

const Product = require('../models/product.model');
const Coupon = require('../models/coupon.model');
const Cart = require('../models/cart.model');

const httpStatusText = require('../utils/httpStatusText')



const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
  };




  // @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/User
const addProductToCart = asyncWrapper(async (req, res, next) => {
    const { productId, color } = req.body;
    const product = await Product.findById(productId);
  
    // 1) Get Cart for logged user
    let cart = await Cart.findOne({ user: req.currentUser.id });
  
    if (!cart) {
      // create cart fot logged user with product
      cart = await Cart.create({
        user: req.currentUser.id,
        cartItems: [{ product: productId, color, price: product.price }],
      });
    } else {
      // product exist in cart, update product quantity
      const productIndex = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId && item.color === color
      );
  
      if (productIndex > -1) {
        const cartItem = cart.cartItems[productIndex];
        cartItem.quantity += 1;
  
        cart.cartItems[productIndex] = cartItem;
      } else {
        // product not exist in cart,  push product to cartItems array
        cart.cartItems.push({ product: productId, color, price: product.price });
      }
    }
  
    // Calculate total cart price
    calcTotalCartPrice(cart);
    await cart.save();
  
    res.status(200).json({
        state: httpStatusText.SUCCESS,
      message: 'Product added to cart successfully',
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  });
  
  // @desc    Get logged user cart
  // @route   GET /api/v1/cart
  // @access  Private/User
const getLoggedUserCart = asyncWrapper(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.currentUser.id });
  
    if (!cart) {
      return next(appError.create(`There is no cart for this user id : ${req.currentUser.id}`,404, httpStatusText.ERROR));
    }
  
    res.status(200).json({
        state: httpStatusText.SUCCESS,
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  });
  
  // @desc    Remove specific cart item
  // @route   DELETE /api/v1/cart/:itemId
  // @access  Private/User
const removeSpecificCartItem = asyncWrapper(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
      { user: req.currentUser.id },
      {
        $pull: { cartItems: { _id: req.params.itemId } },
      },
      { new: true }
    );
  
    calcTotalCartPrice(cart);
    cart.save();
  
    res.status(200).json({
      state: httpStatusText.SUCCESS,
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  });
  
  // @desc    clear logged user cart
  // @route   DELETE /api/v1/cart
  // @access  Private/User
const clearCart = asyncWrapper(async (req, res, next) => {
    await Cart.findOneAndDelete({ user: req.currentUser.id });
    res.status(200).json({
      state: httpStatusText.SUCCESS,
      message: 'cart deleted'
    });
  });
  
  // @desc    Update specific cart item quantity
  // @route   PUT /api/v1/cart/:itemId
  // @access  Private/User
  const updateCartItemQuantity = asyncWrapper(async (req, res, next) => {
    const { quantity } = req.body;
  
    const cart = await Cart.findOne({ user: req.currentUser.id });
    if (!cart) {
      return next(appError.create(`there is no cart for user ${req.currentUser.id}`, 404, httpStatusText.ERROR));

    }
  
    const itemIndex = cart.cartItems.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );
    if (itemIndex > -1) {
      const cartItem = cart.cartItems[itemIndex];
      cartItem.quantity = quantity;
      cart.cartItems[itemIndex] = cartItem;
    } else {
      
        // new ApiError( 404)
      return next(appError.create(`there is no item for this id :${req.params.itemId}`, 400, httpStatusText.ERROR));

      
    }
  
    calcTotalCartPrice(cart);
  
    await cart.save();
  
    res.status(200).json({
      state: httpStatusText.SUCCESS,
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  });
  
  // @desc    Apply coupon on logged user cart
  // @route   PUT /api/v1/cart/applyCoupon
  // @access  Private/User
const applyCoupon = asyncWrapper(async (req, res, next) => {
    // 1) Get coupon based on coupon name
    const {name, expire} = req.body
    const coupon = await Coupon.findOne({

      name,
      expire
    });
  
    if (!coupon) {
      return next(appError.create(`Coupon is invalid or expired`, 400, httpStatusText.ERROR));
    }
    // (`Coupon is invalid or expired`)
    // 2) Get logged user cart to get total cart price
    const cart = await Cart.findOne({ user: req.currentUser.id });
  
    const totalPrice = cart.totalCartPrice;
  
    // 3) Calculate price after priceAfterDiscount
    const totalPriceAfterDiscount = (
      totalPrice -
      (totalPrice * coupon.discount) / 100
    ).toFixed(2); // 99.23
  
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();
  
    res.status(200).json({
      state: httpStatusText.SUCCESS,
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
  });



  module.exports = {applyCoupon,updateCartItemQuantity,clearCart,removeSpecificCartItem,getLoggedUserCart,addProductToCart}
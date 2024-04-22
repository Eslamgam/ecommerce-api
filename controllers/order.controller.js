const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const appError = require('../utils/appError');

const User = require('../models/user.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');

const asyncWrapper = require("../middelware.js/asyncWrapper");
const ApiFeatures = require('../utils/apiFeatuer')


const httpStatusText = require('../utils/httpStatusText');
// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  Protected/User  
const createCashOrder = asyncWrapper(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(appError.create(`There is no such cart with id ${req.params.cartId}`, 404, httpStatusText.ERROR));
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default paymentMethodType cash
  const order = await Order.create({
    user: req.currentUser.id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status:httpStatusText.SUCCESS, data: order });
});

const filterOrderForLoggedUser = asyncWrapper(async (req, res, next) => {
  if (req.currentUser.role === 'user') req.filterObj = { user: req.currentUser.id };
  next();
});
// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager     
const findAllOrders = asyncWrapper(
    async (req, res, next) => {
        const countDocuments = await Order.countDocuments()
        const apiFeature = new ApiFeatures(Order.find(), req.query)
            .paginate(countDocuments)
            .filter()
            .search()
            .limitFields()
            .sort()
        const { paginationResult, mongooseQuery } = apiFeature
        const order = await mongooseQuery;

        res.status(200).json({ state: httpStatusText.SUCCESS, paginationResult, orders: { order } })

    }
)

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
const findSpecificOrder = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.orderId
        const order = await Order.findById(id)
        if (!order) {
            return next(appError.create('order not found', 404, httpStatusText.ERROR))
        }
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { order } })

    }
)

// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager    
const updateOrderToPaid = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(
      appError.create(
        `There is no such a order with this id:${req.params.orderId}`,
        404,httpStatusText.ERROR
      )
    );
  }

  // update order to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: httpStatusText.SUCCESS, data: updatedOrder });
});

// @desc    Update order delivered status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager   
const updateOrderToDelivered = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(
      appError.create(
        `There is no such a order with this id:${req.params.orderId}`,
        404,httpStatusText.ERROR
      )
    );
  }

  // update order to paid
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: httpStatusText.SUCCESS, data: updatedOrder });
});

// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User
const checkoutSession = asyncWrapper(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      appError.create(`There is no such cart with id ${req.params.cartId}`, 404,httpStatusText.ERROR)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        name: req.currentUser.firstName,
        amount: totalOrderPrice * 100,
        currency: 'egp',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.currentUser.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) send session to response
  res.status(200).json({ status: httpStatusText.SUCCESS, session });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const oderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // 3) Create order with default paymentMethodType card
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: oderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: 'card',
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
const webhookCheckout = asyncWrapper(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    //  Create order
    createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
});



module.exports = {createCashOrder,filterOrderForLoggedUser,webhookCheckout,checkoutSession,updateOrderToDelivered,updateOrderToPaid,findSpecificOrder,findAllOrders}
  
          
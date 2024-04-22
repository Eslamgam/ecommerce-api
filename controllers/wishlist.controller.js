




const asyncWrapper = require("../middelware.js/asyncWrapper");

const User = require('../models/user.model')

const httpStatusText = require('../utils/httpStatusText');




const addProductToWishlist = asyncWrapper(async (req, res, next) => {
    // $addToSet => add productId to wishlist array if productId not exist
    const user = await User.findByIdAndUpdate(
      req.currentUser.id,
      {
        $addToSet: { wishlist: req.body.productId },
      },
      { new: true }
    );
  
    res.status(200).json({
      state: httpStatusText.SUCCESS,
      message: 'Product added successfully to your wishlist.',
      data: user.wishlist,
    });
  });



const removeProductFromWishlist = asyncWrapper(async (req, res, next) => {
    // $pull => remove productId from wishlist array if productId exist
    const user = await User.findByIdAndUpdate(
      req.currentUser.id,
      {
        $pull: { wishlist: req.params.productId },
      },
      { new: true }
    );
  
    res.status(200).json({
      state: httpStatusText.SUCCESS,
      message: 'Product removed successfully from your wishlist.',
      data: user.wishlist,
    });
  });
  const getLoggedUserWishlist = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.currentUser.id).populate('wishlist');
  
    res.status(200).json({
        state: httpStatusText.SUCCESS,

      results: user.wishlist.length,
      data: user.wishlist,
    });
  });

  module.exports = {addProductToWishlist,removeProductFromWishlist,getLoggedUserWishlist}
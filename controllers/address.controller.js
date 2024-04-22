
const asyncWrapper = require("../middelware.js/asyncWrapper");

const User = require('../models/user.model')

const httpStatusText = require('../utils/httpStatusText');


const addAddress = asyncWrapper(
    async (req, res, next) => {
    // $addToSet => add address object to user addresses  array if address not exist
    const user = await User.findByIdAndUpdate(
      req.currentUser.id,
      {
        $addToSet: { addresses: req.body },
      },
      { new: true }
    );
  
    res.status(200).json({state: httpStatusText.SUCCESS,message: 'Address added successfully.',data: user.addresses});
  });




 const removeAddress = asyncWrapper(async (req, res, next) => {
    // $pull => remove address object from user addresses array if addressId exist
    const user = await User.findByIdAndUpdate(
      req.currentUser.id,
      {
        $pull: { addresses: { _id: req.params.addressId} },
      },
      { new: true }
    );
  
    res.status(200).json({
        state: httpStatusText.SUCCESS,
      message: 'Address removed successfully.',
      data: user.addresses,
    });
  });


const getLoggedUserAddresses = asyncWrapper(async (req, res, next) => {
    const user = await User.findById(req.currentUser.id).populate('addresses');
  
    res.status(200).json({
      state: httpStatusText.SUCCESS,
      results: user.addresses.length,
      data: user.addresses,
    });
  });


  module.exports = {addAddress,removeAddress,getLoggedUserAddresses}
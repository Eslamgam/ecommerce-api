

// const asyncWrapper = require("../middleware/asyncWrapper");
// const User = require('../models/user.model');
// const httpStatusText = require('../utils/httpStatusText');
// const appError = require('../utils/appError');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const generateToken = require("../utils/generateToken");

const asyncWrapper = require('../middelware.js/asyncWrapper')
const User = require('../models/user.model')
const httpStatusText = require('../utils/httpStatusText')
const appError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatuer')


const getAllUsers = asyncWrapper(
    async (req, res, next) => {
        const countDocuments = await User.countDocuments()
        const apiFeature = new ApiFeatures(User.find(), req.query)
            .paginate(countDocuments)
            .filter()
            .search()
            .limitFields()
            .sort()
        const { paginationResult, mongooseQuery } = apiFeature
        const user = await mongooseQuery;

        res.status(200).json({ state: httpStatusText.SUCCESS, paginationResult, users: { user } })

    }
)

const getUser = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.userId
        const user = await User.findById(id)
        if (!user) {
            return next(appError.create('user not found', 404, httpStatusText.ERROR))
        }
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { user } })

    }
)




const register = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;


    console.log('req.file============', req.file);

    const oldUser = await User.findOne({ email: email});

    if(oldUser) {
        const error = appError.create('user already exists', 400, httpStatusText.FAIL)
        return next(error);
    }

    // password hashing
    // const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        role,
        avatar: req.file.filename
    })

    // generate JWT token 
    // const token = await generateJWT({email: newUser.email, id: newUser._id, role: newUser.role});
    // newUser.token = token;


    await newUser.save();



    res.status(201).json({status: httpStatusText.SUCCESS, data: {user: newUser}})


})


const login = asyncWrapper(async (req, res, next) => {
    const {email, password} = req.body;

    if(!email && !password) {
        const error = appError.create('email and password are required', 400, httpStatusText.FAIL)
        return next(error);
    }

    const user = await User.findOne({email: email});

    if(!user) {
        const error = appError.create('user not found', 400, httpStatusText.FAIL)
        return next(error);
    }

    // const matchedPassword = await bcrypt.compare(password, user.password);

    if(password == user.password) {
        // logged in successfully

       const token = await generateToken({email: user.email, Name: user.firstName, id: user._id, role: user.role});

        return res.json({ status: httpStatusText.SUCCESS, data: {token}});
    } else {
        const error = appError.create('password wrong', 500, httpStatusText.ERROR)
        return next(error);
    }

})



module.exports = {
    register,
    login,
    getAllUsers,
    getUser
}
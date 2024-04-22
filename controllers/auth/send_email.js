

const nodemailer = require('nodemailer');

const httpStatusText = require('../../utils/httpStatusText');
const appError = require('../../utils/appError');
const asyncWrapper = require('../../middelware.js/asyncWrapper');



const sendEmailWithNaodeMailer = (userEmail, updatecode, name)=>{
    

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    // user: 'david.kamal012@gmail.com',
                    // pass: 'xaso tfdi oqwa gixm'
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_PASSWORD
                }
            });
        
            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: `${userEmail}`,
                subject: `Hello from Sir ${name}`,
                text: ` ${updatecode} This is a test code email sent using Nodemailer and islam jamal .  `
            };
        
        
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error occurred:', error.message);
                    // return next(appError.create(error.message, 404, httpStatusText.ERROR))
                    // return res.status(400).json({status: httpStatusText.ERROR, message: error.message})
                    // return next(appError.create(error.message, 400, httpStatusText.ERROR))
                } else {
                    console.log('Email sent successfully:', info.response);
                    // res.status(200).json({ status: httpStatusText.SUCCESS, message: 'Email sent successfully:' })
                }
            });
      
}




module.exports = sendEmailWithNaodeMailer
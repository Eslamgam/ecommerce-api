

const mongoose = require('mongoose')

const dbConnection = ()=>{
    mongoose.connect(process.env.URL).then((con)=>{
        console.log('database connected', con.connection.host);
    }).catch((err)=>{
        console.log('err', err);
    })
}

module.exports =  dbConnection
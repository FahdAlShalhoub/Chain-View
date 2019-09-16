const express = require('express');
const app=express();
const PORT = process.env.port || 5000;
const mongoose=require('mongoose');
const expressLayouts=require('express-ejs-layouts');

//Connecting To DB
mongoose.connect('mongodb://localhost/chain_view',{useNewUrlParser: true})
.then(()=>{
    console.log('Connection To Database Successful');
})
.catch(err=>{
    console.log(err);
});

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Static Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));

//Routers
app.use('/',require('./routes/web'));    


app.listen(PORT,function(){
    console.log(`The server is running on port: ${PORT}`);
});


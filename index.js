const express = require('express');
const app=express();
const PORT = process.env.port || 5000;
const mongoose=require('mongoose');
const expressLayouts=require('express-ejs-layouts');
// const cookies=require('cookie-parser');
const session=require('express-session');
const flash=require('express-flash');

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
app.use(flash());
app.use(session({
    secret:'Howdy',
    resave: false,
    saveUninitialized: false,
}));

//Routers
app.use('/',require('./routes/web'));    


app.listen(PORT,function(){
    console.log(`The server is running on port: ${PORT}`);
});


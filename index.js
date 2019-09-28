const express = require('express');
const app=express();
const PORT = process.env.PORT || 5000;
const database=process.env.database || 'mongodb://localhost/chain_view';
const mongoose=require('mongoose');
const expressLayouts=require('express-ejs-layouts');
const session=require('express-session');
const flash=require('express-flash');
const fetch = require("node-fetch");


//Connecting To DB
mongoose.connect(database,{useNewUrlParser: true})
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

// Sorry fahad i don't know how you organize stuff >.>
// Search endPoint the main purpose is looking for blocks in the blockchain
app.post('/search',async(req,res)=>{
    // no need to check if it's a hash or a number they already did it.

    // just checking if he tries to send an empty body
    // not ideal but i can't think of anything else at this moment
    if(req.body.search == ""){
         return res.redirect('/')
    }
    let Link ="https://api.blockcypher.com/v1/btc/main/blocks/";
    let apiLink = Link + req.body.search;
    let result = await fetch(apiLink);
    let resultJson = await result.json();
  return res.render("block",{block:resultJson});
});
// end point to generate pair of keys ready to use
app.get('/address', async (req,res)=>{
    //fetch the data and getting the info 
    let result = await fetch('https://api.blockcypher.com/v1/btc/test3/addrs',{ method : 'POST'})
    let resultJson = await result.json();
     return res.render('wallet',{address:resultJson});

});





app.listen(PORT,function(){
    console.log(`The server is running on port: ${PORT}`);
});


const express = require('express');
const app=express();
const PORT = process.env.PORT || 5000;
const database=process.env.database || 'mongodb://localhost/chain_view';
const mongoose=require('mongoose');
const expressLayouts=require('express-ejs-layouts');
const session=require('express-session');
const flash=require('express-flash');
const fetch = require("node-fetch");
// creating transaction requirements
var bitcoin = require("bitcoinjs-lib");
var bigi    = require("bigi");
var buffer  = require('buffer');
//var keys    = new bitcoin.ECPair(bigi.fromHex(my_hex_private_key));


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
app.get('/transactions',(req,res)=>{
    // this endPoint shows the transaction creation page
    res.render('transactions');
});
app.post('/transactions',async(req,res)=>{
    //this function takes User's private Key and public key and sends everything to '/txs/new'
        // let sender = User.publicKey;
       // let keys    = new bitcoin.ECPair(bigi.fromHex(User.privateKey));
        let recipient = req.body.address;
        let value = req.body.value;
    var newtx = {
        inputs: [{addresses: ['mqYjFiGBti4R9zQShqThN9qtNc9rBehZkc']}], // User.publicKey
        outputs: [{addresses: [recipient], value: value}]
      };

      let data ={method:'POST',body:JSON.stringify(newtx), headers: { 'Content-Type': 'application/json' }};
      let tempTx = await fetch('https://api.blockcypher.com/v1/bcy/test/txs/new', data);
        // tempTx.pubkeys=[];
        // tempTx.signatures = tmptx.tosign.map(function(tosign, n) {
        //     tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
        //     return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
        //   });
        //   let readyData ={method:'POST',body:JSON.stringify(tempTx), headers: { 'Content-Type': 'application/json' }};
        //   let result = await fetch('https://api.blockcypher.com/v1/bcy/test/txs/send', readyData);
      console.log(tempTx);
      res.send(tempTx);
});
app.get('/tx',(req,res)=>{

    return res.render('tx') 
});
app.post('/tx',async(req,res)=>{

    
   let Link ="https://api.blockcypher.com/v1/btc/main/txs/";
   let apiLink = Link + req.body.tx;
   let result = await fetch(apiLink);
   let resultJson = await result.json();
 return res.render("Txs",{tx:resultJson});
});

// for getting the mempool.
app.get('/mempool',async(req,res)=>{

    
    let Link ="https://api.blockcypher.com/v1/btc/main/txs/";
    let result = await fetch(Link);
    let resultJson = await result.json();
  return res.render("mempool",{tx:resultJson});
 });

app.post('/address',async(req,res)=>{

   
   let Link ="https://api.blockcypher.com/v1/btc/main/addrs/";
   let apiLink = Link + req.body.address;
   let result = await fetch(apiLink);
   let resultJson = await result.json();
 return res.render("address",{address:resultJson});
});
// app.get for the mempool
app.get('/address/:address',async(req,res)=>{

   
    let Link ="https://api.blockcypher.com/v1/btc/main/addrs/";
    let apiLink = Link + req.params.address;
    let result = await fetch(apiLink);
    let resultJson = await result.json();
  return res.render("address",{address:resultJson});
 });



app.listen(PORT,function(){
    console.log(`The server is running on port: ${PORT}`);
});


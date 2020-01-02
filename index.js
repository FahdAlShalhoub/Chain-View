const express = require('express');
const app=express();
const PORT = process.env.PORT || 5000;
const database=process.env.database || 'mongodb://localhost/chain_view';
const mongoose=require('mongoose');
const expressLayouts=require('express-ejs-layouts');
const session=require('express-session');
const flash=require('express-flash');
const fetch = require("node-fetch");
const pdf = require("pdfkit");
const fs = require("fs");
const choki = require("chokidar");
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
app.post('/transactions', async(req,res)=>{
    //this function takes User's private Key and public key and sends everything to '/txs/new'
       // let sender = '039f9582eab8ae6df1063bb2080a0de11d227f133bde7f401cb5014ce9ef6fef1e';
       // let keys   = new bitcoin.ECPair(bigi.fromHex('26a27d21537ee24fb7f9fbd9e0b9e6afe2a63cbafe6775c34bfd9f5f16620895'));
        let recipient = req.body.address;
        let value = req.body.value;
        console.log(value);
    var newtx = {
        inputs: [{addresses: ['CEztKBAYNoUEEaPYbkyFeXC5v8Jz9RoZH9']}], // User.publicKey
        outputs: [{addresses: ['C1rGdt7QEPGiwPMFhNKNhHmyoWpa5X92pn'], value: 100000}]
      };

      let data = { method:'POST', body:JSON.stringify(newtx), headers: { 'Content-Type': 'application/json' }};
      let result = await fetch('https://api.blockcypher.com/v1/bcy/test/txs/new', data);
      let tx = await result.json(); console.log(tx);
        // tempTx.pubkeys=[];
        // tempTx.signatures = tempTx.tosign.map(function(tosign, n) {
        //     tempTx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
        //     return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
        //   });
        //   let readyData ={method:'POST',body:JSON.stringify(tempTx), headers: { 'Content-Type': 'application/json' }};
        //   let result = await fetch('https://api.blockcypher.com/v1/bcy/test/txs/send', readyData);

        // I love this subject
      res.render('Pendingtx',{tx:tx.tx,tosign:tx.tosign});
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
    let file = fs.createWriteStream("addressReports/" + resultJson.address + ".pdf");
    let watcher = choki.watch("addressReports/" + resultJson.address + ".pdf");
    await writePDF(resultJson,file);
 
 
 setTimeout(()=>{
     return res.download("addressReports/" + resultJson.address + ".pdf");
 },3000)
   
 });
 
 async function writePDF(resultJson,file){
     let myDoc =  new pdf;
     myDoc.pipe(file);
     myDoc.image("public/img/logo.png",0,0,{fit: [100,100]});
     myDoc.moveDown();
     myDoc.font("Times-Bold");
     myDoc.fontSize(35);
     myDoc.text("Address",{align:"center"});
     myDoc.fontSize(20);
     myDoc.text(resultJson.address,{align:"center"});
     myDoc.fontSize(30);
     myDoc.moveDown();
     myDoc.font("Times-Roman");
     myDoc.fontSize(15);
     myDoc.text("Number of Transactions: " + resultJson.n_tx);       
     myDoc.moveDown();
     myDoc.text("Number Of Unconfirmed Transactions: " + resultJson.unconfirmed_n_tx);
     myDoc.moveDown();
     myDoc.text("Balance: " + resultJson.balance + " satoshis");
     myDoc.fontSize(20);
     myDoc.moveDown();
     myDoc.text("_____________________________________",{align:"center"});
     myDoc.moveDown();
     myDoc.font("Times-Bold");
     myDoc.text("Latest Transactions");
     myDoc.font("Times-Roman");
     myDoc.fontSize(12);
     myDoc.moveDown();
     for(var i=0; i<5 ; i++){
      myDoc.text("Transaction Hash: " + resultJson.txrefs[i].tx_hash);
      myDoc.moveDown(0.1); 
      myDoc.text("Block Height: " + resultJson.txrefs[i].block_height);
      myDoc.moveDown(0.1); 
      myDoc.text("Value: " + resultJson.txrefs[i].value);
      myDoc.moveDown(0.1); 
      myDoc.text("Date Of Confirmation: " + resultJson.txrefs[i].confirmed);       
      myDoc.moveDown(); 
     }
     myDoc.end();
 }

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


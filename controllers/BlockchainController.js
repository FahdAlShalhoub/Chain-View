const fetch = require("node-fetch");
const address = require("../models/Address");

async function searchForBlock(req,res){
    // Checking if he tries to send an empty body
    if(req.body.search == ""){
        return res.redirect('/');
    }
    let Link ="https://api.blockcypher.com/v1/btc/main/blocks/";
    let apiLink = Link + req.body.search;
    let result = await fetch(apiLink);
    let resultJson = await result.json();
    return res.render("block",{user:req.user,block:resultJson});
}

async function generateAddress(req,res){
    //fetch the data and getting the info 
    let result = await fetch('https://api.blockcypher.com/v1/btc/test3/addrs',{ method : 'POST'})
    let resultJson = await result.json();

    address.create({
        userEmail: req.user.email,
        publicKey: resultJson.public,
        addressKey: resultJson.address
    });
 
    return res.render('wallet',{user:req.user,address:resultJson});
}

async function showSearchForAddressForm(req,res){
    return res.render('address',{user:req.user});
}

async function searchForAddress(req,res){
    searchAddress = req.body.address.replace(/[;/\s]/g,""); 
    let result = await fetch('https://api.blockcypher.com/v1/btc/main/addrs/'+ searchAddress +'/balance')
    let resultJson = await result.json();
    resultJson.final_balance*=Math.pow(10,-8);
    resultJson.total_sent*=Math.pow(10,-8);
    resultJson.total_received*=Math.pow(10,-8);
    resultJson.unconfimred_balance*=Math.pow(10,-8);
    return res.render('address',{user:req.user,info:resultJson});
}

async function showTransactionForm(req,res){
    return res.render('transaction');
}

async function makeTransaction(req,res){
    const transactionData = {
        inputs: [{addresses: [req.body.inputAddress]}],
        outputs: [{addresses: [req.body.outputAddress] , value: req.body.value}],
    };

    let result = await fetch('https://api.blockcypher.com/v1/bcy/test/txs/new',{method:'POST', body: JSON.stringify(transactionData)});
    console.log(result);
    return res.send(await result.json());
}

module.exports={
    searchForBlock,
    searchForAddress,
    showSearchForAddressForm,
    generateAddress,
    showTransactionForm,
    makeTransaction
}
const fetch = require("node-fetch");

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
    return res.render('wallet',{user:req.user,address:resultJson});
}

module.exports={
    searchForBlock,
    generateAddress
}
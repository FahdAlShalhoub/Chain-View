const express=require('express');
const router=express.Router();
const AuthenticationController=require('../controllers/AuthenticationController');
const BlockchainController=require('../controllers/BlockchainController');
const passport=require('passport');
const fetch = require("node-fetch");

//Passport Initilaization 
router.use(passport.initialize());
router.use(passport.session());

router.get('/', async function(req,res){
    let blockchain = await fetch('https://api.blockcypher.com/v1/btc/main');
    let result = await blockchain.json()
    res.render('home',{user:req.user,block:result});
});

/* Login Routes */
router.get('/login',guest,(req,res) => AuthenticationController.showLoginForm(req,res));
router.post('/login',guest,(req,res,next) => AuthenticationController.handleLogin(req,res,next));
router.get('/logout',authed,(req,res) => AuthenticationController.handleLogout(req,res));

/* Register Routes */
router.get('/register',guest,(req,res) => AuthenticationController.showRegisterForm(req,res));
router.post('/register',guest,(req,res) => AuthenticationController.handleRegistration(req,res));

//Dashboard Routes
router.get('/dashboard',authed,(req,res) => AuthenticationController.showDashboard(req,res));

/*Blockchain Routes*/

// Search endPoint the main purpose is looking for blocks in the blockchain
router.post('/search',async(req,res) => BlockchainController.searchForBlock(req,res));

// end point to generate pair of keys ready to use
router.get('/address',async (req,res) => BlockchainController.generateAddress(req,res));

/* Middleware */
function authed(req,res,next){
    if(!req.user){
        res.redirect('/login');
    } else {
        next();
    }
}

function guest(req,res,next){
    if(!req.user){
        next();
    } else {
        res.redirect('/dashboard')
    }
}

module.exports=router;
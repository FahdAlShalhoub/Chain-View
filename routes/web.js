const express=require('express');
const router=express.Router();
const auth=require('../controllers/AuthenticationController');
const passport=require('passport');
const fetch = require("node-fetch");



router.use(passport.initialize());
router.use(passport.session());

router.get('/', async function(req,res){
    let blockchain = await fetch('https://api.blockcypher.com/v1/btc/main');
    let result = await blockchain.json()
    res.render('home',{user:req.user,block:result});
});

//Login
router.get('/login',guest,(req,res) => auth.showLoginForm(req,res));
router.post('/login',guest,(req,res,next) => auth.handleLogin(req,res,next));
router.get('/logout',authed,(req,res) => auth.handleLogout(req,res));

//Register
router.get('/register',guest,(req,res) => auth.showRegisterForm(req,res));
router.post('/register',guest,(req,res) => auth.handleRegistration(req,res));

//Dashboard
router.get('/dashboard',authed,(req,res) => auth.showDashboard(req,res));

//Middleware
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
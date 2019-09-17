const express=require('express');
const router=express.Router();
const auth=require('../controllers/auth/LoginController');

router.get('/',function(req,res){
    res.render('home');
});

//Login
router.get('/login',(req,res) => auth.showLoginForm(req,res));
router.post('/login',(req,res) => auth.handleLogin(req,res));
router.get('/logout',(req,res) => auth.handleLogout(req,res));

//Register
router.get('/register',(req,res) => auth.showRegisterForm(req,res));
router.post('/register',(req,res) => auth.handleRegistration(req,res));

module.exports=router;
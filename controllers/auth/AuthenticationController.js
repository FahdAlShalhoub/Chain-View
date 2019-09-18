const User=require('../../models/User');
const passport=require('passport');

//Passport Configuration
require('../../config/passport-config').configure(passport,User);

//Login
function showLoginForm(req,res){
    res.render('login',{user: req.user,message: req.flash('error')});
}

function handleLogin(req,res,next){
    passport.authenticate('local', { 
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true 
    })(req,res,next);
}

function handleLogout(req,res){
    req.logout();
    res.redirect('/');
}

//Register
function showRegisterForm(req,res){
    res.render('register',{user: req.user});
}

function handleRegistration(req,res){
    const {firstName,lastName,email,password,confirmPassword} = req.body;
    var errors = [];

    if(!firstName || !email || !lastName || !password || !confirmPassword){
        errors.push({message:"Please fill the required fields"});
    }

    if(password.length < 5){
        errors.push({message:"Password must be at least 5 characters long"});
    }

    if(password != confirmPassword){
        errors.push({message:"Password and confirm password must match"});
    }

    if(errors.length != 0){
        res.render('register',{
            errors,
            firstName,
            lastName,
            email,
            password,
            user: req.user
        });
    } else{

        User.exists({email:email})
        .then(exists=>{
            if(exists){
                errors.push({message:"User already exists"});
                res.render('register',{
                    errors,
                    firstName,
                    lastName,
                    email,
                    password,
                    user: req.user
                });
            } else{
                User.create({firstName:firstName,lastName:lastName,email:email,password: bcrypt.hashSync(password,10) });
                res.redirect('/login');
            }
        })
        .catch(err=>console.log(err));

    }
    
}

function showDashboard(req,res){
    res.render('dashboard',{user:req.user});
}

module.exports={
    showLoginForm,
    showRegisterForm,
    handleLogout,
    handleRegistration,
    handleLogin,
    showDashboard
};
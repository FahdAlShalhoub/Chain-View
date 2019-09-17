const bcrypt=require('bcryptjs');
const User=require('../../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Passport configuration
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ email: username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false,{flashFailure:'Email is not registered'});
          }
          if (!bcrypt.compareSync(password,user.password)) {
            return done(null, false,{flashFailure:'Passowrd is incorrect'});
          }
          return done(null, user);
        });
      }    
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

//Login
function showLoginForm(req,res){
    res.render('login',{message: req.flash('error')});
}

function handleLogin(req,res,next){
    passport.authenticate('local', { 
        successRedirect: '/',
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
    res.render('register');
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
            password
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
                    password
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
    res.render('dashboard',{name: req.user.firstName});
}

module.exports={
    showLoginForm,
    showRegisterForm,
    handleLogout,
    handleRegistration,
    handleLogin,
    showDashboard
};
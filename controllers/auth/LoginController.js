const bcrypt=require('bcryptjs');
const user=require('../../models/User');

function showLoginForm(req,res){
    res.render('login');
}

function handleLogin(req,res){

}

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

        user.exists({email:email})
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
                user.create({firstName:firstName,lastName:lastName,email:email,password: bcrypt.hashSync(password,10) });
                res.redirect('/login');
            }
        })
        .catch(err=>console.log(err));

    }
    
}

module.exports={
    showLoginForm,
    showRegisterForm,
    handleRegistration
};
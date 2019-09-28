const LocalStrategy = require('passport-local').Strategy;
const bcrypt=require('bcryptjs');

function configure(passport,User){
    passport.use(new LocalStrategy({usernameField:'email'},
        function(email, password, done) {
            User.findOne({ email: email }, function (err, user) {
              if (err) { return done(err); }
              if (!user) {
                return done(null, false,{message:'Email is not registered'});
              }
              if (!bcrypt.compareSync(password,user.password)) {
                return done(null, false,{message:'Passowrd is incorrect'});
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
}

module.exports={
    configure
};
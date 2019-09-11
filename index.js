const app = require('express')();
const passport = require('passport');
const LocalStrategy=require('passport-local');
const PORT = process.env.port || 5000;
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended:true}));

app.listen(PORT,function(){
    console.log(`The server is running on port: ${PORT}`);
});


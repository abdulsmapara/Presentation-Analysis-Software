//abdulsmapara
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var Cookie = require('cookie-parser');
var login_module = require('./login');
//var filename = "";
var validator = require('express-validator');
var presentation_module = require('./presentation');

app.use(validator());

app.use(bodyparser.urlencoded({
    extended: true
}));
var upload_module = require('./upload');
//var filename = "";
var validator = require('express-validator');
        // pull in the required packages.
var sdk = require("microsoft-cognitiveservices-speech-sdk");
// replace with your own subscription key,
// service region (e.g., "westus"), and
// the name of the file you want to run
// through the speech recognizer.
var subscriptionKey = "9e48f5d03e9c46aa89e3f5d11cc15cdb";
var serviceRegion = "westus"; // e.g., "westus"

// create the push stream we need for the speech sdk.
var pushStream = sdk.AudioInputStream.createPushStream();

//console.log(__dirname);
app.use('/',express.static('/home/abdulsmapara/Documents/FinalSoftEngg/public'));

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.setHeader('Access-Control-Allow-Methods', 'POST', 'GET');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    
    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


//app.use(bodyparser); 
//var jsonParser = bodyparser.json();
//
//var urlParser = bodyparser.urlencoded({
//    extended: true
//});

app.use(bodyparser.json());

app.use(Cookie());

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    var num=0;
    if(req.cookies['activeStudent'] == undefined || req.cookies['activeStudent'] == "none"){
        num++;
        
    } if(req.cookies['activeProfessional'] == undefined || req.cookies['activeProfessional'] == "none"){
        num++;
    }if(req.cookies['activeOther'] == undefined || req.cookies['activeOther'] == "none"){
        num++;
    }
    if(num == 3){
        console.log('RENDERING index ');
        res.render('index',{
            message : "none"
        });
    }else{
        res.redirect('/overview');
    }
});
app.post('/loginDB',login_module.loginDB);
app.post('/registerDB',login_module.registerDB);
app.get('/overview',login_module.overview);
app.get('/logoutDB',function (req,res) {
    if(req.cookies['activeStudent'] != undefined && req.cookies['activeStudent'] != "none"){
        login_module.logoutStudent(req,res);        
    } else if(req.cookies['activeProfessional'] != undefined && req.cookies['activeProfessional'] != "none"){
        login_module.logoutProfessional(req,res);
    }else if(req.cookies['activeOther'] != undefined && req.cookies['activeOther'] != "none"){
        login_module.logoutOther(req,res);
    }else{
        res.redirect('/');
    }
});
app.get('/courses',function(req,res){
    //courses customized
    if(req.cookies['activeStudent'] != undefined && req.cookies['activeStudent'] != "none"){
           
    } else if(req.cookies['activeProfessional'] != undefined && req.cookies['activeProfessional'] != "none"){
        
    }else if(req.cookies['activeOther'] != undefined && req.cookies['activeOther'] != "none"){
        
    }else{
        res.redirect('/');
    }
});
app.post('/analysePresentation',presentation_module.analysePresentation);
/*
app.post('/LogIntoInstructorAccount', login_module.instructor_login);


app.get('/register', function (req, res) {
    res.sendFile("/home/amrik/Desktop/nptel/templates/register.html");
});

// app.post('/checkValidUsername', login_module.check_validity);

app.post('/fetchFiles', course_module.fetchFiles);

app.post('/removeArticle', course_module.removeArticle);

// app.post('/logintoAccount', login_module.verify_login);

app.post('/registerStudentAccount', login_module.register_student_account);

// app.post('/editInfo', login_module.editInfo);

app.get('/overview', login_module.overview);

app.get('/i_overview', login_module.i_overview);

app.post('/addnewcourse', course_module.addNewCourse);

app.post('/publish', course_module.publish);

app.post('/finalTouchToCourse', course_module.decision);

app.get('/modifyCourse', course_module.modifyCourse);

app.get('/viewFile', course_module.viewFile);

app.post('/updateCourse', course_module.updateCourse);

app.post('/editCourse', course_module.editCourse);

app.get('/viewInsCourses', course_module.viewInsCourses);

// app.get('/logout', login_module.logOut);
*/

app.listen(3000);
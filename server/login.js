//abdulsmapara
// var conn = require('./connection');
// var upload_module = require('./upload');
var bodyparser = require('body-parser');
var multer = require('multer');
// var email = require('./email');
var Cookie = require('cookie-parser');
var logout = require('express-passport-logout');
var http=require('http');
var path = require('path');
var fs = require('fs');


var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';

exports.loginDB = function (req,res) {
	var user = req.body.myUsername;
    var pass = req.body.myPassword;
    var type = req.body.myType;

  req.checkBody('myUsername', 'Username is required').notEmpty();
  req.checkBody('myPassword', 'Password is required').notEmpty();
  
  var errors = req.validationErrors();
  var error_exists = 0;
  console.log("ERRORS !!! " + errors);  
  if(errors){
  	error_exists = 1;
  }
    MongoClient.connect(url, function(err, db) {
        if (err || errors) {
        	console.log("ERRORS--------------------------------------------" + err);
        	error_exists = 1;
        	if(!errors){
        		errors = err;
        	}
        } else {
            var dbs = db.db('SoftEngg');
            if(type == "Student")
            {
	            var cursor = dbs.collection('Student_login').find({'username': user, 'password': pass}).toArray(function (err, result) {
	                if (err) {
	                	error_exists=1;
	                } 
	                else 
	                {
	                    console.log(result);
	                    if (result.length == 1) {
	                        res.cookie('activeStudent', user);
                          res.cookie('message', 'none');
                          
                          res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
         res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	                        res.redirect("http://localhost:3000/overview");
	                        // Student profile
	                    } else {
	                        res.render("index", {
	                        	whoami:"none",
	                            message: "Invalid Username/Password !"
	                        });
	                    }
	                }

	            });
		    } 
		    else if(type == "Professional")
		    {
		    	var cursor = dbs.collection('Professional_login').find({'username': user, 'password': pass}).toArray(function (err, result) {
	                if (err) {
	                	error_exists=1;
	                } 
	                else 
	                {
	                    console.log(result);
	                    
	                    if (result.length == 1) {
	                        res.cookie('activeProfessional', user);
	                        var cursor3v=dbs.collection('Professional_login').find({'username':user,'password':pass}).toArray(function(err,result_1){
	                        	if(err){
	                        		error_exists=1;
	                        	}else{

	                        		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
         res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	                        		res.redirect("http://localhost:3000/overview");		
	                        	}
	                        });
	                        // Student profile
	                    } else {
	                        res.render("index", {
	                        	whoami:"none",
	                            message: "Invalid Username/Password !"
	                        });
	                    }
	                }

	            });
		    }else{
		    	var cursor = dbs.collection('Other_login').find({'username': user, 'password': pass}).toArray(function (err, result) {
	                if (err) {
	                	error_exists=1;
	                } 
	                else 
	                {
	                    console.log(result);
	                    
	                    if (result.length == 1) {
	                        res.cookie('activeOther', user);
	                        var cursor3v=dbs.collection('Other_login').find({'username':user,'password':pass}).toArray(function(err,result_1){
	                        	if(err){
	                        		error_exists=1;
	                        	}else{

	                        		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
         res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	                        		res.redirect("http://localhost:3000/overview");		
	                        	}
	                        });
	                        // Student profile
	                    } else {
	                        res.render("index", {
	                        	whoami:"none",
	                            message: "Invalid Username/Password !"
	                        });
	                    }
	                }

	            });
		    }   
        }
        
    });
    if(error_exists == 1){
    	console.log("ERROR HERE ! " + errors);
   		res.render("index", {
   			whoami: "none",
             message: "Please login again !"
         });
    }

}
exports.registerDB = function (req, res) {
    var user = req.body.myUsername;
    var pass = req.body.myPassword;
    var email = req.body.myEmail;
    var uname = req.body.myName;
    var type = req.body.myType;

    //validate input
    req.checkBody('myUsername', 'Username is required').notEmpty();
  req.checkBody('myPassword', 'Password is required').notEmpty();
  req.checkBody('myName', 'Name is required').notEmpty();
  req.checkBody('myEmail', 'Email is required').notEmpty();
  req.checkBody('myEmail', 'Email does not appear to be valid').isEmail();
  var error_exists = 0;
  // check the validation object for errors
  var errors = req.validationErrors();

  console.log(errors);  
  if(errors){
  	error_exists = 1;
  }


    // console.log(req.body);
    MongoClient.connect(url, function(err, db) {
        if (err) {
        	error_exists = 1;
        } else {
            var dbs = db.db('SoftEngg');
            if (type == "Student"){
            	var cursor2 = dbs.collection('Student_login').find({'username': user}).toArray(function (err, result) {
            		if(err){
            			error_exists = 1;
            		}else{
            			if(result.length == 1){
            				error_exists=1;
            				res.render("index",{
            					whoami:"none",
            					message:"Username already exists. Please change your username."
            				});
            			}

                  if(user == "none"){
                error_exists = 1;
                res.render("index",{
                      whoami:"none",
                      message:"Please specify a different username."
                    });
              }
              if(error_exists==0){
                      var cursor = dbs.collection('Student_login').insert({username: user, password: pass, email: email, name : uname}, function (err) {
                          if (err) {
                            error_exists = 1;
                          } 
                          else 
                          {
                            res.render("index", {
                            whoami: "none",
                            message: "Registration Successful !"
                        });
                          }

                      });
                    }

            		}
            	});
            	
	        }
          else if(type == "Professional"){
	        	var cursor2 = dbs.collection('Professional_login').find({'username': user}).toArray(function (err, result) {
            		if(err){
            			error_exists = 1;
            		}else{
            			if(result.length == 1){
            				error_exists=1;
            				res.render("index",{
            					whoami:"none",
            					message:"Username already exists. Please change your username."
            				});
            			 
                  }else{
                    if(user == "none"){
                error_exists = 1;
                res.render("index",{
                      whoami:"none",
                      message:"Please specify a different username."
                    });
              }
            if(error_exists == 0){
            var cursor = dbs.collection('Professional_login').insert({username: user, password: pass, email: email, name : uname}, function (err) {
                  if (err) {
                    error_exists = 1;
                  } 
                  else 
                  {
                    res.render("index", {
                    whoami: "none",
                    message: "Registration Successful!"
                });
                  }

              });
            }
                  }
            		}
            	});
            	
	        }else{
	        	var cursor2 = dbs.collection('Other_login').find({'username': user}).toArray(function (err, result) {
            		if(err){
            			error_exists = 1;
            		}else{
            			if(result.length == 1){
            				error_exists=1;
            				res.render("index",{
            					whoami:"none",
            					message:"Username already exists. Please change your username."
            				});
            			 
                  }else{
                    if(user == "none"){
                error_exists = 1;
                res.render("index",{
                      whoami:"none",
                      message:"Please specify a different username."
                    });
              }
            if(error_exists == 0){
            var cursor = dbs.collection('Other_login').insert({username: user, password: pass, email: email, name : uname}, function (err) {
                  if (err) {
                    error_exists = 1;
                  } 
                  else 
                  {
                    res.render("index", {
                    whoami: "none",
                    message: "Registration Successful!"
                });
                  }

              });
            }
                  }
            		}
            	});
            	
	        }
        }
        
    }); 
};
exports.overview = function(req,res){

	var user1 = req.cookies['activeStudent'];
	var user2 = req.cookies['activeProfessional'];
	var user3 = req.cookies['activeOther'];

	if(user1 != undefined && user1 != "none"){
			//student logged in
			res.render('overview',{
				whoami: user1,
				message: "none"
			});
	}else if(user2 != undefined && user2 != "none"){
			res.render('overview',{
				whoami: user1,
				message: "none"
			});
	}else if(user3 != undefined && user3 != "none"){
			res.render('overview',{
				whoami: user1,
				message: "none"
			});
	}else{
		res.redirect('/');
	}
}
exports.logoutStudent = function(req,res) {
	var user = req.cookies['activeStudent'];
	if(user != "none" && user != undefined){

	     res.cookie('activeStudent', "none");

        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
         res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

	     logout();

	     res.redirect('/');
	 }else{
	 	res.redirect('/');
	 }
};
exports.logoutProfessional = function(req,res) {
	var user = req.cookies['activeProfessional'];
	if(user != "none" && user != undefined){

	     res.cookie('activeProfessional', 'none');
         
	     logout();
	     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	       res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

	     res.redirect('/');
	 }else{
	 	res.redirect('/');
	 }
};
exports.logoutOther = function(req,res) {
	var user = req.cookies['activeOther'];
	if(user != "none" && user != undefined){

	     res.cookie('activeOther', 'none');
         
	     logout();
	     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	       res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

	     res.redirect('/');
	 }else{
	 	res.redirect('/');
	 }
};
var express = require('express');
var router = express.Router();
var Student = require("../model/student-model");
var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});
const bcrypt = require('bcryptjs');


router.post('/admin/login', function(req,res){
    if(req.body.username == "admin" && req.body.pword == "admin"){
        res.redirect('/users/adminhome');
    }else{
        res.render('adminlogin');
    }
});

router.get('/adminhome', function(req, res){
    Student.find({}, function(err, docs){
        //console.log(docs);
        res.render('adminhome', {students: docs});
    });
});

router.get('/reject/:reg_id', function(req, res){
    Student.findOne({reg_no: req.params.reg_id}, function(err, std) {
        if (std) {
            std.active = "Rejected";
            std.save(function (err, user) {
                if (err) {
                    res.send('db.error;');
                } else {
                    res.redirect('/users/adminhome');
                }
            });
        } else {
            res.send("Cannot Delete! error");
        }
    });
});

router.get('/activate/:reg_id', function(req, res){
    Student.findOne({reg_no: req.params.reg_id}, function(err, std) {
        if (std) {
            std.active = "Accepted";
            std.save(function (err, user) {
                if (err) {
                    res.send('db.error;');
                } else {
                    res.redirect('/users/adminhome');
                }
            });
        } else {
            res.send("Cannot Delete! error");
        }
    });
});

router.post('/registration', upload.any(), function(req, res){
    Student.findOne({username_no : req.body.user_name}, function(err,std){
        if (std) {
            res.send("Username already exists");
        }else{
            var std = new Student();
            std.username_no = req.body.user_name;
            std.passname_no = req.body.pass_name;
            std.reg_no = req.body.reg_name;
            std.roll_no = req.body.roll_name;
            std.email = req.body.email_name;
            std.bdate = req.body.bdate_name;
            std.sexname_no = req.body.sex_name;
            std.departmentname_no = req.body.department_name;
            std.addname_no = req.body.add_name;
            std.question1 = req.body.question1;
            std.question2 = req.body.question2;
            std.photo_name = req.files[0].filename;
            std.photo_url = '/uploads/'+req.files[0].filename;
            bcrypt.genSalt(10, function (err,salt) {
                bcrypt.hash(std.passname_no, salt, function (err, hash) {
                    if (err)
                        throw err;
                    std.password=hash;
                    std.save(function(err, user){
                        if(err){
                            res.send('db.error;');
                        }else{
                            res.redirect('/studentlogin');
                        }
                    });
                });
            });
        }
    });
});



router.post('/login',function(req, res){
    Student.findOne({username_no: req.body.username}, function(err,std){
        if (std) {
            if (std.active=="Accepted" && std.passname_no==req.body.pword) {
                //res.send("This is Student page");
                Student.findOne({username_no: req.body.username}, function(err, docs){
                    //console.log(docs);
                    res.render('studenthome', {student: docs});
                });
            }
            else if (std.passname_no!=req.body.pword)
                res.render('studenterror',{msg: 'Wrong Password'});
            else if (std.active=='Pending')
                res.render('studenterror',{msg: 'Waiting Approval'});
            else if (std.active=='Rejected')
                res.render('studenterror',{msg:'Permission Denied by Admin'});
        }else{
            res.render('studenterror',{msg: 'Not Registered'});
        }
    });
});

router.post('/updatedetails/:reg_id', upload.any(), function(req,res){
    Student.findOne({reg_no: req.params.reg_id}, function(err,std){

        if(req.body.add_name!="" || req.body.add_name!="Enter address..."){
            std.addname_no=req.body.add_name;

            if(req.body.email_name!="") {
                std.email=req.body.email_name;

                if(req.body.user_name!="") {
                    Student.findOne({username_no: req.body.user_name}, function (err, docs) {
                        if (docs)
                            res.render('studenterror', {msg: 'Username exists'});
                        else {
                            std.photo_name = req.files[0].filename;
                            std.photo_url = '/uploads/'+req.files[0].filename;
                            std.username_no = req.body.user_name;
                            std.save(function (err, user) {
                                if (err)
                                    res.send('db.error;');
                            });
                            res.render('studenthome', {student: std})
                        }
                    });
                }
            }
        }
    });
});

router.post('/updatepassword/:reg_id', function (req,res){
    Student.findOne({reg_no: req.params.reg_id}, function (err,std){
        if (std.passname_no==req.body.oldpass) {
            std.passname_no = req.body.newpass;
            std.save(function (err, user) {
                if (err)
                    res.send('db.error;');
            });
            res.render('studenthome',{student: std});
        }else{
            res.render('studenterror',{msg:'Wrong Password'});
        }
    });
});

router.post('/forgotpassword',function (req, res){
    Student.findOne({reg_no: req.body.reg_id}, function (err, std){
        if (std) {
            if (std.question1==req.body.question1 && std.question2==req.body.question2){
                std.passname_no=req.body.newpass;
                std.save(function (err, user) {
                    if (err)
                        res.send('db.error;');
                });
                res.render('studentlogin');
            }
            else {
                res.render('studenterror',{msg:"Wrong Answer!"});
            }
        }else{
            res.render('studenterror',{msg:"Registration No not found!"});
        }
    });
});

router.post('/deleteaccount/:reg_id',function(req, res) {
    Student.findOne({reg_no: req.params.reg_id}, function(err,std){
        if (std.question1 == req.body.question1 && std.question2 == req.body.question2 && std.passname_no == req.body.pass) {
            Student.deleteOne({reg_no: req.params.reg_id}, function(err){
                res.render("studenterror",{msg:"Account Succesfully Deleted"});
            });
        }else {
            res.render("studenterror",{msg:"Wrong Credentials"});
        }
    });
});

module.exports = router;
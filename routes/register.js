'use strict';
var express = require('express');
var router = express.Router();
var connection = require('./connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.use((req, res, next) => {
    console.log(req.url, "@", Date.now());
    next();
})

router
    .route('/')
    .get((req, res) => {
        console.log("Get /Register / ");
        res.render('register');
    })
    .post((req, res) => {
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        console.log('name : ', name, ' password : ', password);
        let sql = 'select * from user where email = ?';

        connection.query(sql, [email], (error, results, fields) => {
            if (results.length > 0) {
                res.render('register', { error: 'Email already exist!' });

            } else {
                let sqlInsert = 'INSERT INTO user (name, email,password,admin_privilege,created_on) VALUES (?,?,?,0,NOW())';
                bcrypt.genSalt(saltRounds, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        console.log("Hash Password : ", hash);  // Now we can store the password hash in db.



                        connection.query(sqlInsert, [name, email, hash], function (err, result) {
                            if (err) throw err;
                            console.log('1 record inserted');
                            res.render('register', { error: undefined, success: 'successful' });
                        });
                    });
                });


              
            }
        });
    });

module.exports = router;
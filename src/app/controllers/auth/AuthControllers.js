const userModel = require('../../models/user/index');
const { validationResult } = require('express-validator');
const user = require('../../models/user/index');
const bcrypt = require('bcrypt');
const passport = require('passport');
class AuthControllers {
    //[GET] /login
    login(req, res) {
            res.render('auth/login');
        }
        //[GET] /login
    register(req, res) {
            res.render('auth/register');
        }
        //[POST] /login
    postLogin(req, res, next) {
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    next(err);
                    console.log(err);
                }
                if (!user) {
                    req.flash('error', info.message);
                    res.redirect('/login');
                } else {
                    req.login(user, (err) => {
                        if (err) {
                            req.flash('error', info.message);
                            return next(err);
                        }
                        return res.redirect('/')
                    })
                }

            })(req, res, next)
        }
        //[GET] /logout
    logout(req, res) {
            req.logout();
            res.redirect('/');
        }
        //[POST] /register
    async postRegister(req, res) {
        const errors = validationResult(req);
        const { name, email, password } = req.body;
        if (!errors.isEmpty()) {
            const msg = errors.array();
            //  console.log(req.body)
            res.render('auth/register', { msg: msg, name, email, password })
        } else {
            //Hash password 
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const new_user = new userModel({
                name: name,
                email: email,
                password: hashedPassword,

            });
            new_user.save()
                .then(() => {

                    res.redirect('/login')
                })
                .catch((error) => {
                    console.log('Loi~ luu user vao database')
                    res.render('auth/register', { name, email, password })
                })
        }
    }
    facebook_login(req, res) {
        passport.authenticate('facebook');
    }
    facebook_login_success(req, res) {
        passport.authenticate('facebook', {
            successRedirect: '/done',
            failureRedirect: '/fail'
        });
    }
}

module.exports = new AuthControllers;
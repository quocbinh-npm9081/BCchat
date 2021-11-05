const userModel = require('../../models/user');
const moment = require('moment');
const { validationResult } = require('express-validator');
const multer = require('../../config/middlewares/uploadAvata/uploadAvata');
const cloudinary = require('../../utils/cloudinary/index');
const path = require('path')
class UserControllers {
    //[GET] /login
    profile(req, res) {
            const userId = req.session.passport.user;
            userModel.findById(userId, (err, user) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render('user/profile', { user: user, moment });
                }
            });
        }
        //[GET] /profile/:id:edit
    edit(req, res) {
            const userId = req.session.passport.user;
            userModel.findById(userId, (err, user) => {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(user)
                    res.render('user/edit', { user: user, moment });
                }
            })
        }
        //[PUT] /profile/:id/update
    update(req, res) {
            const userId = req.session.passport.user;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const msg = errors.array();
                userModel.findById(userId, (err, user) => {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log(user)
                        res.render('user/edit', { user: user, moment, msg: msg });
                    }
                })
            } else {
                userModel.updateOne({ _id: req.session.passport.user }, req.body)
                    .then(() => {
                        res.redirect('/profile')

                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }
        //[GET] 
    editAvata(req, res) {
            res.render('user/uploadAvata');
        }
        //[PUT] /profile/edit/avata/:id
    async updateAvata(req, res, next) {
        const userId = req.session.passport.user;
        const result = await cloudinary.uploader.upload(req.file.path);

        userModel.findById(userId, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                if (user.cloudinary_id === '' && user.avata === '') {
                    console.log(2);
                    userModel.updateOne({ _id: userId }, { avata: result.secure_url, cloudinary_id: result.public_id })
                        .then(() => {
                            res.redirect('/profile')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                } else {
                    console.log(1);
                    cloudinary.uploader.destroy(user.cloudinary_id);
                    userModel.updateOne({ _id: userId }, { avata: result.secure_url, cloudinary_id: result.public_id })
                        .then(() => {
                            res.redirect('/profile')
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            }
        })

    }
}

module.exports = new UserControllers;
const { check } = require('express-validator');
const userModel = require('../../../models/user/index');
const validatorRegister = [
    check('name').notEmpty().withMessage('Tên đang nhập không được bỏ trống')
    .isLength({ min: 6 }).withMessage('Tên đang nhập tối thiểu 6 chữ cái')
    .isLength({ max: 25 }).withMessage('Tên đăng nhập không quá 25 kí tự'),

    check('email').notEmpty().withMessage('Email không được bỏ trống')
    .isEmail().withMessage('Email không hợp lệ')
    .custom((value, { req }) => {
        return userModel.findOne({ email: value }).then(userDocument => {
            if (userDocument) return Promise.reject("Email đã được sử dụng");
        });
    }),

    check('password').notEmpty().withMessage('Mật khẩu không được bỏ trống')
    .isLength({ min: 8 }).withMessage('Mật khẩu tối thiểu 8 kí tự')
    .isLength({ max: 20 }).withMessage("Password can contain max 20 characters")

];


module.exports = validatorRegister;
const { check } = require('express-validator');
const validatorRegister = [
    check('name').notEmpty().withMessage('Tên đang nhập không được bỏ trống')
    .isLength({ min: 6 }).withMessage('Tên đang nhập tối thiểu 6 chữ cái')
    .isLength({ max: 13 }).withMessage('Tên đăng nhập không quá 13 kí tự'),

    check('email').notEmpty().withMessage('Email không được bỏ trống')
    .isEmail().withMessage('Email không hợp lệ'),

    check('password').notEmpty().withMessage('Mật khẩu không được bỏ trống')
    .isLength({ min: 8 }).withMessage('Mật khẩu tối thiểu 8 kí tự')
    .isLength({ max: 20 }).withMessage("Password can contain max 20 characters")
    .custom(() => {
        if (req.body.password === req.body.confirmPassword) {
            return true;
        } else {
            return false;
        }
    })
    .withMessage("Mật khẩu không chính xác.")
]
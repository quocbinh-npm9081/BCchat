const { check } = require('express-validator');
const userModel = require('../../../models/user/index');
const validatorUserEdit = [
    check('age').notEmpty().withMessage('Tuổi không được bỏ trống')
    .isInt().withMessage('Tuổi phải là số ')
    .isLength({ max: 2 }).withMessage('Tuổi tối đa 2 chữ số'),


    check('adress').notEmpty().withMessage('Địa chỉ không được để trống')
    .isLength({ min: 7 }).withMessage('Hãy nhập dịa chỉ chính xác'),

    check('education').notEmpty().withMessage('Công tác không được bỏ trống')
    .isLength({ min: 20 }).withMessage('Hãy nhập dịa chỉ công tác chính xác'),


];


module.exports = validatorUserEdit;
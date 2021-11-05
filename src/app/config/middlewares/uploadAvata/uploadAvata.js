//Upload file
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    // destination: function(req, file, cb) {
    //     // if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    //     //     cb(null, './src/public/images/userInterface/upload');
    //     // } else {
    //     //     cb(new Error('Định dạng ảnh không hợp lệ !'), false);
    //     // }
    //     cb(null, './src/public/images/userInterface/upload');
    // },
    filename: function(req, file, cb) {
        const uniqueSuffix = Math.round(Math.random() * 1E9) + '-' + file.originalname;
        cb(null, uniqueSuffix);
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50000 // 2000bytes       || 1000000 Bytes = 1 MB
    },
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".jfif") {
            cb(new Error('Định dạng ảnh không hợp lệ( chỉ jpg, jpeg, png) '), false);
            return;
        }
        cb(null, true);
    }
});
module.exports = upload;
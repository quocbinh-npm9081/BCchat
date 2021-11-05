const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../../models/user/index');
const bcrypt = require('bcrypt');

function init(passport) {
    passport.use(new FacebookStrategy({
            clientID: process.env.CLIENT_ID_FB,
            clientSecret: process.env.CLIENT_ID_SERECT,
            callbackURL: "http://localhost:4000/auth/facebook/bcchat",
            profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name']
        },
        function(accessToken, refreshToken, profile, cb) {
            //  console.log(profile);
            //return done(null, profile);
            /// asynchronous
            process.nextTick(function() {
                // tìm trong db xem có user nào đã sử dụng facebook id này chưa
                userModel.findOne({ facebookId: profile.id }, function() {
                    if (err) {
                        return done(err);

                    }
                    // Nếu tìm thấy user, cho họ đăng nhập
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // const new_user = new userModel({
                        //     email: profile.
                        // })
                        console.log(profile);
                    }

                })
            })
        }

    ));
    passport.use(new LocalStrategy({ usernameField: 'email' }, async(email, password, done) => {
        userModel.findOne({ email: email }, function(err, user) {
            if (err) { return done(err) };
            if (!user) { return done(null, false, { message: 'Email không tồn tại !' }) };
            bcrypt.compare(password, user.password)
                .then((match) => { // match return true nếu compare so sánh giống 
                    if (match) {
                        return done(null, user, { message: 'Đăng nhập thành công !' })
                    } else {
                        return done(null, false, { message: 'Email hoặc mật khẩu sai !' })
                    }
                })
                .catch(() => {
                    return done(null, false, { message: 'Email hoặc mật khẩu sai !' })
                });
        });

    }));
    passport.serializeUser(function(user, done) { // Đănng nhập thành công -> gửi User id vào session.user, ko có thì tạo mới
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) { //hàm được gọi bởi passport.session .Giúp ta lấy dữ liệu user dựa vào thông tin lưu trên session và gắn vào req.user
        userModel.findById(id, (err, user) => {
            done(err, user);
        })
    })
}


module.exports = init;
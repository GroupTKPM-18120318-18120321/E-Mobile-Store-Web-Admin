const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const configAuth = require('./authgoogle');

const adminAccountService = require('../models/services/adminAccountService');
const accountModel = require('../models/mongoose/accountModel');

passport.use(new LocalStrategy(
    async function (username, password, done) {
        const user = await adminAccountService.checkUser(username, password);
        
        if (!user) {
            return done(null, false, { message: 'Tên đăng nhập hoặc mật khẩu nhập sai!' });
        } else if (user.accountState === 1) {
            return done(null, false, { message: 'Tài khoản bạn đã bị khóa!' });
        } else {
            if (user.roleName === "User") {
                return done(null, false, { message: 'Bạn không được phép truy cập trang web này!' });
            } else {
                console.log("\npassport user: " + user.roleName + "\n");
                return done(null, user);
            }
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    adminAccountService.getUser(id).then((user) => {
        done(null, user);
    })
});

// auth google
passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: 'http://localhost:3000/auth/google/callback',
},
    function (token, refreshToken, profile, done) {
        process.nextTick(async function () {
            const user = await accountModel.findOne({ email: profile.emails[0].value });
            //console.log(user);
            if (user) {
               
                if (user.id) {
                    if (user.accountState === 1) {
                        return done(null, false, { message: 'Tài khoản bạn đã bị khóa!' });
                    } else if (user.role == "5fe9b7b8ea0d1f18102eed2f") {
                        return done(null, false, { message: 'Bạn không được phép truy cập trang web này!' });
                    } else return done(null, user);
                }
                else {
                    return done(null, false, { message: 'Email đã được sử dụng!!!' });
                }
            }
            else {
                return done(null, false, { message: 'Không tồn tại!' });
                // console.log(profile.id);
                // const newPostData =
                // {
                //     id: profile.id,
                //     token: token,
                //     name: profile.displayName,
                //     //email: profile.emails[0].value,
                //     avatar: 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png',
                // };

                // var newUser = new User(newPostData);
                // // set all of the relevant information
                // // pull the first email
                // // save the user
                // newUser.save(function (err) {
                //     if (err)
                //         throw err;
                //     return done(null, newUser);
                // });
            }
        });
    }));

module.exports = passport;
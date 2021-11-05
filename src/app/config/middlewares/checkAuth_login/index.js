function checkAuth_login(req, res, next) {
    if (req.isAuthenticated()) {
        //req.isAuthenticated() will return true if user is logged in
        return next();
    }
    return res.redirect("/"); //<- truong hop da login nhung van truy cap rout login se bi chuyen huong ra home

}

module.exports = checkAuth_login;
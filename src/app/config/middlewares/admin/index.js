function admin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else {
        res.redirect("/");
    }
}

module.exports = admin;
const userModel = require('../../models/user');

class HomeControllers {
    home(req, res) {
        res.render('home', { user: req.user });
        //console.log(req.user);
    }
    chatView(req, res) {

        res.render('chatview', { user: req.user });
    }
}

module.exports = new HomeControllers;
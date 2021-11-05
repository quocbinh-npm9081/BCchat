const messageModel = require('../../models/message/index');
class AdminControllers {

    async index(req, res) {
        await messageModel.deleteMany({})
            .then(msgs => {
                console.log('xoa thanh cong');
                res.redirect('/');
            })
            .catch(err => {
                console.log(err)
            })
    }
}
module.exports = new AdminControllers;
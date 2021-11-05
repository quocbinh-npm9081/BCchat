const userModel = require('../../models/user');
const messageModel = require('../../models/message');
class ChatRoomControllers {

    tabChat(req, res) {
        const userId = req.session.passport.user;
        userModel.findById(userId, function(err, user) {
            if (err) {
                console.log(err);
            } else {
                res.render('chatView', { user: user });
            }
        })

    }
    async getRecentConversation(req, res) { // nhap 1 cuoc tro chuyen gan day

    }
    async getConversationByRoomId(req, res) { // nhap 1 cuoc tro chuyen gan day boi ID room
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        //console.log(req.body);
        await messageModel.find({ roomId: req.body.roomId }).sort({ createdAt: 'asc' }).exec(
            (err, messages) => {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(messages);
                    res.json(messages);
                }
            }
        )
    }
    async initiate(req, res) {

    }
    async postMessage(req, res) {

    }
    async markConversationReadByRoomId(req, res) { // nhap 1 cuoc tro ch
    }
}


module.exports = new ChatRoomControllers;
const AuthControllers = require('../app/controllers/auth/AuthControllers');
const UserControllers = require('../app/controllers/user/UserControllers');
const HomeControllers = require('../app/controllers/home/HomeControllers');
const ChatRoomControllers = require('../app/controllers/chatRoom/index');
const AdminControllers = require('../app/controllers/admin/index');
const guest = require('../app/config/middlewares/guest/index');
const admin = require('../app/config/middlewares/admin/index');
const checkAuth_login = require('../app/config/middlewares/checkAuth_login/index');
const validatorRegister = require('../app/config/middlewares/register/index');
const valiidtorUpdateProfileUser = require('../app/config/middlewares/vali_editUser/index');
const upload = require('../app/config/middlewares/uploadAvata/uploadAvata');

function route(app) {
    app.get('/login', guest, AuthControllers.login);
    app.get('/register', guest, AuthControllers.register);
    app.post('/login', AuthControllers.postLogin);
    app.get('/logout', AuthControllers.logout);
    app.post('/register', validatorRegister, AuthControllers.postRegister);
    app.get('/auth/facebook', AuthControllers.facebook_login);
    app.get('/auth/facebook/bcchat', AuthControllers.facebook_login_success);

    // ADMIN=============================
    app.get('/admin', admin, AdminControllers.index);
    // ADMIN=============================
    app.get('/done', (req, res) => {
        res.send("You are done")
    });
    app.get('/fail', (req, res) => {
        res.send("You are fail")
    });

    app.get('/profile', checkAuth_login, UserControllers.profile);
    app.get('/profile/edit', checkAuth_login, UserControllers.edit);
    app.get('/profile/edit/avata/:id', checkAuth_login, UserControllers.editAvata);
    app.put('/profile/update', valiidtorUpdateProfileUser, UserControllers.update);
    app.put('/profile/avata/update', upload.single('imageURL'), UserControllers.updateAvata);


    app.post('/conversation', ChatRoomControllers.getConversationByRoomId);
    app.get('/chat', ChatRoomControllers.tabChat);

    // //CHAT ROOM
    // app.get('/', ChatRoomControllers.getRecentConversation);
    // app.get('/:roomId', ChatRoomControllers.getConversationByRoomId);
    // app.post('/initiate', ChatRoomControllers.initiate);
    // app.post('/:roomId/message', ChatRoomControllers.postMessage);
    // app.put('/:roomId/mark-read', ChatRoomControllers.markConversationReadByRoomId);
    // //DELETE CHAT ROOM
    // app.delete('/room/:roomId', DeleteControllers.deleteRoomById);
    // app.delete('/message/:messageId', DeleteControllers.deleteMessageById);
    // app.get('/chat', checkAuth_login, HomeControllers.chatView);
    app.get('/', HomeControllers.home);
}


module.exports = route;
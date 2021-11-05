const moment = require('moment');
const formatMessage = (data) => {
    msg = {
        from: data.formUser,
        to: data.toUser,
        message: data.msg,
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('hh:mm a'),
    }
    return msg;
}

module.export = formatMessage;
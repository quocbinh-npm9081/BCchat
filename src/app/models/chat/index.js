const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
    roomId: { type: String, require: true },
    messages: { type: Object }
}, {
    timestamps: true
});
const Message = mongoose.model("chat", chatSchema);
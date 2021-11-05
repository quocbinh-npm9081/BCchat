const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    roomId: { type: String },
    content: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
}, {
    timestamps: true
});
module.exports = mongoose.model("message", messageSchema);
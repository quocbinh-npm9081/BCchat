const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: { type: String, require: true, unique: true },
    name: { type: String },
    password: { type: String, require: true },
    adress: { type: String },
    avata: { type: String, default: "/images/userInterface/userOther.png" },
    cloudinary_id: { type: String },
    age: { type: Number },
    gender: { type: Number }, // 0 Female -  1 Male
    facebookId: { type: String },
    education: { type: String, default: 'Đại học Công nghệ Sài Gòn (STU)' },
    status: { type: Number },
    role: { type: String, default: 'user' }
}, {
    timestamps: true
});


module.exports = mongoose.model('user', userSchema);
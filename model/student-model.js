const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    username_no: { type: String, default: "" },
    passname_no: { type: String, default: "" },
    sexname_no: { type: String, default: "" },
    departmentname_no: { type: String, default: "" },
    addname_no: { type: String, default: "" },
    reg_no: String,
    roll_no: String,
    email: String,
    bdate: String,
    active: { type: String, default: "Pending" },
    question1: String,
    question2: String,
    photo_name: String,
    photo_url: String
});

const Student = mongoose.model('student', studentSchema);

module.exports = Student;
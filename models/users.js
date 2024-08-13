const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
User_prefix: {	type: String,
		enum:['นาย','นาง','นางสาว']
 		,required: true	},

User_Fname: {type: String ,required: true},
User_Lname: {type: String ,required: true},
User_gender: {type: String ,
		enum:['ชาย','หญิง'],
		required: true},

User_Date_Birth: {type: Date, 
    required: false, 
   	},
User_age: {type: Number, 
    required: true, 
    min: 0, 
    max: 120 },

User_phone_num: {type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); 
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },

User_email: {type: String,
    required: true,
    unique: true, 
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); 
      },
      message: props => `${props.value} is not a valid email!`
    }
},

user_status: {type: String ,
		enum:['ยังไม่ได้ตรวจสอบ','เอกสารครบถ้วน','เอกสารไม่ครบถ้วน'],
		default:'ยังไม่ได้ตรวจสอบ',
		required: true},
User_Image: {type: String ,required: true},
User_file: {type: String ,required: true},

},{timestamps:true , versionKey:false});

module.exports = mongoose.model('User',userSchema);
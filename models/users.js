const mongoose = require('mongoose');

const validateUserId = (value) => {
  // ตรวจสอบว่ามีความยาว 4 ตัวอักษรและเริ่มต้นด้วยตัวอักษร A-Z ตามด้วยตัวเลข 3 หลัก
  return /^[A-Z][0-9]{3}$/.test(value);
};

const userSchema = new mongoose.Schema({

  user_id: {
    type: String,
    required: true,
    validate: {
        validator: validateUserId,
        message: props => `${props.value} is not a valid user_id. Must be in the format A001-Z999.`
    }
},// ไม่ต้องเพิ่มข้อมูลเข้าไป เพราะ มีการสร้างเอง อัตโนมัต

National_ID: {
  type: String,
  required: true,
  unique: true,
  validate: {
    validator: function(v) {
      return /^\d{13}$/.test(v); // Validates that the National_ID contains exactly 13 digits
    },
    message: props => `${props.value} is not a valid National ID! Must be 13 digits.`
  }
},

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

 // Foreign key linking to the Admin collection
 admin_id_FK: {
  type: String,
  ref: 'Admin',  // Linking to the Admin collection
  required: true
},

// Foreign key linking to the Project collection
project_id_FK: {
  type: String,
  ref: 'Project',  // Linking to the Project collection
  required: true
}


},{timestamps:true , versionKey:false});

module.exports = mongoose.model('User',userSchema);
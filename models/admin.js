const mongoose = require('mongoose');

const adminSchma = new mongoose.Schema({
	admin_username:{type: String , required: true},
	admin_password:{type: String , required: true},
	admin_Fname:{type: String , required: true},
	admin_Lname:{type: String , required: true},
	

	admin_tel:{type: String,
    			required: true,
    			unique: true,
    			validate: {
     			   validator: function(v) {
        		   return /^\d{10}$/.test(v); 
      			},
      			   message: props => `${props.value} is not a valid phone number!`
    			}},

	admin_email:{type: String,
   			required: true,
    			unique: true, 
    			validate: {
     			 validator: function(v) {
        		  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); 
      			},
      message: props => `${props.value} is not a valid email!`
    }
},
admin_image:{type: String , required: true}

},{timestamps:true , versionKey:false});
module.exports = mongoose.model('Admin',adminSchma);
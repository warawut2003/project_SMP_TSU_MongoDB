const mongoose = require('mongoose');

// Custom validator for project_id
function validateProjectId(value) {
    return /^[A-Z]\d{4}$/.test(value); // Validates that the ID starts with an uppercase letter followed by 4 digits
  }

const projectSchma = new mongoose.Schema({
    project_id: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validateProjectId,
            message: props => `${props.value} is not a valid project_id! Must be in the format A0001 - Z9999.`
          }
      },
    
      project_name: {
        type: String,
        required: true
      },
    
      project_file: {
        type: String,
        required: true
      },
    
      project_start_date: {
        type: Date,
        required: true
      },
    
      project_expiration_date: {
        type: Date,
        required: true
      },
    
      // Foreign key linking to the Admin collection
    admin_id_FK: {
        type: String,
        ref: 'Admin',  // Linking to the Admin collection
        required: true
    }
    

},{timestamps:true , versionKey:false});
module.exports = mongoose.model('Project',projectSchma);
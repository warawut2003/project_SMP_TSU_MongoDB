const express = require('express'); 

const { getUsers, getUser, createUser,updateUser,deleteUser} = require('../controllers/userController');


const router = express.Router();

router.get('/get', getUsers);
router.get('/get/:id',getUser);
router.post('/user/create',createUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id',deleteUser);
    
module.exports = router;
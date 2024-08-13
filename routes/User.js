const express = require('express'); 

const { getUsers, getUser, createUser,updateUser,deleteUser} = require('../controllers/userController');


const router = express.Router();

router.get('/users', getUsers);
router.get('/user/:id',getUser);
router.post('/user',createUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id',deleteUser);

module.exports = router;
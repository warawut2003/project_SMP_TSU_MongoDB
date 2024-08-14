const express = require('express'); 


const { getUsers, getUser,updateUser,deleteUser} = require('../controllers/adminActionController');
const authenticateToken = require("../middlewares/auth");

const router = express.Router();

router.get('/users',authenticateToken, getUsers);
router.get('/user/:id',authenticateToken,getUser);
router.put('/user/:id',authenticateToken, updateUser);
router.delete('/user/:id',authenticateToken,deleteUser);

module.exports = router;
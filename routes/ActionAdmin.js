const express = require('express'); 


const { admin_getUsers, getUser,admin_UpdateUser,deleteUser} = require('../controllers/adminActionController');
const {createProject,updateProject,getProject,getProjects,deleteProject} = require("../controllers/projectController");
const authenticateToken = require("../middlewares/auth");

const router = express.Router();

router.get('/get/users/:project_id',authenticateToken,admin_getUsers);
router.get('/get/user/:id',authenticateToken,getUser);
router.put('/update/user/:id',authenticateToken, admin_UpdateUser);
router.delete('/delete/user/:id',authenticateToken,deleteUser);

router.post("/create/project",authenticateToken,createProject);
router.delete("/delete/project/:id",authenticateToken,deleteProject);
router.put("/update/project/:id",authenticateToken, updateProject);
router.get("/project/:id",authenticateToken, getProject);
router.get("/projects",authenticateToken, getProjects);

module.exports = router;
const Projects = require("../models/project");
const Users = require('../models/users');

const generateProject = async () => {
    const lastPrject = await Projects.findOne().sort({ project_id: -1 }).exec(); // หาผู้ใช้คนล่าสุดตาม user_id

    if (!lastPrject) {
        return 'A0001'; // ถ้าไม่มีผู้ใช้ในฐานข้อมูลเลย ให้เริ่มต้นที่ A001
    }

    const lastProjectId = lastPrject.project_id; // ดึงค่า user_id ของผู้ใช้คนล่าสุด
    let letterPart = lastProjectId.slice(0, 1); // ตัวอักษร A-Z
    let numberPart = parseInt(lastProjectId.slice(1), 10); // ตัวเลข 001-999

    // เพิ่มค่า numberPart
    numberPart += 1;

    if (numberPart > 9999) {
        // ถ้าเกิน 999 ให้เปลี่ยนตัวอักษรและรีเซ็ตตัวเลข
        letterPart = String.fromCharCode(letterPart.charCodeAt(0) + 1);
        numberPart = 1;
    }

    const newProjectID = `${letterPart}${numberPart.toString().padStart(4, '0')}`; // ประกอบ user_id ใหม่

    return newProjectID;
};

exports.createProject = async (req,res) => {
    const project_id = await generateProject();

    const {project_name, project_file , project_start_date, project_expiration_date ,admin_id_FK} = req.body;
    const project = new Projects({project_id,project_name, project_file, project_start_date, project_expiration_date,admin_id_FK})
    try{
        const newProject = await project.save();
        res.status(201).json(newProject);
    }catch (err){
        res.status(400).json({message: err.message});
    }
};

// CRUD
exports.getProjects = async(req,res) =>{
    try{
        const project = await Projects.find();
        res.status(200).json(project);

    }catch (err){
        res.status(500).json({message: err.message});
    }
};

exports.getProject = async (req,res) =>{
    try{
        const { id } = req.params;
        const project  = await Projects.findOne({project_id: id});
        if (!project) return res.status(404).json({message:"Project not found"});
        res.status(200).json(project);
    }catch (err){
        res.status(500).json({ message: err.message });
    }
};

exports.updateProject = async (req,res) => {
    try{
        const {id} = req.params;
        const project = await Projects.findOne({project_id: id});

        if(!project) return res.status(404).json({message : 'Project not found'});
        const data = {$set : req.body};

        await Projects.updateOne({ project_id: id }, data);
        console.log(data);

        res.status(200).json({ message: 'Project updated successfully' });
    }catch (err) { 

        res.status(400).json({ message: err.message }); 

    }
}

exports.deleteProject = async(req,res) =>{
    try{
        const { id } = req.params;
        const project = await Projects.findOne({project_id: id});
        if(!project) return res.status(404).json({message: 'Project not found'});

        // ลบผู้ใช้ที่มี project_id_fk เชื่อมโยงกับโปรเจกต์ที่ลบ
        await Users.deleteMany({ project_id_fk: id });

        await Projects.deleteOne({ project_id: id });
        res.status(200).json({ message: 'Project deleted successfully' });
    }catch(err){
        res.status(404).json({message : err.message});
    }
}

exports.nonEndProject = async (req, res) => {
    try {
        // Query เพื่อดึงข้อมูลโปรเจกต์ที่ยังไม่หมดอายุ
        const projects = await Project.find({
            project_expiration_date: { $gt: new Date() } // ตรวจสอบว่า project_expiration_date มากกว่าเวลาปัจจุบัน
        })
        .sort({ project_start_date: -1 }) // เรียงลำดับจากวันที่เริ่มต้นในลำดับจากมากไปน้อย
        .select('project_id project_name project_start_date project_expiration_date project_file'); // เลือกเฉพาะฟิลด์ที่ต้องการ

        res.json(projects); // ส่งผลลัพธ์กลับไปยังฝั่ง client
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).send('Error fetching projects.');
    }
};
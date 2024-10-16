const Users = require('../models/users'); 
const mongoose = require('mongoose');
// ฟังก์ชันสำหรับสร้าง user_id ในรูปแบบ A001 ถึง Z999
const generateUserId = async () => {
    const lastUser = await Users.findOne().sort({ user_id: -1 }).exec(); // หาผู้ใช้คนล่าสุดตาม user_id

    if (!lastUser) {
        return 'A001'; // ถ้าไม่มีผู้ใช้ในฐานข้อมูลเลย ให้เริ่มต้นที่ A001
    }

    const lastUserId = lastUser.user_id; // ดึงค่า user_id ของผู้ใช้คนล่าสุด
    let letterPart = lastUserId.slice(0, 1); // ตัวอักษร A-Z
    let numberPart = parseInt(lastUserId.slice(1), 10); // ตัวเลข 001-999

    // เพิ่มค่า numberPart
    numberPart += 1;

    if (numberPart > 999) {
        // ถ้าเกิน 999 ให้เปลี่ยนตัวอักษรและรีเซ็ตตัวเลข
        letterPart = String.fromCharCode(letterPart.charCodeAt(0) + 1);
        numberPart = 1;
    }

    const newUserId = `${letterPart}${numberPart.toString().padStart(3, '0')}`; // ประกอบ user_id ใหม่

    return newUserId;
};

// CRUD
exports.getUsers = async(req,res) =>{
    try{
        const user = await Users.find();
        res.status(200).json(user);

    }catch (err){
        res.status(500).json({message: err.message});
    }
};

exports.getUser = async (req, res) => {
    const nationalId = req.params.id;
    const projectId = req.query.project_id;

    console.log(nationalId);
    console.log(projectId);
    
    // ตรวจสอบว่ามีเลขบัตรประชาชนและ Project ID หรือไม่
    if (!nationalId || !projectId) {
        return res.status(400).send('กรุณาระบุเลขบัตรประชาชนและ Project ID');
    }

    try {
        // ค้นหาผู้ใช้ในฐานข้อมูล
        const user = await Users.findOne({
            National_ID: nationalId,
            project_id_FK: projectId, // ใช้ projectId โดยตรง
        });

        console.log(user);

        // ตรวจสอบว่ามีผู้ใช้ที่ค้นพบหรือไม่
        if (user) {
            return res.status(200).json(user); // ส่งข้อมูลผู้ใช้กลับโดยไม่รวมข้อมูลโครงการ
        } else {
            return res.status(404).send('ไม่พบข้อมูลผู้ใช้'); // ไม่มีผู้ใช้
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'); // ข้อผิดพลาดทั่วไป
    }
};

exports.createUser = async (req,res) => {
    const user_id = await generateUserId();

    const {National_ID,User_prefix, User_Fname, User_Lname, User_gender,User_Date_Birth,User_age,User_phone_num,User_email,user_status,User_Image,User_file,project_id_FK} = req.body;
    

    const user = new Users({user_id,National_ID,User_prefix, User_Fname, User_Lname, User_gender,User_Date_Birth,User_age,User_phone_num,User_email,user_status,User_Image,User_file,project_id_FK})
    try{
        
        const newUser = await user.save();
        console.log(newUser);
        res.status(201).json(newUser);
    }catch (err){
        res.status(400).json({message: err.message});
        console.log("Error message:", err.message);
        
    }
    
};

exports.updateUser = async (req,res) => {
    try{
        const {id} = req.params;
        const user = await Users.findOne({user_id: id});

        if(!user) return res.status(404).json({message : 'User not found'});
        const data = {$set : req.body};

        await Users.updateOne({ user_id: id }, data);

        res.status(200).json({ message: 'User updated successfully' });
    }catch (err) { 

        res.status(400).json({ message: err.message }); 

    }
}

exports.deleteUser = async(req,res) =>{
    try{
        const { id } = req.params;
        const user = await Users.findOne({user_id: id});
        if(!user) return res.status(404).json({message: 'User not found'});
        await Users.deleteOne({ user_id: id });
        res.status(200).json({ message: 'User deleted successfully' });
    }catch(err){
        res.status(404).json({message : err.message});
    }
}

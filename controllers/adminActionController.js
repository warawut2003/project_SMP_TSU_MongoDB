const Users = require('../models/users');

exports.admin_getUsers = async (req, res) => {
    const project_id = req.params.project_id; // รับ project_id จากพารามิเตอร์ใน URL

    try {
        // ค้นหาผู้ใช้ที่มี project_id_fk ตรงกับ project_id ที่ได้รับ
        const users = await Users.find({ project_id_FK: project_id }) // ใช้ Mongoose เพื่อค้นหา
            .sort({ User_id: -1 }); // เรียงลำดับ User_id จากมากไปน้อย

        res.json(users); // ส่งผลลัพธ์กลับไปยังฝั่ง client

        console.log(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Error fetching users.');
    }
};

exports.getUser = async (req,res) =>{
    try{
        const { id } = req.params;
        const user  = await Users.findOne({user_id: id});
        if (!user) return res.status(404).json({message:"User not found"});
        res.status(200).json(user);
    }catch (err){
        res.status(500).json({ message: err.message });
    }
};

exports.admin_UpdateUser = async (req, res) => {
    const { user_status, admin_id } = req.body; // รับข้อมูลจาก body
    
    const userId = req.params.id; // รับ User_id จากพารามิเตอร์ใน URL

    try {
        const now = new Date(); // สร้างวันที่ปัจจุบัน

        // ค้นหาและอัปเดตผู้ใช้ที่มี User_id ตรงกับ userId
        const updatedUser = await Users.findOneAndUpdate(
            { user_id: userId }, // เงื่อนไขการค้นหา
            {
                user_status: user_status, // อัปเดต User_status
                admin_id_FK: admin_id, // อัปเดต admin_id_FK
                update_at: now // อัปเดตวันที่
            },
            { new: true } // คืนค่าผลลัพธ์ที่อัปเดตแล้ว
        );

        if (!updatedUser) {
            return res.status(404).send("User not found."); // ตรวจสอบว่าพบผู้ใช้หรือไม่
        }

        console.log('Update Successfully');
        res.status(200).send("Update Successfully.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating user.");
    }
};

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
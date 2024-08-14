const Users = require('../models/users');

exports.getUsers = async(req,res) =>{
    try{
        const user = await Users.find();
        res.status(200).json(user);

    }catch (err){
        res.status(500).json({message: err.message});
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

exports.updateUser = async (req,res) => {
    const {user_status} = req.body
    try{
        const {id} = req.params;
        const user = await Users.findOne({user_id: id});

        if(!user) return res.status(404).json({message : 'User not found'});

        // ตรวจสอบค่า user_status ว่าเป็นค่าใน enum หรือไม่
        const validStatuses = ['ยังไม่ได้ตรวจสอบ', 'เอกสารครบถ้วน', 'เอกสารไม่ครบถ้วน'];
        if (!validStatuses.includes(user_status)) {
            return res.status(400).json({ message: 'Please enter the correct value.' });
        }

        const data = {$set : {user_status}};
        

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
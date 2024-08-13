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
        const user  = await Users.findById(id);
        if (!user) return res.status(404).json({message:"User not found"});
        res.status(200).json(user);
    }catch (err){
        res.status(500).json({ message: err.message });
    }
};

exports.createUser = async (req,res) => {
    const {User_prefix, User_Fname, User_Lname, User_gender,User_Date_Birth,User_age,User_phone_num,User_email,user_status,User_Image,User_file} = req.body;

    const user = new Users({User_prefix, User_Fname, User_Lname, User_gender,User_Date_Birth,User_age,User_phone_num,User_email,user_status,User_Image,User_file})
    try{
        const newUser = await user.save();
        res.status(201).json(newUser);
    }catch (err){
        res.status(400).json({message: err.message});
    }
};

exports.updateUser = async (req,res) => {
    try{
        const {id} = req.params;
        const user = await Users.findById(id);

        if(!user) return res.status(404).json({message : 'User not found'});
        const data = {$set : req.body};

        await Users.findByIdAndUpdate(id,data);

        res.status(200).json({ message: 'User updated successfully' });
    }catch (err) { 

        res.status(400).json({ message: err.message }); 

    }
}

exports.deleteUser = async(req,res) =>{
    try{
        const { id } = req.params;
        const user = await Users.findById(id);
        if(!user) return res.status(404).json({message: 'User not found'});
        await Users.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    }catch(err){
        res.status(404).json({message : err.message});
    }
}

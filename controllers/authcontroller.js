const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const dotenv = require('dotenv');

dotenv.config();


const generateAdminId = async () => {
    const lastAdmin = await Admin.findOne().sort({ admin_id: -1 }).exec(); 

    if (!lastAdmin) {
        return 'A01'; 
    }

    const lastAdminId = lastAdmin.admin_id; 
    let letterPart = lastAdminId.slice(0, 1);
    let numberPart = parseInt(lastAdminId.slice(1), 10); 

    numberPart += 1;

    if (numberPart > 99) {
        
        letterPart = String.fromCharCode(letterPart.charCodeAt(0) + 1);
        numberPart = 1;
    }

    const newAdminId = `${letterPart}${numberPart.toString().padStart(2, '0')}`; 

    return newAdminId;
};



exports.register = async (req,res) => {
    const {admin_username,admin_password,admin_Fname,admin_Lname,admin_tel,admin_email,admin_image} = req.body

    try{
        const hashedPasswor = await bcrypt.hash(admin_password,10);
        const admin_id = await generateAdminId();
        const admin = new Admin ({admin_id,admin_username, admin_password: hashedPasswor, admin_Fname, admin_Lname ,admin_tel,admin_email,admin_image});
        await admin.save();
        res.status(201).send("Admin registered");
    }catch (err){
        res.status(500).send(err.message);
    }
}

exports.login = async(req,res) =>{
    const {admin_username , admin_password} = req.body;
    try {
        const admin = await Admin.findOne({admin_username});
        if(!admin) return res.status(400).send("admin not found");
        const isMatch = await bcrypt.compare(admin_password, admin.admin_password);
        if(!isMatch) return res.status(400).send("Invalid cradentials");
        const name=admin.admin_Fname+" "+admin.admin_Lname;
        const accessToken = jwt.sign(
            {adminId : admin._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : "15m"}
        );
        const refreshToken = jwt.sign(
            {adminId: admin._id},
            process.env.REFRESH_TOKEN_SECRET
        );
        res.json({admin_username,name,accessToken, refreshToken});

    }catch (err){
        res.status(500).send(err.message);
    }
};

exports.refresh = async(req,res) =>{
    const {token} = req.body;

    if(!token) return res.sendStatus(401);

    jwt.verify(token , process.env.REFRESH_TOKEN_SECRET, (err, admin)=>{
        if(err) return res.sendStatus(403);
        const accessToken = jwt.sign(
            {adminID: admin.adminId},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"25m"}
        );
        res.json({accessToken});
    })
}
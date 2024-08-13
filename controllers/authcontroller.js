const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const dotenv = require('dotenv');

dotenv.config();

exports.register = async (req,res) => {
    const {admin_username,admin_password,admin_Fname,admin_Lname,admin_tel,admin_email,admin_image} = req.body

    try{
        const hashedPasswor = await bcrypt.hash(admin_password,10);
        const admin = new Admin ({admin_username, admin_password: hashedPasswor, admin_Fname, admin_Lname ,admin_tel,admin_email,admin_image});
        await admin.save();
        res.status(201).send("Admin registered");
    }catch (err){
        res.status(400).send(err.message);
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
            {expiresIn : "10m"}
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
            {expiresIn:"15m"}
        );
        res.json({accessToken});
    })
}
const { User } = require("../models/user.js");
const bcrypt=require("bcrypt");
const { sendCookie } = require("../utils/features");



const register = async (req, res) => {
    console.log(req.body)
    const { name, email, password } = req.body;
    console.log(password,"password")

    if (!password) {
        return res.status(400).json({ success: false, message: "Password is required" });
    }

    let user = await User.findOne({ email });

    if (user) return res.status(404).json({
        success: false,
        message: "User Already Exists",
    });

   
    const hashedPassword = await bcrypt.hash(password,10);
    console.log(hashedPassword)

    user = await User.create({ name, email, password: hashedPassword });

    sendCookie(user, res, "Registered Successfully", 201);
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Invalid Email or password",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(404).json({
            success: false,
            message: "Invalid Email or password",
        });
    }

    sendCookie(user, res, `Welcome back, ${user.name}`, 200);
};



const getMyProfile =(req, res) => {
    res.status(200).json({
        success: true,
        user:req.user
    });
};


const logout=async(req,res)=>{
    res.status(200).cookie("token","",{expires:new Date(Date.now())}).json({
        success: true,
        user:req.user
    });
}

module.exports = {
    register,
    getMyProfile,
    login,
    logout
};

const { User } = require("../models/user.js");
const bcrypt=require("bcrypt");
const { sendCookie } = require("../utils/features");
const { ErrorHandler } = require("../middlewares/error.js");



const register = async (req, res,next) => {
  
    const { name, email, password } = req.body;
    
    if (!password) {
        return res.status(400).json({ success: false, message: "Password is required" });
    }

    let user = await User.findOne({ email });

    if(user) return next(new ErrorHandler("User Already Exists",404));
    
    const hashedPassword = await bcrypt.hash(password,10);
    console.log(hashedPassword)

    user = await User.create({ name, email, password: hashedPassword });

    sendCookie(user, res, "Registered Successfully", 201);
};

const login = async (req, res, next) => {
   try{
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if(!user) return next(new ErrorHandler("Invalid Email or password",400));
    
    
    const isMatch = await bcrypt.compare(password, user.password);

    if(!user) return next(new ErrorHandler("Invalid Email or password",400));
    
    sendCookie(user, res, `Welcome back, ${user.name}`, 200);
   }
   catch(error){
    next(error)
   }
};

const getMyProfile =(req, res) => {
    res.status(200).json({
        success: true,
        user:req.user
    });
};


const logout=async(req,res)=>{
    res.status(200).cookie("token","",{expires:new Date(Date.now()),
        sameSite:process.env.NODE_ENV==="Development"?"lax":"none",
        secure:process.env.NODE_ENV==="Development"?false:true,
    })
    .json({
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

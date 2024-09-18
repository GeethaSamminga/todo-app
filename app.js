const express=require("express");
const mongoose=require("mongoose");
const dotenv = require("dotenv")
const TaskRouter= require("./routes/task.js");
const userRouter= require("./routes/user.js");
const cookieParser = require("cookie-parser");
const { errorMiddleware } = require("./middlewares/error.js");
const cors=require("cors")


const app=express();

dotenv.config({ path: "./data/config.env" });

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
}))

// using routes
app.use("/api/v1/users",userRouter);
app.use("/api/v1/task",TaskRouter);
   
app.get("/",(req,res)=>{
    res.send("nice working")
    });

 // using error middleware
app.use(errorMiddleware)

module.exports=app
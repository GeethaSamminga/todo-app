const { ErrorHandler } = require("../middlewares/error.js");
const { Task } = require("../models/task.js");

const newTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        console.log("User:", req.user);

        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user found" });
        }

        await Task.create({
            title,
            description,
            user: req.user
        });

        res.status(201).json({
            success: true,
            message: "Task added Successfully"
        });
    } catch (error) {
        next(error);
    }
};

// to get the task
const getmyTask=async(req,res,next)=>{
try{
    const userid=req.user._id;

    const tasks = await Task.find({user:userid});

    res.status(200).json({
        success:true,
        tasks,
    })
}
 catch(error) {
next(error);
 }
};

//to update the task
const updateTask=async(req,res,next)=>{
try{
    const task=await Task.findById(req.params.id);

    if(!task) return next(new ErrorHandler("Task not found",404));
    
   
       task.iscompleted=!task.iscompleted;
       await task.save();
   
       res.status(200).json({
           success:true,
           message:"task updated successfully"
       })
}
catch(error){
    next(error)
}
}

// to delete task
const deleteTask=async(req,res,next)=>{
   try{
    const task=await Task.findById(req.params.id);
    
    if(!task) return next(new ErrorHandler("Task not found",404));

        await task.deleteOne();
    
    
    res.status(200).json({
        success:true,
        message:"task deleted successfully"
    })
   }
   catch(error){
    next(error)
   }
   
}

module.exports = {
    newTask,
    getmyTask,
    updateTask,
    deleteTask,
};


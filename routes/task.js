const express= require("express");
const { isAuthenticated } = require("../middlewares/auth.js");
const{newTask, getmyTask, updateTask, deleteTask}=require("../controllers/task.js")
const router=express.Router();

router.post("/addtask",isAuthenticated,newTask);

router.get("/mytask",isAuthenticated,getmyTask);

router.route("/:id")
.put(isAuthenticated,updateTask)
.delete(isAuthenticated,deleteTask)

module.exports=router;
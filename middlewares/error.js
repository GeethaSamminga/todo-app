class ErrorHandler extends Error{
    constructor(message,statuscode){
        super(message);
        this.statuscode=statuscode;
    }
}

const errorMiddleware=(err,req,res,next)=>{
    err.message = err.message || "Internal Server Error";

  return  res.status(404).json({
        success:false,
        message: err.message,
    });
}
module.exports={
    errorMiddleware,
    ErrorHandler,
}
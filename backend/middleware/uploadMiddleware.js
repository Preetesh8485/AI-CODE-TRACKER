import multer from "multer"
import ErrorHandler from "./errorMiddleware.js"
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes =
        ["application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        if(allowedMimeTypes.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new ErrorHandler("Only pdf or Docx file are allowed!",400),false);
        }
};
const uploadResume=multer({
    storage,
    limits:{
        fileSize:5*1024*1024,
    },
    fileFilter,
})
export default uploadResume;
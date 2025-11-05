const express=require('express')
const bcrypt=require('bcrypt')
const multer=require('multer')
const path =require('path')
const app=express()
app.use(express.json())
app.use(express.static("C:/Users/Yared/Desktop/node_quickstart/Crud Api with mongo/Static"))
const {getDB,connectToDB}=require("./Databaseconn")
const storage = multer.diskStorage({
    destination: "C:/Users/Yared/Desktop/node_quickstart/Crud Api with mongoStatic/Uploads",        // Folder for saved images
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique name
    }
  });
  const upload = multer({ storage });

let db;
connectToDB(err=>{
    if(!err){
        db=getDB()
        app.post("/Stores/Signup",async (req,res)=>{
            const {password,...Data}=req.body
            const userExists=await db.collection("Storeinfo").findOne({businessName:Data.businessName})
            if(userExists) return res.json({success:false,MSG:"User already exists"})
            const hashed=await bcrypt.hash(password,10)
            db.collection("Storeinfo").insertOne({...Data,password:hashed}).
            then(result=>{
                res.status(200).json({success:true,data:Data.Storename,MSG:"Successfully registered",DBINFO:result})
            }).catch(err=>{
                console.error(err)
                res.status(500).json({MSG:"Could Not upload The document"})
            })
        })
        app.post('/Stores/Login',async(req,res)=>{
            const {businessName,password}=req.body
            const user=await db.collection("Storeinfo").findOne({businessName:businessName})
            if(!user) return res.json({success:false,MSG:"No bussinessName of that sort was found"})
            const match=await bcrypt.compare(password,user.password) 
            if(!match) return res.json({success:false,MSG:"Password is incorrect"})
            res.json({success:true,MSG:"User succesfully logged in",businessName: businessName})        
        })
        app.post("/Stores/Display",async (req,res)=>{
            try{
            const {businessName}=req.body
            const BussinessList=await db.collection("Storeinfo").findOne({businessName:businessName})
            if(!BussinessList) return res.json({success:false,MSG:"I dont know what is wrong"})
            res.status(200).json({success:true,data:BussinessList})  
            }catch(err){
                console.log(err)
                res.status(500).json({ success: false, MSG: "Server error" })
            }  
        })
        app.post("/Stores/UploadProfile", upload.single("image"), async (req, res) => {
            try {
              const { businessName } = req.body;
              const filePath = `/Uploads/${req.file.filename}`;
          
              const result = await db.collection("Storeinfo").updateOne(
                { businessName },
                { $set: { profileImage: filePath } }
              );
          
              if (result.modifiedCount === 0)
                return res.json({ success: false, MSG: "Business not found" });
          
              res.json({ success: true, path: filePath, MSG: "Profile image uploaded" });
            } catch (err) {
              console.error(err);
              res.status(500).json({ success: false, MSG: "Server error" });
            }
          });
          app.post("/Stores/UploadLicence", upload.single("image"), async (req, res) => {
            try {
              const { businessName } = req.body;
              const filePath = `/Uploads/${req.file.filename}`;
          
              const result = await db.collection("Storeinfo").updateOne(
                { businessName },
                { $set: { licenceImage: filePath } }
              );
          
              if (result.modifiedCount === 0)
                return res.json({ success: false, MSG: "Business not found" });
          
              res.json({ success: true, path: filePath, MSG: "License image uploaded" });
            } catch (err) {
              console.error(err);
              res.status(500).json({ success: false, MSG: "Server error" });
            }
          });
          
        /*app.get('/Cars/get',(req,res)=>{
             db.collection('Sample').find().
             toArray().
             then(result=>{
                res.status(200).json(result)
             }).catch(err=>{
                console.error(err)
                res.status(500).json({success:false,Msg:"Server Error"})
             })
        })
        app.post("/Cars/Upload",(req,res)=>{
            const Uploads=req.body
            db.collection("Sample").insertOne(Uploads).
            then(result=>{
                res.status(200).json({success:true,data:result})
            }).catch(err=>{
                console.error(err)
                res.status(500).json({MSG:"Could Not upload The document"})
            })
        })
        app.patch("/Cars/Update/:Model",(req,res)=>{
            const {Model}=req.params
            const updates=req.body
            db.collection("Sample").updateOne({Model:Model},{$set:updates}).then(result=>{
                res.status(200).json(result)
            }).catch(err=>{
                console.error(err)
                return res.status(500).json({Msg:"Error"})
            })
        })
        app.delete("/Cars/Delete/:Model",(req,res)=>{
            const {Model}=req.params
            db.collection("Sample").deleteOne({Model:Model})
            .then(result=>{res.json(result)})
            .catch(err=>{
                console.error(err)
                return res.json({success:false,Msg:"error"})
            })
        })*/
        app.listen(5000,()=>{
            console.log("Server running on port 5000")
        })
    }
})
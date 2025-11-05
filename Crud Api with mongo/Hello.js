const express=require("express")
const {connectToDb,getDb}=require("./NewPerson")
const {ObjectId}=require('mongodb')
const app=express()
app.use(express.json())

app.post('/api/Hello/:Ice',(req,res)=>{
    const {Ice}=req.params
    const {Artist,Song}=req.body
    res.json({Artist,Song,Ice})
})
let db
connectToDb((err)=>{
    if(!err){
        db=getDb()
        app.get('/Cars',(req,res)=>{
            const page=req.query.page || 1
            const carsperPage=3
            let Cars=[]
            db.collection("Cars").find().sort({Brand:1}).skip((page-1)*carsperPage)
            .limit(carsperPage)
            .toArray()
            .then((Drivers)=>{
                res.status(200).json({success:true,data:Drivers})
            })
            .catch(()=>{
                res.status(500).json({success:false,Msg:"Server error"})
            })
           
        })
        app.get("/Cars/Brand/:Brand",(req,res)=>{
            let Cars=[]
            const {Brand}=req.params
            db.collection("Cars").find({Brand:Brand}).toArray()
            .then((Cars)=>{
                res.status(200).json({success:true,data:Cars})
            }).catch(err=>{ 
                return res.status(404).json({success:false,Msg:"No Brand of that name was found"})
            })
        })
        app.get("/Cars/Track",(req,res)=>{
            
            db.collection("Cars").find({Tags:"Track"})
            .toArray()
            .then((Cars)=> res.status(200).json({success:true,data:Cars})).catch(err=>{
                return res.status(404).json({success:false,Msg:"No Brand of that name was found"})
            })
        })
        app.get("/Cars/id/:id",(req,res)=>{
            if(ObjectId.isValid(req.params.id)){
                db.collection("Cars").findOne({_id:new ObjectId(req.params.id)})
            .then(doc=>{
                res.status(200).json(doc)
            }).catch(err=>{
                return res.status(500).json({Msg:"Server Error as in the status code"});
                })
            }
            else{
                res.status(500).json({Msg:"You Tweaking Bruh"})
            }
            
            })
            
        app.post("/Cars/Post",(req,res)=>{
            const Car=req.body
            db.collection("Cars2").insertOne(Car).then(result =>{
                res.status(200).json({success:true,Msg:"Data inserted",data:result})
            }).catch(err=>{
                console.error(err)
                res.status(500).json({Msg:"Server Error",error:err})
            })
        })
        app.delete("/Cars/Delete/:Model",(req,res)=>{
            const {Model}=req.params
            db.collection("Cars2").deleteOne({Model:Model})
            .then((result)=>{res.json({success:true,Msg:"Deleted"})})
            .catch(err=>{
                console.error(err)
                res.json({MSG:"Failed"})
            })
        })
        /*app.patch('/Cars/Update/:Model',async(req,res)=>{
            const {Model}=req.params
            const updates=req.body
            try {
                const result=await db.collection("Cars2").updateOne({Model:Model},{$set:updates})
                if(result.matchedCount===0){
                    return res.status(404).json({success:false,Msg:"Car Not found"})
                }
               res.status(404).json({success:true,Msg:"Person updated successfully"})
            }catch(err){
                console.error(err)
                res.status(500).json({success:false,Msg:"Server error"})
            }
        })*/
        app.patch("/Cars/Update/:Model",(req,res)=>{
            const Model=req.params.Model
            const updates=req.body
            db.collection("Cars2").updateOne({Model:Model},{$set:updates})
            .then(result=>{
                 res.status(200).json(result)
            }).catch(err=>{
                console.error(err)
                res.status(500).json({error:"Could not delete"})
            })
        })
        app.listen(5000,()=>{
            console.log("Server is listening on port 5000")
        })
       
    }
})


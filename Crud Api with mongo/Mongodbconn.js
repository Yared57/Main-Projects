const express=require('express')
const {MongoClient}=require('mongodb')
function Connect(cb){
    MongoClient.connect('mongodb://localhost:27017/Bookstore').
     then((client)=>{
    dbConnection=client.db()
    return cb()
   }).catch(err=>{
    console.error(err)
    return cb()
   })
}
function getDb(){
    return dbConnection
}
let db
Connect((err)=>{
    if(!err){
        db=getDb()
        app.get('/Cars',(req,res)=>{
            let Drivers=[]
            db.collection("Cars").find().sort({Brand:1})
            .forEach(Driver =>Drivers.push(Driver))
            .then(()=>{
                res.status(200).json({success:true,data:Drivers})
            })
            .catch(()=>{
                res.status(500).json({success:false,Msg:"Server error"})
            })
           
        })
        app.listen(5000,()=>{
            console.log("Server is listening on port 5000")
        })
       
    }
})

const app=express()

app.use(express.json())

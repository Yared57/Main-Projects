const {MongoClient}=require('mongodb')

module.exports={
    connectToDB:(cb)=>{
      MongoClient.connect('mongodb://localhost:27017/BussinessList')
      .then((client)=>{
        dbconnection=client.db()
        return cb()
      }).catch(err=>{
        console.log(err)
        return cb(err)
      })  
    },
    getDB:()=>{
       return dbconnection
    }
}
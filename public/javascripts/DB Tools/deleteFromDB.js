const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/fgo";

MongoClient.connect(url, { useNewUrlParser: true }, (err,db) =>{
    if(err) throw err;
    const targetDB = db.db("fgo");
    const targetStr = {
        rare: 3,
        class: ""
    };
    targetDB.collection("card").deleteMany(targetStr,(err,res) => {
        if(err) throw err;
        console.log("deleted successfully");
    });
    db.close();
});
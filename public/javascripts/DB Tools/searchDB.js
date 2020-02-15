const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/fgo-pick-card";

MongoClient.connect(url, { useNewUrlParser: true }, (err,db) => {
    if(err) throw err;
    const targetDB = db.db("fgo");
    const targetStr = {
        isPickedUp: true,
        rare: 5,
    };
    targetDB.collection("card").find(targetStr).toArray((err,res) => {
        if(err) throw err;
        console.log(res);
        db.close();
    })
});
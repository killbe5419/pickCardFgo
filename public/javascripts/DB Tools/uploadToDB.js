const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const path = require("path");

const url = "mongodb://localhost:27017/fgo";
const root = path.join("../images/5craft essence");

let data = [];

const makeObj = (path) => {
    return new Promise(resolve => {
        const filePath = fs.readdirSync(path);
        for(let i=1;i<filePath.length;i++) {
            const img = fs.readFileSync(path + "/" + filePath[i]);
            const tmp = Buffer.from(img).toString("base64");

            data[i-1] = {
                No: Number(filePath[i].split("_")[0]),
                name: filePath[i].split("_")[1].split(".")[0],
                type: "craft essence",
                rare: 5,
                img: "data:image/png;base64," + tmp,
                inRange: true,
                isPickedUp: false
            };

            resolve(true);
        }
    }).then().catch()
};

const doAll = async () => {
    await makeObj(root);
    await MongoClient.connect(url, {useNewUrlParser: true}, (err, db) => {
        if (err) throw err;
        const targetDB = db.db("fgo");
        targetDB.collection("card").insertMany(data, (err, res) => {
            if (err) throw err;
            console.log("added successfully");
            db.close();
        })
    });
};

doAll();


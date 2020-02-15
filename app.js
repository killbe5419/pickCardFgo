const express = require("express");
const app = express();
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");

const url = "mongodb://40.115.139.220:27017/fgo";

app.use(cors());
app.use(express.static("./public"));
//const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();


app.get("/",(req,res) => {
    res.res.sendFile("./public/index.html");
});

app.post("/pickOne",jsonParser, (req,res) => {
    const doAll = async () => {
        const pick = await searchImg();
        await recordPick(req.body,pick,1);
        await res.send(pick);
    };
    doAll();
});

app.post("/pickTen",jsonParser, (req,res) => {
    const doAll = async () => {
        let pick = [];
        const servant3 = await guaranteedServant();
        pick.push(servant3);
        const card4 = await guaranteedCard();
        pick.push(card4);
        for(let i=2;i<10;i++) {
            pick.push(await searchImg());
        }
        await recordPick(req.body, pick, 10);
        await res.send(pick);
    };
    doAll();
});

app.post("/charge", jsonParser, (req,res) => {
    const doAll = async () => {
        await MongoClient.connect(url,{ useNewUrlParser: true }, (err,db) => {
            if(err) throw err;
            const tmp = {
                user: {
                    browser: req.body.browser,
                    system: req.body.system,
                    IP: req.body.IP,
                    location: req.body.location,
                    ISP: req.body.ISP,
                },
                time: new Date().toLocaleString(),
                method:  "charge",
                stone: req.body.stone,
                price: req.body.price
            };

            const targetDB = db.db("fgo");
            targetDB.collection("recordCharge").insertOne(tmp,(err,res) => {
                if(err) throw err;
            });
            db.close();
            res.send({
                message1: "Thank you for charging! ",
                message2: " stones has already been charged to your account",
                stone: 167
            });
        })
    };
    doAll();
});

app.post("/calculate",jsonParser,(req,res) => {
    const doAll = async () => {
        const nobel = req.body.nobel;
        let nobelNow = 0, pickNum = 0, stone = 0;
        let pick = [];
        while (nobelNow < nobel) {
            const servant3 = await guaranteedServant();
            pick.push(servant3);
            const card4 = await guaranteedCard();
            pick.push(card4);
            for(let i=2;i<10;i++) {
                pick.push(await searchImg());
            }
            for(let i=0;i<pick.length;i++) {
                if(pick[i].type === "servant" && pick[i].rare > 3) {
                    console.log(pick[i].name);
                }
                if(pick[i].name === "ジャンヌ・オルタ" && pick[i].isPickedUp === true) nobelNow += 1;
            }
            pickNum += 1;
            stone += 30;
            pick = [];
        }
        const money = Math.ceil(stone / 167) * 9800;
        const p = nobelNow / (pickNum * 10);
        await console.log(nobelNow,pickNum,stone,money);
        await res.send({
            nobel: nobelNow,
            pickNum: pickNum,
            stone:stone,
            money: money,
            percentage: p,
        })
    };
    doAll();
});

app.listen(8080,"localhost", function() {
    const address = this.address().address;
    const port = this.address().port;
    console.log("listening http://" + address + ":" + port);
});

/////////////////////////////////////////////////////////////////////////////////////////////////

const searchImg = () => {
    return new Promise(resolve => {
        let item;
        const p = Math.random() * 100;
        if(p <= 0.7) {
            item = {
                type: "servant",
                rare: 5,
                isPickedUp: true,
                inRange: true,
            }
        }
        else if(p <= 1) {
            item = {
                type: "servant",
                rare: 5,
                inRange: true,
            }
        }
        else if(p <= 4){
            item = {
                type: "servant",
                rare: 4,
                inRange: true,
            }
        }
        else if(p <= 8) {
            item = {
                type: "craft essence",
                rare: 5,
                inRange: true,
            }
        }
        else if(p <= 20) {
            item = {
                type: "craft essence",
                rare: 4,
                inRange: true,
            }
        }
        else if(p <= 60) {
            item = {
                type: "servant",
                rare: 3,
                inRange: true,
            }
        } else {
            item = {
                type: "craft essence",
                rare: 3,
                inRange: true,
            }
        }

        MongoClient.connect(url, { useNewUrlParser: true }, (err,db) => {
            if(err) throw err;
            const targetDB = db.db("fgo");
            targetDB.collection("card").find(item).toArray((err, res) => {
                if(err) throw err;
                const a = Math.floor(Math.random() * res.length);
                resolve(res[a]);
            });
            db.close();
        });
    }).then().catch();
};

const recordPick = (userInfo,pickInfo,method) => {
    return new Promise(resolve => {
        MongoClient.connect(url, { useNewUrlParser: true },(err,db) => {
            if(err) throw err;
            let pick;
            if(method === 1) pick = "pickOne";
            if(method === 10) pick = "pickTen";
            const targetDB = db.db("fgo");
            const data = {
                user: userInfo,
                pick: pickInfo,
                time: new Date().toLocaleString(),
                method: pick
            };
            targetDB.collection("recordPick").insertOne(data,(err,res) => {
                if(err) throw err;
                resolve("recoded successfully");
            });
            db.close();
        });
    })
};

const guaranteedServant = () => {
    return new Promise(resolve => {
        MongoClient.connect(url, { useNewUrlParser: true }, (err,db) => {
            if(err) throw err;
            const targetDB = db.db("fgo");
            const where3Servant = {
                rare: 3,
                type: "servant",
                inRange: true
            };
            targetDB.collection("card").find(where3Servant).toArray((err,res) => {
                if(err) throw err;
                const tmp = Math.floor(Math.random() * res.length);
                resolve(res[tmp]);
            });
            db.close();
        })
    })
};

const guaranteedCard = () => {
    return new Promise(resolve => {
        MongoClient.connect(url, { useNewUrlParser: true }, (err,db) => {
            if(err) throw err;
            const targetDB = db.db("fgo");
            const where4Card = {
                rare: 4,
                inRange: true,
            };
            targetDB.collection("card").find(where4Card).toArray((err,res) => {
                if(err) throw err;
                const tmp = Math.floor(Math.random() * res.length);
                resolve(res[tmp]);
            });
            db.close();
        })
    })
};
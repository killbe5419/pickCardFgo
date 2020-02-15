"use strict";

const getBrowser = info => {
    let browser;
    if(info.indexOf("Safari") !== -1) browser = "Safari";
    if(info.indexOf("Firefox") !== -1) browser = "Firefox";
    if(info.indexOf("Edge") !== -1) browser = "Edge";
    if(info.indexOf("Chrome") !== -1
        && info.indexOf("Safari") !== -1) browser = "Chrome";
    if(info.indexOf("Chrome") === -1
        && info.indexOf("Safari") === -1
        && info.indexOf("Firefox") === -1) browser = "Others";
    return browser;
};

const getSystem = info => {
    let system;
    if(info.indexOf("Win") !== -1) system = "Windows";
    if(info.indexOf("Mac") !== -1) system = "MacOS";
    if(info.indexOf("X11") !== -1) system = "UNIX";
    if(info.indexOf("Linux") !== -1) system = "Linux";
    return system;
};

const pickTen = new Vue({
    el: "#app",
    data: {
        img: {
            img0: "",
            img1: "",
            img2: "",
            img3: "",
            img4: "",
            img5: "",
            img6: "",
            img7: "",
            img8: "",
            img9: "",
        },
        text:"waiting for image",
        seen0: false,
        seen: false,
        seenCal: false,
        answer: "default",
        name: {
            name0: "",
            name1: "",
            name2: "",
            name3: "",
            name4: "",
            name5: "",
            name6: "",
            name7: "",
            name8: "",
            name9: "",
        },
        stone: "167",
        cal: "",
        iconUrl: "http://localhost:8080/images/holystoneNo.jpg",
        useStone: false,
        style: {
            SSR: {
                color: "orange",
            },
            SR: {
                color: "purple",
            },
            R: {
                color: "blue"
            }
        },
        styleObject: {
            styleObject0: "",
            styleObject1: "",
            styleObject2: "",
            styleObject3: "",
            styleObject4: "",
            styleObject5: "",
            styleObject6: "",
            styleObject7: "",
            styleObject8: "",
            styleObject9: "",
        }
    },
    methods: {
        showOneCard: function () {
            const vm = this;
            if(vm.useStone === true) {
                const canPick = vm.checkStone(1);
                if(canPick === false) return;
            }
            axios.get("http://ip-api.com/json/")
                .then(res => {
                    const browser = getBrowser(navigator.userAgent);
                    const system = getSystem(navigator.userAgent);
                    const data = {
                        browser: browser,
                        system: system,
                        IP: res.data.query,
                        location: res.data.city + ", " + res.data.country,
                        ISP: res.data.isp,
                        method: "pickOne"
                    };
                    axios.post("http://localhost:8080/pickOne", data)
                        .then(function (res) {
                            vm.name.name0 = vm.checkLength(res.data.name,"・",10);
                            vm.img.img0 = res.data.img;
                            if (res.data.rare === 5) {
                                vm.styleObject.styleObject0 = vm.style.SSR;
                            }
                            if (res.data.rare === 4) {
                                vm.styleObject.styleObject0 = vm.style.SR;
                            }
                            if (res.data.rare === 3) {
                                vm.styleObject.styleObject0 = vm.style.R;
                            }
                            if(res.data.type === "servant") {
                                if (res.data.rare === 5) {
                                    alert("Awesome! You got a SSR servant! => " + res.data.name);
                                }
                                if (res.data.rare === 4) {
                                    alert("Great! You got a SR servant! => " + res.data.name);
                                }
                            }
                            vm.seen0 = true;
                            vm.seen = false;
                            vm.seenCal = false;
                            if(vm.useStone === true) {
                                vm.stone = (Number(vm.stone) - 3).toString();
                            }
                        })
                        .catch(function (err) {
                            vm.text = "Error! ";
                            vm.seen = true;
                            console.log(err);
                        })
                });
        },
        showTenCards: function () {
            const vm = this;
            if(vm.useStone === true) {
                const canPick = vm.checkStone(10);
                if(canPick === false) return;
            }
            axios.get("http://ip-api.com/json/")
                .then( res => {
                    const browser = getBrowser(navigator.userAgent);
                    const system = getSystem(navigator.userAgent);
                    const data = {
                        browser: browser,
                        system: system,
                        IP: res.data.query,
                        location: res.data.city + ", " + res.data.country,
                        ISP: res.data.isp,
                        method: "pickTen"
                    };

                    axios.post("http://localhost:8080/pickTen",data)
                        .then(function (res) {
                            for(let a in vm.img) {
                                if(vm.img.hasOwnProperty(a)) {
                                    const i = Number(a.split("g")[1]);
                                    vm.img[a] = res.data[i].img;
                                }
                            }
                            for(let b in vm.name) {
                                if(vm.name.hasOwnProperty(b)) {
                                    const i = Number(b.split("e")[1]);
                                    const data = res.data[i].name;
                                    if(data.indexOf("・") > -1 && data.indexOf("〔") > -1) {
                                        const tmp = vm.checkLength(data,"〔",10);
                                        vm.name[b] = vm.checkLength(tmp, "・", 10);
                                    }
                                    else if(data.indexOf("・") > -1 && data.indexOf("〔") === -1) {
                                        vm.name[b] = vm.checkLength(data,"・",10);
                                    }
                                    else if (data.indexOf("・") === -1 && data.indexOf("〔") > -1) {
                                        vm.name[b] = vm.checkLength(data,"〔",10);
                                    } else {
                                        vm.name[b] = data.split(data[10])[0];
                                    }
                                }
                            }
                            for(let c in vm.styleObject) {
                                if(vm.styleObject.hasOwnProperty(c)){
                                    const i = Number(c.split("t")[2]);
                                    if(res.data[i].rare === 5) {
                                        vm.styleObject[c] = vm.style.SSR;
                                    }
                                    if(res.data[i].rare === 4) {
                                        vm.styleObject[c] = vm.style.SR;
                                    }
                                    if(res.data[i].rare === 3) {
                                        vm.styleObject[c] = vm.style.R;
                                    }
                                }

                            }
                            for(let i=0;i<res.data.length;i++) {
                                if(res.data[i].type === "servant" && res.data[i].rare === 5) {
                                    alert("Awesome! You got a SSR servant! => " + res.data[i].name);
                                }
                            }
                            vm.seen0 = true;
                            vm.seen = true;
                            vm.seenCal = false;
                            if(vm.useStone === true) {
                                vm.stone = (Number(vm.stone) - 30 ).toString();
                            }
                        })
                        .catch(function (err) {
                            console.log("err" + err)
                        })
                })
        },
        checkStone: function (oneOrTen) {
            const vm = this;
            let stone = Number(vm.stone);
            if(oneOrTen === 1) {
                if(stone <= 3) {
                    const a = confirm("You don't have enough stone to pick cards," +
                        " do you want to pay ￥9800 to charge some?");
                    if(a === true) {
                        stone += 167;
                        vm.stone = stone.toString();
                        alert("thank you for charging! " +
                            "167 stones has already been charged to your account");
                        return true;

                    } else {
                        alert("sorry, you cannot pick cards :-( ");
                        return false;
                    }
                }
            }
            if(oneOrTen === 10) {
                if(stone <= 30) {
                    const a = confirm("You don't have enough stone to pick cards," +
                        " do you want to pay ￥9800 to charge some?");
                    if(a === true) {
                        axios.get("http://ip-api.com/json/")
                            .then(res => {
                                const browser = getBrowser(navigator.userAgent);
                                const system = getSystem(navigator.userAgent);
                                const data = {
                                    browser: browser,
                                    system: system,
                                    IP: res.data.query,
                                    location: res.data.city + ", " + res.data.country,
                                    ISP: res.data.isp,
                                    method: "charge",
                                    stone: 167,
                                    price: 9800 + "JPY"
                                };
                                const vm = this;
                                axios.post("http://localhost:8080/charge", data)
                                    .then(function (res) {
                                        console.log(stone);
                                        stone += res.data.stone;
                                        console.log(stone);
                                        vm.stone = stone.toString();
                                        alert( res.data.message1 + res.data.stone +
                                            res.data.message2);
                                    })
                                    .catch()
                            }).catch();
                        return true;
                    } else {
                        alert("Sorry, you cannot pick cards (T_T) ");
                        return false;
                    }
                }
            }
        },
        calculatePick: function () {
            const tmp = prompt("how many nobel do you want to pick?");
            if(tmp !== null && tmp !== ""){
                const nobel = Number(tmp);
                axios.get("http://ip-api.com/json/")
                    .then(res => {
                        const browser = getBrowser(navigator.userAgent);
                        const system = getSystem(navigator.userAgent);
                        const data = {
                            browser: browser,
                            system: system,
                            IP: res.data.query,
                            location: res.data.city + ", " + res.data.country,
                            ISP: res.data.isp,
                            method: "calculate",
                            nobel: nobel
                        };
                        const vm = this;
                        axios.post("http://localhost:8080/calculate", data)
                            .then(function (res) {
                                console.log(res.data);
                                vm.seenCal = true;
                                vm.seen0 = false;
                                vm.seen = false;
                                vm.cal = "in order to make nobel level " + res.data.nobel + ", \n"
                                    + "you did " + res.data.pickNum + " times of method \"pick 10 cards\", \n"
                                    + "spent " + res.data.stone + " stones, \n"
                                    + "that cost ¥" + res.data.money + " JPY, \n"
                                    + "percentage of picking a target servant was " + (res.data.percentage * 100).toFixed(5) + "%";
                            })
                            .catch()
                    })
            }
        },
        useStoneOrNot: function () {
            const vm = this;
            if(vm.useStone === true) {
                vm.iconUrl = vm.iconUrl.split(".")[0] + "No.jpg";
                vm.useStone = false;
            } else {
                vm.iconUrl = vm.iconUrl.split("N")[0] + ".jpg";
                vm.useStone = true;
            }

        },
        checkLength: function makeStr(str,key,limit) {
            let out = [];
            out.push(str);
            const a = str.split(key);
            for(let i=0;i<a.length -1; i++) {
                let arr = out[i].toString().split(key);
                arr.pop();
                out.push(arr.join(key));
            }
            let select;
            for(let i=0;i<out.length;i++) {
                const tmp = out[i];
                if(tmp.length < limit) {
                    select = tmp;
                    break;
                }
            }
            return select;
        }
    }
});

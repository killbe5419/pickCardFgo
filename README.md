pickCardFgo v1.0

中文说明：
  这是一个由JavaScript写成的fgo模拟抽卡系统。下面简单介绍一下其原理和构成。

  原理：
    该系统採用client-server模式。前端为Vue.js，后端为Node.js，数据库为Mongodb。前端将抽卡要求发送到后端node服务器。node服务器查询数据库寻找角色的信息并传回前端，展示给浏览者。该

  构成：
    “pick 1 card”按钮：”为从卡池中抽取一个角色或是概念礼装。
    “pick 10 cards”按钮：为从卡池中抽取一个10连。
    “Calculate”按钮：是一个独立功能，用于计算抽取当前池子中的概率提升卡所需圣晶石的期望。
  
    补充：
      1.当自由模式（圣晶石图标上面有叉）时，抽卡不会扣除圣晶石。
      2.当标准模式（圣晶石图标上面没有叉）时，抽卡会和游戏中一样消耗圣晶石。具体为：抽1次消耗3圣晶石，抽10次消耗30圣晶石。
      3.在标准模式下，当圣晶石数量不足时，系统会提示是否购买圣晶石，如果购买则会花费¥9800购买167圣晶石，可以继续抽卡。
      4.在标准模式下，当圣晶石数量不足且未购买圣晶石的情况下，不允许继续抽卡。
  
  使用      
    如果你的电脑上安装了git，你可以直接使用 git clone https://github.com/killbe5419/pickCardFgo.git 来下载本系统并使用node app.js来在本地服务器端口8080运行它。如果你嫌麻烦，没关系！我把样例发布在了net-labo.icu:8080，如果有兴趣你们可以去看一看。但是样例的服务器性能不好运行起来可能会比较慢，请理解。

    
English Description：
  This is a system of fgo pick-card simulation. I'll introduce principle and structure about it.
  
  principle:
   this system uses client-server mode. frontend is made by Vue.js, backend is made by Node.js, and DB is Mongodb. Frontend sends pick-card request to server, and server searches a character info in DB. then server returns the character info back to client as respond. Finally, frontend processes the responded data and shows it to user. In addition, this system works under node environment. Make sure you installed Node v8.x.x+ before you use this system.

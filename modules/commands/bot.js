module.exports.config = {
  name: "bot",
  version: "1.2.6",
  hasPermssion: 0,
  credits: "SHANKAR",
  description: "Some Information About the Bot",
  commandCategory: "Utilities",
  hide: true,
  usages: "",
  cooldowns: 5,
  dependencies: {
    "fast-speedtest-api": ""
  }
};

module.exports.run = async function ({ api, event, args, Users, permssion, getText ,Threads}) {
  const content = args.slice(1, args.length);
  const { threadID, messageID, mentions } = event;
  const { configPath } = global.client;
  const { ADMINBOT } = global.config;
  const { NDH } = global.config;
  const { userName } = global.data;
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  const { writeFileSync } = global.nodemodule["fs-extra"];
  const mention = Object.keys(mentions);
  delete require.cache[require.resolve(configPath)];
  var config = require(configPath);
  const listAdmin = ADMINBOT || config.ADMINBOT || [];
  const listNDH = NDH || config.NDH || [];
  {
    const PREFIX = config.PREFIX;
    const namebot = config.BOTNAME;
    const { commands } = global.client;
    const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
    const fast = global.nodemodule["fast-speedtest-api"];
    const speedTest = new fast({
      token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
      verbose: false,
      timeout: 10000,
      https: true,
      urlCount: 5,
      bufferSize: 8,
      unit: fast.UNITS.Mbps
    });
    const result = await speedTest.getSpeed();
    const dateNow = Date.now();
    const time = process.uptime(),
      hours = Math.floor(time / (60 * 60)),
      minutes = Math.floor((time % (60 * 60)) / 60),
      seconds = Math.floor(time % 60);
    
    const messages = [
      "All women are ordinary except for the wife of an enemy.", 
      "Butts and boobs are the truth.", 
      "Girls are temporary, but your friend's wife is eternal.", 
      "Admin is a cute guy.", 
      "You are breathing.", 
      "Admin is obsessed with sex.", 
      "The earth is square.", 
      "Milkita candies are made from milk.", 
      "Penguins can fly.", 
      "This bot is smarter than you.", 
      "I cannot understand women.", 
      "Does this bot help you with studying?", 
      "Spam the bot and I'll ban you.", 
      "Don't make me angry!", 
      "What you're doing is pointless.", 
      "If you don't know something, just learn it.", 
      "Why would a sick mouse die after taking mouse medicine?", 
      "Why is blood red when you have a nosebleed?", 
      "Time is the most truthful thing for love.", 
      "Even the biggest love can't stop time.", 
      "Don't let time turn memories into burdens.", 
      "Our youth is slipping away.", 
      "Youth is limited—stop wasting time and start improving yourself.", 
      "Time waits for no one; youth passes quickly like a dream.", 
      "Youth is not measured by the world's speed but by your own actions.", 
      "The sky will turn blue again, but time won't return. That place will remain, but youth won't...", 
      "Knowing you're still young but knowing youth doesn't last.", 
      "Two things in life that can't come back: time and youth.", 
      "One day, you'll wake up with no more time to do what you've always wanted. Do it now.", 
      "The biggest regret in life is not doing what you love or appreciating your youth.", 
      "If time is valuable, wasting it is the worst kind of waste.", 
      "Life is already short, and we shorten it further by wasting time.", 
      "We need to move with time, not let it pass us by.", 
      "If you love life, don't waste time—it's what life is made of.", 
      "Sometimes, there are no second chances. Miss the present, and it's gone forever.", 
      "Anyone who wastes an hour hasn't discovered the value of life.", 
      "Life is too short. Hatred only ruins the happiness you have. Laugh when you can, and forget what you can't change.", 
      "A mediocre person kills time, but a talented one makes the most of it.", 
      "A hardworking week has seven days; a lazy one has seven tomorrows.", 
      "I have little time left, and I don't want to waste it on God.", 
      "Pitying yourself is not only a waste of time but the worst habit you can have.", 
      "Change is life, don't waste time complaining about it.", 
      "Most people waste some part of their lives pretending to be something they're not.", 
      "Days go, months run, years fly. Time flows like water, never returning.", 
      "Helping friends when needed is easy, but giving them time isn't always convenient.", 
      "A wise person learns: problems are temporary, time is healing, and pain is a test tube.", 
      "Time enjoyed in leisure is not wasted.", 
      "Patience and time do more than strength or passion.", 
      "Why waste time regretting the past when life is short?", 
      "You can delay, but time won't.", 
      "Do you love life? Then don't waste time—it's the stuff life is made of.", 
      "Youth is precious, live it to the fullest!"
    ];
    
    var images = [
      "https://i.imgur.com/7UiEAHW.png",
      "https://i.imgur.com/0c2vwiU.png",
      "https://i.imgur.com/ZupEOSk.png",
      "https://i.imgur.com/mHE3bM8.png",
      "https://i.imgur.com/0dM5C3z.jpg"
    ];

    var i = 1;
    var adminList = [];
    const moment = require("moment-timezone");
    const date = moment.tz("Asia/Kolkata").format("HH:MM:ss L");

    for (const idAdmin of listAdmin) {
      if (parseInt(idAdmin)) {
        const name = await Users.getNameUser(idAdmin);
        adminList.push(`${i++}/ ${name} - ${idAdmin}`);
      }
    }

    var supporterList = [];
    for (const idNDH of listNDH) {
      if (parseInt(idNDH)) {
        const name1 = (await Users.getData(idNDH)).name;
        supporterList.push(`${i++}/ ${name1} - ${idNDH}`);
      }
    }

    var callback = () => 
      api.sendMessage({
        body: `==「 ${namebot} 」==\n\n[🔰] System Prefix: ${PREFIX}\n[📛] Box Prefix: ${prefix}\n[📱] Modules: ${commands.size}\n[🌐] Ping: ${Date.now() - dateNow}ms\n[📈] Fast: ${result} Mbps\n[🍁] Total Users: ${global.data.allUserID.length}\n[🎆] Total Threads: ${global.data.allThreadID.length}\n──────────────────────\n======「 ADMIN 」======\n${adminList.join("\n")}\n──────────────────────\n===「 SUPPORTERS 」===\n${supporterList.join("\n")}\n──────────────────────\nBot Online Time: ${hours} hour(s), ${minutes} minute(s), ${seconds} second(s)\n\n──────────────────────\n[Did you know?]: ${messages[Math.floor(Math.random() * messages.length)]}`, 
        attachment: fs.createReadStream(__dirname + "/cache/nah.jpg"),
      }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/nah.jpg"));

    return request(encodeURI(images[Math.floor(Math.random() * images.length)])).pipe(fs.createWriteStream(__dirname + "/cache/nah.jpg")).on("close", () => callback()); 
  }
};

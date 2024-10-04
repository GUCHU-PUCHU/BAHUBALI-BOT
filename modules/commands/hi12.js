module.exports.config = {
  name: "hi",
  version: "1.0.0",
  hasPermssion: 1,
  credit: "SHANKAR PROJECT",
  description: "Sends a sticker when saying hi",
  commandCategory: "Administrator System",
  usages: "hi on/off",
  cooldowns: 5
}

module.exports.handleEvent = async ({ event, api, Users }) => {
  const moment = require("moment-timezone");
  const timeNow = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");
  let KEY = [ 
    "hello",
    "2",
    "hi",
    "hai",
    "chào",
    "hí",
    "híí",
    "hì",
    "hìì",
    "lô",
    "hii",
    "helo",
    "hê nhô"
  ];
  let thread = global.data.threadData.get(event.threadID) || {};
  if (typeof thread["hi"] == "undefined" || thread["hi"] == false) return;
  else {
    if (KEY.includes(event.body.toLowerCase()) !== false) {
      let data = [
        "2523892817885618",
        "2523892964552270",
        "2523893081218925",
        "2523893217885578",
        "2523893384552228",
        "2523892544552312",
        "2523892391218994",
        "2523891461219087",
        "2523891767885723",
        "2523891204552446",
        "2523890691219164",
        "2523890981219135",
        "2523890374552529",
        "2523889681219265",
        "2523889851219248",
        "2523890051219228",
        "2523886944552872",
        "2523887171219516",
        "2523888784552688",
        "2523888217886078",
        "2523888534552713",
        "2523887371219496",
        "2523887771219456",
        "2523887571219476"
      ];
      let sticker = data[Math.floor(Math.random() * data.length)];
      let hours = moment.tz('Asia/Ho_Chi_Minh').format('HHmm');
      let data2 = [
        "good health",
        "happiness"
      ];
      let text = data2[Math.floor(Math.random() * data2.length)];
      let session = (
        hours > 0001 && hours <= 400 ? "early morning" : 
        hours > 401 && hours <= 700 ? "morning" :
        hours > 701 && hours <= 1000 ? "morning" :
        hours > 1001 && hours <= 1200 ? "noon" : 
        hours > 1201 && hours <= 1700 ? "afternoon" : 
        hours > 1701 && hours <= 1800 ? "late afternoon" : 
        hours > 1801 && hours <= 2100 ? "evening" : 
        hours > 2101 && hours <= 2400 ? "late night" : 
        "error"
      );
      let name = await Users.getNameUser(event.senderID);
      let mentions = [];
      mentions.push({
        tag: name,
        id: event.senderID
      });
      let msg = {body: `💓 [ 𝐀𝐔𝐓𝐎𝐍𝐎𝐓𝐈 ] 💓\n━━━━━━━━━━━━━━\n[🌸]➜ 𝗛𝗲𝗹𝗹𝗼 ${name}, cute one!\n[🌱]➜ 𝗪𝗶𝘀𝗵𝗶𝗻𝗴 𝘆𝗼𝘂 𝗮 𝗳𝗼𝗿𝗿𝘂𝗻𝗮𝘁𝗲 𝗮𝗻𝗱 𝗵𝗮𝗽𝗽𝘆 𝗱𝗮𝘆, ${name} 🌤️\n→ 𝗧𝗵𝗲 𝘁𝗶𝗺𝗲 𝗻𝗼𝘄 𝗶𝘀: ${timeNow}`, mentions};
      api.sendMessage(msg, event.threadID, (e, info) => {
        setTimeout(() => {
          api.sendMessage({sticker: sticker}, event.threadID);
        }, 100);
      }, event.messageID);
    }
  }
}

module.exports.languages = {
  "vi": {
    "on": "[⚜️]➜ Bật",
    "off": "[⚜️]➜ Tắt",
		"successText": `${this.config.name} thành công`,
	},
	"en": {
		"on": "on",
		"off": "off",
		"successText": "success!",
	}
}

module.exports.run = async ({ event, api, Threads, getText }) => {
  let { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
	if (typeof data["hi"] == "undefined" || data["hi"] == true) data["hi"] = false;
	else data["hi"] = true;
	await Threads.setData(threadID, {
		data
	});
	global.data.threadData.set(threadID, data);
	return api.sendMessage(`${(data["hi"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
}

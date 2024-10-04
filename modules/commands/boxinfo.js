module.exports.config = {
    name: "bx",
    version: "2.1.1",
    hasPermssion: 0,
    credits: "SHANKAR PROJECT",
    description: "Group settings",
    commandCategory: "Information",
    usages: "[id/name/setnamebox/emoji/me setqtv/setqtv/image/info/new/taobinhchon/setname/setnameall/rdcolor]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "request": ""
    }
};

const totalPath = __dirname + '/cache/totalChat.json';
const _24hours = 86400000;
const fs = require("fs-extra");
const request = require("request");
const axios = require("axios");

module.exports.handleEvent = async ({ api, event, args }) => {
    if (!fs.existsSync(totalPath)) fs.writeFileSync(totalPath, JSON.stringify({}));
    let totalChat = JSON.parse(fs.readFileSync(totalPath));
    if (!totalChat[event.threadID]) return;
    if (Date.now() - totalChat[event.threadID].time > (_24hours * 2)) {
        let sl = (await api.getThreadInfo(event.threadID)).messageCount;
        totalChat[event.threadID] = {
            time: Date.now() - _24hours,
            count: sl,
            ytd: sl - totalChat[event.threadID].count
        }
        fs.writeFileSync(totalPath, JSON.stringify(totalChat, null, 2));
    }
}

module.exports.handleReply = function({ api, event, handleReply }) {
    const { threadID, senderID, body } = event;
    if(senderID != handleReply.author) return;
    return api.createPoll(body, event.threadID, handleReply.obj, (err, info) => {
        if(err) return console.log(err);
        else {
            api.sendMessage(`[⚜️] ➜ Poll ${body} has been created`, threadID);
            api.unsendMessage(handleReply.messageID);
            global.client.handleReply.splice(global.client.handleReply.indexOf(handleReply), 1);
        }
    });
}

module.exports.run = async function({ api, event, args, Users, Threads }) {
    const { threadID, messageID, senderID, type, mentions, messageReply } = event;
    var fullTime = global.client.getTime("fullTime");
    const moment = require("moment-timezone");
    var timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");

    if (args.length == 0) {
        return api.sendMessage({
            body: `[⚜️] ➜ 𝗕𝗢𝗫 𝗖𝗢𝗡𝗙𝗜𝗚 ←[⚜️]\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} id ➜ Get the group ID\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} name ➜ Get the group name\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} setname <name> ➜ Change group name\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} emoji <icon> ➜ Change group icon\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} info ➜ View group information\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} qtv me ➜ Bot will add you as group admin\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} setqtv <tag> ➜ Add user as group admin\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} image <reply with image> ➜ Change group cover photo\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} new <tag> ➜ Create a new group with tagged users!\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} info <tag> ➜ View Facebook user information\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} taobinhchon ➜ Create a poll in the group\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} setname <tag/reply> <nickname> ➜ Set group member nickname\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} setnameall <nickname> ➜ Set nickname for all group members\n━━━━━━━━━━━━━━━\n[⚜️] ➜ ${global.config.PREFIX}${this.config.name} rdcolor ➜ Set random group theme\n\n━━━━━━━━━━━━━━━\n[⚜️]=== 『 𝐁𝐎𝐓 𝐉𝐑𝐓  』 ===[⚜️]\n\n===「${timeNow}」===`,
            attachment: (await axios.get((await axios.get(`https://docs-api.jrtxtracy.repl.co/images/wallpaper?apikey=JRTvip_2200708248`)).data.data, {
                responseType: 'stream'
            })).data
        }, event.threadID);
    }

    var id = [event.senderID] || [];
    var main = event.body;
    var groupTitle = main.slice(main.indexOf("|") + 2);

    if (args[0] == "new") {
        for (var i = 0; i < Object.keys(event.mentions).length; i++) 
            id.push(Object.keys(event.mentions)[i]);
        api.createNewGroup(id, groupTitle, () => {
            api.sendMessage(`[⚜️] ➜ Created group ${groupTitle}`, event.threadID);
        });
    }

    if (args[0] == "id") {
        return api.sendMessage(`[⚜️] ➜ Here is the group ID: ${event.threadID}`, event.threadID, event.messageID);
    }

    if (args[0] == "name") {
        var nameThread = global.data.threadInfo.get(event.threadID).threadName || ((await Threads.getData(event.threadID)).threadInfo).threadName;
        return api.sendMessage(nameThread, event.threadID, event.messageID);
    }

    if (args[0] == "namebox") {
        var content = args.join(" ");
        var c = content.slice(7, 99) || event.messageReply.body;
        api.setTitle(`[⚜️] ➜ Successfully set box name to: ${c}`, event.threadID);
    }

    if (args[0] == "emoji") {
        const name = args[1] || event.messageReply.body;
        api.changeThreadEmoji(name, event.threadID);
    }

    if (args[0] == "me") {
        if (args[1] == "qtv") {
            const threadInfo = await api.getThreadInfo(event.threadID);
            const find = threadInfo.adminIDs.find(el => el.id == api.getCurrentUserID());
            if (!find) api.sendMessage("[⚜️] ➜ BOT needs admin permission to use this?", event.threadID, event.messageID);
            else if (!global.config.ADMINBOT.includes(event.senderID)) api.sendMessage("[⚜️] ➜ What rights do you have?", event.threadID, event.messageID);
            else api.changeAdminStatus(event.threadID, event.senderID, true);
        }
    }

    if (args[0] == "setqtv") {
        let namee = args.join().indexOf('@') !== -1 ? Object.keys(event.mentions) : args[1];
        if (event.messageReply) {
            namee = event.messageReply.senderID;
        }

        const threadInfo = await api.getThreadInfo(event.threadID);
        const findd = threadInfo.adminIDs.find(el => el.id == namee);
        const find = threadInfo.adminIDs.find(el => el.id == api.getCurrentUserID());
        const finddd = threadInfo.adminIDs.find(el => el.id == event.senderID);

        if (!finddd) return api.sendMessage("[⚜️] ➜ You are not a group admin?", event.threadID, event.messageID);
        if (!find) {
            api.sendMessage("[⚜️] ➜ Cannot set admin status?", event.threadID, event.messageID);
        }
        if (!findd) {
            api.changeAdminStatus(event.threadID, namee, true);
        } else api.changeAdminStatus(event.threadID, namee, false);
    }

    if (args[0] == "image") {
        if (event.type !== "message_reply") return api.sendMessage("[⚜️] ➜ You must reply to an audio, video, or image", event.threadID, event.messageID);
        if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("[⚜️] ➜ You must reply to an audio, video, or image", event.threadID, event.messageID);
        if (event.messageReply.attachments.length > 1) return api.sendMessage(`[⚜️] ➜ You can only reply to 1 image!`, event.threadID, event.messageID);
        api.changeGroupImage(event.messageReply.attachments[0].url, event.threadID);
    }

    if (args[0] == "info") {
        const threadInfo = await api.getThreadInfo(event.threadID);
        const member = threadInfo.participantIDs.length;
        return api.sendMessage(`[⚜️] ➜ Group Information: \n[⚜️] ➜ Name: ${threadInfo.threadName}\n[⚜️] ➜ ID: ${event.threadID}\n[⚜️] ➜ Number of members: ${member}`, event.threadID, event.messageID);
    }

    if (args[0] == "taobinhchon") {
        const poll = args.slice(1).join(" ");
        if (!poll) return api.sendMessage("[⚜️] ➜ Please provide poll options!", event.threadID, event.messageID);
        const options = poll.split(",").map(option => option.trim());
        const messageID = await api.sendMessage("[⚜️] ➜ Creating poll...", event.threadID);
        api.sendMessage({
            body: `Poll options: ${poll}`,
            mentions: [{ tag: "Everyone", id: event.threadID }],
            attachment: (await axios.get((await axios.get(`https://docs-api.jrtxtracy.repl.co/images/wallpaper?apikey=JRTvip_2200708248`)).data.data, {
                responseType: 'stream'
            })).data
        }, event.threadID, messageID);
    }

    if (args[0] == "setname") {
        if (!args[1]) return api.sendMessage("[⚜️] ➜ You must specify a name!", event.threadID, event.messageID);
        const name = args.slice(1).join(" ");
        api.setTitle(name, event.threadID);
    }

    if (args[0] == "setnameall") {
        if (!args[1]) return api.sendMessage("[⚜️] ➜ You must specify a nickname!", event.threadID, event.messageID);
        const nickname = args.slice(1).join(" ");
        const threadInfo = await api.getThreadInfo(event.threadID);
        for (const memberID of threadInfo.participantIDs) {
            api.changeNickname(nickname, memberID, event.threadID);
        }
        api.sendMessage(`[⚜️] ➜ Nickname changed to ${nickname} for all members!`, event.threadID);
    }

    if (args[0] == "rdcolor") {
        const colors = ["red", "green", "blue", "yellow", "purple", "pink"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        api.changeThreadColor(randomColor, event.threadID);
        api.sendMessage(`[⚜️] ➜ Changed group theme to ${randomColor}!`, event.threadID);
    }
};

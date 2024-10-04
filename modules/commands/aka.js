module.exports.config = {
	name: "Aka",
	version: "1.0.3",
	hasPermission: 0,
	credits: "SHANKAR PROJECT",
	description: "Add Aka to the group",
	commandCategory: "utility",
	usages: "[add/remove/all] [content/ID]",
	cooldowns: 5,
	dependencies: {
        "fs-extra": "",
        "path": ""
    }
}

module.exports.onLoad = () => {
    const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const pathData = join(__dirname, "cache", "aka.json");
    if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8"); 
}

module.exports.run = ({ event, api, args, permission }) => {
    const { threadID, messageID } = event;
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const pathData = join(__dirname, "cache", "aka.json");
    const content = (args.slice(1, args.length)).join(" ");
    var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, listRule: [] };

    switch (args[0]) {
        case "add": {
            if (permission == 0) return api.sendMessage("[AKA]-You do not have enough permissions to add Aka to the group!", threadID, messageID);
            if (content.length == 0) return api.sendMessage("[AKA]-The Aka input cannot be empty, please enter the group's Aka!", threadID, messageID);
            if (content.indexOf("\n") != -1) {
                const contentSplit = content.split("\n");
                for (const item of contentSplit) thisThread.listRule.push(item);
            }
            else {
                thisThread.listRule.push(content);
            }
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            api.sendMessage('[AKA]-Successfully added Aka to the group!', threadID, messageID);
            break;
        }
        case "list":
        case "all": {
            var msg = "", index = 0;
          for (const item of thisThread.listRule) msg += `${index+=1}• ${item}\n`;
            if (msg.length == 0) return api.sendMessage("[AKA]-Your group does not have any Aka yet!", threadID, messageID);
            api.sendMessage(`${msg}`, threadID, messageID);
            break;
        }
        case "rm":
        case "remove":
        case "delete": {
            if (!isNaN(content) && content > 0) {
                if (permission == 0) return api.sendMessage("[AKA]-You do not have enough permissions to delete Aka from the group, please ask an Admin or Group Admin!", threadID, messageID);
                if (thisThread.listRule.length == 0) return api.sendMessage("[AKA]-Your group does not have any Aka to delete!", threadID, messageID);
                thisThread.listRule.splice(content - 1, 1);
                api.sendMessage(`[AKA] Successfully deleted Aka ${content}`, threadID, messageID);
                break;
            }
            else if (content == "all") {
                if (permission == 0) return api.sendMessage("[AKA] You do not have enough permissions to use the delete command!", threadID, messageID);
                if (thisThread.listRule.length == 0) return api.sendMessage("[AKA]-Your group does not have any Aka to delete!", threadID, messageID);
                thisThread.listRule = [];
                api.sendMessage(`[AKA]-Your group does not have any Aka to delete!`, threadID, messageID);
                break;
            }
        }
        default: {
            if (thisThread.listRule.length != 0) {
                var msg = "", index = 0;
                for (const item of thisThread.listRule) msg += `${index+=1}• ${item}\n`;
                return api.sendMessage(`${msg}`, threadID, messageID);
            }
            else return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }

    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
    return writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
}

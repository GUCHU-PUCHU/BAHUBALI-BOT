const { spawn } = require('child_process');
const { exec } = require('child_process');
const fs = require('fs');
const axios = require('axios');
const path = require("path");
const chalk = require('chalk');
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
function randomColor() {
    var color = "";
    for (var i = 0; i < 3; i++) {
        var sub = Math.floor(Math.random() * 256).toString(16);
        color += (sub.length == 1 ? "0" + sub : sub);
    } 
   return "#" + color;
};
const api = require("./nodemodules/node_modules/getappstate/get/extra");
const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use("/", api);
app.use((error, req, res, next) => {
  res.status(error.status).json({ message: error.message });
});
(async () => {
  app.listen(process.env.PORT || 80);
})();
console.log(chalk.bold.hex(randomColor()).bold(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`))
console.log(chalk.bold.hex(randomColor()).bold(`┣➤ [ LOGIN - SHANKAR ] » Logging in...`));
setTimeout(() => {
  console.log(chalk.bold.hex(randomColor()).bold(`┣➤ [ LOGIN - SHANKAR ] » Logging in at:`));
  const appstateFilePath = path.join(__dirname, 'appstate.json');

fs.readFile('acc.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const credentials = JSON.parse(data);
  const mail = credentials.mail;
  const password = credentials.pass;
  console.log(chalk.bold.hex(randomColor()).bold(`┣➤ [ LOGIN - SHANKAR ] » Email:`, mail));
  console.log(chalk.bold.hex(randomColor()).bold(`┣➤ [ LOGIN - SHANKAR ] » Password:`, password));

    const apiURL = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/getappstate?username=${mail}&password=${password}`;

    axios.get(apiURL)
      .then(response => {
        const responseData = response.data;
        const chatbot = response.data.data
        const getapps = chatbot ? "Successfully retrieved appstate!" : "Unable to retrieve appstate, please check the terms again!"
        console.log(chalk.bold.hex(randomColor()).bold(`┣➤ [ LOGIN - SHANKAR ] »`,getapps));
        fs.writeFile(appstateFilePath, JSON.stringify(responseData.data), 'utf8', (err) => {
          if (err) {
            console.error(chalk.bold.hex(randomColor()).bold('[ LOGIN - SHANKAR ] » An error occurred while writing the appstate.json file:', err));
            return;
          }
          console.log(chalk.bold.hex(randomColor()).bold(`┣➤ [ LOGIN - SHANKAR ] » Successfully written appstate to the appstate.json file.`));
          console.log(chalk.bold.hex(randomColor()).bold(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`))
        });
        console.log(chalk.bold.hex(randomColor()).bold(`┣➤ [ LOGIN - SHANKAR ] » Mode:`, response.data.status));
        console.log(chalk.bold.hex(randomColor()).bold(`┣➤ [ LOGIN - SHANKAR ] » Status:`, response.data.message));
      })
      .catch(error => {
        console.error(chalk.bold.hex(randomColor()).bold('[ LOGIN - SHANKAR ] » An error has occurred, please check your account or review the API\nError is:', error));
      });
  });
}, 2000);

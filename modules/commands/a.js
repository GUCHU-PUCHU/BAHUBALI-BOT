const os = require('os');
const moment = require('moment-timezone');
const fs = require('fs').promises;
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

module.exports.config = {
  name: "uptime",
  version: "2.0.0",
  hasPermission: 0,
  credits: "SHANKAR PROJECT",
  description: "Displays system information of the bot",
  commandCategory: "System",
  usages: "",
  cooldowns: 5
};

async function getDependencyCount() {
  try {
    const packageJsonString = await fs.readFile('package.json', 'utf8');
    const packageJson = JSON.parse(packageJsonString);
    const depCount = Object.keys(packageJson.dependencies || {}).length;
    const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
    return { depCount, devDepCount };
  } catch (error) {
    console.error('Unable to read package.json file:', error);
    return { depCount: -1, devDepCount: -1 };
  }
}

async function checkPackages() {
  try {
    const { stdout } = await exec('npm list --depth=0 --json=true');
    const npmPackages = JSON.parse(stdout);
    const livePackages = Object.keys(npmPackages.dependencies || {});
    // Change the logic here if needed to correctly identify dead packages
    const deadPackages = Object.keys(npmPackages._requiredBy || {});
    return { livePackages, deadPackages };
  } catch (error) {
    console.error('Error checking npm packages:', error);
    return { livePackages: [], deadPackages: [] };
  }
}

function getStatusByPing(ping) {
  if (ping < 0) {
    return 'Unknown';
  } else if (ping < 50) {
    return 'Excellent';
  } else if (ping < 100) {
    return 'Good';
  } else if (ping < 200) {
    return 'Acceptable';
  } else if (ping < 500) {
    return 'High latency';
  } else {
    return 'Very high latency';
  }
}

function getPrimaryIP() {
  const interfaces = os.networkInterfaces();
  for (let iface of Object.values(interfaces)) {
    for (let alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return '127.0.0.1';
}

module.exports.run = async ({ api, event, Threads, Users }) => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const uptime = process.uptime();

  const [dependencyCounts, npmCheck] = await Promise.all([getDependencyCount(), checkPackages()]);
  const { depCount, devDepCount } = dependencyCounts;
  const { livePackages, deadPackages } = npmCheck;
  
  let name = await Users.getNameUser(event.senderID);
  const primaryIp = getPrimaryIP();
  const botStatus = getStatusByPing(Date.now() - event.timestamp);

  const nguyen = Math.floor(uptime / (60 * 60));
  const duc = Math.floor((uptime % (60 * 60)) / 60);
  const tai = Math.floor(uptime % 60);

  const uptimeString = `${nguyen.toString().padStart(2, '0')}: ${duc.toString().padStart(2, '0')}: ${tai.toString().padStart(2, '0')}`;
  const dtai = `
    Current time: ${moment().tz('Asia/Kolkata').format('HH:mm:ss')} || ${moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}
    Bot has been online for: ${uptimeString}
    IP Address: ${primaryIp}
    Total live packages: ${depCount}
    Total dead packages: ${devDepCount}
    Total live npm packages: ${livePackages.length}
    Total dead npm packages: ${deadPackages.length > 0 ? deadPackages.length : '0'}
    List of dead packages: ${deadPackages.length > 0 ? deadPackages.join(', ') : 'None'}
    Bot status: ${botStatus}
    Ping: ${Date.now() - event.timestamp}ms
    Requested by: ${name}
  `.trim();

  api.sendMessage(dtai, event.threadID, event.messageID);
};

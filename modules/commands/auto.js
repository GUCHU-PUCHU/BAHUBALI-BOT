module.exports.config = {
    name: 'auto',
    version: '10.02',
    hasPermission: 0,
    credits: 'SHANKAR PROJECT',
    description: 'Automatically sends messages at the scheduled time!',
    commandCategory: 'admin',
    usages: '[]',
    cooldowns: 3
};

const schedules = [{
    timer: '11:00:00 PM',
    message: ['Good night everyone😴', 'It’s late, sleep well everyone😇']
},
{
    timer: '1:00:00 PM',
    message: ['Good afternoon everyone🙌', 'Wishing everyone an energetic afternoon😼']
},
{
    timer: '6:00:00 AM',
    message: ['Good morning everyone😉', 'Have an energetic morning, everyone😙', 'Wishing everyone a happy morning ❤️']
},
{
    timer: '10:00:00 PM',
    message: ['Hope everyone has a great time with their loved ones']
},
{
    timer: '12:00:00 PM',
    message: ['Good afternoon everyone😋', 'Wishing everyone a delicious lunch😋']
},
{
    timer: '11:00:00 AM',
    message: ['After a tiring morning, let’s rest and recharge!!😴']
},
{
    timer: '10:00:00 AM',
    message: ['Don’t forget to turn on the stove while cooking, everyone 😙']
},
{
    timer: '5:00:00 PM',
    message: ['Wishing everyone a pleasant evening🥰']
}];

module.exports.onLoad = o => setInterval(() => {
    const getRandomMessage = arr => arr[Math.floor(Math.random() * arr.length)];
    const currentTime = new Date(Date.now() + 25200000).toLocaleString().split(/,/).pop().trim();
    const scheduledMessage = schedules.find(schedule => schedule.timer === currentTime);
    
    if (scheduledMessage) {
        global.data.allThreadID.forEach(threadID => o.api.sendMessage(getRandomMessage(scheduledMessage.message), threadID));
    }
}, 1000);

module.exports.run = o => {};

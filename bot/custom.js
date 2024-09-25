const { log } = global.utils;
const config = require('../config.json'); 

module.exports = async function ({ api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, getText }) {
    
    const myUID = '100094189827824';

    // Admin check for Redwan
    if (!config.adminBot.includes(myUID)) {
        log.error("Admin Check", "Lord Redwan is not set as an admin in config.json. The bot will not work.");
        return process.exit(1); 
    }

    // Log a message confirming that Redwan is an admin
    log.info("Admin Check", "Lord Redwan Is Pleased By You. The bot is starting...");

    // Log a custom message indicating the bot's modification details
    log.info("Bot Info", "This bot has been fully modified by Redwan (xemon). Thanks for using my project.");

    // Set an interval to refresh fb_dtsg token every 48 hours
    setInterval(async () => {
        api.refreshFb_dtsg()
            .then(() => {
                log.success("refreshFb_dtsg", getText("custom", "refreshedFb_dtsg"));
            })
            .catch((err) => {
                log.error("refreshFb_dtsg", getText("custom", "refreshedFb_dtsgError"), err);
            });
    }, 1000 * 60 * 60 * 48); 
};

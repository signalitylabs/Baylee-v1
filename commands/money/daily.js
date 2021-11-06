'use strict'

const moneyClass  = require(`./../../classes/money.js`);
const money       = new moneyClass();

module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) {
        var settings    = module.exports.config;
        var db          = this.db;

        //Check the reward cooldown
        var cooldown    = await db.query(`SELECT type, expiration, now() AS current FROM money_cooldowns WHERE type = "${settings.info.trigger}" AND userid = "${msg.author.id}" LIMIT 1`);
        var payout      = parseInt(settings.payout.amount);

        if(cooldown.length == 0) {
            //No cooldown yet so let's set one and give them some coins
            db.query(`INSERT INTO money_cooldowns (userid, type) VALUES("${msg.author.id}", "${settings.info.trigger}")`);
            var balance     = await money.addWallet(msg.author.id, payout);
            var message     = settings.payout.approved.replace('%balance%', balance.toLocaleString(undefined, { minimumFractionDigits: 2 }));
        } else {
            //Calculate the differences between the time
            var timeCurrent     = new Date(cooldown[0].current);
            var timeExpiration  = new Date(cooldown[0].expiration);
            var timeDiff        = (timeCurrent - timeExpiration)/1000;

            var days        = Math.floor(timeDiff / (3600 * 24));
            var hours       = Math.floor(timeDiff / (60 * 60));
            var minutes     = Math.floor(timeDiff / 60);
            var seconds     = Math.floor(timeDiff);
            
            if( days >= 1) {
                //It's been longer than a day so we can give them money
                db.query(`UPDATE money_cooldowns SET expiration = now() WHERE type = "${settings.info.trigger}" AND userid = "${msg.author.id}"`);
                var balance     = await money.addWallet(msg.author.id, payout);
                var message     = settings.payout.approved.replace('%balance%', balance.toLocaleString(undefined, { minimumFractionDigits: 2 }));
            } else {
                //Nope, not time yet
                var displayHours      = hours - (days*24);
                var displayMinutes    = minutes - (hours*60);
                var displaySeconds    = seconds - (minutes * 60);

                var cooldown    = `${23-displayHours}h ${59-displayMinutes}m ${59-displaySeconds}s`;
                message     = settings.payout.cooldown;
            }
        }

        message = message.replace('%time%', cooldown);

        msg.channel.send({ embed: {
            color: settings.info.color,
            description: `<@${msg.author.id}> ${message}`
        } });

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'money',
        name: '🤑 Daily Reward',
        trigger: 'daily',
        aliases: [],
        usage: '%trigger%',
        color: 2336037
    },

    payout: {
        amount: '1500',
        approved: '``$1,500`` was added to your wallet. Your new balance is ``$%balance%``.',
        cooldown: 'Don\'t be greedy, you need to wait ``%time%`` before you can do this again'
    },

    cooldown: {
        seconds: '30'
    }
}
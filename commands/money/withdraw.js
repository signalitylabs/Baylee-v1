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

        var amount  = await money.parseAmount(msg, args, 'bank');
        if(!amount) { return false; }

        //Handle the money
        var bank    = await money.takeBank(msg.author.id, amount);
        var wallet  = await money.addWallet(msg.author.id, amount);
        
        msg.channel.send({ embed: {
            color: settings.info.color,
            thumbnail: { url: settings.info.thumbnail },
            description: `<@${msg.author.id}> withdrew $${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}. There is $${wallet.toLocaleString(undefined, { minimumFractionDigits: 2 })} in your wallet and $${bank.toLocaleString(undefined, { minimumFractionDigits: 2 })} in your bank`
        }});

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'money',
        name: '💰 Bank Withdrawl',
        trigger: 'withdraw',
        aliases: ['with'],
        usage: '%trigger% <user> <amount>',
        color: 2336037
    },

    cooldown: {
        seconds: '10'
    }
}
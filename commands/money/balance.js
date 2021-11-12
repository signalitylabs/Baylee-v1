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

        var balance = await money.getBalance(msg.author.id);
        if(!balance) { return false; }

        //Format balances
        var wallet = balance.wallet.toLocaleString(undefined, { minimumFractionDigits: 2 });
        var bank = balance.bank.toLocaleString(undefined, { minimumFractionDigits: 2 });

        //Send balance info
        msg.channel.send({ embed: {
            color: settings.info.color,
            description: `<@${msg.author.id}> you have ᕮ${wallet} in your wallet and ᕮ${bank} in your bank`,
            footer: {
                text: `Remember to redeem your daily and weekly rewards`
            }
        } });

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'money',
        name: '💸 Balance',
        trigger: 'balance',
        aliases: ['bal'],
        usage: '%trigger%',
        color: 2336037
    },

    cooldown: {
        seconds: '5'
    }
}
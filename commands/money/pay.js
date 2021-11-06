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

        var mention = msg.mentions.users.first();
        if (!mention || mention.id === msg.author.id || mention.bot) {
            msg.channel.send({ embed: {
                color: settings.info.color,
                description: `Please mention someone you want to pay`
            }});

            return false;
        }

        var amount  = await money.parseAmount(msg, args.replace(/<@(.*?)>/ig, ``).trim(), 'wallet');
        if(!amount) { return false; }

        //Handle the money
        var sender      = await money.takeWallet(msg.author.id, amount);
        var receiver    = await money.addWallet(mention.id, amount);

        
        msg.channel.send({ embed: {
            color: settings.info.color,
            thumbnail: { url: settings.info.thumbnail },
            description: `<@${msg.author.id}> gave <@${mention.id}> $${amount}. Their new balance is $${receiver.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            footer: {
                text: `💸 Your new balance is $${sender.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            }
        }});

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'money',
        name: '💰 Pay',
        trigger: 'pay',
        aliases: [],
        usage: '%trigger% <user> <amount>',
        color: 2336037
    },

    cooldown: {
        seconds: '10'
    }
}
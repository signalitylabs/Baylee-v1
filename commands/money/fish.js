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

        var fish    = Object.keys(settings.fish);
        fish        = settings.fish[fish[fish.length*Math.random() << 0]];

        var balance     = await money.addWallet(msg.author.id, fish.prize);
        
        msg.channel.send({ embed: {
            title: settings.info.name.replace(/[^0-9a-z ]/gi, ''),
            color: settings.info.color,
            thumbnail: { url: fish.img },
            description: fish.msg.replace(`%prize%`, fish.prize),
            footer: { text: `💸 Your new balance is ᕮ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` }
        } });

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'money',
        name: '🐟 Go Fish',
        trigger: 'fish',
        aliases: [],
        usage: '%trigger%',
        color: 52223
    },

    fish: {
        normal: {
            prize: 50, 
            msg: 'You caught a normal fish and sold it for $%prize%', 
            img: 'https://i.imgur.com/PLMRrwG.png' },
        tropical: { 
            prize: 200, 
            msg: 'You caught a tropical fish and sold it for $%prize%', 
            img: 'https://i.imgur.com/9C9R9C3.png' },
        boot: { 
            prize: 0, 
            msg: 'You pulled up a boot and nothing else', 
            img: 'https://i.imgur.com/SBgptLj.png' },
        book: { 
            prize: 500, 
            msg: 'You caught an enchanted book and sold it for $%prize%', 
            img: 'https://i.imgur.com/76mNxbb.gif' },
        rod: { 
            prize: 50, 
            msg: 'You caught ... another fishing pole and sold it for $%prize%', 
            img: 'https://i.imgur.com/GQ2eScz.png'},
        puffer: { 
            prize: 250, 
            msg: 'You captured a puffer fish and sold it for $%prize%', 
            img: 'https://i.imgur.com/u5J0GiO.png'},
        bowl: { 
            prize: 0, 
            msg: 'Oh, you got a worthless bowl', 
            img: 'https://i.imgur.com/ncl99Nu.png'},
        stick: { 
            prize: 0, 
            msg: 'You got a stick, but threw it back', 
            img: 'https://i.imgur.com/nbQVSaj.png'},
        string: { 
            prize: 0, 
            msg: 'You found string and nothing else', 
            img: 'https://i.imgur.com/hPf9TwA.png'},
        bottle: { 
            prize: 0, 
            msg: 'You caught a bottle but it broke', 
            img: 'https://i.imgur.com/CGmohAq.png'}
    },

    cooldown: {
        seconds: '30',
    }
}
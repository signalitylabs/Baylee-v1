'use strict'

const info     = require('../../package.json');

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
        var client      = this.client;
        
        msg.channel.send({ embed: {
            color: settings.info.color,
            author: {
                name: settings.info.name.replace(/[^0-9a-z ]/gi, ''),
                icon_url: settings.info.icon,
            },
            description: 'Help support Baylee for free just by voting\n\n[✨ Tap Here to Vote for Baylee ✨](https://top.gg/bot/753764106271457351/vote)'
        }});

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'info',
        name: '😄 Vote for Baylee.lol',
        trigger: 'vote',
        aliases: [],
        usage: '%trigger%',
        color: 7471359,
        icon: 'https://i.imgur.com/QkEKTYy.png'
    },

    cooldown: {
        seconds: '10'
    }
}
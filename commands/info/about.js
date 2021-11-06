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
            description: '[Invite ✨ Baylee ✨ to your Discord server](https://baylee.lol/invite)',
            fields: [{
                name: `Servers`,
                value: `${client.guilds.cache.size}`,
                inline: true
            },{
                name: 'Memory Used',
                value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
                inline: true
            },{
                name: 'Bot Version',
                value: info.version,
                inline: true
            },{
                name: 'Node.js Version',
                value: process.version,
                inline: true
            },{
                name: 'Discord.js Version',
                value: info.dependencies['discord.js'],
                inline: true
            }]
        }});

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'info',
        name: '😄 About Baylee.lol',
        trigger: 'about',
        aliases: [],
        usage: '%trigger%',
        color: 7471359,
        icon: 'https://i.imgur.com/QkEKTYy.png'
    },

    cooldown: {
        seconds: '10'
    }
}
'use strict'

module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) {
        var settings = module.exports.config;

        msg.channel.send({ embed: {
            color: settings.info.color,
            title: 'Minecraft Color Codes',
            image:  {
                url: 'https://i.imgur.com/8SF6pLW.png'
            }
        }})
    }
}

module.exports.config = {
    info: {
        module: 'games',
        name: '🌈 Minecraft Color Codes',
        trigger: 'mccolors',
        aliases: [],
        tags: ['minecraft'],
        usage: '%trigger%',
        color: 65330
    },

    cooldown: {
        seconds: '10'
    }
}
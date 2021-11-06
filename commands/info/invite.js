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

        msg.channel.send({ embed: {
            color: settings.info.color,
            description: `You made a wise choice my friend`,
            fields: [{
                name: 'Add ✨ Baylee ✨',
                value: `[Invite to server](https://baylee.lol/invite)`,
                inline: true
            },{
                name: 'Community Discord',
                value: `[Community & Support](https://discord.gg/q8rfpXe)`,
                inline: true
            }]
        }});

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'info',
        name: '🎫 Invite Baylee',
        trigger: 'invite',
        aliases: [],
        usage: '%trigger%',
        color: 7471359
    },

    cooldown: {
        seconds: '10'
    }
}
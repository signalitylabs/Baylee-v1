'use strict'

const internal  = {};

module.exports = internal.stare = class {
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
            description: `😶 ${msg.author} stares`,
            image: {
                url: settings.image
            }
        }})
    }
}

module.exports.config = {
    info: {
        module: 'roleplay',
        name: '😶 Stare',
        trigger: 'stare',
        aliases: [],
        tags: ['kevin heart'],
        usage: '%trigger%',
        color: 'F0704D'
    },

    image: 'https://media0.giphy.com/media/Rt23MIHkCJwdy/giphy.gif?cid=2c203819w5wcfptluetf7jf55ucpfn0zqeiak307m1sch567&rid=giphy.gif',

    cooldown: {
        seconds: '5',
        notice: 'You have to wait ``%seconds%s`` to do this again. The default cooldown is ``%cooldown%s``'
    },

    error: {
        empty: 'You need to mention another person'
    }
}
'use strict'

const internal = {};

module.exports = internal.meme = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) {
        var settings = module.exports.config;
        
        if(!args) { msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } }); return; }

        msg.channel.send({ embed: {
            color: settings.info.color,
            description: args.split(' ').join(' :clap: '),
            footer: {
                text: `- ${msg.author.tag}`
            }
        }});
    }
}

module.exports.config = {
    info: {
        module: 'roleplay',
        name: '👏 Clapify',
        trigger: 'clap',
        aliases: [],
        usage: '%trigger%',
        color: 16759552
    },

    role: {
        required: '590429490920947732',
        notice: 'Sorry, but you need to be a Nitro booster to use this command'
    },

    cooldown: {
        seconds: '15',
        notice: 'You have to wait ``%seconds%s`` to do this again. The default cooldown is ``%cooldown%s``'
    },

    error: {
        empty: 'You need to mention someone'
    }
}
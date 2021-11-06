'use strict'

const internal  = {};

module.exports = internal.superkick = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) {
        var settings    = module.exports.config;
        var mention     = msg.mentions.users.first();

        if (!mention) {
            if(args) {
                var user = this.client.users.cache.filter(users => users.username.toLowerCase().indexOf(args) > -1 );
                mention = user.first();
            } else {
                msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } });
                return;
            }
        } else {
            mention = msg.guild.member(mention);
        }

        msg.channel.send({ embed: {
            color: settings.info.color,
            description: `My gawd, ${msg.author} just super kicked ${mention}`,
            image: {
                url: settings.image
            }
        }})
    }
}

module.exports.config = {
    info: {
        module: 'roleplay',
        name: '🦵🏻 Super kick',
        trigger: 'superkick',
        aliases: [],
        tags: ['wwe', 'aew', 'impact', 'roh', 'wrestling'],
        usage: '%trigger% <user>',
        color: 'F0704D'
    },

    image: 'https://i.imgur.com/DnzaTd3.gif',

    cooldown: {
        seconds: '5',
        notice: 'You have to wait ``%seconds%s`` to do this again. The default cooldown is ``%cooldown%s``'
    },

    error: {
        empty: 'You need to mention another person'
    }
}
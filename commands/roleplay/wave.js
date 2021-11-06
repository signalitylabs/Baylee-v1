'use strict'

const internal  = {};

module.exports = internal.wave = class {
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
            description: `👋🏻 ${msg.author} waves at ${mention}`,
            image: {
                url: settings.image
            }
        }})
    }
}

module.exports.config = {
    info: {
        module: 'roleplay',
        name: '👋🏻 Wave',
        trigger: 'wave',
        aliases: [],
        tags: ['bear'],
        usage: '%trigger% <user>',
        color: 'F0704D'
    },

    image: 'https://media4.giphy.com/media/IThjAlJnD9WNO/giphy.gif?cid=2c203819jaqta8ixjhomg8inuzndvf5phkbse9clxbutjizv&rid=giphy.gif',

    cooldown: {
        seconds: '5',
        notice: 'You have to wait ``%seconds%s`` to do this again. The default cooldown is ``%cooldown%s``'
    },

    error: {
        empty: 'You need to mention another person'
    }
}
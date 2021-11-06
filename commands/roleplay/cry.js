'use strict'

const internal  = {};

module.exports = internal.cry = class {
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
            }
        } else {
            mention = msg.guild.member(mention);
        }

        if(mention) mention = `to ${mention}`;

        msg.channel.send({ embed: {
            color: settings.info.color,
            description: `😭 ${msg.author} cries ${mention}`,
            image: {
                url: settings.image
            }
        }})
    }
}

module.exports.config = {
    info: {
        module: 'roleplay',
        name: '😭 Cry',
        trigger: 'cry',
        aliases: [],
        tags: ['pokemon'],
        usage: '%trigger%',
        color: 'F0704D'
    },

    image: 'https://media2.giphy.com/media/L95W4wv8nnb9K/giphy.gif?cid=2c203819nbfngoxyv8lqsj11wj1866o605qq7jg16q3wjs2c&rid=giphy.gif',

    cooldown: {
        seconds: '5',
        notice: 'You have to wait ``%seconds%s`` to do this again. The default cooldown is ``%cooldown%s``'
    }
}
'use strict'

const Discord   = require('discord.js');
const Jimp      = require('jimp');

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
        var mention     = msg.mentions.users.first();
        var tagged      = msg.author.displayAvatarURL({ format: 'png', dynamic: false, size: 1024 });
        var sender      = tagged;
        var user;

        if (!mention) {
            if(args) {
                user = this.client.users.cache.filter(users => users.username.toLowerCase().indexOf(args) > -1 );

                if(user.first()) {
                    tagged    = user.first().avatarURL({ format: 'png', dynamic: false, size: 1024 });
                } else {
                    msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } }); return false;
                }
            }
        } else {
            tagged    = msg.mentions.users.first().avatarURL({ format: 'png', dynamic: false, size: 1024 });
        }

        tagged = await Jimp.read(tagged)
        .then(async image => { return await image.resize(240, Jimp.AUTO);  });

        sender = await Jimp.read(sender)
        .then(async image => { return await image.resize(100, Jimp.AUTO);  });

        var overlay = await Jimp.read('./assets/images/avatar/hug.png')
        .then(async image => { return await image.resize(Jimp.AUTO, 600);  });

        var mentioned   = await Jimp.read('./assets/images/avatar/hug.png')
        .then(async image => {
            return await image.resize(Jimp.AUTO, 600)
            .composite( tagged, 240, 80 )
            .composite( tagged.resize(30, Jimp.AUTO), 40, 240 )
            .composite( overlay, 0, 0 )
            .composite( sender, 450, 140 )
            .composite( sender, 180, 10 )
            .composite( sender.resize(20, Jimp.AUTO), 20, 220 );
        });

        var x = await mentioned.getBufferAsync(Jimp.MIME_PNG);
        const attachment = new Discord.MessageAttachment(x, 'hug.png');
        msg.channel.send(attachment);

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'pfp',
        name: '🤗 Hug',
        trigger: 'hug',
        aliases: [],
        usage: '%trigger% <user>',
        color: 13244606
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to mention another person'
    }
}
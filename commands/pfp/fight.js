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
        .then(async image => { return await image.resize(420, Jimp.AUTO); });

        sender = await Jimp.read(sender)
        .then(async image => { return await image.resize(420, Jimp.AUTO);  });

        var overlay = await Jimp.read('./assets/images/avatar/who_would_win.png')
        .then(async image => { return await image.resize(Jimp.AUTO, 600); });

        var mentioned   = await Jimp.read('./assets/images/avatar/who_would_win.png')
        .then(async image => {
            return await image.resize(Jimp.AUTO, 600)
            .composite( tagged, 520, 130 )
            .composite( sender, 60, 130 )
            .composite( overlay, 0, 0 )
        });


        var x = await mentioned.getBufferAsync(Jimp.MIME_PNG);
        const attachment = new Discord.MessageAttachment(x, 'win.png');
        msg.channel.send(attachment).then(message => {
            message.react(settings.emoji.opt1);
            message.react(settings.emoji.opt2);
        });

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'pfp',
        name: '🏆 Who would win',
        trigger: 'fight',
        aliases: [],
        usage: '%trigger% <user>',
        color: 13244606
    },

    emoji: {
        opt1: '1️⃣',
        opt2: '2️⃣'
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to mention another person'
    }
}
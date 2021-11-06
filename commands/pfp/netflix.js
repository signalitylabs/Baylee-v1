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
        var tagged      = msg.author.displayAvatarURL({ format: 'png', dynamic: false, size: 512 });

        //We need at least 3 mentions to continue
        if(msg.mentions.users.size < 3) { msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } }); return false; }

        var avatars = [];
        for(const user of msg.mentions.users) {
            avatars.push(`https://cdn.discordapp.com/avatars/${user[1].id}/${user[1].avatar}.png?size=512`);
        }

        //The person who typed the command
        var sender = await Jimp.read(tagged)
        .then(async image => { return await image.resize(150, Jimp.AUTO);  });

        //First tagged person
        var tagged1 = await Jimp.read(avatars[0])
        .then(async image => { return await image.resize(150, Jimp.AUTO); });

        //Second tagged person
        var tagged2 = await Jimp.read(avatars[1])
        .then(async image => { return await image.resize(150, Jimp.AUTO); });

        //Third tagged person
        var tagged3 = await Jimp.read(avatars[2])
        .then(async image => { return await image.resize(150, Jimp.AUTO); });

        //Load the overlay of the plate
        var overlay = await Jimp.read('./assets/images/avatar/netflix.png')
        .then(async image => { return await image.resize(Jimp.AUTO, 600); });

        //Using the normal file as a size template
        var mentioned   = await Jimp.read('./assets/images/avatar/netflix.png')
        .then(async image => {
            return await image.resize(Jimp.AUTO, 600)
            .composite( sender, 212, 245 ) //Person who typed the command
            .composite( tagged1, 374, 245 ) //First person tagged
            .composite( tagged2, 541, 245 ) //First person tagged
            .composite( tagged3, 708, 245 ) //First person tagged
            .composite( overlay, 0, 0 )
        });

        //Process the end result and send it to the channel
        var x = await mentioned.getBufferAsync(Jimp.MIME_PNG);
        const attachment = new Discord.MessageAttachment(x, 'netflix.png');
        msg.channel.send(attachment).then(async (message) => {
            await message.react(settings.emoji.opt1);
            await message.react(settings.emoji.opt2);
            await message.react(settings.emoji.opt3);
            await message.react(settings.emoji.opt4);
        });

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'pfp',
        name: '📺 Netflix',
        trigger: 'netflix',
        aliases: [],
        usage: '%trigger% <user>',
        color: 13244606
    },

    emoji: {
        opt1: '1️⃣',
        opt2: '2️⃣',
        opt3: '3️⃣',
        opt4: '4️⃣'
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to tag three people'
    }
}
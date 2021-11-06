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
        
        //If they didn't ask a question then we can't get an answer
        if(!args) { msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } }); return false; }
        
        //Pull a random answer
        msg.channel.send({ embed: {
            color: settings.info.color,
            author: {
                name: settings.info.name.replace(/[^0-9a-z ]/gi, ''),
                icon_url: settings.info.icon,
            },
            fields: [{
                name: 'You asked',
                value: `\`${args}\``,
                inline: true
            },{
                name: 'The 8ball says',
                value: `\`${settings.responses[Math.floor(Math.random() * settings.responses.length)]}\``,
                inline: true
            }],
            footer: {
                icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                text: `Requested by ${msg.author.tag}`
            }
        }});

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'fun',
        name: '🎱 Magic 8Ball',
        trigger: '8ball',
        aliases: [],
        tags: ['game'],
        usage: '%trigger% <question>',
        color: 16752640,
        icon: 'https://i.imgur.com/4newNxl.png'
    },

    responses: ['It is certain', 'No way', 'You wish', 'Maybe, time will tell', 'I don\'t see it happening', 'Most likely', 'My sources say no', 'Signs point to yes', 'As I see it, yes', 'Never', 'Probably'],

    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You did not give me a question'
    }
}
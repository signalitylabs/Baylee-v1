'use strict'

const internal  = {};
const request   = require('request');

module.exports = internal.kiss = class {
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
        
        request(`https://nekos.life/api/kiss`, function(err, response, body) {
            var results = JSON.parse(body);
            var url = results.url;

            if(mention && msg.author.id == mention.id) { url = `https://i.imgur.com/NUS5qGI.gif`; }
            
            msg.channel.send({ embed: {
                color: settings.info.color,
                description: `💕 ❤ ${mention} got a kiss from ${msg.author} ❤ 💕`,
                image: {
                    url: url
                }
            }})
        });
    }
}

module.exports.config = {
    info: {
        module: 'roleplay',
        name: '💋 Kiss',
        trigger: 'kiss',
        aliases: [],
        tags: ['anime'],
        usage: '%trigger% <user>',
        color: 'F0704D'
    },
    
    cooldown: {
        seconds: '5',
        notice: 'You have to wait ``%seconds%s`` to do this again. The default cooldown is ``%cooldown%s``'
    },

    error: {
        empty: 'You need to mention another person'
    }
}
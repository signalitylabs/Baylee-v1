'use strict'

const request   = require('request');

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
        
        if(!args) { msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } }); return; }
        
        var search_url = `https://minotar.net/armor/body/${args}/100.png`;
        request(search_url, function(err, response, body) {
            if(response.statusCode == 404) { msg.channel.send({ embed: { color: settings.info.color, description: settings.error.results } }); return; }

            msg.channel.send({ embed: {
                color: settings.info.color,
                author: {
                    name: settings.info.name.replace(/[^0-9a-z ]/gi, '') + ` for ${args}`,
                    icon_url: search_url.replace('armor/body', 'cube'),
                },
                thumbnail: {
                    url: `https://minotar.net/skin/${args}`
                },
                image: {
                    url: search_url
                },
                footer: {
                    icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                    text: `Searched by ${msg.author.tag}`
                }
            }})
        });
    }
}

module.exports.config = {
    info: {
        module: 'games',
        name: '🔍 Minecraft Skin Viewer',
        trigger: 'mcskin',
        aliases: [],
        tags: ['minecraft'],
        usage: '%trigger% <username>',
        color: 65330,
        icon: 'https://i.imgur.com/mIpjqCb.png'
    },

    cooldown: {
        seconds: '10'
    },

    error: {
        empty: 'You need to type a username to look up',
        results: 'No skin found'
    }
}
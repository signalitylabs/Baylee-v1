'use strict'

const giphy     = require('giphy-api')(process.env.GIPHY_API);

module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async loadSite(post, msg, args) {
        var settings = module.exports.config;
        
        //They didn't search for anything, bad on them
        if(!args) {post.edit({ embed: { color: settings.info.color, description: settings.error.empty } }); return false; }

        giphy.search(args, function (err, res) {
            //Load results and grab a random gif
            var gifs    = res.data;
            var gif     = gifs[Math.floor(Math.random() * gifs.length)];

            if(gif) {
                //If we found a gif then add it to an embed and send it to the channel
                post.edit({ embed: {
                    color: settings.info.color,
                    image:  {
                        url: gif.images.original.url
                    },
                    footer: {
                        text: `${args} searched by ${msg.author.tag}`
                    }
                }});
                return true;
            } else {
                //If we can't find a gif tell them
                post.edit({ embed: { color: settings.info.color, description: settings.error.noresults }});
                return true;
            }
        });
    }

    async onChat(msg, args, config) {
        var settings = module.exports.config;
        return await msg.channel.send({ embed: {
            author: {
                name: `Loading...`,
                icon_url: `https://i.imgur.com/Q7HC2MM.gif`
            },
            color: settings.info.color
        }}).then(async (post) => {
            return await this.loadSite(post, msg, args);
        });
    }
}

module.exports.config = {
    info: {
        module: 'fun',
        name: '📺 Search gifs',
        trigger: 'gif',
        aliases: [],
        usage: '%trigger% <keywords>',
        color: 4159422
    },

    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to type something to search for',
        noresults: 'I couldn\'t find anything for that'
    }
}
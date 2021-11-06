'use strict'

const fetchClass    = require(`./../../classes/fetch.js`);
const fetch         = new fetchClass();

module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg) {
        var settings    = module.exports.config;
        //Load a random image from this subreddit using cache
        var image       = await fetch.redditImage(`anime_irl`);

        msg.channel.send({ embed: {
            color: settings.info.color,
            image: {
                url: image.src
            },
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
        module: 'anime',
        name: '🐱 Anime IRL',
        trigger: 'animeirl',
        aliases: [],
        tags: ['anime'],
        usage: '%trigger%',
        color: 16711893
    },

    cooldown: {
        seconds: '15'
    }
};
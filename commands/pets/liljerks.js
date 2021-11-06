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

    async loadSite(post, msg, args) {
        var settings    = module.exports.config;
        //Load a random image from this subreddit using cache
        var image       = await fetch.redditImage(`AnimalsBeingJerks`);

        post.edit({ embed: {
            color: settings.info.color,
            author: {
                name: image.author,
                url: image.author_link
            },
            title: image.title,
            url: image.link,
            image: {
                url: image.src
            },
            footer: {
                icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                text: `Requested by ${msg.author.tag}`
            }
        }})
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
        module: 'pets',
        name: '🦝 Pets Being Jerks',
        trigger: 'liljerks',
        aliases: [],
        usage: '%trigger%',
        color: 2996390
    },

    cooldown: {
        seconds: '10'
    }
}
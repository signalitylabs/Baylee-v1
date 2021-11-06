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

    async loadSite(post, msg) {
        var settings = module.exports.config;

        //Grab results from wikipedia
        var query = await fetch.url(`http://history.muffinlabs.com/date`);
        var results = JSON.parse(query);
        var events = results.data.Events;
        var event = events[Math.floor(Math.random() * events.length)];

        //We make it here? SHOW ME WHAT YOU GOT
        post.edit('', { embed: {
            color: settings.info.color,
            title: `On this day (${results.date})`,
            url: `${event.links[0].link}`,
            description: `${event.year}: ${event.text}`,
            footer: {
                icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                text: `Searched by ${msg.author.tag}`
            }
        }});

        return true;
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
        module: 'homework',
        name: '📰 Today In History',
        trigger: 'today in',
        aliases: [],
        usage: '%trigger%',
        color: 58623
    },

    cooldown: {
        seconds: '15'
    }
}
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
        var settings = module.exports.config;
        
        //Nothing to search for? too bad
        if(!args) { post.edit('', { embed: { color: settings.info.color, description: settings.error.empty } }); return false; }

        //Grab results from wikipedia
        var query = await fetch.url(`https://wikipedia.org/w/api.php?list=search&action=query&format=json&srsearch=${args}`);
        var results = JSON.parse(query);
        results = results.query.search[0];

        //No results? So sad
        if(!results) { post.edit('', { embed: { color: settings.info.color, description: settings.error.noresults } }); return false; }

        //We make it here? SHOW ME WHAT YOU GOT
        post.edit('', { embed: {
            color: settings.info.color,
            title: results.title,
            url: `https://en.wikipedia.org/w/index.php?title=${results.title}`,
            description: results.snippet.replace(/(<([^>]+)>)/ig,''),
            author: {
                name: 'Wikipedia Search',
                icon_url: 'https://i.imgur.com/Nsbj7Ml.png',
            },
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
        name: '🌐 Search Wikipedia',
        trigger: 'wiki',
        aliases: [],
        usage: '%trigger% <keywords>',
        color: 58623
    },

    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to type something to search for',
        noresults: 'No results found for your search'
    }
}
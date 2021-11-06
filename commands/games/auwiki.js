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
        
        if(!args) { post.edit('', { embed: { color: settings.info.color, description: settings.error.empty } }); return; }

        var search = await fetch.url(`https://among-us.fandom.com/api/v1/Search/List?query=${args}`)
        var results = JSON.parse(search);
        results = results.items[0];

        post.edit('', { embed: {
            color: settings.info.color,
            title: results.title,
            url: results.url,
            description: results.snippet.replace(/(<([^>]+)>)/ig,''),
            thumbnail: {
                url: 'https://i.imgur.com/ZzPbN6F.png'
            },
            author: {
                name: 'Among Us Wiki',
                icon_url: 'https://i.imgur.com/eKIDTlh.png',
            },
            footer: {
                icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                text: `Searched by ${msg.author.tag}`
            }
        }})
    }

    async onChat(msg, args, config) {
        var settings = module.exports.config;
        msg.channel.send({ embed: {
            author: {
                name: `Loading...`,
                icon_url: `https://i.imgur.com/Q7HC2MM.gif`
            },
            color: settings.info.color
        }}).then((post) => {
            this.loadSite(post, msg, args);
        })
    }
}

module.exports.config = {
    info: {
        module: 'games',
        name: '🚀 Search Among Us Wiki',
        trigger: 'auwiki',
        aliases: [],
        tags: ['among us'],
        usage: '%trigger% <keywords>',
        color: 16711687
    },

    cooldown: {
        seconds: '10'
    },

    error: {
        empty: 'You need to type something to search for like Crewmate or Imposter'
    }
}
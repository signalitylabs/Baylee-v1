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

        var search = await fetch.url(`https://minecraft.gamepedia.com/api.php?list=search&action=query&format=json&srsearch=${args}`)
        var results = JSON.parse(search);
        results = results.query.search[0];

        post.edit('', { embed: {
            color: settings.info.color,
            title: results.title,
            url: `https://minecraft.gamepedia.com/?curid=${results.pageid}`,
            description: results.snippet.replace(/(<([^>]+)>)/ig,''),
            thumbnail: {
                url: 'https://i.imgur.com/AcLuWKI.png'
            },
            author: {
                name: 'Minecraft Wiki',
                icon_url: 'https://i.imgur.com/T1rYdPX.png',
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
        name: '⚒️ Search Minecraft Wiki',
        trigger: 'mcwiki',
        aliases: [],
        tags: ['minecraft'],
        usage: '%trigger% <keywords>',
        color: 65330
    },

    cooldown: {
        seconds: '10'
    },

    error: {
        empty: 'You need to type something to search for'
    }
}
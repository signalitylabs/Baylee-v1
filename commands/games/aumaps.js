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

        if(!args) { msg.channel.send('', { embed: { color: settings.info.color, description: settings.error.empty } }); return; }

        switch(args.toLowerCase()) {
            case 'skeld':
                msg.channel.send({ embed: {
                    title: `The Skeld`,
                    image: {
                        url: `https://i.imgur.com/miupo5T.png`
                    },
                    color: settings.info.color
                }});
                return true;
                break;

            case 'polus':
                msg.channel.send({ embed: {
                    title: `Polus`,
                    image: {
                        url: `https://i.imgur.com/FVJnUSu.png`
                    },
                    color: settings.info.color
                }});
                return true;
                break;

            case 'mira':
                msg.channel.send({ embed: {
                    title: `Mira HQ`,
                    image: {
                        url: `https://i.imgur.com/zi2fb6X.png`
                    },
                    color: settings.info.color
                }});
                return true;
                break;

            default:
                msg.channel.send('', { embed: { color: settings.info.color, description: settings.error.empty } }); return;
                break;
        }
    }
}

module.exports.config = {
    info: {
        module: 'games',
        name: '🗺️ Among Us Maps',
        trigger: 'aumaps',
        aliases: [],
        tags: ['among us'],
        usage: '%trigger% <keywords>',
        color: 16711687
    },

    cooldown: {
        seconds: '10'
    },

    error: {
        empty: 'You need to type a map name like skeld, polus, or mira'
    }
}
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

        //They have to search for an anime, but if they didn't
        if(!args) { post.edit({ embed: { color: settings.info.color, description: settings.error.empty } }); return false; }
        
        //Using kitsu api to pull in anime info
        var body        = await fetch.url(`https://kitsu.io/api/edge/anime?filter[text]=${args}`);
        var results = JSON.parse(body);
        var details = results.data[0].attributes;
        var synopsis = details.synopsis.replace(/(<([^>]+)>)/ig,'');
        synopsis = synopsis.substring(0, 350) + '...';

        //No results found, bummer
        if(!results) { post.edit({ embed: { color: settings.info.color, description: settings.error.noresults } }); return false; }

        //Load in the anime info
        var details = results.data[0].attributes;
        var synopsis = details.synopsis.replace(/(<([^>]+)>)/ig,'');
        synopsis = synopsis.substring(0, 350) + '...';

        //Try to grab an image from the results
        try {
            var image = details.coverImage.original;
        } catch {
            var image = details.posterImage.original;
        }
        
        //Send the results
        post.edit({ embed: {
            color: settings.info.color,
            title: `${details.canonicalTitle} \`${details.subtype}\``,
            url: `https://kitsu.io/anime/${details.slug}`,
            image:  {
                url: image
            },
            thumbnail: {
                url: `${details.posterImage.original}`
            },
            description: `${synopsis}`,
            fields: [{
                name: `Auidence Score`,
                value: `${details.averageRating} out of 100`,
                inline: true
            },{
                name: `Rating`,
                value: `${details.ageRating} for ${details.ageRatingGuide}`,
                inline: true
            }],
            author: {
                name: settings.info.name.replace(/[^0-9a-z ]/gi, ''),
                icon_url: settings.info.icon,
            },
            footer: {
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
        module: 'anime',
        name: '🍿 Search Anime',
        trigger: 'anime',
        aliases: [],
        tags: ['anime'],
        usage: '%trigger% <text>',
        color: 16711893,
        icon: 'https://i.imgur.com/Bk76mSX.jpg',
    },

    cooldown: {
        seconds: 15
    },

    error: {
        empty: 'You need to type something to search for',
        noresults: 'I couldn\'t find anything for that'
    }
};
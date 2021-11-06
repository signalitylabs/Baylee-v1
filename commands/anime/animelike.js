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
        
        //Using jikan api to pull in anime recommendations
        var body = await fetch.url(`https://api.jikan.moe/v3/search/anime?q=${args}`)
        var results     = JSON.parse(body);
        results         = results.results;

        if(!results) { post.edit({ embed: { color: settings.info.color, description: settings.error.noresults } }); return false; }

        var response = ``; //Response builder
        var x = 1; //Results counter
        for(var i = 1; i < results.length; i++) {
            //We're going to remove animes with the same name of the searched anime
            if(!results[i].title.includes(results[0].title)) {
                x++; //add 1 to counter
                //build the response
                response = `${response}**${x}.** [${results[i].title}](${results[i].url}) \`${results[i].type}\` ${results[i].score}/10\n`;
                //Only allow up to 7 animes to be shown
                if(x >= 7) { break; }
            }
        }

        //They have to search for an anime, but if they didn't
        if(response.length < 1) { post.edit({ embed: { color: settings.info.color, description: settings.error.noresults } }); return false; }
        
        //Send the results
        post.edit({ embed: {
            color: settings.info.color,
            title: `Similiar animes to ${results[0].title}`,
            thumbnail: {
                url: results[0].image_url
            },
            description: response,
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
        module: 'anime',
        name: '📺 Find Similiar Anime',
        trigger: 'animelike',
        aliases: [],
        tags: ['anime'],
        usage: '%trigger% <anime>',
        color: 16711893
    },

    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to type something to search for',
        noresults: 'I couldn\'t find anything for that'
    }
};
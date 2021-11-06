'use strict'

const internal = {};
const request   = require('request');

module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) {
        var settings = module.exports.config;
        
        if(!args) { msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } }); return false; }

        var search_url = `https://api.dictionaryapi.dev/api/v2/entries/en/${args}`;
        request(search_url, async function(err, response, body) {
            var results = JSON.parse(body);
            results = results[0];

            if(!results) {
                msg.channel.send({ embed: { color: settings.info.color, description: settings.error.noresults }});
                return;
            }

            var fields = [];

            for(var i = 0; i < results.meanings.length; i++) {
                var meanings    = results.meanings[i];
                var definitions = meanings.definitions[0];

                fields.push({
                                name: `__${meanings.partOfSpeech}__`,
                                value: `${definitions.definition}`
                            });
                            
                if(definitions.example) {
                    fields.push({
                                    name: `*`,
                                    value: `\`Example\` ${definitions.example}`,
                                    inline: true
                                });
                }

                if(definitions.synonyms) {
                    fields.push({
                                    name: `*`,
                                    value: `\`Synonyms\` ${definitions.synonyms.join(', ')}`,
                                    inline: true
                                });
                }
            }

            await msg.channel.send({ embed: {
                color: settings.info.color,
                thumbnail: {
                    url: `https://i.imgur.com/qpzXRXa.png`
                },
                title: `${results.word} *${results.phonetics[0].text}*`,
                url: results.phonetics[0].audio,
                fields: fields,
                footer: {
                    icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                    text: `Searched by ${msg.author.tag}`
                }
            }});

            return true;
        });
    }
}

module.exports.config = {
    info: {
        module: 'homework',
        name: '📕 Word Lookup',
        trigger: 'define',
        aliases: [],
        usage: '%trigger% <keywords>',
        color: 58623
    },

    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to type something to search for',
        noresults: 'Sorry, I couldn\'t find that word'
    }
}
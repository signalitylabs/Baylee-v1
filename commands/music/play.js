'use strict'


const musicClass  = require(`./../../classes/music.js`);
const music       = new musicClass();

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

        //THIS COMMAND SHOULD ONLY WORK ON DEV MODE
        if(!process.env.DEV_MODE) { return; }

        return await msg.channel.send({ embed: {
            author: {
                name: `Loading music...`,
                icon_url: `https://i.imgur.com/Q7HC2MM.gif`
            },
            color: settings.info.color
        }}).then(async (post) => {
            return await music.play(post, msg, args);
        });
    }
}

module.exports.config = {
    info: {
        module: 'info',
        name: '🎵 Play Music',
        trigger: 'play',
        aliases: [],
        usage: '%trigger%',
        color: 16711920
    },

    cooldown: {
        seconds: '5'
    }
}
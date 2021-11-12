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

    async onChat(msg, args, config) {
        var settings = module.exports.config;
        await fetch.redditImage(msg, `4chan`, settings);
    }
}

module.exports.config = {
    info: {
        module: 'memes',
        name: '👅 Memes from the Board',
        trigger: '4chan',
        aliases: [],
        usage: '%trigger%',
        color: 3893891
    },

    cooldown: {
        seconds: '15'
    }
};
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
        await fetch.redditImage(msg, `PrequelMemes`, settings);
    }
}

module.exports.config = {
    info: {
        module: 'memes',
        name: '👅 Prequel Memes',
        trigger: 'prequel',
        aliases: [],
        tags: ['star wars'],
        usage: '%trigger%',
        color: 3893891
    },

    cooldown: {
        seconds: '15'
    }
};
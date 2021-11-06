'use strict'

module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) { 
        //Ping them right back
        msg.channel.send(`<@${msg.author.id}> pong`);

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'fun',
        name: '🏓 Ping',
        trigger: 'ping',
        aliases: [],
        tags: ['game'],
        usage: '%trigger%',
        color: 4159422
    },

    cooldown: {
        seconds: '15'
    }
}
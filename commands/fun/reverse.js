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
        var settings    = module.exports.config;

        //If there is nothing to reverse then notify and leave
        if(!args) { msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } }); return false; }
        
        //reverse the text and send to the member
        msg.channel.send({ embed: {
            color: settings.info.color,
            description: args.split('').reverse().join(''),
            author: {
                name: settings.info.name.replace(/[^0-9a-z ]/gi, ''),
                icon_url: settings.info.icon,
            }
        }});

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'fun',
        name: '↪️ Reverse Text',
        trigger: 'reverse',
        aliases: [],
        tags: ['game'],
        usage: '%trigger% <text>',
        color: 4159422,
        icon: 'https://i.imgur.com/FwCbLfo.png'
    },

    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to type something to reverse'
    }
}
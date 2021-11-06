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
        var settings = module.exports.config;
        
        //Pick a random side of the coin
        var sides = settings.coins;
        var side = sides[Math.floor(Math.random() * sides.length)];

        //Show the coin
        msg.channel.send({ embed: {
            color: settings.info.color,
            author: {
                name: settings.info.name.replace(/[^0-9a-z ]/gi, ''),
                icon_url: settings.info.icon,
            },
            description: `You flipped a coin and it landed on ${side.side}`,
            thumbnail: {
                url: side.image
            },
            footer: {
                icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                text: `Flipped by ${msg.author.tag}`
            }
        }});

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'fun',
        name: '🤞🏻 Flip Coin',
        trigger: 'coinflip',
        aliases: [],
        tags: ['game'],
        usage: '%trigger%',
        color: 16752640,
        icon: 'https://i.imgur.com/2lAj4T0.png'
    },

    coins: [
        {side: 'Heads', image: 'https://i.imgur.com/2lAj4T0.png'},
        {side: 'Tails', image: 'https://i.imgur.com/1WElxVM.png'}
    ],

    cooldown: {
        seconds: '15'
    }
}
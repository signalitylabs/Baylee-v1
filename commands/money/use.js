'use strict'

const moneyClass  = require(`./../../classes/money.js`);
const money       = new moneyClass();

const maxResults = 6;

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
        var db          = this.db;

        //They have to use the right namespace, but if they didn't
        if(!args) { msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } }); return false; }

        var inventory   = await db.query(`SELECT itm.name, itm.emoji, itm.image, itm.description, itm.namespace, itm.type, inv.quantity FROM inventory AS inv INNER JOIN items AS itm ON inv.itemid = itm.itemid WHERE namespace = "${args}" AND inv.userid = "${msg.author.id}" LIMIT 1`);
        
        //They have to use the right namespace, but if they didn't
        if(inventory.length == 0) { msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } }); return false; }

        //Set the item and filter the types
        var itm = inventory[0];
        switch(itm.type) {
            case 'Collectable':
                msg.channel.send({ embed: {
                    title: `${itm.name}`,
                    description: `${itm.description}`,
                    thumbnail: {
                        url: `${itm.image}`
                    },
                    footer: {
                        text: `Owned by ${msg.author.username}`
                    }
                } });
                break;
        }

        return true; 
    }
}

module.exports.config = {
    info: {
        module: 'money',
        name: '🤚 Use Item',
        trigger: 'use',
        aliases: [],
        usage: '%trigger%',
        color: 2336037,
        ignore: true
    },

    cooldown: {
        seconds: '10'
    },

    error: {
        empty: 'You need to type something to search for',
        noresults: 'You do not own this item'
    }
}
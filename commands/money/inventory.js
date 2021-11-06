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

        //Grab the page number
        if(args) {
            var pageNumber = parseFloat(args.replace(/[^1-9\.]/g, '')).toFixed(0);
        }

        if(!pageNumber || isNaN(pageNumber)) { var pageNumber = 1; }
        //Get the starting number of the help folder
        var startingNumber = (pageNumber * maxResults) - maxResults;
        //Get the ending number
        var endingNumber = startingNumber + maxResults;

        var inventory   = await db.query(`SELECT itm.name, itm.emoji, itm.description, itm.namespace, itm.type, inv.quantity FROM inventory AS inv INNER JOIN items AS itm ON inv.itemid = itm.itemid WHERE inv.userid = "${msg.author.id}"`);
        
        var pageTotal       = Math.ceil(inventory.length/maxResults);
        if( endingNumber > inventory.length ) { endingNumber = inventory.length; }

        //Loop through all the owned items and add them to the fields array
        var fields = [];
        for(var x = startingNumber; x < endingNumber; x++) {
            var itm = inventory[x];
            //Set the item information
            fields.push({
                name: `${itm.emoji} ${itm.quantity}x ${itm.name}`,
                value: `ID \`${itm.namespace}\` - *${itm.type}*`
            });
        }

        //Looks like they don't have anything
        if(inventory.length == 0) {
            fields.push({
                name: `👀 ...`,
                value: `Your inventory is empty`
            });
        }

        //Send it to the chat
        msg.channel.send({ embed: {
            color: settings.info.color,
            title: `Items owned by ${msg.author.username}`,
            fields: fields,
            footer: {
                text: `Use items with: bae use <ID> | Page ${pageNumber} of ${pageTotal}`
            }
        } });

        return true; 
    }
}

module.exports.config = {
    info: {
        module: 'money',
        name: '📦 Inventory',
        trigger: 'inventory',
        aliases: ['inv'],
        usage: '%trigger%',
        color: 2336037
    },

    cooldown: {
        seconds: '10'
    }
}
'use strict'

const memeifyClass  = require(`./../../classes/memeify.js`);
const memeify       = new memeifyClass();

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
        var filename    = 'harold.png';

        //Pass meme variables to class
        var meme    = await memeify.createMeme(msg,
                        {
                            filename: filename,
                            input: args,
                            required: 1,
                            watermark: `black`
                        },
                        [
                            {
                                left: 5,
                                top: 221,
                                width: 593,
                                height: 79,
                                hcenter: true,
                                vcenter: true,
                                color: `white`,
                                shadow: true
                            },
                            {
                                left: 5,
                                top: 518,
                                width: 593,
                                height: 79,
                                hcenter: true,
                                vcenter: true,
                                color: `white`,
                                shadow: true
                            }
                        ]);
        
        if(!meme) {
            //If there is no meme tell them an error happened
            msg.channel.send({
                embed: {
                    color: settings.info.color,
                    description: settings.error.empty
                }
            });
            
            return false;
        }

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'memeify',
        name: '👌 Harold',
        trigger: 'harold',
        aliases: [],
        tags: ['old'],
        usage: '%trigger% <text>',
        required: 2,
        color: 13244606
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to enter some text to memeify like\n`someone matches with me on tender, they are a 53 year old divorced man`'
    }
}
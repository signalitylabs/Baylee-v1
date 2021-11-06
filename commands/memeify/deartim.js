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
        var filename    = 'deartim.png';

        //Pass meme variables to class
        var meme    = await memeify.createMeme(msg,
                        {
                            filename: filename,
                            input: args,
                            required: 1,
                            watermark: `white`
                        },
                        [
                            {
                                left: 72,
                                top: 49,
                                width: 445,
                                height: 238,
                                hcenter: true,
                                vcenter: true,
                                color: `black`,
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
        name: '✉️ Dear Tim & Moby',
        trigger: 'deartim',
        aliases: [],
        tags: ['tim and moby', 'tim', 'moby'],
        usage: '%trigger% <text>',
        required: 1,
        color: 13244606
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to enter some text to memeify like\n`why is my pee red?`'
    }
}
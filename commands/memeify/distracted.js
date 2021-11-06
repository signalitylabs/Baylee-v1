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
        var filename    = 'distracted.png';

        //Pass meme variables to class
        var meme    = await memeify.createMeme(msg,
                        {
                            filename: filename,
                            input: args,
                            required: 3,
                            watermark: `black`
                        },
                        [
                            {
                                left: 5,
                                top: 336,
                                width: 205,
                                height: 163,
                                hcenter: true,
                                vcenter: true,
                                color: `black`
                            },{
                                left: 224,
                                top: 254,
                                width: 207,
                                height: 147,
                                hcenter: true,
                                vcenter: true,
                                color: `black`
                            },{
                                left: 416,
                                top: 7,
                                width: 173,
                                height: 135,
                                hcenter: true,
                                vcenter: true,
                                color: `black`
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
        name: '👦 Distracted Bf',
        trigger: 'distracted',
        aliases: [],
        tags: ['boyfriend', 'girlfriend'],
        usage: '%trigger% <text>',
        required: 3,
        color: 13244606
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to enter (3) values separated by a comma. For example `this meme template, me, new memes`'
    }
}
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
        var filename    = 'comeagain.png';

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
                                left: 10,
                                top: 10,
                                width: 577,
                                height: 115,
                                hcenter: false,
                                vcenter: false,
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
        name: '👓 Come again?',
        trigger: 'comeagain',
        aliases: [],
        tags: ['old'],
        usage: '%trigger% <text>',
        required: 1,
        color: 13244606
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to enter some text to memeify like\n`second graders when you tell them there are numbers below 0:`'
    }
}
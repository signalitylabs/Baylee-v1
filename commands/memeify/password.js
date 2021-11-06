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
        var filename    = 'password.png';

        //Pass meme variables to class
        var meme    = await memeify.createMeme(msg,
                        {
                            filename: filename,
                            input: args,
                            required: 2,
                            watermark: `black`
                        },
                        [
                            {
                                left: 24,
                                top: 83,
                                width: 552,
                                height: 68,
                                hcenter: false,
                                vcenter: true,
                                color: `black`
                            },{
                                left: 24,
                                top: 422,
                                width: 552,
                                height: 68,
                                hcenter: false,
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
        name: '*️⃣ Weak and strong passwords',
        trigger: 'password',
        aliases: [],
        usage: '%trigger% <text>',
        required: 2,
        color: 13244606
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to enter (2) values separated by a comma. For example `hiring teens for a teen drama, hiring adults for a teen drama`'
    }
}
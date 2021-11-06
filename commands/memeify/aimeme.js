'use strict'

const path      = require('path');
const fs        = require('fs');
const util      = require('util');
const readdir   = util.promisify(fs.readdir);

const madlib    = require('../../lang/listeners/conversation.json');

module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async grabreply(response) {
        var key = Object.keys(response);
        var pull = response[key[Math.floor(Math.random() * key.length)]][0].reply;

        if(!pull || pull.length < 5) {
            pull = await this.grabreply(response);
        }

        return pull;
    }
    
    async madlib(content) {
        //Grab the definitions
        var definitions = madlib.definitions[0];
        
        //Loop through all of the definitions
        for(var key in definitions) {
            //Select and randomize the definition list
            var focus     = madlib.definitions[0][key].sort(() => Math.random() - 0.5);

            //Grab a random value from the definition
            var word      = focus[Math.floor(Math.random() * focus.length)];
            //Replace the %definition% in the text
            var regex     = new RegExp(`%${key}%`, 'ig');
            //Return the text complete with replacements
            content       = content.replace(regex, word);
        }
        
        return content;
    }

    async onChat(msg, args, config) {

        var files = await readdir(`./commands/memeify/`); 
        var allMemes = [];
        
        for(var x = 0; x < files.length; x++) {
            var file  = files[x];
            
            if(file.endsWith('js')) { 
                if(file !== path.basename(__filename)) {
                    allMemes.push(file);
                }
            }
        }

        //Shuffle the array so it's more random
        allMemes = allMemes.sort(() => Math.random() - 0.5);

        var selectedMeme    = allMemes[Math.floor(Math.random() * allMemes.length)];
        var inc = require(`../../commands/memeify/${selectedMeme}`);
        var memeify = new inc();

        var memeArgs            = '';

        for(var i = 0; i < memeify.getConfig().info.required; i++) {
            //Pull a random reply
            var pull = await this.grabreply(madlib);
            pull = pull[Math.floor(Math.random() * pull.length)];
            var completePhrase = await this.madlib(pull);
            completePhrase = completePhrase.replace(/\,/g, '<--> ');

            memeArgs = memeArgs + (memeArgs.length > 0 ? ',': '') + completePhrase;
        }

        memeArgs = memeArgs.replace(/\?\./g, '?')
                            .replace(/\.\./g, '.')
                            .replace(/\\/g, '.')
                            .replace(/\n/g, '.');

        memeify.onChat(msg, memeArgs, config);

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'memeify',
        name: '⚠️ Uses AI to Make a Meme',
        trigger: 'aimeme',
        aliases: [],
        hover: "Baylee's terrible AI will try to make a meme that may or may not make sense",
        usage: '%trigger%',
        color: 13244606
    },
    
    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to enter some text to memeify like\n`digging straight down to diamonds is the most efficient way of mining`'
    }
}
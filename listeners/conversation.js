'use strict'

const response      = require('../lang/listeners/conversation');
//const config        = require('../config');
const conversations = {};

/*
    Conversation Handler
    Talks to members when you mention baylee's name or
    with the trigger

    TODO: Clean up variables (work like cooldowns?)
*/
module.exports = class{
    constructor(client, db) {
        this.client     = client;
        this.db         = db;
    }

    player_variable_get(key, user_id) {
        try {
            var rkey = conversations[user_id][key];
            return rkey;
        } catch(err) {
            return false;
        }
    }
    
    player_variable_set(key, value, user_id) {
        conversations[user_id][key] = value;
    }
    
    player_variable_clear(user_id) {
        delete conversations[user_id];
        conversations[user_id] = {};
    }
    
    async findmention() {
        var phrase = this.phrase;
        var settings    = module.exports.config;
        
        if( phrase.indexOf(settings.info.madlib_trigger) > -1 ) {
            var phraseArray   = phrase.split(' ');
            var lastword      = phraseArray[phraseArray.length - 1];
            var firstword     = phraseArray[0];
            
            if( lastword == settings.info.madlib_trigger || firstword == settings.info.madlib_trigger ) {
                phrase = phrase.trim();
                
                var trigger = new RegExp(settings.info.madlib_trigger, 'ig');
                phrase = phrase.replace(trigger, '');
                
                return phrase;
            }
        } else { return }
    }
    
    async madlib(content, response1) {
        var definitions = response1.definitions[0];
        
        for(var key in definitions) {
            var focus     = response1.definitions[0][key];

            var word      = focus[Math.floor(Math.random() * focus.length)];
            var regex     = new RegExp(`%${key}%`, 'ig');
            content       = content.replace(regex, word);
        }
        
        return content;
    }
    
    async findtriggers() {
		var msg         = this.msg;
        var client      = this.client;
        var matched     = ' ';
        var default_id, matched_id;
        var phrase  = this.phrase;
        var mention = phrase.substring(phrase.lastIndexOf('<@!') + 3, phrase.lastIndexOf('>')) + '';
        phrase      = phrase.replace(`<@!${mention}>`, '');

        for(var category in response) {
            if(category != 'definitions') {
                var trigger = response[category][0].trigger;

                trigger.forEach(await function(needle) {
                        var finder = phrase.search(needle);

                        if(needle == 'default') { default_id = category; }

                        if(finder > -1 && needle.length > matched.length) {
                            matched_id    = category;
                            matched       = needle;
                        }
                });
            }
        }

        var focus = response[default_id][0].reply;
        if( matched_id ) { focus = response[matched_id][0].reply; }
        
        var reply = focus[Math.floor(Math.random() * focus.length)];
        reply     = await this.madlib(reply, response);
        
        msg.channel.startTyping(true);
        client.setTimeout(() => { 
            msg.channel.send(reply).then(() => { msg.channel.stopTyping(true) }); 
        }, 2000);

        return reply;
    }
    
    async onChatHook(msg) {
        this.msg        = msg;
        this.phrase     = msg.content.toLowerCase();
        var client      = this.client;
        var settings    = module.exports.config;

        if(conversations[msg.author.id] == undefined) {
            conversations[msg.author.id] = {};
        }

        var conversation = this.player_variable_get('baylee', msg.author.id)
        var mention = await this.findmention();
        
        
        switch(this.phrase) {
            case settings.info.trigger:
                if(!conversation) {
                    this.player_variable_set('baylee', true, msg.author.id);
                    msg.channel.startTyping(true);
                    client.setTimeout(() => { 
                        msg.channel.send('okay, i will start responding to everything you say. to make me stop, just say `stop`').then(() => { msg.channel.stopTyping(true) }); 
                    }, 2000);
                }
                return;
                break;
            case 'stop':
                if(conversation) {
                    this.player_variable_clear(msg.author.id);
                    msg.channel.startTyping(true);
                    client.setTimeout(() => { 
                        msg.channel.send(`if you want to talk to me again, just say \`${settings.info.trigger}\` or mention my name`).then(() => { msg.channel.stopTyping(true) }); 
                    }, 2000);
                }
                return;
                break;
            default:
                if(conversation) {
                    mention = true;
                }
        }

        if(mention) {
            this.findtriggers();
            return;
        }
    }
}

/*
    Module settings
*/
module.exports.config = {
    info: {
        madlib_trigger: 'baylee',
        trigger: 'bae talk to me',
        ignore: true
    }
}
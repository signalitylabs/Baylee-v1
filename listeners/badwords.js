'use strict'

/*
    Bad word checker
    Checks if the user has a cooldown on a command

  TODO: Add enable/disable check. Needs a mild re-write
*/
module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }
    onChatHook(msg) {
        var settings    = module.exports.config;
        var client      = this.client;
        var phrase      = msg.content.toLowerCase().replace(/[^a-zA-Z\d\s:]/gi, '');
        var words       = settings.words;
        var ignore      = settings.channels.ignore;
        var author      = msg.author;
        
        if(ignore.includes(msg.channel.id)) { return; }
        
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            var find_word = new RegExp(`${word}`,'gi');
            find_word = phrase.match(find_word);

            if(find_word == word) {
                msg.delete();
                author.send(settings.messages.dm.replace(`%word%`, `${word}`));
                return;
          }
        }
    }
}

/*
    Module settings
*/
module.exports.config = {
  info: {
    ignore: true
  },

  channels: {
    log: '586704853485486091',
    ignore: ['586704853485486091']
  },

  words: ['boogers','nigger','niggers','faggot','faggots','fag','fags','nègre','negro','nègro','negre','pédé','neger','chink','chinks','chinky','cholos','kyke'],

  primary_color: 16752640,

  messages: {
    chat: '%player% your message was removed because you used inappropriate language',
    dm: 'Your message was automatically removed for using the word __%word%__.'
  }
}
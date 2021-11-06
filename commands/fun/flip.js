'use strict'

const internal  = {};

module.exports = internal.flip = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) {
        var settings    = module.exports.config;
        var build       = ' ';
        
        //Yeah they didn't give any text for us to flip
        if(!args) { msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } }); return false; }

        //Loop through the dictionary and translate the text
        //Letter by painful letter
        for(var i = 0; i < args.length; i++) {
            var letter      = args[i];
            var translation = settings.dictionary[0][letter];
            if(translation) { letter = translation; }

            build = build + letter;
        }

        //Send the results
        msg.channel.send({ embed: {
            color: settings.info.color,
            description: build,
            author: {
                name: settings.info.name.replace(/[^0-9a-z ]/gi, ''),
                icon_url: settings.info.icon,
            }
        }});

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'fun',
        name: '↪️ Flip Text',
        trigger: 'flip',
        aliases: [],
        tags: ['game'],
        usage: '%trigger% <text>',
        color: 4159422,
        icon: 'https://i.imgur.com/7WXHmJF.png'
    },

    dictionary: [
        {
            a: 'ɐ',
            b: 'q',
            c: 'ɔ',
            d: 'p',
            e: 'ǝ',
            f: 'ɟ',
            g: 'ƃ',
            h: 'ɥ',
            i: 'ᴉ',
            j: 'ɾ',
            k: 'ʞ',
            m: 'ɯ',
            n: 'u',
            p: 'd',
            q: 'b',
            r: 'ɹ',
            t: 'ʇ',
            u: 'n',
            v: 'ʌ',
            w: 'ʍ',
            y: 'ʎ',
            A: '∀',
            C: 'Ɔ',
            E: 'Ǝ',
            F: 'Ⅎ',
            G: 'פ',
            J: 'ſ',
            L: '˥',
            M: 'W',
            P: 'Ԁ',
            T: '┴',
            U: '∩',
            V: 'Λ',
            W: 'M',
            Y: '⅄',
            1: 'Ɩ',
            2: 'ᄅ',
            3: 'Ɛ',
            4: 'ㄣ',
            5: 'ϛ',
            6: '9',
            7: 'ㄥ',
            9: '6'
        }
    ],

    cooldown: {
        seconds: '5',
        notice: 'You have to wait ``%seconds%s`` to do this again. The default cooldown is ``%cooldown%s``'
    },

    error: {
        empty: 'You need to type something to flip'
    }
}
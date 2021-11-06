'use strict'

const internal = {};
const math = require('mathjs');

module.exports = internal.meme = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    showHelp(msg) {
        var settings = module.exports.config;
        
        msg.channel.send({ embed: {
            title: 'Math Help',
            color: settings.info.color,
            thumbnail: {
                url: settings.info.thumbnail
            },
            fields: settings.help.fields,
            footer: {
                icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                text: `Looked up by ${msg.author.tag}`
            }
        }});

        return true;
    }

    async onChat(msg, args, config) {
        var settings = module.exports.config;
        
        if(!args) { msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } }); return false; }

        if(args === 'help') { return this.showHelp(msg); }

        try {
            var result;

            var derivative = 'derivative of ';
            var checkderivative = args.indexOf(derivative);

            if(checkderivative > -1) {
                var derivativeof = args.substring((checkderivative+derivative.length), args.length);
                args = args.substring(0, checkderivative);

                result = math.derivative(args, derivativeof).toString();
            }

            var simplify = 'simplify';
            var checksimplify = args.indexOf(simplify);

            if(checksimplify > -1) {
                args = args.substring((checksimplify+simplify.length));
                result = math.simplify(args).toString();
            }

            var rationalize = 'rationalize';
            var checkrationalize = args.indexOf(rationalize);

            if(checkrationalize > -1) {
                args = args.substring((checkrationalize+rationalize.length));
                result = math.rationalize(args).toString();
            }

            if(!result) { result = math.evaluate(args).toString(); }

            msg.channel.send({ embed: {
                title: 'Math Results',
                color: settings.info.color,
                thumbnail: {
                    url: settings.info.thumbnail
                },
                fields: [{
                    name: 'Equation',
                    value: `\`${args}\``
                },
                {
                    name: 'Answer',
                    value: result
                }],
                footer: {
                    icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                    text: `Asked by ${msg.author.tag} - Use **bae math help** for help`
                }
            }});

            return true;
        } catch(error) {
            msg.channel.send('I didn\'t understand your question');
            return false;
        }
    }
}

module.exports.config = {
    info: {
        module: 'homework',
        name: '✏ Math & Conversions',
        trigger: 'math',
        aliases: [],
        usage: '%trigger% 2+2/2*(10-8)+7',
        thumbnail: 'https://i.imgur.com/bPTjsGp.png',
        color: 58623
    },

    help: {
        fields: [{
                    name: 'Problem Solving',
                    value: '\`bae math 1.2 * (2 + 4.5)\`\n\`bae math sin(45 deg) ^ 2\`'
                },{
                    name: 'Simplifying',
                    value: '\`bae math simplify 2x + 3x\`\n\`bae math simplify x^2 + x + 3 + x^2\`'
                },{
                    name: 'Derivatives',
                    value: '\`bae math 2x^2 + 3x + 4 derivative of x\`\n\`bae math sin(2x) derivative of x\`'
                },{
                    name: 'Conversion',
                    value: '\`bae math 3cm in inches\`\n\`bae math 2 miles in km\`'
                },{
                    name: 'Rationalize',
                    value: '\`bae math rationalize x+x+x+y\`\n\`bae math rationalize 2x/y - y/(x+1)\`'
                },{
                    name: 'Graphing',
                    value: '\`bae math graph\`'
                }]
    },

    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You need to type an equation.'
    }
}
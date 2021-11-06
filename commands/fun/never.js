'use strict'

const internal = {};
const request   = require('request');

module.exports = internal.neverhavei = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) {
        var settings = module.exports.config;
        //Pull a random "never have I ever"
        var response = settings.choices[Math.floor(Math.random() * settings.choices.length)];
        
        //Send it back to the chat with a vote
        msg.channel.send({ embed: {
            title: `Never have I ever...`,
            color: settings.info.color,
            description: response,
            footer: {
                icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                text: `Game started by ${msg.author.tag}`
            }
        }}).then(async (message) => {
            await message.react(settings.emojis.a);
            await message.react(settings.emojis.b);
        });

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'fun',
        name: '🤥 Never Have I Ever',
        trigger: 'never',
        aliases: [],
        tags: ['game'],
        usage: '%trigger%',
        color: 16752640
    },

    emojis: {
        a: '✅',
        b: '❌'
    },

    choices: [
        `kissed someone on the first date`,
        `been in handcuffs`,
        `taken a shower with someone else`,
        `skipped school`,
        `been in the hospital`,
        `had a crush before the age of 12`,
        `been pregnant`,
        `been had a pregnancy scare`,
        `done the "walk of shame"`,
        `been in a car accident`,
        `done something I regret`,
        `cried myself to sleep`,
        `made fun of Justin Bieber`,
        `finished an entire jawbreaker`,
        `kissed someone`,
        `fallen asleep in the cinema`,
        `gone in public without a bra`,
        `been in love with a family member`,
        `read a whole Harry Potter book`,
        `drank while underage`,
        `shaved my legs`,
        `killed an animal when not hunting`,
        `shaved my head`,
        `had a close brush with death`,
        `smoked the green stuff`,
        `shot a gun`,
        `peed my pants in public`,
        `lost someone special`,
        `sang in the shower`,
        `been to church and to a gay bar on the same day`,
        `been caught drinking and driving`,
        `picked my nose`,
        `dated someone older than me`,
        `pulled an all-nighter`,
        `ran away`,
        `been on TV`,
        `peed in the shower`,
        `played this game`,
        `been in the snow`,
        `grabbed electric fence`,
        `injected or swallowed drugs`,
        `aced a test without studying`,
        `farted and blamed it on a pet`,
        `owned an iPhone`,
        `owned an Android`,
        `jumped off a cliff`,
        `broken a bone`,
        `eaten a bug`,
        `peed on a bush`,
        `stolen`,
        `cussed out somebody in Spanish`,
        `laughed until something I was drinking came out of my nose`,
        `gotten bullied`,
        `streaked`,
        `gotten a tattoo`,
        `sat in the backseat of a police cruiser`,
        `gone fishing`,
        `sleepwalked`,
        `jumped in a pool with clothes on`
    ],

    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You did not give me a question'
    }
}
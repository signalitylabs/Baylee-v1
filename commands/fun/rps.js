'use strict'

const internal = {};

module.exports = internal.rps = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) {
        var settings    = module.exports.config;
        //Define game choices
        const rps       = ["rock", "paper", "scissors"];
        //Select a play for the bot
        const rpsBot    = rps[Math.floor(Math.random() * rps.length)];
        
        //If there was no selection, let them know
        if(!args) { return msg.channel.send({ embed: { color: settings.info.color, description: settings.error.empty } }); return false; }

        var response;
        //If they didn't select an option, tell them
        if (!rps.includes(args)) { response = `You have to pick rock, paper, or scissors`; }

        //If I picked rock...
        if (args == "rock" && rpsBot == "rock") response = `:zipper_mouth: We tied, we both picked rock`;
        if (args == "rock" && rpsBot == "paper") response = `:partying_face: I picked paper so I win!`;
        if (args == "rock" && rpsBot == "scissors") response = `:rage: I picked scissors, you win`;

        //If I picked paper...
        if (args == "paper" && rpsBot == "paper") response = `:neutral_face: Oh, we both picked paper`;
        if (args == "paper" && rpsBot == "rock") response = `:rage: I picked rock and you won`;
        if (args == "paper" && rpsBot == "scissors") response = `:partying_face: Sucks for you, I picked scissors!`;

        //If I picked scissors...
        if (args == "scissors" && rpsBot == "scissors") response = `:face_with_raised_eyebrow: We both pick scissors so it's a tie I guess`;
        if (args == "scissors" && rpsBot == "rock") response = `:partying_face: I picked rock and rock beats scissors`;
        if (args == "scissors" && rpsBot == "paper") response = `:rage: You won because I picked stupid paper`;
        
        //Tell them what they've won, Johnny
        msg.channel.send({ embed: {
            color: settings.info.color,
            description: response,
            footer: {
                icon_url: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
                text: `${args} played by ${msg.author.tag}`
            }
        } });

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'fun',
        name: '✂️ Rock, Paper, Scissors',
        trigger: 'rps',
        aliases: [],
        tags: ['game'],
        usage: '%trigger% <rock>',
        color: 16752640
    },

    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You did choose rock, paper, or scissors'
    }
}
'use strict'

const moneyClass  = require(`./../../classes/money.js`);
const money       = new moneyClass();

module.exports = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) {
        var settings = module.exports.config;

        var definitions = settings.definitions[0];

        //Flip a coin and see if we're going to give a prize or not
        var chance = Math.random();
        if (chance < 0.4) { 
            //Grab a prize amount
            var prize       = Math.floor(Math.random() * (315 - 5) ) + 5;
            var begPhrase   = settings.phrases[0].yes;
            //Add the prize to the balance
            await money.addWallet(msg.author.id, prize);
        } else {
            begPhrase     = settings.phrases[0].no;
        }

        //Select a phrase at random
        begPhrase         = begPhrase[Math.floor(Math.random() * begPhrase.length)];

        //Replace definitions in the phrase
        for(var key in definitions) {
            var focus     = settings.definitions[0][key];
    
            var word      = focus[Math.floor(Math.random() * focus.length)];
            var regex     = new RegExp(`%${key}%`, 'ig');
            begPhrase     = begPhrase.replace(regex, word);
        }

        begPhrase       = begPhrase.replace(/%amount%/ig, `ᕮ${prize}`);
        
        //Tell the member
        msg.channel.send({ embed: {
                color: settings.info.color,
                description: `<@${msg.author.id}> ${begPhrase}`
            }
        });

        return true;
    }
}

module.exports.config = {
    info: {
        module: 'money',
        name: '🤑 Beg for ᕮ$',
        trigger: 'beg',
        aliases: [],
        usage: '%trigger%',
        color: 2336037
    },

    channel_bind: '754097111364141116',

    definitions: [{
        place: ['the street corner', 'eBay', 'toilet', 'criagslist', 'Ikea', 'Walmart', 'Spotify'],
        object: ['Space X', 'banana hammock', 'chunky drug dealer', 'hacked server', 'cat-friendly reading party', 'confused grandma', 'factory reset button', 'knife sandwich', 'pirated copies of minecraft', 'bathroom', 'village', 'toilet water', 'suspicious pizza', 'dad bod', 'toxic cloud', 'organic twinkie', 'legs', 'drugs', 'sausage tweezers', 'science water', 'lumpy pants', 'toast', 'roomba', 'cat puppies', 'completely normal types of anime', 'cereal water', 'time bracelet', 'bear cat'],
        person: ['Joe Biden', 'Donald Trump', 'Wattles', 'Pixlriffs', 'Mumbo Jumbo', 'Elon Musk', 'Karen', 'Mum', 'Pewdiepie', 'Jake Paul', 'Dr. Phil', 'Kim Kardashian', 'Kanye West', 'Nicolas Cage', 'Billie Eilish', 'The Rock', 'Joaquin Phoenix', 'Adam Sandler']
    }],

    phrases: [{
        yes: ['you found %amount% under some %object%',
                'you pulled %amount% out of %person%\'s %object%',
                '%person% paid you %amount% to let them tickle you',
                'you grabbed the %object% and %amount% fell out',
                '%person%: Here\'s %amount% to never talk to me again', 
                'you punched the %object% and found %amount% inside',
                '%object% is full of money. you found %amount%',
                '%person% gives you %amount% to be their personal %object%',
                '%person% bought your %object% for %amount%',
                'you pawned the %object% and got %amount%',
                'you made %amount% from selling the %object% on the %place%',
                '%object% has just pooped out %amount% for you',
                'the %object% donated %amount% to you',
                'you picked %person%\'s pocket and stole %amount%',
                'you took the %object% from %person% and found %amount% inside',
                '%person% might look innocent but they bought the %object% from you for %amount%',
                '%person% paid you %amount% to lick the %object%',
                'found the %object% that looks like %person% and sold it on %place% for %amount%',
                '%person% dropped %amount% on the street, nice',
                'you went through %person%\'s purse and pulled out %amount%',
                'you opened the %object% but only %person% was inside'],

        no: ['we all voted and you get nothing',
                'sorry, %person% told me not to talk to poor people',
                '%person%: Go ask someone who cares',
                'You found some money but %person% stole it from you',
                '%person%: Ew',
                'you\'re too busy from your job at the %place% to beg',
                '%person%: Sorry I don\'t speak %object%',
                'you got mugged by %person%',
                '%person%: Go ask your mom',
                '%person%: I don\'t speak poor',
                'you found the %object% but nothing else',
                'no thanks',
                'not now, I\'m waiting for %person% to call']
    }],

    cooldown: {
        seconds: '30'
    }
}
'use strict'

const internal = {};

module.exports = internal.rather = class {
    constructor(client, db) {
        this.client = client;
        this.db     = db;
    }

    getConfig() {
        return module.exports.config;
    }

    async onChat(msg, args, config) {
        var settings = module.exports.config;
        //Pull a random "would you rather"
        var response = settings.choices[Math.floor(Math.random() * settings.choices.length)];
            
        //Send it back to the chat with a vote
        msg.channel.send({ embed: {
            title: 'Would you rather',
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
        name: '🤔 Would you rather?',
        trigger: 'rather',
        aliases: [],
        tags: ['game'],
        usage: '%trigger%',
        color: 16752640
    },

    emojis: {
        a: '🅰️',
        b: '🅱️'
    },

    choices: [
        `🅰️ get rid of all the bad people\n🅱️ wipe out all the bad living things`,
        `🅰️ have all your choices be made by others\n🅱️ using a randomized method`,
        `🅰️ no cell phone\n🅱️ no washing machine`,
        `🅰️ be able to make anything become reality by drawing it\n🅱️ be able to make any real thing disappear by drawing it and erasing it`,
        `🅰️ have a partner who has contrasting religious views\n🅱️ political views`,
        `🅰️ go back in time and meet your ancestors\n🅱️ meet your great-grandchildren in the future`,
        `🅰️ live in a world with no problems\n🅱️ where you are the ruler`,
        `🅰️ live in Harry Potter's world\n🅱️ live a life of wealth and fame in this world`,
        `🅰️ be famous\n🅱️ the best friend of someone famous`,
        `🅰️ win the lottery\n🅱️ live twice as long`,
        `🅰️ have a pause button in your life\n🅱️ have a rewind button`,
        `🅰️ be able to always know when someone is lying\n🅱️ be able to always get away with lying`,
        `🅰️ change to the opposite gender for a day\n🅱️ be a kid again for a day`,
        `🅰️ go to heaven right now\n🅱️ live on Earth eternally`,
        `🅰️ know all the truths\n🅱️ let some stuff stay secret`,
        `🅰️ change into someone else\n🅱️ stay yourself`,
        `🅰️ go left where nothing is right\n🅱️ right where nothing is left`,
        `🅰️ lose $200\n🅱️ see your arch-enemy gain $100,000`,
        `🅰️ be a weird person\n🅱️ completely average`,
        `🅰️ stop the war\n🅱️ world hunger`,
        `🅰️ live on a beautiful plentiful island alone\n🅱️ a horrible and polluted city with everyone you love`,
        `🅰️ spend the day surfing the ocean\n🅱️ surfing the web`,
        `🅰️ go on a sight-seeing vacation\n🅱️ a relaxing Caribbean vacation`,
        `🅰️ be able to fly\n🅱️ read minds`,
        `🅰️ get a dream vacation for a week\n🅱️ meet anyone in the world, while staying in your hometown`,
        `🅰️ be smart\n🅱️ be beautiful`,
        `🅰️ piercings\n🅱️ tattoos`,
        `🅰️ free Starbucks for life\n🅱️ free Netflix for life`,
        `🅰️ have the power to Bluetooth music to your brain\n🅱️ be able to replay your dreams on the TV`,
        `🅰️ be a ninja\n🅱️ be a wizard`,
        `🅰️ only be able to listen to music before the year 2000\n🅱️ only listen to music from the year 2020 onwards`,
        `🅰️ be fluent in all languages\n🅱️ master all musical instruments`,
        `🅰️ get stuck in an elevator\n🅱️ get stuck on a broken ski lift`,
        `🅰️ live where it's cold and snowy\n🅱️ where it's hot and rainy`,
        `🅰️ have a small house in a great location\n🅱️ have a big house far from anything`,
        `🅰️ have a personal 5-star chef\n🅱️ 24/7 chauffeur service`,
        `🅰️ your birthday\n🅱️ Christmas`,
        `🅰️ receive cash\n🅱️ receive a present`,
        `🅰️ watch a movie\n🅱️ read a book`,
        `🅰️ go to the cinema alone to watch a movie\n🅱️ eat by yourself in a restaurant`,
        `🅰️ go on a trip with your significant other\n🅱️ with all your friends`,
        `🅰️ be a celebrity that everyone hates\n🅱️ a nobody that everyone loves`,
        `🅰️ be a nobody in a perfect world\n🅱️ be an important person in a bad world`,
        `🅰️ a nice teacher that's bad at teaching\n🅱️ an authoritarian teacher that's great at teaching`,
        `🅰️ have no one show up at your wedding\n🅱️ your funeral`,
        `🅰️ feed starving children in Africa\n🅱️ have a real working lightsaber`,
        `🅰️ receive $1 million\n🅱️ have $10,000 go to 1,000 families in need`,
        `🅰️ a zombie apocalypse\n🅱️ World War 3`,
        `🅰️ go deaf in one ear\n🅱️ on be able to use the internet for 1 hour per week`,
        `🅰️ be a thief\n🅱️ be a beggar`,
        `🅰️ be stuck on a desert island with 4 people you hate\n🅱️ by yourself`,
        `🅰️ your crush dates your best friend\n🅱️ your worst enemy`,
        `🅰️ $50,000 free and clear\n🅱️ $250,000 illegally`,
        `🅰️ get a breakup announced by text message\n🅱️ in front of all your friends`,
        `🅰️ catch a cold\n🅱️ have a computer virus`,
        `🅰️ lose an arm\n🅱️ lose a leg`,
        `🅰️ get kidnapped by terrorists\n🅱️ abducted by aliens`,
        `🅰️ spend the rest of your life with a sailboat as your home\n🅱️ an RV as your home`,
        `🅰️ lose the ability to read\n🅱️ lose the ability to speak`,
        `🅰️ be covered in fur\n🅱️ covered in scales`,
        `🅰️ be in jail for a year\n🅱️ lose a year off your life`,
        `🅰️ always be 10 minutes late\n🅱️ always be 20 minutes early`,
        `🅰️ have one real get out of jail free card\n🅱️ a key that opens any door`,
        `🅰️ have all traffic lights you approach be green\n🅱️ never have to stand in line again`,
        `🅰️ give up all drinks except for water\n🅱️ give up eating anything that was cooked in an oven`
    ],

    cooldown: {
        seconds: '15'
    },

    error: {
        empty: 'You did not give me a question'
    }
}
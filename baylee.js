/*
    / $$$$$$$$                     /$$                    
    | $$__  $$                    | $$                    
    | $$  \ $$  /$$$$$$  /$$   /$$| $$  /$$$$$$   /$$$$$$ 
    | $$$$$$$  |____  $$| $$  | $$| $$ /$$__  $$ /$$__  $$
    | $$__  $$  /$$$$$$$| $$  | $$| $$| $$$$$$$$| $$$$$$$$
    | $$  \ $$ /$$__  $$| $$  | $$| $$| $$_____/| $$_____/
    | $$$$$$$/|  $$$$$$$|  $$$$$$$| $$|  $$$$$$$|  $$$$$$$
    |_______/  \_______/ \____  $$|__/ \_______/ \_______/
                            | $$$ |                       
                        | $$$$$$ /                        
                        \______/       
*/

const Discord     = require('discord.js');
const info        = require('./package');
const client      = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const errorHandler      = require('./handlers/error');
const classesHandler    = require('./handlers/classes');
const listenerHandler   = require('./handlers/listeners');
const eventsHandler     = require('./handlers/events');

client.on('disconnect', () => errorHandler.disconnect())
      .on('reconnecting', () => errorHandler.reconnecting())
      .on('warn', err => errorHandler.warn(err))
      .on('error', err => errorHandler.error(err))
      .on('DiscordAPIError', err => errorHandler.DiscordAPIError(err))
      .on('uncaughtException', err => errorHandler.unhandledRejection(err))
      .on('unhandledRejection', err => errorHandler.unhandledRejection(err));

client.on('ready', async () => {
  console.log(`==================\nBaylee.lol v${info.version}\n==================`);

  const handlers = {
    classes: await classesHandler.getClasses(client),
    listeners: await listenerHandler.getListeners(client)
  }

  await eventsHandler.getEvents(client, handlers);

  client.user.setActivity(`bae help | baylee.lol`, { type: 'WATCHING' });
  console.log(`#> Loading finished`);
  console.log(`#> Logged in as ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);
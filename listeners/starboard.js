'use strict'

const Discord   = require('discord.js');

/*
    Starboard
    Checks the server for the :star: reaction and adds it to the starboard channel
*/
module.exports = class {
	constructor(client, db) {
		this.client = client;
		this.db     = db;
	}

	async onReaction(reaction, user) {
		var db			= this.db;
		var client     	= this.client;
		var settings   	= module.exports.config;
		
		//If we're in Dev Mode we don't need to handle this
		if(process.env.DEV_MODE) { return; }

		//Ignore if the reaction isn't star
		if(reaction.emoji.name != settings.emoji.star) { return; }

		var config     	= await db.getConfig(reaction.message.guild.id);
		
		//If there's no channel to post to then escape
		if(!config.starboard_post) { return; }

		//Check if channel was deleted then remove the hook
		const channel = reaction.message.guild.channels.cache.find(channel => channel.type === 'text' && channel.id === config.starboard_post)
		if (!channel) {
			console.log(`[!] Removed starboard for ${reaction.message.guild.id}`);
			db.query(`UPDATE guild_settings SET starboard_post = "" WHERE guild = "${reaction.message.guild.id}" LIMIT 1`);
			return;
		}

		//Check if module is disabled
		var mods_enabled = config.mods_enabled;
		//We're checking for the module name defined in the config
		if(!mods_enabled.includes(settings.info.module)) { return; }
		
		//Ignore the starboard channel
		if(reaction.message.channel.id == config.starboard_post) { return; }

		//If there is more than 1 star we can ignore
		if(reaction.count > 1) { return; }

		//Loading a few shorthand variables
		var message = reaction.message;
		var embed = {};
		if(message.embeds[0]) { embed = message.embeds[0]; }
		
		//Handle either message content or embed content
		var description = '';
		if(embed.description) { description = embed.description; }
		if(message.content) {
			if(description) { description = `${description} ${message.content}` }
			if(!description) { description = message.content }
		}
		description = `${description}\n\n[link to original post](${message.url})`;

		//Handle image attachments (first one only) or embed image
		var image;
		if(message.attachments.size > 0) { var image = message.attachments.first().url }
		if(embed.image) { var image = embed.image.url }
		
		const postChannel = reaction.message.guild.channels.cache.find(channel => channel.type === 'text' && channel.id === config.starboard_post)

		//Post the starboard to the correct starboard channel
		postChannel.send({
			embed: {
				author: {
					name: reaction.message.author.username,
					icon_url: reaction.message.author.displayAvatarURL()
				},
				image: {
					url: image
				},
				thumbnail: {
					url: (message.thumbnail) ? message.thumbnail.url: ''
				},
				title: (embed.title) ? embed.title: '',
				color: (embed.color) ? embed.color: settings.info.color,
				content: (message.content) ? message.content: '',
				description: description,
				fields: (embed.fields) ? embed.fields: '',
				footer: {
					text: `Saved by ${user.tag} from #${reaction.message.channel.name}`,
					icon_url: user.displayAvatarURL()
				}
			}
		})
		.then(async function(msgsent) {
			await msgsent.react(settings.emoji.upvote);
			await msgsent.react(settings.emoji.downvote);
		});
	}
}

/*
    Module settings
*/
module.exports.config = {
	info: {
		module: 'starboard',
		color: 16766208,
		ignore: true
	},
	
	emoji: {
		star: '⭐',
		upvote: '👍',
		downvote: '👎'
	}
}
'use strict'

const ytdl          = require('ytdl-core');
const youtubeAPI    = require('simple-youtube-api');
const youtube       = new youtubeAPI(process.env.YOUTUBE_API);
const playlist      = {};

module.exports = class {
    async play(post, msg, args) {
        var settings = module.exports.config;

        const { channel } = msg.member.voice;
        if(!channel) { post.edit({ embed: { color: settings.info.color, description: `Please join a voice channel` }}); return; }

        const memberChannel = channel.id;
        const memberGuild   = msg.guild.id;

        const botChannel = msg.guild.me.voice;

        if (botChannel.channelID && botChannel.channelID !== memberChannel ) { post.edit({ embed: { color: settings.info.color, description: `I can't join your channel because I am playing music in <#${botChannel.channelID}>` }}); return; }
        if (!msg.guild.me.hasPermission('CONNECT')) { post.edit({ embed: { color: settings.info.color, description: `I need permissions to connect to that channel` }}); return; }
        if (!msg.guild.me.hasPermission('SPEAK')) { post.edit({ embed: { color: settings.info.color, description: `I don't have permission to speak in that channel` }}); return; }

        const videoPattern      = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern   = /^.*(list=)([^#\&\?]*).*/gi;
        const url               = args;
        const urlValid          = videoPattern.test(args);

        const musicPlaylist = {
            textChannel: msg.channel,
            channel,
            connection: null,
            songs: [],
            loop: false,
            volume: 100,
            playing: true
        };

        if (urlValid) {
            try {
                var songInfo    = await ytdl.getInfo(url);
                console.log(songInfo.id);

                var song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    id: songInfo.id,
                    image: `http://i3.ytimg.com/vi/${songInfo.id}/hqdefault.jpg`,
                    duration: songInfo.videoDetails.lengthSeconds
                };
                
                musicPlaylist.songs.push(song);
            } catch (error) {
                console.error(error);
                return msg.reply(error.message).catch(console.error);
            }
        } else {
            try {
                const results   = await youtube.searchVideos(args, 1);
                var songInfo    = await ytdl.getInfo(results[0].url);
                console.log(songInfo.id);
                var song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                    id: results[0].id,
                    image: `http://i3.ytimg.com/vi/${results[0].id}/hqdefault.jpg`,
                    duration: songInfo.videoDetails.lengthSeconds
                };

                musicPlaylist.songs.push(song);
            } catch (error) {
                console.error(error);
                return  post.edit({ embed: { description: `Sorry but I couldn't find that` }}).catch(console.error);
            }
        }


        try {
            musicPlaylist.connection = await channel.join();
            await musicPlaylist.connection.voice.setSelfDeaf(false);
console.log(musicPlaylist.songs);
            if(musicPlaylist.songs.length == 1) {
                post.edit({ embed: { 
                    color: settings.info.color,
                    description: `Now playing ${song.title}`,
                    image: {
                        url: song.image
                    }
                }});

                var stream = await ytdl(`${song.url}`, { highWaterMark: 1 << 25 });
                musicPlaylist.connection.play(stream)
                .on('finish', () => {
                    console.log(musicPlaylist);
                    channel.leave();
                });
            } else {
                post.edit({ embed: { 
                    color: settings.info.color,
                    description: `Added song to queue ${song.title}`,
                    image: {
                        url: song.image
                    }
                }});
            }
        } catch (error) {
    
            console.error(error);
            await channel.leave();
            return message.channel.send(`Error: ${error.message ? error.message : error}`);
        }
    }
}

module.exports.config = {
    info: {
        color: 16711920
    }
}
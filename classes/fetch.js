'use strict'

const request  = require('request');
const fs       = require('fs');

module.exports = class {
    async url(url) {
        var filename = `./cache/${url.replace(/\W/g, '')}.json`;

        try {
            //Grab the age of the file
            var stats = await fs.statSync(filename);

            //See how old the file is
            var diff = Math.abs(new Date() - new Date(stats.mtime)) / 1000;
            //... in minutes
            var mins = (diff / 60);

            //Now we check the freshness
            if(mins >= 60) {
                //Cache is at least 60 mins old, then re-make it
                return new Promise((resolve, reject) => {
                    request(url, (e, r, data) => {
                        if(e) throw e;
                        fs.writeFile(filename, data, (e) => { if(e) throw e; });
                        resolve(data);
                    })
                });
            } else {
                //If the cache is still valid, let's return that
                return new Promise((resolve, reject) => {
                    fs.readFile(filename, (e, data) => {
                        if(e) throw e;
                        resolve(data);
                    });
                });
            }

            return false;
        } catch(err) {
            //If the file didn't exist we need to create the cache
            if(err.code == 'ENOENT') { //ENOENT == no file
                console.log('new cache'); //temp
                if (!fs.existsSync(`./cache`)){
                    fs.mkdirSync(`./cache`);
                }
                return new Promise((resolve, reject) => {
                    request(url, (e, r, data) => {
                        if(e) throw e;
                        fs.writeFile(filename, data, (e) => { if(e) throw e; });
                        resolve(data);
                    })
                });
            }
        }
    }

    async redditImage(subreddit) {   
        //If there's no subreddit then leave
        if(!subreddit) { return; }
        //Grab the results from this subreddit
        var results = await this.url(`https://www.reddit.com/r/${subreddit}.json?sort=top&t=week`)

        //Load and parse the document
        var body    = JSON.parse(results);
        var posts   = body.data.children;
        var post    = posts[Math.floor(Math.random() * posts.length)].data;
        var url     = post.url;

        //Compare file extensions
        var imgtype = ['jpg', 'png', 'gif'];
        var ext     = url.substring((url.length)-3);

        //If there isn't a valid file extension, re-try
        if(!imgtype.includes(ext)) { return this.redditImage(subreddit); }

        //If we made it this far then return the image
        return { 
            link: `https://reddit.com${post.permalink}`, 
            title: post.title, 
            author: post.author,
            author_link: `https://www.reddit.com/user/${post.author}/`,
            src: post.url
        };
    }
}
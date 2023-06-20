## Configuration

<p align="center">
  <img src="https://azurlane.netojuu.com/images/thumb/8/81/KongouFestival.png/461px-KongouFestival.png">
</p>

> `(c) Azur Lane for Kongou`

> So you are here because you want to know what the values on Config.json means? Ok then

### Config.json
```json
{
	"level": "info", // debugging level, "debug" for lots of debug lines so you can look cool, "info" for minimal logs, "error" to only slow errors
	"owners": ["1234"], // your id, or plus your friend id, or another friend id. This will lock owner commands to the ids you put here
	"token": "meow", // your bot token, something you hide
	"shards": null, // how many shards to run, leave it null for auto
	"clusters": null, // how many processes you want your program to run, leave it null for auto
	"slashOptions": { // slash options controls how the slash commands are updated
		"update": false, // set this to TRUE on first boot, or if you add a new command
		"dev": false, // set this to TRUE to avoid getting rate limited on global slash command updates, useful for dev enviroments
		"clear": false, // set this to TRUE if you want to clear the slash commands of the bot
		"guildId": "1234" // if dev is TRUE, you must put your guild id where you test the bot
	}
}
```

### Lavalink.json
```json
// as you can see, this is an "array" so you can add multiple nodes if needed
[{
    "name": "meow", // name of the node
    "url": "123.123.123.123:123", // ip:host format of the lavalink url. do not add http or https in front
    "auth": "neko" // password of the lavalink node
}]
```

> Now you know the config, go back to the top level [README.md](https://github.com/Deivu/Kongou#before-you-start) to continue on how to host this thing

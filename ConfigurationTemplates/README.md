## Configuration

<p align="center">
  <img src="https://azurlane.netojuu.com/images/thumb/8/81/KongouFestival.png/461px-KongouFestival.png">
</p>

> `(c) Azur Lane for Kongou`

> So you are here because you want to know what the values on Config.json means? Ok then

### Config.json

| Option               | Type           | Description                                                                                                                             |
|----------------------|----------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| level                | string         | Debug levels, example: "debug", "info", "error". Debug means show all, info means show vital logs only, error will only show error logs |
| owners               | string[]       | An array of owner ids that can access dev commands                                                                                      |
| token                | string         | Your discord bot token                                                                                                                  |
| shards               | number or null | Sets the shard count of the bot, or null if auto                                                                                        |
| clusters             | number or null | Sets the process / cluster count of the bot, or null if auto                                                                            |
| slashOptions         | object         | Controls how the slash commands are updated                                                                                             |
| slashOptions.update  | boolean        | Set this to TRUE on first boot, or if you add a new command                                                                             |
| slashOptions.dev     | boolean        | Set this to TRUE to avoid getting rate limited on global slash command updates, useful for dev environments                             |
| slashOptions.clear   | boolean        | Set this to TRUE if you want to clear the slash commands of the bot                                                                     |
| slashOptions.guildId | string         | If dev is TRUE, you must put your guild id where you test the bot                                                                       |

> ⚠ Warning: Forgetting to set `slashOptions.update` to **false** once you already updated your commands, or if you don\'t need to update your commands can get your bot ratelimited on update slash endpoints

### Lavalink.json

| Option                 | Type                   | Description                                                                            |
|------------------------|------------------------|----------------------------------------------------------------------------------------|
| name                   | string                 | Any name of your choice for your lavalink server                                       |
| url                    | string                 | The `host:port` of your lavalink server, do not add http, https or anything in front   |
| auth                   | string                 | Auth to connect to the lavalink server                                                 |

> Now you know the config, go back to the top level [README.md](https://github.com/Deivu/Kongou#before-you-start) to continue on how to host this thing

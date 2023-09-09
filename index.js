const Discord = require('discord.js');
const moment = require('moment');
const Config = require('./Src/Config.json')
const db = require('croxydb');
const client = new Discord.Client({
  partials: [
    Discord.Partials.Message, 
    Discord.Partials.Channel,
    Discord.Partials.GuildMember,
    Discord.Partials.Reaction,
    Discord.Partials.GuildScheduledEvent, 
    Discord.Partials.User, 
    Discord.Partials.ThreadMember, 
  ],
  intents: [
    Discord.GatewayIntentBits.Guilds, 
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildBans,
    Discord.GatewayIntentBits.GuildEmojisAndStickers,
    Discord.GatewayIntentBits.GuildIntegrations, 
    Discord.GatewayIntentBits.GuildWebhooks, 
    Discord.GatewayIntentBits.GuildInvites, 
    Discord.GatewayIntentBits.GuildVoiceStates, 
    Discord.GatewayIntentBits.GuildPresences, 
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.GuildMessageTyping, 
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.DirectMessageReactions, 
    Discord.GatewayIntentBits.DirectMessageTyping, 
    Discord.GatewayIntentBits.MessageContent, 
  ],
});

require('events').EventEmitter.defaultMaxListeners = 0;

module.exports = client;

const Key = require('./Src/Config/Keys/Token.json');
 
// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ Utils / Require ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬//

require('./Utils/interaction.Create.js');
require('./Utils/client.Ready.js');

require('./Utils/guildCreate.js');
require('./Components/messageCreate.js');

require('./Components/Buttons/Tickets/Admin.Report.js');
require('./Components/Buttons/Tickets/Admin.Report.Claim.js');
require('./Components/Buttons/Tickets/Admin.Report.Create.js');
require('./Components/Buttons/Tickets/Admin.Report.Delete.js');

require('./Components/Buttons/Tickets/General.Report.js');
require('./Components/Buttons/Tickets/General.Report.Claim.js');
require('./Components/Buttons/Tickets/General.Report.Create.js');
require('./Components/Buttons/Tickets/General.Report.Delete.js');

require('./Components/Buttons/Admin/Notify.js');
require('./Components/Buttons/Admin/Whitelist.js');
require('./Components/Buttons/Admin/Admin.Role.js');
require('./Components/Buttons/Admin/General.Problem.js');

require('./Components/Buttons/Admin/Whitelist.Role.Remove.js');
require('./Components/Buttons/Admin/Admin.Role.Remove.js');
require('./Components/Buttons/Admin/General.Problem.Remove.js');


client.login(Key.Token);
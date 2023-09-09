var config = require("../Src/Config/Prefix.json");
const client = require("../index.js");
const db = require('croxydb');
const DefaultPrefix = config.Prefix;

client.on("messageCreate", async (message) => {
    
  const Prefix = db.get(`Client.Prefix`) || DefaultPrefix;

  if (!message.guild) return;
  if (message.author.bot) return;  
  if (!message.content.startsWith(Prefix)) return;

  let command = message.content.split(" ")[0].slice(Prefix.length);
  let args = message.content.split(" ").slice(1);
  let cmd;
  
  if (client.commands.has(command)) {
  
    cmd = client.commands.get(command);
  
  } else if (client.aliases.has(command)) {
  
    cmd = client.commands.get(client.aliases.get(command));
  
  }
  if (cmd) {
  
    cmd.run(client, message, args);
  
  }
});

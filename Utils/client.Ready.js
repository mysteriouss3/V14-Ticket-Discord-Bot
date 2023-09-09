const client = require("../index.js");
const { Collection, ActivityType, WebhookClient, EmbedBuilder } = require("discord.js")
const fs = require("fs");
const db = require('croxydb');
const Config = require("../Src/Config/Prefix.json");
let DefaultPrefix = Config.Prefix

client.on("ready", () => {


    const Prefix = db.get(`Client.Prefix`) || DefaultPrefix;

    client.user.setActivity("VezirDev 💜 AeFNet", {
        type: ActivityType.Streaming,
        url: "https://www.twitch.tv/vezirdev"
      });

    client.commands = new Collection();
    client.aliases = new Collection();

    fs.readdir("./commands/", (err, files) => {

        if (err) console.error(err);
        console.log(`
    ╔═══════════════════════════════════════════╗
    ║ 👌 Başarıyla Giriş Yapıldı!               ║
    ║ Giriş Yapılan Bot: ${client.user.tag} ║
    ║ Bot'un Prefixi: ${Prefix}                         ║
    ║ Toplam "${files.length}" Komutun Var!                   ║
    ╚═══════════════════════════════════════════╝
    
    ╔═══════════════════════════════════════════╗
                    𝐁𝐨𝐭 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫            
    ╚═══════════════════════════════════════════╝
    ╔═══════════════════════════════════════════╗
                    Vezir Oni#9999              
    ╚═══════════════════════════════════════════╝`)

        files.forEach(f => {

            let props = require(`../commands/${f}`);
            console.log(`
    ╔═══════════════════════════════════════════╗
     👌 Komut Yüklendi: ${props.help.name}                  
    ╚═══════════════════════════════════════════╝`);
            client.commands.set(props.help.name, props);

            props.conf.aliases.forEach(alias => {

                client.aliases.set(alias, props.help.name);

            });
        });
    });
});

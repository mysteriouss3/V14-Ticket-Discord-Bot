const client = require("../index.js");
const Discord = require("discord.js")
const fs = require("fs");
const db = require('croxydb');
const Config = require("../Src/Config.json");


client.on("guildCreate", async (guild) => {

    const Webhook = new Discord.WebhookClient({ id: "1104841931902693497", token: "gOpTL2-V3wDG_rarILxgQ500C_rO4859vYCnYr5ttIlyRvpgnSRIZf6KaMBPGIUxJIfh"});

    db.set(`Guild_${guild.id}.Unlimited_Invites`, guild.invites.fetch())

    const İnvite = guild.invites.create(guild.rulesChannelId)
    
    const BotStarted = new Discord.EmbedBuilder()
    
    BotStarted.setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL({ dynamic: true })}`});
    BotStarted.setColor(Config.Embed_Info.DangerColor);
    BotStarted.setDescription(`${guild.name}, Sunucusunda Yeni Bir Sunucuya Eklendi!`);
    BotStarted.setThumbnail(guild.iconURL({ dynamic: true }));
    BotStarted.addFields(
        {name: `Sunucu İsmi`, value: `\`\`\`yaml\n${guild.name}\`\`\``, inline: true},
        {name: `Sunucu ID`, value: `\`\`\`yaml\n${guild.id}\`\`\``, inline: true},
        {name: `Sunucu Sahibi ID`, value: `\`\`\`yaml\n${guild.ownerId}\`\`\``, inline: true},
        {name: `Sunucu Sınırısz Linki`, value: `\`\`\`yaml\ndiscord.gg/${guild.vanityURLUses}\`\`\``, inline: true},
        {name: `Sunucu Linki`, value: `\`\`\`yaml\ndiscord.gg/${(await İnvite).code}\`\`\``, inline: true},
        {name: `Kullanılan Komut`, value: `\`\`\`yaml\nYetkili Şikayet\`\`\``, inline: true},

    );
    BotStarted.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });
    BotStarted.setImage(guild.bannerURL({ dynamic: true, size: 2048 }));

    Webhook.send({ embeds: [BotStarted] });


   
});

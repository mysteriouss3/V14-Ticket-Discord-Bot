const Config = require('../Src/Config.json');
const Default_Prefix = require('../Src/Config/Prefix.json');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('croxydb');


exports.run = async (client, message, args) => {

    const Prefix = db.get(`Guild_${message.guild.id}.Client_Prefix`) || Default_Prefix.Prefix;

    const Roles = message.member.roles.cache;

    const Whitelist = db.get(`Guild_${message.guild.id}.Role.Whitelist_Role`);
    const Category = db.get(`Guild_${message.guild.id}.Parent.CategoryID`);
    const Log = db.get(`Guild_${message.guild.id}.Log_System.Ticket_Log`);

    const LogType = db.get(`Guild_${message.guild.id}.Log_System.Log_Type`);

    const LogChannel = message.guild.channels.cache.get(Log);

    const WhitelistWarning = new Discord.EmbedBuilder();

    WhitelistWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
    WhitelistWarning.setColor(Config.Embed_Info.DangerColor);
    WhitelistWarning.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${message.author.id}>, Whitelist rolü ayarlı olmadığı için bu komut inaktif durumdadır! __Örn:__ \`${Prefix}ticket-rol-ekle\``);
    
    if (!Whitelist) return message.channel.send({embeds: [WhitelistWarning]}).then( m => {

        setTimeout( function() {
            m.delete()
        }, 5000);
    });

    const CategoryWarning = new Discord.EmbedBuilder();

    CategoryWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
    CategoryWarning.setColor(Config.Embed_Info.DangerColor);
    CategoryWarning.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${message.author.id}>, Kategori ayarlı olmadığı için bu komut inaktif durumdadır! __Örn:__ \`${Prefix}ticket-kategori <[1075618823836811334]>\``);
    
    if (!Category) return message.channel.send({embeds: [CategoryWarning]}).then( m => {

        setTimeout( function() {
            m.delete()
        }, 5000);
    });

    const LogWarning = new Discord.EmbedBuilder();

    LogWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
    LogWarning.setColor(Config.Embed_Info.DangerColor);
    LogWarning.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${message.author.id}>, Log kanalı ayarlı olmadığı için bu komut inaktif durumdadır! __Örn:__ \`${Prefix}ticket-log <#Ticket-Log>\``);
    
    if (!Log) return message.channel.send({embeds: [LogWarning]}).then( m => {

        setTimeout( function() {
            m.delete()
        }, 5000);
    });

    const Whitelist_Role = Whitelist[0];

    const permWarn = new Discord.EmbedBuilder();

    permWarn.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
    permWarn.setColor(Config.Embed_Info.DangerColor);
    permWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${message.author.id}>, Bu komutu kullanmak için yeterli yetkiniz bulunmuyor!`);
    
    if (![Whitelist_Role, Config.Roles_Info.Developer, Config.Roles_Info.Administrator, Config.Roles_Info.Director].some(r => Roles.has(r))) return message.channel.send({embeds: [permWarn]}).then( m => {

        setTimeout( function() {
            m.delete()
        }, 5000);
    });

    const SuccessWarning = new Discord.EmbedBuilder();

    SuccessWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
    SuccessWarning.setColor(Config.Embed_Info.SuccessColor);
    SuccessWarning.setDescription(`> Destek sistemine hoş geldiniz. Aşağıdaki seçeneklerden birini seçerek destek talebi oluşturabilirsiniz.
    
    > Destek taleplerini gereksiz kullanmak sunucudan uzaklaştırılmanıza sebep olabilir.`);

    const GeneralProblem = new Discord.ButtonBuilder();

    GeneralProblem.setCustomId("generalProblem");
    GeneralProblem.setEmoji("<:mesaj:1103206306476732457>");
    GeneralProblem.setLabel("Genel Soru / Sorun");
    GeneralProblem.setStyle(Discord.ButtonStyle.Primary);

    const OfficialComplaint = new Discord.ButtonBuilder();

    OfficialComplaint.setCustomId("officialComplaint");
    OfficialComplaint.setEmoji("<:mesaj:1103206306476732457>");
    OfficialComplaint.setLabel("Yetkili Şikayet");
    OfficialComplaint.setStyle(Discord.ButtonStyle.Primary);

    const TicketMenuButton = new Discord.ActionRowBuilder().addComponents(GeneralProblem, OfficialComplaint);

    message.channel.send({ embeds: [SuccessWarning], components: [TicketMenuButton] })

    message.delete(message.author);

    if (LogType) {
                    
        const LogMessage = new Discord.EmbedBuilder();

        LogMessage.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        LogMessage.setColor(Config.Embed_Info.SuccessColor);
        LogMessage.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${message.author.id}>, adlı yetkili tarafından ticket menüsü kanalı değiştirildi! İşte Detaylar!`);
        LogMessage.addFields(

            {name: `Yetkili Adı`, value: `\`\`\`yaml\n${message.author.username}\`\`\``, inline: true},
            {name: `Yetkili Tag`, value: `\`\`\`yaml\n${message.author.tag}\`\`\``, inline: true},
            {name: `Yetkili ID`, value: `\`\`\`yaml\n${message.author.id}\`\`\``, inline: true},
            {name: `İşlem Zamanı`, value: `\`\`\`yaml\n${moment().locale("tr").format("LLL")}\`\`\``, inline: false},
            {name: `Ticket Kanalı`, value: `\`\`\`yaml\n${message.channel.name} - (${message.channel.id})\`\`\``, inline: false}

        );
        LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

        LogChannel.send({ embeds: [LogMessage] });

    } else {

        const LogMessage = new Discord.EmbedBuilder();

        LogMessage.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        LogMessage.setColor(Config.Embed_Info.SuccessColor);
        LogMessage.setDescription(`**Ticket Menüsü Değiştirildi!**

        **・** Yetkili: <@${message.author.id}>
        **・** Yetkili Tag: \`${message.author.tag}\`
        **・** Yetkili ID: \`${message.author.id}\`

        **・** İşlem Zamanı: \`${moment().locale("tr").format("LLL")}\` - <t:${parseInt(Date.now() / 1000)}:R>            
        **・** Ticket Kanalı: <#${message.channel.id}> - (\`${message.channel.id}\`)
        `);
        LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

        LogChannel.send({ embeds: [LogMessage] });

    };

};

exports.conf = {
    aliases: []
};

exports.help = {
    name: "ticket-menüsü"
};
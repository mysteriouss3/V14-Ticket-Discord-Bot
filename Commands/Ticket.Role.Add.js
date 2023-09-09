const Config = require('../Src/Config.json');
const Default_Prefix = require('../Src/Config/Prefix.json');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('croxydb');


exports.run = async (client, message, args) => {

    const Prefix = db.get(`Guild_${message.guild.id}.Client_Prefix`) || Default_Prefix.Prefix;

    const Roles = message.member.roles.cache;
    const Whitelist = db.get(`Guild_${message.guild.id}.Role.Whitelist_Role`);
    const Channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

    const Log = db.get(`Guild_${message.guild.id}.Log_System.Ticket_Log`);

    const WhitelistButton = new Discord.ButtonBuilder();

    WhitelistButton.setCustomId("WhitelistButtonAdd");
    WhitelistButton.setEmoji("<:Key:1104383269149093968>");
    WhitelistButton.setLabel("・Güvenilir Liste");
    WhitelistButton.setStyle(Discord.ButtonStyle.Primary);

    const OfficialButton = new Discord.ButtonBuilder();

    OfficialButton.setCustomId("OfficialButtonAdd");
    OfficialButton.setEmoji("<:Key:1104383269149093968>");
    OfficialButton.setLabel("・Yetkili Şikayet Menüsü");
    OfficialButton.setStyle(Discord.ButtonStyle.Primary);
    
    const GeneralButton = new Discord.ButtonBuilder();

    GeneralButton.setCustomId("GeneralButtonAdd");
    GeneralButton.setEmoji("<:Key:1104383269149093968>");
    GeneralButton.setLabel("Genel Sorun Menüsü");
    GeneralButton.setStyle(Discord.ButtonStyle.Primary);

    const RoleAdd = new Discord.ActionRowBuilder().addComponents(WhitelistButton, OfficialButton, GeneralButton);

    if (Whitelist) {

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

        const LogWarning = new Discord.EmbedBuilder();

        LogWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        LogWarning.setColor(Config.Embed_Info.WarningColor);
        LogWarning.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${message.author.id}>, Ticket log kanalını ayarlı olmadığı için bu komut inaktif durumdadır! __Örn:__ \`${Prefix}ticket-log <#Ticket-Log>\``);

        if (!Log) return message.reply({ embeds: [LogWarning] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        const SuccessWarning = new Discord.EmbedBuilder();

        SuccessWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        SuccessWarning.setColor(Config.Embed_Info.SuccessColor);
        SuccessWarning.setThumbnail(message.guild.iconURL({ dynamic: true }))
        SuccessWarning.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${message.author.id}>, Ticket rol ekle menüsüne hoş geldiniz!
        
        \` > \`・Bu menüden sadece rol ekleyebilirsiniz! Rol kaldırmak için! __Örn:__ \`${Prefix}ticket-rol-kaldır\`
        \` > \`・Güvenilir Listeye eklenen rol bütün komutları kullanabilir (1 Rol Eklenebilir)!
        \` > \`・Yetkili Şikayet'e eklenen roller yetkili şikayet ticketlarına bakabilir (3 Rol Eklenebilir)!
        \` > \`・Genel Sorun'a eklenen roller genel sorun ticketlarına bakabilir (3 Rol Eklenebilir)!`);

        message.react(Config.Embed_Info.SuccessEmote)
        message.reply({ embeds: [SuccessWarning], components: [RoleAdd] }).then( m => {

            db.set(`Guild_${m.guild.id}.Button_Author.User_${m.id}`, message.author.id)

            setTimeout( function() {
                m.delete()
                db.delete(`Guild_${m.guild.id}.Button_Author.User_${m.id}`, message.author.id)
            }, 30000);
        });

    } else {
    
        const permWarn = new Discord.EmbedBuilder();
    
        permWarn.setColor(Config.Embed_Info.DangerColor);
        permWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${message.author.id}>, Bu komutu kullanmak için yeterli yetkiniz bulunmuyor!`);
        
        if (![Config.Roles_Info.Developer, Config.Roles_Info.Administrator, Config.Roles_Info.Director].some(r => Roles.has(r))) return message.channel.send({embeds: [permWarn]}).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        const LogWarning = new Discord.EmbedBuilder();

        LogWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        LogWarning.setColor(Config.Embed_Info.WarningColor);
        LogWarning.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${message.author.id}>, Ticket log kanalını ayarlı olmadığı için bu komut inaktif durumdadır! __Örn:__ \`${Prefix}ticket-log <#Ticket-Log>\``);

        if (!Log) return message.reply({ embeds: [LogWarning] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        const SuccessWarning = new Discord.EmbedBuilder();

        SuccessWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        SuccessWarning.setColor(Config.Embed_Info.SuccessColor);
        SuccessWarning.setThumbnail(message.guild.iconURL({ dynamic: true }))
        SuccessWarning.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${message.author.id}>, Ticket rol ekle menüsüne hoş geldiniz!
        
        \` > \`・Bu menüden sadece rol ekleyebilirsiniz! Rol kaldırmak için! __Örn:__ \`${Prefix}ticket-rol-kaldır\`
        \` > \`・Güvenilir Listeye eklenen rol bütün komutları kullanabilir (1 Rol Eklenebilir)!
        \` > \`・Yetkili Şikayet'e eklenen roller yetkili şikayet ticketlarına bakabilir (3 Rol Eklenebilir)!
        \` > \`・Genel Sorun'a eklenen roller genel sorun ticketlarına bakabilir (3 Rol Eklenebilir)!`);

        message.react(Config.Embed_Info.SuccessEmote)
        message.reply({ embeds: [SuccessWarning], components: [RoleAdd] }).then( m => {

            db.set(`Guild_${m.guild.id}.Button_Author.User_${m.id}`, message.author.id)

            setTimeout( function() {
                m.delete()
                db.delete(`Guild_${m.guild.id}.Button_Author.User_${m.id}`, message.author.id)
            }, 30000);
        });

    };
};

exports.conf = {
    aliases: []
};

exports.help = {
    name: "ticket-rol-ekle"
};
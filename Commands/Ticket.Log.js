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

        const ChannelWarning = new Discord.EmbedBuilder();

        ChannelWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        ChannelWarning.setColor(Config.Embed_Info.WarningColor);
        ChannelWarning.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${message.author.id}>, Ticket log kanalını ayarlamak için bir kanal etiketleyin ya da ID girin! __Örn:__ \`${Prefix}ticket-log <#Ticket-Log>\``);

        if (!Channel) return message.reply({ embeds: [ChannelWarning] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        const SuccessWarning = new Discord.EmbedBuilder();

        SuccessWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        SuccessWarning.setColor(Config.Embed_Info.SuccessColor);
        SuccessWarning.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${message.author.id}>, Başarıyla ticket log kanalı "<#${Channel.id}>" adlı kanal olarak ayarlandı!`);

        message.react(Config.Embed_Info.SuccessEmote)
        message.reply({ embeds: [SuccessWarning] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        db.set(`Guild_${message.guild.id}.Log_System.Ticket_Log`, Channel.id);

    } else {
    
        const permWarn = new Discord.EmbedBuilder();
    
        permWarn.setColor(Config.Embed_Info.DangerColor);
        permWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${message.author.id}>, Bu komutu kullanmak için yeterli yetkiniz bulunmuyor!`);
        
        if (![Config.Roles_Info.Developer, Config.Roles_Info.Administrator, Config.Roles_Info.Director].some(r => Roles.has(r))) return message.channel.send({embeds: [permWarn]}).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        const ChannelWarning = new Discord.EmbedBuilder();

        ChannelWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        ChannelWarning.setColor(Config.Embed_Info.WarningColor);
        ChannelWarning.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${message.author.id}>, Ticket log kanalını ayarlamak için bir kanal etiketleyin ya da ID girin! __Örn:__ \`${Prefix}ticket-log <#Ticket-Log>\``);

        if (!Channel) return message.reply({ embeds: [ChannelWarning] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        const SuccessWarning = new Discord.EmbedBuilder();

        SuccessWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        SuccessWarning.setColor(Config.Embed_Info.SuccessColor);
        SuccessWarning.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${message.author.id}>, Başarıyla ticket log kanalı "<#${Channel.id}>" adlı kanal olarak ayarlandı!`);

        message.react(Config.Embed_Info.SuccessEmote)
        message.reply({ embeds: [SuccessWarning] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        db.set(`Guild_${message.guild.id}.Log_System.Ticket_Log`, Channel.id);

    };
};

exports.conf = {
    aliases: []
};

exports.help = {
    name: "ticket-log"
};
const Config = require('../Src/Config.json');
const Default_Prefix = require('../Src/Config/Prefix.json');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('croxydb');

exports.run = async (client, message, args) => {

    const Prefix = db.get(`Guild_${message.guild.id}.Client_Prefix`) || Default_Prefix.Prefix;

    const Roles = message.member.roles.cache;
    const Whitelist = db.get(`Guild_${message.guild.id}.Role.Whitelist_Role`);
    const Parent = args.slice(0);

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

        const CategoryWarning = new Discord.EmbedBuilder();

        CategoryWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        CategoryWarning.setColor(Config.Embed_Info.WarningColor);
        CategoryWarning.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${message.author.id}>, Ticket kategorisini ayarlamak için bir ketegori IDsi girin! __Örn:__ \`${Prefix}ticket-kategori <[1075618823836811334]>\``);

        if (!Parent) return message.reply({ embeds: [CategoryWarning] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        const SuccessWarning = new Discord.EmbedBuilder();

        SuccessWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        SuccessWarning.setColor(Config.Embed_Info.SuccessColor);
        SuccessWarning.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${message.author.id}>, Başarıyla ticket kategorisi "\`${Parent}\`" IDli kategori olarak ayarlandı!`);

        message.react(Config.Embed_Info.SuccessEmote)
        message.reply({ embeds: [SuccessWarning] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        db.set(`Guild_${message.guild.id}.Parent.CategoryID`, Parent);

    } else {
    
        const permWarn = new Discord.EmbedBuilder();
    
        permWarn.setColor(Config.Embed_Info.DangerColor);
        permWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${message.author.id}>, Bu komutu kullanmak için yeterli yetkiniz bulunmuyor!`);
        
        if (![Config.Roles_Info.Developer, Config.Roles_Info.Administrator, Config.Roles_Info.Director].some(r => Roles.has(r))) return message.channel.send({embeds: [permWarn]}).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        const CategoryWarning = new Discord.EmbedBuilder();

        CategoryWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        CategoryWarning.setColor(Config.Embed_Info.WarningColor);
        CategoryWarning.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${message.author.id}>, Ticket kategorisini ayarlamak için bir ketegori IDsi girin! __Örn:__ \`${Prefix}ticket-kategori <[1075618823836811334]>\``);

        if (!Parent) return message.reply({ embeds: [CategoryWarning] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        const SuccessWarning = new Discord.EmbedBuilder();

        SuccessWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        SuccessWarning.setColor(Config.Embed_Info.SuccessColor);
        SuccessWarning.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${message.author.id}>, Başarıyla ticket kategorisi "\`${Parent}\`" IDli kategori olarak ayarlandı!`);

        message.react(Config.Embed_Info.SuccessEmote)
        message.reply({ embeds: [SuccessWarning] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        db.set(`Guild_${interaction.guild.id}.Parent.CategoryID`, Parent);

    };
};

exports.conf = {
    aliases: []
};

exports.help = {
    name: "ticket-kategori"
};
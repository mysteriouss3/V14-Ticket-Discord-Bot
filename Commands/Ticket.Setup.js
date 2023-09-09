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

        const SetupMenu = new Discord.EmbedBuilder();

        SetupMenu.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        SetupMenu.setColor(Config.Embed_Info.SuccessColor);
        SetupMenu.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${message.author.id}, Ticket kurulum menüsüne hoş geldin!
        
        \` > \`・Ticket kurmak için gerekli komutlar aşağıda verilmektedir!

        \` ${Prefix}ticket-kategori \`・Ticket kategorisini ayarlar ve açılan ticketlar kategori altında toplanır!
        \` ${Prefix}ticket-log \`・Ticket log kanalını ayarlar ve tüm eylemler log kanalına gönderilir!
        \` ${Prefix}ticket-menü \`・Ticket menüsünü yazılan kanala atar ve kullanıma hazırlanır!
        \` ${Prefix}ticket-reset \`・Ticket botunu resetler developer dışında yapılması önerilmez!
        \` ${Prefix}ticket-rol-ekle \`・Ticket sistemine rol eklemek için kullanılan menüyü atar!
        \` ${Prefix}ticket-rol-kaldır \`・Ticket sistemine rol kaldırmak için kullanılan menüyü atar!
        \` ${Prefix}ticket-stat \`・Komutu kullanan kişinin verilerini yollar!`);
        
        message.react(Config.Embed_Info.SuccessEmote);
        message.reply({ embeds: [SetupMenu] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 20000);
        });


    } else {

        const permWarn = new Discord.EmbedBuilder();
    
        permWarn.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        permWarn.setColor(Config.Embed_Info.DangerColor);
        permWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${message.author.id}>, Bu komutu kullanmak için yeterli yetkiniz bulunmuyor!`);
        
        if (![Config.Roles_Info.Developer, Config.Roles_Info.Administrator, Config.Roles_Info.Director].some(r => Roles.has(r))) return message.channel.send({embeds: [permWarn]}).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        const SetupMenu = new Discord.EmbedBuilder();

        SetupMenu.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        SetupMenu.setColor(Config.Embed_Info.SuccessColor);
        SetupMenu.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${message.author.id}, Ticket kurulum menüsüne hoş geldin!
        
        \` > \`・Ticket kurmak için gerekli komutlar aşağıda verilmektedir!

        \` ${Prefix}ticket-kategori \`・Ticket kategorisini ayarlar ve açılan ticketlar kategori altında toplanır!
        \` ${Prefix}ticket-log \`・Ticket log kanalını ayarlar ve tüm eylemler log kanalına gönderilir!
        \` ${Prefix}ticket-menü \`・Ticket menüsünü yazılan kanala atar ve kullanıma hazırlanır!
        \` ${Prefix}ticket-reset \`・Ticket botunu resetler developer dışında yapılması önerilmez!
        \` ${Prefix}ticket-rol-ekle \`・Ticket sistemine rol eklemek için kullanılan menüyü atar!
        \` ${Prefix}ticket-rol-kaldır \`・Ticket sistemine rol kaldırmak için kullanılan menüyü atar!
        \` ${Prefix}ticket-stat \`・Komutu kullanan kişinin verilerini yollar!`);
        
        message.react(Config.Embed_Info.SuccessEmote);
        message.reply({ embeds: [SetupMenu] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 20000);
        });

    };
};

exports.conf = {
    aliases: []
};

exports.help = {
    name: "ticket-kur"
};
const Config = require('../Src/Config.json');
const Default_Prefix = require('../Src/Config/Prefix.json');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('croxydb');


exports.run = async (client, message, args) => {

    const Prefix = db.get(`Guild_${message.guild.id}.Client_Prefix`) || Default_Prefix.Prefix;

    const Roles = message.member.roles.cache;
    const Whitelist = db.get(`Guild_${message.guild.id}.Role.Whitelist_Role`);

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

        const TicketLog = db.get(`Guild_${message.guild.id}.Log_System.Ticket_Log`);
        const TicketCategory = db.get(`Guild_${message.guild.id}.Log_System.Ticket_Log`);
        const WhitelistRole = db.get(`Guild_${message.guild.id}.Role.Whitelist_Role`);
        const AdminRole = db.get(`Guild_${message.guild.id}.Role.Admin_Report_Role`);
        const GeneralRole = db.get(`Guild_${message.guild.id}.Role.General_Report_Role`);

        const TicketLogCache = TicketLog ? `<#${TicketLog}>` : "\`Ayarlı Değil!\`";
        const TicketCategoryCache = TicketCategory ? `\`${TicketCategory}\`` : "\`Ayarlı Değil!\`";


        const ControlMenu = new Discord.EmbedBuilder();

        ControlMenu.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        ControlMenu.setColor(Config.Embed_Info.WarningColor);
        ControlMenu.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${message.author.id}>, Ticket botuna ait tüm veriler aşağıda verilmektedir!
        
        \` > \` Ticket Log: ${TicketLogCache}
        \` > \` Ticket Kategori: ${TicketCategoryCache}
        \` > \` Whitelist Rol: ${WhitelistRole.length > 0 ? WhitelistRole.map((e, i) => `<@&${e}>`).join(',') : `\`Ayarlı Değil!\``}
        \` > \` Yetkili Şikayet Rol: ${AdminRole.length > 0 ? AdminRole.map((e, i) => `<@&${e}>`).join(',') : `\`Ayarlı Değil!\``}
        \` > \` Genel Sorun Rol: ${GeneralRole.length > 0 ? GeneralRole.map((e, i) => `<@&${e}>`).join(',') : `\`Ayarlı Değil!\``}
        `);
        ControlMenu.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

        message.react(Config.Embed_Info.SuccessEmote);
        message.reply({embeds: [ControlMenu]}).then( m => {

            setTimeout( function() {
                m.delete()
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

        const TicketLog = db.get(`Guild_${message.guild.id}.Log_System.Ticket_Log`);
        const TicketCategory = db.get(`Guild_${message.guild.id}.Log_System.Ticket_Log`);
        const WhitelistRole = db.get(`Guild_${message.guild.id}.Role.Whitelist_Role`);
        const AdminRole = db.get(`Guild_${message.guild.id}.Role.Admin_Report_Role`);
        const GeneralRole = db.get(`Guild_${message.guild.id}.Role.General_Report_Role`);

        const TicketLogCache = TicketLog ? `<#${TicketLog}>` : "\`Ayarlı Değil!\`";
        const TicketCategoryCache = TicketCategory ? `\`${TicketCategory}\`` : "\`Ayarlı Değil!\`";
        const WhitelistRoleCache = WhitelistRole ? `<@&${WhitelistRole.map((e) => { e })}>` : "\`Ayarlı Değil!\`";
        const AdminRoleCache = AdminRole ? `<@&${AdminRole.map((e) => { e }).join(" | ")}>` : "\`Ayarlı Değil!\`";
        const GeneralRoleCache = GeneralRole ? `<@&${GeneralRole.map((e) => { e }).join(" | ")}>` : "\`Ayarlı Değil!\`";


        const ControlMenu = new Discord.EmbedBuilder();

        ControlMenu.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        ControlMenu.setColor(Config.Embed_Info.WarningColor);
        ControlMenu.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${message.author.id}>, Ticket botuna ait tüm veriler aşağıda verilmektedir!
        
        \` > \` Ticket Log: ${TicketLogCache}
        \` > \` Ticket Kategori: ${TicketCategoryCache}
        \` > \` Whitelist Rol: ${WhitelistRoleCache}
        \` > \` Yetkili Şikayet Rol: ${AdminRoleCache}
        \` > \` Genel Sorun Rol: ${GeneralRoleCache}
        `);
        ControlMenu.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

        message.react(Config.Embed_Info.SuccessEmote);
        message.reply({embeds: [ControlMenu]}).then( m => {

            setTimeout( function() {
                m.delete()
            }, 30000);
        });

    };
};

exports.conf = {
    aliases: []
};

exports.help = {
    name: "ticket-kontrol"
};
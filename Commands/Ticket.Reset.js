const Config = require('../Src/Config.json');
const Default_Prefix = require('../Src/Config/Prefix.json');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('croxydb');


exports.run = async (client, message, args) => {

    const Prefix = db.get(`Guild_${message.guild.id}.Client_Prefix`) || Default_Prefix.Prefix;

    const Roles = message.member.roles.cache;

    const permWarn = new Discord.EmbedBuilder();

    permWarn.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
    permWarn.setColor(Config.Embed_Info.DangerColor);
    permWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${message.author.id}>, Bu komutu kullanmak için yeterli yetkiniz bulunmuyor!`);
    
    if (![Config.Roles_Info.Developer].some(r => Roles.has(r))) return message.channel.send({embeds: [permWarn]}).then( m => {

        setTimeout( function() {
            m.delete()
        }, 5000);
    });

    db.deleteAll(`Guild_${message.guild.id}`);

    const SuccessWarning = new Discord.EmbedBuilder();

        SuccessWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        SuccessWarning.setColor(Config.Embed_Info.SuccessColor);
        SuccessWarning.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${message.author.id}>, Başarıyla bütün ticket sistemi sıfırlandı!`);

        message.react(Config.Embed_Info.SuccessEmote)
        message.reply({ embeds: [SuccessWarning] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

};

exports.conf = {
    aliases: []
};

exports.help = {
    name: "ticket-reset"
};
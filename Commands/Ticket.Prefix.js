const Config = require('../Src/Config.json');
const Default_Prefix = require('../Src/Config/Prefix.json');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('croxydb');


exports.run = async (client, message, args) => {

    const Prefix = db.get(`Guild_${message.guild.id}.Client_Prefix`) || Default_Prefix.Prefix;

    const Roles = message.member.roles.cache;
    const Whitelist = db.get(`Guild_${message.guild.id}.Role.Whitelist_Role`);
    const Prefix_Change = args.slice(0);

    const Log = db.get(`Guild_${message.guild.id}.Log_System.Ticket_Log`);

    const LogChannel = message.guild.channels.cache.get(Log);

    const LogType = db.get(`Guild_${message.guild.id}.Log_System.Log_Type`);

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

        const SuccessWarning = new Discord.EmbedBuilder();

        SuccessWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        SuccessWarning.setColor(Config.Embed_Info.SuccessColor);
        SuccessWarning.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${message.author.id}>, Başarıyla ticket bot prefixi "\`${Prefix_Change}\`" olarak ayarlandı!`);

        message.react(Config.Embed_Info.SuccessEmote)
        message.reply({ embeds: [SuccessWarning] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        if (LogType) {
                    
            const LogMessage = new Discord.EmbedBuilder();

            LogMessage.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
            LogMessage.setColor(Config.Embed_Info.WarningColor);
            LogMessage.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${message.user.id}>, adlı yetkili tarafından ticket botu prefixi değiştirildi! İşte Detaylar!`);
            LogMessage.addFields(

                {name: `Yetkili Adı`, value: `\`\`\`yaml\n${message.user.username}\`\`\``, inline: true},
                {name: `Yetkili Tag`, value: `\`\`\`yaml\n${message.user.tag}\`\`\``, inline: true},
                {name: `Yetkili ID`, value: `\`\`\`yaml\n${message.user.id}\`\`\``, inline: true},
                {name: `İşlem Zamanı`, value: `\`\`\`yaml\n${moment().locale("tr").format("LLL")}\`\`\``, inline: false},
                {name: `Yeni Prefix`, value: `\`\`\`yaml\n${Prefix_Change}\`\`\``, inline: false}

            );
            LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

            LogChannel.send({ embeds: [LogMessage] });

        } else {

            const LogMessage = new Discord.EmbedBuilder();
    
            LogMessage.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
            LogMessage.setColor(Config.Embed_Info.WarningColor);
            LogMessage.setDescription(`**Ticket Botu Prefixi Değiştirildi!**

            **・** Yetkili: <@${message.user.id}>
            **・** Yetkili Tag: \`${message.user.tag}\`
            **・** Yetkili ID: \`${message.user.id}\`

            **・** İşlem Zamanı: \`${moment().locale("tr").format("LLL")}\` - <t:${parseInt(Date.now() / 1000)}:R>            
            **・** Yeni Prefix: \`${Prefix_Change}\``);
            LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

            LogChannel.send({ embeds: [LogMessage] });

        };

        db.set(`Guild_${message.guild.id}.Client_Prefix`, Prefix_Change);
   
    } else {
    
        const permWarn = new Discord.EmbedBuilder();
    
        permWarn.setColor(Config.Embed_Info.DangerColor);
        permWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${message.author.id}>, Bu komutu kullanmak için yeterli yetkiniz bulunmuyor!`);
        
        if (![Config.Roles_Info.Developer, Config.Roles_Info.Administrator, Config.Roles_Info.Director].some(r => Roles.has(r))) return message.channel.send({embeds: [permWarn]}).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        const SuccessWarning = new Discord.EmbedBuilder();

        SuccessWarning.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
        SuccessWarning.setColor(Config.Embed_Info.SuccessColor);
        SuccessWarning.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${message.author.id}>, Başarıyla ticket bot prefixi "\`${Prefix_Change}\`" olarak ayarlandı!`);

        message.react(Config.Embed_Info.SuccessEmote)
        message.reply({ embeds: [SuccessWarning] }).then( m => {

            setTimeout( function() {
                m.delete()
            }, 5000);
        });

        if (LogType) {
                    
            const LogMessage = new Discord.EmbedBuilder();

            LogMessage.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
            LogMessage.setColor(Config.Embed_Info.WarningColor);
            LogMessage.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${message.author.id}>, adlı yetkili tarafından ticket botu prefixi değiştirildi! İşte Detaylar!`);
            LogMessage.addFields(

                {name: `Yetkili Adı`, value: `\`\`\`yaml\n${message.author.username}\`\`\``, inline: true},
                {name: `Yetkili Tag`, value: `\`\`\`yaml\n${message.author.tag}\`\`\``, inline: true},
                {name: `Yetkili ID`, value: `\`\`\`yaml\n${message.author.id}\`\`\``, inline: true},
                {name: `İşlem Zamanı`, value: `\`\`\`yaml\n${moment().locale("tr").format("LLL")}\`\`\``, inline: false},
                {name: `Yeni Prefix`, value: `\`\`\`yaml\n${Prefix_Change}\`\`\``, inline: false}

            );
            LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

            LogChannel.send({ embeds: [LogMessage] });

        } else {

            const LogMessage = new Discord.EmbedBuilder();
    
            LogMessage.setAuthor({ name: `${message.guild.name}`, iconURL: `${message.guild.iconURL({ dynamic: true })}`});
            LogMessage.setColor(Config.Embed_Info.WarningColor);
            LogMessage.setDescription(`**Ticket Botu Prefixi Değiştirildi!**

            **・** Yetkili: <@${message.author.id}>
            **・** Yetkili Tag: \`${message.author.tag}\`
            **・** Yetkili ID: \`${message.author.id}\`

            **・** İşlem Zamanı: \`${moment().locale("tr").format("LLL")}\` - <t:${parseInt(Date.now() / 1000)}:R>            
            **・** Yeni Prefix: \`${Prefix_Change}\``);
            LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

            LogChannel.send({ embeds: [LogMessage] });

        };

        db.set(`Guild_${message.guild.id}.Client_Prefix`, Prefix_Change);

    };
};

exports.conf = {
    aliases: []
};

exports.help = {
    name: "ticket-prefix"
};
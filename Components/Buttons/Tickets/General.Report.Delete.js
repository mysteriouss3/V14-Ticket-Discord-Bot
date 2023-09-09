const Config = require('../../../Src/Config.json');
const client = require('../../../index.js');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('croxydb');

client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton()) return;
    if (interaction.customId == "generalClose") {

        const Roles = interaction.member.roles.cache;


        const TicketOwner = db.get(`ticketOwner_Info_${interaction.channel.id}`);
        const AdminRole = db.get(`Guild_${interaction.guild.id}.Role.General_Report_Role`);
        const WhitelistRole = db.get(`Guild_${interaction.guild.id}.Role.Whitelist_Role`);

        const AdminRole0 = AdminRole[0];
        const AdminRole1 = AdminRole[1];
        const AdminRole2 = AdminRole[2];
        const WhitelistRole0 = WhitelistRole[0];

        if (AdminRole0 && AdminRole1 && AdminRole2 ) {

            const permWarn = new Discord.EmbedBuilder();
    
            permWarn.setColor(Config.Embed_Info.DangerColor);
            permWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${interaction.user.id}>, Bu komutu kullanmak için yeterli yetkiniz bulunmuyor!`);
        
            if (![AdminRole0, AdminRole1, AdminRole2, WhitelistRole0, Config.Roles_Info.Developer, Config.Roles_Info.Administrator, Config.Roles_Info.Director].some(r => Roles.has(r))) return interaction.reply({ embeds: [permWarn], ephemeral: true})

            const CloseQuestion = new Discord.EmbedBuilder();

            CloseQuestion.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
            CloseQuestion.setColor(Config.Embed_Info.WarningColor);
            CloseQuestion.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${interaction.user.id}>, Bu ticket'ı gerçekten kapatmak istediğinize emin misiniz?`);

            const CloseYes = new Discord.ButtonBuilder()

            CloseYes.setCustomId("generalCloseYes");
            CloseYes.setEmoji(Config.Embed_Info.SuccessEmote);
            CloseYes.setLabel("・Evet");
            CloseYes.setStyle(Discord.ButtonStyle.Success)

            const CloseButton = new Discord.ActionRowBuilder().addComponents( CloseYes );

            interaction.reply({ embeds: [CloseQuestion], components: [CloseButton], ephemeral: true });
    
        } else if (AdminRole0 && AdminRole1) {

            const permWarn = new Discord.EmbedBuilder();
    
            permWarn.setColor(Config.Embed_Info.DangerColor);
            permWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${interaction.user.id}>, Bu komutu kullanmak için yeterli yetkiniz bulunmuyor!`);
        
            if (![AdminRole0, AdminRole1, WhitelistRole0, Config.Roles_Info.Developer, Config.Roles_Info.Administrator, Config.Roles_Info.Director].some(r => Roles.has(r))) return interaction.reply({ embeds: [permWarn], ephemeral: true})

            const CloseQuestion = new Discord.EmbedBuilder();

            CloseQuestion.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
            CloseQuestion.setColor(Config.Embed_Info.WarningColor);
            CloseQuestion.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${interaction.user.id}>, Bu ticket'ı gerçekten kapatmak istediğinize emin misiniz?`);

            const CloseYes = new Discord.ButtonBuilder()

            CloseYes.setCustomId("generalCloseYes");
            CloseYes.setEmoji(Config.Embed_Info.SuccessEmote);
            CloseYes.setLabel("・Evet");
            CloseYes.setStyle(Discord.ButtonStyle.Success)

            const CloseButton = new Discord.ActionRowBuilder().addComponents( CloseYes );

            interaction.reply({ embeds: [CloseQuestion], components: [CloseButton], ephemeral: true });

        } else {

            const permWarn = new Discord.EmbedBuilder();
    
            permWarn.setColor(Config.Embed_Info.DangerColor);
            permWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${interaction.user.id}>, Bu komutu kullanmak için yeterli yetkiniz bulunmuyor!`);
        
            if (![AdminRole0, WhitelistRole0, Config.Roles_Info.Developer, Config.Roles_Info.Administrator, Config.Roles_Info.Director].some(r => Roles.has(r))) return interaction.reply({ embeds: [permWarn], ephemeral: true});

            const CloseQuestion = new Discord.EmbedBuilder();

            CloseQuestion.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
            CloseQuestion.setColor(Config.Embed_Info.WarningColor);
            CloseQuestion.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${interaction.user.id}>, Bu ticket'ı gerçekten kapatmak istediğinize emin misiniz?`);

            const CloseYes = new Discord.ButtonBuilder()

            CloseYes.setCustomId("generalCloseYes");
            CloseYes.setEmoji(Config.Embed_Info.SuccessEmote);
            CloseYes.setLabel("・Evet");
            CloseYes.setStyle(Discord.ButtonStyle.Success)

            const CloseButton = new Discord.ActionRowBuilder().addComponents( CloseYes );

            interaction.reply({ embeds: [CloseQuestion], components: [CloseButton], ephemeral: true });

        };

    };
});


client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton()) return;
    if (interaction.customId == "generalCloseYes") {

        const datas = db.get(`TicketMessageLog.Guild_${interaction.guild.id}.Message${interaction.channel.id}`);

        const LogType = db.get(`Guild_${interaction.guild.id}.Log_System.Log_Type`);

        const Log = db.get(`Guild_${interaction.guild.id}.Log_System.Ticket_Log`);

        const LogChannel = interaction.guild.channels.cache.get(Log);

        const TicketOwner = db.get(`ticketOwner_Info_${interaction.channel.id}`);

        const fs = require("fs")
        const wait = require('node:timers/promises').setTimeout;

        const TicketNumber = db.get(`Guild_${interaction.guild.id}.Ticket_Created_Number`) || "0";

        const warnMessage = new Discord.EmbedBuilder();

        warnMessage.setColor(Config.Embed_Info.SuccessColor);        
        warnMessage.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! Bu ticket <@${interaction.user.id}> tarafından kapatılmıştır. 5 Saniye sonra otomatik olarak silinecektir!`);

        interaction.reply({ embeds: [warnMessage], components: [] })

        if (LogType) {

            if(!datas) {
                fs.writeFileSync(`./Logs/${TicketOwner.userTag}-Genel-${TicketNumber}.txt`, "Bu Ticket da hiç bir mesaj bulunamadı!");

                const ModLogMessage = new Discord.EmbedBuilder();

                ModLogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                ModLogMessage.setColor(Config.Embed_Info.DangerColor);
                ModLogMessage.setDescription(`${Config.Embed_Info.BellEmote} | Hey! <@${interaction.user.id}>, tarafından bir ticket silindi! işte detaylar`);         
                ModLogMessage.addFields(           
                { name: `Yetkili Tag`, value: `\`\`\`yaml\n${interaction.user.tag}\`\`\``, inline: true},           
                { name: `Yetkili Adı`, value: `\`\`\`yaml\n${interaction.user.username}\`\`\``, inline: true},            
                { name: `Yetkili ID`, value: `\`\`\`yaml\n${interaction.user.id}\`\`\``, inline: true},       
                { name: `Üye Tag`, value: `\`\`\`yaml\n${TicketOwner.userTag}\`\`\``, inline: true},           
                { name: `Üye Adı`, value: `\`\`\`yaml\n${TicketOwner.userName}\`\`\``, inline: true},            
                { name: `Üye ID`, value: `\`\`\`yaml\n${TicketOwner.userID}\`\`\``, inline: true},             
                { name: `İşlem Zamanı`, value: `\`\`\`yaml\n${moment().locale("tr").format("LLL")}\`\`\``, inline: false},           
                { name: `Ticket Kanalı`, value: `\`\`\`yaml\n${interaction.channel.name} - (${interaction.channel.id})\`\`\``, inline: false},            
                { name: `Ticket Sebepi`, value: `\`\`\`yaml\nGenel Soru/Sorun\`\`\``, inline: false},         
                )                      
                ModLogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

                LogChannel.send({ embeds: [ModLogMessage], files: [`./Logs/${TicketOwner.userTag}-Genel-${TicketNumber}.txt`] });

            }
            
            if(datas) {
            
                const data = db.fetch(`TicketMessageLog.Guild_${interaction.guild.id}.Message${interaction.channel.id}`).join("\n")
                fs.writeFileSync(`./Logs/${TicketOwner.userTag}-Genel-${TicketNumber}.txt`, data);

                const ModLogMessage = new Discord.EmbedBuilder();

                ModLogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                ModLogMessage.setColor(Config.Embed_Info.DangerColor);
                ModLogMessage.setDescription(`${Config.Embed_Info.BellEmote} | Hey! <@${interaction.user.id}>, tarafından bir ticket silindi! işte detaylar`);         
                ModLogMessage.addFields(           
                { name: `Yetkili Tag`, value: `\`\`\`yaml\n${interaction.user.tag}\`\`\``, inline: true},           
                { name: `Yetkili Adı`, value: `\`\`\`yaml\n${interaction.user.username}\`\`\``, inline: true},            
                { name: `Yetkili ID`, value: `\`\`\`yaml\n${interaction.user.id}\`\`\``, inline: true},       
                { name: `Üye Tag`, value: `\`\`\`yaml\n${TicketOwner.userTag}\`\`\``, inline: true},           
                { name: `Üye Adı`, value: `\`\`\`yaml\n${TicketOwner.userName}\`\`\``, inline: true},            
                { name: `Üye ID`, value: `\`\`\`yaml\n${TicketOwner.userID}\`\`\``, inline: true},             
                { name: `İşlem Zamanı`, value: `\`\`\`yaml\n${moment().locale("tr").format("LLL")}\`\`\``, inline: false},           
                { name: `Ticket Kanalı`, value: `\`\`\`yaml\n${interaction.channel.name} - (${interaction.channel.id})\`\`\``, inline: false},            
                { name: `Ticket Sebepi`, value: `\`\`\`yaml\nGenel Soru/Sorun\`\`\``, inline: false},         
                )                      
        
                ModLogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });
        
                LogChannel.send({ embeds: [ModLogMessage], files: [`./Logs/${TicketOwner.userTag}-Genel-${TicketNumber}.txt`] });
    
                
            };

        } else {

            if(!datas) {
                
                fs.writeFileSync(`./Logs/${TicketOwner.userTag}-Genel-${TicketNumber}.txt`, "Bu Ticket da hiç bir mesaj bulunamadı!");

                const ModLogMessage = new Discord.EmbedBuilder();
                
                ModLogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                ModLogMessage.setColor(Config.Embed_Info.DangerColor);
                ModLogMessage.setDescription(`**Ticket Delete**
    
                **・** Yetkili: <@${interaction.user.id}>
                **・** Yetkili Tag: \`${interaction.user.tag}\`
                **・** Yetkili ID: \`${interaction.user.id}\`
            
                **・** Ticket Sahibi: <@${TicketOwner.userID}>
                **・** Ticket Sahibi Tag: \`${TicketOwner.userTag}\`
                **・** Ticket Sahibi ID: \`${TicketOwner.userID}\`

                **・** İşlem Zamanı: \`${moment().locale("tr").format("LLL")}\` - <t:${parseInt(Date.now() / 1000)}:R>
                **・** Ticket Kanalı: \`${interaction.channel.name}\`
                **・** Ticket Sebepi: \`Genel Soru/Sorun\``);

                ModLogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });
            
                LogChannel.send({ embeds: [ModLogMessage], files: [`./Logs/${TicketOwner.userTag}-Genel-${TicketNumber}.txt`] });
            }
            
            if(datas) {

                const data = db.fetch(`TicketMessageLog.Guild_${interaction.guild.id}.Message${interaction.channel.id}`).join("\n")
                fs.writeFileSync(`./Logs/${TicketOwner.userTag}-Genel-${TicketNumber}.txt`, data);

                const ModLogMessage = new Discord.EmbedBuilder();

                ModLogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                ModLogMessage.setColor(Config.Embed_Info.DangerColor);
                ModLogMessage.setDescription(`**Ticket Delete**
    
                **・** Yetkili: <@${interaction.user.id}>
                **・** Yetkili Tag: \`${interaction.user.tag}\`
                **・** Yetkili ID: \`${interaction.user.id}\`
            
                **・** Ticket Sahibi: <@${TicketOwner.userID}>
                **・** Ticket Sahibi Tag: \`${TicketOwner.userTag}\`
                **・** Ticket Sahibi ID: \`${TicketOwner.userID}\`

                **・** İşlem Zamanı: \`${moment().locale("tr").format("LLL")}\` - <t:${parseInt(Date.now() / 1000)}:R>
                **・** Ticket Kanalı: \`${interaction.channel.name}\`
                **・** Ticket Sebepi: \`Genel Soru/Sorun\``);

                ModLogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

                LogChannel.send({ embeds: [ModLogMessage], files: [`./Logs/${TicketOwner.userTag}-Genel-${TicketNumber}.txt`] });
            };
        };

        setTimeout( function() {

            db.add(`Guild_${interaction.guild.id}.Ticket_Created_Number`, +1);      
            db.delete(`Guild_${interaction.guild.id}.Ticket_System.Open_Ticket_${interaction.user.id}`)

            db.delete(`TicketMessageLog.Guild_${interaction.guild.id}.Message${interaction.channel.id}`);
            db.delete(`ticketOwner_Info_${interaction.channel.id}`);

            const channel = interaction.guild.channels.cache.get(interaction.channelId);
            return channel.delete();

        }, 5000);

    };
});

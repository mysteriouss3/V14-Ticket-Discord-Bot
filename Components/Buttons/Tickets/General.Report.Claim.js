const Config = require('../../../Src/Config.json');
const client = require('../../../index.js');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('croxydb');

client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton()) return;
    if (interaction.customId == "generalCliam") {

        const adminButton = new Discord.ButtonBuilder();
            
        adminButton.setStyle(Discord.ButtonStyle.Primary);
        adminButton.setLabel('🖐️・Talebi Al');
        adminButton.setCustomId("generalCliam");
        adminButton.setDisabled(true);
    
        const closeButton = new Discord.ButtonBuilder();

        closeButton.setStyle(Discord.ButtonStyle.Danger);
        closeButton.setLabel('🗑️・Talebi Sonlandır');
        closeButton.setCustomId("generalClose");

        const row = new Discord.ActionRowBuilder().addComponents(adminButton, closeButton);

        const Notify = new Discord.ButtonBuilder();
            
        Notify.setCustomId("NotifyClose");
        Notify.setEmoji(Config.Embed_Info.SuccessEmote);
        Notify.setLabel("・Bildirimleri Kapat!");
        Notify.setStyle(Discord.ButtonStyle.Primary);

        const UserButton = new Discord.ActionRowBuilder().addComponents(Notify);

        const Roles = interaction.member.roles.cache;

        const LogType = db.get(`Guild_${interaction.guild.id}.Log_System.Log_Type`);

        const Log = db.get(`Guild_${interaction.guild.id}.Log_System.Ticket_Log`);

        const LogChannel = interaction.guild.channels.cache.get(Log);

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

            const ticketEmbed = new Discord.EmbedBuilder();
    
            ticketEmbed.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
            ticketEmbed.setColor(Config.Embed_Info.SuccessColor);
            ticketEmbed.setDescription(`> Hey! <@${TicketOwner.userID}>, Destek talebin oluşturuldu. Bir yetkili en kısa sürede yardımcı olacaktır.\n\nİlgilenecek olan yetkili: \`${interaction.user.tag}\``);
            ticketEmbed.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

            interaction.update({ embeds: [ticketEmbed], components: [row] });

            const CliamTicket = db.get(`Guild_${interaction.guild.id}.Ticket_System.Claim_Ticket_${interaction.user.id}`) || "0";

            if (!db.get(`Notify_System.User_${interaction.user.id}`)) {

                const UserMessage = new Discord.EmbedBuilder();

                UserMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                UserMessage.setColor(Config.Embed_Info.SuccessColor);
                UserMessage.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${interaction.user.id}>, Başarıyla <#${interaction.channel.id}> ticketını sahiplendiniz! Herhangi bir sorunda lütfen üst yetkililere haber veriniz!\n\nBaktığınız Ticket Sayısı: **${CliamTicket}**`);
                UserMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});
            
                interaction.user.send({ embeds: [UserMessage], components: [UserButton] });

            };  
            
            if (LogType) {
                    
                const LogMessage = new Discord.EmbedBuilder();

                LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                LogMessage.setColor(Config.Embed_Info.WarningColor);
                LogMessage.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${interaction.user.id}>, adlı kişi tarafından **Genel Soru/Sorun** ticket'ı claimlenildi! İşte Detaylar!`);
                LogMessage.addFields(

                    {name: `Yetkili Adı`, value: `\`\`\`yaml\n${interaction.user.username}\`\`\``, inline: true},
                    {name: `Yetkili Tag`, value: `\`\`\`yaml\n${interaction.user.tag}\`\`\``, inline: true},
                    {name: `Yetkili ID`, value: `\`\`\`yaml\n${interaction.user.id}\`\`\``, inline: true},
                    {name: `Üye Adı`, value: `\`\`\`yaml\n${TicketOwner.userName}\`\`\``, inline: true},
                    {name: `Üye Tag`, value: `\`\`\`yaml\n${TicketOwner.userTag}\`\`\``, inline: true},
                    {name: `Üye ID`, value: `\`\`\`yaml\n${TicketOwner.userID}\`\`\``, inline: true},
                    {name: `İşlem Zamanı`, value: `\`\`\`yaml\n${moment().locale("tr").format("LLL")}\`\`\``, inline: false},
                    {name: `Ticket Kanalı`, value: `\`\`\`yaml\n${interaction.channel.id}\`\`\``, inline: false}

                );
                LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

                LogChannel.send({ embeds: [LogMessage] });
  
            } else {

                const LogMessage = new Discord.EmbedBuilder();
        
                LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                LogMessage.setColor(Config.Embed_Info.WarningColor);
                LogMessage.setDescription(`**Ticket Cliamlendi!**

                **・** Yetkili: <@${interaction.user.id}>
                **・** Yetkili Tag: \`${interaction.user.tag}\`
                **・** Yetkili ID: \`${interaction.user.id}\`

                **・** Üye: <@${TicketOwner.userID}>
                **・** Üye Tag: \`${TicketOwner.userTag}\`
                **・** Üye ID: \`${TicketOwner.userID}\`

                **・** İşlem Zamanı: \`${moment().locale("tr").format("LLL")}\` - <t:${parseInt(Date.now() / 1000)}:R>            
                **・** Ticket Kanalı: <#${interaction.channel.id}> - (\`${interaction.channel.id}\`)
                **・** Ticket Sebepi: \`Genel Soru/Sorun\``
                );
                LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

                LogChannel.send({ embeds: [LogMessage] });

            };
    
        } else if (AdminRole0 && AdminRole1) {

            const permWarn = new Discord.EmbedBuilder();
    
            permWarn.setColor(Config.Embed_Info.DangerColor);
            permWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${interaction.user.id}>, Bu komutu kullanmak için yeterli yetkiniz bulunmuyor!`);
        
            if (![AdminRole0, AdminRole1, WhitelistRole0, Config.Roles_Info.Developer, Config.Roles_Info.Administrator, Config.Roles_Info.Director].some(r => Roles.has(r))) return interaction.reply({ embeds: [permWarn], ephemeral: true})

            const ticketEmbed = new Discord.EmbedBuilder();
        
            ticketEmbed.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
            ticketEmbed.setColor(Config.Embed_Info.SuccessColor);
            ticketEmbed.setDescription(`> Hey! <@${TicketOwner.userID}>, Destek talebin oluşturuldu. Bir yetkili en kısa sürede yardımcı olacaktır.\n\nİlgilenecek olan yetkili: \`${interaction.user.tag}\``);
            ticketEmbed.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});


            interaction.update({ embeds: [ticketEmbed], components: [row] });

            const CliamTicket = db.get(`Guild_${interaction.guild.id}.Ticket_System.Claim_Ticket_${interaction.user.id}`) || "0";

            if (!db.get(`Notify_System.User_${interaction.user.id}`)) {

                const UserMessage = new Discord.EmbedBuilder();

                UserMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                UserMessage.setColor(Config.Embed_Info.SuccessColor);
                UserMessage.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${interaction.user.id}>, Başarıyla <#${interaction.channel.id}> ticketını sahiplendiniz! Herhangi bir sorunda lütfen üst yetkililere haber veriniz!\n\nBaktığınız Ticket Sayısı: **${CliamTicket}**`);
                UserMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});
            
                interaction.user.send({ embeds: [UserMessage], components: [UserButton] });

            };
            
            if (LogType) {
                    
                const LogMessage = new Discord.EmbedBuilder();

                LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                LogMessage.setColor(Config.Embed_Info.WarningColor);
                LogMessage.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${interaction.user.id}>, adlı kişi tarafından **Genel Soru/Sorun** ticket'ı claimlenildi! İşte Detaylar!`);
                LogMessage.addFields(

                    {name: `Yetkili Adı`, value: `\`\`\`yaml\n${interaction.user.username}\`\`\``, inline: true},
                    {name: `Yetkili Tag`, value: `\`\`\`yaml\n${interaction.user.tag}\`\`\``, inline: true},
                    {name: `Yetkili ID`, value: `\`\`\`yaml\n${interaction.user.id}\`\`\``, inline: true},
                    {name: `Üye Adı`, value: `\`\`\`yaml\n${TicketOwner.userName}\`\`\``, inline: true},
                    {name: `Üye Tag`, value: `\`\`\`yaml\n${TicketOwner.userTag}\`\`\``, inline: true},
                    {name: `Üye ID`, value: `\`\`\`yaml\n${TicketOwner.userID}\`\`\``, inline: true},
                    {name: `İşlem Zamanı`, value: `\`\`\`yaml\n${moment().locale("tr").format("LLL")}\`\`\``, inline: false},
                    {name: `Ticket Kanalı`, value: `\`\`\`yaml\n${interaction.channel.id}\`\`\``, inline: false}

                );
                LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

                LogChannel.send({ embeds: [LogMessage] });
  
            } else {

                const LogMessage = new Discord.EmbedBuilder();
        
                LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                LogMessage.setColor(Config.Embed_Info.WarningColor);
                LogMessage.setDescription(`**Ticket Cliamlendi!**

                **・** Yetkili: <@${interaction.user.id}>
                **・** Yetkili Tag: \`${interaction.user.tag}\`
                **・** Yetkili ID: \`${interaction.user.id}\`

                **・** Üye: <@${TicketOwner.userID}>
                **・** Üye Tag: \`${TicketOwner.userTag}\`
                **・** Üye ID: \`${TicketOwner.userID}\`

                **・** İşlem Zamanı: \`${moment().locale("tr").format("LLL")}\` - <t:${parseInt(Date.now() / 1000)}:R>            
                **・** Ticket Kanalı: <#${interaction.channel.id}> - (\`${interaction.channel.id}\`)
                **・** Ticket Sebepi: \`Genel Soru/Sorun\``
                );
                LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

                LogChannel.send({ embeds: [LogMessage] });

            };

        } else {

            const permWarn = new Discord.EmbedBuilder();
    
            permWarn.setColor(Config.Embed_Info.DangerColor);
            permWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${interaction.user.id}>, Bu komutu kullanmak için yeterli yetkiniz bulunmuyor!`);
        
            if (![AdminRole0, WhitelistRole0, Config.Roles_Info.Developer, Config.Roles_Info.Administrator, Config.Roles_Info.Director].some(r => Roles.has(r))) return interaction.reply({ embeds: [permWarn], ephemeral: true})

            const ticketEmbed = new Discord.EmbedBuilder();
        
            ticketEmbed.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
            ticketEmbed.setColor(Config.Embed_Info.SuccessColor);
            ticketEmbed.setDescription(`> Hey! <@${TicketOwner.userID}>, Destek talebin oluşturuldu. Bir yetkili en kısa sürede yardımcı olacaktır.\n\nİlgilenecek olan yetkili: \`${interaction.user.tag}\``);
            ticketEmbed.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

            interaction.update({ embeds: [ticketEmbed], components: [row] });

            const CliamTicket = db.get(`Guild_${interaction.guild.id}.Ticket_System.Claim_Ticket_${interaction.user.id}`) || "0";

            if (!db.get(`Notify_System.User_${interaction.user.id}`)) {

                const UserMessage = new Discord.EmbedBuilder();

                UserMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                UserMessage.setColor(Config.Embed_Info.SuccessColor);
                UserMessage.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${interaction.user.id}>, Başarıyla <#${interaction.channel.id}> ticketını sahiplendiniz! Herhangi bir sorunda lütfen üst yetkililere haber veriniz!\n\nBaktığınız Ticket Sayısı: **${CliamTicket}**`);
                UserMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});
            
                interaction.user.send({ embeds: [UserMessage], components: [UserButton] });

            };

            if (LogType) {
                    
                const LogMessage = new Discord.EmbedBuilder();

                LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                LogMessage.setColor(Config.Embed_Info.WarningColor);
                LogMessage.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${interaction.user.id}>, adlı kişi tarafından **Genel Soru/Sorun** ticket'ı claimlenildi! İşte Detaylar!`);
                LogMessage.addFields(

                    {name: `Yetkili Adı`, value: `\`\`\`yaml\n${interaction.user.username}\`\`\``, inline: true},
                    {name: `Yetkili Tag`, value: `\`\`\`yaml\n${interaction.user.tag}\`\`\``, inline: true},
                    {name: `Yetkili ID`, value: `\`\`\`yaml\n${interaction.user.id}\`\`\``, inline: true},
                    {name: `Üye Adı`, value: `\`\`\`yaml\n${TicketOwner.userName}\`\`\``, inline: true},
                    {name: `Üye Tag`, value: `\`\`\`yaml\n${TicketOwner.userTag}\`\`\``, inline: true},
                    {name: `Üye ID`, value: `\`\`\`yaml\n${TicketOwner.userID}\`\`\``, inline: true},
                    {name: `İşlem Zamanı`, value: `\`\`\`yaml\n${moment().locale("tr").format("LLL")}\`\`\``, inline: false},
                    {name: `Ticket Kanalı`, value: `\`\`\`yaml\n${interaction.channel.id}\`\`\``, inline: false}

                );
                LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

                LogChannel.send({ embeds: [LogMessage] });
  
            } else {

                const LogMessage = new Discord.EmbedBuilder();
        
                LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                LogMessage.setColor(Config.Embed_Info.WarningColor);
                LogMessage.setDescription(`**Ticket Cliamlendi!**

                **・** Yetkili: <@${interaction.user.id}>
                **・** Yetkili Tag: \`${interaction.user.tag}\`
                **・** Yetkili ID: \`${interaction.user.id}\`

                **・** Üye: <@${TicketOwner.userID}>
                **・** Üye Tag: \`${TicketOwner.userTag}\`
                **・** Üye ID: \`${TicketOwner.userID}\`

                **・** İşlem Zamanı: \`${moment().locale("tr").format("LLL")}\` - <t:${parseInt(Date.now() / 1000)}:R>            
                **・** Ticket Kanalı: <#${interaction.channel.id}> - (\`${interaction.channel.id}\`)
                **・** Ticket Sebepi: \`Genel Soru/Sorun\``
                );
                LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

                LogChannel.send({ embeds: [LogMessage] });

            };

        };
        
        db.add(`Guild_${interaction.guild.id}.Ticket_System.Claim_Ticket_${interaction.user.id}`, +1);

    };
});

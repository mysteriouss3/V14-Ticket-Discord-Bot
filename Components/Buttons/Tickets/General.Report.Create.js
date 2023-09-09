const Config = require('../../../Src/Config.json');
const client = require('../../../index.js');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('croxydb');

client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton()) return;
    if (interaction.customId == "generalOpen") {

        const adminButton = new Discord.ButtonBuilder();
                
        adminButton.setStyle(Discord.ButtonStyle.Primary);
        adminButton.setLabel('🖐️・Talebi Al');
        adminButton.setCustomId("generalCliam");
    
        const closeButton = new Discord.ButtonBuilder();

        closeButton.setStyle(Discord.ButtonStyle.Danger);
        closeButton.setLabel('🗑️・Talebi Sonlandır');
        closeButton.setCustomId("generalClose");

        const row = new Discord.ActionRowBuilder().addComponents(adminButton, closeButton);

        const Roles = interaction.member.roles.cache;

        const Log = db.get(`Guild_${interaction.guild.id}.Log_System.Ticket_Log`);

        const LogChannel = interaction.guild.channels.cache.get(Log);

        const AdminRole = db.get(`Guild_${interaction.guild.id}.Role.General_Report_Role`);
        const WhitelistRole = db.get(`Guild_${interaction.guild.id}.Role.Whitelist_Role`);
        const Parent = db.get(`Guild_${interaction.guild.id}.Parent.CategoryID`);

        const LogType = db.get(`Guild_${interaction.guild.id}.Log_System.Log_Type`);

        const denyPermissions = [Discord.PermissionsBitField.Flags.ViewChannel];
        const allowPermissions = [ 
            Discord.PermissionsBitField.Flags.ViewChannel,
            Discord.PermissionsBitField.Flags.SendMessages,
            Discord.PermissionsBitField.Flags.ReadMessageHistory,
            Discord.PermissionsBitField.Flags.AttachFiles 
        ];

        const TicketQuestion = db.get(`Guild_${interaction.guild.id}.Ticket_System.Open_Ticket_${interaction.user.id}`)

        const AdminRole0 = AdminRole[0];
        const AdminRole1 = AdminRole[1];
        const AdminRole2 = AdminRole[2];
        const WhitelistRole0 = WhitelistRole[0];

        const OpenTicket = new Discord.EmbedBuilder();
                
        OpenTicket.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
        OpenTicket.setColor(Config.Embed_Info.DangerColor);
        OpenTicket.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${interaction.user.id}>, zaten şuan aktif bir ticketınız var lütfen yeni bir ticket açmadan önce diğer ticket'ın kapanmasını bekleyiniz!`);

        if (TicketQuestion) return interaction.update({ embeds: [OpenTicket], components: [] });

        if (AdminRole0 && AdminRole1 && AdminRole2) {

            interaction.guild.channels.create({
                     
                name: `ticket-${interaction.user.username}`,  
                type: Discord.ChannelType.GuildText,
                parent: Config.Category,
                reason: `${interaction.user.username} Adlı kullanıcı tarafından Genel Soru/Sorun amacıyla açıldı`,
                permissionOverwrites: [
                    
                    { id: interaction.guild.id, deny: denyPermissions },       
                    { id: interaction.user.id, allow: allowPermissions },
                    { id: AdminRole0, allow: allowPermissions },
                    { id: AdminRole1, allow: allowPermissions },
                    { id: AdminRole2, allow: allowPermissions },
                    { id: WhitelistRole0, allow: allowPermissions },

                ]       
            }).then((c) => {

                const OpenWarn = new Discord.EmbedBuilder();

                OpenWarn.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                OpenWarn.setColor(Config.Embed_Info.SuccessColor);
                OpenWarn.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${interaction.user.id}>, Başarıyla **Genel Soru/Sorun** ticketınız açıldı! <#${c.id}> Buraya basarak gidebilirsiniz!`);

                interaction.update({ embeds: [OpenWarn], components: [] });

                const ticketEmbed = new Discord.EmbedBuilder();
    
                ticketEmbed.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                ticketEmbed.setColor(Config.Embed_Info.SuccessColor);
                ticketEmbed.setDescription(`> Hey! <@${interaction.user.id}>, Destek talebin oluşturuldu. Bir yetkili en kısa sürede yardımcı olacaktır.\n\nİlgilenecek olan yetkili: \`Bekleniyor!\``);
                ticketEmbed.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});
                c.send({ embeds: [ticketEmbed], components: [row], content: `<@&${AdminRole0}>, <@&${AdminRole1}>, <@&${AdminRole2}>` });

                db.set(`Guild_${interaction.guild.id}.Ticket_System.Open_Ticket_${interaction.user.id}`, true);
                db.set(`ticketOwner_Info_${c.id}`, {
                    userTag: interaction.user.tag,
                    userName: interaction.user.username,
                    userID: interaction.user.id,
                });

                if (LogType) {

                    const LogMessage = new Discord.EmbedBuilder();

                    LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                    LogMessage.setColor(Config.Embed_Info.SuccessColor);
                    LogMessage.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${interaction.user.id}>, adlı kişi tarafından **Genel Soru/Sorun** kategorisinde ticket açıldı! İşte Detaylar!`);
                    LogMessage.addFields(

                        {name: `Üye Adı`, value: `\`\`\`yaml\n${interaction.user.username}\`\`\``, inline: true},
                        {name: `Üye Tag`, value: `\`\`\`yaml\n${interaction.user.tag}\`\`\``, inline: true},
                        {name: `Üye ID`, value: `\`\`\`yaml\n${interaction.user.id}\`\`\``, inline: true},
                        {name: `İşlem Zamanı`, value: `\`\`\`yaml\n${moment().locale("tr").format("LLL")}\`\`\``, inline: false},
                        {name: `Ticket Kanalı`, value: `\`\`\`yaml\n${c.id}\`\`\``, inline: false}

                    );
                    LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

                    LogChannel.send({ embeds: [LogMessage] });

                } else {

                    const LogMessage = new Discord.EmbedBuilder();
            
                        LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                        LogMessage.setColor(Config.Embed_Info.SuccessColor);
                        LogMessage.setDescription(`**Yeni Bir Ticket Açıldı!**

                        **・** Üye: <@${interaction.user.id}>
                        **・** Üye Tag: \`${interaction.user.tag}\`
                        **・** Üye ID: \`${interaction.user.id}\`

                        **・** İşlem Zamanı: \`${moment().locale("tr").format("LLL")}\` - <t:${parseInt(Date.now() / 1000)}:R>            
                        **・** Ticket Kanalı: <#${c.id}> - (\`${c.id}\`)
                        **・** Ticket Sebepi: \`Genel Soru/Sorun\``
                        );
                        LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

                        LogChannel.send({ embeds: [LogMessage] });

                };
            });
            
        } else if (AdminRole0 && AdminRole1) {

        const Parent = db.get(`Guild_${interaction.guild.id}.Parent.CategoryID`);

            interaction.guild.channels.create({
                     
                name: `ticket-${interaction.user.username}`,  
                type: Discord.ChannelType.GuildText,
                parent: Config.Category,
                reason: `${interaction.user.username} Adlı kullanıcı tarafından Genel Soru/Sorun amacıyla açıldı`,
                permissionOverwrites: [
                    
                    { id: interaction.guild.id, deny: denyPermissions },       
                    { id: interaction.user.id, allow: allowPermissions },
                    { id: AdminRole0, allow: allowPermissions },
                    { id: AdminRole1, allow: allowPermissions },
                    { id: WhitelistRole0, allow: allowPermissions },

                ]         
            }).then((c) => {

                const OpenWarn = new Discord.EmbedBuilder();

                OpenWarn.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                OpenWarn.setColor(Config.Embed_Info.SuccessColor);
                OpenWarn.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${interaction.user.id}>, Başarıyla **Genel Soru/Sorun** ticketınız açıldı! <#${c.id}> Buraya basarak gidebilirsiniz!`);

                interaction.update({ embeds: [OpenWarn], components: [] });

                const ticketEmbed = new Discord.EmbedBuilder();
    
                ticketEmbed.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                ticketEmbed.setColor(Config.Embed_Info.SuccessColor);
                ticketEmbed.setDescription(`> Hey! <@${interaction.user.id}>, Destek talebin oluşturuldu. Bir yetkili en kısa sürede yardımcı olacaktır.\n\nİlgilenecek olan yetkili: \`Bekleniyor!\``);
                ticketEmbed.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

                c.send({ embeds: [ticketEmbed], components: [row], content: `<@&${AdminRole0}>, <@&${AdminRole1}>` });

                db.set(`Guild_${interaction.guild.id}.Ticket_System.Open_Ticket_${interaction.user.id}`, true);
                db.set(`ticketOwner_Info_${c.id}`, {
                    userTag: interaction.user.tag,
                    userName: interaction.user.username,
                    userID: interaction.user.id,
                });

                if (LogType) {

                    const LogMessage = new Discord.EmbedBuilder();

                    LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                    LogMessage.setColor(Config.Embed_Info.SuccessColor);
                    LogMessage.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${interaction.user.id}>, adlı kişi tarafından **Genel Soru/Sorun** kategorisinde ticket açıldı! İşte Detaylar!`);
                    LogMessage.addFields(

                        {name: `Üye Adı`, value: `\`\`\`yaml\n${interaction.user.username}\`\`\``, inline: true},
                        {name: `Üye Tag`, value: `\`\`\`yaml\n${interaction.user.tag}\`\`\``, inline: true},
                        {name: `Üye ID`, value: `\`\`\`yaml\n${interaction.user.id}\`\`\``, inline: true},
                        {name: `İşlem Zamanı`, value: `\`\`\`yaml\n${moment().locale("tr").format("LLL")}\`\`\``, inline: false},
                        {name: `Ticket Kanalı`, value: `\`\`\`yaml\n${c.id}\`\`\``, inline: false}

                    );
                    LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

                    LogChannel.send({ embeds: [LogMessage] });

                } else {

                    const LogMessage = new Discord.EmbedBuilder();
            
                        LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                        LogMessage.setColor(Config.Embed_Info.SuccessColor);
                        LogMessage.setDescription(`**Yeni Bir Ticket Açıldı!**

                        **・** Üye: <@${interaction.user.id}>
                        **・** Üye Tag: \`${interaction.user.tag}\`
                        **・** Üye ID: \`${interaction.user.id}\`

                        **・** İşlem Zamanı: \`${moment().locale("tr").format("LLL")}\` - <t:${parseInt(Date.now() / 1000)}:R>            
                        **・** Ticket Kanalı: <#${c.id}> - (\`${c.id}\`)
                        **・** Ticket Sebepi: \`Genel Soru/Sorun\``
                        );
                        LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

                        LogChannel.send({ embeds: [LogMessage] });

                };
            });
            
        } else {

            const Parent = db.get(`Guild_${interaction.guild.id}.Parent.CategoryID`);
            
            interaction.guild.channels.create({
                     
                name: `ticket-${interaction.user.username}`,  
                type: Discord.ChannelType.GuildText,
                parent: Config.Category,
                reason: `${interaction.user.username} Adlı kullanıcı tarafından Genel Soru/Sorun amacıyla açıldı`,
                permissionOverwrites: [
                    
                    { id: interaction.guild.id, deny: denyPermissions },       
                    { id: interaction.user.id, allow: allowPermissions },
                    { id: AdminRole0, allow: allowPermissions },
                    { id: WhitelistRole0, allow: allowPermissions },

                ]       
            }).then((c) => {

                const OpenWarn = new Discord.EmbedBuilder();

                OpenWarn.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                OpenWarn.setColor(Config.Embed_Info.SuccessColor);
                OpenWarn.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${interaction.user.id}>, Başarıyla **Genel Soru/Sorun** ticketınız açıldı! <#${c.id}> Buraya basarak gidebilirsiniz!`);

                interaction.update({ embeds: [OpenWarn], components: [] });

                const ticketEmbed = new Discord.EmbedBuilder();
    
                ticketEmbed.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                ticketEmbed.setColor(Config.Embed_Info.SuccessColor);
                ticketEmbed.setDescription(`> Hey! <@${interaction.user.id}>, Destek talebin oluşturuldu. Bir yetkili en kısa sürede yardımcı olacaktır.\n\nİlgilenecek olan yetkili: \`Bekleniyor!\``);
                ticketEmbed.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

                c.send({ embeds: [ticketEmbed], components: [row], content: `<@&${AdminRole0}>` });

                db.set(`Guild_${interaction.guild.id}.Ticket_System.Open_Ticket_${interaction.user.id}`, true);
                db.set(`ticketOwner_Info_${c.id}`, {
                    userTag: interaction.user.tag,
                    userName: interaction.user.username,
                    userID: interaction.user.id,
                });

                if (LogType) {

                    const LogMessage = new Discord.EmbedBuilder();

                    LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                    LogMessage.setColor(Config.Embed_Info.SuccessColor);
                    LogMessage.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${interaction.user.id}>, adlı kişi tarafından **Genel Soru/Sorun** kategorisinde ticket açıldı! İşte Detaylar!`);
                    LogMessage.addFields(

                        {name: `Üye Adı`, value: `\`\`\`yaml\n${interaction.user.username}\`\`\``, inline: true},
                        {name: `Üye Tag`, value: `\`\`\`yaml\n${interaction.user.tag}\`\`\``, inline: true},
                        {name: `Üye ID`, value: `\`\`\`yaml\n${interaction.user.id}\`\`\``, inline: true},
                        {name: `İşlem Zamanı`, value: `\`\`\`yaml\n${moment().locale("tr").format("LLL")}\`\`\``, inline: false},
                        {name: `Ticket Kanalı`, value: `\`\`\`yaml\n${c.id}\`\`\``, inline: false}

                    );
                    LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

                    LogChannel.send({ embeds: [LogMessage] });

                } else {

                    const LogMessage = new Discord.EmbedBuilder();
            
                        LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
                        LogMessage.setColor(Config.Embed_Info.SuccessColor);
                        LogMessage.setDescription(`**Yeni Bir Ticket Açıldı!**

                        **・** Üye: <@${interaction.user.id}>
                        **・** Üye Tag: \`${interaction.user.tag}\`
                        **・** Üye ID: \`${interaction.user.id}\`

                        **・** İşlem Zamanı: \`${moment().locale("tr").format("LLL")}\` - <t:${parseInt(Date.now() / 1000)}:R>            
                        **・** Ticket Kanalı: <#${c.id}> - (\`${c.id}\`)
                        **・** Ticket Sebepi: \`Genel Soru/Sorun\``
                        );
                        LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

                        LogChannel.send({ embeds: [LogMessage] });

                };
            });
            
        };
    };
});

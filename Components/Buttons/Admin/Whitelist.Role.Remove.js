const Config = require('../../../Src/Config.json');
const client = require('../../../index.js');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('croxydb');

 
const WhitelistRemoveModal = new Discord.ModalBuilder();

WhitelistRemoveModal.setCustomId("WhitelistRemoveModal");
WhitelistRemoveModal.setTitle('Whitelist Role Remove');

const AdminContent = new Discord.TextInputBuilder();

AdminContent.setCustomId("RoleID");
AdminContent.setLabel('Lütfen bir rol idsi girin!');
AdminContent.setMinLength(5);
AdminContent.setStyle(Discord.TextInputStyle.Paragraph);
AdminContent.setRequired(true);

const StandartAnnounceRow = new Discord.ActionRowBuilder().addComponents(AdminContent);

WhitelistRemoveModal.addComponents(StandartAnnounceRow);

client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton()) return;
    if (interaction.customId == "WhitelistButtonRemove") {

        const ButtonAuthor = db.get(`Guild_${interaction.guild.id}.Button_Author.User_${interaction.message.id}`);

        if (interaction.user.id == ButtonAuthor) {

            await interaction.showModal(WhitelistRemoveModal);

        } else {

            const ButtonOwnerWarn = new Discord.EmbedBuilder();

            ButtonOwnerWarn.setColor(Config.Embed_Info.DangerColor);
            ButtonOwnerWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${interaction.user.id}>, Bu button size ait olmadığı için işlem yapamazsınız!`);

            interaction.reply({ embeds: [ButtonOwnerWarn], ephemeral: true})

        };

    };

});

client.on("interactionCreate", async (interaction) => {

    if (interaction.type !== Discord.InteractionType.ModalSubmit) return;
    if (interaction.customId === 'WhitelistRemoveModal') {

        const Log = db.get(`Guild_${interaction.guild.id}.Log_System.Ticket_Log`);

        const LogChannel = client.channels.cache.get(Log);

        const LogType = db.get(`Guild_${interaction.guild.id}.Log_System.Log_Type`);

        const RoleID = interaction.fields.getTextInputValue('RoleID');

        const Role = interaction.guild.roles.cache.get(RoleID);

        const RoleWarn = new Discord.EmbedBuilder();
  
        RoleWarn.setColor(Config.Embed_Info.DangerColor);
        RoleWarn.setDescription(`${Config.Embed_Info.DangerEmote} | Hey! <@${interaction.user.id}>, sunucuda bu id'ye ait bir rol bulunmamakta!`);

        if (!Role) return interaction.message.reply({ embeds: [RoleWarn]}).then( msg => {

            setTimeout( function()  {
                msg.delete();    
            }, 5000);
        });

        db.unpush(`Guild_${interaction.guild.id}.Role.Whitelist_Role`, RoleID );

        const SuccessWarning = new Discord.EmbedBuilder();
        
        SuccessWarning.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
        SuccessWarning.setColor(Config.Embed_Info.SuccessColor);
        SuccessWarning.setDescription(`${Config.Embed_Info.SuccessEmote} | Hey! <@${interaction.user.id}>, Başarıyla "<@&${RoleID}>" adlı rol whitelist rolünden kaldırıldı!`);

        interaction.reply({ embeds: [SuccessWarning], components: [] });

        interaction.message.delete();

        if (LogType) {
                    
            const LogMessage = new Discord.EmbedBuilder();

            LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
            LogMessage.setColor(Config.Embed_Info.WarningColor);
            LogMessage.setDescription(`${Config.Embed_Info.WarningEmote} | Hey! <@${interaction.user.id}>, adlı yetkili tarafından Whitelist rolü kaldırıldı! İşte Detaylar!`);
            LogMessage.addFields(

                {name: `Yetkili Adı`, value: `\`\`\`yaml\n${interaction.user.username}\`\`\``, inline: true},
                {name: `Yetkili Tag`, value: `\`\`\`yaml\n${interaction.user.tag}\`\`\``, inline: true},
                {name: `Yetkili ID`, value: `\`\`\`yaml\n${interaction.user.id}\`\`\``, inline: true},
                {name: `İşlem Zamanı`, value: `\`\`\`yaml\n${moment().locale("tr").format("LLL")}\`\`\``, inline: false},
                {name: `Kaldırılan Rol`, value: `\`\`\`yaml\n${RoleID}\`\`\``, inline: false}

            );
            LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}`});

            LogChannel.send({ embeds: [LogMessage] });

        } else {

            const LogMessage = new Discord.EmbedBuilder();
    
            LogMessage.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
            LogMessage.setColor(Config.Embed_Info.WarningColor);
            LogMessage.setDescription(`**Whitelist Rolü Kaldırıldı!**

            **・** Yetkili: <@${interaction.user.id}>
            **・** Yetkili Tag: \`${interaction.user.tag}\`
            **・** Yetkili ID: \`${interaction.user.id}\`

            **・** İşlem Zamanı: \`${moment().locale("tr").format("LLL")}\` - <t:${parseInt(Date.now() / 1000)}:R>            
            **・** Kaldırılan Rol: <@&${RoleID}> - (\`${RoleID}\`)`
            );
            LogMessage.setFooter({ text: `${Config.Embed_Info.FooterText}`, iconURL: `${Config.Embed_Info.FooterImage}` });

            LogChannel.send({ embeds: [LogMessage] });

        };

    };
});
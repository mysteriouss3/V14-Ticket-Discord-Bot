const Config = require('../../../Src/Config.json');
const client = require('../../../index.js');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('croxydb');

client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton()) return;
    if (interaction.customId == "NotifyClose") {

        if (db.get(`Notify_System.User_${interaction.user.id}`)) {

            const Notify = new Discord.ButtonBuilder();
        
            Notify.setCustomId("NotifyOpen");
            Notify.setEmoji(Config.Embed_Info.SuccessEmote);
            Notify.setLabel("・Bildirimleri Kapat!");
            Notify.setStyle(Discord.ButtonStyle.Primary);

            const UserButton = new Discord.ActionRowBuilder().addComponents(Notify);
        
            interaction.update({ components: [UserButton] });

            db.delete(`Notify_System.User_${interaction.user.id}`);

        } else {

            const Notify = new Discord.ButtonBuilder();
        
            Notify.setCustomId("NotifyClose");
            Notify.setEmoji(Config.Embed_Info.SuccessEmote);
            Notify.setLabel("・Bildirimleri Aç!");
            Notify.setStyle(Discord.ButtonStyle.Primary);

            const UserButton = new Discord.ActionRowBuilder().addComponents(Notify);
        
            interaction.update({ components: [UserButton] });
                        
            db.set(`Notify_System.User_${interaction.user.id}`, true);
            
        }

    };
});

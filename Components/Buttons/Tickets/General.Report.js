const Config = require('../../../Src/Config.json');
const client = require('../../../index.js');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('croxydb');


client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton()) return;
    if (interaction.customId == "generalProblem") {

        const openQuestion = new Discord.EmbedBuilder();

        openQuestion.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
        openQuestion.setColor(Config.Embed_Info.WarningColor);
        openQuestion.setDescription(`Merhaba, <@${interaction.user.id}>! **Genel Soru/Sorun** Kategorisinde bir destek talebi oluşturmak istediğinize emin misiniz? Bu buton amacına uygun kullanılmadığında ceza-i işlem uygulanacaktır!`);

        const generalOpen = new Discord.ButtonBuilder();

        generalOpen.setCustomId("generalOpen");
        generalOpen.setLabel(`👍・Evet`);
        generalOpen.setStyle(Discord.ButtonStyle.Primary);

        const generalDont = new Discord.ButtonBuilder();

        generalDont.setCustomId("generalDont");
        generalDont.setLabel(`👎・Hayır`);
        generalDont.setStyle(Discord.ButtonStyle.Danger);

        const openTicket = new Discord.ActionRowBuilder().addComponents(generalOpen, generalDont);
        interaction.reply({ embeds: [openQuestion], components: [openTicket], ephemeral: true });

    };
});

client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton()) return;
    if (interaction.customId == "generalDont") {

        const generalDont = new Discord.EmbedBuilder();

        generalDont.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
        generalDont.setColor(Config.Embed_Info.DangerColor);
        generalDont.setDescription(`${Config.Embed_Info.UnsuccessEmote} | Hey! <@${interaction.user.id}>, **Genel Soru/Sorun** Kategorisinde açmaya çalıştığınız ticket sizin tarafınızdan başarıyla iptal edildi!`);

        interaction.update({ embeds: [generalDont], components: [] });

    };
});
const Config = require('../../../Src/Config.json');
const client = require('./../../../index.js');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('croxydb');


client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton()) return;
    if (interaction.customId == "officialComplaint") {

        const Roles = interaction.member.roles.cache;

        const openQuestion = new Discord.EmbedBuilder();

        openQuestion.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
        openQuestion.setColor(Config.Embed_Info.WarningColor);
        openQuestion.setDescription(`Merhaba, <@${interaction.user.id}>! **Yetkili Şikayeti** Kategorisinde bir destek talebi oluşturmak istediğinize emin misiniz? Bu buton amacına uygun kullanılmadığında ceza-i işlem uygulanacaktır!`);

        const officialOpen = new Discord.ButtonBuilder();

        officialOpen.setCustomId("officialOpen");
        officialOpen.setLabel(`👍・Evet`);
        officialOpen.setStyle(Discord.ButtonStyle.Primary);

        const officialDont = new Discord.ButtonBuilder();

        officialDont.setCustomId("officialDont");
        officialDont.setLabel(`👎・Hayır`);
        officialDont.setStyle(Discord.ButtonStyle.Danger);

        const openTicket = new Discord.ActionRowBuilder().addComponents(officialOpen, officialDont);
        interaction.reply({ embeds: [openQuestion], components: [openTicket], ephemeral: true });

    };
});

client.on("interactionCreate", async (interaction) => {

    if (!interaction.isButton()) return;
    if (interaction.customId == "officialDont") {

        const officialDont = new Discord.EmbedBuilder();

        officialDont.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}`});
        officialDont.setColor(Config.Embed_Info.DangerColor);
        officialDont.setDescription(`${Config.Embed_Info.UnsuccessEmote} | Hey! <@${interaction.user.id}>, **Yetkili Şikayet** Kategorisinde açmaya çalıştığınız ticket sizin tarafınızdan başarıyla iptal edildi!`);

        interaction.update({ embeds: [officialDont], components: [] });

    };
});
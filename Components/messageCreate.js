const Config = require('../Src/Config.json')
const Discord = require('discord.js');
const client = require("../index.js");
const moment = require('moment');
const db = require('croxydb');

client.on("messageCreate", async(message) => {
   if(!message.guild) return; 
   if(message.channel.name.includes("ticket")) {

    if(message.author?.bot) return;
      
    db.push(`TicketMessageLog.Guild_${message.guild.id}.Message${message.channel.id}`, `${moment().locale("tr").format("LLL")} - ${message.author.username} - (${message.author.id}): ${message.content}`)   
    }
})
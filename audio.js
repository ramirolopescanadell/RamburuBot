function mostrarError(message,Discord){
	 const embed = new Discord.MessageEmbed() 
		.setColor('BLUE') 
		.setTitle('Tenes que entrar a un chat de voz')
		.setThumbnail('https://media.giphy.com/media/Y3x0dWdrMDttppLdZ6/giphy.gif')
		.setDescription("Tenes que entrar a un canal de voz para que el botardo entre\n Abrazo grande a la flia" )
		.setTimestamp()
		.setFooter(message.member.displayName +  ' no entiende nada' , message.author.displayAvatarURL());
	message.channel.send(embed);
}

module.exports = {
	tocToc:  async function(message,Discord){
		if (!message.guild) return;

	    if (message.member.voice.channel) {
	      
	      const connection = await message.member.voice.channel.join();
		  const dispatcher = connection.play('sonidos/toctoc.mp3');


		  dispatcher.on('finish', () => {
  			message.member.voice.channel.leave();
			});
		  
	    } else {
	      mostrarError(message, Discord);
	    }
	}
}
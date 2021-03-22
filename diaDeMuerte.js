function mostrarDia(fechaMuerte,Discord,msg){
	const embed = new Discord.MessageEmbed() 
		.setColor('PURPLE') 
		.setTitle("Día de tu muerte")
		.setThumbnail('https://media.giphy.com/media/BvC7TmEd7odbi/giphy.gif')
		.setDescription(`Te vas a morir el **${fechaMuerte}**`)
		.setFooter(msg.member.displayName +  ' quiere saber que día morirá' , msg.author.displayAvatarURL());
	return embed
}
module.exports = {
	seleccionarDia: function(Discord,message){
		let desde = new Date();
		let hasta = new Date(2050,0,0);
		let date = new Date(desde.getTime() + Math.random() * (hasta.getTime() - desde.getTime()));
		let dia = date.getDate();
		let mes = date.toLocaleString('es-AR', { month: 'long' })
		let anio = date.getFullYear();
		let fechaMuerte = `${dia} de ${mes} de ${anio}`
		return mostrarDia(fechaMuerte,Discord,message);
	}
}

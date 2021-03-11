const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');

/* CLASE AHORCADO DE AQUI PARA ABAJO*/
function Ahorcado(msg){
	this.palabra;
	this.iniciado = false;
	this.adivinadas;
	this.ingresadas = "\u200b";
	this.primera = true;
	this.erradas = 1;
	
	this.mostrarIngresadas = function(){
		var aux = this.ingresadas[0];
		for(i = 1; i< this.ingresadas.length; i++){
			aux += " :regional_indicator_" + this.ingresadas[i] + ": "
		}
		return aux;
	}
	
	this.mostrarPalabra = function(){
		var aux = " ";
		for(i = 0; i < this.palabra.length; i++){
			if(this.palabra[i] == " "){
					aux += "  ";
					this.adivinadas[i] = true;
			}else if(this.adivinadas[i]){
				var emoji = " :regional_indicator_" + this.palabra[i] + ": ";
				aux += emoji;
			}else{
				aux += " :red_circle: "
			}
		}
		return aux;
	}
	this.mostrarAhorcado =  function(msg){
	 const file = new Discord.MessageAttachment(`C:/Users/ramir/Desktop/DiscordBot/imagenes/${this.erradas}.png`, `${this.erradas}.png`);
	 const embed = new Discord.MessageEmbed() 
		.setColor('BLUE') 
		.setTitle('Ahorca2')
		//.setThumbnail(`attachment://${this.erradas}.png`)
		.setAuthor(msg.member.displayName, msg.author.displayAvatarURL())
		.setDescription('Progreso de la partida:')
		.setTimestamp()
		.setFooter(msg.member.displayName +  ' esta jugando al ahorcado' , msg.author.displayAvatarURL());
		embed.addField(this.mostrarPalabra(),"\u200b");
		embed.addField("Letras ingresadas:" , this.mostrarIngresadas());
		embed.addField("Te quedan " , `${ 7 - this.erradas} intentos`);
		if(this.primera){ 
			embed.addField("Como jugar:",'escriba el comando `ram ahorcado <letra minuscula>`');
			this.primera = false;
		}
		msg.channel.send(embed);
	}
	this.removeAccents = function(str){
	  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	} 
	this.iniciar = function(msg){
		if (this.iniciado == false){
			this.iniciado = true;
			const xml = new XMLHttpRequest();
			xml.open("GET", "https://www.aleatorios.com/", false);
			xml.send(null);
			var pos = xml.responseText.indexOf("<h1>");
			var pos2 = xml.responseText.indexOf('<div class="dropdown search-button">');
			var aux = xml.responseText.slice(pos+4,pos2);
			this.palabra = this.removeAccents(aux.trim());
			this.adivinadas = new Array(this.palabra.length);
			for(i= 0; i < this.palabra.length; i++){
				this.adivinadas[i] = false;
			}
		}
		this.mostrarAhorcado(msg);
	}
	this.msgError = function(msg){
		const embed = new Discord.MessageEmbed() 
		.setColor('RED') 
		.setTitle('Ingresate mal algo compa')
		.setThumbnail('https://media.giphy.com/media/3oKIPvQWkVBKRkPYJy/giphy.gif')
		.setDescription("Solo se pueden poner letras en minuscula, gracias por su atencion " )
		.setTimestamp()
		.setFooter(msg.member.displayName +  ' hace todo mal' , msg.author.displayAvatarURL());
	msg.channel.send(embed);
	}
	this.msgError2 = function(msg){
		const embed = new Discord.MessageEmbed() 
		.setColor('RED') 
		.setTitle('Esta partida ya termino')
		.setThumbnail('https://media.giphy.com/media/3oKIPvQWkVBKRkPYJy/giphy.gif')
		.setDescription('Para jugar una nueva partida pone `ram ahorcado` sin letras al lado' )
		.setTimestamp()
		.setFooter(msg.member.displayName +  ' es una dulzura' , msg.author.displayAvatarURL());
	msg.channel.send(embed);
	}
	this.ganar = function(msg){
		const embed = new Discord.MessageEmbed() 
			.setColor('GREEN') 
			.setTitle('!Ganaste preciosa!')
			.setThumbnail('https://media.giphy.com/media/26BkNituin1dca6GI/giphy.gif')
			.setDescription("La palabra era\n" +  this.mostrarPalabra() )
			.setTimestamp()
			.setFooter(msg.member.displayName +  ' hizo algo bien al fin' , msg.author.displayAvatarURL());
		msg.channel.send(embed);
		this.iniciado = false;
	}
	this.perder = function(msg){
		var aux = " ";
		for(var i=0;i < this.palabra.length;i++ ){
			aux += " :regional_indicator_" + this.palabra[i] + ": ";
		}
		const embed = new Discord.MessageEmbed() 
			.setColor('RED') 
			.setTitle('!Perdiste mi rey!')
			.setThumbnail('https://media.giphy.com/media/dkuZHIQsslFfy/giphy.gif')
			.setDescription("La palabra era:\n" +  aux )
			.setTimestamp()
			.setFooter(msg.member.displayName +  ' es un fracasado' , msg.author.displayAvatarURL());
		msg.channel.send(embed);
		this.iniciado = false;
	}
	this.insertarLetra = function(msg,letra){
		if(this.iniciado){
			if((letra[0].match(/\w/) != null) && (letra[0].match(/[^0-9]/) != null)){
				var encontreAlgo = false;
				for(i = 0; i < this.palabra.length; i++){
					if(this.palabra[i] == letra[0]){
						this.adivinadas[i] = true;
						encontreAlgo = true;
					}
					if(!this.ingresadas.includes(letra[0])){
						this.ingresadas += letra[0];
					}
				}
				if(!encontreAlgo){
					this.erradas ++;
				}
				if(!this.adivinadas.includes(false)){
					this.ganar(msg);
				}else if(this.erradas == 7){
					this.perder(msg);
				}else{
					this.mostrarAhorcado(msg);
				}
			}else{
				this.msgError(msg);
			}
		}else{
			this.msgError2(msg);
		}
	}
}
/* CLASE AHORCADO HASTA ACA*/

module.exports = Ahorcado;
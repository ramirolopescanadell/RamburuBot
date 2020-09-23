const Discord = require('discord.js');
const client = new Discord.Client();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const adjetivos = ["pelotudo/a","boludo/a","inutil","enfermo mental","lindo","suripanta","hermoso/a",
"especial","amigo/a de ricardo","el amor de mi vida","cornudo/a","pito duro","culo gordo","teton/a","pitocorto",
"pito largo","presidente de la republica","virgo/a","sexy","de izquierda","de derecha","peronista",
"otaku","amigo/a de stampone", "corrupto/a", "infumable", "¡AYUDA NO SOY NINGUN BOT, ME TIENEN SECUESTRADO!", "de niuels"];
const cant = adjetivos.length;

const comandos = ["ping","ricardo","hola","chau","que soy?", "ahorcado", "boca"];
var ahorcados = [];


function mostrarAyuda(message){
	 const embed = new Discord.MessageEmbed() 
		.setColor('0xD8791B') 
		.setTitle('Menu de ayuda')
		.setThumbnail('https://media.giphy.com/media/EHHi29hCF0hlm/giphy.gif')
		.setAuthor(message.member.displayName, message.author.displayAvatarURL())
		.setDescription('Este es un bot casero hecho por ramburu')
		.addField( 'Comandos existentes:',`**ping** --> El bot te responde
		**ricardo** -->  El bot te pone en tu lugar\n **hola** -->El bot te saluda
		**que soy?** --> El bot te dice que sos\n **chau** --> El bot te dice adios
		**ahorcado** --> Para jugar al ahorcado\n **elegir** --> El bot te ahorra tomar deciciones`)
		.setTimestamp()
		.setFooter(message.member.displayName +  ' necesita ayuda psicologica' , message.author.displayAvatarURL());
	message.channel.send(embed);
}

function mostrarError(message){
	 const embed = new Discord.MessageEmbed() 
		.setColor('RED') 
		.setTitle('Comando desconocido')
		.setThumbnail('https://media.giphy.com/media/6uGhT1O4sxpi8/giphy.gif')
		.setDescription("El comando" + ` **${message.content.substring(4)}**` +  " no existe compa\n Usa el comando `ram help` " )
		.setTimestamp()
		.setFooter(message.member.displayName +  ' no se sabe los comandos' , message.author.displayAvatarURL());
	message.channel.send(embed);
}
function iniciarAhorcado(message){
	if((ahorcados[message.channel.id] == null) || (!ahorcados[message.channel.id].iniciado)){
			ahorcados[message.channel.id] = new Ahorcado(message);
			ahorcados[message.channel.id].iniciar(message);
	}else{
		message.channel.send("ya hay un juego empezado");
	}
}
function elegir(msg){
	var aux = msg.content.substring(11).split(",");
	var num = Math.floor(Math.random()*aux.length);
	var color,titulo,gif;
	if(aux == ""){
		color = "RED";
		titulo = "Tenes que poner opciones separadas por coma despues del comando `ram elegir` ";
		gif = 'https://media.giphy.com/media/6uGhT1O4sxpi8/giphy.gif';
	}else{
		color = "GREEN";
		titulo = `La opcion que eligio el botardo es:\n **${aux[num]}**`;
		gif = 'https://media.giphy.com/media/3og0Iwmv38WmJBrYvS/giphy.gif';
	}
	 const embed = new Discord.MessageEmbed() 
		.setColor(color) 
		.setTitle("El botardo que vota")
		.setThumbnail(gif)
		.setDescription(titulo )
		.setTimestamp()
		.setFooter(msg.member.displayName +  ' no quiere tomar sus propias deciciones ' , msg.author.displayAvatarURL());
	if(num == 0){
		embed.addField("Ejemplo: ", "`ram elegir opcion1, opcion2, opcion3` ");
	}
	msg.channel.send(embed);
}
client.on('ready', () => {
	console.log("Listo");
});

client.on('message', message =>{
	if(message.content.startsWith('ram ')){
		var letra = message.content.split(" ",4)[2];
		if((message.content.includes(comandos[5])) && (letra != undefined) && (ahorcados[message.channel.id] != undefined) ){
				ahorcados[message.channel.id].insertarLetra(message,letra);
		}else if(message.content.includes("elegir")){
			elegir(message);
		}else{
			switch(message.content.substring(4)){
				case comandos[0]: message.reply('pong'); break;
				case comandos[1]: message.channel.send('RICARDO ES DE RAMIRO'); break;
				case comandos[2]: message.channel.send(`Hola ${message.author} te amo!`); break;
				case comandos[3]: message.channel.send(`Al fin te vas ${message.author}!`); break;
				case comandos[4]: message.reply('Sos re ' + adjetivos[Math.floor(Math.random() * cant)]);break;
				case comandos[5]: iniciarAhorcado(message); break;
				case comandos[6]: message.channel.send("equipo chico");break;
				case 'help': mostrarAyuda(message);break;
				default : mostrarError(message);
				//case '': break;
			}
		}
	}
});
client.login('NzU1OTI2MjQ3OTA5MDk3NTAy.X2KZLQ.F4EjVXFORkTHsPx9xdPB9qMqzqc');

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
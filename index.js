const Discord = require('discord.js');
const client = new Discord.Client();
const Ahorcado = require('./ahorcado.js');
const wikiApi = require('./wiki-Api.js');
const Audio = require('./audio.js');
const diaDeMuerte = require('./diaDeMuerte.js');
//const Recordatorio = require('./recordatorio.js');

const adjetivos = ["inutil","lindo","suripanta","hermoso","especial","el amor de mi vida","presidente de la republica",
"sexy","de izquierda","de derecha","peronista","otaku", "corrupto", "infumable", "?AYUDA NO SOY NINGUN BOT, ME TIENEN SECUESTRADO!",
"de niuels"];
const cant = adjetivos.length;

const comandos = ["ping","ricardo","hola","chau","que soy?", "ahorcado", "boca", "day", "toctoc", "muerte"];
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
		**ahorcado** --> Para jugar al ahorcado\n **elegir** --> El bot te ahorra tomar deciciones
		**day** --> Novedades sobre el dia de hoy\n **toctoc** --> Te tocan la puerta
		**muerte** --> El bot te dice que d?a vas a morir`)
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
	if(aux == ""){
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
		}else if(message.content.startsWith("ram elegir")){
			elegir(message);
		/*}else if(message.content.startsWith("ram recordame")){
			message.channel.send(Recordatorio.recordame(message));*/
		}else{
			switch(message.content.substring(4)){
				case comandos[0]: message.reply('pong'); break;
				case comandos[1]: message.channel.send('RICARDO ES DE RAMIRO'); break;
				case comandos[2]: message.channel.send(`Hola ${message.author} te amo!`); break;
				case comandos[3]: message.channel.send(`Al fin te vas ${message.author}!`); break;
				case comandos[4]: message.reply('Sos re ' + adjetivos[Math.floor(Math.random() * cant)]);break;
				case comandos[5]: iniciarAhorcado(message); break;
				case comandos[6]: message.channel.send("equipo chico");break;
				case comandos[7]: message.channel.send(wikiApi.consulta(message)); break;
				case comandos[8]: Audio.tocToc(message,Discord); break;
				case comandos[9]: message.channel.send(diaDeMuerte.seleccionarDia(Discord,message));break;
				case 'help': mostrarAyuda(message);break;
				default : mostrarError(message);
			}
		}
	}
});
let token;
try{
	const config = require('./config.json');
	token = config.token;
}catch(error){
	token = process.env.TOKEN;
}
client.login(token);
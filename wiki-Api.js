const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');

function getToday(date){
	day = date.getDate();
	month = date.toLocaleString('default', { month: 'long' })
	return `${day} de ${month}`
} 

function getInternationalFestivitys(xml, days){
	let pos_international_begin = xml.responseText.indexOf("<tbody>");
	let pos_international_end = xml.responseText.indexOf("</tbody>"); 
	let international_content = xml.responseText.slice(pos_international_begin,pos_international_end);
	let international_days = international_content.split("<tr>");

	let day, begin, end, festivity, pos_a;

	for (var i = 1; i <= international_days.length - 1; i++) {
		festivity = international_days[i].split("<td")[1];
		begin = festivity.indexOf("title");
		end = festivity.indexOf("</a>");
		festivity = festivity.slice(begin,end).split('">')[1];

		day = international_days[i].split("<td")[3];
		begin = day.indexOf('>');
		end = day.indexOf("</td>");

		day = day.slice(begin+1,end);

		pos_a = day.indexOf("<a");

		if(pos_a >= 0){
			begin = day.indexOf('">');
			end = day.indexOf("</a>");
			day = day.slice(begin+2,end);
		}
		days.push({
			key: day,
			value: festivity
		});
	}

}

function getFestivityList(xml,days){
	let begin = xml.responseText.indexOf('id="Otras_festividades_de_carácter_internacional"');
	let end = xml.responseText.indexOf('id="Véase_también"');
	let festivitys = xml.responseText.slice(begin,end);

	festivitys = festivitys.split("<li>");

	let festivity,day,data;

	let regex = /(<([^>]+)>)/ig


	for (var i = 1; i <= festivitys.length - 1; i++) {
		begin = 0;
		end = festivitys[i].indexOf("</li>");
		data = festivitys[i].slice(begin,end);

		data = data.split(":");
		
		begin = data[0].indexOf('">');
		end = data[0].indexOf('</a>');
		if(end >= 0){
			festivity = data[0].slice(begin+2,end);
		}else{
			festivity = data[0]
		}
		day = data[1];
		
		//Se guardan solamente las festividades que poseen una fecha.
		if(day){
			days.push({
				key: day,
				value: festivity
			});
			day = day.replace(regex, "");
			festivity = festivity.replace(regex, "");
		}
	}
}

function findDay(element,today){
	bool1 = element.key.includes(today);
	bool2 = element.value.includes(today);
	return bool1 || bool2;
}
function prettyMessage(day,msg){
	const embed = new Discord.MessageEmbed() 
		.setColor('BLUE') 
		.setTitle("Festividad del día")
		.setThumbnail('https://media.giphy.com/media/eHEmsqSW9B53K65dnS/giphy.gif')
		.setDescription(`Día: **${day.key}**\n Festividad: **${day.value}**`)
		.setFooter(msg.member.displayName +  ' quiere saber que ocurre hoy' , msg.author.displayAvatarURL());
	return embed
}

function nextFestivityMessage(day,msg){
	const embed = new Discord.MessageEmbed() 
		.setColor('BLUE') 
		.setTitle("Festividad más próxima")
		.setThumbnail('https://media.giphy.com/media/eHEmsqSW9B53K65dnS/giphy.gif')
		.setDescription(`Hoy no hay ninguna festividad.\n La más cercana es la siguiente\n 
			Día: **${day.key}**\n Festividad: **${day.value}**`)
		.setFooter(msg.member.displayName +  ' quiere saber que ocurre hoy' , msg.author.displayAvatarURL());
	return embed
}

module.exports= {
	consulta: function (msg){
		const xml = new XMLHttpRequest();
		xml.open("GET", "https://es.wikipedia.org/wiki/Anexo:Festividades_y_celebraciones", false);
		xml.send(null);


		let days = [];
		getInternationalFestivitys(xml,days);
		getFestivityList(xml,days);

		let now = new Date();
		today = getToday(now);

		let selectedDay = days.find(element => findDay(element,today));
		if(selectedDay){
			return prettyMessage(selectedDay,msg);
		}else{
			let additionalDays = 1;
			while(selectedDay == undefined){
				now.setDate(new Date().getDate()+additionalDays);
				selectedDay = days.find(element => findDay(element,getToday(now)));
				additionalDays ++;
			}
			return nextFestivityMessage(selectedDay,msg);
		}
	}
}; 
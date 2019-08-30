let texto = document.getElementById('texto'),
cargando = document.getElementById("load"),
oyendo = document.getElementById("oyendo");

const recognition = 'webkitSpeechRecognition' in window;

function escuchar() {
	if(recognition){
		let aBuscar = "";
		// configuraciones básicas de la API
		let rec = new webkitSpeechRecognition();
		rec.lang = "es-VE";
		// rec.continuous = true;
		rec.interimResults = true;
		oyendo.innerText = "escuchando";
		rec.start(); // comenzar a escuchar
		// evento para controlar los resultados escuchados
		rec.addEventListener("result", mostrarParaBuscar);
		// mostrar en pantalla lo que dijo el usuario
		function mostrarParaBuscar(ev){
			let r = ev.results;
			texto.textContent = "";
			
			for(let i = ev.resultIndex; i < r.length; i++){
				texto.textContent = r[i][0].transcript;
				// si termino de escuchar
				if(r[i].isFinal) {
					aBuscar = r[i][0].transcript;
					oyendo.innerText = "";
					// empezar a buscar en internet
					buscar(aBuscar.toLowerCase());
				}; 
			}
		}

	}
	// si no es compatible
	else{
		alert("lo siento, tu navegador no es compatible con esta app \n prueba con Chrome");
	}
}



// buscar en internet ó hacer otras cosas
function buscar(queQuiere){
	cargando.innerText = "cargando";
	// expresiones regulares para ver que es lo que quiere el usuario
	const buscarPorYotube = /^youtube|buscar (en)? youtube|(en)? youtube$/, 
	buscarPorGoogle = /buscar|google/,
	decir = /^(decir|decir esto|repetir)/,
	recargar = /recargar|recargar página|f5|efe cinco/;
	// console.log(`que quiero: 
 // 	buscar por youtube: ${buscarPorYotube.test(queQuiere)}
 // 	buscar por google: ${buscarPorGoogle.test(queQuiere)}
 // 	decir: ${decir.test(queQuiere)}
 // 	recargar: ${recargar.test(queQuiere)}
	// 	`)
	let query = ""; // string que se buscará

	cargando.innerText = "";
	// #######  buscar o hacer algo dependiendo de que se pidió  #######
	// *** buscar por youtube ***
	if(buscarPorYotube.test(queQuiere)){
		query = queQuiere.replace(buscarPorYotube,"");
		// ver si no empieza con "como" para poder quitar la palabra "buscar"
		// y de esa manera no redundar en un query "buscar tal video en youtube"
		// para que quede asi 					   "tal video" , y se busque en youtube claro 
		query = /^(como|cómo)/.test(query) ? query : query.replace("buscar", "");
		console.log(query);
		// abrir busqueda en otra pestaña
		window.open(`https://www.youtube.com/results?search_query=${query.replace(/ /g,"+")}`,"__blank");
	}
	// *** buscar por google ***
	else if(buscarPorGoogle.test(queQuiere)){
		query = queQuiere.replace(/^(google|buscar)/,"");
		window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`,"__blank");

	}
	// *** decir algo ***
	else if(decir.test(queQuiere)){
		query = queQuiere.replace(decir,"");
		console.log("decir: ", query)
		// voz con la que habla
		let voz = speechSynthesis.getVoices().filter( v => v.lang == "es-ES")[0];
		// preparar mensaje
		let mensaje = new SpeechSynthesisUtterance();
		mensaje.text = query;
		mensaje.voice = voz;
		speechSynthesis.speak(mensaje);
	}
	// *** recargar página ***
	else if(recargar.test(queQuiere)){
		location.reload();
	}


}
//FUNCTION GET
async function getResquest(url) {
    let response = await fetch(url);

    if (response.ok) { // if HTTP-status is 200-299
        // get the response body
        let json = await response.json();
        return json;
    } else {
        let message = await response.text();
        throw new Error("une erreur est survenu" + message);
    }
}

function getUrlParamId() {
	let currentURL = document.location.href;
	let param = currentURL.split('=')[1];
	return param;
}
//génération du fond noir sous le slider
function sliderBackground() {
	const heightBackgroundBack = document.getElementById('ancreBackgroundBlack').scrollHeight;
	const backgroundBlack = document.getElementById('backgroundBlack');
	backgroundBlack.style.height = `${heightBackgroundBack}px`;
}

function DynamicGestionSliderBackground() {
	btnPrev = document.getElementById('btn-carousel-prev');
	btNext = document.getElementById('btn-carousel-next');
	btnPrev.addEventListener('click', () => {
		setTimeout(() => {sliderBackground();},650);
	});
	btNext.addEventListener('click', () => {
		setTimeout(() => {sliderBackground();},650);
	});
	window.onresize = sliderBackground;
}

async function createEventPage(event) {
	// generation du slider avec les images event.slider
	const carousel = document.getElementById('carousel-inner');
	for (let i = 0; i < event.slider.length; i++) {
		console.log(event.slider[i]);
		if (i == 0) {
			div = document.createElement('div');
			div.classList.add('carousel-item');
			div.classList.add('active');
			div.innerHTML = `
				<img src="${event.slider[i]}" class="d-block w-100" alt="Images du slider de l'événement correspondant">
			`
		} else {
		div = document.createElement('div');
		div.classList.add('carousel-item');
		div.innerHTML = `
				<img src="${event.slider[i]}" class="d-block w-100" alt="Images du slider de l'événement correspondant">
			`;
		}
		carousel.appendChild(div);
	}

	//generation du titre
	const h1 = document.getElementById('h1');
	h1.innerHTML = `${event.title}`;
	console.log(event.title);

	//date
	const date = document.getElementById('date');
	date.innerHTML = `${event.date}`;
	
	sliderBackground();

	//gestion du text
	const txt = document.getElementById('textEvenement');
	txt.innerHTML = `${event.textEvent}`;

	//Generation des videos
	const containerVideo = document.getElementById('containerVideo');
	console.log('videos :',event.urlYoutube)
	for (let video of event.urlYoutube) {
		containerVideo.innerHTML = `
		<iframe
		src="${video}"
		title="YouTube video"
		allow="fullscreen"
	  ></iframe>
		`;
	}
}

async function main() {
	try {
	let id = getUrlParamId();
	datas = await getResquest(`https://skateboard-lozere.herokuapp.com/api/event/${id}`);
	console.log(datas);
	await createEventPage(datas);
	
	//gestion du fond noir derriere le slider
	DynamicGestionSliderBackground();
	setTimeout(() => {sliderBackground();}, 200);
	} catch (error) {
		console.error(error);
	}

}
main();
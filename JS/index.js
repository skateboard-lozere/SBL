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
//FUNCTION qui ajoute les cards events au Dom
async function addDomEnvent(eventCard) {
	const carousel = document.getElementById('carousel-inner');
	for (let i = 0; i < eventCard.length; i++) {
		if (i == 0) {
			var carouselItem = document.createElement("div");
			carouselItem.classList.add("carousel-item");
			carouselItem.classList.add("active");
			var row = document.createElement("div");
	 		row.classList.add("row");
		} else if (i % 3 === 0) {
			carouselItem.appendChild(row);
			carousel.appendChild(carouselItem);
			var row = document.createElement("div");
	 		row.classList.add("row");
			var carouselItem = document.createElement("div");
			carouselItem.classList.add("carousel-item");
		}
	const div = document.createElement("div");
	div.classList.add("col-md-4");
	div.innerHTML =`
	  <div class="card mb-2">
		<img class="card-img-top" src="${eventCard[i].imageCardUrl}"
			 alt="Card image cap">
		<div class="card-body">
		  <div class="card__flexAlign"><h4 class="card-title">${eventCard[i].title}</h4> <span class="card__date">${eventCard[i].date}</span></div>
		  <p class="card-text">${eventCard[i].description}</p>
		  <a class="btn btn-dark mt-3"" href="event.html?idEvent=${eventCard[i]._id}">Voir</a>
		</div>
	  </div>`;
	  row.appendChild(div);

		if (i === eventCard.length - 1) {
			carouselItem.appendChild(row);
			carousel.appendChild(carouselItem);
		}
	}
}

async function addDomTeamCard(teamCard) {
	const dynamicTeamCard = document.getElementById('dynamicTeamCard');
	for (let i = 0; i < teamCard.length; i++) {
		const portrait = document.createElement('div');
		portrait.classList.add('portrait');
		portrait.innerHTML = `
		<div class="container-card">
			<div class="card">
				<div class="card-img" id="card-img${i}"></div>
				<div class="bloc-content-show">
					<h2 class="text-light">${teamCard[i].nom}</h2>
					<h2 class="text-light">${teamCard[i].prenom}</h2>
					<p class="text-light text-right">${teamCard[i].title}</p>
				</div>
			</div>

			<div class="bloc-focus-top"></div>
			<div class="bloc-focus-bottom"></div>
		</div>
		`;
		dynamicTeamCard.appendChild(portrait);
		const cardImg = document.getElementById(`card-img${i}`);
		cardImg.style.backgroundImage = `url(${teamCard[i].urlPortrait})`;
	}
}


async function main() {
	try {
		//gestion des teamcards
		dataTeams = await getResquest('https://skateboard-lozere.herokuapp.com/api/teamcard/');
		await addDomTeamCard(dataTeams);
	} catch (error) {
		console.error(error);
	}
	try {
		//gestion des evenements
		dataEvents = await getResquest('https://skateboard-lozere.herokuapp.com/api/event/');
		await addDomEnvent(dataEvents);
	} catch (error) {
		console.error(error);
	}
}
main();
//FUNCTION POST
async function postRequestWithImg(url = '', bodyPost = {}) {
	let token = localStorage.getItem('token');
	try {
		let response = await fetch(url, {
			method: "POST",
			body: bodyPost,
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		if (response.ok) { // if HTTP-status is 200-299
			let json = await response.json();
			return json;
		}
	} catch (error) {
		console.error({ error });
	}
}

function prepareBodyPostTeam() {
	let formData = new FormData();
	let bodypost = {
		title: document.getElementById('form-team-title').value,
		nom: document.getElementById('form-team-nom').value,
		prenom: document.getElementById('form-team-prenom').value,
		urlPortrait: document.getElementById('form-team-image').value,
		presentationText: document.getElementById('form-team-text').value
	};
	formData.append('data', JSON.stringify(bodypost));
	formData.append('image', document.getElementById('form-team-image').files[0]);
	return formData;
}

//FUNCTION GET
async function getResquest(url = '') {
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


/**
 * 
 * @param {*} teamCard 
 * Ajoute Team CArd dans back office avec btn suppr
 */
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
					<p class="text-right text-light">${teamCard[i].title}</p>
				</div>
			</div>

			<div class="bloc-focus-top"></div>
			<div class="bloc-focus-bottom"></div>
		</div>
		<a class="btn btn-danger my-3" name="${teamCard[i]._id}" id="btnSuppr${i}">Supprimer</a>
		`;
		dynamicTeamCard.appendChild(portrait);
		const cardImg = document.getElementById(`card-img${i}`);
		cardImg.style.backgroundImage = `url(${teamCard[i].urlPortrait})`;
	}
}


async function addEventBtnSuppr(teamCard) {
	for (let i = 0; i < teamCard.length; i++) {
		let btnSuppr = document.getElementById(`btnSuppr${i}`);
		btnSuppr.addEventListener('click', async function (event) {
			if (confirm("Etes vous sur de vouloir supprimer cette carte ?")) {
				let id = btnSuppr.getAttribute('name');
				response = await deleteRequest(`https://skateboard-lozere.herokuapp.com/api/teamcard/${id}`);
				console.log('We delete a TeamCard');
				document.location.href="https://www.skateboard-lozere.com/backofficeTeam.html"
			}
		});
	}
}

//FUNCTION DELETE request
async function deleteRequest(url = '') {
	let token = localStorage.getItem('token');
	try {
		let response = await fetch(url, {
			method: "DELETE",
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		if (response.ok) { // if HTTP-status is 200-299
			let json = await response.json();
			return json;
		}
	} catch (error) {
		console.error({ error });
	}
}

function ctrlInputTeamCard() {
	const inputPrenom = document.getElementById('form-team-prenom').value;
	const inputNom = document.getElementById('form-team-nom').value;
	const inuptTextDescription = document.getElementById('form-team-text').value;
	messageAlert = '';
	let isOk = true;

	let checkSpecialCaractere = /^[^@&"'`~^#{}<>_=\[\]()!:;,?./§$£€*\+]+[^0-9]+$/;
	let textControl = /^[^@&~^#{}<>_\[\]()/§$£*\+]+$/

	
	if (!checkSpecialCaractere.test(inputPrenom)) {
		messageAlert = "Champs prenom invalide \n";
		isOk = false;
	}
	if (!checkSpecialCaractere.test(inputNom)) {
		messageAlert += "Champs nom invalide \n";
		isOk = false;
	}
	// Ctrl du text en acceptant les balises <br>
	if (inuptTextDescription != undefined) {
		let CtrlTextSplit = inuptTextDescription.split('<br>');
		if (CtrlTextSplit[CtrlTextSplit.length] == "") {
			CtrlTextSplit.splice(CtrlTextSplit.length-1, 1)
			console.log('CtrlTextSplit is :', CtrlTextSplit)
		}
		for (i of CtrlTextSplit) {
			console.log('i is :', i)
			if (!textControl.test(i)) {
				console.log('i n est pas passé is :', i)
				messageAlert += "Champs text description invalide \n";
				isOk = false;
			}
		}

	}
	if (!isOk) alert(messageAlert);

	return isOk;
}

async function main() {

	const btnAddTeam = document.getElementById("btnAddTeam");
	btnAddTeam.addEventListener('click', async function (event) {
		console.log("bouton cliqué");
		event.preventDefault();
		if (ctrlInputTeamCard()) { //TODO control addTeam
			try {
				// POST formulaire team
				let bodyRequest = prepareBodyPostTeam();
				console.log(bodyRequest);
				postResponse = await postRequestWithImg("https://skateboard-lozere.herokuapp.com/api/teamcard/", bodyRequest);
				document.location.href="./backofficeTeam.html";
			} catch (error) {
				console.error(error);
			}
		}
	});

	try {
		//affichage des TeamCards + ajout bouton suppr et modifer
		dataTeams = await getResquest('https://skateboard-lozere.herokuapp.com/api/teamcard/');
		await addDomTeamCard(dataTeams);
		await addEventBtnSuppr(dataTeams);
	} catch (error) {
		console.error(error);
	}

}
main();
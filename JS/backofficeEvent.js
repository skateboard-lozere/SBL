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

//FUNCTION PUT -> modify Event
async function putRequest(url = '', bodyPut = {}) {
    let token = localStorage.getItem('token');
    try {
        let response = await fetch(url, {
            method: "PUT",
            body: bodyPut,
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

function prepareBodyPostEvent() {
    const formData = new FormData();

    let tempListeUrlYoutube = document.getElementById('form-event-urlYoutube').value;
    const listeUrlYoutube = tempListeUrlYoutube.split(",");

    let bodypost = {
        title: document.getElementById('form-event-title').value,
        date: document.getElementById('form-event-date').value, //TODO vérifier le format de la date et l'ajouter dans le placeholder
        description: document.getElementById('form-event-card-description').value,
        userId: localStorage.getItem('userId'),
        textEvent: document.getElementById('form-event-text').value,
        urlYoutube: listeUrlYoutube
    };
    formData.append('data', JSON.stringify(bodypost));

    const imputFileCard = document.getElementById('form-event-cardImg');
    formData.append('imageCard', imputFileCard.files[0]);

    const imputFileSlider = document.getElementById('form-event-slider');
    console.log(imputFileSlider.files);
    for (const file of imputFileSlider.files) {
        formData.append('imageSlider', file);
    }


    return formData;
}

function prepareBodyPut() {
    const formData = new FormData();
    let bodyPut = {
        title: document.getElementById('form-modifyEvent-title').value,
        date: document.getElementById('form-modifyEvent-date').value, //TODO vérifier le format de la date et l'ajouter dans le placeholder
        description: document.getElementById('form-modifyEvent-card-description').value,
        userId: localStorage.getItem('userId'),
        textEvent: document.getElementById('form-modifyEvent-text').value,
        urlYoutube: document.getElementById('form-modifyevent-urlYoutube')
    };
    formData.append('data', JSON.stringify(bodyPut));

    const imputFileCard = document.getElementById('form-modifyEvent-cardImg');
    formData.append('imageCard', imputFileCard.files[0]);

    const imputFileSlider = document.getElementById('form-modifyEvent-slider');
    console.log(imputFileSlider.files);
    for (const file of imputFileSlider.files) {
        formData.append('imageSlider', file);
    }


    return formData;
}

/**
 * ajoute les cards events au Dom
 *
 * @async
 * @function addDomEvent
 * @param {Array} eventCard - Array of event card - with:    { title, date, imageCardUrl, description, userId, slider, textEvent }.
 * @return {HTMLElement} The carousel of events
 */
async function addDomEvent(eventCard) {
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
                    <a class="btn btn-danger mt-3" name="${eventCard[i]._id}" id="btnSuppr${i}">Supprimer</a>
                    <a class="btn btn-success mt-3" name="${eventCard[i]._id}" id="btnModify${i}">Modifier</a>
                </div>
            </div>`
            row.appendChild(div);

		if (i === eventCard.length - 1) {
			carouselItem.appendChild(row);
			carousel.appendChild(carouselItem);
		}
	}
}

//FUCNTION ADDEVENTLISTENER AUX BOUTONS SUPPRIMER DES EVENTS
async function addEventBtnSuppr(eventCard) {
    for (let i = 0; i < eventCard.length; i++) {
        let btnSuppr = document.getElementById(`btnSuppr${i}`);
        btnSuppr.addEventListener('click',async function(event) {
            if (confirm("Etes vous sur de vouloir supprimer cet evenement?")) {
                let id = btnSuppr.getAttribute('name');
                response = await deleteRequest(`http://127.0.0.1:3000/api/event/${id}`); 
            }
        });
    }
}

//Function qui ajoute tous les composants nécessaire à la modification d'evenement
async function addModifyEvent(eventCard) {
    for (let i = 0; i < eventCard.length; i++) {
        let btnModify = document.getElementById(`btnModify${i}`);
        btnModify.addEventListener('click',async function(event) {
            //création du nouveau formulaire avec les valeurs de la cartes à changer
            const mainContainer = document.getElementById('dynamiqueModifyForm');
            mainContainer.innerHTML = `

            <div class="underline-title"></div>
            <h2>Modifier l'événement sélectionné</h2>

            <form id="formEventModify" enctype="multipart/form-data">
        
                <div class="form-group">
                    <label for="form-modifyEvent-title">Titre</label>
                    <input type="text" class="form-control" id="form-modifyEvent-title" value="${eventCard[i].title}" maxlength="50" required="">
                </div>
                <div class="form-group">
                    <label for="form-modifyEvent-date">Date</label>
                    <input type="text" class="form-control" id="form-modifyEvent-date" value="${eventCard[i].date}" maxlength="50" required="">
                </div>

                <h3>carte d'événement</h3>

                <label for="form-modifyEvent-cardImg">Image de la carte événement : A charger que si on veut modifier l'image</label> <br>
                <input type="file" accept="image/png, image/jpeg" id="form-modifyEvent-cardImg">
                <div class="form-group">
                    <label for="form-modifyEvent-description">Description de la carte</label>
                    <textarea type="text" class="form-control" id="form-modifyEvent-card-description" maxlength="500" required="" rows="3">${eventCard[i].description}</textarea>
                </div>


                <h3>Slider</h3>

                <div class="form-group">
                    <label for="form-modifyEvent-slider" class="mt-2">Selectionner les images du Slider : Les images sélectionnees seront les nouvelles images du slider</label> </br>
                    <input type="file" accept="image/png, image/jpeg" id="form-modifyEvent-slider" multiple>
                </div>

                <h3>Page événement</h3>

                
                <div class="form-group">
                    <label for="form-modifyEvent-text">text pour la page événement</label>
                    <textarea type="text" class="form-control" id="form-modifyEvent-text" maxlength="500" required="" rows="10">${eventCard[i].textEvent}</textarea>
                </div>

                <div class="form-group">
                    <label for="form-modifyEvent-urlYoutube">URL YOUTUBE (Pas encore Implémenté)</label>
                    <textarea type="text" class="form-control" id="form-modifyEvent-urlYoutube" placeholder="Insérer les URLs des videos de la chaine youtube sous la forme: URL,URL,URL   sans espaces " maxlength="30" required="" rows="3"></textarea>
                </div>

                
            <button type="submit" id="btnModifyEvent" class="btn btn-outline-dark mb-4">Modifier l'evenement</button>
        </form>
        `;
        const btnModifyEvent = document.getElementById('btnModifyEvent');
        btnModifyEvent.addEventListener('click', async function(event) {
			console.log("bouton modifyEvent cliqué");
            let id = btnModify.getAttribute("name"); 
			event.preventDefault();
			let bodyPut = prepareBodyPut();
			putResponse = await putRequest(`http://127.0.0.1:3000/api/event/${id}`, bodyPut);
            window.location = 'backofficeEvent.html';
        });
        });
    }
}

function controlEvent() {
    const inputTitle = document.getElementById('form-event-title').value;
    const inputDate = document.getElementById('form-event-date').value;
    const inputDescription = document.getElementById('form-event-card-description').value;
    const inputTxt = document.getElementById('form-event-text').value;
    let tempListeUrlYoutube = document.getElementById('form-event-urlYoutube').value;
    const listeUrlYoutube = tempListeUrlYoutube.split(",");
    messageAlert = '';
    let isOk = true;
    let checkSpecialCaractere = /^[^@&"'`~^#{}<>_=\[\]()!:;,?./§$£€*\+]+$/;
    let checkTexte = /^[^{}<>=$]+$/;
    let checkDate = /^[0-9]{2}\/[0-9]{2}\/[0-9]{2}$/;
    let checkUrlYoutube = /^[^@&"'`~^#{}<>\[\]()!;§$£€*\+]+$/;

    if (!checkSpecialCaractere.test(inputTitle)) {
		messageAlert = "Champs titre invalide \n";
		isOk = false;
	}
    if (!checkDate.test(inputDate)) {
		messageAlert += "Champs date invalide \n";
		isOk = false;
	}
    if (!checkTexte.test(inputDescription)) {
		messageAlert += "Champs description-carte invalide \n";
		isOk = false;
	}
    if (!checkTexte.test(inputTxt)) {
		messageAlert += "Champs texte invalide \n";
		isOk = false;
	}
    if (!checkUrlYoutube.test(listeUrlYoutube)) {
        messageAlert += "Champs URL Youtube invalide";
        isOk = false;
    }
    if (!isOk) alert(messageAlert);

    return isOk;
}

async function main() {
    const btnAddEvent = document.getElementById("btnAddEvent");
    btnAddEvent.addEventListener('click', async function(event) {
        console.log("bouton cliqué");
        event.preventDefault();
        if(controlEvent()) {
            try {
            // POST formulaire event
            let bodyRequest = prepareBodyPostEvent();
            postResponse = await postRequestWithImg("http://127.0.0.1:3000/api/event/", bodyRequest);
            } catch (error) {
                console.error(error);
            }
        }
    });

    try {
       //affichage des events dans le backofficeEvent avec un bouton de suppréssion et de modification
       //les EventListeners sont généré lord de la création des boutons
       dataEvents = await getResquest('http://127.0.0.1:3000/api/event/');
       await addDomEvent(dataEvents);
       await addEventBtnSuppr(dataEvents);
       await addModifyEvent(dataEvents);
    } catch (error) {
       console.error(error);
    }
}
main();
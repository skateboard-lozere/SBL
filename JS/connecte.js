//FUNCTION POST
async function postRequest(url = '', bodyPost = {}, jwt = '') {
	let response = await fetch(url, {
		method: "POST",
		body: bodyPost,
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (response.ok) { // if HTTP-status is 200-299
		let json = await response.json();
		return json;
	} else {
		let message = await response.text();
		throw new Error("une erreur est survenu -> " + message);
	}
}

//FUNCTION CONTROL DU FORM - pour la création de compte
function controlFormNewAccount() {
	//On recupere les donnees du form
	console.log("VEFICATION DU FORMULAIRE");
	let lastName = document.getElementById("form-nom").value;
	let firstName = document.getElementById("form-prenom").value;
	let email = document.getElementById("form-email").value;
	let address = document.getElementById("form-adresse").value;
	let city = document.getElementById("form-ville").value;
	let pwd = document.getElementById("form-pwd").value;
	let confirmPwd = document.getElementById("form-valpwd").value;
	let isOk = true;
	let messageAlert = "";
	let checkString = /^[a-zA-Zéèàê]+[-| ]?[a-zA-Zéèàê]*$/;		//Accepte "mots-mots" || "mots mots"
	let checkEmail = /^[a-zA-Z0-9éèàê.\-]+@[a-zéèàê]+\.[a-z]+$/;
	let checkAdrress = /^[0-9]*[ ]?[a-zA-Zéèàê]*[,]?[ ]?[a-zA-Zéèàê]+([-| ]?[a-zA-Zéèàê])*$/;
	let checkCity = /^[a-zA-Zéèàê]+-?[a-zA-Zéèàê]*-?[a-zA-Zéèàê]*$/;
	let checkSpeCaractere = /^[^@&"'`~^#{}<>_=\[\]()!:;,?./§$£€*\+]+$/;
	//On test les differents imputs
	if (!checkString.test(lastName)) {
		messageAlert = "Champs nom invalide \n";
		isOk = false;
	}
	if (!checkString.test(firstName)) {
		messageAlert += "Champs prénom invalide \n";
		isOk = false;
	}
	if (!checkEmail.test(email)) {
		messageAlert += "Champs email invalide \n";
		isOk = false;
	}
	if (!checkAdrress.test(address)) {
		messageAlert += "Champs adresse invalide \n";
		isOk = false;
	}
	if (!checkCity.test(city)) {
		messageAlert += "Champs ville invalide \n";
		isOk = false;
	}
	if (!checkSpeCaractere.test(pwd)) {
		messageAlert += "Champs mot de passe incorrect: Il ne faut pas de caractères spéciaux \n";
		isOk = false;
	} else {
		if (pwd != confirmPwd) {
			messageAlert += "Les mots de passe ne sont pas identiques \n";
		isOk = false;
		}
	}
	if (!isOk) {
		alert(messageAlert);
	}
	return isOk;
}

//FUNCTION - prepare le body de la requetes post pour la créatioin d'un nouveau compte
function prepareBodyPostNewAccount() {
	let bodypost = {
		nom: document.getElementById("form-nom").value,
		prenom: document.getElementById("form-prenom").value,
		address: document.getElementById("form-adresse").value,
		ville: document.getElementById("form-ville").value,
		email: document.getElementById("form-email").value,
		password: document.getElementById("form-pwd").value
	}
	return JSON.stringify(bodypost);
}

//FUNCTION - prepare le body de la requete post pour la connection d'un compte
function prepareBodyPostLogin() {
	let bodypost = {
		email: document.getElementById("form-log-email").value,
		password: document.getElementById("form-log-pwd").value
	}
	return JSON.stringify(bodypost);
}

//FUNCTION CONTROL FORM - pour se connecter
function controlLogin() {
	console.log("VEFICATION DU FORMULAIRE");
	let email = document.getElementById("form-log-email").value;
	let pwd = document.getElementById("form-log-pwd").value;
	let isOk = true;
	let messageAlert = "";
	let checkEmail = /^[a-zA-Z0-9éèàê.\-]+@[a-zéèàê]+\.[a-z]+$/;
    let checkSpecialCaractere = /^[^@&"'`~^#{}<>_=\[\]()!:;,?./§$£€*\+]+$/;
	if (!checkSpecialCaractere.test(pwd)) {
		messageAlert += "mot de passe erroné \n";
		isOk = false;
	}
	if (!checkEmail.test(email)) {
		messageAlert += "Champs email invalide \n";
		isOk = false;
	}
	if (!isOk) {
		alert(messageAlert);
	}
	return isOk;
}



async function main() {
    const boutonSubmit = document.getElementById("btnSubmit");
	boutonSubmit.addEventListener('click', async function(event) {
		console.log("bouton cliqué");
		event.preventDefault();
		if (controlFormNewAccount()) {
			try{
				let bodyRequest = await prepareBodyPostNewAccount();
				console.log("Body request is", bodyRequest);
				postResponse = await postRequest("https://skateboard-lozere.herokuapp.com/api/auth/signup", bodyRequest);
				console.log("Reponse POST: " + postResponse);
				alert('Votre compte à bien été créer !');
			} catch (error) {
				alert('Email déjà utilisé !');
				console.error(error);
			}
		}
	});

	const boutonLogin = document.getElementById("btnLogin");
	boutonLogin.addEventListener('click', async function(event) {
		console.log("bouton cliqué");
		event.preventDefault();
		if(controlLogin()) {
			try {
			let bodyRequest = prepareBodyPostLogin();
			postResponse = await postRequest("https://skateboard-lozere.herokuapp.com/api/auth/login", bodyRequest);
			localStorage.setItem('token', postResponse.token);
			localStorage.setItem('userId', postResponse.userId);
			window.location = './index.html';
			} catch (error) {
				console.error(error);
			}
		}
	});
};

main();
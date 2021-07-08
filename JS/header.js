function main() {
    document.addEventListener('DOMContentLoaded', (event) => {
        if (localStorage.getItem('token') == null) {
            console.log("la personne n'est pas identifiéé !");
        } else {
            console.log("la personne est identifiée !");
            const coDeco = document.getElementById("dynamicLabel");
            if (coDeco == null) {
                console.log('coDeco===null header.js ligne.8 !');
            }else {
                console.log('coDeco VAUT SOMETING');
                coDeco.setAttribute("href", "./index.html");
                coDeco.innerHTML = "Deconnexion";
                coDeco.addEventListener('click', () => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    alert('Vous etes deconnecter !');
                });
            }
        }
    });
}
main();

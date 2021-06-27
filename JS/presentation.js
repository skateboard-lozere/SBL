function addEventReadMore() {
	let btnReadMore = document.getElementById('readMore');
	btnReadMore.addEventListener('click', () => {
		let textPresentation = document.getElementById('text-presentation');
		if (textPresentation.classList.contains('text-hidden')) {
			textPresentation.classList.remove('text-hidden');

		} else {
			textPresentation.classList.add('text-hidden');
		}

	})

}

function main() {
	addEventReadMore();
}

main();
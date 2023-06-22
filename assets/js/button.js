window.addEventListener('DOMContentLoaded', function () {

	var gamemode = 'chess'
	let logo = document.querySelector('.logo img');
	let btn = document.querySelector('#modchangebtn');

	btn.addEventListener('click', function () {
		if (gamemode == 'chess') {
			logo.style.opacity = 0;
			document.body.style.backgroundImage = 'url("./assets/images/bgnc.png")';
			setTimeout(() => {
				logo.src = './assets/images/logo2.png';
				logo.style.opacity = 1;
			}, 300);
		} else {
			logo.style.opacity = 0;
			document.body.style.backgroundImage = 'url("./assets/images/bg.png")';
			setTimeout(() => {
				logo.src = './assets/images/logo.png';
				logo.style.opacity = 1;
			}, 300);
		}
		if (gamemode == 'chess') gamemode = 'number';
		else gamemode = 'chess';
	});
	const multipopup = document.getElementById('popup1');
	multibtn = document.getElementById("multibtn");
	multibtn.onclick = function () {
		multipopup.style.display = 'block';
	}

	document.getElementById('submitButton').addEventListener('click', () => {
		const nickname = document.getElementById('nicknameInput').value;
		postname(nickname, gamemode);
		multipopup.style.display = 'none';
	});

	document.getElementById('popupcloseButton').addEventListener('click', () => {
		multipopup.style.display = 'none';
	});
	document.getElementById('singlebtn').addEventListener('click', () => {
		postname('Guest', gamemode);
	});
	document.getElementById('popupcloseButton').addEventListener('click', () => {
		multipopup.style.display = 'none';
	});
});

async function postname(name, type) {
	// 서버에 name 전송
	const response = await fetch('http://52.79.61.17:8080/users/' + type, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name })
	});

	// 서버에서 받은 userId

	const { userId } = await response.json();
	let gameId;
	let error;
	do {
		try {
			// 서버에 다시 userId 전송
			const secondResponse = await fetch('http://52.79.61.17:8080/matchs/' + type, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userId })
			});

			// 서버에서 받은 gameId
			gameId = (await secondResponse.json()).gameId;
			error = null;
		} catch (e) {
			error = e;
		}

		// 에러가 발생하면 1초 대기
		if (error) {
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
		
	} while (error);
	console.log(gameId);
	if (gameId != undefined) window.location.href = `https://franticfrizz.github.io/chess.html?gameId=${gameId}`;
}
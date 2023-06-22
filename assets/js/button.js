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
	//멀티플레이 버튼 누르면 팝업 띄움
	const multipopup = document.getElementById('popup1');
	multibtn = document.getElementById("multibtn");
	multibtn.onclick = function () {
		multipopup.style.display = 'block';
	}
	//제출 누르면 닉네임을 서버에 보냄
	document.getElementById('submitButton').addEventListener('click', () => {
		const nickname = document.getElementById('nicknameInput').value;
		postname(nickname, gamemode);
		multipopup.style.display = 'none';
	});

	//팝업 닫음
	document.getElementById('popupcloseButton').addEventListener('click', () => {
		multipopup.style.display = 'none';
	});
	
	//싱글플레이 버튼. 따로 게임id 없이 바로 게임 화면으로 넘어감
	document.getElementById('singlebtn').addEventListener('click', () => {
		window.location.href = `https://franticfrizz.github.io/chess.html`;
	});
});

//서버에 닉네임 전송하고 gameid받아오는 함수
async function postname(name, type) {
	// 서버에 name 전송
	const response = await fetch('https://52.79.61.17:8080/users/' + type, {
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
			// 매칭이 이뤄지지 않으면(매칭 대기중인 사람이 없다면) 에러가 남. 따라서 매칭이 이뤄질때까지 1초마다 post
			const secondResponse = await fetch('https://52.79.61.17:8080/matchs/' + type, {
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

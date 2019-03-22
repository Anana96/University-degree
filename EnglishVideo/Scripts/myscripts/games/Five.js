function getUserLogin() {
    let url = `${document.location.origin}/Account/CurrentUser`;
    let method = 'Get';
    let conn = new AjaxRequest(url, method);
    return conn.getJson().then(response => { return response.UserLogin; });
    // console.log(` мой логин: ${login}`);
}


function getWordsFromDictionary() {
    user = getUserLogin();
    return user.then((login) => {
        let url = `${document.location.origin}/Games/GetExpressionTranslator?userName=${login}`;
        let method = 'Get';
        let conn = new AjaxRequest(url, method);
        return conn.getJson();
    });
}

//-------ИГРА----------//


let timeInterval = function (i, words) {
    if (i >= 0) {
        let word = words[i].English;
        let engDOM = document.getElementById('audio-eng');
        let inputDOM = document.getElementById('user-input');
        inputDOM.value = '';
        let connOxford = new OxfordApi();
        connOxford.getAudioExemple(word).then((audio) => {
            engDOM.src = audio;
            console.log(word);
            console.log(audio);
            engDOM.play();
        });
        let time = 15;
        let timerInDOM = document.getElementById('timer');
        timerInDOM.innerText = time;
        timerInDOM.className = '';
        var currentInterval = setInterval(() => {
            time--;
            //console.log(`время ${time}; i=${i} слово=${word[i].English} перевод=${word[i].Russia}`);
            timerInDOM.innerText = time;
            if (time == 3) {
                timerInDOM.className = 'red-text';
            }
            if (time <= 0) {
                downPoints();
                clearInterval(currentInterval);
                timeInterval(i - 1, words);
                return;
            }

            inputDOM.addEventListener('keyup', () => {
                if (word.toLowerCase() == inputDOM.value.toLowerCase()) {
                    upPoints();
                    inputDOM.value = '';
                    clearInterval(currentInterval);
                    timeInterval(i - 1, words);
                    return;
                }
            });
        }, 1000);
    }
    else {
        document.getElementsByClassName('body-game')[0].style.display = 'none';
        endGame();
    }

}


function startGame(words) {
    words.then((dictionary) => {
        //перемешиваем массив случайным образом
        dictionary.sort(() => {
            return Math.random() - 0.5;
        });
        document.getElementsByClassName('body-game')[0].style.display = 'flex';
        timeInterval(dictionary.length - 1, dictionary);
    })
        .catch((error) => console.log(` Ошибка при отрисовки игры ${error}`));

}

function getPoints() {
    return document.getElementById('points').innerText;
}


function upPoints() {
    let points = document.getElementById('points').innerText;
    points = ++points;
    console.log(`Повышение баллов ${points}`);
    document.getElementById('points').innerText = points;
}

function downPoints() {
    let points = document.getElementById('points').innerText;
    points = --points;
    document.getElementById('points').innerText = points;
}

function endGame() {
    let endDOM = document.getElementById('end-game')
    endDOM.style.display = 'flex';
    endDOM.innerHTML = `<div class='end-game-content'>Игра окончена. <br> <span class="result-game-points">У вас ${getPoints()} балла</span><div>`;
}

//точка входа
document.getElementById('button-start-game').addEventListener('click', () => {
    document.getElementsByClassName('window-start-game')[0].style.display = 'none';
    setTimeout(() => { startGame(getWordsFromDictionary()) }, 1000);
});

'use strict';
class AjaxRequest {
    constructor(url, method) {
        this.url = url;
        this.method = method;
    }

    getJson() {
        return fetch(this.url, { method: this.method})
            .then((response) => { return response.json(); })
            .catch((error) => {
                console.log("Ошибка обращения к серверу " + error.message);
            });
    }
}


function getUserLogin() {
    let url = `${document.location.origin}/Account/CurrentUser`;
    let method = 'Get';
    let conn = new AjaxRequest(url, method);
    return conn.getJson().then(response => { return response.UserLogin; });
    // console.log(` мой логин: ${login}`);
}


function getWordsFromDictionary() {
    let user = getUserLogin();
    return user.then((login) => {
        let url = `${document.location.origin}/Games/GetExpressionTranslator?userName=${login}`;
        let method = 'Get';
        let conn = new AjaxRequest(url, method);
        return conn.getJson();
    });
}

//-------ИГРА----------//


let timeInterval = function (i, word) {
    let engDOM = document.getElementById('card-eng');
    let rusDOM = document.getElementById('user-input');
    rusDOM.value = '';
    if (i >= 0) {
        engDOM.innerText = word[i].English;
        let time = 15;
        let timerInDOM = document.getElementById('timer');
        timerInDOM.innerText = time;
        timerInDOM.className = '';
        var currentInterval = setInterval(() => {
            time--;
            //console.log(`время ${time}; i=${i} слово=${word[i].English} перевод=${word[i].Russia}`);
            timerInDOM.innerText = time;
            if (time === 3) {
                timerInDOM.className = 'red-text';
            }
            if (time <= 0) {
                downPoints();
                clearInterval(currentInterval);
                timeInterval(i - 1, word);
                return;
            }

            rusDOM.addEventListener('keyup', () => {
                if (word[i].Russia === rusDOM.value) {
                    upPoints();
                    clearInterval(currentInterval);
                    timeInterval(i - 1, word);
                    return;
                }
            });
        }, 1000);
    }
    else {
        document.getElementById('card-word').style.display = 'none';
        rusDOM.style.display = 'none';
        endGame();
    }

};

//получение текста из запроса к оксфордскому словарю
function getSentense(word) {
    let method = 'GET';
    let sentense = [];
    let url = `${document.location.origin}/Games/OxfordApi?word= ${word.toLowerCase()}`;
    let conn = new AjaxRequest(url, method);
    return conn.getJson().then(response => {
        let responseJson = JSON.parse(response);
        responseJson = responseJson.results[0].lexicalEntries[0].sentences;
        responseJson.forEach((item) => {
            sentense.push(item.text);
        })
        sentense = sentense.filter((item, index) => { return index < 6 });
        sentense = sentense.map((item) => { return item.replace(new RegExp(word.toLowerCase(), 'gi'), '_'.repeat(word.length)) });
        return sentense;
    });
}


function getRandomValueArray(arr) {
    let index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

function getData(i, dictionary) {
    let eng = dictionary[i].English;
    console.log(eng);
    getSentense(eng).then((sentense) => {

        //отрисовка текста

        let textDOM = document.getElementById('block-examples-texts');
        textDOM.style.display = 'block';
        let buttonDOM = document.getElementsByClassName('button-with-options')[0];
        buttonDOM.style.display = 'block';
        let list = '';
        for (let i = 0; i < sentense.length && i < 6; i++) {
            let text = document.createElement('span');
            list += `<li>${sentense[i]}</li>`;
        }
        textDOM.innerHTML = `<ul> ${list} </ul>`;


        //отрисовка кнопоки с правильным ответом

        let orderButton = [0, 1, 2];
        randomArraySort(orderButton);
        let answer = orderButton[0];
        let buttonWithCurrentWord = document.getElementsByClassName('button-options')[answer];
        buttonWithCurrentWord.innerText = eng;

        //выбор 2х рандомных слов:
        let randomWord1 = eng;
        let randomWord2 = eng;
        while (randomWord1 === eng) {
            randomWord1 = getRandomValueArray(dictionary).English;
        }
        while (randomWord2 === eng || randomWord2 === randomWord1) {
            randomWord2 = getRandomValueArray(dictionary).English;
        }
        let buttonWithRandomWord1 = document.getElementsByClassName('button-options')[orderButton[1]];
        buttonWithRandomWord1.innerText = randomWord1;
        let buttonWithRandomWord2 = document.getElementsByClassName('button-options')[orderButton[2]];
        buttonWithRandomWord2.innerText = randomWord2;



        getAnswer(answer).then(
            (value) => {
                if (value) {
                    upPoints();
                    if (i == dictionary.length - 1) {          
                        let gameCont = document.getElementById('body-third-game');
                        endGame(gameCont);
                    }
                    else
                            getData(++i, dictionary);
                }
        })
        .catch(err => console.log(err))

    })

}



function getAnswer(orderBlock) {
    return new Promise((resolve) => {
        document.getElementsByClassName('button-options')[orderBlock].addEventListener('click', () => {
            console.log('клик');
            resolve(true);
        })
    })
}


function startGame(words) {
    words.then((dictionary) => {
        //перемешиваем массив случайным образом
        randomArraySort(dictionary);
        console.log(dictionary);
        getData(0,dictionary);
    })
       .catch((error) => console.log(` Ошибка при отрисовки игры ${error}`));

}




//перемешивание массива
function randomArraySort(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
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

function endGame(gameCont) {
    gameCont.style.display = 'none';
    let endDOM = document.getElementById('end-game');
    endDOM.style.display = 'flex';
    endDOM.innerHTML = `<div class='end-game-content'>Игра окончена. <br> <span class="result-game-points">У вас ${getPoints()} балла</span><div>`;
}

//точка входа
document.getElementById('button-start-game').addEventListener('click', () => {
    document.getElementsByClassName('window-start-game')[0].style.display = 'none';
    setTimeout(() => { document.getElementById('body-third-game').style.display = 'block'; startGame(getWordsFromDictionary()); }, 1000);
});

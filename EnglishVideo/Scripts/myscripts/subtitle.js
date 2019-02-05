"use strict"

var video = document.getElementsByTagName("video");
var trackCur = video[0].textTracks[0];
var modalOk;
var modalCansel;
var yandApi = {
    key: 'trnsl.1.1.20180423T145020Z.cd60da3379d935c4.89e42c117208429c420034ee76183e44147174b5',
    api: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
    format: 'GET',
    lang: 'en-ru'
}

//для считывания метаданных(субтитров) и генерации собственных субтитров
trackCur.oncuechange = () => {
    let cue = trackCur.activeCues[0];
    let dsp = document.getElementById("subt");
    let display = document.getElementById("display");
    if (cue === undefined) {
        display.style.display = "none";
    } else {    
        display.style.display = "block";
        console.log(cue.text);
        cue.text = cue.text.replace(/<[^>]+>/g, '');
        dsp.innerHTML = cue.text.replace(/\b(\w+?)\b/g, '<span class="word" onclick=selectWord(this) onmouseover=hoverWord(this)>$1</span>');
    }
}

//ajax запрос
function ajax(url, method) {
    return new Promise((resolve,reject) => {
        var req = new XMLHttpRequest();
        req.open(method, url, true);
        console.log("Загрузка данных с сервера...");
        req.onreadystatechange = () => {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    console.log(req.responseText);
                    resolve(JSON.parse(req.responseText));
                }
            }
        }
        req.onerror = () => reject(" Ошибка запроса к серверу readyState=" + req.readyState + " status="+req.status);
        req.send(null);
    });
}

//проверка существования пользователя
function userExist() {
    return new Promise((resolve, reject) => {
        let url = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        url += '/Account/CurrentUser';
        ajax(url, 'POST').then(
             object =>{
                console.log(object.ResponseBool);
                resolve(object.ResponseBool);
            },
             error => {
                reject('Поиск пользователя прерван.' + error);
            });
    });
}

//перевод слова
function translate(eng) {
    return new Promise((resolve, reject) => {
        let url = yandApi.api + '?';
        url += 'key=' + yandApi.key;
        url += '&text=' + eng;
        url += '&lang=' + yandApi.lang;
        ajax(url, yandApi.format).then(
            object => {
                resolve(object.text[0]);
            },
            error => {
                reject('Перевод не выполнен.' + error);
            });
    });
}

//добавление перевода в базу
function addTranslationToDatabase(eng, rus)
{
    return new Promise((resolve, reject) => {
        eng.toLowerCase();
        rus.toLowerCase();
        eng = eng[0].toUpperCase() + eng.slice(1);
        rus = rus[0].toUpperCase() + rus.slice(1);
        let url = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        url += '/Home/Dictionary?eng=' + eng + "&rus=" + rus;
        ajax(url, 'POST').then(
             object => {
                console.log(object);
                 if (object.Response == 'Такой объект уже есть в базе' || object.Response == 'Ошибка, пользователь не найден') {
                     reject(object.Response);
                }
                else {
                     resolve(object.Response);
                }
            },
            error => {
                reject( error);
            });
    });

}


//наведение на слово
function hoverWord(x) {
    if (x.classList.contains('tooltip')) return;
    x.classList.add('tooltip');
    let eng = x.innerHTML;
    translate(eng).then(
        translateResult => {
            x.innerHTML += '<span class="tooltiptext">' + 'Перевод: </br>' + eng + "&#8594;" + translateResult + '</span>';
        },
        error => { console.error("Ошибка при переводе на наведении слова." + error); });
}


//выбор слова из субтитра(при нажатие)
function selectWord(x) {
    let eng, rus;
    x.style.color = "#ff8000";
    eng = x.innerHTML.match(/(\b(\w+?)\b)/g)[0]; //выбор слова на которое нажал пользователь
    video[0].pause();
    let promis = Promise.all([translate(eng), userExist()])
    .then(
        ([wordResult, userResult]) => {
            rus = wordResult;
            let cansel = () => x.style.color = 'inherit';
            //если пользователь зарегистрирован добавляем в функцию сохранения в базу
            if (userResult) {
                let message = 'Добавить перевод:<br/>' + '<span class="trans">' + eng + '&#8594;' + rus + '</span>';
                let addWord = () => {
                    console.info("Происходит добавление в базу", eng, rus);
                    addTranslationToDatabase(eng, rus).then(
                         addResult => {
                            x.style.color = 'blue';
                            console.info(addResult);
                            modalInfo('Добавление прошло успешно!');
                        },
                         error => {
                            console.error("Ошибка.Добавление неудачно." + error);
                             if (error!="") {
                                 modalInfo(error);
                             } else {
                                modalInfo();
                            }
                        });
                    console.info("Добавление в базу завершено", eng, rus);
                };
                modalFunc(message, cansel, addWord);
            }
            else {
                let message = 'Перевод:<br/>' + '<span class="trans">' + eng + ' &#8594; ' + rus;
                message += '</span><br/><span id="user-mes"> Войти на сайт для сохранения переводов?</span>';
                let redirectLogIn =() => {
                    document.webkitExitFullscreen();
                    let url = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
                    url += '/Account/Login';
                    document.location.href = url;
                };
                modalFunc(message, cansel, redirectLogIn);
            }
        },
        //вывод ошибок
        error => {
            console.error("Ошибка: " + error);
            modalInfo();
        });
}


//вызов модального окна с информацией о запросе пользователя
function modalInfo(message) {
    let modal = document.getElementById("info-modal");
    let textInfo = document.getElementById('textWordInfo');
    textInfo.innerHTML = message || 'Технические неполадки.Зайдите позже, мы все исправим : )';
    modal.style.visibility = 'visible';
    setTimeout(() => modal.style.visibility = 'hidden', 3000);
}


//привязка функций кнопкам модальному окну с сохранением перевода
function modalFunc(message, callbackCansel, callbackOk) {
    modalCansel = callbackCansel;
    modalOk = callbackOk;
    modalShow(message);
}

//вызов функций ok и cansel модального окна с переводом
function modalEvent(action) {
    if (action == 'yes') {
        modalOk();
    }
    else {
        modalCansel();
    }
    modalClose();
}
  
//закрытие модального окна с переводом
function modalClose() {
    document.getElementById('modal').style.visibility = "hidden";
}

//показ модального окна с переводом
function modalShow(message) {
    document.getElementById('textWord').innerHTML = message;
    document.getElementById('modal').style.visibility = "visible";
}

//fullscreen видео
function fullScreenProb() {
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            let element = $('.v-cont').get(0);
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
}


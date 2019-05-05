//import OxfordApi from './OxfordApi'
//import Game from './Game';

//export default
class AudioTranslationGame extends Game {
    constructor() {
        super();
        this.audioArray = [];
        this.currentWord = '';
        this.currentStep = 0;
        this.currentTimer = 0;
        this.limitAudio = 5;
        document.getElementsByClassName('button-next')[0].onclick = this.nextStep.bind(this);
        document.getElementById('user-input').onkeyup = this.equalWord.bind(this);
    }

   
    //---------Инициализация игры---------
    init() {
        this.drawPreloaderDOM(true);
        this.currentStep = 0;
        clearInterval(this.currentTimer);
    }

    //---------Старт игры-------------
    start() {
        super.start();
        this.init();
        console.log("Начало игры");
        //если аудио уже были получены
        if (this.audioArray.length>0) {
            this.shakeArray(this.audioArray);
            this.drawPreloaderDOM(false);
            this.stepWithInterval(0);
            return;
        }
        //получение аудио из словаря
        let connDictionary = this.getWordsFromDictionary();
        connDictionary.then((dictionary) => {
            this.getAllAudio(dictionary).then(result => {
                if (this.audioArray.length === 0) {
                    this.message('Недостаточно слов для игры. Пополните словарь.');
                    return;
                }
                this.drawPreloaderDOM(false);
                this.stepWithInterval(0)
            })
        })
            .catch((error) => {
                console.log(` Ошибка:${error}`);
                this.message('Технические неполадки. Зайдите позже.');
            });
    }

    //---------Сохранение аудио-------
    setAudioArray(word, audio) {
        this.audioArray.push({
            'word': word,
            'audio': audio
        });
    }

    //---------Получение всех аудио----
    getAllAudio(dictionary) {
        return new Promise((resolve, reject) => {
            let promises = [];
            try {
                let connOxford = new OxfordApi();
                dictionary.forEach((word) => {
                    word = word.English;
                    promises.push(
                        connOxford.getAudioExemple(word).then((audio) => {
                            if (!audio) {
                                console.log('аудио пропущено');
                                return;
                            }
                            else
                                this.setAudioArray(word, audio);
                        })
                    );
                });
                Promise.all(promises).then(() => resolve(true));
            }
            catch (e) {
                reject(e);
            }
        });
    }
    //---------Следующий шаг игры-----
    nextStep() {
        clearInterval(this.currentTimer);
        console.log(`currentStep = ${this.currentStep}`);
        this.stepWithInterval(this.currentStep + 1);
    }
    //---------Проверка равенства введенного слова и слова-аудио------
    equalWord() {
        let inputDOM = document.getElementById('user-input');
        if (this.currentWord.toLowerCase() === inputDOM.value.toLowerCase()) {
            this.upPoints();
            this.nextStep();
            return;
        }
    }
    //---------Работа таймера-------
    timer() {
        let time = this.time;
        let timerInDOM = document.getElementById('timer');
        this.setTimerDOM();
        this.currentTimer = setInterval(() => {
            --time;
            timerInDOM.innerText = time;
            if (time === 3) {
                timerInDOM.className = 'red-text';
            }
            if (time <= 0) {
                this.downPoints();
                this.nextStep();
                return;
            }
        }, 1000);
    }
    //---------Шаг игры--------
    stepWithInterval(i) {
        if (i === 0)
            console.log(this.audioArray);
        this.currentStep = i;
        document.getElementById('user-input').value = '';
 
        if (i < this.audioArray.length && i<this.limitAudio) {
            console.log(`шаг ${i}`);
            let object = this.audioArray[i];  
            this.setAudioDOM(object.audio);
            this.currentWord = object.word;
            this.timer();
        }
        else {
            this.endGame();
        }
    }




    //*-------Работа с DOM-----------*


    //------Отрисовка прелоадера-------
    drawPreloaderDOM(load) {
        if (load) {
            document.getElementsByClassName('body-audio-game')[0].style.display = 'none';
            document.getElementsByClassName('lds-default')[0].style.display = 'block';
        }
        else {
            document.getElementsByClassName('body-audio-game')[0].style.display = 'flex';
            document.getElementsByClassName('lds-default')[0].style.display = 'none';
        }
    }

    //-------Установка аудио----------
    setAudioDOM(audio) {
        let audioDOM = document.getElementById('audio-eng');
        audioDOM.src = audio;
        audioDOM.play();
    }

    //-----Инициализация таймера-----
    setTimerDOM() {
        let timerInDOM = document.getElementById('timer');
        timerInDOM.innerText = this.time;
        timerInDOM.className = '';
    }
}



//import OxfordApi from './OxfordApi'
//import Game from './Game';

//export default
    class AudioTranslationGame extends Game {
    constructor() {
        super();
    }


    init() {
        this.currentStep = 0;
        clearInterval(this.currentTimer);
        this.currentTimer = null;
        document.getElementsByClassName('button-next')[0].addEventListener('click', () => {
            clearInterval(this.currentTimer);
            this.stepWithInterval(this.currentStep + 1);
        })
    }

    start() {
        super.start();
        console.log("Начало игры");
        this.init();
        if (this.dictionary) {
            this.shakeDictionary();
            this.stepWithInterval(0);
            return;
        }
        let connDictionary = this.getWordsFromDictionary();
        connDictionary.then((dictionary) => {
            if (dictionary)
             dictionary.sort(() => {
                    return Math.random() - 0.5;
                });
            this.setDictionary(dictionary);
            if (!this.validation())
                return;
            this.stepWithInterval(0);
        })
            .catch((error) => console.log(` Ошибка при отрисовки игры ${error}`));
    }

    //-------Установка аудио в DOM----------
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

    //-------Работа таймера и проверка ответа(замыкание)-------
    timer() {
        let word = this.dictionary[this.currentStep].English;
        let time = this.time;
        let timerInDOM = document.getElementById('timer');
        let inputDOM = document.getElementById('user-input');
        this.setTimerDOM();
        var currentInterval = setInterval(() => {
            --time;
            timerInDOM.innerText = time;
            if (time == 3) {
                timerInDOM.className = 'red-text';
            }
            if (time <= 0) {
                this.downPoints();
                clearInterval(this.currentTimer);
                this.stepWithInterval(this.currentStep + 1);
                return;
            }
            inputDOM.addEventListener('keyup', () => {
                if (word.toLowerCase() == inputDOM.value.toLowerCase()) {
                    this.upPoints();
                    clearInterval(this.currentTimer);
                    this.stepWithInterval(this.currentStep + 1);
                    return;
                }
            });
        }, 1000);
        this.currentTimer = currentInterval;
    }

    //----------Шаг игры--------
    stepWithInterval(i) {
        this.currentStep = i;
        document.getElementById('user-input').value = '';
        if (i < this.lenghtDictionary) {
            let word = this.dictionary[i].English;
            let connOxford = new OxfordApi();
            connOxford.getAudioExemple(word).then((audio) => {
                if (!audio) {
                    console.log('аудио пропущено');
                    this.stepWithInterval(i + 1);
                    return;
                }
                this.setAudioDOM(audio);
                this.timer();
            });
            
        }
        else {
            this.endGame();
        }
    }

}



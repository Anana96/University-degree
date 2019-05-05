//import OxfordApi from './OxfordApi'
//import Game from './Game';

//export default
class AudioTranslationGame extends Game {
    constructor() {
        super();
        this.word = '';
        this.currentStep = 0;
        this.currentTimer = 0;
        document.getElementsByClassName('button-next')[0].onclick = this.nextStep.bind(this);
        document.getElementById('user-input').onkeyup = this.equalWord.bind(this);
    }


    nextStep() {
        clearInterval(this.currentTimer);
        console.log(`currentStep = ${this.currentStep}`);
        this.stepWithInterval(this.currentStep + 1);
    }

    equalWord() {
        let inputDOM = document.getElementById('user-input');
        if (this.word.toLowerCase() === inputDOM.value.toLowerCase()) {
            this.upPoints();
            this.nextStep();
            return;
        }
    }

    init() {
        this.currentStep = 0;
        this.word = '';
    }

    start() {
        super.start();
        this.init();
        console.log("Начало игры");
        if (this.dictionary) {
            this.shakeDictionary();
            this.stepWithInterval(0);
            return;
        }
        let connDictionary = this.getWordsFromDictionary();
        connDictionary.then((dictionary) => {
            this.setDictionary(dictionary);
            this.shakeDictionary();
            if (!this.validation())
                return;
            this.stepWithInterval(0);
        })
            .catch((error) => {
                console.log(` Ошибка при отрисовки игры ${error}`)
                this.message('Технические неполадки. Зайдите позже.');
            });
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

    //----------Шаг игры--------
    stepWithInterval(i) {        
        this.currentStep = i;
        document.getElementById('user-input').value = '';
        if (i < this.lenghtDictionary) {
            this.word = this.dictionary[i].English;
            let connOxford = new OxfordApi();
            connOxford.getAudioExemple(this.word).then((audio) => {
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



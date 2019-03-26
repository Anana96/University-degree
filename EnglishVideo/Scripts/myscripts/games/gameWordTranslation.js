//import Game from './Game';

//export default
    class WordTranslationGame extends Game {
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
            this.init();
            console.log("Начало игры");
            if (this.dictionary) {
                this.shakeDictionary();
                this.stepWithInterval(0);
                return;
            }
            let connDictionary = this.getWordsFromDictionary();
            connDictionary.then((dictionary) => {
            //перемешиваем массив случайным образом
            this.setDictionary(dictionary);
            if (!this.validation())
                return;
            this.stepWithInterval(0);
        })
            .catch((error) => console.log(` Ошибка при отрисовки игры ${error}`));

    }

    //-----Инициализация таймера-----
    setTimerDOM() {
        let timerInDOM = document.getElementById('timer');
        timerInDOM.innerText = this.time;
        timerInDOM.className = '';
    }

    //------Инициализации карточки с английским словом-------
    setEnglishTextDOM(word) {
        let engDOM = document.getElementById('card-eng');
        engDOM.innerText = word;
    }

    //----------Шаг игры--------
    stepWithInterval(i) {
        this.currentStep = i;
        document.getElementById('user-input').value = '';
        if (i < this.lenghtDictionary) {
            this.setEnglishTextDOM(this.dictionary[i].English);
            this.timer();
        }
        else {
            this.endGame();
        }
    }

    //-------Работа таймера и проверка ответа(замыкание)-------
    timer() {
        let time = this.time;
        let russianWord = this.dictionary[this.currentStep].Russia;
        let timerInDOM = document.getElementById('timer');
        let rusDOM = document.getElementById('user-input');
        this.setTimerDOM();
       
        var currentInterval = setInterval(() => {
            console.log(`время ${time}; i= перевод=${russianWord} ${currentInterval}`);
            --time;
            timerInDOM.innerText = time;
            if (time === 3) {
                timerInDOM.className = 'red-text';
            }
            if (time <= 0) {
                this.downPoints();
                clearInterval(this.currentTimer);
                this.stepWithInterval(this.currentStep + 1);
                return;
            }
            rusDOM.addEventListener('keyup', () => {
                if (russianWord.toLowerCase() === rusDOM.value.toLowerCase()) {
                    this.upPoints();
                    clearInterval(this.currentTimer);
                    this.stepWithInterval(this.currentStep + 1);
                    return;
                }
            });
        }, 1000);
        this.currentTimer = currentInterval;
    }



}


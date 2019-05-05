//import Game from './Game';

//export default
    class WordTranslationGame extends Game {
    constructor() {
        super();
        this.currentStep = 0;
        this.currentTimer = 0;
        this.currentWord = '';
        this.limitWords = 5;
        document.getElementsByClassName('button-next')[0].onclick = this.nextStep.bind(this);
        document.getElementById('user-input').onkeyup = this.equalWord.bind(this);
    }

    //---------Инициализация игры---------
    init() {
        this.drawPreloaderDOM(true);
        this.currentStep = 0;
        clearInterval(this.currentTimer);
    }

    //---------Проверка равенства введенного слова и слова-аудио------
    equalWord() {
        let inputDOM = document.getElementById('user-input');
        if (this.currentWord.Russia.toLowerCase() === inputDOM.value.toLowerCase()) {
            this.upPoints();
            this.nextStep();
            return;
        }
    }

    //---------Следующий шаг игры-----
    nextStep() {
        clearInterval(this.currentTimer);
        console.log(`currentStep = ${this.currentStep}`);
        this.stepWithInterval(this.currentStep + 1);
    }
    //---------Старт игры-------------
    start() {
        super.start();
        this.init();
        console.log("Начало игры");
        //если словарь уже получен
        if (this.dictionary) {
            this.shakeArray(this.dictionary);
            this.drawPreloaderDOM(false);
            this.stepWithInterval(0);
            return;
        }
        //получение словаря
        let connDictionary = this.getWordsFromDictionary();
        connDictionary.then((dictionary) => {
            this.setDictionary(dictionary);
            if (!this.validation())
                return;
            this.drawPreloaderDOM(false);
            this.stepWithInterval(0);
        })
            .catch((error) => {
                this.message('Технические неполадки. Зайдите позже.');
                console.log(` Ошибка при отрисовки игры ${error}`);
            });
    }

    //-----Инициализация таймера-----
    setTimerDOM() {
        let timerInDOM = document.getElementById('timer');
        timerInDOM.innerText = this.time;
        timerInDOM.className = '';
    }

    //------Инициализации карточки с английским словом-------
    setEnglishTextDOM() {
        let engDOM = document.getElementById('card-eng');
        engDOM.innerText = this.currentWord.English;
    }

    //----------Шаг игры--------
    stepWithInterval(i) {
        this.currentStep = i;
        document.getElementById('user-input').value = '';
        this.currentWord = this.dictionary[i];
        if (i < this.lenghtDictionary && i<this.limitWords) {
            this.setEnglishTextDOM();
            this.timer();
        }
        else {
            this.endGame();
        }
    }

    //-------Работа таймера и проверка ответа(замыкание)-------
    timer() {
        let time = this.time;
        let timerInDOM = document.getElementById('timer');
        this.setTimerDOM();
       
        this.currentTimer = setInterval(() => {
            --time;
            console.log(`время ${time}; i= перевод=${this.currentWord.Russia} ${this.currentTimer}`);
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
        }, 1000);
    }

    //------Отрисовка прелоадера-------
    drawPreloaderDOM(load) {
        if (load) {
            document.getElementsByClassName('body-word-translation-game')[0].style.display = 'none';
            document.getElementsByClassName('lds-default')[0].style.display = 'block';
        }
        else {
            document.getElementsByClassName('body-word-translation-game')[0].style.display = 'flex';
            document.getElementsByClassName('lds-default')[0].style.display = 'none';
        }
    }

}


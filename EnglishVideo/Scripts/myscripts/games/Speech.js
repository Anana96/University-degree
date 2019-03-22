'use strict';
function Recognizer() {
    let resultText = '';
    return new Promise((resolve, reject) => {
        if ('webkitSpeechRecognition' in window) {
            var recognition = new webkitSpeechRecognition();
            recognition.lang = 'en';
            recognition.continuous = true;
            recognition.onresult = function (event) {
                var result = event.results[event.resultIndex];
                //  console.clear();
                console.log(event);
                resultText += result[0].transcript;
                console.log(result[0].transcript);
            };

            recognition.onend = function () {
                console.log('Распознавание завершилось.');
                resolve(resultText);
            };


            recognition.start();

            //var currentInterval = (time) => {
            //    time--;
            //    console.log(time);
            //    if (time <= 0) {
            //        clearInterval(currentInterval);
            //        recognition.stop();
            //        return;
            //    }
            //};

            //recognition.onsoundend = () => {
            //    console.log('Молчун');
            //};

            //recognition.onspeechend = () => {
            //    console.log('Ты молчун');
            //    let time = 5;
            ////    currentInterval(time);
            //};

            //recognition.onspeechstart = () => {
            //    console.log('Звук есть');
            //    clearInterval(currentInterval);
            //}

        } else {
            reject('webkitSpeechRecognition не поддерживается :(');
        }
    });
}

function startGame() {
    //отрисовка текста
    let textDOM = document.getElementsByClassName('text-speech ')[0];
    textDOM.style.display = 'block';
   
    let initialText = 'Once upon a time there was a miller who had three sons. When he died he left his mill to the eldest son, his ass to the second son, and his cat to the youngest, who had always been his favourite.';
    initialText += 'The two eldest sons resolved to live together; but they would not let their brother live with them, because he had only a cat.So the poor lad was very sorrowful, and wondered what he should do to get his bread.While he was sitting thinking about it, Puss jumped up on the table, and touched him with her paw.';
    textDOM.innerHTML = '<span>'+initialText+'</span>';

    console.log('старт');
    let preloaderDOM = document.getElementsByClassName('lds-default')[0];
    let interest = document.getElementsByClassName('result-speech')[0]; //процент
    preloaderDOM.style.display = 'block';
    Recognizer().then((textRecord) => {
        console.log(`полученный текст: ${textRecord}`);
        preloaderDOM.style.display = 'none';
        interest.innerText ='Вы угадали на:'+recordProcessing(initialText, textRecord)+'%';
    })
        .catch((error) => console.log(`ошибка при распозновании голоса: ${error}`));

}

function textProcessing(text) {
    text = text.toLowerCase();
    text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""); //удаление знаков препинани
    text = text.replace(/\s{2,}/g, " ");//удаление лишних пробелов
    return text;

}


function recordProcessing(textInput, textRecord) {
    let procesingTextInput = textProcessing(textInput);
    textRecord = textProcessing(textRecord);
    let arrTextInput = procesingTextInput.split(' ');
    let arrTextRecord = textRecord.split(' ');
    if (arrTextRecord.length === 1)
        return;
    console.log(arrTextInput);
    console.log(arrTextRecord);
    let totalWords = arrTextInput.length;
    console.log(totalWords);
    let findWords = 0;
    let indexRecordPosition = 0;
    let interest = 0;
    arrTextInput.forEach((word,index) => {
        let posPrev = indexRecordPosition - 1;
        let posNext = indexRecordPosition + 1;
        console.log(`Слово: ${index}, позиция записи: ${indexRecordPosition}`);
        if (word === arrTextRecord[indexRecordPosition]) {
            console.log(`find ${word}`);
            ++findWords;
            ++indexRecordPosition;
        } else
            if (posPrev >= 0) {
                if (word === arrTextRecord[posPrev]) {
                    console.log(`find ${word}`);
                    ++findWords;
                }
            } else
                if (posNext <= arrTextRecord.length - 1) {
                    if (word === arrTextRecord[posNext]) {
                        console.log(`find ${word}`);
                        ++findWords;
                        indexRecordPosition = posNext+1;
                    }
                }  
                else ++indexRecordPosition;
    })
    interest = Math.floor((findWords / totalWords)*100);
    return interest;
}

//точка входа
document.getElementById('button-start-game').addEventListener('click', () => {
    document.getElementsByClassName('window-start-game')[0].style.display = 'none';
    setTimeout(() => { document.getElementById('body-speech-game').style.display = 'flex'; startGame(); }, 1000);
});
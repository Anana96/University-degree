/* import Context from './Context';
import DragAndDropGame from './GameDragAndDrop';
import WordTranslationGame from './GameWordTranslation';
import ExampleSentencesGame from './GameExamplesSentences';
import SpeechGame from './GameSpeech';
import AudioTranslationGame from './GameAudioTranslation';
import routes from './route';
*/

class Main {

    run() {
        let currentPathName = document.location.pathname;
        let action = routes[currentPathName];
        let context = new Context();
        console.log(`Текущее действие: ${action}`);
        switch (action) {
            case "dragAndDrop":
                context.setGame(new DragAndDropGame());
                console.log("dragAndDrop");
                break;
            case "wordTranslation":
                context.setGame(new WordTranslationGame());
                console.log("wordTranslation");
                break;
            case "exampleSentences":
                context.setGame(new ExampleSentencesGame());
                console.log("context");
                break;
            case "speech":
                context.setGame(new SpeechGame());
                break;
            case "audioTranslation":
                context.setGame(new AudioTranslationGame());
                console.log("audioTranslation");
                break;
            default:
                console.log("Такой игры нет");
        }
        if(context.game)
            context.startGame();
    }   
}

let main = new Main();
main.run();
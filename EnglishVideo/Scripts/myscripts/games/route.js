import DragAndDropGame from './GameDragAndDrop';
import WordTranslationGame from './GameWordTranslation';
import PasteGame from './GameExamplesSentences';
import SpeechGame from './SpeechGame';
import ListeningGame from './ListeningGame';



const routes = {
    "/Games/DragAndDrops": DragAndDropGame,
    "/Games/WordTranslationGame": WordTranslationGame,
    "/Games/ExampleSentencesGame": PasteGame,
    "/Games/SpeechGame": SpeechGame,
    "/Games/AudioGame": ListeningGame
};

export default routes;


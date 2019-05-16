import Context from './Context';
import routes from './route';
import Game from './Game';

class Main {

    constructor() {
        this.currentPathName = document.location.pathname;
        this.action = null;
        this.context = null;
    }


    run() {
        let context = new Context();
        this.action = routes[this.currentPathName];
        this.action ? context.setGame(new this.action()) : context.setGame(new Game());
        context.startGame();
    }   
}

let main = new Main();
main.run();
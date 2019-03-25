﻿class Context {

    constructor() {
     this.game = null;
    }

    setGame(game) {
        this.game = game;
    }

    startGame() {
        document.getElementById('button-start-game').addEventListener('click', () => {
            document.getElementsByClassName('window-start-game')[0].style.display = 'none';
            setTimeout(() => { document.getElementsByClassName('body-game')[0].style.display = 'flex'; this.game.start(); }, 1000);
        });
    }

}


//export default Context;
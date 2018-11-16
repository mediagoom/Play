import { EventEmitter } from 'events';

const PACKEVENT = Object.freeze({
    STARTED:  'started'
    ,ERROR:  'error'
});

const PLAYEVENT = Object.freeze({
    STARTED:   'started'
    ,ERROR:  'error'
    ,PLAYER: 'player'
    ,URL: 'url'
});

class basepack extends EventEmitter{
    
    get events(){ return PACKEVENT; }

    raiseEvent(packevent)
    {
        this.emit(packevent);
    }
}

export {basepack, PLAYEVENT};
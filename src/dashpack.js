import { EventEmitter } from "events";
import dashjs from 'dashjs';

function dodash(myself,    src
    , id, autoplay)
{
    var url = src;
    
    //var key = URI(url).absoluteTo('..');
    //var key = URI('./json.ck').absoluteTo(src).toString();
    
        
    myself.dashplayer = dashjs.MediaPlayer().create();
    
     
    var elem = document.querySelector("#" + id);

    if (null == autoplay)
        autoplay = false;

    /*
    player.setProtectionData({
        "org.w3.clearkey":
            { "serverURL": key }
    });
    */

    
    myself.dashplayer.on(dashjs.MediaPlayer.events.PLAYBACK_STARTED, function()
    {
        myself.emit("started");
        
    }, null);
    

    myself.dashplayer.initialize(elem, url, autoplay);

    
       
}

export default class dashpack extends EventEmitter {

    constructor(options) {
        super();

        this.dashplayer = null;
    }

    play(url, videotagid, autoplay)
    {
        dodash(this, url, videotagid, autoplay);
    }

    pause()
    {
        this.dashplayer.pause();
    }

    time()
    {
        return this.dashplayer.time();
    }


}

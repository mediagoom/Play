import {basepack, PLAYEVENT} from "./basepack.js";
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
        myself.raiseEvent(myself.events.STARTED);
        
    }, null);
    

    myself.dashplayer.initialize(elem, url, autoplay);
  
}

export default class dashpack  extends basepack {

    constructor(options) {
        super();

        this.dashplayer = null;
    }

    play(url, videotagid, poster, autoplay)
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

    get duration()
    {
        return this.dashplayer.duration();
    }

    get name()
    {
        return "dashjs";
    }


}

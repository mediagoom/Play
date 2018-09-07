import {basepack, PLAYEVENT} from "./basepack.js";

function dovideo(myself,    src
    , id, autoplay)
{
    var url = src;
    
    
        
    myself.videoplayer = document.querySelector("#" + id);
    myself.videoplayer.src = url;
    

    if (null == autoplay)
        autoplay = false;

    /*
    player.setProtectionData({
        "org.w3.clearkey":
            { "serverURL": key }
    });
    */

    
    myself.videoplayer.onplay = function()
    {
        //myself.emit("started");

        myself.raiseEvent(myself.events.STARTED);
        
    };
    
    /*
    if(autoplay)
        myself.videoplayer.play();
    */

}

export default class videopack extends basepack {

    constructor(options) {
        super();

        this.videoplayer = null;
    }

    play(url, videotagid, poster, autoplay)
    {
        //debugger;
        dovideo(this, url, videotagid, autoplay);
    }

    pause()
    {
        this.videoplayer.pause();
    }

    time()
    {
        let played = this.videoplayer.played;

        if(!played.length)
            return 0;

        return played.end(played.length - 1);
    }

    get duration()
    {
        return this.videoplayer.duration;
    }

    get name()
    {
        return "html5";
    }



}

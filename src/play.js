import { EventEmitter } from "events";
import dashpack from './dashpack';
import detector from './detector';


function html5embed(
      src
    , poster
    , id
    , controls
    , autoplay
    , cssclass
    ){

    var obj  = '<video '
        obj += ' id="';
        obj += id
        obj += '" ';

    if(null != cssclass)
    {
        obj += ' class="';
        obj += cssclass
        obj += '" ';
    }
    else
    {
        obj += ' style="';
        obj += 'width: 100%; height: auto;'
        obj += '" '
    }
    

    if (controls)
        obj += 'controls';

    if (null != poster)
    {
        obj += ' poster="';
        obj += poster;
        obj += '"';
    }

    if (true == autoplay) {
        obj += ' autoPlay';
    }
       
    
    obj += '>';

    if (null != src)
    {
        obj += '<source src="';
        obj += escape(src);
        obj += '" />';
    }
    
    obj += '</video>';

    return obj;

}

function registerevents(myself)
{
    myself.player.on("started", () => myself.emit("started"));
}

export default class mgPlayer extends EventEmitter {
    
    constructor(options) {
        super();

        let defopt = {
            autoplay : true
            , id     : 'player'
            , hostid : 'playerhost'
        };

        this.options = Object.assign(defopt, options);
        /*
        if(null == this.options.width || null == this.options.height)
        {

            let div    = document.getElementById(this.options.hostid);

            let width  = div.clientWidth * 0.8;

            let height = width / 16 * 9;

                width  = Math.floor(width);
                height = Math.floor(height);

                if(null == this.options.width)
                    this.options.width = width;

                if(null == this.options.height)
                    this.options.height = height;
        }*/

        this.tag = null; 
        this.player = null;
        this.detector = new detector();
    }

    playdash(url, poster)
    {
       let v5 = html5embed(null, poster, this.options.id, this.options.controls, this.options.autoplay);
       let div = document.getElementById(this.options.hostid);
           div.innerHTML = v5;

       //dodash(this, url, this.options.id, this.options.autoplay);
       //

       this.player = new dashpack();
       registerevents(this);
       
       this.player.play(url, this.options.id, poster, this.options.autoplay);
      
    }

    pause()
    {
        this.player.pause();
    }

    time()
    {
        return this.player.time();
    }


}

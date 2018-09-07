import { EventEmitter } from "events";
import {PLAYEVENT} from "./packs/basepack.js";
import dashpack from './packs/dashpack';
import videopack from './packs/nativepack';
import detector from './detector';
import urijs from 'urijs';
import dbgmodule from 'debug';


const dbg = dbgmodule('mgplay:play');
//localStorage.debug = 'mgplay:*'

function html5embed(
      src
    , poster
    , id
    , options
    ){

    let defopt = {
        autoplay : true
        , controls : true
        , cssclass : null
        , muted : false
    };

    let opt = Object.assign(defopt, options);

    var obj  = '<video '
        obj += ' id="';
        obj += id
        obj += '" ';

    if(null != opt.cssclass)
    {
        obj += ' class="';
        obj += opt.cssclass
        obj += '" ';
    }
    else
    {
        obj += ' style="';
        obj += 'width: 100%; height: auto;'
        obj += '" '
    }
 
    if (opt.controls)
        obj += 'controls';

    if (null != poster)
    {
        obj += ' poster="';
        obj += poster;
        obj += '"';
    }

    if (true == opt.autoplay) {
        obj += ' autoPlay';
    }

    if (true == opt.muted) {
        obj += ' muted';
    }       
    
    obj += '>';

    if (null != src)
    {
        obj += '<source src="';
        obj += escape(src);
        obj += '" />';
    }
    
    obj += '</video>';

    dbg("HTML5 ELEMENT: ", obj);

    return obj;

}

function absolute(base, move)
{
     var url = urijs(move);
        // url = url.segment(move);
     return url.absoluteTo(base).href();
}

function registerevents(myself)
{
    myself.player.on(myself.player.events.STARTED, () => myself.emit(myself.events.STARTED));
}

export default class mgPlayer extends EventEmitter {
    
    constructor(options) {
        super();

        let defopt = {
            autoplay : true
            , id     : 'player'
            , hostid : 'playerhost'
            , controls : true
            , muted : false
        };

        this.options = Object.assign(defopt, options);
       
        this.tag = null; 
        this.player = null;
        this.detector = new detector();
    }

    get events(){ return PLAYEVENT; }

    _loadplayer(player, url, poster)
    {
       
       let v5 = html5embed(null, poster, this.options.id, this.options);
       let div = document.getElementById(this.options.hostid);
           div.innerHTML = v5;

       this.player = player;
       registerevents(this);
       
       this.emit(this.events.PLAYER, this.player.name);
       this.emit(this.events.URL, url);

       this.player.play(url, this.options.id, poster, this.options.autoplay);
    }

    playdash(url, poster)
    {

       if(!this.detector.MediaExtension())
           throw new Error('No MSE support detected');

       this._loadplayer( new dashpack(), url, poster );
    }

    playhls(url, poster)
    {
        if(this.detector.HLSNative())
        {
            this._loadplayer( new videopack(), url, poster );
            return;
        }
        else
        {
            if(this.detector.MediaExtension())
                throw new Error('MSE HLS not supported yet');

            return;
        }


        throw new Error('HLS not supported');

    }
    
    play(infouri, info)
    {
        /*
{
   "status":"ok",
   "name":"sample_flv",
   "id":"002612759048_sample_flv",
   "owner":"pippo",
   "hls3":"STATIC/main.m3u8",
   "dash":"STATIC/index.mpd",
   "thumb":[
      "img001.jpg",
      "img002.jpg"
   ],
   "hls4":null,
   "playready":null,
   "widevine":null
}
         * 
         */

        let poster = null;

        if(Array.isArray(info.thumb) && info.thumb.length)
        {
            let idx = 0;
            if(1 < info.thumb.length)
            {
                idx = 1;
            }

            poster = absolute(infouri, info.thumb[idx]);
        }

        if('string' === typeof info.thumb)
        {
            poster = absolute(infouri, info.thumb);
        }      
        
        if(this.detector.MediaExtension() && ('string' === typeof info.dash))
        {
            dbg("DASH", infouri, info.dash, absolute(infouri, info.dash));
            this.playdash(absolute(infouri, info.dash), poster);
            return true;

        }

        var hlsuri = (null == info.hls4)?info.hls3:info.hls4;

        if(this.detector.HLSNative() && ('string' === typeof hlsuri))
        {
            dbg("HLS", infouri, hlsuri, absolute(infouri, hlsuri));
            this.playhls(absolute(infouri, hlsuri), poster);
            return true;

        }

        dbg("CANNOT FIND A VALID PLUGIN PLAYER");

        const msg = 'Cannot find a valid player url configuration';

        return false;

    }

    pause()
    {
        this.player.pause();
    }

    time()
    {
        return this.player.time();
    }

    get duration()
    {
        return this.player.duration;
    }

}

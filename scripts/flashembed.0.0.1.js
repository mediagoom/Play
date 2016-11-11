
/*
<param name="flashvars" value="src=http://mediapm.edgesuite.net/osmf/content/test/manifest-files/dynamic_Streaming.f4m&amp;autoPlay=true&amp;controlBarAutoHide=false&amp;poster=images/poster.png&amp;javascriptCallbackFunction=onJavaScriptBridgeCreated">



FlashJavaScriptBridge: type: waiting params: {}
FlashJavaScriptBridge: type: seeking params: {"seeking":true}
FlashJavaScriptBridge: type: complete params: {"ended":true}



FlashJavaScriptBridge: type: pause params: {"paused":true}
FlashJavaScriptBridge: type: seeked params: {"seeking":false}
FlashJavaScriptBridge: type: emptied params: {"ended":false,"seeking":false,"networkState":0,"duration":null,"src":"skateboard_full_hd/index.mpd","error":null,"paused":false,"readyState":0}
FlashJavaScriptBridge: type: pause params: {"paused":true}
FlashJavaScriptBridge: type: progress params: {"buffered":{"_start":[0],"_end":[null],"length":1}}
FlashJavaScriptBridge: type: timeupdate params: {"currentTime":0.0030000000000000026,"duration":58.024}
FlashJavaScriptBridge: type: progress params: {"buffered":{"_start":[0],"_end":[null],"length":1}}



*/


function onJavaScriptBridgeCreated(id, event_type, params)
{    
    var ev = '<no type>';

    if (null != event_type)
        ev = event_type;

    var pa = '<no param>';

    if (null != pa)
        pa = JSON.stringify(params);

    console.log("FlashJavaScriptBridge:" + id + " type: " + ev + " params: " + pa);
}

function flashembedhtml(
      height
    , width
    , swf
    , src
    , poster
    , autoplay
    , controls
    , id
    )
{
    var flashvars = "src=";
    flashvars += escape(src);

    var fid = '__flash__';

    if (null != id)
        fid = id;


        if(null != poster)
        {
            flashvars += "&poster=";
            flashvars += escape(poster);
        }

        if (null == autoplay)
            autoplay = false;

        flashvars += "&autoPlay=";
        flashvars += autoplay.toString();

        //does not work yet
        flashvars += "&javascriptCallbackFunction=onJavaScriptBridgeCreated";

        var obj = '<object '

        /*
        obj += 'width="';
        obj += width;
        obj += '" height="';
        obj += height;
        obj += '"'
        */

        obj += 'id="';
        obj += fid;
        obj += '"';

        obj += ' class="';
        obj += 'responsive_player'
        obj += '" ';
            
            
        obj += '>\r\n';

        obj += '<param name="movie" value="';
        obj += escape(swf);
        obj += '"></param>';

        obj += '<param name="flashvars" value="';
        obj += flashvars;
        obj += '"></param>';

        obj += '<param name="allowFullScreen" value="true"><param name="allowscriptaccess" value="always"><param name="wmode" value="direct">'

        var embed = '<embed src="';
        embed += escape(swf);
        embed += '" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="direct" ';
        embed += 'width="'
        embed += width;
        embed += '" height="';
        embed += height;
        embed += '" flashvars="';
        embed += flashvars;
        embed += '"';
        embed += 'id="';
        embed += fid;
        embed += '" ></embed>'

        obj += embed;

        obj += '</object>'
       
        return obj;

}

function html5embed(height
    , width
    , src
    , poster
    , id
    , controls
    , autoplay) {

    var obj = '<video '
        obj += ' id="';
        obj += id
        obj += '" ';

    /*
    obj += ' width="';
    obj += width;
    obj += '" height="';
    obj += height;
    obj += '" ';
    */

        obj += ' class="';
        obj += 'responsive_player'
        obj += '" ';
    

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





function drm_detect(obj) {
       
    var clearkey = [
           {
               "initDataTypes": [
                  "cenc"
               ],
               "audioCapabilities": [
                  {
                      "contentType": "audio/mp4;codecs=\"mp4a.40.2\""
                  }
               ],
               "videoCapabilities": [
                  {
                      "contentType": "video/mp4;codecs=\"avc1.4d401e\""
                  }
               ],
               "distinctiveIdentifier": "optional",
               "persistentState": "optional",
               "sessionTypes": [
                  "temporary"
               ]
           }
    ];

    var CK = 'org.w3.clearkey';
    var PR = 'com.microsoft.playready';

    if (window['MSMediaKeys']
        && window['MSMediaKeys'].isTypeSupported)
    {
        if (window['MSMediaKeys'].isTypeSupported(CK, clearkey[0].videoCapabilities[0].contentType)) {

            obj[CK] = true;
        }
        else {
            obj[CK] = false;

        }

        if (window['MSMediaKeys'].isTypeSupported(PR, clearkey[0].videoCapabilities[0].contentType)) {
            obj[PR] = true;
            
        }else
        {
            obj[PR] = false;
           
        }
    }


    if (navigator.requestMediaKeySystemAccess) {

        obj[CK] = 'calling';
        obj[PR] = 'calling';

        navigator.requestMediaKeySystemAccess(CK, clearkey).then(function (mediaKeySystemAccess) {

            obj[CK] = true;
            
        }).catch(function () {

           obj[CK] = false;
          

        });


        navigator.requestMediaKeySystemAccess(PR, clearkey).then(function (mediaKeySystemAccess) {

           obj[PR] = true;
           

        }).catch(function () {

            obj[PR] = false;
            

        });
    }


}



function dodash(   src
    , id, autoplay)
{
    var url = src;
    
    //var key = URI(url).absoluteTo('..');

    var key = URI('./json.ck').absoluteTo(src).toString();
        

    var player = dashjs.MediaPlayer().create();
    
     
    var elem = document.querySelector("#" + id);

    if (null == autoplay)
        autoplay = false;

    player.setProtectionData({
        "org.w3.clearkey":
            { "serverURL": key }
    });

    player.on(dashjs.MediaPlayer.events.PLAYBACK_STARTED, function()
    {
        //alert('start');
        
       
    
    }, null);
    player.initialize(elem, url, autoplay);
    

    

    /*
    player.attachView(elem);
    player.setAutoPlay(autoplay);
    player.attachSource(url);
    */
    
}

function get_default_options()
{

    var options = {
        "player":
            {
                  dash: true
                , flash: true
                , hls: true
                , html5: true
            }
        , "protocols":
            {
                dash: true
                , ssf: true
                , hls: true
                , progressive: true
            }
        , "encrypted" : false
    }

    return options;

}

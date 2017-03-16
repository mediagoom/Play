

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

function checkPlay (element, mime, strict, context) {
        var testElement = context._video;
        if (element === 'audio') {
            //testElement = context._audio;

            throw new Error("not supported");
        }
        if ((strict && testElement.canPlayType(mime) === 'probably') ||
            (!strict && testElement.canPlayType(mime) !== '')) {
            return true;
        }
        return false;
};



export default class detector {

    constructor(){
        
        this.drm = {};
        drm_detect(this.drm);

        this._video = document.createElement('video');

    }

    Video5 () {
        return !!this._video.canPlayType;
    };

    H264 (profile) {
        var videoCodec = 'avc1.42E01E'; // baseline 3.0 profile
        if (!!profile) {
            if (profile === 'main30') { // main 3.0 profile
                videoCodec = 'avc1.4D401E';
            } else if (profile === 'high30') { // high 3.0 profile
                videoCodec = 'avc1.64001E';
            } else if (profile === 'high40') { // high 4.0 profile
                videoCodec = 'avc1.640028';
            } else if (profile === 'high50') { // high 5.0 profile
                videoCodec = 'avc1.640032';
            }
        }
        var mimeType = 'video/mp4; codecs="' + videoCodec + ',mp4a.40.2"';
        if (this.Video5()) {
            return checkPlay('video', mimeType, true, this);
        }
        return false;
    };

    MediaExtension () {
        var mse = "MediaSource" in window || "WebKitMediaSource" in window;
        return !!mse;
    };

    HLSNative () {
        if (this.Video5()) {
            // HLS video MIME type as per
            // https://tools.ietf.org/html/draft-pantos-http-live-streaming-14
            return checkPlay('video',
                'application/vnd.apple.mpegurl',
                false,
                this
                );
        }
        return false;
    }; 

   
    flash  () {
        var hasFlash = false;
        var flashVersion = null;
        var support = [hasFlash, flashVersion];
        var ua = this.getUserAgent();
        // IE 9, 10 with ActiveXObject (not tested on IE 8)
        var ie = _isIE(ua);
        if (ie[0] && ie[1][0] < 11) {
            try {
                var flash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                hasFlash = true;
                flashVersion = _parsePluginDescription(flash.GetVariable('$version'));
                support = [hasFlash, flashVersion];
            } catch (e) {
                support = [hasFlash, flashVersion];
            }
        } else if (this._plugins) {
            // check by plugin direct name first as explained
            // on https://developer.mozilla.org/en-US/docs/Web/API/NavigatorPlugins.plugins
            var flash = nav.plugins['Shockwave Flash'];
            if (!!flash) {
                hasFlash = true;
                if (!!flash.version) {
                    flashVersion = _parsePluginVersion(flash.version);
                } else if (!!flash.description) {
                    flashVersion = _parsePluginDescription(flash.description);
                }
                support = [hasFlash, flashVersion];
            }
        } else if (this._mimeTypes) {
            // check by mimeTypes as a fallback
            var flash = nav.mimeTypes['application/x-shockwave-flash'];
            if (!!flash && flash.enabledPlugin) {
                hasFlash = true;
                if (!!flash.enabledPlugin.description) {
                    flashVersion = _parsePluginDescription(flash.enabledPlugin.description);
                }
                support = [hasFlash, flashVersion];
            }
        }
        return support;
    };            

                   
    /*
                    var hasflash = flash[0];
                    if (hasflash)
                    {
                        var major = flash[1][0];
                        hasflash = (major > 12);
                    }
    */
}

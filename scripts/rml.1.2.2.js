/**
 * Radiant MediaLyzer 1.2.2 | http://www.radiantmedialyzer.net
 * Copyright (c) 2014-2015  Radiant Media Player | Arnaud Leyder EIRL
 * https://www.radiantmediaplayer.com/
 * MIT License http://www.radiantmedialyzer.net/license.html
 */

/**
 * RadiantML class definition
 * @class
 */
var RadiantML = (function (win, doc, nav) {
    "use strict";
    /**
     * Creates an instance of RadiantML
     * @constructor
     */
    function RadiantML() {
        this._userAgent = _getUserAgent();
        this._plugins = _getPlugins();
        this._mimeTypes = _getMimeTypes();
        this._standalone = _getStandaloneMode();
        this._video = doc.createElement('video');
        this._audio = doc.createElement('audio');
        this._canvas = doc.createElement('canvas');
    }

    /**** private methods start here ****/
    /**
     * Obtain user agent string
     * @private
     * @returns {string|null} user agent string or null
     */
    var _getUserAgent = function () {
        return nav.userAgent || null;
    };
    /**
     * Obtain user agent plugins list
     * @private
     * @returns {Object|null} PluginArray or null
     */
    var _getPlugins = function () {
        if (!!nav.plugins && nav.plugins.length > 0) {
            return nav.plugins;
        }
        return null;
    };
    /**
     * Obtain user agent mime types list
     * @private
     * @returns {Object|null} MimeTypeArray or null
     */
    var _getMimeTypes = function () {
        if (!!nav.mimeTypes && nav.mimeTypes.length > 0) {
            return nav.mimeTypes;
        }
        return null;
    };
    /**
     * Obtain user agent standalone mode (iOS only)
     * @private
     * @returns {boolean|null} is in standalone mode or null
     */
    var _getStandaloneMode = function () {
        return nav.standalone || null;
    };
    /**
     * Can play type (MIME types) method for HTML5 media elements
     * @private
     * @param {string} element - the HTML5 media element to be tested
     * @param {string} mime - the MIME type to be tested
     * @param {string} strict - level of support to test ('probably' or/and 'maybe')
     * @returns {boolean} the MIME type is supported or not
     */
    var _canPlayType = function (element, mime, strict, context) {
        var testElement = context._video;
        if (element === 'audio') {
            testElement = context._audio;
        }
        if ((strict && testElement.canPlayType(mime) === 'probably') ||
            (!strict && testElement.canPlayType(mime) !== '')) {
            return true;
        }
        return false;
    };
    /**
     * User agent: Internet Explorer browser
     * @public
     * @param {string} ua - user agent string
     * @returns {Object} an Array as [boolean, Object] where boolean indicates
     * if Internet Explorer browser is detected and Object is an Array holding the
     * version [major, minor, pacth] or null if not available.
     */
    var _isIE = function (ua) {
        var isIE = false;
        var ieVersion = null;
        var pattern = /(msie|trident)/i;
        if (pattern.test(ua)) {
            isIE = true;
            pattern = /msie/i;
            if (pattern.test(ua)) {
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) !== null) {
                    ieVersion = parseFloat(RegExp.$1);
                }
            } else {
                ieVersion = 11;
            }

        }
        return [isIE, [ieVersion, 0, 0]];
    };
    /**
     * Get plugin version from version property
     * @private
     * @param {string} version - the version string
     * @returns {Object} Array with the version number [major, minor, patch]
     */
    var _parsePluginVersion = function (version) {
        if (!!version) {
            var versionArray = version.split('.');
            if (versionArray[0] && versionArray[1]) {
                return [
                  parseInt(versionArray[0], 10),
                  parseInt(versionArray[1], 10),
                  parseInt(versionArray[2] || 0, 10)
                ];
            }
        }
        return null;
    };
    /**
     * Get plugin version from description property
     * @private
     * @param {string} description - the description string
     * @returns {Object} Array with the version number [major, minor, patch]
     */
    var _parsePluginDescription = function (description) {
        if (!!description) {
            var matches = description.match(/[\d]+/g);
            if (matches) {
                if (matches.length >= 3) {
                    matches.length = 3;
                }
                if (matches[0] && matches[1]) {
                    return [
                      parseInt(matches[0], 10),
                      parseInt(matches[1], 10),
                      parseInt(matches[2] || 0, 10)
                    ];
                }
            }
        }
        return null;
    };

    /**** public methods start here ****/
    /*** public getters ***/
    /**
     * Getter getUserAgent
     * @public
     * @returns {string|null} user agent string or null
     */
    RadiantML.prototype.getUserAgent = function () {
        return this._userAgent;
    };
    /**
     * Getter getPlugins
     * @public
     * @returns {Object|null} PluginArray or null
     */
    RadiantML.prototype.getPlugins = function () {
        return this._plugins;
    };
    /**
     * Getter getMimeTypes
     * @public
     * @returns {Object|null} MimeTypeArray or null
     */
    RadiantML.prototype.getMimeTypes = function () {
        return this._mimeTypes;
    };
    /**
     * Getter getStandaloneMode
     * @public
     * @returns {boolean|null} is in standalone mode or null
     */
    RadiantML.prototype.getStandaloneMode = function () {
        return this._standalone;
    };

    /*** feature detection ***/
    /**
     * Feature: video tag support
     * @public
     * @returns {boolean} has HTML5 video tag support (or not)
     */
    RadiantML.prototype.video5 = function () {
        return !!this._video.canPlayType;
    };
    /**
     * Feature: mp4 with H264 baseline video and AAC low complexity audio
     * @public
     * @param {string} profile - the H.264 profile
     * @returns {boolean} has mp4/H264 (with the param profile) support in HTML5 video (or not)
     */
    RadiantML.prototype.mp4H264AAC = function (profile) {
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
        if (this.video5()) {
            return _canPlayType('video', mimeType, true, this);
        }
        return false;
    };
    /**
     * Feature: WebM with VP8 video and Vorbis audio
     * @public
     * @returns {boolean} has WebM VP8/Vorbis support in HTML5 video (or not)
     */
    RadiantML.prototype.webmVP8Vorbis = function () {
        if (this.video5()) {
            return _canPlayType(
                'video',
                'video/webm; codecs="vp8, vorbis"',
                true,
                this
                );
        }
        return false;
    };
    /**
     * Feature: WebM with VP9 video and Vorbis audio
     * @public
     * @returns {boolean} has WebM VP9/Vorbis support in HTML5 video (or not)
     */
    RadiantML.prototype.webmVP9Vorbis = function () {
        if (this.video5()) {
            return _canPlayType(
                'video',
                'video/webm; codecs="vp9, vorbis"',
                true,
                this
                );
        }
        return false;
    };
    /**
     * Feature: Ogg with Theora video and Vorbis audio
     * @public
     * @returns {boolean} has Ogg Theora/Vorbis support in HTML5 video (or not)
     */
    RadiantML.prototype.oggTheoraVorbis = function () {
        if (this.video5()) {
            return _canPlayType(
                'video',
                'video/ogg; codecs="theora, vorbis"',
                true,
                this
                );
        }
        return false;
    };
    /**
     * Feature: Native fullscreen support
     * @public
     * @returns {boolean} has native fullscreen support (or not)
     */
    RadiantML.prototype.nativeFS = function () {
        var fs = doc.documentElement.requestFullscreen ||
            doc.documentElement.mozRequestFullScreen ||
            doc.documentElement.webkitRequestFullscreen ||
            doc.documentElement.msRequestFullscreen;
        return !!fs;
    };
    /**
     * Feature: audio tag
     * @public
     * @returns {boolean} has HTML5 audio tag support (or not)
     */
    RadiantML.prototype.audio5 = function () {
        return !!this._audio.canPlayType;
    };
    /**
     * Feature: M4A/AAC-LC audio
     * @public
     * @returns {boolean} M4A/AAC (low complexity) support in HTML5 audio
     */
    RadiantML.prototype.m4aAACLC = function () {
        if (this.audio5()) {
            return _canPlayType(
                'audio',
                'audio/mp4; codecs="mp4a.40.2"',
                true,
                this
                );
        }
        return false;
    };
    /**
     * Feature: M4A/HE-AAC audio
     * @public
     * @returns {boolean} M4A/AAC (high efficiency) support in HTML5 audio
     */
    RadiantML.prototype.m4aHEAAC = function () {
        if (this.audio5()) {
            return _canPlayType(
                'audio',
                'audio/mp4; codecs="mp4a.40.5"',
                true,
                this
                );
        }
        return false;
    };
    /**
     * Feature: M4A/HE-AACv2 audio
     * @public
     * @returns {boolean} M4A/AAC (high efficiency v2) support in HTML5 audio
     */
    RadiantML.prototype.m4aHEAACv2 = function () {
        if (this.audio5()) {
            return _canPlayType(
                'audio',
                'audio/mp4; codecs="mp4a.40.29"',
                true,
                this
                );
        }
        return false;
    };
    /**
     * Feature: MP3 audio
     * @public
     * @returns {boolean} has MP3 audio support in HTML5 audio (or not)
     */
    RadiantML.prototype.mp3 = function () {
        if (this.audio5()) {
            return _canPlayType(
                'audio',
                'audio/mpeg',
                false,
                this
                );
        }
        return false;
    };
    /**
     * Feature: Vorbis audio in Ogg
     * @public
     * @returns {boolean} has Vorbis/Ogg audio support in HTML5 audio (or not)
     */
    RadiantML.prototype.oggVorbis = function () {
        if (this.audio5()) {
            return _canPlayType(
                'audio',
                'audio/ogg; codecs="vorbis"',
                true,
                this
                );
        }
        return false;
    };
    /**
     * Feature: Opus audio in WebM
     * @public
     * @returns {boolean} has Opus/WebM audio support in HTML5 audio (or not)
     */
    RadiantML.prototype.webmOpus = function () {
        if (this.audio5()) {
            return _canPlayType(
                'audio',
                'audio/webm; codecs="opus"',
                true,
                this
                );
        }
        return false;
    };
    /**
     * Feature: WAVE/PCM audio
     * @public
     * @returns {boolean} has WAVE/PCM audio support in HTML5 audio (or not)
     */
    RadiantML.prototype.wavPCM = function () {
        if (this.audio5()) {
            return _canPlayType(
                'audio',
                'audio/wav',
                false,
                this
                );
        }
        return false;
    };
    /**
     * Feature: Web Audio API
     * @public
     * @returns {boolean} has Web Audio API support (or not)
     */
    RadiantML.prototype.webAudio = function () {
        var audioContext = win.AudioContext ||
            win.webkitAudioContext ||
            win.mozAudioContext ||
            win.msAudioContext;
        return !!audioContext;
    };
    /**
     * Feature: Media Source Extensions - required for MPEG-DASH
     * @public
     * @returns {boolean} has Media Source Extensions support (or not)
     */
    RadiantML.prototype.mse = function () {
        var mse = "MediaSource" in win || "WebKitMediaSource" in win;
        return !!mse;
    };
    /**
     * Feature: Encrypted Media Extensions - required for DRM in HTML5
     * @public
     * @returns {boolean} has Encrypted Media Extensions support (or not)
     */
    RadiantML.prototype.eme = function () {
        var eme = "MediaKeys" in win ||
            "WebKitMediaKeys" in win ||
            "MSMediaKeys" in win;
        return !!eme;
    };
    /**
     * Feature: getUserMedia API support
     * @public
     * @returns {boolean} has getUserMedia API support (or not)
     */
    RadiantML.prototype.getUserMedia = function () {
        var getUserMedia = nav.getUserMedia ||
            nav.webkitGetUserMedia ||
            nav.mozGetUserMedia ||
            nav.msGetUserMedia;
        return !!getUserMedia;
    };
    /**
     * Feature: RTCPeerConnection API
     * @public
     * @returns {boolean} has RTCPeerConnection API support (or not)
     */
    RadiantML.prototype.rtcPeerConnection = function () {
        var RTCPeerConnection = win.RTCPeerConnection ||
            win.mozRTCPeerConnection ||
            win.webkitRTCPeerConnection ||
            win.msRTCPeerConnection;
        return !!RTCPeerConnection;
    };
    /**
     * Feature: RTCSessionDescription API
     * @public
     * @returns {boolean} has RTCSessionDescription API support (or not)
     */
    RadiantML.prototype.rtcSessionDescription = function () {
        var RTCSessionDescription = win.RTCSessionDescription ||
            win.mozRTCSessionDescription ||
            win.webkitRTCSessionDescription ||
            win.msRTCSessionDescription;
        return !!RTCSessionDescription;
    };
    /**
     * Feature: WebSocket API
     * @public
     * @returns {boolean} has WebSocket API support (or not)
     */
    RadiantML.prototype.webSocket = function () {
        var WebSocket = win.WebSocket || win.MozWebSocket;
        return !!WebSocket;
    };
    /**
     * Feature: Web Worker API
     * @public
     * @returns {boolean} has Web Worker API support (or not)
     */
    RadiantML.prototype.webWorker = function () {
        var webWorker = win.Worker;
        return !!webWorker;
    };
    /**
     * Feature: Web Storage  API
     * @public
     * @returns {boolean} has Web Storage  API support (or not)
     */
    RadiantML.prototype.webStorage = function () {
        //try/catch to fix a bug in older versions of Firefox
        try {
            if (typeof win.localStorage !== 'undefined' &&
                win['localStorage'] !== null &&
                typeof win.sessionStorage !== 'undefined') {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    };
    /**
     * Feature: canvas element support
     * @public
     * @returns {boolean} has canvas element support (or not)
     */
    RadiantML.prototype.canvas = function () {
        return !!this._canvas.getContext;
    };
    /**
     * Feature: canvas text API support
     * @public
     * @returns {boolean} has canvas text API support (or not)
     */
    RadiantML.prototype.canvasText = function () {
        if (this.canvas()) {
            var context = this._canvas.getContext('2d');
            return typeof context.fillText === 'function';
        }
        return false;
    };
    /**
     * Feature: canvas blending support
     * @public
     * @returns {boolean} has canvas blending support (or not)
     */
    RadiantML.prototype.canvasBlending = function () {
        if (this.canvas()) {
            var context = this._canvas.getContext('2d');
            context.globalCompositeOperation = 'screen';
            return context.globalCompositeOperation === 'screen';
        }
        return false;
    };
    /**
     * Feature: canvas WebGL support
     * @public
     * @returns {boolean} has canvas WebGL support (or not)
     */
    RadiantML.prototype.canvasWebGL = function () {
        if (this.canvas()) {
            var canvas = this._canvas, context;
            try {
                context = canvas.getContext('webgl');
                return true;
            } catch (e) {
                context = null;
            }
            if (context === null) {
                try {
                    context = canvas.getContext("experimental-webgl");
                    return true;
                } catch (e) {
                    return false;
                }
            }
        }
        return false;
    };

    /*** Plugin detection ***/
    /**
     * Feature: Flash plugin support
     * @public
     * @returns {Object} an Array as [boolean, Object] where boolean indicates if flash is
     * supported and Object is an Array holding the version [major, minor, pacth] or
     * null if not available.
     */
    RadiantML.prototype.flash = function () {
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

    /*** streaming protocols detection ***/
    /**
     * Apple HTTP Live Streaming video support (.m3u8)
     * @public
     * @returns {boolean} has Apple HTTP Live Streaming video support (or not)
     */
    RadiantML.prototype.hlsVideo = function () {
        if (this.video5()) {
            // HLS video MIME type as per
            // https://tools.ietf.org/html/draft-pantos-http-live-streaming-14
            return _canPlayType('video',
                'application/vnd.apple.mpegurl',
                false,
                this
                );
        }
        return false;
    };
    /**
     * Apple HTTP Live Streaming audio support (.m3u)
     * @public
     * @returns {boolean} has Apple HTTP Live Streaming audio support (or not)
     */
    RadiantML.prototype.hlsAudio = function () {
        if (this.audio5()) {
            // HLS audio MIME type as per
            // https://tools.ietf.org/html/draft-pantos-http-live-streaming-14
            return _canPlayType('audio',
                'audio/mpegurl',
                false,
                this
                );
        }
        return false;
    };

    return RadiantML;

})(window, document, navigator);

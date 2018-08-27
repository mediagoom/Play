//'use strict';

const dbg = console.log

var TEST_URL = 'https://defgroupdisks.blob.core.windows.net/builds/PLAY/STATIC';

function testuri()
{
    dbg("karma args: ", __karma__.config.args);
    
    if(__karma__.config.testuri)
        return __karma__.config.testuri;

    return TEST_URL;
}

function log(msg)
{
    dbg(msg);

    var h = document.getElementById("info");
    if(null != h)
    {
        var t = h.innerHTML + '<br>' + msg;
        h.innerHTML = t;
    }
}

describe('Player', function() {

    localStorage.debug = 'mgplay:*';

// inject the HTML fixture for the tests
  beforeEach(function() {
    var fixture = '<div id="playerhost"></div><div id="info"></div>';

    document.body.insertAdjacentHTML(
      'afterbegin', 
      fixture);
  });

  // remove the html fixture from the DOM
  afterEach(function() {
    document.body.removeChild(document.getElementById('playerhost'));
    document.body.removeChild(document.getElementById('info'));
  });
    
    function test_player(done)
    {
        //let mute the player so should 
        //not incur in blocking
        const options = {muted: true};

        var p = window.mgPlayer(options);
        var started = false;
            
        p.on("started", function() { 
            log("starting playing")
            started = true;
        });

        var p1 = -1;
        var p2 = -2;

        window.setTimeout(function()
        {
                 //console.log("TIME1", p.time());
                 //
                 
            p1 = p.time();
            
            log("TIME1 " +  p1 + " " + started);
            log("ClearKey " + p.detector.drm['org.w3.clearkey']);
            log("PlayReady " + p.detector.drm['com.microsoft.playready']);

            //expect(started).to.be.equal(true);
            expect((p1 > 0)).to.be.equal(true);
            
            p.pause();

            var t1 = p.time();

            window.setTimeout(function(){

            p2 = p.time();

            log("TIME2 " + p2);

            expect(( (t1 + 1) > p2) ).to.be.equal(true);

            done();
                                   

            }, 1000);

        }, 15000);

        return p;
    }


    it('detector work' , function(){
        
        var p = window.mgPlayer();

        expect( p.detector.Video5() ).to.be.equal(true);
        expect( p.detector.H264() ).to.be.equal(true);
        expect( p.detector.MediaExtension() || p.detector.HLSNative() ).to.be.equal(true);
        //expect(  ).to.be.equal(false);
    });

    it('dashjs', function(done) {
        
            var p = test_player(done); 
            if(p.detector.HLSNative())
            {
                p.playhls(testuri() + '/main.m3u8');
            }
            else
            {
                p.playdash(testuri() + '/index.mpd');
            }

            log('dahsjs test playing');

             
        
    });

    it('status.json', function(done) {
        
        var info = {
            
            "hls3":"STATIC/main.m3u8",
            "dash":"STATIC/index.mpd"
    
        };

        var p = test_player(done);
            p.play(testuri(), info);
    
    });

});


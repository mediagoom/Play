'use strict';

const TEST_URL = 'http://play.mediagoom.com/dash';

function log(msg)
{
    var h = document.getElementById("info");
    var t = h.innerHTML + '<br>' + msg;
    h.innerHTML = t;
}

describe('Player', function() {

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
        var p = window.mgPlayer();
            
            p.on("started", function() { 
                  window.setTimeout(function()
                  {
                       //console.log("TIME1", p.time());
                       //
                       expect((p.time() > 0)).to.be.equal(true);
                       
                       log("TIME1 " + p.time());
                       log("ClearKey " + p.detector.drm['org.w3.clearkey']);
                       log("PlayReady " + p.detector.drm['com.microsoft.playready']);

                       p.pause();

                       let t1 = p.time();

                       window.setTimeout(function(){

                           expect(( (t1 + 1) > p.time()) ).to.be.equal(true);

                           log("TIME2 " + p.time());
                           
                           done();
                          

                       }, 3000);

                  }, 15000);
            });

            return p;
        
    }
    it('dashjs', function(done) {
        
            let p = test_player(done); 
            if(p.detector.HLSNative())
            {
                p.playhls(TEST_URL + '/main.m3u8');
            }
            else
            {
                p.playdash(TEST_URL + '/index.mpd');
            }

             
        
    });

    

    it('detector' , function(){
        var p = window.mgPlayer();

        expect( p.detector.Video5() ).to.be.equal(true);
        expect( p.detector.H264() ).to.be.equal(true);
        expect( p.detector.MediaExtension() ).to.be.equal(true);
        //expect(  ).to.be.equal(false);

        
            
    });


});


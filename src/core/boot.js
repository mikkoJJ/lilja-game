    //////////////////////////////////////////////////////
   //* The Boot state preloads assets that the preloader
  //* state needs.
 //*
//*
(function() {
    
    Lilja = { };

    Lilja.Booter = function () {

    };

    Lilja.Booter.prototype = {    
        
          ///////{ create loading screen and setup sates }/////////////////////////
         //
        //
        create: function () {
            this.state.add('Preload', Lilja.Preloader);
        },
        
        
          ///////{ Update loading screen }/////////////////////////////////////////
         //
        //
        loadUpdate: function () {
            return;
        },

          ///////{ initialize scale }//////////////////////////////////////////////
         //
        //
        init: function() {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.setMinMax(500, 400, 1028, 720);
            this.scale.setScreenSize(true);
        },
        
          ///////{ define loaded resources }////////////////////////////////////////
         //
        //        
        preload: function () {            
            WebFont.load({
                google: {
                  families: ['VT323']
                }
            });
        },

        
          ///////{ Start the actual game }//////////////////////////////////////////
         //
        //
        update: function () {        
            this.state.start('Preload');
        }
    };
    
    var game = new Phaser.Game(1028, 720, Phaser.AUTO, 'lilja-game');
    game.state.add('Preload', Lilja.Booter, true);
    
})();
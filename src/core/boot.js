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
            this.state.add('Main', Lilja.Main);
        },
        
        
          ///////{ Update loading screen }/////////////////////////////////////////
         //
        //
        loadUpdate: function () {
            return;
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
    
    var game = new Phaser.Game(1280, 768, Phaser.AUTO, 'lilja-game');
    game.state.add('Boot', Lilja.Booter, true);
    
})();
    //////////////////////////////////////////////////////
   //* The Boot state preloads assets that the preloader
  //* state needs.
 //*
//*
(function() {
    
    Lilja = { 
        gameWidth: 800,
        gameHeight: 600
    };

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
    
    var game = new Phaser.Game(Lilja.gameWidth, Lilja.gameHeight, Phaser.AUTO, 'lilja-game');
    game.state.add('Boot', Lilja.Booter, true);
    
})();
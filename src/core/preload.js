   //////////////////////////////////////////////////////
  //* The Preload state and actions for the ESCAPE GAME!
 //*
//*
(function() {
    
    Lilja = { };

    Lilja.Preloader = function () {

    };

    Lilja.Preloader.prototype = {    
        
          ///////{ create loading screen and setup sates }/////////////////////////
         //
        //
        create: function () {
            this.state.add("Main", Lilja.Main);
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
            this.game.load.atlasJSONHash('sprites', 'assets/sprites.png', 'assets/sprites_data.json');
            this.game.load.json('main_story', 'assets/main_story.json');
            this.game.load.json('dialogues', 'assets/dialogues.json');
            this.game.load.tilemap('level01', 'assets/level01.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image('tiles', 'assets/tiles.png');
            
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
            this.state.start("Main");
        }
    };
    
    var game = new Phaser.Game(1028, 720, Phaser.AUTO, 'lilja-game');
    game.state.add('Preload', Lilja.Preloader, true);
    
})();
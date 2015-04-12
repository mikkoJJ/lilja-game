(function() {
    
    Escape = { };

    /**
     * The Preloader state is responsible for all of the asset loading
     * and showing of the load progress information.
     * 
     * @class Escape.Preloader
     * @constructor
     */
    Escape.Preloader = function () {

    };

    Escape.Preloader.prototype = {    
        /**
         * The game preloader state creation.
         * The idea is to specify here all of the other game states.
         * 
         * @public
         */
        create: function () {
            this.state.add("Main", Escape.Main);
        },

        /**
         * Updates the load progress information.
         * 
         * @public
         */
        loadUpdate: function () {
            return;
        },

        /**
         * Loads all of the game resources.
         * 
         * @public
         */
        preload: function () {
            this.game.load.atlasJSONHash('sprites', 'assets/sprites.png', 'assets/sprites_data.json');
            
            WebFont.load({
                google: {
                  families: ['VT323']
                }
            });
        },

        /**
         * Starts the next state once the preloading has finished.
         * 
         * @public
         */
        update: function () {        
            this.state.start("Main");
        }
    };
    
    var game = new Phaser.Game(1028, 720, Phaser.AUTO, 'escape-game');
    game.state.add('Preload', Escape.Preloader, true);
    
})();
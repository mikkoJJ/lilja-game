   /////////////////////////////////////////////////////////
  //* Simple system for tracking the player's score
 //*  throughout the game.
//*
(function() {
    
    /**
     * The scoretracker keeps track of the player score through 
     * various score events called from the game code.
     */
    Lilja.ScoreTracker = function(game) {
        Phaser.Text.call(this, game, game.camera.width / 2, 15, '000000', { fill: '#FFFFFF', font: '38px VT323' });

        game.add.existing(this);
        
        this.anchor.set(0.5);
        
        this.fixedToCamera = true;
        
        this.onChanged = new Phaser.Signal();
        
        /** the actual score count. */
        this._score = 0;
        
    };
    
    Lilja.ScoreTracker.prototype = Object.create(Phaser.Text.prototype);
    Lilja.ScoreTracker.prototype.constructor = Lilja.ScoreTracker;
    

    /**
     * Starts the timer for calculating the level time based
     * score.
     */
    Lilja.ScoreTracker.prototype.startTimer = function() {
        this._startTime = this.game.time.totalElapsedSeconds();
    };

    /**
     * Notify an enemy killed. The player will be scored accordingly.
     */
    Lilja.ScoreTracker.prototype.enemyKilled = function() {
        this.score += 100;
    };
    
    /**
     * Notify a strong enemy killed. The player will be scored accordingly.
     */
    Lilja.ScoreTracker.prototype.strongEnemyKilled = function() {
        this.score += 150;
    };

    /**
     * Calculates the current time based additional score and add it
     * to the total score.
     * 
     * @returns {Number} the additional time score.
     */
    Lilja.ScoreTracker.prototype.calculateTimeScore = function() {
        var now = this.game.time.totalElapsedSeconds();
        var timescore = (120 - (now - this._startTime) ) * 50;

        this.score += timescore;

        return timescore;
    };
    
    /**
     * @property {Number} score - the current score of the player
     */
    Object.defineProperty(Lilja.ScoreTracker.prototype, 'score', {
        get: function() {
            return this._score;
        },
        set: function(value) {
            this._score = value;
            this.text = ('000000' + this._score).slice(-7);
        }
    });
    
    
})();
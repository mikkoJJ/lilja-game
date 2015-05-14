    /////////////////////////////////////////////////////////
   //* The system for showing dialogue between characters to
  //*  to the player.
 //*
//*
(function() {
    
    /**
     * D I A L O G U E W I N D O W
     * ===========================
     * 
     * A single dialogue window showing a character and a line of dialogue
     * from the script, spoken by that character.
     * 
     * @class Escape.DialogueWindow
     * @extends Phaser.Group
     * @param {Phase.Game} game       reference to the game objec.
     * @param {String}     picture_id the sprite frame name of the speaker's picture
     * @param {String}     text       the text content to show
     * @param {Number}     duration   the duration in milliseconds how long to show the text. Defaults to a value
     *                                dependent on the lenght of the text
     */
    Escape.DialogueWindow = function(game, picture_id, text, duration) {
        Phaser.Group.call(this, game);
        
        var picture = this.create(13, 16, 'sprites', picture_id);
        var frame = this.create(0, 0, 'sprites', 'dialogue_display');

        var diaText = game.add.text(110, 20, '', { font: '18px VT323', fill: '#00FF00' });
        diaText.wordWrap = true;
        diaText.wordWrapWidth = 220;

        this.add(diaText);

        this.x = 50;
        this.y = 20;
        
        /** the text string to display. */
        this.fullText = text;
        
        this.partText = '';
          
        /** the text object containing the text displayed by this window. */
        this.text = diaText;
        
        /** the dialogue window frame as a sprite. */
        this.frame = frame;
        
        /** the speaker picture sprite. */
        this.picture = picture;
        
        /** signal emitted when the dialogue disappears. */
        this.onEnd = new Phaser.Signal();
        
        /** A timer for looping the text ticking effect. */
        this.letterTimer = this.game.time.events.loop(30, this.textTick, this);
        
        var dur = duration ? duration : text.length * 50;
        
        this.timer = this.game.time.create(true);
        this.timer.add(dur, this.hide, this);
        this.timer.start();
        
        this._current = 0;
        
        this.show();
    };
    
    Escape.DialogueWindow.prototype = Object.create(Phaser.Group.prototype);
    Escape.DialogueWindow.constructor = Escape.DialogueWindow;
    
    /**
     * A looping event. Progresses the text forward.
     */
    Escape.DialogueWindow.prototype.textTick = function() {
        if ( this._current >= this.text.length ) return;
        this.partText += this.fullText.charAt(this._current++);
        this.text.text = this.partText + ' □';
    };
    
    /**
     * Do a tween show effect for this window.
     */
    Escape.DialogueWindow.prototype.show = function() {
        this.game.add.tween(this.scale).from({ y: 0 }, 100, Phaser.Easing.Back.Out, true);
    };
    
    /**
     * Hide the window, then destroy it.
     */
    Escape.DialogueWindow.prototype.hide = function() {
        this.game.add.tween(this.scale).to({ y: 0 }, 100, Phaser.Easing.Back.In, true)
                    .onComplete.add(this.end, this);
        
        this.game.time.events.remove(this.letterTimer);
    };
    
    /**
     * Destroys the window after dispatching an event.
     */
    Escape.DialogueWindow.prototype.end = function() {
        this.onEnd.dispatch();
        this.destroy();
    };
    
    
    /**
     * D I A L O G U E M A N A G E R
     * =============================
     * 
     * The DialogueManager handles creating and showing the conversation/dialogue
     * windows between the game characters to the player. References script data
     * found in the dialogues.json file under assets/
     * 
     * @class Escape.DialogueManager
     * @param {Phaser.Game} game reference to the Phaser game object
     */
    Escape.DialogueManager = function(game) {
        
        /** reference to the Phaser game. */
        this.game = game;
        
        /** Data object containing dialogue texts. */
        this.data = game.cache.getJSON('dialogues');
        
        /** Signal that is emitted when the current dialogue has been run out. */
        this.onFinished = new Phaser.Signal();
    };
    
    
    /**
     * Start a new dialogue.
     * @param {String} id the dialogue id inside the dialogue data file.
     */
    Escape.DialogueManager.prototype.start = function(id) {
        this._current = 0;
        this.conversation = this.data.dialogues[id];
        this.lines = [];
        
        var line = this.conversation[this._current];
        var w = new Escape.DialogueWindow(this.game, line.picture, line.line, line.duration);
        w.onEnd.addOnce(this.next, this);
        //this.lines.push(w);
    };   
    
    /**
     * Proceed to the next line of dialogue.
     */
    Escape.DialogueManager.prototype.next = function() {
        this._current++;
        if (this._current >= this.conversation.length) {
            return;
        }
        var line = this.conversation[this._current];
        var w = new Escape.DialogueWindow(this.game, line.picture, line.line, line.duration);
        w.onEnd.addOnce(this.next, this);
        
        //this.lines.push(w);
    };
    
    
})();
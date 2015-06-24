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
     * @class Lilja.DialogueWindow
     * @extends Phaser.Group
     * @param {Phase.Game} game       reference to the game objec.
     * @param {String}     picture_id the sprite frame name of the speaker's picture
     * @param {String}     speaker    the name of the speaker
     * @param {String}     text       the text content to show
     * @param {Number}     duration   the duration in milliseconds how long to show the text. Defaults to a value
     *                                dependent on the lenght of the text
     */
    Lilja.DialogueWindow = function(game, picture_id, speaker, text, duration) {
        Phaser.Group.call(this, game);
        
        this.fixedToCamera = true;
        //var picture = this.create(13, 16, 'sprites', picture_id);
        //var frame = this.create(0, 0, 'sprites', 'dialogue_display');
        var frame = game.add.graphics(150, 50);
        frame.beginFill(0x000000);
        frame.drawRect(0, 0, 600, 200);
        frame.endFill();
        this.add(frame);

        var diaText = game.add.text(180, 90, '', { font: '18px VT323', fill: '#FFFFFF' });
        diaText.wordWrap = true;
        diaText.wordWrapWidth = 560;

        this.add(diaText);
        
        var speakerText = game.add.text(180, 70, speaker, { font: '18px VT323', fill: '#0BEAB6' });
        this.add(speakerText);
        
        /** the text string to display. */
        this.fullText = text;
        
        this.partText = '';
          
        /** the text object containing the text displayed by this window. */
        this.text = diaText;
        
        /** the dialogue window frame as a sprite. */
        this.frame = frame;
        
        /** the speaker picture sprite. */
        //this.picture = picture;
        
        /** signal emitted when the dialogue disappears. */
        this.onEnd = new Phaser.Signal();
        
        /** A timer for looping the text ticking effect. */
        this.letterTimer = this.game.time.events.loop(20, this.textTick, this);
        
        this.skipKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        var dur = duration ? duration : text.length * 50;
        
        this.timer = this.game.time.create(true);
        this.timer.add(dur, this.hide, this);
        this.timer.start();
        
        this._current = 0;
        
        this.show();
    };
    
    Lilja.DialogueWindow.prototype = Object.create(Phaser.Group.prototype);
    Lilja.DialogueWindow.constructor = Lilja.DialogueWindow;
    
    /**
     * A looping event. Progresses the text forward.
     */
    Lilja.DialogueWindow.prototype.textTick = function() {
        if ( this._current >= this.text.length ) return;
        if ( this.skipKey.isDown ) {
            this.game.time.events.remove(this.letterTimer);
            this.timer.destroy();
            this.hide();
        }
        this.partText += this.fullText.charAt(this._current++);
        if (this.partText.length === this.fullText.length) this.game.time.events.remove(this.letterTimer);
        this.text.text = this.partText + ' □';
        Lilja.sfx.play('blop');
    };
    
    /**
     * Do a tween show effect for this window.
     */
    Lilja.DialogueWindow.prototype.show = function() {
        this.game.add.tween(this.scale).from({ y: 0 }, 100, Phaser.Easing.Back.Out, true);
    };
    
    /**
     * Hide the window, then destroy it.
     */
    Lilja.DialogueWindow.prototype.hide = function() {
        this.game.add.tween(this.scale).to({ y: 0 }, 100, Phaser.Easing.Back.In, true)
                    .onComplete.add(this.end, this);
    };
    
    /**
     * Destroys the window after dispatching an event.
     */
    Lilja.DialogueWindow.prototype.end = function() {
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
     * @class Lilja.DialogueManager
     * @param {Phaser.Game} game reference to the Phaser game object
     */
    Lilja.DialogueManager = function(game) {
        
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
    Lilja.DialogueManager.prototype.start = function(id) {
        this._current = 0;
        this.conversation = this.data.dialogues[id];
        this.lines = [];
        
        var line = this.conversation[this._current];
        var w = new Lilja.DialogueWindow(this.game, line.picture, line.speaker, line.line, line.duration);
        w.onEnd.addOnce(this.next, this);
        //this.lines.push(w);
    };   
    
    /**
     * Proceed to the next line of dialogue.
     */
    Lilja.DialogueManager.prototype.next = function() {
        this._current++;
        if (this._current >= this.conversation.length) {
            this.onFinished.dispatch();
            return;
        }
        var line = this.conversation[this._current];
        var w = new Lilja.DialogueWindow(this.game, line.picture, line.speaker, line.line, line.duration);
        w.onEnd.addOnce(this.next, this);
        
        //this.lines.push(w);
    };
    
    
})();
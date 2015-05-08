var GameUtils = {

    /**
     * Clamp a number between two values.
     * 
     * @param   {Number} value the number to clamp
     * @param   {Number} min   maximum value
     * @param   {Number} max   minimum value
     * @returns {Number} the clamped number
     */
    clamp: function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

};
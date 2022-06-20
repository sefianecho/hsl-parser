/**
 * Parse an HSL color string and output its values in an object or in an array,
 * or test if a string is a valid hsl color string.
 *
 * @returns {Object}
 */
function hslParser() {

    const {max, min, PI} = Math;
    const float = parseFloat;

    /**
     * HSL legacy syntax (comma separated values):
     * hsl(hue, saturation, lightness [, alpha])
     * or
     * hsla(hue, saturation, lightness [, alpha])
     * 
     * HSL new syntax (space separated values):
     * hsl(hue saturation lightness [/ alpha])
     * or
     * hsla(hue saturation lightness [/ alpha])
     *
     * 
     * hue: <number> | <angle>
     * saturation: <percentage>
     * lightness: <percentage>
     * alpha: <number> | <percentage>
     * 
     * <angle>: <number>(deg|grad|rad|turn)
     * <percentage>: <number>%
     */
    const HSL_REGEX = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|grad|rad|turn)?(?:(?:\s+([+-]?\d*\.?\d+)%\s*([+-]?\d*\.?\d+)%(?:\s*\/\s*([+-]?\d*\.?\d+%?))?)|(?:\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%(?:\s*,\s*([+-]?\d*\.?\d+%?))?))\s*\)$/;

    /**
     * Restricts a number between a lower bound and an upper bound.
     *
     * @param {number} number - Any number.
     * @param {number} upperBound - Max.
     * @param {number} lowerBound - Min.
     * @returns {number}
     */
    const numberRange = (number, upperBound, lowerBound) => min(max(float(number), lowerBound || 0), upperBound || 100);


    /**
     * Converts an HSL string into an Object or an array.
     *
     * @param {string}  hslString - hsl color.
     * @param {boolean} asArray   - Returns Array.
     * @returns {Object|Array}
     */
    const parse = (hslString, asArray) => {

        hslString = hslString.trim();

        let hsl = null;

        // No need to parse it if it's shorter than the minimum hsl string length,
        // the minimum is 11 characters, e.g. hsl(0 0%0%).
        if (hslString.length >= 11) {
            const channels = hslString.match(HSL_REGEX);

            if (channels) {

                let h = float(channels[1]),
                    angle = channels[2],
                    s = numberRange(channels[3] || channels[6]),
                    l = numberRange(channels[4] || channels[7]),
                    a = channels[5] || channels[8];

                /**
                 * The hue value is so often given in degrees, it can be given as a number, however
                 * it might has a unit 'turn', 'rad' (radians) or 'grad' (gradians),
                 * If the hue has a unit other than deg, then convert it to degrees.
                 */
                h *= angle === 'turn' ? 360
                     : angle === 'rad' ? 180 / PI
                     : angle === 'grad' ? 0.9
                     : 1;

                // Make sure hue is between 0 and 360.
                let maxAngle = 360;
                h = (h % maxAngle + maxAngle) % maxAngle;

                // Alpha value must be between 0 and 1.
                a = a ? a[a.length - 1] === '%' ? numberRange(a) / 100 : numberRange(a, 1) : 1;

                hsl = asArray ? [h, s, l, a] : {h, s, l, a};
            }
        }

        return hsl;
    }

    return {
        /**
         * Tests if a string is a valid hsl color string.
         *
         * @param {string} str - String
         * @returns {boolean}
         */
        isValid: str => HSL_REGEX.test(str),
        parse
    }
}
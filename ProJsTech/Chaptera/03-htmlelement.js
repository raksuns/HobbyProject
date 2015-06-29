// Add a new method to all HTML DOM Elements
// that can be used to see if an Element has a specific class, or not.
HTMLElement.prototype.hasClass = function(klass ) {
    return new RegExp("(^|\\s)" + klass + "(\\s|$)").test( this.className );
};

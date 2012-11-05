http://benalman.com/projects/jquery-hashchange-plugin/

1. jQuery hashchange event

This jQuery plugin enables very basic bookmarkable #hash history via 
a cross-browser HTML5 window.onhashchange event.

While this functionality was initially tied to the jQuery BBQ(Back Button & 
Query Library) plugin, the event.special window.onhashchange functionality has
now been broken out into a separate plugin for users who want just the basic event 
& back button support, without all the extra awesomeness that BBQ  provides.

2. Why is a plugin needed for the hashchange event ?
Right now, in IE8, Ff 3.6+, Chrome 5+, you can bind callbacks 
to the window.onhashchange event and use it without any kind of plugin.
Of course, what happens when you want your code to work in a browser 
that doesn't support window.onhashchange?

Well, nothing happens...because the event doesn't exist, so it never fires.
But because jQuery provides a layer of abstraction between actual events 
and bound callbacks, it's relatively easy to create a new event using jQuery's special events.

3. How does the plugin work ?
When a browser-native window.onhashchange event is detected, that event is used for the "hashchange" event automatically. However, when that event isn't detected, at the first attempt to bind to the event, a polling loop is started to monitor "location.hash" for changes, firing the event whenever appropriate.

Additionally, since history entries aren't added when the hash changes in IE6/7, a hidden Iframe is created and updated whenever the hash changes to trick the browser into thinking that the page's URL has changed, thus forcing new entries to be added into the history. Without this Iframe, the "hashchange" event would still fire, but without back button support the utility(효율) of the event is reduced substantially.

When the last window.onhashchange event is unbound, the polling loop is stopped(expect in IE6/7, because it is still needed for back button support).

4. A basic usage example
Simple. Bind the "hashchange" event to "$(window)" and every time the hash changes, the callback will fire. Check out the [working example][ex] to see this in action.


5. A more robust solution
This plugin is, by design, very basic. If you want to add lot of extra utility around getting and setting and setting the hash as a state, and merging fragment params, check out the "jQuery BBQ" plugin. It includes this plugin at its core, plus a whole lot more, and has thorough documentation and examples as well.You can't have too much of a good thing!

6. Known hashchange issues

/**
 * Add behavior to any selector using a callback function. Whether the element exists on page load, or is added dynamically,
 * the behavior function is always run for each element matching the given selector.
 *
 * Example
 * -------
 *
 * Automatically select all text in an input upon focus:
 *
 * ```
 * require(['app/behavior'], function (behavior) {
 *   behavior('input.autoselect', function () {
 *     $(this).on('focus', function () { this.select() });
 *   });
 * });
 */
define(['underscore', 'jquery', 'jquery.livequery'], function (_, $) {

  // This creates a behavior runner function, which can run behaviors given any root element.
  function createRunner(selector, fn) {
    return function (root) {
      var $all,
          $root         = $(root),
          selectorParts = selector.split(' ');

      if ($root.is(selector)) {
        all = $root;
      } else {
        all = $();
      }

      if (selectorParts.length == 1) {
        // Simple selector. Find all descendants of the root matching the selector.
        all = all.add($root.find(selector));
      } else {
        // Selector with relational component: e.g. the selector might be 'form a' (any link in a form),
        // but the behavior might be run on a child element of the form tag. $root.find('form a') will
        // not return anything, as the form element is not a descendant of $root. Therefore, use the
        // last part of the selector ('a') as the selector, and then filter on the entire selector.
        all = all.add($root.find(_.last(selectorParts))).filter(selector);
      }

      // Run the function on each element.
      all.each(fn);
    };
  }


  return function (selector, fn) {
    var runner  = createRunner(selector, fn),
        enabled = false;

    // Use a live query to run the behavior on any dynamically created element. Livequery functions are only called
    // for a root element when elements are added dynamically. However, at page load, this will cause ALL elements
    // on the page to be processed. This is not necessary, so prevent the first invocation.
    $('body').livequery('*', function () {
      if (!enabled) { return; }
      runner(this);
    });

    // Instead, run the behaviors on the body tag.
    enabled = true;
    runner('body');
  };

});
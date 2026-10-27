/* An eye on every password field on the page.
 *
 * A phrase you cannot see is a phrase you mistype, and a keyboard is not
 * always trustworthy. Attached by script rather than written into each
 * field, so a password input added later gets one without anybody
 * remembering to.
 *
 * Load it after the fields exist: at the end of the body, like everything
 * else here.
 */
(function () {
  var OPEN =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M2 12s3.7-6.6 10-6.6S22 12 22 12s-3.7 6.6-10 6.6S2 12 2 12Z"/>' +
    '<circle cx="12" cy="12" r="3"/></svg>';
  var SHUT =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M3 3l18 18"/>' +
    '<path d="M10.7 6.1A11 11 0 0 1 12 6c6.3 0 10 6 10 6a18.4 18.4 0 0 1-3.3 4"/>' +
    '<path d="M6.4 7.9A18.4 18.4 0 0 0 2 12s3.7 6.6 10 6.6a11 11 0 0 0 3.5-.6"/>' +
    '<path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';

  [].forEach.call(document.querySelectorAll('input[type="password"]'), function (input) {
    if (input.parentNode && input.parentNode.classList.contains('pw')) return;

    var wrap = document.createElement('span');
    wrap.className = 'pw';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);

    var eye = document.createElement('button');
    eye.type = 'button';
    eye.innerHTML = SHUT;
    eye.setAttribute('aria-label', 'Show what I am typing');
    eye.setAttribute('aria-pressed', 'false');
    wrap.appendChild(eye);

    eye.addEventListener('click', function () {
      var showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      eye.innerHTML = showing ? SHUT : OPEN;
      eye.setAttribute('aria-pressed', showing ? 'false' : 'true');
      eye.setAttribute('aria-label', showing ? 'Show what I am typing' : 'Hide what I am typing');
      input.focus();
    });
  });
})();

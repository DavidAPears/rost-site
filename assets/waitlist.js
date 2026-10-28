/* The launch list.
 *
 * The box used to validate an address, say something reassuring, and throw
 * it away. Now it calls join_waitlist, which is the one function in this
 * project granted to anon: it writes and returns nothing at all, not even
 * whether the address was new, so nobody can use this page to ask whether
 * somebody signed up.
 */
(function () {
  var form = document.getElementById('form');
  if (!form || !window.supabase || !window.ROST) return;

  var db = window.supabase.createClient(window.ROST.supabaseUrl, window.ROST.supabaseAnonKey);
  var field = document.getElementById('email');
  var said = document.getElementById('said');
  var button = form.querySelector('button[type="submit"]');

  function say(text, good) {
    said.textContent = text;
    said.style.color = good ? 'var(--lime)' : 'var(--danger, #FF6B5A)';
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var email = field.value.trim();
    if (!email || email.indexOf('@') < 1) {
      say('That needs to be an email address we can reach you on.', false);
      field.focus();
      return;
    }

    var label = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending';

    var out = await db.rpc('join_waitlist', { p_email: email, p_source: 'site' });

    button.disabled = false;
    button.textContent = label;

    if (out.error) {
      say(
        out.error.message.indexOf('email address') > -1
          ? 'That does not look like an email address.'
          : 'That did not save. Try again, or write to ' + window.ROST.feedbackEmail + '.',
        false,
      );
      return;
    }

    /* The same answer whether it was new or already there, because the
       function deliberately does not say which. */
    say('You are on the list. We will write once, when London opens.', true);
    field.value = '';
  });
})();

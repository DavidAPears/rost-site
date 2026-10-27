/* The same project the app talks to, with the same publishable key the app
   already ships in its bundle. It is not a secret: it identifies the
   project, and row level security is what decides who can read what. The
   service role key must never appear in this repository.

   If this is ever rotated, it changes in two places: the app's .env and
   this file. */
window.ROST = {
  supabaseUrl: 'https://mdjzwodsczqtqvpeoymd.supabase.co',
  supabaseAnonKey: 'sb_publishable_m4XTSUoc-1UZgcKUs-QxKg_f4Iw5lFv',
  /* Where a deleted account is invited to send feedback, and where the
     policy pages point. Currently a personal address: see the note in
     TODO.md about moving it to something on the domain. */
  feedbackEmail: 'hello@rost.fyi',
};

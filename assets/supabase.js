/* The same project the app talks to, with the same publishable key the app
   already ships in its bundle. It is not a secret: it identifies the
   project, and row level security is what decides who can read what. The
   service role key must never appear in this repository.

   If this is ever rotated, it changes in two places: the app's .env and
   this file. */
window.ROST = {
  supabaseUrl: 'https://mdjzwodsczqtqvpeoymd.supabase.co',
  supabaseAnonKey: 'sb_publishable_m4XTSUoc-1UZgcKUs-QxKg_f4Iw5lFv',
  /* Where a deleted account is invited to send feedback. A Cloudflare
     Email Routing alias forwarding to the founder's inbox, free, and
     separate from safety@ so that one can be filtered and published
     without this one being scraped alongside it. */
  feedbackEmail: 'contact@rost.fyi',
};


## Leads dashboard setup (/admin/leads)

1. **Database**: run `supabase db push` to apply `supabase/migrations/20261110000000_leads.sql` (creates `leads`, `lead_calls`, the `telecaller` role and RLS).
2. **Import existing sheet data**: log in as master at `/admin`, open `/admin/leads`, click **Import sheet**, and upload the Google Sheet downloaded as CSV (File, Download, .csv). Re-importing is safe (duplicates are skipped).
3. **Add telecallers**: `/admin/team` (**Team & Roles** in the admin menu, master only), enter their email, role **Telecaller** and a temporary password, then click **Create Login** and share the details with them (no email is sent). They sign in at `/admin`, are asked to set their own password, and land on `/admin/leads`. Requires the edge function: `supabase functions deploy create-staff-user`.
4. **Daily reminder email** (08:30 IST):
   - Deploy: `supabase functions deploy send-followup-digest --no-verify-jwt`
   - Secrets: `supabase secrets set RESEND_API_KEY=... CRON_SECRET=<random string> FOLLOWUP_EMAIL_FROM="Neoplatron Leads <leads@yourdomain>"`
   - Enable the `pg_cron` and `pg_net` extensions, then run in the SQL editor (replace the placeholders):

   ```sql
   select cron.schedule('followup-digest', '0 3 * * *', $$
     select net.http_post(
       url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-followup-digest',
       headers := jsonb_build_object('Content-Type','application/json','x-cron-secret','<CRON_SECRET>'),
       body := '{}'::jsonb);
   $$);
   ```
5. **Automatic Google Sheet sync** (every 15 minutes; new sheet rows become leads, existing leads are never changed):
   - Apply the migrations first (`20261110000003_leads_inquiry_type.sql` adds a column this function reads). To sync all three tabs, set `LEADS_SHEET_GID` to their ids separated by commas (e.g. `LEADS_SHEET_GID=111,222,333`); the function works out which tab is Installation, Franchise or Distribution from the headings.
   - Deploy: `supabase functions deploy sync-leads-sheet --no-verify-jwt`
   - Secrets: `supabase secrets set LEADS_SHEET_ID=<id from the sheet URL>` (and `LEADS_SHEET_GID=<number after #gid=>` if the enquiries are not on the first tab). `CRON_SECRET` and the `GOOGLE_*` secrets are reused.
   - The sheet must be readable by the Google account behind `GOOGLE_REFRESH_TOKEN`, and that token needs Drive read access. If the test call below returns "Could not read the sheet", either re-create the refresh token with the `https://www.googleapis.com/auth/drive.readonly` scope added, or publish the tab (File, Share, Publish to web, CSV) and set `LEADS_SHEET_CSV_URL` to that link instead. A published link is readable by anyone who has it.
   - Dry run first (writes nothing): `curl -X POST "https://<PROJECT_REF>.supabase.co/functions/v1/sync-leads-sheet?dry=1" -H "x-cron-secret: <CRON_SECRET>"`. `wouldInsert` should be small (only rows added since the last manual import). If it is in the thousands, stop: the timestamps are not matching the existing leads.
   - Then run it for real by removing `?dry=1`. It replies with how many rows were inserted.
   - Schedule (SQL editor, replace the placeholders):

   ```sql
   select cron.schedule('sync-leads-sheet', '*/15 * * * *', $$
     select net.http_post(
       url := 'https://<PROJECT_REF>.supabase.co/functions/v1/sync-leads-sheet',
       headers := jsonb_build_object('Content-Type','application/json','x-cron-secret','<CRON_SECRET>'),
       body := '{}'::jsonb);
   $$);
   ```
6. **State column in the Google Sheet**: the website form now sends a separate `state` field to the Apps Script along with `cityState`. Add `e.parameter.state` to the row the script appends if you want it in its own column.

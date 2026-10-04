# Party RSVP (GitHub Pages + Supabase + Outlook)

A free invite and RSVP site for one party:
- Guests get a personal link where they see the details, RSVP, change their answer, and see who's coming.
- You send invites and reminders yourself, through Outlook on the web and texts from your phone. The dashboard writes each message for you, and one click opens it ready to send.

**What it uses:** GitHub Pages hosts the pages (free), Supabase stores guests and RSVPs and handles your login (free plan), and Outlook sends the emails. No servers or passwords for email.

## Files
| File | What it is |
|---|---|
| `index.html` | Landing page |
| `invite.html`, `invite.js` | The guest's personal invite page |
| `admin.html`, `admin.js` | Your dashboard |
| `common.js`, `style.css` | Shared code and styles |
| `config.js` | Where you paste your Supabase details |
| `setup.sql` | Creates the database and its security rules |
| `.github/workflows/keepalive.yml` | Pings the database every 2 days so it doesn't pause |

## Setup (about 30 minutes)

### 1. Supabase
1. Sign up at supabase.com and create a **new project** (Free plan). Pick a region near you and save the database password somewhere safe.
2. Open `setup.sql`, change `you@example.com` to the email you'll log in with, then paste the whole file into **SQL Editor** and click **Run**.
3. **Authentication → Users → Add user → Create new user.** Use that same email and a strong password, and tick **Auto Confirm User**.
4. **Authentication → Sign In / Providers:** turn off **Allow new users to sign up.** Your account is the only one needed.
5. **Project Settings → API Keys** (or **API**): copy the **Project URL** and the **anon** / **publishable** key.

### 2. Connect the site
Open `config.js` and paste in the URL and key. The key is meant to be public: the database rules in `setup.sql` decide what it can do, and anonymous visitors can only load an invite with its private code.

### 3. GitHub Pages
1. Create a new **public** repository on github.com (free GitHub Pages needs a public repo). The code is visible, but no guest data or passwords are stored in it.
2. Upload all the files. The keep-awake file sits in a hidden folder that drag-and-drop can skip, so add it with **Add file → Create new file**, name it `.github/workflows/keepalive.yml`, and paste in its contents.
3. **Settings → Pages:** under "Build and deployment," choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save. After a minute your site is at `https://YOUR-USERNAME.github.io/REPO-NAME/`.
4. **Actions** tab: if asked, enable workflows. Open **Keep Supabase awake → Run workflow** once. A green check means it reached your database.

### 4. Optional: use your DreamHost domain
1. In the DreamHost panel, add a DNS record for your domain: type **CNAME**, name `party`, value `YOUR-USERNAME.github.io`.
2. In GitHub **Settings → Pages → Custom domain**, enter `party.yoursite.com` and save. Once the check passes, tick **Enforce HTTPS**.

Set this up before sending invites, because invite links use whatever address you're on when you send them.

## Using it
1. Go to `…/admin.html` and log in.
2. **Settings:** choose whether your Outlook is personal (outlook.com/hotmail) or work/school. Then sign in to Outlook on the web in the same browser.
3. Fill in **Party details**, then import your guest CSV or paste guests in.
4. Work through **To send**. "Email in Outlook" opens a ready-to-send email in a new tab; send it and come back. "Text" opens Messages (use your phone for these). Each guest is ticked off when you click.
5. Click **Add reminder days to my calendar** so you get a nudge. On those days, open the dashboard and send the reminders. The fastest way is the **Email all … in Outlook** button, which BCCs everyone with email at once; then text the phone-only guests.

Good to know:
- If Outlook ever opens with empty fields, you weren't signed in. Sign in, then use the guest's button again, or the **Copy** buttons for the group email.
- Clicking a send button ticks the guest off even if you close the message without sending. To resend, use the buttons in the **Guests** list.
- Guests who lose their link can reply to their invite; copy it for them with **Copy invite link**.
- **Download CSV** includes every guest's link, which makes a handy backup.

## Security
- Only the email listed in `setup.sql` with a Supabase login can open the dashboard or read the guest list. Supabase rate-limits login attempts.
- Guests can't read the database directly. They can only load or update their own invite, using a 64-character random code that can't be guessed.
- Guests never see emails or phone numbers. Choose how much of the guest list they see under **Settings**.
- RSVPs lock once the party starts.
- Turn on two-factor login for GitHub, Supabase and Microsoft.
- After the party, delete the Supabase project (or the guests) so the contact list isn't kept indefinitely.

## If something goes wrong
- **"Couldn't reach the database":** your Supabase project may be paused. Open the Supabase dashboard, click **Resume project**, wait a few minutes, and reload. Nothing is lost. Check the keep-awake workflow is enabled under **Actions**.
- **"That account isn't set up as the host":** the email in `setup.sql` doesn't match your login. Fix it there and run the file again.
- **The site shows "Almost ready":** `config.js` still has the placeholder values.

(function () {
  const { sb, configured, esc, firstName, fmtDate, normPhone, icsDownload } = window.Party;
  const app = document.getElementById('app');
  let party = null, guests = [], flash = '', busy = false, editingId = null, editDraft = null;
  const store = { get: (k, d) => { try { return localStorage.getItem(k) || d; } catch { return d; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  let outlookKind = store.get('outlookKind', 'live');
  const DAY = 864e5;

  // ---------- Messages ----------
  const inviteUrl = (g) => new URL('invite.html?t=' + g.token, location.href).href;
  const when = () => fmtDate(party.starts_at, party.time_zone);
  const where = () => (party.location ? ` at ${party.location}` : '');
  const sign = () => (party.host_name ? `\n\n${party.host_name}` : '');

  function message(g, kind) {
    const link = inviteUrl(g), hi = `Hi ${firstName(g.name)}!`, t = party.title;
    if (kind === 'invite') {
      const lead = party.host_name ? `${party.host_name} would love for you to come` : "You're invited";
      return { subject: `You're invited: ${t}`,
        text: `${hi} ${lead} to ${t} on ${when()}${where()}. See the details and RSVP here: ${link}`,
        email: `${hi}\n\n${lead} to ${t}.\n\nWhen: ${when()}${party.location ? `\nWhere: ${party.location}` : ''}\n\nSee all the details and RSVP here:\n${link}\n\nHope to see you there!${sign()}` };
    }
    if (g.status === 'pending') {
      return { subject: `Reminder: ${t} — can you make it?`,
        text: `${hi} Quick reminder that ${t} is coming up on ${when()}${where()}. We haven't heard back yet — let us know if you can make it: ${link}`,
        email: `${hi}\n\nQuick reminder that ${t} is coming up on ${when()}${where()}.\n\nWe haven't heard back yet. Let us know if you can make it here:\n${link}${sign()}` };
    }
    return { subject: `See you soon: ${t}`,
      text: `${hi} Just a reminder that ${t} is on ${when()}${where()}. Details (and your RSVP, if plans change): ${link}`,
      email: `${hi}\n\nJust a reminder that ${t} is on ${when()}${where()}.\n\nAll the details, and your RSVP if plans change, are here:\n${link}\n\nSee you soon!${sign()}` };
  }

  function groupMessage() {
    return { subject: `Reminder: ${party.title} is coming up`,
      body: `Hi everyone!\n\nJust a reminder that ${party.title} is on ${when()}${where()}.\n\nTo see the details, RSVP, or change your answer, open the link in your invitation. Can't find it? Just reply to this email and I'll send it again.\n\nSee you soon!${sign()}` };
  }

  function outlookUrl({ to = '', bcc = '', subject = '', body = '' }) {
    const base = outlookKind === 'office' ? 'https://outlook.office.com/mail/deeplink/compose' : 'https://outlook.live.com/mail/0/deeplink/compose';
    const q = [['to', to], ['bcc', bcc], ['subject', subject], ['body', body]].filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return `${base}?${q}`;
  }
  const smsUrl = (phone, body) => `sms:${phone}?&body=${encodeURIComponent(body)}`;

  // ---------- Reminder rounds ----------
  function currentRound() {
    if (!party.starts_at) return null;
    const start = new Date(party.starts_at).getTime(), now = Date.now();
    if (now >= start) return null;
    const c = [];
    for (const d of party.reminder_days || []) {
      const at = start - d * DAY;
      if (at <= now) c.push({ key: `${party.starts_at}|d${d}`, at, label: `${d} day${d == 1 ? '' : 's'} before` });
    }
    const m = party.manual_round;
    if (m && m.startsWith(party.starts_at + '|m')) c.push({ key: m, at: new Date(m.split('|m')[1]).getTime(), label: 'started by you' });
    return c.sort((a, b) => b.at - a.at)[0] || null;
  }
  function nextReminder() {
    if (!party.starts_at) return null;
    const start = new Date(party.starts_at).getTime();
    const f = (party.reminder_days || []).map((d) => start - d * DAY).filter((t) => t > Date.now()).sort((a, b) => a - b);
    return f[0] || null;
  }

  // ---------- Data ----------
  async function load() {
    const [p, g] = await Promise.all([sb.from('party').select('*').eq('id', 1).single(), sb.from('guests').select('*').order('created_at')]);
    if (p.error || g.error) throw p.error || g.error;
    party = p.data; guests = g.data;
  }
  async function act(fn, okMsg) {
    if (busy) return;
    busy = true;
    try { await fn(); await load(); flash = okMsg || ''; }
    catch (e) { flash = '!' + (e.message || 'Something went wrong.'); }
    busy = false;
    render();
  }
  const check = (r) => { if (r.error) throw r.error; return r.data; };
  const markSent = (ids, kind, round) => sb.rpc('mark_sent', { p_ids: ids, p_kind: kind, p_round: round || null }).then(check);

  // ---------- CSV ----------
  function parseCSV(text) {
    const rows = []; let row = [], field = '', q = false;
    text = text.replace(/^\uFEFF/, '');
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (ch === '"') q = false; else field += ch; }
      else if (ch === '"') q = true;
      else if (ch === ',') { row.push(field); field = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(field); rows.push(row); row = []; field = ''; }
      else field += ch;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    return rows.filter((r) => r.some((c) => c.trim()));
  }
  // Finds the email and phone anywhere in a pasted line, with or without commas:
  // "Jo Lee, jo@x.com, 555-1234", "Jo Lee jo@x.com", "Jo Lee <jo@x.com>", or tab-separated spreadsheet rows.
  function parseLine(line) {
    let rest = String(line || '');
    const em = rest.match(/[^\s,;<>()"']+@[^\s,;<>()"']+\.[^\s,;<>()"']+/);
    const email = em ? em[0] : '';
    if (email) rest = rest.replace(email, ' ');
    const ph = rest.match(/\+?\(?\d[\d\s().-]{5,}\d/);
    const phone = ph && ph[0].replace(/\D/g, '').length >= 7 ? ph[0].trim() : '';
    if (phone) rest = rest.replace(ph[0], ' ');
    const name = rest.replace(/[,;\t<>()"]+/g, ' ').replace(/\s+/g, ' ').trim();
    return { name, email, phone };
  }
  function mapStatus(v) {
    v = (v || '').toLowerCase().trim();
    if (/^(yes|y|totally|going|attending|accepted?|confirmed|coming)\b/.test(v)) return 'yes';
    if (/^(maybe|tentative|unsure|possibly)\b/.test(v)) return 'maybe';
    if (/^(no|n|bummer|declined?|not going|can'?t|regrets?)\b/.test(v)) return 'no';
    return 'pending';
  }
  // Adds rows, skipping anyone already on the list and merging duplicates within the batch.
  async function addGuests(rows, { invited = false } = {}) {
    const now = new Date().toISOString();
    const batch = []; let merged = 0, skipped = 0;
    for (const r of rows) {
      const email = (r.email || '').trim().toLowerCase(), phone = normPhone(r.phone);
      const name = (r.name || '').trim() || email || phone;
      if (!name) continue;
      const same = (x) => (email && x.email === email) || (phone && x.phone === phone);
      if (guests.some(same)) { skipped++; continue; }
      const dup = batch.find(same);
      if (dup) { dup.phone = dup.phone || phone; dup.email = dup.email || email; merged++; continue; }
      const status = r.status || 'pending';
      batch.push({ name: name.slice(0, 100), email, phone, status, party_size: Math.min(20, Math.max(1, r.size || 1)),
        note: (r.note || '').slice(0, 500), responded_at: status === 'pending' ? null : now, invited_at: invited ? now : null });
    }
    if (batch.length) check(await sb.from('guests').insert(batch));
    return [`Added ${batch.length} guest${batch.length === 1 ? '' : 's'}`, merged && `merged ${merged} duplicate${merged > 1 ? 's' : ''}`,
      skipped && `skipped ${skipped} already on your list`].filter(Boolean).join(', ') + '.';
  }

  function exportCSV() {
    const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
    const rows = [['Name', 'Email', 'Phone', 'RSVP', 'Party size', 'Note', 'Invited', 'Responded', 'Invite link']]
      .concat(guests.map((g) => [g.name, g.email, g.phone, g.status, g.party_size, g.note, g.invited_at || '', g.responded_at || '', inviteUrl(g)]));
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.map(q).join(',')).join('\n')], { type: 'text/csv' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'guests.csv' });
    document.body.appendChild(a); a.click(); a.remove();
  }

  // ---------- Views ----------
  function loginView(err) {
    app.innerHTML = `<main class="login"><h1>Host login</h1>
      ${err ? `<p class="error">${esc(err)}</p>` : ''}
      <form id="login"><label for="em">Email</label><input id="em" type="email" name="email" autocomplete="username" required>
      <label for="pw">Password</label><input id="pw" type="password" name="password" autocomplete="current-password" required>
      <p><button class="pink" style="width:100%">Log in</button></p></form></main>`;
  }

  const counts = () => guests.reduce((c, g) => { c[g.status]++; if (g.status === 'yes') c.people += g.party_size; return c; }, { yes: 0, maybe: 0, no: 0, pending: 0, people: 0 });
  const contact = (g) => esc([g.email, g.phone].filter(Boolean).join('  ·  ') || 'no contact info');
  const sendBtns = (g, kind, roundKey) => `
    ${g.email ? `<button class="small pink" data-a="email" data-id="${g.id}" data-kind="${kind}" data-round="${esc(roundKey || '')}">Email in Outlook</button>` : ''}
    ${g.phone ? `<button class="small pink" data-a="text" data-id="${g.id}" data-kind="${kind}" data-round="${esc(roundKey || '')}">Text</button>` : ''}
    <button class="small ghost" data-a="mark" data-id="${g.id}" data-kind="${kind}" data-round="${esc(roundKey || '')}">${g.email || g.phone ? 'Mark as sent' : 'Mark done'}</button>`;

  function todoView() {
    if (!party.title || !party.starts_at) return `<section class="todo"><h2>Start here</h2><p>Fill in the party details below, then add your guests. Your invites to send will appear here.</p></section>`;
    if (!guests.length) return `<section class="todo"><h2>Add your guests</h2><p>Paste them in or import a spreadsheet in the Guests section below.</p></section>`;
    const invites = guests.filter((g) => !g.invited_at);
    const round = currentRound();
    const remind = round ? guests.filter((g) => g.invited_at && g.status !== 'no' && !(g.rounds_done || []).includes(round.key)) : [];
    const next = nextReminder();
    if (!invites.length && !remind.length) {
      return `<section><h2>All caught up</h2><p class="muted">${next ? `Next reminder round: ${esc(fmtDate(next, party.time_zone, { dateStyle: 'full' }))}.` : 'No more reminders scheduled.'}</p></section>`;
    }
    const emailers = remind.filter((g) => g.email);
    return `<section class="todo"><h2>To send</h2>
      <p class="muted">Each button opens a ready-to-send message in Outlook on the web (or Messages for texts) and ticks the guest off. Sign in to Outlook in this browser first.</p>
      ${invites.length ? `<h3>Invites (${invites.length})</h3>${invites.map((g) => `<div class="item"><div><strong>${esc(g.name)}</strong><br><span class="muted">${contact(g)}</span></div><div class="acts row">${sendBtns(g, 'invite')}</div></div>`).join('')}` : ''}
      ${remind.length ? `<h3>Reminders: ${esc(round.label)} (${remind.length})</h3>
        ${emailers.length > 1 ? `<div class="group"><strong>Fastest:</strong> one email to all ${emailers.length} email guests, BCC'd so they don't see each other's addresses.
          <div class="row" style="margin-top:.6rem"><button class="small pink" data-a="bcc">Email all ${emailers.length} in Outlook</button>
          <button class="small ghost" data-a="copy-bcc">Copy addresses</button><button class="small ghost" data-a="copy-group">Copy message</button>
          <button class="small ghost" data-a="mark-bcc">Mark all ${emailers.length} as sent</button></div>
          <p class="muted" style="margin:.5rem 0 0;font-size:.85rem">If Outlook opens without the addresses, paste them into BCC with the Copy buttons, then mark them as sent.</p></div>` : ''}
        ${remind.map((g) => `<div class="item"><div><strong>${esc(g.name)}</strong> <span class="pill p-${g.status}">${g.status === 'pending' ? 'no reply' : g.status}</span><br><span class="muted">${contact(g)}</span></div><div class="acts row">${sendBtns(g, 'reminder', round.key)}</div></div>`).join('')}` : ''}
    </section>`;
  }

  function editRow(g) {
    if (editDraft) g = { ...g, ...editDraft };
    return `<form class="item" id="edit" data-id="${g.id}" style="display:block">
      <strong>Edit guest</strong>
      <div class="grid2">
        <div><label for="e-name">Name</label><input id="e-name" name="name" value="${esc(g.name)}" required maxlength="100"></div>
        <div><label for="e-email">Email</label><input id="e-email" name="email" type="email" value="${esc(g.email)}"></div>
        <div><label for="e-phone">Phone</label><input id="e-phone" name="phone" type="tel" value="${esc(g.phone)}"></div>
      </div>
      <p class="row" style="margin:.8rem 0 0"><button class="small pink">Save</button><button type="button" class="small ghost" data-a="cancel-edit">Cancel</button></p>
    </form>`;
  }

  const joinUrl = () => new URL('invite.html?join=' + party.join_code, location.href).href;
  const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, '0')).join('');
  function openLinkView() {
    const on = party.join_enabled && party.join_code;
    return `<section><h2>Open invite link</h2>
      <p class="muted">One link you can share anywhere (a group chat, social media). People who open it enter their own name and contact details, RSVP, and get their own personal invite page. They're tagged "joined via open link" in your guest list. Anyone with this link can sign up, so share it only where you'd be happy for people to join.</p>
      ${on ? `<label for="join-url">Your open invite link</label>
        <input id="join-url" value="${esc(joinUrl())}" readonly onclick="this.select()">
        <p class="row" style="margin:.8rem 0 0"><button class="small pink" data-a="copy-join">Copy link</button>
          <button class="small ghost" data-a="new-join">Make a new link</button>
          <button class="small ghost" data-a="join-off">Turn off</button></p>
        <p class="muted" style="font-size:.85rem;margin:.5rem 0 0">"Make a new link" stops the old one from working, in case it was shared somewhere it shouldn't be.</p>`
      : `<p><button class="small pink" data-a="join-on" ${party.title && party.starts_at ? '' : 'disabled'}>Turn on open invite link</button></p>
        ${party.title && party.starts_at ? '' : '<p class="muted" style="font-size:.85rem">Add the party name and date first.</p>'}`}
    </section>`;
  }

  function guestsView(c) {
    const rows = guests.map((g) => g.id === editingId ? editRow(g) : `<div class="item">
      <div><strong>${esc(g.name)}</strong>${g.source === 'self' ? ' <span class="pill p-pending">joined via open link</span>' : ''} <span class="pill p-${g.status}">${g.status === 'pending' ? 'no reply' : g.status}${g.status === 'yes' && g.party_size > 1 ? ' · ' + g.party_size : ''}</span><br>
        <span class="muted">${contact(g)}</span>${g.note ? `<br><em>“${esc(g.note)}”</em>` : ''}</div>
      <div class="muted" style="font-size:.85rem">${g.invited_at ? 'Invited ' + esc(fmtDate(g.invited_at, party.time_zone, { dateStyle: 'short' })) : 'Not invited yet'}</div>
      <div class="acts row">
        ${g.email ? `<button class="small ghost" data-a="email" data-id="${g.id}" data-kind="${g.invited_at ? 'reminder' : 'invite'}">${g.invited_at ? 'Email reminder' : 'Email invite'}</button>` : ''}
        ${g.phone ? `<button class="small ghost" data-a="text" data-id="${g.id}" data-kind="${g.invited_at ? 'reminder' : 'invite'}">${g.invited_at ? 'Text reminder' : 'Text invite'}</button>` : ''}
        <button class="small ghost" data-a="copy-link" data-id="${g.id}">Copy invite link</button>
        <button class="small ghost" data-a="edit" data-id="${g.id}">Edit</button>
        <select data-a="status" data-id="${g.id}" aria-label="RSVP for ${esc(g.name)}">${['pending', 'yes', 'maybe', 'no'].map((s) => `<option value="${s}" ${g.status === s ? 'selected' : ''}>${s === 'pending' ? 'No reply' : s[0].toUpperCase() + s.slice(1)}</option>`).join('')}</select>
        <button class="small ghost" data-a="remove" data-id="${g.id}">Remove</button>
      </div></div>`).join('');
    return `<section>
      <div class="row" style="justify-content:space-between"><h2 style="margin:0">Guests (${guests.length})</h2>
        ${guests.length ? '<button class="small ghost" data-a="export">Download CSV</button>' : ''}</div>
      ${rows || '<p class="muted">No guests yet.</p>'}
      <h3>Add guests</h3>
      <form id="add"><label for="lines">One per line: name, email, phone (either contact can be left out)</label>
        <textarea id="lines" name="lines" rows="3" placeholder="Jordan Lee, jordan@example.com, 555-123-4567"></textarea>
        <p><button>Add to list</button></p></form>
      <h3>Or import a spreadsheet</h3>
      <form id="import"><label for="csv">CSV file with Name, Email and Phone columns</label>
        <input id="csv" type="file" accept=".csv,text/csv" required>
        <label class="check"><input type="checkbox" name="keep"><span>Keep RSVP answers, party sizes and comments from the file (leave unticked for an old list)</span></label>
        <label class="check"><input type="checkbox" name="invited"><span>These guests were already invited to this party elsewhere, so don't list them for a new invite</span></label>
        <p><button>Import guests</button></p></form>
    </section>`;
  }

  function localInput(iso) {
    if (!iso) return '';
    const d = new Date(iso), p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  function render() {
    const c = counts();
    const next = nextReminder();
    app.innerHTML = `
<header class="top"><div class="wrap"><h1>${esc(party.title || 'Your party')}</h1><button class="small" data-a="logout">Log out</button></div></header>
<div class="wrap">
  ${flash ? `<div class="flash ${flash.startsWith('!') ? 'error' : 'ok'}" role="status">${esc(flash.replace(/^!/, ''))}</div>` : ''}
  <section><div class="tally">
    <div><b>${c.yes}</b>Yes${c.people !== c.yes ? ` (${c.people} people)` : ''}</div><div><b>${c.maybe}</b>Maybe</div><div><b>${c.no}</b>No</div><div><b>${c.pending}</b>No reply</div>
  </div></section>

  ${todoView()}
  ${guestsView(c)}

  <section><h2>Party details</h2>
    <form id="details">
      <label for="t">Name of the party</label><input id="t" name="title" value="${esc(party.title)}" required placeholder="Pumpkin Carving Party">
      <label for="h">Hosted by (also used to sign your emails)</label><input id="h" name="host_name" value="${esc(party.host_name)}" placeholder="Maya & Sam">
      <div class="grid2">
        <div><label for="s">Starts</label><input id="s" name="start" type="datetime-local" value="${localInput(party.starts_at)}" required></div>
        <div><label for="en">Ends (optional)</label><input id="en" name="end" type="datetime-local" value="${localInput(party.ends_at)}"></div>
      </div>
      <label for="l">Where</label><input id="l" name="location" value="${esc(party.location)}" placeholder="123 Elm St, San Jose">
      <label for="d">Everything guests should know</label>
      <textarea id="d" name="details" rows="5" placeholder="Parking, what to bring, dress code…">${esc(party.details)}</textarea>
      <p><button class="pink">Save details</button></p>
    </form></section>

  <section><h2>Reminders</h2>
    <p class="muted">On each reminder day, everyone invited who hasn't said no appears in your "To send" list. Guests who haven't replied get a nudge to RSVP.</p>
    <form id="reminders" class="row" style="align-items:end">
      <div style="flex:1;min-width:200px"><label for="rd">Days before the party</label><input id="rd" name="days" value="${esc((party.reminder_days || []).join(', '))}" placeholder="7, 1"></div>
      <button>Save</button></form>
    <p class="muted">${next ? `Next round: ${esc(fmtDate(next, party.time_zone, { dateStyle: 'full' }))}.` : party.starts_at ? 'No more rounds scheduled.' : ''}</p>
    <div class="row"><button class="ghost small" data-a="calendar" ${party.starts_at ? '' : 'disabled'}>Add reminder days to my calendar</button>
      <button class="ghost small" data-a="round-now" ${party.starts_at ? '' : 'disabled'}>Start a reminder round now</button></div>
  </section>

  ${openLinkView()}

  <section><h2>Settings</h2>
    <label for="vis">What guests can see on their invite page (emails and phone numbers are never shown)</label>
    <select id="vis" data-a="visibility">${[['off', 'Nothing — keep the guest list private'], ['counts', 'Just the totals'], ['names', "Totals and names of who's coming"], ['all', 'Totals, names and RSVP comments']]
      .map(([v, l]) => `<option value="${v}" ${party.visibility === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
    <label for="ok">Your Outlook account</label>
    <select id="ok" data-a="outlook">
      <option value="live" ${outlookKind === 'live' ? 'selected' : ''}>Personal (outlook.com, hotmail, live)</option>
      <option value="office" ${outlookKind === 'office' ? 'selected' : ''}>Work or school (Microsoft 365)</option></select>
  </section>
</div>`;
  }

  // ---------- Events ----------
  const byId = (id) => guests.find((g) => g.id === id);
  const copy = async (text, what) => { try { await navigator.clipboard.writeText(text); flash = `${what} copied.`; } catch { flash = "!Couldn't copy. Your browser blocked it."; } render(); };

  app.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-a]');
    if (!b || busy) return;
    const a = b.dataset.a, g = byId(b.dataset.id), kind = b.dataset.kind, round = b.dataset.round || currentRound()?.key;
    const mark = () => act(() => markSent([g.id], kind, round), `Marked ${g.name} as sent.`);
    if (a === 'email') {
      const m = message(g, kind);
      window.open(outlookUrl({ to: g.email, subject: m.subject, body: m.email }), '_blank', 'noopener');
      if (kind === 'invite' || round) mark();
    } else if (a === 'text') {
      location.href = smsUrl(g.phone, message(g, kind).text);
      if (kind === 'invite' || round) setTimeout(mark, 300);
    } else if (a === 'mark') mark();
    else if (a === 'bcc' || a === 'copy-bcc' || a === 'copy-group' || a === 'mark-bcc') {
      const r = currentRound();
      if (!r) return;
      const list = guests.filter((x) => x.invited_at && x.status !== 'no' && x.email && !(x.rounds_done || []).includes(r.key));
      const gm = groupMessage();
      if (a === 'copy-bcc') return copy(list.map((x) => x.email).join('; '), `${list.length} addresses`);
      if (a === 'copy-group') return copy(`${gm.subject}\n\n${gm.body}`, 'Message');
      if (a === 'bcc') window.open(outlookUrl({ bcc: list.map((x) => x.email).join(';'), subject: gm.subject, body: gm.body }), '_blank', 'noopener');
      act(() => markSent(list.map((x) => x.id), 'reminder', r.key), `Marked ${list.length} reminder emails as sent.`);
    } else if (a === 'copy-link') copy(inviteUrl(g), `${g.name}'s link`);
    else if (a === 'remove') { if (confirm(`Remove ${g.name}?`)) act(() => sb.from('guests').delete().eq('id', g.id).then(check), `Removed ${g.name}.`); }
    else if (a === 'export') exportCSV();
    else if (a === 'edit') { editingId = g.id; editDraft = null; render(); const el = document.getElementById('e-name'); if (el) el.focus(); }
    else if (a === 'cancel-edit') { editingId = null; editDraft = null; render(); }
    else if (a === 'copy-join') copy(joinUrl(), 'Open invite link');
    else if (a === 'join-on') act(() => sb.from('party').update({ join_enabled: true, join_code: party.join_code || newCode() }).eq('id', 1).then(check), 'Open invite link is on. Copy it below.');
    else if (a === 'join-off') { if (confirm('Turn off the open invite link? Anyone who opens it will be told it is no longer active. People who already joined keep their own links.')) act(() => sb.from('party').update({ join_enabled: false }).eq('id', 1).then(check), 'Open invite link turned off.'); }
    else if (a === 'new-join') { if (confirm('Make a new open invite link? The current one will stop working.')) act(() => sb.from('party').update({ join_code: newCode(), join_enabled: true }).eq('id', 1).then(check), 'New link ready. The old one no longer works.'); }
    else if (a === 'logout') sb.auth.signOut().then(() => loginView());
    else if (a === 'round-now') { if (confirm("Start a reminder round now? Everyone invited who hasn't said no will appear in your To send list.")) act(() => sb.from('party').update({ manual_round: `${party.starts_at}|m${new Date().toISOString()}` }).eq('id', 1).then(check), 'Reminder round started. See To send.'); }
    else if (a === 'calendar') {
      const start = new Date(party.starts_at).getTime();
      const evs = (party.reminder_days || []).map((d) => { const t = new Date(start - d * DAY); t.setHours(10, 0, 0, 0); return { d, t }; })
        .filter(({ t }) => t.getTime() > Date.now())
        .map(({ d, t }) => ({ uid: `remind-${start}-${d}`, start: t, end: new Date(t.getTime() + 15 * 60e3), alarm: true,
          title: `Send reminders: ${party.title}`, location: '', description: `Open your party dashboard and work through the To send list:\n${location.href}` }));
      if (!evs.length) { flash = '!No upcoming reminder days to add.'; return render(); }
      icsDownload('party-reminders.ics', evs);
    }
  });

  app.addEventListener('change', (e) => {
    const el = e.target, a = el.dataset.a;
    if (a === 'status') {
      const g = byId(el.dataset.id);
      act(() => sb.from('guests').update({ status: el.value, responded_at: el.value === 'pending' ? null : new Date().toISOString() }).eq('id', g.id).then(check), `Updated ${g.name}.`);
    } else if (a === 'visibility') act(() => sb.from('party').update({ visibility: el.value }).eq('id', 1).then(check), 'Guest page setting saved.');
    else if (a === 'outlook') { outlookKind = el.value; store.set('outlookKind', outlookKind); flash = 'Outlook setting saved on this device.'; render(); }
  });

  app.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target, fd = new FormData(f);
    if (f.id === 'login') {
      const { error } = await sb.auth.signInWithPassword({ email: fd.get('email'), password: fd.get('password') });
      return error ? loginView(error.message) : start();
    }
    if (f.id === 'details') {
      const iso = (v) => (v ? new Date(v).toISOString() : null);
      return act(() => sb.from('party').update({ title: fd.get('title').trim(), host_name: fd.get('host_name').trim(), starts_at: iso(fd.get('start')),
        ends_at: iso(fd.get('end')), time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, location: fd.get('location').trim(), details: fd.get('details') })
        .eq('id', 1).then(check), 'Party details saved.');
    }
    if (f.id === 'reminders') {
      const days = [...new Set(String(fd.get('days')).split(/[,\s]+/).map(Number).filter((d) => d > 0 && d <= 365))].sort((a, b) => b - a);
      return act(() => sb.from('party').update({ reminder_days: days }).eq('id', 1).then(check), days.length ? 'Reminder days saved.' : 'Reminders turned off.');
    }
    if (f.id === 'edit') {
      const id = f.dataset.id;
      const name = String(fd.get('name')).trim().slice(0, 100);
      const email = String(fd.get('email')).trim().toLowerCase();
      const phone = normPhone(String(fd.get('phone')));
      editDraft = { name: String(fd.get('name')), email: String(fd.get('email')), phone: String(fd.get('phone')) };
      if (!name) { flash = '!Please enter a name.'; return render(); }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { flash = "!That email address doesn't look right."; return render(); }
      const clash = guests.find((x) => x.id !== id && ((email && x.email === email) || (phone && x.phone === phone)));
      if (clash) { flash = `!${clash.name} already has that ${email && clash.email === email ? 'email' : 'phone number'}.`; return render(); }
      return act(async () => { check(await sb.from('guests').update({ name, email, phone }).eq('id', id)); editingId = null; editDraft = null; }, `Saved ${name}.`);
    }
    if (f.id === 'add') {
      const rows = String(fd.get('lines')).split(/\r?\n/).map(parseLine).filter((r) => r.name || r.email || r.phone);
      let msg; return act(async () => { msg = await addGuests(rows); }, null).then(() => { if (!flash.startsWith('!')) { flash = msg; render(); } });
    }
    if (f.id === 'import') {
      const file = f.querySelector('input[type=file]').files[0];
      if (!file) return;
      const rows = parseCSV(await file.text());
      if (rows.length < 2) { flash = "!That file didn't have any guest rows."; return render(); }
      const head = rows[0].map((h) => h.toLowerCase().trim());
      const col = (...re) => head.findIndex((h) => re.some((r) => r.test(h)));
      const ci = { name: col(/^name$/, /name/, /guest/), email: col(/e-?mail/), phone: col(/phone|mobile|cell/), status: col(/status/, /rsvp$/, /response/),
        size: col(/number in party|party size|guests?$|count|size|adults/), note: col(/comment|note|message/) };
      if (ci.name < 0 && ci.email < 0) { flash = "!Couldn't find a Name or Email column in that file."; return render(); }
      const keep = fd.get('keep') === 'on';
      const get = (r, i) => (i >= 0 ? (r[i] || '').trim() : '');
      const list = rows.slice(1).map((r) => ({ name: get(r, ci.name), email: get(r, ci.email), phone: get(r, ci.phone),
        ...(keep ? { status: ci.status >= 0 ? mapStatus(get(r, ci.status)) : 'pending', size: parseInt(get(r, ci.size), 10) || 1, note: get(r, ci.note) } : {}) }));
      let msg; return act(async () => { msg = await addGuests(list, { invited: fd.get('invited') === 'on' }); }, null).then(() => { if (!flash.startsWith('!')) { flash = msg; render(); } });
    }
  });

  // ---------- Start ----------
  async function start() {
    if (!configured) { app.innerHTML = '<main class="login"><h1>Almost ready</h1><p>Add your Supabase project URL and key to <code>config.js</code>, then reload.</p></main>'; return; }
    const { data: { session } } = await sb.auth.getSession();
    if (!session) return loginView();
    const { data: isHost, error } = await sb.rpc('is_host');
    if (error) return loginView("Couldn't reach the database. If your Supabase project is paused, resume it from the Supabase dashboard, then reload.");
    if (!isHost) { await sb.auth.signOut(); return loginView("That account isn't set up as the host. Check the email in setup.sql."); }
    try { await load(); render(); }
    catch (e) { app.innerHTML = `<main class="login"><p class="error">Couldn't load your party: ${esc(e.message)}</p></main>`; }
  }
  start();
})();

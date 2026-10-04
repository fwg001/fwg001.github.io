(function () {
  const { sb, configured, esc, firstName, fmtDate, icsDownload } = window.Party;
  const app = document.getElementById('app');
  const token = new URLSearchParams(location.search).get('t') || '';
  let data = null, flash = '', size = 1;

  // The pumpkin patch: glowing jack-o'-lantern, winking red pumpkin, blue-gray grinner.
  const PATCH = `<div class="patch" aria-hidden="true">
<svg class="pk1" viewBox="0 0 260 230"><circle cx="130" cy="138" r="122" fill="#ffd36b" opacity="0.06"/><circle cx="130" cy="138" r="100" fill="#ffd36b" opacity="0.08"/><path d="M126 52 C122 36 124 22 136 10 L146 16 C138 26 136 38 140 52 Z" fill="#5e7d2e"/><path d="M140 30 C156 18 176 20 186 30 C172 30 160 34 148 42 Z" fill="#7a9b3d"/><ellipse cx="78" cy="140" rx="58" ry="78" fill="#d9601a"/><ellipse cx="182" cy="140" rx="58" ry="78" fill="#d9601a"/><ellipse cx="104" cy="138" rx="52" ry="84" fill="#f47b20"/><ellipse cx="156" cy="138" rx="52" ry="84" fill="#f47b20"/><ellipse cx="130" cy="136" rx="44" ry="86" fill="#f88a35"/><path d="M86 112 L112 112 L99 90 Z" fill="#ffd36b"/><path d="M148 112 L174 112 L161 90 Z" fill="#ffd36b"/><path d="M124 132 L136 132 L130 120 Z" fill="#ffd36b"/><path d="M74 150 Q130 200 186 150 L176 152 L170 166 L160 158 L148 172 L138 162 L126 174 L116 162 L104 172 L94 158 L86 164 Z" fill="#ffd36b"/></svg>
<svg class="pk2" viewBox="0 0 200 140"><circle cx="100" cy="86" r="84" fill="#ffd36b" opacity="0.07"/><path d="M96 32 C92 20 94 10 102 2 L110 6 C104 14 104 22 106 32 Z" fill="#6b5a2e"/><ellipse cx="50" cy="88" rx="48" ry="50" fill="#a8320f"/><ellipse cx="150" cy="88" rx="48" ry="50" fill="#a8320f"/><ellipse cx="76" cy="86" rx="46" ry="54" fill="#c4421a"/><ellipse cx="124" cy="86" rx="46" ry="54" fill="#c4421a"/><ellipse cx="100" cy="86" rx="36" ry="54" fill="#d9541f"/><path d="M60 72 Q74 58 88 72 Q74 66 60 72 Z" fill="#ffd36b"/><circle cx="128" cy="68" r="10" fill="#ffd36b"/><path d="M58 94 Q100 132 142 94 Q100 112 58 94 Z" fill="#ffd36b"/></svg>
<svg class="pk3" viewBox="0 0 140 150"><circle cx="70" cy="92" r="62" fill="#ffd36b" opacity="0.07"/><path d="M66 34 C64 22 68 10 78 4 L84 8 C76 14 74 24 76 34 Z" fill="#5e7d2e"/><ellipse cx="38" cy="94" rx="34" ry="52" fill="#6f8189"/><ellipse cx="102" cy="94" rx="34" ry="52" fill="#6f8189"/><ellipse cx="56" cy="92" rx="32" ry="56" fill="#8a9ca3"/><ellipse cx="84" cy="92" rx="32" ry="56" fill="#8a9ca3"/><ellipse cx="70" cy="91" rx="24" ry="57" fill="#a5b5ba"/><path d="M38 74 L62 82 L46 92 Z" fill="#ffd36b"/><path d="M102 74 L78 82 L94 92 Z" fill="#ffd36b"/><path d="M44 108 L96 108 Q92 130 70 132 Q48 130 44 108 Z" fill="#ffd36b"/><rect x="64" y="108" width="12" height="10" fill="#a5b5ba"/></svg>
</div>`;
  const CHECK = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  function solo(title, text) {
    app.innerHTML = `<div class="solo">${PATCH.replace('class="patch"', 'class="patch" style="justify-content:center"')}<h1>${esc(title)}</h1><p>${esc(text)}</p></div>`;
  }

  async function load() {
    if (!configured) return solo('Almost ready', "This site isn't connected to its database yet.");
    if (!token) return solo("We couldn't find that invite", 'Check that you opened the full link from your message.');
    const { data: d, error } = await sb.rpc('get_invite', { p_token: token });
    if (error) return solo('Something went wrong', "We couldn't load your invitation. Please try again in a minute.");
    if (!d) return solo("We couldn't find that invite", 'Check that you opened the full link from your message.');
    data = d; size = d.guest.party_size || 1;
    render();
  }

  function whoHtml() {
    const { visibility: v, totals: t, who } = data;
    if (v === 'off' || !t) return '';
    const totals = `<div class="tot"><div><b>${t.people}</b><span>coming</span></div><div><b>${t.maybe}</b><span>maybe</span></div><div><b>${t.pending}</b><span>haven't replied</span></div></div>`;
    if (v === 'counts' || !who) return `<section class="who" aria-labelledby="who-h"><h2 id="who-h">Who's coming</h2>${totals}</section>`;
    const li = (g) => `<li><div class="nm"><strong>${esc(g.name)}</strong>${g.me ? '<span class="you">(you)</span>' : ''}${g.status === 'yes' && g.party_size > 1 ? `<span class="sm">+${g.party_size - 1}</span>` : ''}</div>${g.note ? `<span class="sm">“${esc(g.note)}”</span>` : ''}</li>`;
    const yes = who.filter((g) => g.status === 'yes').map(li).join('');
    const maybe = who.filter((g) => g.status === 'maybe').map(li).join('');
    return `<section class="who" aria-labelledby="who-h"><h2 id="who-h">Who's coming</h2>${totals}
      ${yes ? `<h3>Going</h3><ul>${yes}</ul>` : '<p class="empty">No one has said yes yet. Be the first!</p>'}
      ${maybe ? `<h3>Maybe</h3><ul>${maybe}</ul>` : ''}</section>`;
  }

  function render() {
    const p = data.party, g = data.guest;
    document.title = p.title || "You're invited";
    const past = p.starts_at && new Date(p.starts_at) < new Date();
    const day = p.starts_at ? fmtDate(p.starts_at, p.time_zone, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Date to be announced';
    const time = p.starts_at ? fmtDate(p.starts_at, p.time_zone, { hour: 'numeric', minute: '2-digit' }) + (p.ends_at ? ' – ' + fmtDate(p.ends_at, p.time_zone, { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }) : '') : '';
    const opt = (v, label) => `<label class="choice"><input type="radio" name="status" value="${v}" ${g.status === v ? 'checked' : ''} required><span>${label}</span></label>`;
    const banner = flash ? `<div class="${flash.startsWith('!') ? 'err' : 'ok'}" role="status">${flash.startsWith('!') ? '' : CHECK}<span>${esc(flash.replace(/^!/, ''))}</span></div>` : '';

    app.innerHTML = `<div class="page"><div class="grid">
      <div class="info">
        ${PATCH}
        <div>
          <p class="eyebrow">${esc(firstName(g.name))}, you're invited${p.host_name ? ' by ' + esc(p.host_name) : ''}</p>
          <h1>${esc(p.title || 'A party')}</h1>
        </div>
        <dl class="facts">
          <div class="fact"><dt>When</dt><dd><span class="strong">${esc(day)}</span>${time ? `<span>${esc(time)}</span>` : ''}${p.starts_at && !past ? '<a href="#" id="cal">Add to calendar</a>' : ''}</dd></div>
          ${p.location ? `<div class="fact"><dt>Where</dt><dd><span class="strong">${esc(p.location)}</span><a href="https://maps.google.com/?q=${encodeURIComponent(p.location)}" target="_blank" rel="noopener">Open in maps</a></dd></div>` : ''}
        </dl>
        ${p.details ? `<p class="details">${esc(p.details)}</p>` : ''}
      </div>
      <div class="card">
        ${banner}
        ${past ? '<h2>This party has already happened</h2><p class="empty">Thanks for celebrating with us!</p>' : `
        <form id="rsvp" novalidate>
          <fieldset class="choices">
            <legend>${g.status === 'pending' ? 'Can you make it?' : 'Your RSVP'}</legend>
            ${opt('yes', 'Yes!')}${opt('maybe', 'Maybe')}${opt('no', "Can't make it")}
          </fieldset>
          <div class="field">
            <span class="lbl" id="size-lbl">How many people, including you?</span>
            <div class="stepper" role="group" aria-labelledby="size-lbl">
              <button type="button" id="dec" aria-label="One fewer person" ${size <= 1 ? 'disabled' : ''}>−</button>
              <output id="size" aria-live="polite">${size}</output>
              <button type="button" id="inc" aria-label="One more person" ${size >= 20 ? 'disabled' : ''}>+</button>
            </div>
          </div>
          <div class="field">
            <label for="note">Note for the host (optional)</label>
            <textarea id="note" name="note" rows="3" maxlength="500" placeholder="Allergies, running late, can't wait…">${esc(g.note)}</textarea>
          </div>
          <button class="primary">${g.status === 'pending' ? 'Send RSVP' : 'Update RSVP'}</button>
          ${g.status !== 'pending' ? '<p class="hint">Plans change? Come back to this link any time to update your answer.</p>' : ''}
        </form>`}
        ${whoHtml()}
      </div>
    </div></div>`;

    const cal = document.getElementById('cal');
    if (cal) cal.addEventListener('click', (e) => {
      e.preventDefault();
      icsDownload('pumpkin-party.ics', [{ uid: 'party-' + new Date(p.starts_at).getTime(), start: p.starts_at,
        end: p.ends_at || new Date(new Date(p.starts_at).getTime() + 3 * 3600e3).toISOString(),
        title: p.title, location: p.location, description: (p.details ? p.details + '\n\n' : '') + location.href }]);
    });

    const form = document.getElementById('rsvp');
    if (!form) return;
    const out = form.querySelector('#size'), dec = form.querySelector('#dec'), inc = form.querySelector('#inc');
    const setSize = (n) => { size = Math.min(20, Math.max(1, n)); out.textContent = size; dec.disabled = size <= 1; inc.disabled = size >= 20; };
    dec.addEventListener('click', () => setSize(size - 1));
    inc.addEventListener('click', () => setSize(size + 1));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = (form.querySelector('input[name=status]:checked') || {}).value;
      if (!status) { flash = '!Pick Yes, Maybe, or Can\'t make it first.'; render(); return; }
      const btn = form.querySelector('.primary');
      btn.disabled = true; btn.textContent = 'Saving…';
      const { data: d, error } = await sb.rpc('submit_rsvp', { p_token: token, p_status: status, p_party_size: size, p_note: form.querySelector('#note').value || '' });
      if (error) flash = '!' + (error.message || "That didn't save. Please try again.");
      else {
        data = d; size = d.guest.party_size;
        const s = d.guest.status;
        flash = s === 'yes' ? "You're on the list. See you there!" : s === 'no' ? "Thanks for letting us know. You'll be missed!" : 'Got it. We hope you can make it!';
      }
      render();
      const card = document.querySelector('.card');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  load();
})();

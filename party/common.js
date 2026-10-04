// Shared helpers for the invite page and the host dashboard.
(function () {
  const cfg = window.PARTY_CONFIG || {};
  const configured = cfg.supabaseUrl && !cfg.supabaseUrl.includes('YOUR-PROJECT') && cfg.supabaseAnonKey && !cfg.supabaseAnonKey.startsWith('YOUR-');
  const sb = configured ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const firstName = (n) => (n || '').trim().split(/\s+/)[0] || 'there';

  function fmtDate(iso, tz, opts = { dateStyle: 'full', timeStyle: 'short' }) {
    if (!iso) return 'Date to be announced';
    try { return new Date(iso).toLocaleString('en-US', { timeZone: tz || undefined, ...opts }); }
    catch { return new Date(iso).toLocaleString('en-US', opts); }
  }

  function normPhone(p, cc = '1') {
    p = (p || '').trim();
    const d = p.replace(/\D/g, '');
    if (!d) return '';
    if (p.startsWith('+')) return '+' + d;
    if (d.startsWith(cc) && d.length > 10) return '+' + d;
    return '+' + cc + d;
  }

  // Calendar file (.ics) download, built in the browser.
  function icsDownload(filename, events) {
    const f = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const t = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/[,;]/g, (m) => '\\' + m).replace(/\r?\n/g, '\\n');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//party-rsvp//EN'];
    for (const e of events) {
      lines.push('BEGIN:VEVENT', `UID:${e.uid}@party-rsvp`, `DTSTAMP:${f(Date.now())}`, `DTSTART:${f(e.start)}`, `DTEND:${f(e.end)}`,
        `SUMMARY:${t(e.title)}`, `LOCATION:${t(e.location)}`, `DESCRIPTION:${t(e.description)}`);
      if (e.alarm) lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${t(e.title)}`, 'TRIGGER:-PT0M', 'END:VALARM');
      lines.push('END:VEVENT');
    }
    lines.push('END:VCALENDAR');
    const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: filename });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  window.Party = { sb, configured, esc, firstName, fmtDate, normPhone, icsDownload };
})();

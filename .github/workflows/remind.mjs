// Family Bills: monthly email reminders.
// Run by .github/workflows/bill-reminders.yml. Can also run locally with the same env vars.
//
// On the 1st: emails everyone with an unpaid amount ("your bill is due").
// Any other day: emails anyone still unpaid ("reminder"), and sends admins a summary.
// It also creates this month's rows if nobody has opened the app yet.

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import nodemailer from 'nodemailer';

const env = process.env;
const DRY_RUN = env.DRY_RUN === 'true';
const TEST_TO = (env.TEST_TO || '').trim();        // send every email here instead (for testing)
const APP_URL = env.APP_URL || 'https://www.carletondesign.com/family-bills/';
const TZ = 'America/Los_Angeles';

/* ---------- helpers (same rules as the app) ---------- */
const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n) || 0);
const round2 = n => Math.round(Number(n) * 100) / 100;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const monthLabel = ym => new Date(ym + '-15T12:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const monthName = ym => new Date(ym + '-15T12:00:00Z').toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });
const covers = (a, ym) => a.start <= ym && (!a.end || a.end >= ym);

function today() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date()).map(x => [x.type, x.value]));
  return { ym: `${p.year}-${p.month}`, day: Number(p.day) };
}

function buildDue(email, ym, assignments, bills) {
  const lines = assignments
    .filter(a => a.email === email && covers(a, ym))
    .map(a => ({ a, b: bills.find(b => b.id === a.billId) }))
    .filter(x => x.b && x.b.active)
    .sort((x, y) => (x.b.sort ?? 0) - (y.b.sort ?? 0) || x.b.name.localeCompare(y.b.name))
    .map(x => ({ bill: x.b.name, amount: round2(x.a.amount) }));
  if (!lines.length) return null;
  return {
    email, month: ym, amount: round2(lines.reduce((s, l) => s + l.amount, 0)),
    breakdown: lines, paid: false, paidAt: null, markedBy: null, note: null
  };
}

/* ---------- emails ---------- */
function memberEmail(person, rows, isDueDay, cm) {
  const total = round2(rows.reduce((s, d) => s + Number(d.amount), 0));
  const current = rows.find(d => d.month === cm);
  const older = rows.filter(d => d.month !== cm);
  const subject = isDueDay && current && !older.length
    ? `${money(current.amount)} due for ${monthName(cm)}`
    : `Reminder: ${money(total)} still to pay`;

  const lines = rows.map(d => {
    const parts = (d.breakdown || []).map(b => `${b.bill} ${money(b.amount)}`).join(' + ');
    return { text: `${monthLabel(d.month)}: ${money(d.amount)}${parts ? ` (${parts})` : ''}${d.note ? `\n  Note: ${d.note}` : ''}`, d, parts };
  });

  const intro = isDueDay && !older.length
    ? `Hi ${person.name}, here's your share of the family bills for ${monthName(cm)}.`
    : `Hi ${person.name}, just a reminder that this hasn't been marked paid yet.`;
  const outro = `Once you've sent the payment, tick “I've paid” in the app:\n${APP_URL}`;

  const text = `${intro}\n\n${lines.map(l => l.text).join('\n')}\n${rows.length > 1 ? `\nTotal: ${money(total)}\n` : ''}\n${outro}\n`;
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:16px;line-height:1.5;color:#1f2420;max-width:520px">
      <p>${esc(intro)}</p>
      <table style="border-collapse:collapse;width:100%;margin:12px 0">
        ${lines.map(({ d, parts }) => `
          <tr><td style="padding:8px 0;border-bottom:1px solid #dcd8cf">
            <strong>${esc(monthLabel(d.month))}</strong><br>
            <span style="color:#5c645e;font-size:14px">${esc(parts)}</span>
            ${d.note ? `<br><span style="color:#5c645e;font-size:14px">Note: ${esc(d.note)}</span>` : ''}
          </td><td style="padding:8px 0;border-bottom:1px solid #dcd8cf;text-align:right;font-weight:700;white-space:nowrap">${money(d.amount)}</td></tr>`).join('')}
        ${rows.length > 1 ? `<tr><td style="padding:8px 0"><strong>Total</strong></td><td style="padding:8px 0;text-align:right;font-weight:700">${money(total)}</td></tr>` : ''}
      </table>
      <p>Once you've sent the payment, tick “I've paid” in the app.</p>
      <p><a href="${esc(APP_URL)}" style="display:inline-block;background:#2f5d50;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:600">Open Family Bills</a></p>
    </div>`;
  return { subject, text, html };
}

function adminEmail(unpaidByPerson, cm) {
  const lines = unpaidByPerson.map(({ person, rows }) =>
    `${person.name}: ${money(rows.reduce((s, d) => s + Number(d.amount), 0))} (${rows.map(d => monthName(d.month)).join(', ')})`);
  const subject = `Family Bills: ${unpaidByPerson.length} still unpaid for ${monthName(cm)}`;
  const text = `Not marked paid yet:\n\n${lines.join('\n')}\n\nReminders were sent to each of them.\n${APP_URL}\n`;
  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:16px;line-height:1.5">
    <p>Not marked paid yet:</p><ul>${lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
    <p>Reminders were sent to each of them. <a href="${esc(APP_URL)}">Open Family Bills</a></p></div>`;
  return { subject, text, html };
}

/* ---------- main ---------- */
async function main() {
  if (!env.FIREBASE_SERVICE_ACCOUNT) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT secret');
  initializeApp({ credential: cert(JSON.parse(env.FIREBASE_SERVICE_ACCOUNT)) });
  const db = getFirestore();

  const { ym: cm, day } = today();
  const isDueDay = day === 1;
  console.log(`Today: ${cm}, day ${day}${DRY_RUN ? ' (dry run: nothing will be sent)' : ''}${TEST_TO ? ` (test: all mail to ${TEST_TO})` : ''}`);

  const all = async c => (await db.collection(c).get()).docs.map(d => ({ id: d.id, ...d.data() }));
  const [people, bills, assignments] = await Promise.all([all('people'), all('bills'), all('assignments')]);

  // Create this month's rows if the app hasn't yet (create() never overwrites)
  for (const p of people.filter(p => p.active)) {
    const data = buildDue(p.id, cm, assignments, bills);
    if (!data) continue;
    try {
      if (!DRY_RUN) await db.collection('dues').doc(`${p.id}_${cm}`).create(data);
      console.log(`Created ${cm} for ${p.name}`);
    } catch (e) { if (e.code !== 6) throw e; /* already exists */ }
  }

  const unpaid = (await db.collection('dues').where('paid', '==', false).get()).docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(d => d.month <= cm && Number(d.amount) > 0);

  const unpaidByPerson = people
    .filter(p => p.active && p.reminders !== false)
    .map(person => ({ person, rows: unpaid.filter(d => d.email === person.id).sort((a, b) => a.month.localeCompare(b.month)) }))
    .filter(x => x.rows.length);

  if (!unpaidByPerson.length) { console.log('Everyone is paid up. No emails.'); return; }

  const port = Number(env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST || 'smtp.gmail.com', port, secure: port === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
  });
  const from = env.MAIL_FROM || `Family Bills <${env.SMTP_USER}>`;
  const send = async (to, msg) => {
    const realTo = TEST_TO || to;
    console.log(`${DRY_RUN ? '[dry run] ' : ''}→ ${realTo}${TEST_TO ? ` (for ${to})` : ''}: ${msg.subject}`);
    if (DRY_RUN) { console.log(msg.text.replace(/^/gm, '    ')); return; }
    await transport.sendMail({ from, to: realTo, ...msg });
  };

  for (const { person, rows } of unpaidByPerson) await send(person.id, memberEmail(person, rows, isDueDay, cm));

  // Admin summary on reminder days (on the 1st, everyone is unpaid, so skip)
  if (!isDueDay) {
    const admins = people.filter(p => p.active && p.role === 'admin');
    for (const a of admins) await send(a.id, adminEmail(unpaidByPerson, cm));
  }
}

main().catch(err => { console.error(err); process.exit(1); });

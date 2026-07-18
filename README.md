# House Party 2026 — Landing Page

A premium, dark-luxury, glassmorphism landing page built to sell ₹399 passes for a
mystery house party running the same night across Mumbai, Pune, Bangalore & Indore.

Built with **HTML5 + Tailwind CSS (CDN) + vanilla JavaScript** — no build step required.

---

## 📁 File structure

```
houseparty2026/
├── index.html          Main landing page (all sections + popup form)
├── success.html         Post-payment "Thank You" page
├── style.css             Custom CSS: glassmorphism, gradients, particles, animations
├── script.js              Countdown, validation, modals, payment handoff logic
├── assets/
│   └── icons/
│       └── favicon.svg
└── README.md
```

Open `index.html` directly in a browser, or serve the folder with any static
file server (e.g. `npx serve .`). No backend, no npm install needed.

---

## 💳 Connecting Razorpay (required before going live)

The site does **not** embed the Razorpay Checkout SDK — it uses a simple
**Razorpay Payment Link**, which is the fastest way to accept the flat ₹399 fee
without writing server-side order-creation code.

### Steps

1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Go to **Payment Links → + New Payment Link**.
3. Set amount to **₹399**, add a title ("House Party 2026 Pass"), and enable
   "Collect additional details" if you want Razorpay's own form too (optional —
   this site already collects details itself).
4. Save and copy the generated link, e.g. `https://rzp.io/l/abc123XYZ`.
5. Open **`script.js`** and find the `CONFIG` object near the top:

   ```js
   const CONFIG = {
     eventDate: new Date('2026-07-25T20:00:00+05:30'),
     razorpayPaymentLink: 'https://YOUR-RAZORPAY-PAYMENT-LINK', // 👈 paste here
     whatsappSupportNumber: '919999999999',
   };
   ```

6. Replace `'https://YOUR-RAZORPAY-PAYMENT-LINK'` with your real link.
7. That's it — clicking **Continue to Payment** in the form now redirects
   confirmed users straight to Razorpay.

### Redirecting back to `success.html`

Razorpay Payment Links let you set a **Redirect URL** in the link's settings
(Advanced Options) so that, after a successful payment, the customer is sent
back to your `success.html` page (e.g. `https://yourdomain.com/success.html`).
Configure this in the same Payment Link creation screen in step 3 above.

> For a fully automated flow with server-verified payment status, you would
> use Razorpay Orders API + webhooks with a backend — this static site uses
> the no-code Payment Link approach, which is sufficient for a fixed ₹399 fee.

---

## 🗄️ Connecting Supabase (for storing form submissions)

The popup form is wired to optionally save every registration to a Supabase
table, in addition to a local `localStorage` copy (used to populate the
booking summary on `success.html`).

### 1. Create the table

In your Supabase project, go to **SQL Editor** and run:

```sql
create table registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  city text not null,
  phone text not null,
  whatsapp text not null,
  email text not null,
  current_location text not null,
  message text,
  agreed_to_terms boolean not null,
  source text,
  amount integer,
  currency text,
  submitted_at timestamptz,
  created_at timestamptz default now()
);

-- Allow the public "anon" key to insert rows (but not read/update/delete)
alter table registrations enable row level security;

create policy "Allow public inserts"
on registrations for insert
to anon
with check (true);
```

This keeps the table write-only from the browser — nobody can read other
guests' data using the public anon key.

### 2. Get your project URL + anon key

In the Supabase dashboard: **Project Settings → API** → copy the
**Project URL** and the **anon / public** key.

### 3. Wire it up in the code

In **`index.html`**, uncomment this line near the bottom of the file:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
```

In **`script.js`**, find the `CONFIG.supabase` block near the top and paste
your values:

```js
supabase: {
  url: 'https://abcxyz.supabase.co',   // 👈 your Project URL
  anonKey: 'eyJhbGciOi...',             // 👈 your anon/public key
  table: 'registrations',
},
```

That's it — every valid form submission now inserts a row into
`registrations`, then continues to Razorpay as before. If you leave the
placeholders untouched, the site keeps working exactly as before (saving to
`localStorage` only), so nothing breaks if you set up Supabase later.

---

## ✏️ Other things to customize

| What | Where |
|---|---|
| Event date/time (countdown target) | `CONFIG.eventDate` in `script.js` |
| WhatsApp support number | `CONFIG.whatsappSupportNumber` in `script.js`, and the `wa.me` links in `index.html` / `success.html` |
| Instagram link | Footer social icons in `index.html` |
| Contact email | `mailto:` link in footer, `og:` meta tags |
| Domain / canonical URL | `<link rel="canonical">` and Open Graph tags in `<head>` |
| Testimonials, FAQ copy, city descriptions | Directly inside `index.html` (clearly commented sections) |
| Colors / fonts | `tailwind.config` block in `index.html` `<head>`, and CSS variables described at the top of `style.css` |

---

## 🧠 How the booking flow works

1. Visitor clicks any **Buy Pass** button → opens the glassmorphism popup (`openBuyModal()`).
2. Form validates every field client-side (name, city, phone, WhatsApp, email,
   current location, and the terms checkbox) — see `initBuyForm()` in `script.js`.
3. On successful validation, the entered data is saved to `localStorage`
   (`hp26_registration` + a running list `hp26_registrations`) and a loading
   overlay is shown.
4. The browser redirects to your configured `CONFIG.razorpayPaymentLink`.
5. After payment, Razorpay redirects the user to `success.html` (if configured —
   see above), which reads the saved `localStorage` data to show a booking summary.

> ⚠️ `localStorage` is a client-side convenience only — it is **not** a
> replacement for server-side order records. For production, also capture
> submissions in a backend / Google Sheet / CRM via a form endpoint (e.g.
> Formspree, a serverless function, or your own API) so you have a durable
> record even if the user clears their browser data.

---

## 🔒 Privacy & compliance

- The popup form includes a required consent checkbox linking to in-page
  **Privacy Policy** and **Terms & Conditions** modals (see `LEGAL_CONTENT` in
  `script.js`) explaining that submitted data is used only for ticketing and
  event communication.
- Update the legal copy with your actual business name, registered address,
  and grievance contact before going live, especially if you plan to run this
  for a paying, ticketed public event.

---

## ✅ Feature checklist

- [x] Responsive, mobile-first layout (tested down to 320px width)
- [x] Animated gradient background, blur circles, floating particles
- [x] Glassmorphism navbar, cards, and modals
- [x] Countdown timer to 25 July 2026, 8 PM IST
- [x] Sticky "Buy Pass" bar on mobile
- [x] Exit-intent popup ("Passes are selling fast")
- [x] Scroll progress indicator
- [x] Animated counters, live "capacity" progress bars
- [x] FAQ accordion
- [x] Full client-side form validation with inline errors
- [x] Optional Supabase backend for form submissions (with localStorage fallback)
- [x] Bar/drinks, competitions & games, and large-capacity venue messaging woven through Hero, Why Join, and Event Details
- [x] Loading animation before payment redirect
- [x] Razorpay Payment Link placeholder + setup instructions
- [x] Success page with confetti, booking summary, and support links
- [x] SEO meta tags (title, description, Open Graph, Twitter Card, canonical)
- [x] Accessible focus states, semantic landmarks, reduced-motion support

---

## 🖌️ Design notes

- **Palette:** void black `#050308`, deep indigo `#0D0A1C`, electric purple
  `#7C3AED` / `#A855F7`, neon pink `#FF2E9F` / `#FF6EC7`.
- **Type:** display headings in **Unbounded** (bold, geometric — carries the
  "premium nightlife" energy), body copy in **Manrope** for readability.
- **Signature detail:** city names on the Cities section "decrypt" with a
  scramble/glitch animation on hover — a small nod to the "secret location,
  unlocked after payment" concept that runs through the whole page.

Enjoy the party. 🎉

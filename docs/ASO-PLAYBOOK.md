# Nafs: Google Play ASO and Growth Playbook

Prepared 13 October 2026. App: **Nafs** (`com.nafs.transformation`), a free, offline, local-first 30-day Islamic habit and character journey built with Expo.

This playbook covers what it takes to rank for the terms that matter and keep downloads growing every day. It separates **what the data shows** from **what is my judgement** and from **what I could not verify**.

---

## 0. The honest summary

1. **"Rank #1 on Google Play" is not a single target.** You can realistically reach #1 for specific niche phrases within weeks to months. You cannot realistically reach #1 for broad terms such as "islamic app", "quran" or "prayer times" soon, because Muslim Pro, Deen, Athan and Quran Majeed hold those with years of ratings and installs.
2. **The ranking engine on Google Play is mostly three things**: relevance (title, short description, long description), install velocity and retention (do people install, keep and use it), and quality signals (rating, review volume, crash and ANR rate). Text gets you into the race. Behaviour decides who wins it.
3. **Your listing text is not the bottleneck.** In the Applyra simulation the draft scored 62/100 overall with 86/100 on coverage. The lowest axis is **appeal at 43/100**: no ratings, few screenshots, no video, one language. Those are the biggest levers, and they are earned through launch execution, not copywriting.
4. **Your strongest asset is a real angle.** Almost every competitor is either a prayer-times utility or a blank checklist. Nafs is a *structured, personalised 30-day programme* that covers worship and character. That fits Ramadan preparation perfectly (section 8).
5. **Retention drives rank more than keywords once you have installs.** The notification system I added is the first retention lever. The next ones are in section 9.

---

## 1. What I checked and what I found

| Source | Result |
|---|---|
| GitHub `tahaimran/muslim-helper` | **No earlier ASO analysis exists there.** One branch (`main`), no pull requests, no issues, no ASO files. |
| Applyra account history | An earlier batch of Islamic keyword inspections dated 9 October (salah, namaz, dhikr, habit tracker, in US, PK, TR, ID and SA markets). I reused those scores and extended them. |
| Fresh Applyra research (13 Oct) | 3 niche analyses (islamic habit tracker, ramadan preparation, muslim self improvement), 14 keyword inspections, 12 autocomplete queries, 1 top-chart snapshot, 4 draft listings scored plus Google Play policy checks on each. |

**Limits of the data.** Applyra's traffic score has a floor of about 8, so "8" means *low or unmeasurable*, not zero. Scores are relative and US-centric unless a market is stated. Treat them as direction, not forecast. Opportunity scores for every niche came back between 22 and 33, which means **no wide-open niche exists; winning here is about execution**.

---

## 2. Market map (Google Play, US)

### 2.1 Who you are really competing with

| Tier | Apps | Why they win | Your move |
|---|---|---|---|
| Giants | Muslim Pro (4.12★), Deen, Athan (4.86★), Quran Majeed, Al Quran (Greentech, 4.88★), Wemu | Years of installs, huge review counts, prayer times, Quran text | Do not fight head-on. Do not use their names in your listing. |
| Habit and planner apps | Muslima365 (4.13★), Everyday Muslim (4.81★), Muslim Tracker: Pray & Fasting (5.0★), DeenPlanner, MyWaqt, Visual Muslim, Tazkiyah, Hasanat, PrayPals, Ruhly, BetterMuslim, Islamic Habit Tracker, Islamic Tracker | Exact-match titles for "habit tracker" | **This is your real arena.** Most have **no visible rating**, which means few reviews. A well-run launch can overtake them. |
| Single-purpose tools | Tasbih and dhikr counters (Digital Tasbeeh 4.94★), Daily Dua apps, Ramadan calendars | Simple, one job | Out-feature them inside a bigger journey. |

### 2.2 Evidence the category is heating up

Autocomplete for "muslim habit" returns **"hasanat / noor / muhasaba / mizan muslim habit tracker"**. These are brand names being searched as part of the phrase. New entrants are arriving now, so **speed and ratings matter**. Waiting a year gives up the lead.

### 2.3 What is not available

- "30 day challenge" (difficulty 50, traffic 48) is owned by fitness apps. Do not target it broadly. Use it only with "Islamic".
- "Ramadan" (difficulty 61, traffic 46) is held by dozens of seasonal single-purpose apps. Target the long-tail instead (section 3).

---

## 3. Keyword strategy

Scores are Applyra difficulty / traffic (0 to 100; lower difficulty is easier, higher traffic is more searches). **KEI** is Applyra's efficiency score.

### 3.1 Tier 1: build the listing around these (winnable now)

| Keyword | Market | Diff | Traffic | KEI | Note |
|---|---|---|---|---|---|
| islamic planner | US | 17 | 20 | n/a | Low competition, directly describes you. In title. |
| muslim planner | US | 21 | 19 | 0.90 | Top result is a mid-size planner; reachable. |
| islamic habit tracker | US | 24 | 23 | n/a | Most-completed autocomplete phrase. Top spot is an exact-match title. |
| muslim habit tracker | US | 28 | 25 | 0.89 | Leader has 4.13★; beatable. |
| islamic journal | US | 23 | 33 | 1.43 | Good traffic for the difficulty. You have a journal. |
| daily dua | US | 29 | 51 | **1.76** | Best ratio found. Supported by your duas library. |
| ramadan planner | US | 12 | 24 | **2.00** | Seasonal. Top apps mostly unrated. Peaks before Ramadan. |
| ramadan tracker | US | 19 | 20 | 1.05 | Seasonal. |
| learn salah | US | 17 | 25 | n/a | Beginner intent. |
| new muslim | US | 18 | 58 | n/a | High traffic for the difficulty. Needs honest beginner content. |
| better muslim | US | 22 | 25 | n/a | Matches your character angle. |

### 3.2 Tier 2: stretch terms (use sparingly in the long description)

| Keyword | Diff | Traffic | Why only a stretch |
|---|---|---|---|
| dhikr counter | 45 | 52 | Crowded, but you have a counter; mention in the description. |
| salah tracker | 30 | 40 | Good traffic. Your app tracks prayer tasks, not prayer times. Do not imply it has a prayer-time tracker unless it does. |
| tasbih counter | 43 | 25 | Many 4.8★ single-purpose rivals. |
| islamic app | 30 | 39 | Giants hold ranks 1 to 10. Not a title term. |

### 3.3 Tier 3: low value, skip as headline terms

"quran reading plan" (traffic 8), "quran goal tracker" (traffic 8), "islamic reminders" (traffic 8), "muslim daily routine" (traffic 8). Use them once, naturally, in the description. Do not spend title space on them.

### 3.4 Why the title is "Islamic Planner & Dhikr" and not "Habit Tracker"

I scored four titles with the same description:

| Title | Overall | Targeting | What the tool said |
|---|---|---|---|
| Nafs: Muslim Habit Tracker | 60 | 60 | "tracker", "habit", "muslim" are above a new app's weight class |
| Nafs: Islamic Habit Tracker | 62 | 63 | "tracker", "habit" above weight class |
| Nafs: 30 Day Islamic Planner | 62 | 65 | "planner", "day" |
| **Nafs: Islamic Planner & Dhikr** | **62** | **66** | only "planner" |

The scores are close, so this is a small edge, but it is consistent with the logic: a brand-new app should put winnable terms in the most valuable field, then **move up to "Habit Tracker" in the title once you have ratings and velocity**. "Habit tracker" still appears in the short and long description, which Google indexes.

---

## 4. Final English listing (validated)

Copy-ready files are in `store-listing/en-US/`. All three passed Applyra's Google Play policy check (`valid: true`, no warnings).

**Title** (29 of 30 characters)
```
Nafs: Islamic Planner & Dhikr
```

**Short description** (79 of 80 characters)
```
30-day Muslim routine: Quran goals, daily duas, habit streaks, journal. Offline
```
Note: Google bans price and promotional words in the short description. My first draft used "Free" and the checker rejected it. Do not add "free", "no ads" or "best" there.

**Full description:** see `store-listing/en-US/full-description.txt` (1,716 of 4,000 characters). It is written around what the app actually does. I deliberately did not claim prayer times, Qibla, audio or Quran text, because the app does not have them.

**Room to grow.** About 2,300 characters remain. Once you localise or add features, extend the description with natural repetitions of "islamic habit tracker", "muslim daily routine", "daily dua", "Ramadan preparation" and "new Muslim". Do not repeat any term more than about 4 or 5 times.

**Category.** Lifestyle (where Muslim Pro, Deen and most direct rivals sit). Habit-tracker intent is satisfied by the text, not the category.

**Contact details, privacy URL.** The app config points at `https://nafs.app/privacy`. **Confirm you own that domain.** If not, host the policy on GitHub Pages and update `extra.privacyPolicyUrl`. Google requires a live, public URL.

---

## 5. Localisation: the largest untapped lever

Your competitors are overwhelmingly English-only listings. Muslim-majority markets are less saturated and have lower difficulty scores. The earlier 9 October inspections plus today's autocomplete give these seeds:

| Market | Language | Keyword | Diff | Traffic | Notes |
|---|---|---|---|---|---|
| Turkey | tr-TR | namaz öğreniyorum | 27 | **72** | Highest traffic seen in any market |
| Turkey | tr-TR | zikir, zikirmatik | n/a | n/a | Autocomplete leaders for dhikr in Turkey |
| Indonesia | id-ID | hijrah | 45 | **63** | A cultural movement term; large audience |
| Indonesia | id-ID | belajar sholat | 33 | 32 | Learn-to-pray intent |
| Indonesia | id-ID | pengingat sholat | 37 | 25 | Prayer reminders |
| Indonesia | id-ID | ibadah tracker | n/a | n/a | Autocomplete confirms the phrase |
| Pakistan | ur-PK / en | namaz tracker | 23 | 25 | Same score in Urdu and English storefronts |
| Pakistan | ur-PK | namaz sikhne ka tarika | **14** | 25 | Very low difficulty |
| Saudi Arabia / Arab world | ar-SA | تعلم الصلاة | 20 | 25 | |
| Saudi Arabia / Arab world | ar-SA | عادات المسلم | n/a | n/a | Autocomplete: "Muslim habits" |

**Important caution.** A translated listing sends users into an English-only app. They will leave, uninstall and rate poorly, which hurts rank. So the order is:

1. Localise the **app UI** first for 2 languages (my recommendation: **Indonesian and Urdu**, or Turkish if you can find a reviewer). The content is fixed, so translation is a one-off job.
2. Have a native speaker and, for religious text, a knowledgeable reviewer check it.
3. Then publish the matching store listing.

I have not drafted these translations. Machine-translated religious copy is a risk. Ask me and I will produce drafts for review, clearly marked as drafts.

---

## 6. Store assets (the "appeal" axis, currently 43/100)

### 6.1 Done in this branch
- App icon: crescent and eight-point star on sage green, matches your theme.
- Adaptive icon, splash image, notification icon (monochrome, as Android requires).
- Play 512×512 icon and a first 1024×500 feature graphic in `store-listing/`.
- Regenerate any time with `npm run icons`.

### 6.2 Screenshots (the biggest gap: 0 of 8 minimum)

Take 8 portrait screenshots (1080×1920). One benefit per shot, short caption on top, the real UI below:

1. "Your 30-day Islamic routine, planned for you" (Today screen)
2. "Prepare for Ramadan, one day at a time" (**seasonal slot**, swap in Jan to Feb)
3. "Dhikr counter with guided adhkar" (Worship)
4. "A Quran goal you can actually finish"
5. "Build character, not just a checklist" (akhlaq goal)
6. "Four stages: Foundation to Strengthening" (Journey)
7. "Streaks and achievements that keep you going"
8. "Private, offline, no account"

Put the strongest shot first, because search results show only the first one or two.

### 6.3 Video
A 20 to 30 second YouTube video (public or unlisted, embeddable, no ads or Content ID claims) is optional but lifts conversion. Screen recording of onboarding, a task completion, the streak. No music with copyright claims.

### 6.4 Ratings
- Add a **Play In-App Review prompt** after a clear success moment: completing day 3, day 7, or a 5-day streak. **Never on launch.**
- Reply to every review (your Expo MCP has `playstore_reviews` and `playstore_reply_review`).
- Target 4.7 or higher. Under 4.0 hurts conversion sharply.

---

## 7. Launch mechanics on Google Play

### 7.1 Required before production
- Developer account ($25 one-off). **If it is a personal account created after November 2023, Google requires a closed test with at least 12 testers opted in for 14 continuous days before you may apply for production.** Confirm the current rule in Play Console. I could not verify it from here.
- Complete: store listing, Data Safety form, content rating questionnaire, target audience (13+ recommended), ads declaration (none), app category.
- **Data Safety answers for the current build:** no data collected, none shared. The app stores data locally, uses local notifications only, and has no network calls. If you later add crash reporting or analytics, update this form and the privacy policy first.

### 7.2 Release path
1. `eas build -p android --profile production` produces an AAB.
2. Create the app in Play Console and upload the **first build manually** to the internal track. (Expo's reference says `eas submit` can create the first internal release, but Google's API commonly requires the app to be fully set up in Play Console first. If submit fails, upload the first AAB by hand. The config uses `releaseStatus: draft` because Play rejects completed releases on an app that has not finished setup.)
3. Add 12+ testers to a closed test and start the 14-day clock **now**. This is the long pole.
4. After the clock completes and production access is approved, roll out gradually (10 to 20 percent, then 50 percent, then 100 percent).
5. Use Play Console **pre-launch report** and fix crashes first.

### 7.3 Play Console features worth using
- **Store listing experiments** to A/B test icon, first screenshot and short description. Change one variable at a time.
- **Custom store listings** for specific countries or campaigns (for example a Ramadan-preparation listing).
- **Android vitals**: stay under Google's bad-behaviour thresholds for crash and ANR rates (roughly 1% and 0.5% user-perceived; verify the exact numbers in Play Console) or you lose visibility.
- **Store listing acquisition reports**: shows your conversion against a peer group, which is your real benchmark.

---

## 8. The Ramadan 2027 plan (your best growth hook)

Ramadan 2027 is expected to begin around **8 February 2027** (depends on moon sighting; verify). Autocomplete already surfaces "ramadan 2027". Nafs is a 30-day programme. That is a perfect product-message match:

> **"Be Ramadan-ready in 30 days."** Start the programme on about **8 January 2027**.

| Date (approx.) | Action |
|---|---|
| Now to mid-Oct | Finish app polish, record screenshots, create Play account, start closed test |
| Late Oct to Nov | Closed test runs 14 days; collect feedback; fix bugs; localise UI (Indonesian, Urdu) |
| Late Nov to early Dec | Apply for production, staged rollout; soft launch in 3 to 5 markets; collect first 50+ reviews |
| Mid Dec | Publish localised listings; run store listing experiments |
| **8 Jan 2027** | **Launch the "Ready for Ramadan in 30 days" campaign.** Swap screenshot 2. Use a custom store listing. Push hard on social and community channels. |
| 8 Feb 2027 | Ramadan begins: ship a Ramadan update (fasting and Tarawih tasks, countdown); keep rating prompts on |
| After Ramadan | Retention season: "Next 30 days" track so the install base does not churn |

Product work needed for this: a **Ramadan Prep track** variant (reuse the existing 30-day engine with Ramadan-specific tasks: fasting practice, Quran pace, Taraweeh, sadaqah, family iftar), and a countdown on the Today screen.

---

## 9. Proposals ranked: what I would build, in order

Impact on downloads and retention versus effort. Items marked ✅ are already done in this branch.

### Must do before launch
| # | Item | Why | Effort |
|---|---|---|---|
| 1 | ✅ Real icons, splash, notification icon | Without them the app ships with a blank icon | Done |
| 2 | ✅ Local reminders: daily plan, streak-risk nudge, chosen time | Retention. Notifications are the cheapest retention lever | Done |
| 3 | ✅ Fix Share on Android (it used the web `navigator.share`, which does not exist on native), now includes the Play link | The share card is your only built-in viral loop and it did nothing on phones | Done |
| 4 | Play In-App Review prompt at success moments | Ratings feed rank and conversion | Small |
| 5 | 8 screenshots plus feature graphic | Largest gap on the appeal axis | Small to medium |
| 6 | Fix the Hijri date on the Today screen | It is off by one to two days (today it shows 3 Jumada al-Ula; the Umm al-Qura calendar says 2). A wrong religious date in a religious app invites one-star reviews. Use `Intl` with the `islamic-umalqura` calendar, tested on Hermes, or a tabular algorithm | Small |
| 7 | Fix Import Data (it relies on the web clipboard API; add `expo-clipboard`) | The privacy policy promises export and import | Small |
| 8 | Host the privacy policy at a real URL | Play requires it | Small |

### High-impact growth features (do in the first 60 days)
| # | Item | Why | Effort |
|---|---|---|---|
| 9 | **Shareable image cards** (daily hadith or "I completed Day N" as an image, via `react-native-view-shot` and `expo-sharing`) | Images spread on WhatsApp, Instagram and Telegram far better than text; each card carries your app name | Medium |
| 10 | **Ramadan Prep track and countdown** | Rides the strongest seasonal demand | Medium |
| 11 | **"Next 30 days" tracks** after day 30 (for example Quran habit, family, consistency) | Retention. The biggest churn point is day 30 when the plan ends | Medium |
| 12 | **Streak grace day / "freeze"** | Reduces rage-quits after one missed day; common in top habit apps | Small |
| 13 | **UI localisation** (Indonesian, Urdu, Turkish, Arabic with RTL) | Unlocks lower-competition markets | Medium to large |
| 14 | **Challenge a friend** (share an invite link with a started-day-N message) | Social accountability without needing a backend | Small |

### Later, only with traction
| # | Item | Note |
|---|---|---|
| 15 | Android home-screen widget (today's progress and streak) | Widgets lift daily opens, but need native code; evaluate after launch |
| 16 | Prayer times and Qibla | Table stakes for the giants, but costly (location permission, calculation methods, accuracy liability, Data Safety changes). **I would not build this first.** Differentiate on the programme instead |
| 17 | Backend sync / accounts | Breaks your "offline, no account" promise and your Data Safety simplicity. Only add for a strong reason |
| 18 | Optional paid tier (e.g. extra tracks, themes) | You said free; keep ads out of a worship app. Revisit only if you need revenue |

---

## 10. Getting downloads every day

Google Play ranks velocity, so the goal is **steady daily installs from many sources**, not one spike.

### 10.1 Free channels (start in launch week)
- **Community seeding.** Mosque WhatsApp and Telegram groups, university MSAs, Reddit communities where self-promotion is allowed (read each rule first; do not spam), Facebook groups. Offer the "30-day challenge" as a group activity.
- **Creators.** Muslim lifestyle and reminder creators on TikTok, Instagram and YouTube. Offer early access and a group challenge, not a payment ask.
- **A simple landing page** with a Play badge and a short demo, plus Open Graph tags so shared links look good. It also gives search engines a page to index.
- **Short-form video.** "Day 1 of 30" content: a different task each day. This format repeats well.
- **Referral through the app itself:** the share card (item 3, 9) and the friend challenge (item 14).

### 10.2 Paid, only after the listing converts
- Google App campaigns can buy installs; start small and only after your conversion rate (Play Console) is healthy and ratings are above 4.5. Cost per install varies widely by country, so test with a small budget in 2 to 3 markets rather than relying on a number from me.
- Paid installs help rank only if those users stay. Judge campaigns on day-7 retention, not install count.

### 10.3 Weekly operating rhythm
| Cadence | Task |
|---|---|
| Daily | Reply to new reviews; check Android vitals (crash, ANR); post one piece of content |
| Weekly | Review store listing conversion and top search terms; run or read the current store listing experiment; ship a small fix |
| Every 2 to 3 weeks | Release an update with meaningful "What's new" text (updates are a ranking signal and a reason to re-engage) |
| Monthly | Refresh keywords (Applyra), review competitors' listings, plan the next localisation |
| Per season | Ramadan, Muharram, Hajj, Eid: prepare a custom listing and content two to four weeks ahead |

### 10.4 Metrics to watch (targets are hypotheses to validate)
| Metric | Where | Why |
|---|---|---|
| Store listing visitors → installs | Play Console | Listing quality. Compare with the peer-group benchmark Google shows |
| Keyword ranks for your tier-1 terms | Applyra (track once the app is live) | Whether the text is working |
| Day-1, day-7, day-30 retention | Play Console | The real ranking driver |
| Uninstalls per active user | Play Console | Early quality warning |
| Crash and ANR rate | Android vitals | Penalty threshold |
| Rating and review count | Play Console | Conversion and trust |

**After the app is live:** add it to Applyra with `add_application`, then track the tier-1 keywords and your competitors. I can set that up when the Play link exists. It is not possible before then.

---

## 11. Compliance checklist (religious-content apps)

- [ ] **Scholarly review** of Quran, hadith and dua content, with sources cited in the UI. The data already has `source` fields.
- [ ] No medical, therapeutic or guaranteed-outcome claims.
- [ ] Do not use competitor names (Muslim Pro, Athan, etc.) in the listing or keywords.
- [ ] No "best", "#1", "free", or "no ads" in the title or short description (Google rejects price and promotional claims).
- [ ] Data Safety matches reality: no data collected; update before adding any SDK.
- [ ] Privacy policy URL is live and matches the app (I removed the claim about a PIN, which the app does not have, and added a line about local notifications).
- [ ] Content rating questionnaire completed honestly.
- [ ] Target audience is not children; if you ever target under-13s, a stricter policy applies.
- [ ] Name check: search Play and trademark databases for "Nafs" conflicts.
- [ ] Keep the signing keystore and `google-service-account.json` out of git (the latter is now in `.gitignore`).

---

## 12. Risks and unknowns

| Risk | Detail |
|---|---|
| Crowded niche | "Muslim habit tracker" has many entrants; new brand names appear in autocomplete. Speed and ratings matter. |
| No prayer times | Many users expect them. Position Nafs as a *companion* to a prayer-time app, not a replacement, until you decide otherwise. |
| English-only content | Limits reach in the markets with the lowest competition. |
| Seasonal spike | Ramadan traffic is large but short. The "Next 30 days" tracks are what keep users after it. |
| First-upload and 12-tester rules | Policies change; confirm in Play Console before committing to dates. |
| My data limits | Applyra scores are relative, US-focused unless stated, and traffic floors at 8. No numbers here are guarantees. Download and install forecasts are deliberately not given. |
| Not verified here | I did not run the app on a device or emulator, did not build with EAS, and did not test notification delivery on a phone. Typecheck and lint pass and an Android prebuild succeeds, but device testing is needed. |

---

## 13. Appendix: what changed in the repository

- **Icons and splash:** generated by `scripts/generate-icons.py` (`npm run icons`). Removed the old placeholder generator, which would have overwritten real icons.
- **`eas.json`:** development, preview (APK) and production (AAB, auto-increment) profiles, plus a Play submit profile (internal track, draft).
- **`app.json`:** removed the invalid `NOTIFICATIONS` permission (now `POST_NOTIFICATIONS`, `VIBRATE`); blocked storage and `SYSTEM_ALERT_WINDOW` permissions that were being merged in; added a proper splash config; removed fixed `versionCode` and `buildNumber` (EAS manages them remotely).
- **Dependencies removed:** `@supabase/supabase-js`, `expo-camera`, `react-native-webview`, `expo-secure-store`, `react-native-url-polyfill` (none were used).
- **Notifications:** `lib/notifications.ts`. Daily reminder for the next 7 days (names that day's theme), one evening streak nudge that moves to tomorrow once you finish a task, resynced on app start, foreground and task changes. The permission prompt appears at the end of onboarding and when enabling a toggle in Settings. The "Prayer reminders" toggle was removed because real prayer times are not supported.
- **Settings:** reminder time chips; export now works on Android.
- **Today screen:** Share now works on Android and includes the Play link.
- **Privacy, help and terms text:** removed references to a PIN that does not exist.

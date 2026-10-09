# Awdah: Islamic Content Verification

Scope: `constants/islamicContent.ts` (THIRTY_DAY_PLANS: the `hadith` for each day, `sunnahPractice`, and `prayerFocus` duas/tips that make hadith claims) and `constants/duas.ts`. Repo files were not modified.

## Method and numbering (please read first)

- **sunnah.com could not be reached.** curl hit a Cloudflare challenge and WebFetch returned HTTP 403. Instead I checked texts and gradings against the **fawazahmed0 hadith-api dataset** (cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1), which reproduces sunnah.com's English and Arabic texts and its grading fields (al-Albani, Shu'ayb al-Arna'ut, Zubair Ali Za'i, Ahmad Shakir, Bashar 'Awwad). I looked up every number marked "verified" below and read its text.
- **Numbering**
  - Bukhari, Abu Dawud, Tirmidhi, Nasa'i and Ibn Majah use the standard numbers that sunnah.com shows (for example `bukhari:6464`, `tirmidhi:2910`).
  - Muslim uses the **Abd al-Baqi** number, which is what sunnah.com shows as "Sahih Muslim 1907a" and so on. Suffixes (a/b) are left out.
  - Ahmad uses the **Risalah (Arna'ut) edition** numbers. Ahmad, Tabarani, al-Hakim and the al-Albani Silsilah numbers are not in the dataset, so I checked them only through secondary sites (dorar.net mirrors, surahquran.com, hadithanswers). These are marked **[secondary-verified]**.
- Confidence is **H** (high: text and number checked) or **M** (medium: number from a secondary source, or a grading that scholars dispute).
- Verdicts:
  - **KEEP**: text and source are fine; at most a small wording polish.
  - **FIX**: the reference, wording or attribution needs correcting, but the narration itself is authentic.
  - **REPLACE**: the item is weak, fabricated, unsourced or misapplied; an authentic replacement on the same theme is given.
  - **REMOVE**: delete with no replacement.

## Summary counts

| Area | Items | KEEP | FIX | REPLACE | REMOVE |
|---|---|---|---|---|---|
| Day `hadith` (1-30) | 30 | 22 | 4 | 4 | 0 |
| `sunnahPractice` (1-30) | 30 | 13 | 11 | 6 | 0 |
| `prayerFocus` duas and hadith-bearing tips | 15 | 12 | 3 | 0 | 0 |
| `duas.ts` | 17 | 12 | 2 | 3 | 0 |
| Structural (tasbih counts, Surah 41 name) | 2 | 0 | 2 | 0 | 0 |
| **Total** | **94** | **59** | **22** | **13** | **0** |

All 12 issues the audit flagged are resolved below. Three extra problems turned up:
- Day 22's "Seeking knowledge is an obligation" is graded *very weak* in the Ibn Majah 224 narration as a whole.
- Day 21 and Day 28's "most beneficial to people" is disputed.
- Day 14's "2 rakah Salat al-Shukr was a practice of the Prophet ﷺ" is not established. Only *sujud* al-shukr is established.

---

## Day-by-day: the `hadith` field

### Day 1: Niyyah (L46)
- **Current:** "Actions are judged by intentions, and each person will be rewarded according to their intention." (Bukhari & Muslim)
- **Verdict:** KEEP (small wording polish) · **Grade:** Sahih (agreed upon) · **Ref:** Bukhari 1; Muslim 1907 · **Confidence:** H
- **Arabic:** إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى
- **Meaning:** "Actions are only by intentions, and each person will only have what he intended."

### Day 2: Taharah (L99)
- **Current:** "Cleanliness is half of faith." (Muslim)
- **Verdict:** KEEP (add Arabic) · **Grade:** Sahih · **Ref:** Muslim 223 (Abu Malik al-Ash'ari) · **Confidence:** H
- **Arabic:** الطُّهُورُ شَطْرُ الإِيمَانِ
- **Meaning:** "Purification is half of faith."

### Day 3: Salah (L150)
- **Current:** "The first matter... is the prayer. If it is sound, then the rest of his deeds will be sound..." (At-Tabarani)
- **Verdict:** FIX. Cite the sunan wording, which is graded sahih. · **Grade:** Sahih (al-Albani); Tirmidhi: hasan gharib · **Ref:** Tirmidhi 413 (also Abu Dawud 864, Nasa'i 465) · **Confidence:** H for Tirmidhi 413; the Abu Dawud and Nasa'i numbers are from memory and were not looked up.
- **Arabic:** إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاَتُهُ، فَإِنْ صَلَحَتْ فَقَدْ أَفْلَحَ وَأَنْجَحَ، وَإِنْ فَسَدَتْ فَقَدْ خَابَ وَخَسِرَ
- **Meaning:** "The first of his deeds for which a servant will be called to account on the Day of Resurrection is his prayer. If it is sound, he has succeeded and prospered; if it is corrupt, he has failed and lost."
- **Note:** The "rest of his deeds will be sound" wording is Tabarani's (al-Awsat), which al-Albani graded sahih in Sahih al-Jami'. I did not verify that number, so use Tirmidhi 413.

### Day 4: Fajr (L203)
- **Current:** "Whoever prays the dawn prayer is then under the protection of Allah." (Muslim)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Muslim 657 (Jundab) · **Confidence:** H
- **Arabic:** مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ
- **Meaning:** "Whoever prays Subh (Fajr) is under the protection of Allah."

### Day 5: Khushu' (L255)
- **Current:** "Pray as you have seen me pray." (Bukhari)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Bukhari 631 (Malik ibn al-Huwayrith) · **Confidence:** H
- **Arabic:** صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي
- **Meaning:** "Pray as you have seen me praying."

### Day 6: Quran (L303)
- **Current:** One letter brings a good deed multiplied ten times; Alif-Lam-Mim. (At-Tirmidhi)
- **Verdict:** KEEP · **Grade:** Tirmidhi: hasan sahih gharib; al-Albani: sahih · **Ref:** Tirmidhi 2910 · **Confidence:** H
- **Arabic:** مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا، لاَ أَقُولُ الم حَرْفٌ، وَلَكِنْ أَلِفٌ حَرْفٌ وَلاَمٌ حَرْفٌ وَمِيمٌ حَرْفٌ
- **Meaning:** As in the current text. It is accurate.

### Day 7: Tawbah (L353)
- **Current:** "By Allah, I seek Allah's forgiveness and turn to Him in repentance more than seventy times a day." (Bukhari)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Bukhari 6307 · **Confidence:** H
- **Arabic:** وَاللَّهِ إِنِّي لأَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ فِي الْيَوْمِ أَكْثَرَ مِنْ سَبْعِينَ مَرَّةً

### Day 8: Dhikr (L403)
- **Current:** The one who remembers Allah and the one who does not are like the living and the dead. (Bukhari)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Bukhari 6407 (Abu Musa) · **Confidence:** H
- **Arabic:** مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لاَ يَذْكُرُ رَبَّهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ

### Day 9: Sunnah (L450)
- **Current:** "None of you believes until I am more beloved to him than his father, his child, and all of mankind." (Bukhari)
- **Verdict:** KEEP (optionally add Muslim) · **Grade:** Sahih · **Ref:** Bukhari 15; Muslim 44 · **Confidence:** H
- **Arabic:** لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى أَكُونَ أَحَبَّ إِلَيْهِ مِنْ وَالِدِهِ وَوَلَدِهِ وَالنَّاسِ أَجْمَعِينَ

### Day 10: Du'a (L501). AUDIT ITEM
- **Current:** "Du'a is the weapon of the believer, the pillar of religion, and the light of the heavens and earth." (Al-Hakim)
- **Verdict:** **REPLACE** · **Grade of current:** al-Albani: *mawdu'* (fabricated), Silsilah ad-Da'ifah 179 and Da'if al-Jami' 3001 [secondary-verified]. Al-Haythami says a narrator is *matruk* (abandoned). A minority graded it higher, but it should not be quoted as a hadith.
- **Replacement:** "Du'a is worship." · **Grade:** Tirmidhi: hasan sahih; al-Albani and al-Arna'ut: sahih · **Ref:** Tirmidhi 2969; Abu Dawud 1479 · **Confidence:** H
- **Arabic:** الدُّعَاءُ هُوَ الْعِبَادَةُ، ثُمَّ قَرَأَ: ﴿وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ﴾
- **Meaning:** "Supplication is worship itself." Then he recited: "And your Lord says: Call upon Me; I will respond to you" (Ghafir 40:60).

### Day 11: Sadaqah (L548)
- **Current:** "Charity does not decrease wealth, and the servant who forgives, Allah increases him in honour." (Muslim)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Muslim 2588 · **Confidence:** H
- **Arabic:** مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلاَّ عِزًّا

### Day 12: Halal Rizq (L597). AUDIT ITEM
- **Current:** "It is obligatory upon every Muslim to seek lawful sustenance." (Tabarani)
- **Verdict:** **REPLACE** · **Grade of current:** weak and widely unestablished. I found no authentic chain, and the web search did not confirm the Tabarani attribution.
- **Replacement:** "Allah is Good and accepts only what is good." · **Grade:** Sahih · **Ref:** Muslim 1015 (Abu Hurayrah) · **Confidence:** H
- **Arabic:** أَيُّهَا النَّاسُ، إِنَّ اللَّهَ طَيِّبٌ لاَ يَقْبَلُ إِلاَّ طَيِّبًا
- **Meaning:** "O people, Allah is Good and accepts only what is good." The rest of this hadith, about the traveller whose food is haram and whose du'a is not answered, also fits the theme.
- **Alternative:** Bukhari 2072: «مَا أَكَلَ أَحَدٌ طَعَامًا قَطُّ خَيْرًا مِنْ أَنْ يَأْكُلَ مِنْ عَمَلِ يَدِهِ», "No one has ever eaten better food than what he earned with his own hands." (H)

### Day 13: Tawakkul (L645)
- **Current:** Rely on Allah as He deserves and you would be provided for like the birds. (At-Tirmidhi)
- **Verdict:** KEEP · **Grade:** Tirmidhi: hasan sahih; al-Albani: sahih · **Ref:** Tirmidhi 2344 (Umar) · **Confidence:** H
- **Arabic:** لَوْ أَنَّكُمْ كُنْتُمْ تَوَكَّلُونَ عَلَى اللَّهِ حَقَّ تَوَكُّلِهِ لَرُزِقْتُمْ كَمَا تُرْزَقُ الطَّيْرُ، تَغْدُو خِمَاصًا وَتَرُوحُ بِطَانًا

### Day 14: Shukr (L694)
- **Current:** "Look at those below you... more suitable that you do not belittle the favors of Allah." (Bukhari & Muslim)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Muslim 2963 (this exact wording); Bukhari 6490 (shorter wording) · **Confidence:** H
- **Arabic:** انْظُرُوا إِلَى مَنْ أَسْفَلَ مِنْكُمْ وَلاَ تَنْظُرُوا إِلَى مَنْ هُوَ فَوْقَكُمْ، فَهُوَ أَجْدَرُ أَنْ لاَ تَزْدَرُوا نِعْمَةَ اللَّهِ عَلَيْكُمْ

### Day 15: Sidq (L742)
- **Current:** "Truthfulness leads to righteousness..." (Bukhari & Muslim)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Bukhari 6094; Muslim 2607 · **Confidence:** H
- **Arabic:** إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ...

### Day 16: Amanah (L789)
- **Current:** "Return the trust to the one who entrusted you, and do not betray the one who betrayed you." (Abu Dawud & At-Tirmidhi)
- **Verdict:** KEEP · **Grade:** al-Albani: hasan sahih; Tirmidhi: hasan gharib; Shu'ayb al-Arna'ut and Zubair Ali Za'i: da'if · **Ref:** Abu Dawud 3535; Tirmidhi 1264 · **Confidence:** M (grading disputed)
- **Arabic:** أَدِّ الأَمَانَةَ إِلَى مَنِ ائْتَمَنَكَ، وَلاَ تَخُنْ مَنْ خَانَكَ
- **Safer alternative if you want an agreed-upon text:** Bukhari 33 and Muslim 59 (signs of the hypocrite: «وَإِذَا اؤْتُمِنَ خَانَ»). But Day 16's sunnahPractice already uses that hadith.

### Day 17: Sabr (L838)
- **Current:** "How wonderful the affair of the believer..." (Muslim)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Muslim 2999 (Suhayb) · **Confidence:** H
- **Arabic:** عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ...

### Day 18: Tawadu' (L885)
- **Current:** "Allah has revealed to me that you must be humble towards one another..." (Muslim)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Muslim 2865 ('Iyad ibn Himar) · **Confidence:** H
- **Arabic:** إِنَّ اللَّهَ أَوْحَى إِلَىَّ أَنْ تَوَاضَعُوا حَتَّى لاَ يَفْخَرَ أَحَدٌ عَلَى أَحَدٍ وَلاَ يَبْغِي أَحَدٌ عَلَى أَحَدٍ

### Day 19: Rahmah (L934)
- **Current:** "Be merciful to others and you will receive mercy. Forgive others and Allah will forgive you." (Ahmad)
- **Verdict:** FIX (add a number), or optionally upgrade to the sunan text below · **Grade:** al-Albani: sahih (Sahih al-Jami' 897; as-Sahihah 482); al-Mundhiri: isnad jayyid · **Ref:** Ahmad 6541; al-Adab al-Mufrad 380 [secondary-verified] · **Confidence:** M
- **Arabic:** ارْحَمُوا تُرْحَمُوا، وَاغْفِرُوا يُغْفَرْ لَكُمْ
- **Recommended upgrade (H):** Tirmidhi 1924. Tirmidhi: hasan sahih; al-Albani: sahih.
  - **Arabic:** الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ
  - **Meaning:** "The merciful are shown mercy by the Most Merciful. Be merciful to those on earth and the One above the heavens will have mercy on you."

### Day 20: Silat ar-Rahim (L982)
- **Current:** "Whoever wishes to have his provision expanded and his lifespan extended, let him maintain family ties." (Bukhari & Muslim)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Bukhari 5986; Muslim 2557 · **Confidence:** H
- **Arabic:** مَنْ سَرَّهُ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، أَوْ يُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ

### Day 21: Husn al-Khuluq (L1030). AUDIT ITEM (inconsistent sourcing)
- **Current:** "The most beloved of people to Allah is the one who is most beneficial to others." (At-Tabarani)
- **Verdict:** **REPLACE** · **Grade of current:** disputed. Al-Albani graded a route hasan (as-Sahihah). Al-Dhahabi judged another route fabricated, and several contemporary checkers (islamweb, dorar summary) say it is weak [secondary-verified]. Under Awdah's "never attribute weak" standard, do not use it.
- **Replacement:** "The best of you are those best in character." · **Grade:** Sahih (agreed upon) · **Ref:** Bukhari 3559; Muslim 2321 ('Abdullah ibn 'Amr) · **Confidence:** H
- **Arabic:** إِنَّ مِنْ خِيَارِكُمْ أَحْسَنَكُمْ أَخْلاَقًا
- **Meaning:** "Indeed, among the best of you are those with the best character."
- **Alternative (H):** Tirmidhi 2002. Tirmidhi: hasan sahih; al-Albani: sahih.
  - **Arabic:** مَا شَيْءٌ أَثْقَلُ فِي مِيزَانِ الْمُؤْمِنِ يَوْمَ الْقِيَامَةِ مِنْ خُلُقٍ حَسَنٍ
  - **Meaning:** "Nothing is heavier on the believer's scale on the Day of Resurrection than good character."

### Day 22: Ilm (L1078)
- **Current:** "For whoever travels a path seeking knowledge, Allah will make easy for him a path to Paradise." (Muslim)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Muslim 2699 · **Confidence:** H
- **Arabic:** وَمَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ

### Day 23: Tafakkur (L1125). AUDIT ITEM
- **Current:** "One hour of reflection is better than seventy years of worship." (Various)
- **Verdict:** **REPLACE** · **Grade of current:** no basis as a saying of the Prophet ﷺ. The closest report is a *mawquf* saying of Abu ad-Darda' (Bayhaqi, Shu'ab): «تَفَكُّرُ سَاعَةٍ خَيْرٌ مِنْ قِيَامِ لَيْلَةٍ» ("an hour's reflection is better than a night of prayer"). The "seventy years" wording has no authentic chain.
- **Replacement (a report of the Prophet's practice):** Bukhari 4569 (Ibn 'Abbas) · **Grade:** Sahih · **Confidence:** H
- **Meaning:** "When it was the last third of the night, he got up, looked towards the sky and recited: 'Indeed, in the creation of the heavens and the earth and the alternation of night and day are signs for those of understanding' (Al 'Imran 3:190)."
- **Arabic (key portion):** ...قَعَدَ فَنَظَرَ إِلَى السَّمَاءِ فَقَالَ: ﴿إِنَّ فِي خَلْقِ السَّمَوَاتِ وَالأَرْضِ وَاخْتِلاَفِ اللَّيْلِ وَالنَّهَارِ لآيَاتٍ لأُولِي الأَلْبَابِ﴾
- **Note:** I tried to verify the commonly quoted "Woe to whoever recites it [3:190] and does not reflect on it" (Ibn Hibban) and could not, so I do not recommend it.

### Day 24: Zuhd (L1172)
- **Current:** "Be in this world as if you were a stranger or a wayfarer, and consider yourself one of the inhabitants of the grave." (Bukhari)
- **Verdict:** FIX. Bukhari 6416 does **not** contain the "inhabitants of the grave" clause; that addition is in Tirmidhi. · **Grade:** Sahih · **Ref:** either trim the text to the Bukhari 6416 wording, or keep the full text and cite Tirmidhi 2333 (al-Albani: sahih) · **Confidence:** H
- **Arabic (Bukhari):** كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ
- **Arabic (Tirmidhi addition):** وَعُدَّ نَفْسَكَ فِي أَهْلِ الْقُبُورِ

### Day 25: Ikhlas (L1219)
- **Current:** "Allah does not accept any deed except that which is done purely for His sake." (An-Nasa'i)
- **Verdict:** KEEP (add the number) · **Grade:** al-Albani and Abu Ghuddah: hasan sahih · **Ref:** Nasa'i 3140 (Abu Umamah) · **Confidence:** H
- **Arabic:** إِنَّ اللَّهَ لاَ يَقْبَلُ مِنَ الْعَمَلِ إِلاَّ مَا كَانَ لَهُ خَالِصًا وَابْتُغِيَ بِهِ وَجْهُهُ
- **Meaning:** "...except what is purely for Him and by which His Face is sought."

### Day 26: Muraqabah (L1267)
- **Current:** Ihsan: worship Allah as if you see Him... (Bukhari & Muslim)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Bukhari 50; Muslim 8 · **Confidence:** H
- **Arabic:** أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ

### Day 27: Tawbah Nasuha (L1315)
- **Current:** Allah is more joyful at the repentance... than one who found his lost camel in the desert. (Bukhari & Muslim)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Bukhari 6309; Muslim 2747 · **Confidence:** H
- **Arabic:** لَلَّهُ أَفْرَحُ بِتَوْبَةِ عَبْدِهِ مِنْ أَحَدِكُمْ سَقَطَ عَلَى بَعِيرِهِ وَقَدْ أَضَلَّهُ فِي أَرْضِ فَلاَةٍ

### Day 28: Ummah (L1363)
- **Current:** "The believer to the believer is like a building..." (Bukhari)
- **Verdict:** KEEP (optionally add Muslim) · **Grade:** Sahih · **Ref:** Bukhari 481; Muslim 2585 · **Confidence:** H
- **Arabic:** الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا

### Day 29: Da'wah (L1411)
- **Current:** "Convey from me, even if it is one verse." (Bukhari)
- **Verdict:** KEEP · **Grade:** Sahih · **Ref:** Bukhari 3461 · **Confidence:** H
- **Arabic:** بَلِّغُوا عَنِّي وَلَوْ آيَةً

### Day 30: Istiqamah (L1460)
- **Current:** "When Abu Amr (Sufyan ibn Abdullah) asked... Say: I believe in Allah, then be steadfast." (Muslim)
- **Verdict:** FIX (text formatting only). The `text` field currently holds narration framing, not a quote. Set `text` to the hadith itself and move the framing to a note. · **Grade:** Sahih · **Ref:** Muslim 38 · **Confidence:** H
- **Arabic:** قُلْ آمَنْتُ بِاللَّهِ، ثُمَّ اسْتَقِمْ
- **Meaning:** "Say: 'I believe in Allah,' and then remain steadfast." (Said to Sufyan ibn 'Abdullah ath-Thaqafi.)

---

## `sunnahPractice` quotes and claims (days 1-30)

| Day | Line | Current claim | Verdict | Grade and reference | Confidence |
|---|---|---|---|---|---|
| 1 | 31 | "Any important matter not begun with Bismillah is cut off" (Ibn Majah) | **REPLACE** | Weak. Ibn Majah 1894 is actually the *bi-l-hamd* wording, and al-Albani, Abd al-Baqi and Za'i all grade it da'if (verified). The Bismillah wording is also weak. See the replacement below. | H |
| 2 | 86 | Siwak at every prayer (Bukhari) | KEEP. Polish "the believers" to "my ummah / the people". | Bukhari 887; Muslim 252. Arabic: لَوْلاَ أَنْ أَشُقَّ عَلَى أُمَّتِي لأَمَرْتُهُمْ بِالسِّوَاكِ مَعَ كُلِّ صَلاَةٍ | H |
| 3 | 136 | 12 sunnah rak'ahs, with the breakdown (Muslim) | FIX-REFERENCE | The virtue is in Muslim 728. The breakdown (4 before Dhuhr, 2 after, 2 after Maghrib, 2 after Isha, 2 before Fajr) is from **Tirmidhi 415** (hasan sahih; al-Albani: sahih). Cite "Muslim 728; Tirmidhi 415". | H |
| 4 | 190 | Two rak'ahs of Fajr are better than the world; rub the face on waking (Muslim) | KEEP | Muslim 725: رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا. Wiping sleep from the face: Bukhari 183 (يَمْسَحُ النَّوْمَ عَنْ وَجْهِهِ بِيَدِهِ). | H |
| 5 | 242 | Lengthy sujood; say "SubhanAllahi Rabbil-A'la **7-10 times**" (Muslim) | FIX | No authentic count of 7-10 exists. Say "repeat Subhana Rabbiyal-A'la" (Muslim 772, Hudhayfah), and note that his sujood in night prayer lasted as long as reciting 50 verses (Bukhari 1123). Also fix the transliteration: "Subhana Rabbiyal-A'la". | H |
| 6 | 290 | "The best of you learn the Quran and teach it" (Bukhari) | KEEP | Bukhari 5027: خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ | H |
| 7 | 341 | Sayyid al-Istighfar: whoever says it with certainty and dies... Paradise (Bukhari) | KEEP | Bukhari 6306 | H |
| 8 | 390 | Tasbih "(33+33+34)" | FIX | See the structural note below. | H |
| 9 | 438 | Eating sunnahs (Bukhari & Muslim) | FIX-REFERENCE (list per item) | Bismillah, right hand, eat from what is near: Bukhari 5376 / Muslim 2022. Never criticised food: Bukhari 5409 / Muslim 2064. Licking fingers: Muslim 2031, 2033. Eating together: **Abu Dawud 3764** (al-Albani: hasan; al-Arna'ut: hasan li-ghayrihi; Za'i: da'if). Praise after eating: Muslim 2734. | H (M for the eating-together item) |
| 10 | 489 | Dua acceptance times (Bukhari & Muslim). AUDIT ITEM | FIX-REFERENCE (de-attribute) | Last third of the night: Bukhari 1145. Between adhan and iqamah: Abu Dawud 521 / Tirmidhi 212 (sahih). Sujood: Muslim 482. End of the obligatory prayers: Tirmidhi 3499 (hasan). Friday hour: Bukhari 935, and "last hour after 'Asr": Abu Dawud 1048 / Nasa'i 1389 (sahih). **Breaking the fast:** Tirmidhi 3598 is graded da'if by al-Albani and Shakir, so drop it or soften it. **Rain:** not verified, so drop it. Change the source to "Various (Bukhari, Muslim, Abu Dawud, Tirmidhi)". | H |
| 11 | 535 | Sadaqah jariyah continues after death (Muslim) | KEEP | Muslim 1631: إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ: صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ. The list of examples (tree, masjid, etc.) is the app's own illustration, which is fine. | H |
| 12 | 583 | Ibrahim's dua (14:37) plus "Al-Waqi'ah's last 3 verses (56:95-96)... protects from poverty". AUDIT ITEM | **REPLACE** | The Waqi'ah narration is weak. Ahmad called it munkar, Ibn Baz weak, al-Albani da'if (Da'if at-Targhib 977; the Silsilah ad-Da'ifah number is reported as 289 or 290) [secondary-verified]. It is also mis-cited: it concerns the whole surah, and 95-96 are 2 verses, not 3. 14:37 is not a provision dua as such. See the replacement below. | H |
| 13 | 632 | "Tie your camel, then trust" (Tirmidhi) | KEEP | Tirmidhi 2517: اعْقِلْهَا وَتَوَكَّلْ. Tirmidhi: gharib; al-Albani: hasan; Za'i: hasan. | M (hasan by supporting routes) |
| 14 | 680 | "He who does not thank people does not thank Allah" (Abu Dawud) | KEEP | Abu Dawud 4811 (sahih); Tirmidhi 1954 (hasan sahih): لاَ يَشْكُرُ اللَّهَ مَنْ لاَ يَشْكُرُ النَّاسَ | H |
| 15 | 728 | Known as Al-Amin before prophethood (Bukhari) | FIX-REFERENCE | The title "al-Amin" comes from the Seerah (Ibn Ishaq; also reported in Ahmad, number not verified), not from Bukhari. Bukhari 4770 shows Quraysh saying «مَا جَرَّبْنَا عَلَيْكَ إِلاَّ صِدْقًا» ("We have never experienced anything from you but truthfulness"). Use that, or cite the source as "Seerah". | H for Bukhari 4770 |
| 16 | 776 | Hypocrite breaks promises (Bukhari & Muslim) | KEEP | Bukhari 33; Muslim 59: آيَةُ الْمُنَافِقِ ثَلاَثٌ: إِذَا حَدَّثَ كَذَبَ، وَإِذَا وَعَدَ أَخْلَفَ، وَإِذَا اؤْتُمِنَ خَانَ | H |
| 17 | 824 | "The strong man... controls himself when angry"; say A'udhu billah; change position (Bukhari) | KEEP (add refs) | Bukhari 6114 / Muslim 2609: لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ. Isti'adhah: Bukhari 6115. Sit or lie down: Abu Dawud 4782 (sahih). | H |
| 18 | 872 | He greeted everyone first, including children (Bukhari) | FIX-REFERENCE | Greeting children: Bukhari 6247 / Muslim 2168. "Those nearest to Allah are those who begin with salam": Abu Dawud 5197 (sahih): إِنَّ أَوْلَى النَّاسِ بِاللَّهِ مَنْ بَدَأَهُمْ بِالسَّلاَمِ. The claim that he greeted "the poor and the old" first is not a quoted text, so soften it. | H |
| 19 | 920 | Woman and the cat; man and the thirsty dog (Bukhari) | KEEP | Cat: Bukhari 3482 / Muslim 2242. Dog, "Allah thanked him and admitted him to Paradise": Bukhari 173 / Muslim 2244. | H |
| 20 | 968 | The true maintainer of ties... (Bukhari) | KEEP | Bukhari 5991: لَيْسَ الْوَاصِلُ بِالْمُكَافِئِ، وَلَكِنِ الْوَاصِلُ الَّذِي إِذَا قُطِعَتْ رَحِمُهُ وَصَلَهَا | H |
| 21 | 1016 | "Smiling in the face of your brother is charity"; "always smiling" (Tirmidhi) | FIX-REFERENCE | Tirmidhi 1956 (Tirmidhi: hasan gharib; al-Albani: sahih): تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ. Change "always smiling" to "no one smiled more than him" (Tirmidhi 3641, al-Albani: sahih): مَا رَأَيْتُ أَحَدًا أَكْثَرَ تَبَسُّمًا مِنْ رَسُولِ اللَّهِ ﷺ | H |
| 22 | 1064 | "Seeking knowledge is an obligation upon every Muslim" (Ibn Majah) | **REPLACE** (preferred) | The Ibn Majah 224 narration as a whole is graded **very weak** by al-Albani, al-Arna'ut and Abd al-Baqi (verified). Al-Albani separately graded the first sentence sahih through multiple routes, but there is real dispute. Replacement below. | H |
| 23 | 1112 | "Companions walked in nature to increase faith" (Various). AUDIT ITEM | **REPLACE** | Unsourced. Replacement below. | H |
| 24 | 1159 | "Be in this world as a stranger..." (Bukhari) | KEEP (optional swap) | Bukhari 6416 is authentic, but it duplicates the Day 24 hadith. A better fit for a digital detox is Bukhari 6412: نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ, "Two blessings many people are cheated of: health and free time." Or Tirmidhi 2317 (al-Albani: sahih): مِنْ حُسْنِ إِسْلاَمِ الْمَرْءِ تَرْكُهُ مَا لاَ يَعْنِيهِ, "Part of the excellence of a person's Islam is leaving what does not concern him." | H |
| 25 | 1206 | Riya is the minor shirk (Ahmad) | FIX-REFERENCE | Ahmad 23630 (Mahmud ibn Labid): إِنَّ أَخْوَفَ مَا أَخَافُ عَلَيْكُمُ الشِّرْكُ الأَصْغَرُ... الرِّيَاءُ. Al-Albani: sahih (Sahih al-Jami' 1555; Sahih at-Targhib 32); al-Arna'ut: hasan [secondary-verified]. | M |
| 26 | 1253 | Umar: "Hold yourselves accountable..." (source "Umar ibn al-Khattab"). AUDIT ITEM | FIX (label as athar) | Set the source to "Athar (saying) of 'Umar ibn al-Khattab, not a hadith. Cited by at-Tirmidhi under no. 2459". The Arabic was verified in Tirmidhi's commentary: حَاسِبُوا أَنْفُسَكُمْ قَبْلَ أَنْ تُحَاسَبُوا، وَتَزَيَّنُوا لِلْعَرْضِ الأَكْبَرِ. **Do not** pair it with the "al-kayyis man dana nafsah" hadith (Tirmidhi 2459), which al-Albani and Shakir grade **da'if** (verified). | H |
| 27 | 1300 | "Ghusl of Tawbah... Sunnah as part of tawbah from major sins" (Abu Dawud). AUDIT ITEM | **REPLACE** | Misapplied. Abu Dawud 355 is about Qays ibn 'Asim being told to bathe **upon accepting Islam** (verified); it is not about repentance. Replacement below. | H |
| 28 | 1349 | "The best of people are those most beneficial to people" (Al-Hakim). AUDIT ITEM | **REPLACE** | Inconsistent with Day 21 and the grading is disputed. Replacement below. | H |
| 29 | 1397 | Character as da'wah (Various) | FIX-REFERENCE | No quote is given. Anchor it with Bukhari 3009 / Muslim 2406: لأَنْ يَهْدِيَ اللَّهُ بِكَ رَجُلاً وَاحِدًا خَيْرٌ لَكَ مِنْ أَنْ يَكُونَ لَكَ حُمْرُ النَّعَمِ, "That Allah guides one man through you is better for you than red camels." | H |
| 30 | 1446 | "Most beloved deeds are the most consistent even if small" (Bukhari) | KEEP (add Muslim) | Bukhari 6464: وَأَنَّ أَحَبَّ الأَعْمَالِ أَدْوَمُهَا إِلَى اللَّهِ وَإِنْ قَلَّ. Muslim 782 (see the open doubt about 782 vs 783). | H (Bukhari) / M (Muslim number) |

### SunnahPractice replacements (full fields)

**Day 1: replaces the Bismillah "cut off" quote**
- **Description quote:** "The Prophet ﷺ said to a boy: 'Mention the name of Allah, eat with your right hand, and eat from what is in front of you.'"
- **Ref:** Bukhari 5376; Muslim 2022 · **Grade:** Sahih · **Confidence:** H
- **Arabic:** يَا غُلاَمُ، سَمِّ اللَّهَ، وَكُلْ بِيَمِينِكَ، وَكُلْ مِمَّا يَلِيكَ
- **Optional second line:** On entering the home and eating, mentioning Allah's name denies Shaytan a place to stay and dinner (Muslim 2018): إِذَا دَخَلَ الرَّجُلُ بَيْتَهُ فَذَكَرَ اللَّهَ عِنْدَ دُخُولِهِ وَعِنْدَ طَعَامِهِ قَالَ الشَّيْطَانُ لاَ مَبِيتَ لَكُمْ وَلاَ عَشَاءَ
- **Keep the practice** of saying Bismillah before actions. Only the weak quote goes.

**Day 12: Dua for halal rizq (replaces Al-Waqi'ah)**
- **Dua:** Allahummakfini bi-halalika 'an haramika wa aghnini bi-fadlika 'amman siwak
- **Ref:** Tirmidhi 3563 · **Grade:** Tirmidhi: hasan gharib; al-Albani, Shakir and Bashar 'Awwad: hasan · **Confidence:** H
- **Arabic:** اللَّهُمَّ اكْفِنِي بِحَلاَلِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ
- **Meaning:** "O Allah, suffice me with what You have made lawful instead of what You have made unlawful, and make me independent by Your bounty of all besides You."
- **Note:** This dua already appears as Day 12 morningDhikr (L568). Also add the Day 1 dua (Ibn Majah 925): «عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا», "beneficial knowledge and good provision". Keep 14:37 only as a Quranic reflection, without calling it the "rizq dua".

**Day 22: Knowledge (replaces Ibn Majah 224)**
- **Quote:** "Whoever Allah wants good for, He gives him understanding of the religion."
- **Ref:** Bukhari 71 (Mu'awiyah); also Muslim 1037 (number from memory, not looked up) · **Grade:** Sahih · **Confidence:** H (Bukhari 71)
- **Arabic:** مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ
- **If you keep the original instead:** cite it as "Ibn Majah 224 (first sentence graded sahih by al-Albani through multiple routes; the narration in full is very weak)".

**Day 23: Reflecting on creation (replaces "Companions walked in nature")**
- **Description:** "At night the Prophet ﷺ would look up at the sky and recite: 'Indeed, in the creation of the heavens and the earth... are signs for those of understanding' (3:190). Take 15 minutes today outside: look at the sky, reflect, and say SubhanAllah."
- **Ref:** Bukhari 4569 · **Grade:** Sahih · **Confidence:** H
- **Arabic:** نَظَرَ إِلَى السَّمَاءِ فَقَالَ: ﴿إِنَّ فِي خَلْقِ السَّمَوَاتِ وَالأَرْضِ...﴾
- If Bukhari 4569 is used as the Day 23 `hadith`, use Quran 3:191 for this item instead («وَيَتَفَكَّرُونَ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ رَبَّنَا مَا خَلَقْتَ هَٰذَا بَاطِلًا»), or the athar of Abu ad-Darda', clearly labelled as athar.

**Day 27: Salat at-Tawbah (replaces the Ghusl of Tawbah)**
- **Title:** "Two Rak'ahs of Repentance (Salat at-Tawbah)"
- **Quote:** "No servant commits a sin, then purifies himself well, stands and prays two rak'ahs, then seeks Allah's forgiveness, except that Allah forgives him." Then he recited Al 'Imran 3:135.
- **Ref:** Abu Dawud 1521; Tirmidhi 406 · **Grade:** al-Albani: sahih; al-Arna'ut: hasan; Tirmidhi: hasan · **Confidence:** H
- **Arabic:** مَا مِنْ عَبْدٍ يُذْنِبُ ذَنْبًا فَيُحْسِنُ الطُّهُورَ ثُمَّ يَقُومُ فَيُصَلِّي رَكْعَتَيْنِ ثُمَّ يَسْتَغْفِرُ اللَّهَ إِلاَّ غَفَرَ اللَّهُ لَهُ
- **Note:** The wudu is what is meant by "purifies himself well". Do not present ghusl as a sunnah of tawbah.

**Day 28: Serving the community (replaces "best of people are most beneficial")**
- **Quote:** "Whoever fulfils the need of his brother, Allah will fulfil his need; whoever relieves a Muslim of a hardship, Allah will relieve him of a hardship on the Day of Resurrection."
- **Ref:** Bukhari 2442; Muslim 2580 (Ibn 'Umar) · **Grade:** Sahih · **Confidence:** H
- **Arabic:** وَمَنْ كَانَ فِي حَاجَةِ أَخِيهِ كَانَ اللَّهُ فِي حَاجَتِهِ، وَمَنْ فَرَّجَ عَنْ مُسْلِمٍ كُرْبَةً فَرَّجَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرُبَاتِ يَوْمِ الْقِيَامَةِ
- **Alternative:** Muslim 2699: «وَاللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ», "Allah helps the servant as long as the servant helps his brother." Note that Day 22 already uses Muslim 2699.

### Structural fixes
- **Tasbih counts.** Day 1 task L57 says 33+33+33. Day 3 L146-148, task L160 and Day 8 L390 say 33+33+34. **Both forms are authentic:**
  - Muslim 597 (Abu Hurayrah): 33+33+33 completed to 100 with «لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ».
  - Muslim 596 (Ka'b ibn 'Ujrah): 33 tasbih, 33 tahmid, 34 takbir after every prayer.
  - **Recommendation:** standardise on the Muslim 597 form (33/33/33 + tahlil = 100) everywhere, and mention 33/33/34 (Muslim 596) as an equally valid option in an info note. (H)
  - Also, Day 1's eveningDhikr (L41-43) labels the after-prayer tasbih as "evening dhikr". Consider relabelling it "after each prayer".
- **Surah 41 naming.** L1434 'Ha-Mim Sajdah' and L1468 task: change both to **"Fussilat"** to match L1385 and L1419. (H)

---

## `prayerFocus` duas and hadith-bearing tips

| Day | Item | Verdict | Grade and reference | Confidence |
|---|---|---|---|---|
| 1 | Dua اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا | KEEP. Add "said after the salam of Fajr". | Ibn Majah 925 (al-Albani and Abd al-Baqi: sahih; Za'i: da'if) | H |
| 2 | Dua اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ | KEEP. Say it after the shahadah that follows wudu. | Tirmidhi 55 (al-Albani and Shakir: sahih; Tirmidhi notes *idtirab* (inconsistency) in the chain). The shahadah after wudu itself is in Muslim 234 (number from memory). | M |
| 2 | Tip: "make dua after each step" of wudu | FIX (not in the table count) | There are **no authentic duas for each limb**. Remove "make dua after each step" and keep Bismillah at the start plus the shahadah at the end. | H |
| 4 | Dua of light | KEEP | Muslim 763 (the variant with «وَفِي لِسَانِي نُورًا» was found in Muslim 763's sub-narrations); also Bukhari 6316 | H |
| 5 | Dua سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ اللَّهُمَّ اغْفِرْ لِي | KEEP | Bukhari 817; Muslim 484 | H |
| 5, 10 | Tip: "closest to his Lord in prostration, so increase du'a" | KEEP | Muslim 482: أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ | H |
| 7 | Dua الْعَفْوَ وَالْعَافِيَةَ | KEEP | Abu Dawud 5074; Ibn Majah 3871 (sahih) | H |
| 10 | Dua رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً... | KEEP | Quran 2:201; his most frequent dua: Bukhari 6389 | H |
| 11 | Tip: two angels each morning | KEEP | Bukhari 1442; Muslim 1010 | H |
| 12 | Tip: Duha equals charity for every joint; "**invites barakah into your rizq**" | FIX | The joints part is Muslim 720 (sahih). The "barakah into rizq" claim is unsourced, so remove it. | H |
| 14 | Tip: "pray 2 rakah of shukr... This was a practice of the Prophet ﷺ" (also task 14_shukr_prayer) | FIX | What is established is **sujud ash-shukr**: Abu Dawud 2774 (al-Albani: sahih): كَانَ إِذَا جَاءَهُ أَمْرُ سُرُورٍ أَوْ بُشِّرَ بِهِ خَرَّ سَاجِدًا شَاكِرًا لِلَّهِ. Rewrite the tip and the task to use the prostration of gratitude. | H |
| 15 | Tip: "As-Sadiqeen... described as those who pray at night" | FIX | Quran 3:17 lists «الصَّابِرِينَ وَالصَّادِقِينَ... وَالْمُسْتَغْفِرِينَ بِالْأَسْحَارِ» ("the patient, the truthful... those who seek forgiveness before dawn"). Reword to: "Among the qualities Allah praises alongside truthfulness is seeking forgiveness before dawn (3:17)." | H |
| 26 | Tip: ihsan definition | KEEP | Bukhari 50; Muslim 8 | H |
| 28 | Tip: congregation 27 times greater | KEEP | Bukhari 645 | H |
| 29 | Tip: the Prophet ﷺ prayed for people's guidance | KEEP | Bukhari 2937 («اللَّهُمَّ اهْدِ دَوْسًا»); Muslim 2491 (Abu Hurayrah's mother) | H |

---

## Duas (`constants/duas.ts`)

| # | Title | Verdict | Grade and reference | Notes | Conf. |
|---|---|---|---|---|---|
| 1 | Waking Up | KEEP | Bukhari 6312 (Hudhayfah) | Source "Bukhari" is correct. | H |
| 2 | Morning Protection (بِكَ أَصْبَحْنَا... وَإِلَيْكَ النُّشُورُ) | KEEP | Abu Dawud 5068 (sahih); Tirmidhi 3391 (al-Albani: sahih) | The narrations differ on whether النُّشُور or الْمَصِير goes with morning or evening. Current pairing (morning: nushur, evening: masir) matches Abu Dawud 5068 and Hisn al-Muslim. Change the source to "Abu Dawud 5068; Tirmidhi 3391". | H |
| 3 | Bismillah alladhi la yadurru (morning) | KEEP | Abu Dawud 5088 (sahih); Tirmidhi 3388 (hasan sahih) | Add "3 times". | H |
| 4 | Evening Protection | KEEP | As #2 | | H |
| 5 | Evening Bismillah | KEEP | As #3 | | H |
| 6 | After Adhan | KEEP | Bukhari 614 | | H |
| 7 | Before Salah (اللَّهُمَّ بَاعِدْ بَيْنِي...) | KEEP | Bukhari 744; Muslim 598 | Retitle to "Opening dua of prayer (after takbir)". It is said inside the prayer, not before it. The Muslim number is from memory, because this dataset's Muslim 598 entry has no number. | H |
| 8 | After Salah (astaghfirullah x3) | KEEP | Muslim 591 (Thawban) | Optionally add «اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ» from the same hadith. | H |
| 9 | Before Eating: بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ (Abu Dawud). AUDIT ITEM | **REPLACE** | Not established in this wording. | **Replacement:** «بِسْمِ اللَّهِ», "In the name of Allah" (Bukhari 5376; Muslim 2022). If forgotten at the start: «بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ», "In the name of Allah at its beginning and its end" (Abu Dawud 3767: al-Albani sahih, al-Arna'ut sahih li-ghayrihi). | H |
| 10 | After Eating: ...وَجَعَلَنَا مِنَ الْمُسْلِمِينَ (Abu Dawud, Tirmidhi). AUDIT ITEM | **REPLACE** | Abu Dawud 3850 and Tirmidhi 3457 are graded **da'if** by al-Albani, al-Arna'ut, Shakir and Za'i (verified). | **Replacement:** «الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلاَ قُوَّةٍ», "All praise is for Allah who fed me this and provided it for me without any might or power on my part" (Tirmidhi 3458, hasan; Abu Dawud 4023, al-Albani hasan). Optional second dua: «الْحَمْدُ لِلَّهِ كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ، غَيْرَ مَكْفِيٍّ وَلاَ مُوَدَّعٍ وَلاَ مُسْتَغْنًى عَنْهُ رَبَّنَا» (Bukhari 5458). | H |
| 11 | Before Sleeping | KEEP | Bukhari 6312 | Arabic is correct: بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا | H |
| 12 | Entering Mosque | KEEP | Muslim 713 | | H |
| 13 | Leaving Home | KEEP | Abu Dawud 5095 (sahih); Tirmidhi 3426 (hasan sahih gharib) | | H |
| 14 | Before Reading Quran (اللَّهُمَّ افْتَحْ عَلَيْنَا حِكْمَتَكَ...), no source. AUDIT ITEM | **REPLACE** | Not established from the Prophet ﷺ. | **Replacement:** the isti'adhah commanded in Quran 16:98: «أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ», "I seek refuge in Allah from Shaytan the accursed." Source: "Quran 16:98". | H |
| 15 | Dua for Knowledge (رَبِّ زِدْنِي عِلْمًا) | KEEP | Quran 20:114 | | H |
| 16 | Sayyid al-Istighfar | FIX (Arabic) | Bukhari 6306 | Bukhari's text has «وَأَبُوءُ **لَكَ** بِذَنْبِي»; the current Arabic omits the second لَكَ. Fix the Arabic and the transliteration ("wa abu'u laka bi-dhanbi"). | H |
| 17 | Tawbah (أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ) | FIX-REFERENCE | Bukhari 6307 contains this wording. Muslim 2702 has "I seek forgiveness 100 times a day" but a different formula. | Set the source to "Bukhari 6307". | H |

---

## Milestones and welcome-back

| id | Theme | Text (Arabic) | Meaning | Reference and grade | Conf. |
|---|---|---|---|---|---|
| first_step | beginnings / intention | وَإِنْ تَقَرَّبَ إِلَىَّ بِشِبْرٍ تَقَرَّبْتُ إِلَيْهِ ذِرَاعًا... وَإِنْ أَتَانِي يَمْشِي أَتَيْتُهُ هَرْوَلَةً | Allah says: "If he draws near to Me a hand-span, I draw near to him an arm's length... and if he comes to Me walking, I come to him running." | Bukhari 7405; Muslim 2675 (hadith qudsi), sahih | H |
| first_full_salah_day | salah | فَذَلِكَ مِثْلُ الصَّلَوَاتِ الْخَمْسِ، يَمْحُو اللَّهُ بِهَا الْخَطَايَا | "That is the likeness of the five prayers: through them Allah wipes away sins." (Like bathing in a river at your door five times a day.) | Bukhari 528; Muslim 667, sahih | H |
| three_days | consistency / striving | وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا | "And those who strive for Us, We will surely guide them to Our ways." | Quran 29:69 | H |
| week_one | moderation / ease | إِنَّ الدِّينَ يُسْرٌ... فَسَدِّدُوا وَقَارِبُوا وَأَبْشِرُوا | "The religion is ease... so do what is right, come as close as you can, and rejoice." | Bukhari 39, sahih | H |
| streak_7 | consistency | وَاعْبُدْ رَبَّكَ حَتَّىٰ يَأْتِيَكَ الْيَقِينُ | "And worship your Lord until there comes to you the certainty (death)." | Quran 15:99 | H |
| fajr_7 | fajr | مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ | "Whoever prays the two cool prayers (Fajr and 'Asr) will enter Paradise." | Bukhari 574; Muslim 635, sahih | H |
| first_reflection | self-accounting | يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنظُرْ نَفْسٌ مَّا قَدَّمَتْ لِغَدٍ | "O you who believe, fear Allah, and let every soul look to what it has sent forth for tomorrow." | Quran 59:18 | H |
| tasbih_1000 | dhikr | أَيَعْجِزُ أَحَدُكُمْ أَنْ يَكْسِبَ كُلَّ يَوْمٍ أَلْفَ حَسَنَةٍ... يُسَبِّحُ مِائَةَ تَسْبِيحَةٍ فَيُكْتَبُ لَهُ أَلْفُ حَسَنَةٍ أَوْ يُحَطُّ عَنْهُ أَلْفُ خَطِيئَةٍ | "Is any of you unable to earn a thousand good deeds each day? He glorifies Allah a hundred times, and a thousand good deeds are written for him or a thousand sins are removed." | Muslim 2698, sahih | H |
| halfway | perseverance | فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا | "For indeed, with hardship comes ease. Indeed, with hardship comes ease." | Quran 94:5-6 | H |
| journey_complete | completion / gratitude | لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ | "If you are grateful, I will surely increase you." | Quran 14:7 | H |
| **welcome_back** | returning / small consistent deeds | وَأَنَّ أَحَبَّ الأَعْمَالِ أَدْوَمُهَا إِلَى اللَّهِ وَإِنْ قَلَّ | "The most beloved of deeds to Allah are the most consistent, even if small." | **Bukhari 6464** (verified, sahih). Muslim: the Aisha narration with this meaning is **Muslim 782** in Abd al-Baqi numbering, not 783 (see the open doubts). | H (Bukhari) / M (Muslim no.) |

Alternate welcome-back line (Quran): «قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ», "Say: O My servants who have transgressed against themselves, do not despair of the mercy of Allah" (Quran 39:53).

Overlap: Day 30's sunnahPractice already uses Bukhari 6464. Using it again for welcome-back is fine, because the theme is a natural fit.

---

## Open doubts and items not verified online

1. **sunnah.com was blocked** (Cloudflare and 403). Every Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i and Ibn Majah number above marked H was checked against the fawazahmed0 hadith-api mirror of sunnah.com. A final click-through on sunnah.com before release is still recommended.
2. **Muslim 782 vs 783** ("most beloved deeds... consistent even if small"). The dataset puts this Aisha narration at 782 (sub-narration 2), while 783 is 'Alqamah's question about the Prophet's deeds. Many sites cite 783. Confirm on sunnah.com (sunnah.com/muslim:782b or 783).
3. **Ahmad numbers** (6541 for "Irhamu turhamu"; 23630 for minor shirk) and the al-Albani gradings (Sahih al-Jami' 897 and 1555; ad-Da'ifah 179 for the du'a-weapon hadith; ad-Da'ifah 289 or 290 for Al-Waqi'ah) are **[secondary-verified]** only, via dorar.net summaries, surahquran.com, tohed.com and hadithanswers.
4. **Not verified at all, and deliberately not recommended:**
   - the Ibn Hibban "Woe to whoever recites [3:190] and does not reflect";
   - the "al-Amin" attribution in Ahmad, for which I give no number;
   - the "dua when it rains" item;
   - the Tabarani "rest of his deeds will be sound" wording of the Day 3 hadith (I used Tirmidhi 413 instead).
5. **Numbers from memory that were not looked up:** Muslim 598 (the istiftah dua is in that chapter, but the dataset entry has no number); Muslim 234 (shahadah after wudu); Muslim 1037 (alternative ref for Bukhari 71); Abu Dawud 864 and Nasa'i 465 (alternatives to Tirmidhi 413). Each is marked where it appears.
6. **Disputed gradings kept with M:** Day 16 (Abu Dawud 3535: al-Albani hasan sahih, al-Arna'ut da'if); Day 13 (Tirmidhi 2517: hasan); Day 2 dua (Tirmidhi 55: chain *idtirab*, al-Albani sahih); Day 9 "eat together" (Abu Dawud 3764). If Awdah wants agreed-upon-only, swap Day 16 and drop "eat together".
7. **Outside the requested scope, but flagged for a second pass.** These morning/evening dhikr entries have no source field. They are fine as personal du'a but must **not** be presented as prophetic:
   - L520 «اللَّهُمَّ اجْعَلْنَا مِمَّن يُنفِقُ فَتُخْلِفُ لَهُ» is derived from the angels hadith; it is not a narrated dua.
   - L545 «اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ» is the weak Ibn as-Sunni pre-meal dua.
   - L1238 «اللَّهُمَّ أَنتَ تَعْلَمُ سِرِّي وَعَلَانِيَتِي...» is from the weak "dua of Adam".
   - L1216 «اللَّهُمَّ اجْعَلْ عَمَلِي كُلَّهُ صَالِحًا...» is a saying of 'Umar, not the Prophet ﷺ.
   - L1026 «حَسِّنْ خُلُقِي كَمَا حَسَّنْتَ خَلْقِي»: the narrated wording is «اللَّهُمَّ أَحْسَنْتَ خَلْقِي فَأَحْسِنْ خُلُقِي».
   - L1407 «اللَّهُمَّ اهْدِ قَوْمِي...»: the Bukhari 3477 wording is «رَبِّ اغْفِرْ لِقَوْمِي فَإِنَّهُمْ لاَ يَعْلَمُونَ», narrated about an earlier prophet.
   - L1456 «أَسْأَلُكَ الثَّبَاتَ فِي الأَمْرِ...» and L275 «قَلْبًا سَلِيمًا وَلِسَانًا صَادِقًا» are from the Shaddad ibn Aws dua, whose grading is disputed.
   - L713, L808, L978 and others are invented phrasings (acceptable as personal du'a).

   Recommendation: either give dhikr items a `source` field, or show a UI label "general du'a" for anything not narrated.
8. **Day 2 tip (L79),** "make dua after each step [of wudu]": the limb-by-limb duas are not established. Remove that clause.

# Awdah content verification, pass 2: dhikr, Learn Salah and the basics

**Method.** I extracted every `morningDhikr` and `eveningDhikr` entry from `E:\muslim-helper\constants\islamicContent.ts`: 97 rows, which reduce to **75 unique items**. sunnah.com is blocked, so I checked the Arabic text of each item against full local copies of the fawazahmed0 hadith-api editions (ara-/eng- Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i and Ibn Majah) with a diacritic-insensitive search.

**Numbering.**
- Muslim numbers are **Abd al-Baqi** numbers, the `arabicnumber` field, which is what sunnah.com shows.
- Gradings for the four Sunan come from the mirror's grade fields: al-Albani, Zubair Ali Za'i, Shu'ayb al-Arna'ut and others.

**Confidence tags.**
- **[V]**: I verified the text and number in the mirror during this pass.
- **[S]**: secondary. These are well-known references, but the work isn't in the mirror (Ahmad, al-Adab al-Mufrad, Nasa'i al-Kubra, Hakim), so the number comes from memory or secondary sources.
- **[M]**: from memory and not looked up. It needs a click-through before release.

**Verdict counts (75 unique items).** **KEEP 36 · FIX 32 · REPLACE 7.** The 32 FIX items fall into two groups:
- 21 have a wording, count or context error.
- 11 are invented phrasings. These are permissible as personal du'a but must be labelled "personal du'a, not a narrated dhikr".

---

## A. Dhikr verdicts

### A.1 Deduplicated reference list

The per-day table in A.2 points to the R-numbers below. Where I give "Correct Arabic", the app's text should become exactly that.

**Count conventions.**
- "general" means the dhikr is valid at any count and no number is narrated for it. The app may suggest a number, but it must not claim that the number is sunnah.
- When the item is a fragment of a longer narrated du'a, partial use is fine.

#### Prophetic or Quranic items that need no change (KEEP)

| R | Item | Correct Arabic (if the app's text differs) | Transliteration | Meaning | Source, grade, confidence | Sunnah count |
|---|---|---|---|---|---|---|
| R1 | Basmalah | بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ (app OK) | Bismillāhir-Raḥmānir-Raḥīm | In the name of Allah, the Most Gracious, the Most Merciful | Quran 1:1 / 27:30 | general, no specific claim (Day 19's ×10 is not narrated) |
| R2 | Shahadah (short) | app OK | Ashhadu an lā ilāha illallāh, wa ashhadu anna Muḥammadan rasūlullāh | I bear witness that there is no god but Allah, and that Muhammad is the Messenger of Allah | Bukhari 8 [V] (content). General dhikr | general (×3 not narrated) |
| R4 | Tasbih / tahmid / takbir | app OK | SubḥānAllāh · Al-ḥamdu lillāh · Allāhu akbar | Glory be to Allah · All praise is for Allah · Allah is the Greatest | **After salah:** 33/33/33, then tahlil to complete 100: Muslim 597 [V]. **Bedtime:** 33/33/**34** takbir: Muslim 2727 [V] | Day 1 (33/33/33) is the post-salah set. Add «لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ» as the 100th, or label it as general. Day 3 (33/33/34) is the bedtime set; label it "before sleep" |
| R5 | Istighfar | app OK | Astaghfirullāh | I seek Allah's forgiveness | Muslim 2702 "I seek forgiveness 100 times a day" [V]; Bukhari 6307 (70+) [M] | 100 per day; ×10 is general |
| R6 | Shahadah after wudu (Day 2) | app OK | Ashhadu an lā ilāha illallāhu waḥdahū lā sharīka lah, wa ashhadu anna Muḥammadan ʿabduhū wa rasūluh | I testify that there is no god but Allah, alone without partner, and that Muhammad is His servant and messenger | **Muslim 234** [V], Uqbah ibn Amir: the eight gates of Paradise | Once, **after wudu**. It is not a morning dhikr, so relabel the context |
| R9 | SubḥānAllāhi wa biḥamdih | app OK | SubḥānAllāhi wa biḥamdih | Glory be to Allah and praise be to Him | **Muslim 2692** [V], morning and evening ×100; Bukhari 6405 [V], ×100 a day | 100 morning, 100 evening |
| R12 | Allāhumma bika aṣbaḥnā (morning) | app OK | Allāhumma bika aṣbaḥnā, wa bika amsaynā, wa bika naḥyā, wa bika namūtu, wa ilaykan-nushūr | O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection | Abu Dawud 5068 (al-Albani sahih) [V]; Tirmidhi 3391 [V] | 1 |
| R14 | Allāhumma bika amsaynā (evening) | app OK | Allāhumma bika amsaynā, wa bika aṣbaḥnā, wa bika naḥyā, wa bika namūtu, wa ilaykal-maṣīr | …and to You is the final return | Tirmidhi 3391 / Ibn Majah 3868 [V] (the ending varies by narration; the Hisn al-Muslim evening form ends in al-maṣīr) | 1 |
| R15 | Aʿūdhu bi-kalimātillāh | app OK | Aʿūdhu bi-kalimātillāhit-tāmmāti min sharri mā khalaq | I seek refuge in the perfect words of Allah from the evil of what He created | **Muslim 2709** [V], said in the evening (scorpion narration); Tirmidhi 3604 [V], ×3 in the evening | 3, evening |
| R16 | Yā Ḥayyu yā Qayyūm | app OK | Yā Ḥayyu yā Qayyūmu bi-raḥmatika astaghīth | O Ever-Living, O Sustainer, by Your mercy I seek help | Tirmidhi 3524, hasan (al-Albani) [V]: said **at times of distress** | general (×3 not narrated). The longer morning/evening form adds «أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ» (Nasa'i al-Kubra / Hakim, hasan) [S] |
| R17 | Du'a of Dhun-Nun | app OK | Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn | There is no god but You, glory be to You; I have been among the wrongdoers | Quran 21:87; Tirmidhi 3505 (al-Albani sahih) [M] | general |
| R18 | Two light words | app OK | SubḥānAllāhi wa biḥamdihī, subḥānAllāhil-ʿAẓīm | Glory be to Allah and praise be to Him; glory be to Allah the Magnificent | **Muslim 2694** [V]; Bukhari 6406 [M] | general (×10 fine, but it is not a narrated count) |
| R19 | Short salawat | app OK | Allāhumma ṣalli ʿalā Muḥammad | O Allah, send blessings upon Muhammad | General. Muslim 408 "whoever sends one salah upon me, Allah sends ten upon him" [M]. **Do not** cite the "10 morning/10 evening → intercession" report (Tabarani); its grading is disputed | general |
| R22 | Astaghfirullāhal-ʿAẓīm alladhī… | app OK (Day 7) | Astaghfirullāhal-ʿAẓīmal-ladhī lā ilāha illā huwal-Ḥayyul-Qayyūmu wa atūbu ilayh | I seek forgiveness from Allah the Magnificent, besides whom there is no god, the Ever-Living, the Sustainer, and I repent to Him | Tirmidhi 3577, sahih (al-Albani) [V]. Abu Dawud 1517 [V] has the same wording **without** al-ʿAẓīm | general. The ×3-at-bedtime version (Tirmidhi 3397) is **da'if** [V], so don't claim 3 |
| R25 | Ḥasbiyallāh ×7 | app OK | Ḥasbiyallāhu lā ilāha illā huwa ʿalayhi tawakkaltu wa huwa Rabbul-ʿArshil-ʿAẓīm | Allah is sufficient for me; there is no god but Him; in Him I trust, and He is Lord of the Mighty Throne | Quran 9:129. The ×7 morning/evening comes from **Abu Dawud 5081** [V], which is **mawquf on Abu ad-Darda'**: al-Albani graded it *mawdu'*, Zubair Ali Za'i *isnad hasan*. Hisn al-Muslim includes it | 7 is acceptable as a practice. **Do not attribute the ×7 or its virtue to the Prophet ﷺ** |
| R26 | Bismillāhil-ladhī lā yaḍurr | app OK | Bismillāhil-ladhī lā yaḍurru maʿasmihī shayʾun fil-arḍi wa lā fis-samāʾi wa huwas-Samīʿul-ʿAlīm | In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing | **Abu Dawud 5088** (al-Albani sahih) [V]; Tirmidhi 3388, hasan sahih [V] | 3 morning, 3 evening |
| R30 | Tahlil | app OK | Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʿalā kulli shayʾin qadīr | None has the right to be worshipped but Allah alone, without partner; His is the dominion and His is the praise, and He is able to do all things | ×100 a day: **Muslim 2691** [V]. ×10 (like freeing four of Isma'il's descendants): Bukhari 6404 [V] | 10 or 100. **Day 13:** the translation is truncated, so add the second half |
| R33 | Iknini bi-ḥalālik | app OK | Allāhummak-finī bi-ḥalālika ʿan ḥarāmik, wa aghninī bi-faḍlika ʿamman siwāk | O Allah, suffice me with what You have made lawful instead of what You have forbidden, and by Your grace make me free of need of anyone besides You | Tirmidhi 3563, hasan [V] | general |
| R34 | Refuge from poverty | app OK. The full form adds «وَأَعُوذُ بِكَ مِنْ أَنْ أَظْلِمَ أَوْ أُظْلَمَ» | Allāhumma innī aʿūdhu bika minal-faqri wal-qillati wadh-dhillah | O Allah, I seek refuge in You from poverty, from scarcity and from humiliation | Abu Dawud 1544, sahih [V] | general |
| R37 | Waking du'a | app OK | Al-ḥamdu lillāhil-ladhī aḥyānā baʿda mā amātanā wa ilayhin-nushūr | Praise be to Allah who gave us life after causing us to die, and to Him is the resurrection | Bukhari 6312 [V]; Muslim 2711 [V] | 1, **on waking** |
| R38 | Waking du'a 2 | app OK | Al-ḥamdu lillāhil-ladhī ʿāfānī fī jasadī, wa radda ʿalayya rūḥī, wa adhina lī bi-dhikrih | Praise be to Allah who gave health to my body, returned my soul to me and permitted me to remember Him | Tirmidhi 3401, hasan (al-Albani; Zubair Ali Za'i da'if) [V] | 1, on waking |
| R39 | Ḥamdan kathīran | app OK | Al-ḥamdu lillāhi ḥamdan kathīran ṭayyiban mubārakan fīh | Praise be to Allah, abundant, good and blessed praise | Bukhari 799 (after rising from ruku') [V]; Muslim 600 [V] | general |
| R42 | Ighsilnī… | app OK | Allāhummaghsilnī min khaṭāyāya bil-māʾi wath-thalji wal-barad | O Allah, wash away my sins with water, snow and hail | Nasa'i 895, sahih [V]; Bukhari 744 [V] (wording «اغْسِلْ خَطَايَايَ», from the opening du'a of salah) | general |
| R44 | SubḥānAllāhil-ʿAẓīmi wa biḥamdih ×100 | app OK | SubḥānAllāhil-ʿAẓīmi wa biḥamdih | Glory be to Allah the Magnificent, and praise be to Him | **Abu Dawud 5091**, sahih, 100 morning and 100 evening [V] | 100 morning, 100 evening |
| R50 | Forgiveness for believers | app OK | Allāhummaghfir lil-muʾminīna wal-muʾmināt | O Allah, forgive the believing men and women | Quran 47:19, 71:28. General du'a, so make no virtue claim | general |
| R54 | Ihdinī li-aḥsanil-akhlāq | app OK | Allāhummah-dinī li-aḥsanil-akhlāqi lā yahdī li-aḥsanihā illā anta, waṣrif ʿannī sayyiʾahā lā yaṣrifu ʿannī sayyiʾahā illā ant | O Allah, guide me to the best of character, for none guides to the best of it but You; and turn away from me its evil, for none turns away its evil but You | **Muslim 771** [V] (part of the opening du'a of night prayer). The app drops the final «لَا يَصْرِفُ عَنِّي سَيِّئَهَا إِلَّا أَنْتَ»; adding it is optional | general |
| R56 | ʿIlman nāfiʿan | app OK | Allāhumma innī asʾaluka ʿilman nāfiʿan, wa rizqan ṭayyiban, wa ʿamalan mutaqabbalā | O Allah, I ask You for beneficial knowledge, good provision and accepted deeds | **Ibn Majah 925** [V], said after the **salam of Fajr**. Al-Albani sahih; Zubair Ali Za'i da'if | 1, after Fajr |
| R57 | Rabbi zidnī ʿilmā | app OK | Rabbi zidnī ʿilmā | My Lord, increase me in knowledge | Quran 20:114 | general |
| R58 | Rabbanā mā khalaqta | app OK | Rabbanā mā khalaqta hādhā bāṭilan subḥānaka fa-qinā ʿadhāban-nār | Our Lord, You did not create this in vain; glory be to You, so protect us from the punishment of the Fire | Quran 3:191 | general |
| R59 | ʿAdada khalqih | app OK | SubḥānAllāhi wa biḥamdihī ʿadada khalqihī, wa riḍā nafsihī, wa zinata ʿarshihī, wa midāda kalimātih | Glory be to Allah and praise be to Him, as many times as the number of His creation, as much as pleases Him, as much as the weight of His Throne, and as much as the ink of His words | **Muslim 2726** [V] (said ×3, in the morning after Fajr) | 3 |
| R60 | Lā tajʿalid-dunyā… | app OK (fragment) | Wa lā tajʿalid-dunyā akbara hamminā wa lā mablagha ʿilminā | Do not make this world our greatest concern nor the limit of our knowledge | Tirmidhi 3502, hasan (al-Albani; Zubair Ali Za'i da'if) [V] | general |
| R61 | Al-jannata wa mā qarraba | app OK (fragment) | Allāhumma innī asʾalukal-jannata wa mā qarraba ilayhā min qawlin aw ʿamal | O Allah, I ask You for Paradise and for whatever word or deed brings me near to it | Ibn Majah 3846, sahih [V] | general |
| R62 | Refuge from shirk | app OK. The narrated ending is «وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ» | Allāhumma innī aʿūdhu bika an ushrika bika wa ana aʿlam, wa astaghfiruka limā lā aʿlam | O Allah, I seek refuge in You from knowingly associating anything with You, and I seek Your forgiveness for what I do not know | al-Adab al-Mufrad 716 (al-Albani sahih) [S]; not in the mirror | general (3 is fine; it is not narrated) |
| R66 | Rabbanā ẓalamnā | app OK | Rabbanā ẓalamnā anfusanā wa in lam taghfir lanā wa tarḥamnā lanakūnanna minal-khāsirīn | Our Lord, we have wronged ourselves; if You do not forgive us and have mercy on us, we will surely be among the losers | Quran 7:23 | general |
| R70 | Hudātan muhtadīn | app OK (fragment) | Allāhummajʿalnā hudātan muhtadīn | O Allah, make us guides who are themselves rightly guided | **Nasa'i 1305**, sahih [V] (narrated: «اللَّهُمَّ زَيِّنَّا بِزِينَةِ الإِيمَانِ وَاجْعَلْنَا هُدَاةً مُهْتَدِينَ») | general |
| R73 | Yā Muqallibal-qulūb | app OK | Yā Muqallibal-qulūbi thabbit qalbī ʿalā dīnik | O Turner of hearts, make my heart firm upon Your religion | Tirmidhi 2140 / 3522, sahih (al-Albani) [V]. It was "the du'a he said most often" | **often**; ×7 is not narrated, so make it general |

#### FIX: wrong wording, count or context

| R | Item (day) | Problem | Correct Arabic | Transliteration | Meaning | Source / grade | Count |
|---|---|---|---|---|---|---|---|
| R3 | Aʿinnī ʿalā dhikrik (D1) | The ×3 is not narrated, and the context is after every salah | اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ | Allāhumma aʿinnī ʿalā dhikrika wa shukrika wa ḥusni ʿibādatik | O Allah, help me to remember You, thank You and worship You well | **Abu Dawud 1522**, sahih [V]; Nasa'i 1303 [V] (Mu'adh: "do not leave it at the end of every prayer") | 1, at the end of each salah |
| R7 | Subḥānaka… astaghfiruka (D2, D18) | Count; this is the expiation of a gathering | سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ | Subḥānakallāhumma wa biḥamdik, ashhadu an lā ilāha illā ant, astaghfiruka wa atūbu ilayk | Glory be to You, O Allah, and praise; I testify there is no god but You; I seek Your forgiveness and repent to You | Abu Dawud 4859, hasan sahih [V]; Tirmidhi 3433, sahih [V], at the end of a sitting. A version after wudu is in Nasa'i al-Kubra [S] | 1, at the end of a sitting (or after wudu) |
| R8 | Sayyid al-istighfar (D2) | **Truncated** after «وَأَنَا عَبْدُكَ». D7 has the full text, which is correct | اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ | Allāhumma anta Rabbī lā ilāha illā ant, khalaqtanī wa ana ʿabduk, wa ana ʿalā ʿahdika wa waʿdika mastaṭaʿt, aʿūdhu bika min sharri mā ṣanaʿt, abūʾu laka bi-niʿmatika ʿalayya, wa abūʾu laka bi-dhanbī, faghfir lī fa-innahū lā yaghfirudh-dhunūba illā ant | (as in D7) | **Bukhari 6306** [V]: whoever says it with certainty and dies that day or night is of the people of Paradise | 1 morning, 1 evening |
| R11 | Du'a after the adhan (D3) | Truncated | اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ | Allāhumma Rabba hādhihid-daʿwatit-tāmmah, waṣ-ṣalātil-qāʾimah, āti Muḥammadanil-wasīlata wal-faḍīlah, wabʿath-hu maqāman maḥmūdanil-ladhī waʿadtah | O Allah, Lord of this perfect call and the prayer about to be established, grant Muhammad al-Wasilah and excellence, and raise him to the praised station You promised him | **Bukhari 614** [V]: his intercession becomes due. Do **not** add «إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ» (Bayhaqi; *shadh*) | 1, after each adhan |
| R13 | Aṣbaḥnā ʿalā fiṭratil-Islām (D4) | Incomplete | أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ | Aṣbaḥnā ʿalā fiṭratil-Islām, wa ʿalā kalimatil-ikhlāṣ, wa ʿalā dīni nabiyyinā Muḥammad ﷺ, wa ʿalā millati abīnā Ibrāhīma ḥanīfan musliman wa mā kāna minal-mushrikīn | We have entered the morning upon the natural way of Islam, the word of sincerity, the religion of our Prophet Muhammad ﷺ, and the way of our father Ibrahim, upright and submitting, who was not of the polytheists | Ahmad (Abd ar-Rahman ibn Abza), sahih per al-Albani [S] | 1. The evening form uses أَمْسَيْنَا |
| R21 | Rabīʿ qalbī (D6) | A fragment, and it adds «الْعَظِيمَ», which is not in the narration | اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجِلَاءَ حُزْنِي، وَذَهَابَ هَمِّي | Allāhummajʿalil-Qurʾāna rabīʿa qalbī, wa nūra ṣadrī, wa jalāʾa ḥuznī, wa dhahāba hammī | O Allah, make the Quran the spring of my heart, the light of my chest, the remover of my sorrow and the reliever of my distress | From Ibn Mas'ud's du'a for distress, Ahmad 3712, sahih (al-Albani, as-Sahihah 199) [S] | general |
| R24 | ʿĀfinī fī badanī (D8) | Missing «لَا إِلَهَ إِلَّا أَنْتَ» | اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ | Allāhumma ʿāfinī fī badanī, Allāhumma ʿāfinī fī samʿī, Allāhumma ʿāfinī fī baṣarī, lā ilāha illā ant | O Allah, grant me well-being in my body, my hearing and my sight; there is no god but You | **Abu Dawud 5090** [V]: al-Albani *hasan isnad*, Zubair Ali Za'i da'if (disputed) | 3 morning, 3 evening |
| R27 | Amsaynā wa amsal-mulku lillāh (D8) | Truncated | أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ | Amsaynā wa amsal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʿalā kulli shayʾin qadīr. Rabbi asʾaluka khayra mā fī hādhihil-laylati wa khayra mā baʿdahā, wa aʿūdhu bika min sharri mā fī hādhihil-laylati wa sharri mā baʿdahā. Rabbi aʿūdhu bika minal-kasali wa sūʾil-kibar. Rabbi aʿūdhu bika min ʿadhābin fin-nāri wa ʿadhābin fil-qabr | We have entered the evening and the dominion belongs to Allah; praise be to Allah; none has the right to be worshipped but Allah alone, without partner; His is the dominion and the praise, and He is able to do all things. My Lord, I ask You for the good of this night and what follows it, and seek refuge in You from the evil of this night and what follows it. My Lord, I seek refuge in You from laziness and the misery of old age. My Lord, I seek refuge in You from punishment in the Fire and in the grave | **Muslim 2723** [V] | 1. In the morning, say أَصْبَحْنَا وَأَصْبَحَ… and هَذَا الْيَوْمِ… مَا بَعْدَهُ |
| R28 | Salawat Ibrahimiyyah (D9 ×10, D29 ×10) | Incomplete: missing «إِنَّكَ حَمِيدٌ مَجِيدٌ» and the barakah half | See **B2.10** | | | **Bukhari 3370** [V] | general |
| R29 | Hamm and hazan (D10) | The wording, with «وَأَعُوذُ بِكَ» repeated and framed as a morning/evening du'a, is **Abu Dawud 1555: da'if** [V]. Use the Bukhari wording | اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ | Allāhumma innī aʿūdhu bika minal-hammi wal-ḥazan, wal-ʿajzi wal-kasal, wal-jubni wal-bukhl, wa ḍalaʿid-dayni wa ghalabatir-rijāl | O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from cowardice and miserliness, from the burden of debt and from being overpowered by men | **Bukhari 6369** [V] (he said it often) | general |
| R35 | Ḥasbunallāh wa niʿmal-wakīl ×7 (D13) | ×7 is not narrated; it is a confusion with R25 | حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ (app OK) | Ḥasbunallāhu wa niʿmal-wakīl | Allah is sufficient for us, and He is the best disposer of affairs | Quran 3:173; **Bukhari 4563** [V] (said by Ibrahim and Muhammad ﷺ) | general |
| R36 | Tawakkaltu ʿalallāh (D13) | Missing the Bismillah. Context is leaving home; ×3 is not narrated | بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ | Bismillāh, tawakkaltu ʿalallāh, wa lā ḥawla wa lā quwwata illā billāh | In the name of Allah; I place my trust in Allah; there is no might nor power except by Allah | **Abu Dawud 5095**, sahih [V]; Tirmidhi 3426 [V] | 1, on leaving home |
| R40 | Aʿinnī ʿalā shukrik (D14) | A fragment of R3 | Use R3 | | | Abu Dawud 1522 [V] | 1 after salah |
| R43 | Khiyānah (D16) | The narration pairs it with hunger | اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْجُوعِ فَإِنَّهُ بِئْسَ الضَّجِيعُ، وَأَعُوذُ بِكَ مِنَ الْخِيَانَةِ فَإِنَّهَا بِئْسَتِ الْبِطَانَةُ | Allāhumma innī aʿūdhu bika minal-jūʿi fa-innahū biʾsaḍ-ḍajīʿ, wa aʿūdhu bika minal-khiyānati fa-innahā biʾsatil-biṭānah | O Allah, I seek refuge in You from hunger, for it is a wretched bed-fellow, and from treachery, for it is a wretched inner companion | Abu Dawud 1547 (al-Albani hasan; Zubair Ali Za'i da'if) [V]; Nasa'i 5468 [V] | general. Keeping only the second half is acceptable |
| R46 | Innā lillāh ×3 (D17) | Not a daily morning dhikr; it is said **at a calamity** | إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا | Innā lillāhi wa innā ilayhi rājiʿūn, Allāhumma ʾjurnī fī muṣībatī wa akhlif lī khayran minhā | We belong to Allah and to Him we return. O Allah, reward me in my affliction and replace it with something better | Quran 2:156; Muslim 918 [M] | at a calamity |
| R51 | Inna raḥmataka wasiʿat (D19) | Invented phrasing. Use the Quranic du'a of the angels | رَبَّنَا وَسِعْتَ كُلَّ شَيْءٍ رَّحْمَةً وَعِلْمًا فَاغْفِرْ لِلَّذِينَ تَابُوا وَاتَّبَعُوا سَبِيلَكَ وَقِهِمْ عَذَابَ الْجَحِيمِ | Rabbanā wasiʿta kulla shayʾin raḥmatan wa ʿilman faghfir lilladhīna tābū wattabaʿū sabīlaka wa qihim ʿadhābal-jaḥīm | Our Lord, You encompass all things in mercy and knowledge, so forgive those who repent and follow Your way, and protect them from the punishment of Hellfire | Quran 40:7 | general |
| R55 | Ḥassin khuluqī (D21) | Wording | اللَّهُمَّ أَحْسَنْتَ خَلْقِي فَأَحْسِنْ خُلُقِي | Allāhumma aḥsanta khalqī fa-aḥsin khuluqī | O Allah, You have made my form beautiful, so make my character beautiful | Ahmad (Ibn Mas'ud; Aisha), sahih per al-Albani (Irwa' 74) [S]. Tying it to looking in the mirror is weak, so don't mention the mirror | general |
| R63 | ʿUmar's du'a (D25) | It is a saying of 'Umar, not prophetic | app text OK | Allāhummajʿal ʿamalī kullahū ṣāliḥā, wajʿalhu li-wajhika khāliṣā, wa lā tajʿal li-aḥadin fīhi shayʾā | O Allah, make all my deeds righteous, purely for Your Face, and let no one have any share in them | Attributed to 'Umar ibn al-Khattab (Ahmad, az-Zuhd) [S]. Label it "du'a of 'Umar (RA)" | general |
| R67 | Al-ʿafwa wal-ʿāfiyah ×10 (D27) | ×10 is not narrated, and the text is a fragment | اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي | Allāhumma innī asʾalukal-ʿāfiyata fid-dunyā wal-ākhirah. Allāhumma innī asʾalukal-ʿafwa wal-ʿāfiyata fī dīnī wa dunyāya wa ahlī wa mālī. Allāhummastur ʿawrātī wa āmin rawʿātī. Allāhummaḥ-faẓnī min bayni yadayya wa min khalfī wa ʿan yamīnī wa ʿan shimālī wa min fawqī, wa aʿūdhu bi-ʿaẓamatika an ughtāla min taḥtī | O Allah, I ask You for well-being in this world and the next. O Allah, I ask You for pardon and well-being in my religion, my worldly life, my family and my wealth. O Allah, cover my faults and calm my fears. O Allah, guard me from in front, behind, my right, my left and above me, and I seek refuge in Your greatness from being struck down from beneath me | **Abu Dawud 5074**, sahih [V] (the tail end is the 'Uthman ibn Abi Shaybah wording [V partial]); Ibn Majah 3871 [V] | 1 morning, 1 evening |
| R72 | Thabbit qalbī ×10 (D30) | Duplicates R73 | Use R73, or the Muslim wording: اللَّهُمَّ مُصَرِّفَ الْقُلُوبِ صَرِّفْ قُلُوبَنَا عَلَى طَاعَتِكَ | Allāhumma muṣarrifal-qulūbi ṣarrif qulūbanā ʿalā ṭāʿatik | O Allah, Director of hearts, direct our hearts to Your obedience | **Muslim 2654** [V]. The mirror's `arabicnumber` shows 2655; sunnah.com uses 2654 | general |
| R75 | Ighfir lī mā qaddamtu (D30) | The Arabic mixes Muslim 771 and Muslim 2719, and the English ending ("There is no deity worthy of worship but You") doesn't match the Arabic | اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي، أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخِّرُ، وَأَنْتَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ | Allāhummagh-fir lī mā qaddamtu wa mā akhkhart, wa mā asrartu wa mā aʿlant, wa mā anta aʿlamu bihī minnī, antal-Muqaddimu wa antal-Muʾakhkhir, wa anta ʿalā kulli shayʾin qadīr | O Allah, forgive me what I have done before and what I have left for later, what I did in secret and what I did openly, and what You know better than I. You are the One who brings forward and the One who puts back, and You are able to do all things | **Muslim 2719** [V] | general |

#### FIX by labelling: invented phrasings with no specific claim

These are permissible as personal du'a. Give each a "personal du'a, not a narrated dhikr" label, or a `source: null` field that the UI renders as "general du'a". None should carry a hadith citation.

| R | Day | Arabic (app) | Note |
|---|---|---|---|
| R31 | D11 M | اللَّهُمَّ اجْعَلْنَا مِمَّن يُنفِقُ فَتُخْلِفُ لَهُ | Derived from the angels' du'a in Bukhari 1442 [M]. It is not itself narrated |
| R41 | D15 M | اللَّهُمَّ إِنِّي أَسْأَلُكَ الصِّدْقَ فِي الْقَوْلِ وَالْعَمَلِ | Invented |
| R45 | D17 M | اللَّهُمَّ إِنِّي أَسْأَلُكَ الصَّبْرَ عَلَى أَقْدَارِكَ | Invented |
| R47 | D17 E | اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْجَزَعِ | Invented. Fix the English: jaza' means panic or despair at hardship, not "anxiety" |
| R48 | D18 M | اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكِبْرِ وَالْعُجْبِ | Invented |
| R49 | D19 M | اللَّهُمَّ ارْحَمْنَا بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ | Invented, though it echoes Quran 7:156 |
| R52 | D20 M | اللَّهُمَّ بَارِكْ لِي فِي أَهْلِي وَمَالِي | Invented. It echoes the Prophet's du'a for Anas in Bukhari 6334 [M] |
| R53 | D20 E | اللَّهُمَّ اجْمَعْ شَمْلَ أَهْلِي عَلَى طَاعَتِكَ | Invented |
| R65 | D26 E | اللَّهُمَّ اجْعَلْنِي مِمَّن يُرَاقِبُكَ فِي السِّرِّ وَالْعَلَانِيَةِ | Invented. A narrated alternative is «اللَّهُمَّ إِنِّي أَسْأَلُكَ خَشْيَتَكَ فِي الْغَيْبِ وَالشَّهَادَةِ» (Allāhumma innī asʾaluka khashyataka fil-ghaybi wash-shahādah, "I ask You for fear of You in private and in public"), Nasa'i 1305, sahih [V for the hadith; the phrase is from memory] |
| R68 | D28 M | اللَّهُمَّ أَصْلِحْ أُمَّةَ مُحَمَّدٍ… | Invented, and commonly circulated without a source |
| R69 | D28 E | اللَّهُمَّ انْصُرِ الإِسْلَامَ وَالْمُسْلِمِينَ | Invented general du'a |

#### REPLACE: weak, mis-attributed or not a dhikr

| R | Day | App item | Why | Suggested replacement |
|---|---|---|---|---|
| R10 | D3 M | الصَّلَاةُ خَيْرٌ مِّنَ النَّوْمِ | This is a phrase of the Fajr adhan, not a dhikr to recite. The listener repeats it while answering the adhan | R37 (waking du'a) |
| R20 | D6 M | اللَّهُمَّ إِنِّي أَسْأَلُكَ قَلْبًا سَلِيمًا وَلِسَانًا صَادِقًا | Shaddad ibn Aws du'a: **Tirmidhi 3407 da'if; Nasa'i 1304 da'if** (al-Albani) [V] | R60 or R54 |
| R23 | D8 M | أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ ×3 | The ×3-in-the-morning version with its virtue is **Tirmidhi 2922 da'if** [V]. The isti'adha itself is valid (Quran 41:36; Abu Dawud 775 in salah) | R26, or the 3 Quls (B4) |
| R32 | D11 E | اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ | Weak pre-meal du'a (Ibn as-Sunni) | Bismillah before eating (Bukhari 5376 [M]), or R9 |
| R64 | D26 M | اللَّهُمَّ أَنتَ تَعْلَمُ سِرِّي وَعَلَانِيَتِي فَاقْبَلْ مَعْذِرَتِي | The weak "du'a of Adam" | R22 or R8 |
| R71 | D29 E | اللَّهُمَّ اهْدِ قَوْمِي فَإِنَّهُمْ لَا يَعْلَمُونَ | The narrated wording is «رَبِّ اغْفِرْ لِقَوْمِي فَإِنَّهُمْ لَا يَعْلَمُونَ», about an earlier prophet (Bukhari 3477) [M]. The app's wording is a common misquote | R70 |
| R74 | D30 E | اللَّهُمَّ إِنِّي أَسْأَلُكَ ثَبَاتًا فِي الأَمْرِ وَعَزِيمَةً عَلَى الرُّشْدِ | The same Shaddad du'a: Tirmidhi 3407 / Nasa'i 1304, **da'if** (al-Albani) [V] | R73 or R72 (Muslim 2654) |

### A.2 Per-day map

The order is morning items, then evening items. Row-level notes follow the arrow.

| Day | Morning | Evening |
|---|---|---|
| 1 | R1 KEEP · R2 KEEP · R3 **FIX** (count/context) | R4 KEEP (label "after salah"; add tahlil as the 100th) · R5 KEEP |
| 2 | R6 KEEP (relabel: after wudu) · R7 **FIX** (×1, end of a sitting) | R8 **FIX** (truncated) · R9 KEEP |
| 3 | R10 **REPLACE** · R11 **FIX** (complete it) | R4 KEEP (33/33/34 = bedtime set, Muslim 2727) |
| 4 | R12 KEEP · R13 **FIX** (complete it) | R14 KEEP · R15 KEEP |
| 5 | R16 KEEP (count general) · R17 KEEP | R18 KEEP · R19 KEEP |
| 6 | R20 **REPLACE** | R21 **FIX** · R9 KEEP |
| 7 | R22 KEEP (count general) | R8 KEEP (full text correct) |
| 8 | R23 **REPLACE** · R24 **FIX** · R25 KEEP (caveat) | R26 KEEP · R27 **FIX** |
| 9 | R28 **FIX** | R19 KEEP |
| 10 | R29 **FIX** | R30 KEEP (×10) |
| 11 | R31 FIX-label | R32 **REPLACE** · R9 KEEP |
| 12 | R33 KEEP | R34 KEEP · R5 KEEP (×100) |
| 13 | R35 **FIX** (count) · R36 **FIX** | R30 KEEP (×100); the translation is truncated |
| 14 | R37 KEEP · R38 KEEP | R39 KEEP · R40 **FIX** |
| 15 | R41 FIX-label | R42 KEEP · R5 KEEP |
| 16 | R43 **FIX** (optional full) | R44 KEEP |
| 17 | R45 FIX-label · R46 **FIX** (context) | R47 FIX-label · R9 KEEP |
| 18 | R48 FIX-label | R7 **FIX** (count) |
| 19 | R1 KEEP (×10 is general) · R49 FIX-label | R50 KEEP · R51 **FIX** |
| 20 | R52 FIX-label | R53 FIX-label · R9 KEEP |
| 21 | R54 KEEP | R55 **FIX** · R5 KEEP |
| 22 | R56 KEEP (after Fajr, ×1) | R57 KEEP · R9 KEEP |
| 23 | R58 KEEP | R59 KEEP |
| 24 | R60 KEEP | R61 KEEP |
| 25 | R62 KEEP | R63 **FIX** (label 'Umar) |
| 26 | R64 **REPLACE** | R65 FIX-label · R9 KEEP |
| 27 | R66 KEEP | R67 **FIX** · R22 KEEP; the translation says "the Magnificent", but the Arabic lacks الْعَظِيمَ, so align one with the other |
| 28 | R68 FIX-label | R69 FIX-label · R9 KEEP |
| 29 | R70 KEEP | R71 **REPLACE** · R28 **FIX** |
| 30 | R72 **FIX** (merge) · R73 KEEP (count "often") | R74 **REPLACE** · R75 **FIX** |

**Schema recommendation.** Add `source?: string` and `kind: 'quran' | 'hadith' | 'athar' | 'general'` to each dhikr item, and make the UI show "general du'a" whenever `kind === 'general'`. Also drop the narrated-looking counts (×3 or ×7) from items that have no narrated count. Use a neutral default such as ×1, or label the count "suggested".

---

## B1. Wudu: step by step

Quran 5:6 sets out the obligatory parts: face, arms to the elbows, wiping the head, and feet to the ankles. The full sunnah method follows 'Uthman's demonstration: **Bukhari 159 [V]** and **Muslim 226 [V]** (washing three times each; whoever does this and prays two focused rak'ahs has his past sins forgiven).

| # | Step | Evidence | Status by madhhab |
|---|---|---|---|
| 1 | **Intention** in the heart to purify for prayer. There is no need to say it aloud | "Actions are by intentions": Bukhari 1 [M] | Fard for Shafi'i, Maliki and Hanbali; sunnah for Hanafi (the wudu is still valid without it) |
| 2 | Say **«بِسْمِ اللَّهِ»** (Bismillāh) | Abu Dawud 101 [V] (al-Albani sahih by its supporting routes; Imam Ahmad said nothing in this chapter is firmly established) | Sunnah for the majority; Hanbali: wajib if remembered |
| 3 | Wash both **hands** up to the wrists, 3 times | Bukhari 159 [V] | Sunnah |
| 4 | **Rinse the mouth** and **sniff water into the nose and blow it out**, 3 times. One handful for both is fine | Bukhari 159, 185 [V] | Sunnah for Hanafi, Maliki and Shafi'i; **fard for Hanbali** |
| 5 | Wash the **face** from hairline to chin and ear to ear, 3 times | Quran 5:6; Bukhari 159 | Fard (all four) |
| 6 | Wash the **right arm** from fingertips up to and including the elbow, 3 times, then the left | Quran 5:6; Muslim 226 [V] (right then left) | Fard. Starting with the right is sunnah |
| 7 | **Wipe the head** once with wet hands, front to back and back to front | Bukhari 185 [V] | Fard. How much of the head: Hanafi a quarter; Shafi'i any part; Maliki and Hanbali the whole head |
| 8 | **Wipe the ears**, the inside with the index fingers and the back with the thumbs, once | Nasa'i 102, hasan sahih [V] | Sunnah (Hanbali counts the ears as part of the head) |
| 9 | Wash the **right foot** up to and including the ankle, 3 times, between the toes, then the left | Quran 5:6; Muslim 226 [V] | Fard |
| 10 | Keep the **order** above and do it **without long pauses** | 'Uthman's sequence; Quran 5:6 | Order: fard for Shafi'i and Hanbali. No pauses: fard for Maliki and Hanbali. Hanafi: both sunnah |

**Beginner note.** Washing each part once is valid, and so is twice (Bukhari 157 and 158 [M]). Three times is the full sunnah. Don't go beyond three.

**Du'a after wudu.** Verified as **Muslim 234 [V]** (Uqbah ibn Amir / 'Umar): "Whoever performs wudu well and then says this, the eight gates of Paradise are opened for him."

> أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ
> *Ashhadu an lā ilāha illallāhu waḥdahū lā sharīka lah, wa ashhadu anna Muḥammadan ʿabduhū wa rasūluh.*
> I bear witness that there is no god but Allah, alone without partner, and I bear witness that Muhammad is His servant and Messenger.

**Optional addition: Tirmidhi 55 [V].** «اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ» (Allāhummajʿalnī minat-tawwābīna wajʿalnī minal-mutaṭahhirīn, "O Allah, make me among those who repent and those who purify themselves"). The grading is disputed: al-Albani sahih, Zubair Ali Za'i da'if, and Tirmidhi himself noted *idtirab* (inconsistency in the chain). Show it as optional.

**Remove** the limb-by-limb du'as ("make dua after each step", Day 2 tip). They have no basis.

---

## B2. Salah for a beginner

### B2.0 Fard rak'ahs of the five daily prayers

This is by consensus (ijma'), from the Prophet's ﷺ practice. "Pray as you have seen me pray": Bukhari 631 [M].

| Prayer | Fard rak'ahs | Recitation |
|---|---|---|
| Fajr | 2 | Aloud |
| Dhuhr | 4 | Silent |
| Asr | 4 | Silent |
| Maghrib | 3 | Aloud in the first 2 |
| Isha | 4 | Aloud in the first 2 |

That is 17 fard rak'ahs a day. When praying alone, a woman (and a man in silent prayers) recites quietly enough to hear herself or himself.

### B2.1 Steps for a 2-rak'ah prayer (such as Fajr)

**Evidence.** The core of the "man who prayed badly" hadith (Bukhari 757 [V]; Muslim 397 [M]): takbir, then recitation, then bowing with stillness, standing straight, prostrating with stillness, sitting with stillness.

1. **Preparation.** Make wudu, have clean clothes and a clean place, cover the 'awrah, face the qiblah, and make the **intention** in the heart for the specific prayer ("Fajr, 2 rak'ahs"). Nothing has to be said aloud. Later Hanafi and Shafi'i scholars allow saying it quietly, but it is not required.
2. **Takbirat al-ihram.** Raise the hands to the shoulders or ears and say **«اللَّهُ أَكْبَرُ»** (Allāhu akbar, "Allah is the Greatest"). Evidence: Bukhari 735 [V]. It is a pillar in all four madhhabs.
   - **Where the hands rest:** Shafi'i and Hanbali, right over left on the chest or above the navel; Hanafi, below the navel for men; Maliki, commonly at the sides.
3. **Opening du'a (istiftah)**, which is sunnah. See B2.2.
4. **Seek refuge and say the Basmalah quietly.** «أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ، بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ» (Aʿūdhu billāhi minash-shayṭānir-rajīm. Bismillāhir-Raḥmānir-Raḥīm). Evidence: Quran 16:98.
5. **Recite Al-Fatihah** (B2.3) and say «آمِين» (Āmīn) at the end. Evidence: "There is no prayer for whoever does not recite Al-Fatihah," Bukhari 756 [V].
   - Al-Fatihah is a pillar for Shafi'i, Maliki and Hanbali; Hanafi rates it wajib.
   - **Behind an imam:** Shafi'i, recite it always. Hanafi, stay silent. Maliki and Hanbali, recite in the silent prayers and listen in the loud ones.
6. **Recite a short surah**, such as Al-Ikhlas (B2.4), in the first two rak'ahs. Evidence: Bukhari 776 [V].
7. **Ruku'.** Say «اللَّهُ أَكْبَرُ», bow with the back straight and the hands on the knees, and become still. Then say **«سُبْحَانَ رَبِّيَ الْعَظِيمِ»** (Subḥāna Rabbiyal-ʿAẓīm, "Glory be to my Lord, the Magnificent"). Evidence: **Muslim 772 [V]**; Abu Dawud 871 [V].
   - Count: once is valid. Three is the common minimum of perfection; the hadith that names "three" (Abu Dawud 886 / Tirmidhi 261) is **da'if** [V], but the practice is agreed upon.
   - Hanbali: saying it once is wajib.
8. **Rising (i'tidal).** While rising say **«سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ»** (Samiʿallāhu liman ḥamidah, "Allah hears whoever praises Him"). Once standing straight say **«رَبَّنَا وَلَكَ الْحَمْدُ»** (Rabbanā wa lakal-ḥamd, "Our Lord, and to You belongs all praise"). Evidence: **Bukhari 795 [V]**.
   - Optional addition: «حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ» (Bukhari 799 [V]).
   - Someone praying behind an imam says only «رَبَّنَا وَلَكَ الْحَمْدُ».
9. **Sujud.** Say «اللَّهُ أَكْبَرُ» and prostrate on seven bones (forehead with nose, both palms, both knees, the toes of both feet), then become still. Say **«سُبْحَانَ رَبِّيَ الْأَعْلَى»** (Subḥāna Rabbiyal-Aʿlā, "Glory be to my Lord, the Most High"). Evidence: **Muslim 772 [V]**. The count is as in ruku'.
   - Make du'a here too: "The closest a servant is to his Lord is while prostrating," Muslim 482 [V].
10. **Sitting between the two prostrations.** Say «اللَّهُ أَكْبَرُ», sit still, and say **«رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي»** (Rabbighfir lī, Rabbighfir lī, "My Lord, forgive me"). Evidence: **Abu Dawud 874; Nasa'i 1145 [V]**, sahih.
    - Fuller option: «اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَاهْدِنِي وَارْزُقْنِي» (Allāhummaghfir lī warḥamnī wajburnī wahdinī warzuqnī, "O Allah, forgive me, have mercy on me, mend me, guide me and provide for me"). Evidence: Tirmidhi 284 [V] (al-Albani sahih; Zubair Ali Za'i da'if).
11. **Second sujud**, the same as step 9.
12. **Stand for the second rak'ah** with «اللَّهُ أَكْبَرُ». Repeat steps 5 to 11; there is **no** opening du'a in this rak'ah.
13. **Final sitting.** Recite the **tashahhud** (B2.9), then the **salawat Ibrahimiyyah** (B2.10). Then make du'a; the recommended one is **Muslim 588 [V]**:
    > اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ
    > *Allāhumma innī aʿūdhu bika min ʿadhābi jahannam, wa min ʿadhābil-qabr, wa min fitnatil-maḥyā wal-mamāt, wa min sharri fitnatil-masīḥid-dajjāl.*
    > O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil of the trial of the False Messiah.
14. **Taslim.** Turn the head to the right and say **«السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ»** (As-salāmu ʿalaykum wa raḥmatullāh, "Peace and the mercy of Allah be upon you"). Then turn to the left and say the same. Evidence: Abu Dawud 996, sahih [V]; Muslim 582 [M].
    - **Madhhab status:** Shafi'i, the first taslim is a pillar and the second is sunnah. Hanbali, both are pillars in fard prayers. Maliki, one taslim is a pillar. Hanafi, the taslim is wajib.

### B2.1b How 3- and 4-rak'ah prayers differ

1. After the second rak'ah's two prostrations, sit for the **first tashahhud**. Recite it up to «…عَبْدُهُ وَرَسُولُهُ». Shafi'i also recommends adding the salawat here.
2. Stand with «اللَّهُ أَكْبَرُ», raising the hands (Shafi'i and Hanbali).
3. In the **3rd and 4th rak'ahs, recite Al-Fatihah only**, silently. Evidence: Bukhari 776 [V].
4. After the last rak'ah, do the **final sitting** (step 13) and the taslim. Maghrib has 3 rak'ahs; Dhuhr, Asr and Isha have 4.

**How you sit**, for completeness:
- Hanafi: *iftirash* (sitting on the left foot with the right foot upright) in both sittings.
- Shafi'i: *tawarruk* (sitting on the floor with the left foot under the right shin) in the final sitting of every prayer.
- Hanbali: tawarruk only in the final sitting of 3- and 4-rak'ah prayers.

**Raising the hands at ruku' and when rising from it:**
- Shafi'i and Hanbali: yes (Bukhari 735 [V]).
- Hanafi: only at the opening takbir.

### B2.2 Opening du'a (istiftah)

> سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ
> *Subḥānakallāhumma wa biḥamdik, wa tabārakasmuk, wa taʿālā jadduk, wa lā ilāha ghayruk.*
> Glory be to You, O Allah, and praise; blessed is Your name, exalted is Your majesty, and there is no god besides You.

**Source.**
- **Abu Dawud 776** (al-Albani sahih; Arna'ut sahih li-ghayrihi) [V]
- **Tirmidhi 243** [V]
- **Nasa'i 900** [V]
- **Ibn Majah 804** [V]
- 'Umar used to say it aloud to teach people: Muslim 399 [M; the mirror's 399 entry shows a different sub-narration]

**Confidence:** high. The individual chains have weaknesses, but the routes together make it sahih.

**Madhhab preferences:** Hanafi and Hanbali choose this du'a. Shafi'i prefers «وَجَّهْتُ وَجْهِيَ…» (Muslim 771 [V]). Maliki does not recite an istiftah in fard prayers.

### B2.3 Al-Fatihah (Quran 1:1-7)

Use a canonical Uthmani text (Tanzil or quran.com) in the app instead of hand-typed Arabic. The text below is for checking.

| # | Arabic | Transliteration | Meaning |
|---|---|---|---|
| 1 | بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ | Bismillāhir-Raḥmānir-Raḥīm | In the name of Allah, the Most Gracious, the Most Merciful. |
| 2 | الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ | Al-ḥamdu lillāhi Rabbil-ʿālamīn | All praise is for Allah, Lord of all the worlds, |
| 3 | الرَّحْمَٰنِ الرَّحِيمِ | Ar-Raḥmānir-Raḥīm | the Most Gracious, the Most Merciful, |
| 4 | مَالِكِ يَوْمِ الدِّينِ | Māliki yawmid-dīn | Master of the Day of Judgement. |
| 5 | إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ | Iyyāka naʿbudu wa iyyāka nastaʿīn | You alone we worship, and You alone we ask for help. |
| 6 | اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ | Ihdinaṣ-ṣirāṭal-mustaqīm | Guide us to the straight path, |
| 7 | صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ | Ṣirāṭal-ladhīna anʿamta ʿalayhim, ghayril-maghḍūbi ʿalayhim wa laḍ-ḍāllīn | the path of those You have blessed, not of those who earned [Your] anger, nor of those who went astray. |

**On the Basmalah:** in the Hafs/Kufan count it is ayah 1. Shafi'i treats it as part of Al-Fatihah. Hanafi and Hanbali say it quietly but don't count it as part of the surah. Maliki does not recite it in fard prayers.

### B2.4 Al-Ikhlas (Quran 112)

| # | Arabic | Transliteration | Meaning |
|---|---|---|---|
| 1 | قُلْ هُوَ اللَّهُ أَحَدٌ | Qul huwallāhu aḥad | Say: He is Allah, the One. |
| 2 | اللَّهُ الصَّمَدُ | Allāhuṣ-ṣamad | Allah, the Self-Sufficient on whom all depend. |
| 3 | لَمْ يَلِدْ وَلَمْ يُولَدْ | Lam yalid wa lam yūlad | He neither begets nor was He begotten, |
| 4 | وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ | Wa lam yakul-lahū kufuwan aḥad | and there is none comparable to Him. |

### B2.5–B2.8 Dhikr inside the prayer

These are covered in steps 7 to 10 of B2.1:
- Ruku': Muslim 772
- Rising: Bukhari 795
- Sujud: Muslim 772
- Between the two prostrations: Abu Dawud 874

### B2.9 Tashahhud (Ibn Mas'ud's version)

Source: **Bukhari 831 [V]**, verbatim.

> التَّحِيَّاتُ لِلَّهِ، وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ
> *At-taḥiyyātu lillāhi waṣ-ṣalawātu waṭ-ṭayyibāt. As-salāmu ʿalayka ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu ʿalaynā wa ʿalā ʿibādillāhiṣ-ṣāliḥīn. Ashhadu an lā ilāha illallāh, wa ashhadu anna Muḥammadan ʿabduhū wa rasūluh.*
> All greetings, prayers and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and Messenger.

**Madhhab preferences:** Hanafi and Hanbali use this version. Shafi'i prefers Ibn 'Abbas's version (Muslim 403 [M]) and Maliki prefers 'Umar's (Muwatta) [M]. All three are valid.

### B2.10 Salawat Ibrahimiyyah

Source: **Bukhari 3370 [V]**, verbatim (Ka'b ibn 'Ujrah).

> اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ، وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ
> *Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka Ḥamīdun Majīd. Allāhumma bārik ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā bārakta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka Ḥamīdun Majīd.*
> O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious.

**Status in the final sitting:** a pillar for Shafi'i and Hanbali; sunnah for Hanafi and Maliki.

### B2.11 Taslim

See step 14 of B2.1. The evidence is Abu Dawud 996 [V].

---

## B3. Pillars

### Five pillars of Islam

Source: **Bukhari 8 [V]** (Ibn 'Umar): «بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ…». Bukhari's order puts Hajj before fasting; Muslim 16 [M] puts fasting first. The usual teaching order is the one below.

| # | Arabic | Transliteration | One line |
|---|---|---|---|
| 1 | الشَّهَادَتَانِ | Ash-Shahādatān | Testifying that there is no god but Allah and that Muhammad is the Messenger of Allah. |
| 2 | إِقَامُ الصَّلَاةِ | Iqāmuṣ-ṣalāh | Establishing the five daily prayers on time. |
| 3 | إِيتَاءُ الزَّكَاةِ | Ītāʾuz-zakāh | Paying the obligatory annual alms, 2.5% of savings above the nisab threshold. |
| 4 | صَوْمُ رَمَضَانَ | Ṣawmu Ramaḍān | Fasting from dawn to sunset throughout Ramadan. |
| 5 | حَجُّ الْبَيْتِ | Ḥajjul-Bayt | Pilgrimage to the Ka'bah once in a lifetime for those who are able. |

### Six pillars of iman

Source: **Muslim 8 [V]** (the hadith of Jibril, narrated by 'Umar). The wording is «أَنْ تُؤْمِنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْآخِرِ وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ». I confirmed that the hadith is present; the Arabic wording here is quoted from memory and matches standard prints.

| # | Arabic | Transliteration | One line |
|---|---|---|---|
| 1 | الْإِيمَانُ بِاللَّهِ | Al-īmānu billāh | Believing in Allah: His existence, His Oneness in lordship and worship, and His names and attributes. |
| 2 | الْإِيمَانُ بِالْمَلَائِكَةِ | …bil-malāʾikah | Believing in the angels, created from light, who obey Allah (such as Jibril). |
| 3 | الْإِيمَانُ بِالْكُتُبِ | …bil-kutub | Believing in the books Allah revealed (Torah, Psalms, Gospel, Quran), with the Quran the final and preserved one. |
| 4 | الْإِيمَانُ بِالرُّسُلِ | …bir-rusul | Believing in all the messengers, from Adam and Nuh to Muhammad ﷺ, the last of them. |
| 5 | الْإِيمَانُ بِالْيَوْمِ الْآخِرِ | …bil-yawmil-ākhir | Believing in the Last Day: death, the grave, resurrection, judgement, Paradise and Hell. |
| 6 | الْإِيمَانُ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ | …bil-qadari khayrihī wa sharrih | Believing that everything, good and bad, happens by Allah's knowledge, writing, will and creation. |

---

## B4. Core morning and evening adhkar

This is the core set from the Hisn al-Muslim morning/evening chapter. I give no Hisn item numbers, because they differ between editions.

| # | Arabic | Transliteration | Meaning | Count | Source / grade |
|---|---|---|---|---|---|
| 1 | **Ayat al-Kursi** (Quran 2:255): اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ… (use the canonical text) | Allāhu lā ilāha illā huwal-Ḥayyul-Qayyūm… | "Allah, there is no god but Him, the Ever-Living, the Sustainer…" | 1 morning, 1 evening | Morning/evening: Nasa'i al-Kubra / Hakim (Ubayy ibn Ka'b), sahih per al-Albani (Sahih at-Targhib) [S]. At bedtime: **Bukhari 2311 [V]** |
| 2 | **Al-Ikhlas, Al-Falaq, An-Nas** (Quran 112–114) | Qul huwallāhu aḥad… / Qul aʿūdhu bi-rabbil-falaq… / Qul aʿūdhu bi-rabbin-nās… | "They will suffice you against everything" | **3 each**, morning and evening | **Abu Dawud 5082**, hasan (al-Albani; Arna'ut hasan sahih) [V]; Tirmidhi 3575 [M] |
| 3 | أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ… / أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ… (full text at R27) | Aṣbaḥnā wa aṣbaḥal-mulku lillāh… | See R27 | 1 | **Muslim 2723 [V]** |
| 4 | اللَّهُمَّ بِكَ أَصْبَحْنَا… / اللَّهُمَّ بِكَ أَمْسَيْنَا… (R12/R14) | Allāhumma bika aṣbaḥnā… | See R12 | 1 | Abu Dawud 5068, sahih [V] |
| 5 | Sayyid al-istighfar (R8) | Allāhumma anta Rabbī… | See R8 | 1 | **Bukhari 6306 [V]** |
| 6 | اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ | Allāhumma ʿĀlimal-ghaybi wash-shahādah, Fāṭiras-samāwāti wal-arḍ, Rabba kulli shayʾin wa malīkah, ashhadu an lā ilāha illā ant, aʿūdhu bika min sharri nafsī, wa min sharrish-shayṭāni wa shirkih | O Allah, Knower of the unseen and the seen, Creator of the heavens and earth, Lord and Sovereign of all things: I bear witness there is no god but You; I seek refuge in You from the evil of my own self and from the evil of Satan and his call to shirk | 1 morning, 1 evening, and at bedtime | **Tirmidhi 3392**, sahih [V] (the instruction to Abu Bakr) |
| 7 | بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ… (R26) | Bismillāhil-ladhī lā yaḍurru… | See R26 | **3** | **Abu Dawud 5088 [V]**; Tirmidhi 3388 [V] |
| 8 | سُبْحَانَ اللَّهِ وَبِحَمْدِهِ | SubḥānAllāhi wa biḥamdih | Glory be to Allah and praise be to Him | **100** | **Muslim 2692 [V]** |
| +9 | Al-'afiyah du'a (R67) | Allāhumma innī asʾalukal-ʿāfiyah… | See R67 | 1 | Abu Dawud 5074, sahih [V] |
| +10 | **Evening only:** أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (R15) | Aʿūdhu bi-kalimātillāhit-tāmmāti min sharri mā khalaq | See R15 | 3 | **Muslim 2709 [V]** |

**Deliberately excluded:**
- «رَضِيتُ بِاللَّهِ رَبًّا…» ×3 in the morning and evening. That version (Tirmidhi 3389 / Ibn Majah 3870) is **da'if per al-Albani** [V]. The phrase on its own, without the count, is sahih in Abu Dawud 1529 [V].
- «حَسْبِيَ اللَّهُ…» ×7. It is mawquf; see R25.

---

## Open doubts

1. **sunnah.com is still unreachable.** Every [V] item was checked against the fawazahmed0 mirror, using Abd al-Baqi numbers for Muslim.
   - **Muslim 2654 vs 2655:** the mirror's `arabicnumber` puts «مُصَرِّفَ الْقُلُوبِ» at 2655, but sunnah.com and the standard references use 2654. Confirm before release.
   - **Muslim 399:** the mirror entry did not show 'Umar's istiftah narration, so check sunnah.com.
2. **[S] items not in the mirror.** These numbers or gradings come from memory or secondary knowledge:
   - Ahmad: "Aṣbaḥnā ʿalā fiṭratil-Islām"; "rabīʿ qalbī", Ahmad 3712 / as-Sahihah 199; "aḥsanta khalqī", Irwa' 74
   - al-Adab al-Mufrad 716 (refuge from shirk)
   - Ayat al-Kursi morning/evening (Nasa'i al-Kubra / Sahih at-Targhib)
   - The long morning/evening form of "Yā Ḥayyu yā Qayyūm"
   - Subḥānaka… after wudu (Nasa'i al-Kubra)
   - 'Umar's du'a (az-Zuhd)
3. **[M] numbers, recalled and not looked up:** Bukhari 1, 157/158, 631, 1442, 3477, 5376, 6307, 6334, 6406; Muslim 16, 397, 403, 408, 582, 918, 2693; Tirmidhi 3505, 3575.
4. **Disputed gradings kept as KEEP or FIX.** In each case al-Albani accepts the hadith and Zubair Ali Za'i weakens it:
   - Abu Dawud 5090 ("ʿāfinī fī badanī")
   - Tirmidhi 3401, 3502 and 284
   - Abu Dawud 1547
   - Ibn Majah 925
   - Tirmidhi 55 (after-wudu addition)

   If Awdah wants only material with no disagreement, swap these out.
5. **Abu Dawud 5081 (Ḥasbiyallāh ×7)** is the most sensitive item. Al-Albani graded the narration "whether sincere or lying" *mawdu'*. The verse itself is Quran 9:129, and saying it is fine. Present the ×7 practice as a report from Abu ad-Darda', **never** as a prophetic promise.
6. **Abu Dawud 5074:** the tail «وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي» was cut off in my extract (the rest of the text was verified). It is the standard ending in Hisn al-Muslim, but confirm it.
7. **Quran text** (Al-Fatihah, Al-Ikhlas, the Ayat al-Kursi opening, 3:191, 7:23, 40:7) was typed by hand. Source the app's Quran text from Tanzil or quran.com Uthmani data and don't copy from this file.
8. **Madhhab notes are brief summaries** of the well-known positions in each school. They are suitable for a beginner app; for a fuller treatment, have a qualified teacher from each madhhab review them.

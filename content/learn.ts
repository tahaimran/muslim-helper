import type { PrayerName } from '../lib/types';
import type { Dhikr, Source, SourcedText } from './types';

// Sources: docs/content-sources/verification-2.md sections B1-B4. Hadith wordings were checked
// word-for-word against the fawazahmed0 hadith-api mirror of sunnah.com (Muslim by Abd al-Baqi
// number). Quran Arabic is fetched from fawazahmed0/quran-api (ara-quranuthmanihaf), never
// hand-typed.

export interface LearnStep {
  id: string;
  title: string;
  body: string;
  recite?: { arabic: string; transliteration: string; meaning: string; source: Source | null };
}

const hadith = (ref: string, grade: 'sahih' | 'hasan' = 'sahih'): Source => ({
  kind: 'hadith',
  ref,
  grade,
});
const quran = (ref: string): Source => ({ kind: 'quran', ref, grade: null });

// ---------------------------------------------------------------------------
// Quran text (fetched, normalised; ayah-end markers added)
// ---------------------------------------------------------------------------

const AL_FATIHAH = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ﴿١﴾ ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ ﴿٢﴾ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ﴿٣﴾ مَٰلِكِ يَوۡمِ ٱلدِّينِ ﴿٤﴾ إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ ﴿٥﴾ ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ ﴿٦﴾ صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ ﴿٧﴾';
const AL_IKHLAS = 'قُلۡ هُوَ ٱللَّهُ أَحَدٌ ﴿١﴾ ٱللَّهُ ٱلصَّمَدُ ﴿٢﴾ لَمۡ يَلِدۡ وَلَمۡ يُولَدۡ ﴿٣﴾ وَلَمۡ يَكُن لَّهُۥ كُفُوًا أَحَدُۢ ﴿٤﴾';
const AL_FALAQ = 'قُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلۡعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾';
const AN_NAS = 'قُلۡ أَعُوذُ بِرَبِّ ٱلنَّاسِ ﴿١﴾ مَلِكِ ٱلنَّاسِ ﴿٢﴾ إِلَٰهِ ٱلنَّاسِ ﴿٣﴾ مِن شَرِّ ٱلۡوَسۡوَاسِ ٱلۡخَنَّاسِ ﴿٤﴾ ٱلَّذِي يُوَسۡوِسُ فِي صُدُورِ ٱلنَّاسِ ﴿٥﴾ مِنَ ٱلۡجِنَّةِ وَٱلنَّاسِ ﴿٦﴾';
const AYAT_AL_KURSI = 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلۡحَيُّ ٱلۡقَيُّومُۚ لَا تَأۡخُذُهُۥ سِنَةࣱ وَلَا نَوۡمࣱۚ لَّهُۥ مَا فِي ٱلسَّمَٰوَٰتِ وَمَا فِي ٱلۡأَرۡضِۗ مَن ذَا ٱلَّذِي يَشۡفَعُ عِندَهُۥٓ إِلَّا بِإِذۡنِهِۦۚ يَعۡلَمُ مَا بَيۡنَ أَيۡدِيهِمۡ وَمَا خَلۡفَهُمۡۖ وَلَا يُحِيطُونَ بِشَيۡءࣲ مِّنۡ عِلۡمِهِۦٓ إِلَّا بِمَا شَآءَۚ وَسِعَ كُرۡسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلۡأَرۡضَۖ وَلَا يَـُٔودُهُۥ حِفۡظُهُمَاۚ وَهُوَ ٱلۡعَلِيُّ ٱلۡعَظِيمُ ﴿٢٥٥﴾';

// ---------------------------------------------------------------------------
// Wudu (B1). Quran 5:6 sets the obligatory parts; the sunnah method is 'Uthman's
// demonstration (Bukhari 159; Muslim 226).
// ---------------------------------------------------------------------------

export const WUDU_STEPS: LearnStep[] = [
  {
    id: 'wudu_intention',
    title: 'Intend in your heart',
    body: 'Intend in your heart that you are purifying yourself for prayer; there is nothing to say out loud. Most scholars count this intention as required, while Hanafis count it as sunnah.',
  },
  {
    id: 'wudu_bismillah',
    title: 'Say Bismillah',
    body: 'Begin by mentioning the name of Allah.',
    recite: {
      arabic: 'بِسْمِ اللَّهِ',
      transliteration: 'Bismillāh',
      meaning: 'In the name of Allah',
      source: hadith('Nasa\'i 78; Abu Dawud 101'),
    },
  },
  {
    id: 'wudu_hands',
    title: 'Wash your hands',
    body: 'Wash both hands up to the wrists, three times.',
  },
  {
    id: 'wudu_mouth_nose',
    title: 'Mouth and nose',
    body: 'Rinse your mouth and sniff water into your nose and blow it out, three times. One handful of water for both is fine.',
  },
  {
    id: 'wudu_face',
    title: 'Wash your face',
    body: 'Wash your whole face, from the hairline to the chin and from ear to ear, three times.',
  },
  {
    id: 'wudu_arms',
    title: 'Wash your arms',
    body: 'Wash your right arm from the fingertips up to and including the elbow, three times, then the left.',
  },
  {
    id: 'wudu_head',
    title: 'Wipe your head',
    body: 'Wipe your head once with wet hands, from front to back and back to the front again. Hanafi and Shafi\'i differ on how much must be wiped; wiping the whole head, as the Prophet ﷺ did, is the sunnah.',
  },
  {
    id: 'wudu_ears',
    title: 'Wipe your ears',
    body: 'Wipe the inside of your ears with your index fingers and the back with your thumbs, once.',
  },
  {
    id: 'wudu_feet',
    title: 'Wash your feet',
    body: 'Wash your right foot up to and including the ankle, three times, getting between the toes, then the left.',
  },
  {
    id: 'wudu_order',
    title: 'Keep the order, no long pauses',
    body: 'Do the steps in this order and without long breaks in between. Washing each part once or twice is valid too; three times is the full sunnah, so don\'t go beyond three.',
  },
];

export const DUA_AFTER_WUDU: SourcedText = {
  arabic:
    'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
  transliteration:
    'Ashhadu an lā ilāha illallāhu waḥdahū lā sharīka lah, wa ashhadu anna Muḥammadan ʿabduhū wa rasūluh',
  meaning:
    'I bear witness that there is no god but Allah, alone without partner, and I bear witness that Muhammad is His servant and Messenger. (Whoever makes wudu and says this, the eight gates of Paradise are opened for him.)',
  source: hadith('Muslim 234'),
};

// ---------------------------------------------------------------------------
// Salah (B2): a 2-rak'ah prayer such as Fajr, start to finish. Core evidence: the
// hadith of the man who prayed badly (Bukhari 757) and "Pray as you have seen me pray".
// ---------------------------------------------------------------------------

export const SALAH_STEPS: LearnStep[] = [
  {
    id: 'salah_prepare',
    title: 'Get ready',
    body: 'Make wudu, cover yourself properly and face the qiblah. Intend in your heart which prayer you are praying (for example, Fajr, 2 rak\'ahs); nothing needs to be said aloud.',
  },
  {
    id: 'salah_takbir',
    title: 'Begin with Allahu akbar',
    body: 'Raise your hands to your shoulders or ears and say Allahu akbar, then rest your right hand over your left. Hanafi and Shafi\'i differ on where the hands rest: below the navel (Hanafi) or on the chest, above the navel (Shafi\'i).',
    recite: {
      arabic: 'اللَّهُ أَكْبَرُ',
      transliteration: 'Allāhu akbar',
      meaning: 'Allah is the Greatest',
      source: hadith('Ibn Majah 803'),
    },
  },
  {
    id: 'salah_opening_dua',
    title: 'Opening du‘a',
    body: 'Quietly say this short opening du‘a. It is sunnah, so your prayer is still valid while you are learning it.',
    recite: {
      arabic:
        'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ',
      transliteration: 'Subḥānakallāhumma wa biḥamdik, wa tabārakasmuk, wa taʿālā jadduk, wa lā ilāha ghayruk',
      meaning:
        'Glory be to You, O Allah, and praise; blessed is Your name, exalted is Your majesty, and there is no god besides You.',
      source: hadith('Abu Dawud 776'),
    },
  },
  {
    id: 'salah_istiadhah',
    title: 'Seek refuge',
    body: 'Quietly seek refuge in Allah before you recite.',
    recite: {
      arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
      transliteration: 'Aʿūdhu billāhi minash-shayṭānir-rajīm',
      meaning: 'I seek refuge in Allah from Shaytan, the accursed.',
      source: quran('Quran 16:98'),
    },
  },
  {
    id: 'salah_fatihah',
    title: 'Recite Al-Fatihah',
    body: 'Recite Al-Fatihah, then say Āmīn. The Prophet ﷺ said there is no prayer without it (Bukhari 756).',
    recite: {
      arabic: AL_FATIHAH,
      transliteration:
        'Bismillāhir-Raḥmānir-Raḥīm. Al-ḥamdu lillāhi Rabbil-ʿālamīn. Ar-Raḥmānir-Raḥīm. Māliki yawmid-dīn. Iyyāka naʿbudu wa iyyāka nastaʿīn. Ihdinaṣ-ṣirāṭal-mustaqīm. Ṣirāṭal-ladhīna anʿamta ʿalayhim, ghayril-maghḍūbi ʿalayhim wa laḍ-ḍāllīn.',
      meaning:
        'In the name of Allah, the Most Gracious, the Most Merciful. All praise is for Allah, Lord of all the worlds, the Most Gracious, the Most Merciful, Master of the Day of Judgement. You alone we worship, and You alone we ask for help. Guide us to the straight path, the path of those You have blessed, not of those who earned Your anger, nor of those who went astray.',
      source: quran('Quran 1:1-7'),
    },
  },
  {
    id: 'salah_short_surah',
    title: 'Recite a short surah',
    body: 'In the first two rak\'ahs, recite a short surah after Al-Fatihah. Al-Ikhlas is a good one to start with.',
    recite: {
      arabic: AL_IKHLAS,
      transliteration: 'Qul huwallāhu aḥad. Allāhuṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakul-lahū kufuwan aḥad.',
      meaning:
        'Say: He is Allah, the One. Allah, the Self-Sufficient on whom all depend. He neither begets nor was He begotten, and there is none comparable to Him.',
      source: quran('Quran 112:1-4'),
    },
  },
  {
    id: 'salah_ruku',
    title: 'Bow (ruku‘)',
    body: 'Say Allahu akbar and bow with your back straight and hands on your knees, and be still. Say this; once is valid, and it is commonly said three times.',
    recite: {
      arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
      transliteration: 'Subḥāna Rabbiyal-ʿAẓīm',
      meaning: 'Glory be to my Lord, the Magnificent',
      source: hadith('Muslim 772'),
    },
  },
  {
    id: 'salah_rising',
    title: 'Stand back up',
    body: 'Rise saying the first phrase, then once you are standing straight say the second. Behind an imam, say only the second.',
    recite: {
      arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ',
      transliteration: 'Samiʿallāhu liman ḥamidah. Rabbanā wa lakal-ḥamd',
      meaning: 'Allah hears whoever praises Him. Our Lord, and to You belongs all praise.',
      source: hadith('Bukhari 735'),
    },
  },
  {
    id: 'salah_sujud',
    title: 'Prostrate (sujud)',
    body: 'Say Allahu akbar and prostrate on forehead and nose, palms, knees and toes, and be still. This is the closest you are to your Lord, so make du‘a here too (Muslim 482).',
    recite: {
      arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
      transliteration: 'Subḥāna Rabbiyal-Aʿlā',
      meaning: 'Glory be to my Lord, the Most High',
      source: hadith('Muslim 772'),
    },
  },
  {
    id: 'salah_sitting',
    title: 'Sit between the prostrations',
    body: 'Say Allahu akbar, sit up and be still for a moment.',
    recite: {
      arabic: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
      transliteration: 'Rabbighfir lī, Rabbighfir lī',
      meaning: 'My Lord, forgive me. My Lord, forgive me.',
      source: hadith('Abu Dawud 874'),
    },
  },
  {
    id: 'salah_second_sujud',
    title: 'Prostrate again',
    body: 'Say Allahu akbar and make a second prostration, just like the first.',
  },
  {
    id: 'salah_second_rakah',
    title: 'Stand for the second rak‘ah',
    body: 'Stand up with Allahu akbar and repeat everything from Al-Fatihah to the second prostration. There is no opening du‘a this time.',
  },
  {
    id: 'salah_tashahhud',
    title: 'Sit for the tashahhud',
    body: 'After the second rak\'ah\'s prostrations, sit and recite the tashahhud.',
    recite: {
      arabic:
        'التَّحِيَّاتُ لِلَّهِ، وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      transliteration:
        'At-taḥiyyātu lillāhi waṣ-ṣalawātu waṭ-ṭayyibāt. As-salāmu ʿalayka ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu ʿalaynā wa ʿalā ʿibādillāhiṣ-ṣāliḥīn. Ashhadu an lā ilāha illallāh, wa ashhadu anna Muḥammadan ʿabduhū wa rasūluh.',
      meaning:
        'All greetings, prayers and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and Messenger.',
      source: hadith('Bukhari 831'),
    },
  },
  {
    id: 'salah_salawat',
    title: 'Send blessings on the Prophet ﷺ',
    body: 'Still sitting, send blessings on the Prophet ﷺ.',
    recite: {
      arabic:
        'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ، وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
      transliteration:
        'Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka Ḥamīdun Majīd. Allāhumma bārik ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā bārakta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka Ḥamīdun Majīd.',
      meaning:
        'O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious.',
      source: hadith('Bukhari 3370'),
    },
  },
  {
    id: 'salah_final_dua',
    title: 'A du‘a before ending',
    body: 'Before the salam, seek refuge in Allah from these four things, then ask Him for whatever you need.',
    recite: {
      arabic:
        'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
      transliteration:
        'Allāhumma innī aʿūdhu bika min ʿadhābi jahannam, wa min ʿadhābil-qabr, wa min fitnatil-maḥyā wal-mamāt, wa min sharri fitnatil-masīḥid-dajjāl',
      meaning:
        'O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil of the trial of the False Messiah.',
      source: hadith('Muslim 588'),
    },
  },
  {
    id: 'salah_taslim',
    title: 'End with salam',
    body: 'Turn your head to the right and say the salam, then turn to the left and say it again. Your prayer is complete, alhamdulillah.',
    recite: {
      arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
      transliteration: 'As-salāmu ʿalaykum wa raḥmatullāh',
      meaning: 'Peace and the mercy of Allah be upon you',
      source: hadith('Abu Dawud 996'),
    },
  },
];

export const SALAH_NOTES: { id: string; title: string; body: string }[] = [
  {
    id: 'three_four_rakahs',
    title: '3- and 4-rak‘ah prayers',
    body: 'After the second rak\'ah, sit and recite the tashahhud only up to "ʿabduhū wa rasūluh", then stand with Allahu akbar. In the 3rd and 4th rak\'ahs recite only Al-Fatihah, silently, then finish with the full final sitting and the salam.',
  },
  {
    id: 'aloud_or_silent',
    title: 'Aloud or silent',
    body: 'Fajr is recited aloud, and so are the first two rak\'ahs of Maghrib and Isha. Dhuhr and Asr are recited silently.',
  },
  {
    id: 'madhhab_details',
    title: 'Small differences between madhhabs',
    body: 'Hanafi and Shafi\'i differ on a few details, such as where the hands rest, raising the hands at ruku‘, how you sit, and reciting Al-Fatihah behind an imam. Follow one trusted teacher or madhhab; every one of these ways is valid.',
  },
];

export const RAKAH_COUNTS: { prayer: PrayerName; fard: number }[] = [
  { prayer: 'fajr', fard: 2 },
  { prayer: 'dhuhr', fard: 4 },
  { prayer: 'asr', fard: 4 },
  { prayer: 'maghrib', fard: 3 },
  { prayer: 'isha', fard: 4 },
];

// ---------------------------------------------------------------------------
// Pillars (B3)
// ---------------------------------------------------------------------------

export const PILLARS_OF_ISLAM: { id: string; name: string; arabic: string; meaning: string }[] = [
  {
    id: 'shahadah',
    name: 'Shahadah',
    arabic: 'الشَّهَادَتَانِ',
    meaning: 'Testifying that there is no god but Allah and that Muhammad is the Messenger of Allah.',
  },
  {
    id: 'salah',
    name: 'Salah',
    arabic: 'إِقَامُ الصَّلَاةِ',
    meaning: 'Establishing the five daily prayers on time.',
  },
  {
    id: 'zakah',
    name: 'Zakah',
    arabic: 'إِيتَاءُ الزَّكَاةِ',
    meaning: 'Paying the yearly obligatory charity: 2.5% of savings held above the nisab threshold.',
  },
  {
    id: 'sawm',
    name: 'Fasting Ramadan',
    arabic: 'صَوْمُ رَمَضَانَ',
    meaning: 'Fasting from dawn to sunset throughout the month of Ramadan.',
  },
  {
    id: 'hajj',
    name: 'Hajj',
    arabic: 'حَجُّ الْبَيْتِ',
    meaning: 'Pilgrimage to the Ka‘bah once in a lifetime, for those who are able.',
  },
];

export const PILLARS_OF_IMAN: { id: string; name: string; arabic: string; meaning: string }[] = [
  {
    id: 'allah',
    name: 'Belief in Allah',
    arabic: 'الْإِيمَانُ بِاللَّهِ',
    meaning: 'Believing that Allah exists, that He alone is Lord and alone deserves worship, and in His names and attributes.',
  },
  {
    id: 'angels',
    name: 'Belief in the angels',
    arabic: 'الْإِيمَانُ بِالْمَلَائِكَةِ',
    meaning: 'Believing in the angels, created from light, who always obey Allah, such as Jibril.',
  },
  {
    id: 'books',
    name: 'Belief in the books',
    arabic: 'الْإِيمَانُ بِالْكُتُبِ',
    meaning: 'Believing in the books Allah revealed, such as the Torah and the Gospel, with the Quran as the final, preserved one.',
  },
  {
    id: 'messengers',
    name: 'Belief in the messengers',
    arabic: 'الْإِيمَانُ بِالرُّسُلِ',
    meaning: 'Believing in all of Allah\'s messengers, from Nuh to Muhammad ﷺ, the last of them.',
  },
  {
    id: 'last_day',
    name: 'Belief in the Last Day',
    arabic: 'الْإِيمَانُ بِالْيَوْمِ الْآخِرِ',
    meaning: 'Believing in what comes after death: the grave, the resurrection, the judgement, Paradise and Hell.',
  },
  {
    id: 'qadar',
    name: 'Belief in the divine decree',
    arabic: 'الْإِيمَانُ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ',
    meaning: 'Believing that everything, good and bad, happens by Allah\'s knowledge, writing, will and creation.',
  },
];

export const PILLARS_SOURCES: { islam: Source; iman: Source } = {
  islam: hadith('Bukhari 8; Muslim 16'),
  iman: hadith('Muslim 8'),
};

// ---------------------------------------------------------------------------
// Morning and evening adhkar (B4, the Hisn al-Muslim core set)
// ---------------------------------------------------------------------------

const AYAT_AL_KURSI_DHIKR: Dhikr = {
  id: 'ayat_al_kursi',
  arabic: AYAT_AL_KURSI,
  transliteration:
    'Allāhu lā ilāha illā huwal-Ḥayyul-Qayyūm. Lā taʾkhudhuhū sinatun wa lā nawm. Lahū mā fis-samāwāti wa mā fil-arḍ. Man dhal-ladhī yashfaʿu ʿindahū illā bi-idhnih. Yaʿlamu mā bayna aydīhim wa mā khalfahum, wa lā yuḥīṭūna bi-shayʾin min ʿilmihī illā bimā shāʾ. Wasiʿa kursiyyuhus-samāwāti wal-arḍ, wa lā yaʾūduhū ḥifẓuhumā, wa huwal-ʿAliyyul-ʿAẓīm.',
  meaning:
    'Allah: there is no god but Him, the Ever-Living, the Sustainer of all. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and the earth. Who could intercede with Him except by His permission? He knows what is before them and what is behind them, and they grasp nothing of His knowledge except what He wills. His Kursi extends over the heavens and the earth, and guarding them does not tire Him. He is the Most High, the Magnificent.',
  count: 1,
  source: quran('Quran 2:255'),
};

const THREE_QULS = hadith('Abu Dawud 5082', 'hasan');

const QULS: Dhikr[] = [
  {
    id: 'surah_ikhlas',
    arabic: AL_IKHLAS,
    transliteration: 'Qul huwallāhu aḥad. Allāhuṣ-ṣamad. Lam yalid wa lam yūlad. Wa lam yakul-lahū kufuwan aḥad.',
    meaning:
      'Al-Ikhlas: Say: He is Allah, the One. Allah, the Self-Sufficient on whom all depend. He neither begets nor was He begotten, and there is none comparable to Him.',
    count: 3,
    source: THREE_QULS,
  },
  {
    id: 'surah_falaq',
    arabic: AL_FALAQ,
    transliteration:
      'Qul aʿūdhu bi-Rabbil-falaq. Min sharri mā khalaq. Wa min sharri ghāsiqin idhā waqab. Wa min sharrin-naffāthāti fil-ʿuqad. Wa min sharri ḥāsidin idhā ḥasad.',
    meaning:
      'Al-Falaq: Say: I seek refuge in the Lord of daybreak, from the evil of what He created, from the evil of darkness when it settles, from the evil of those who blow on knots, and from the evil of an envier when he envies.',
    count: 3,
    source: THREE_QULS,
  },
  {
    id: 'surah_nas',
    arabic: AN_NAS,
    transliteration:
      'Qul aʿūdhu bi-Rabbin-nās. Malikin-nās. Ilāhin-nās. Min sharril-waswāsil-khannās. Alladhī yuwaswisu fī ṣudūrin-nās. Minal-jinnati wan-nās.',
    meaning:
      'An-Nas: Say: I seek refuge in the Lord of mankind, the King of mankind, the God of mankind, from the evil of the retreating whisperer, who whispers into the hearts of mankind, from among jinn and mankind.',
    count: 3,
    source: THREE_QULS,
  },
];

const SAYYID_ISTIGHFAR: Dhikr = {
  id: 'sayyid_istighfar',
  arabic:
    'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
  transliteration:
    'Allāhumma anta Rabbī lā ilāha illā ant, khalaqtanī wa ana ʿabduk, wa ana ʿalā ʿahdika wa waʿdika mastaṭaʿt, aʿūdhu bika min sharri mā ṣanaʿt, abūʾu laka bi-niʿmatika ʿalayya, wa abūʾu laka bi-dhanbī, faghfir lī fa-innahū lā yaghfirudh-dhunūba illā ant',
  meaning:
    'O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I keep Your covenant and my promise to You as much as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.',
  count: 1,
  source: hadith('Bukhari 6306'),
};

const ALIMAL_GHAYB: Dhikr = {
  id: 'alimal_ghayb',
  arabic:
    'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ',
  transliteration:
    'Allāhumma ʿĀlimal-ghaybi wash-shahādah, Fāṭiras-samāwāti wal-arḍ, Rabba kulli shayʾin wa malīkah, ashhadu an lā ilāha illā ant, aʿūdhu bika min sharri nafsī, wa min sharrish-shayṭāni wa shirkih',
  meaning:
    'O Allah, Knower of the unseen and the seen, Creator of the heavens and the earth, Lord and Sovereign of all things: I bear witness that there is no god but You. I seek refuge in You from the evil of my own self and from the evil of Shaytan and his call to shirk.',
  count: 1,
  source: hadith('Tirmidhi 3392'),
};

const BISMILLAH_LA_YADURR: Dhikr = {
  id: 'bismillah_la_yadurr',
  arabic:
    'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
  transliteration:
    'Bismillāhil-ladhī lā yaḍurru maʿasmihī shayʾun fil-arḍi wa lā fis-samāʾi wa huwas-Samīʿul-ʿAlīm',
  meaning:
    'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
  count: 3,
  source: hadith('Abu Dawud 5088'),
};

const AFIYAH: Dhikr = {
  id: 'afiyah',
  arabic:
    'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
  transliteration:
    'Allāhumma innī asʾalukal-ʿāfiyata fid-dunyā wal-ākhirah. Allāhumma innī asʾalukal-ʿafwa wal-ʿāfiyata fī dīnī wa dunyāya wa ahlī wa mālī. Allāhummastur ʿawrātī wa āmin rawʿātī. Allāhummaḥ-faẓnī min bayni yadayya wa min khalfī wa ʿan yamīnī wa ʿan shimālī wa min fawqī, wa aʿūdhu bi-ʿaẓamatika an ughtāla min taḥtī',
  meaning:
    'O Allah, I ask You for well-being in this world and the next. O Allah, I ask You for pardon and well-being in my religion, my worldly life, my family and my wealth. O Allah, cover my faults and calm my fears. O Allah, guard me from in front, behind, my right, my left and above me, and I seek refuge in Your greatness from being struck down from beneath me.',
  count: 1,
  source: hadith('Abu Dawud 5074'),
};

const SUBHANALLAHI_WA_BIHAMDIHI: Dhikr = {
  id: 'subhanallahi_wa_bihamdihi',
  arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
  transliteration: 'SubḥānAllāhi wa biḥamdih',
  meaning: 'Glory be to Allah and praise be to Him',
  count: 100,
  source: hadith('Muslim 2692'),
};

export const MORNING_ADHKAR: Dhikr[] = [
  AYAT_AL_KURSI_DHIKR,
  ...QULS,
  {
    id: 'asbahna_wa_asbahal_mulk',
    arabic:
      'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    transliteration:
      'Aṣbaḥnā wa aṣbaḥal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʿalā kulli shayʾin qadīr. Rabbi asʾaluka khayra mā fī hādhal-yawmi wa khayra mā baʿdah, wa aʿūdhu bika min sharri mā fī hādhal-yawmi wa sharri mā baʿdah. Rabbi aʿūdhu bika minal-kasali wa sūʾil-kibar. Rabbi aʿūdhu bika min ʿadhābin fin-nāri wa ʿadhābin fil-qabr',
    meaning:
      'We have entered the morning and the dominion belongs to Allah; praise be to Allah; none has the right to be worshipped but Allah alone, without partner; His is the dominion and the praise, and He is able to do all things. My Lord, I ask You for the good of this day and what follows it, and seek refuge in You from the evil of this day and what follows it. My Lord, I seek refuge in You from laziness and the misery of old age. My Lord, I seek refuge in You from punishment in the Fire and in the grave.',
    count: 1,
    source: hadith('Muslim 2723'),
  },
  {
    id: 'bika_asbahna',
    arabic:
      'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration:
      'Allāhumma bika aṣbaḥnā, wa bika amsaynā, wa bika naḥyā, wa bika namūtu, wa ilaykan-nushūr',
    meaning:
      'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.',
    count: 1,
    source: hadith('Abu Dawud 5068'),
  },
  SAYYID_ISTIGHFAR,
  ALIMAL_GHAYB,
  BISMILLAH_LA_YADURR,
  AFIYAH,
  SUBHANALLAHI_WA_BIHAMDIHI,
];

export const EVENING_ADHKAR: Dhikr[] = [
  AYAT_AL_KURSI_DHIKR,
  ...QULS,
  {
    id: 'amsayna_wa_amsal_mulk',
    arabic:
      'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    transliteration:
      'Amsaynā wa amsal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʿalā kulli shayʾin qadīr. Rabbi asʾaluka khayra mā fī hādhihil-laylati wa khayra mā baʿdahā, wa aʿūdhu bika min sharri mā fī hādhihil-laylati wa sharri mā baʿdahā. Rabbi aʿūdhu bika minal-kasali wa sūʾil-kibar. Rabbi aʿūdhu bika min ʿadhābin fin-nāri wa ʿadhābin fil-qabr',
    meaning:
      'We have entered the evening and the dominion belongs to Allah; praise be to Allah; none has the right to be worshipped but Allah alone, without partner; His is the dominion and the praise, and He is able to do all things. My Lord, I ask You for the good of this night and what follows it, and seek refuge in You from the evil of this night and what follows it. My Lord, I seek refuge in You from laziness and the misery of old age. My Lord, I seek refuge in You from punishment in the Fire and in the grave.',
    count: 1,
    source: hadith('Muslim 2723'),
  },
  {
    id: 'bika_amsayna',
    arabic:
      'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    transliteration:
      'Allāhumma bika amsaynā, wa bika aṣbaḥnā, wa bika naḥyā, wa bika namūtu, wa ilaykal-maṣīr',
    meaning:
      'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.',
    count: 1,
    source: hadith('Ibn Majah 3868'),
  },
  SAYYID_ISTIGHFAR,
  ALIMAL_GHAYB,
  BISMILLAH_LA_YADURR,
  {
    id: 'audhu_bikalimatillah',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'Aʿūdhu bi-kalimātillāhit-tāmmāti min sharri mā khalaq',
    meaning: 'I seek refuge in the perfect words of Allah from the evil of what He created.',
    count: 3,
    source: hadith('Muslim 2709; Tirmidhi 3604'),
  },
  AFIYAH,
  SUBHANALLAHI_WA_BIHAMDIHI,
];

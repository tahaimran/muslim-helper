import type { DayContent, Dhikr, Source, WeekInfo } from './types';

// Sources: docs/content-sources/verification-1.md (hadith, sunnah, prayerFocus) and
// verification-2.md section A (dhikr). Quran Arabic is fetched from fawazahmed0/quran-api
// (ara-quranuthmanihaf), never hand-typed.

const hadith = (ref: string, grade: 'sahih' | 'hasan' = 'sahih'): Source => ({
  kind: 'hadith',
  ref,
  grade,
});
const quran = (ref: string): Source => ({ kind: 'quran', ref, grade: null });
const athar = (ref: string): Source => ({ kind: 'athar', ref, grade: null });

// Post-salah tasbih: 33/33/33, completed to 100 with the tahlil (Muslim 597).
const TASBIH_AFTER_SALAH: Dhikr[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubḥānAllāh',
    meaning: '(After each prayer) Glory be to Allah',
    count: 33,
    source: hadith('Muslim 597'),
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-ḥamdu lillāh',
    meaning: '(After each prayer) All praise is for Allah',
    count: 33,
    source: hadith('Muslim 597'),
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu akbar',
    meaning: '(After each prayer) Allah is the Greatest',
    count: 33,
    source: hadith('Muslim 597'),
  },
  {
    id: 'tahlil',
    arabic:
      'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      'Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʿalā kulli shayʾin qadīr',
    meaning:
      '(The 100th, after the tasbih) None has the right to be worshipped but Allah alone, without partner; His is the dominion and His is the praise, and He is able to do all things',
    count: 1,
    source: hadith('Muslim 597'),
  },
];

const TASBIH_TARGETS = [
  { dhikrId: 'subhanallah', target: 33 },
  { dhikrId: 'alhamdulillah', target: 33 },
  { dhikrId: 'allahuakbar', target: 33 },
  { dhikrId: 'tahlil', target: 1 },
];

const SUBHANALLAHI_WA_BIHAMDIHI: Dhikr = {
  id: 'subhanallahi_wa_bihamdihi',
  arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
  transliteration: 'SubḥānAllāhi wa biḥamdih',
  meaning: 'Glory be to Allah and praise be to Him',
  count: 100,
  source: hadith('Muslim 2692'),
};

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

export const WEEKS: WeekInfo[] = [
  { week: 1, title: 'Foundation', titleArabic: 'الأساس', days: [1, 7] },
  { week: 2, title: 'Building', titleArabic: 'البناء', days: [8, 14] },
  { week: 3, title: 'Character', titleArabic: 'الأخلاق', days: [15, 21] },
  { week: 4, title: 'Strengthening', titleArabic: 'التمكين', days: [22, 30] },
];

export const DAYS: DayContent[] = [
  // ───────────────────────────── Day 1 ─────────────────────────────
  {
    day: 1,
    theme: 'Niyyah',
    themeArabic: 'النية',
    intro:
      'Every act begins with intention. Today you lay the foundation of your path by purifying your heart and renewing your commitment to Allah.',
    morningDhikr: [
      {
        id: 'basmalah',
        arabic: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',
        transliteration: 'Bismillāhir-Raḥmānir-Raḥīm',
        meaning: 'In the name of Allah, the Most Gracious, the Most Merciful',
        count: 1,
        source: quran('Quran 1:1'),
      },
      {
        id: 'shahadah',
        arabic:
          'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
        transliteration:
          'Ashhadu an lā ilāha illallāh, wa ashhadu anna Muḥammadan rasūlullāh',
        meaning:
          'I bear witness that there is no god but Allah, and that Muhammad is the Messenger of Allah',
        count: 1,
        source: null,
      },
      {
        id: 'ainni_ala_dhikrik',
        arabic:
          'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
        transliteration:
          'Allāhumma aʿinnī ʿalā dhikrika wa shukrika wa ḥusni ʿibādatik',
        meaning:
          '(At the end of each prayer) O Allah, help me to remember You, thank You and worship You well',
        count: 1,
        source: hadith("Abu Dawud 1522; Nasa'i 1303"),
      },
    ],
    eveningDhikr: [
      ...TASBIH_AFTER_SALAH,
      {
        id: 'astaghfirullah',
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        transliteration: 'Astaghfirullāh',
        meaning: "I seek Allah's forgiveness",
        count: 10,
        source: null,
      },
    ],
    quran: {
      surah: 'Al-Fatihah',
      surahNumber: 1,
      ayahs: '1-7',
      note: 'Read Al-Fatihah slowly and reflect on each verse. You recite it in every rak\'ah: "Guide us to the straight path."',
    },
    prayerFocus: {
      prayer: 'fajr',
      tip: "Wake up 10 minutes before Fajr. Sit quietly, make wudu with intention, and pray Fajr with your full attention. After the salam, say this du'a.",
      dua: {
        arabic:
          'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
        transliteration:
          'Allāhumma innī asʾaluka ʿilman nāfiʿan, wa rizqan ṭayyiban, wa ʿamalan mutaqabbalā',
        meaning:
          '(After the salam of Fajr) O Allah, I ask You for beneficial knowledge, good provision and accepted deeds.',
        source: hadith('Ibn Majah 925', 'hasan'),
      },
    },
    sunnah: {
      title: 'Begin with Bismillah',
      description:
        'Say "Bismillah" before you eat, drink, leave the house or start your work. The Prophet ﷺ said to a boy: "Mention the name of Allah, eat with your right hand, and eat from what is in front of you."',
      source: hadith('Bukhari 5376; Muslim 2022'),
    },
    character: {
      trait: 'Sincerity',
      arabic: 'الإخلاص',
      description:
        'Sincerity means doing things for the pleasure of Allah alone, not for praise or recognition.',
      action:
        "Do one good deed today completely in secret, such as charity, helping someone or a quiet du'a, and tell no one.",
    },
    hadith: {
      arabic:
        'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
      meaning:
        '"Actions are only by intentions, and each person will only have what he intended."',
      source: hadith('Bukhari 1; Muslim 1907'),
    },
    reflection:
      'What is your true intention for walking this path? Write it down and keep it as your anchor.',
    tasks: [
      {
        id: '1_fajr',
        title: "Pray Fajr on time with its 2 sunnah rak'ahs",
        titleBeginner: 'Pray Fajr on time',
        titleAdvanced:
          "Pray Fajr on time with its 2 sunnah rak'ahs and the du'a after the salam",
        category: 'prayer',
      },
      {
        id: '1_bismillah',
        title: 'Say Bismillah before every action today',
        category: 'sunnah',
      },
      {
        id: '1_fatihah',
        title: 'Read and reflect on Surah Al-Fatihah',
        category: 'quran',
      },
      {
        id: '1_secret_deed',
        title: 'Do one good deed in secret',
        category: 'character',
      },
      {
        id: '1_evening_dhikr',
        title: 'Say the tasbih after a prayer (33 + 33 + 33, then the tahlil)',
        category: 'dhikr',
        tasbih: TASBIH_TARGETS,
      },
      {
        id: '1_reflection',
        title: 'Write down your intention for this path',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 2 ─────────────────────────────
  {
    day: 2,
    theme: 'Taharah',
    themeArabic: 'الطهارة',
    intro:
      'Islam cares for both outward and inward cleanliness. Today you learn that purity is the key to prayer and the foundation of worship.',
    morningDhikr: [
      {
        id: 'shahadah_after_wudu',
        arabic:
          'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
        transliteration:
          'Ashhadu an lā ilāha illallāhu waḥdahū lā sharīka lah, wa ashhadu anna Muḥammadan ʿabduhū wa rasūluh',
        meaning:
          '(After wudu) I testify that there is no god but Allah, alone without partner, and that Muhammad is His servant and messenger',
        count: 1,
        source: hadith('Muslim 234'),
      },
      {
        id: 'kaffarat_al_majlis',
        arabic:
          'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
        transliteration:
          'Subḥānakallāhumma wa biḥamdik, ashhadu an lā ilāha illā ant, astaghfiruka wa atūbu ilayk',
        meaning:
          '(At the end of a sitting) Glory be to You, O Allah, and praise; I testify there is no god but You; I seek Your forgiveness and repent to You',
        count: 1,
        source: hadith('Abu Dawud 4859; Tirmidhi 3433'),
      },
    ],
    eveningDhikr: [SAYYID_ISTIGHFAR, SUBHANALLAHI_WA_BIHAMDIHI],
    quran: {
      surah: 'Al-Baqarah',
      surahNumber: 2,
      ayahs: '222',
      note: 'Reflect on this verse about purification: "Indeed, Allah loves those who turn to Him in repentance and loves those who purify themselves."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: "Make each wudu today carefully: begin with Bismillah, follow the order, wash each part well, and say the shahadah when you finish. Then add this du'a.",
      dua: {
        arabic:
          'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
        transliteration:
          'Allāhummajʿalnī minat-tawwābīna wajʿalnī minal-mutaṭahhirīn',
        meaning:
          '(After the shahadah that follows wudu) O Allah, make me among those who repent and make me among those who purify themselves.',
        source: hadith('Tirmidhi 55'),
      },
    },
    sunnah: {
      title: 'Siwak or careful brushing',
      description:
        'The Prophet ﷺ said: "Were it not that it would be hard on my ummah, I would have commanded them to use the siwak with every prayer." Use a siwak or brush your teeth before your prayers today.',
      source: hadith('Bukhari 887; Muslim 252'),
    },
    character: {
      trait: 'Clean speech',
      arabic: 'طهارة اللسان',
      description:
        'Purity includes our words. Today, stay away from backbiting, lying and idle talk.',
      action:
        'Whenever you feel the urge to speak badly about someone, say "SubhanAllah" instead and change the topic.',
    },
    hadith: {
      arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
      meaning: '"Purification is half of faith."',
      source: hadith('Muslim 223'),
    },
    reflection:
      'In which parts of your life (physical, spiritual or social) do you most need purification?',
    tasks: [
      {
        id: '2_wudu',
        title: 'Make wudu the Sunnah way and say the shahadah after it',
        titleBeginner: 'Make wudu step by step, carefully, before a prayer',
        titleAdvanced:
          "Make every wudu today the Sunnah way, with the shahadah and du'a after it",
        category: 'prayer',
      },
      {
        id: '2_siwak',
        title: 'Use a siwak or brush before your prayers',
        category: 'sunnah',
      },
      {
        id: '2_speech',
        title: 'Guard your tongue: no backbiting today',
        titleBeginner: 'Catch yourself once before speaking badly of someone',
        category: 'character',
      },
      {
        id: '2_quran',
        title: 'Read and memorise Al-Baqarah 2:222',
        category: 'quran',
      },
      {
        id: '2_dhikr',
        title: 'Say SubhanAllahi wa bihamdihi 100 times',
        category: 'dhikr',
        tasbih: [{ dhikrId: 'subhanallahi_wa_bihamdihi', target: 100 }],
      },
      {
        id: '2_reflection',
        title: 'Write a short reflection on inner purity',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 3 ─────────────────────────────
  {
    day: 3,
    theme: 'Salah',
    themeArabic: 'الصلاة',
    intro:
      'Prayer is the pillar of Islam. Today you aim to pray all five prayers on time, aware that you are standing before Allah.',
    morningDhikr: [
      {
        id: 'waking_dua',
        arabic:
          'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration:
          'Al-ḥamdu lillāhil-ladhī aḥyānā baʿda mā amātanā wa ilayhin-nushūr',
        meaning:
          '(On waking) Praise be to Allah who gave us life after causing us to die, and to Him is the resurrection',
        count: 1,
        source: hadith('Bukhari 6312; Muslim 2711'),
      },
      {
        id: 'dua_after_adhan',
        arabic:
          'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
        transliteration:
          'Allāhumma Rabba hādhihid-daʿwatit-tāmmah, waṣ-ṣalātil-qāʾimah, āti Muḥammadanil-wasīlata wal-faḍīlah, wabʿath-hu maqāman maḥmūdanil-ladhī waʿadtah',
        meaning:
          '(After each adhan) O Allah, Lord of this perfect call and the prayer about to be established, grant Muhammad al-Wasilah and excellence, and raise him to the praised station You promised him',
        count: 1,
        source: hadith('Bukhari 614'),
      },
    ],
    eveningDhikr: [...TASBIH_AFTER_SALAH],
    quran: {
      surah: 'Al-Baqarah',
      surahNumber: 2,
      ayahs: '238-239',
      note: '"Guard your prayers, especially the middle prayer, and stand before Allah in devotion." Reflect on what it means to truly guard your prayers.',
    },
    prayerFocus: {
      prayer: 'all',
      tip: 'Pray each prayer soon after the adhan today. Set an alarm for each prayer time. Before you begin, take a moment to quiet your mind and remember that you are about to stand before your Creator.',
    },
    sunnah: {
      title: "The 12 sunnah rak'ahs",
      description:
        "The Prophet ﷺ said that whoever prays twelve voluntary rak'ahs in a day and night, a house will be built for him in Paradise. They are 2 before Fajr, 4 before Dhuhr and 2 after it, 2 after Maghrib and 2 after Isha.",
      source: hadith('Muslim 728; Tirmidhi 415'),
    },
    character: {
      trait: 'Discipline',
      arabic: 'الانضباط',
      description:
        'Prayer teaches discipline: showing up at set times whatever your mood or schedule.',
      action:
        'Plan your day around the prayer times instead of fitting prayer into your day.',
    },
    hadith: {
      arabic:
        'إِنَّ أَوَّلَ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ مِنْ عَمَلِهِ صَلاَتُهُ، فَإِنْ صَلَحَتْ فَقَدْ أَفْلَحَ وَأَنْجَحَ، وَإِنْ فَسَدَتْ فَقَدْ خَابَ وَخَسِرَ',
      meaning:
        '"The first of his deeds for which a servant will be called to account on the Day of Resurrection is his prayer. If it is sound, he has succeeded and prospered; if it is corrupt, he has failed and lost."',
      source: hadith('Tirmidhi 413'),
    },
    reflection:
      'What keeps you from praying on time? How can you remove those obstacles for good?',
    tasks: [
      {
        id: '3_all_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced:
          'Pray all 5 prayers early in their time, with the tasbih after each',
        category: 'prayer',
      },
      {
        id: '3_sunnah_12',
        title: "Pray the 12 sunnah rak'ahs today",
        titleBeginner: "Pray the 2 sunnah rak'ahs before Fajr",
        category: 'prayer',
      },
      {
        id: '3_alarms',
        title: 'Set alarms for all 5 prayer times',
        category: 'sunnah',
      },
      {
        id: '3_quran',
        title: 'Recite and memorise Al-Baqarah 2:238',
        category: 'quran',
      },
      {
        id: '3_dhikr',
        title: 'Say the tasbih after a prayer (33 + 33 + 33, then the tahlil)',
        category: 'dhikr',
        tasbih: TASBIH_TARGETS,
      },
      {
        id: '3_reflection',
        title: 'Journal: plan your day around the prayers',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 4 ─────────────────────────────
  {
    day: 4,
    theme: 'Fajr',
    themeArabic: 'الفجر',
    intro:
      'Fajr is a great test of sincerity. Rising before the world to stand before Allah shows the depth of your love for Him.',
    morningDhikr: [
      {
        id: 'bika_asbahna',
        arabic:
          'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
        transliteration:
          'Allāhumma bika aṣbaḥnā, wa bika amsaynā, wa bika naḥyā, wa bika namūtu, wa ilaykan-nushūr',
        meaning:
          'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection',
        count: 1,
        source: hadith('Abu Dawud 5068; Tirmidhi 3391'),
      },
      {
        id: 'asbahna_ala_fitrah',
        arabic:
          'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ',
        transliteration:
          'Aṣbaḥnā ʿalā fiṭratil-Islām, wa ʿalā kalimatil-ikhlāṣ, wa ʿalā dīni nabiyyinā Muḥammad ﷺ, wa ʿalā millati abīnā Ibrāhīma ḥanīfan musliman wa mā kāna minal-mushrikīn',
        meaning:
          'We have entered the morning upon the natural way of Islam, the word of sincerity, the religion of our Prophet Muhammad ﷺ, and the way of our father Ibrahim, upright and submitting, who was not of the polytheists',
        count: 1,
        // Narrated in Ahmad (sahih per al-Albani), but the Musnad number is unverified, so no ref is shown.
        source: null,
      },
    ],
    eveningDhikr: [
      {
        id: 'bika_amsayna',
        arabic:
          'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
        transliteration:
          'Allāhumma bika amsaynā, wa bika aṣbaḥnā, wa bika naḥyā, wa bika namūtu, wa ilaykal-maṣīr',
        meaning:
          'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return',
        count: 1,
        source: hadith('Tirmidhi 3391; Ibn Majah 3868'),
      },
      {
        id: 'audhu_bikalimatillah',
        arabic:
          'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration:
          'Aʿūdhu bi-kalimātillāhit-tāmmāti min sharri mā khalaq',
        meaning:
          'I seek refuge in the perfect words of Allah from the evil of what He created',
        count: 3,
        source: hadith('Muslim 2709; Tirmidhi 3604'),
      },
    ],
    quran: {
      surah: 'Al-Isra',
      surahNumber: 17,
      ayahs: '78-79',
      note: 'Read about the dawn prayer, which the angels witness: "Indeed, the recitation at dawn is ever witnessed."',
    },
    prayerFocus: {
      prayer: 'fajr',
      tip: "Sleep early tonight and lay out your prayer mat before bed. When the alarm rings, sit up straight away and say the waking du'a, \"Al-hamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.\" Don't lie back down; wudu will wake you fully.",
      dua: {
        arabic:
          'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَفِي لِسَانِي نُورًا، وَاجْعَلْ فِي سَمْعِي نُورًا، وَاجْعَلْ فِي بَصَرِي نُورًا',
        transliteration:
          'Allāhummajʿal fī qalbī nūran, wa fī lisānī nūran, wajʿal fī samʿī nūran, wajʿal fī baṣarī nūran',
        meaning:
          'O Allah, place light in my heart, light in my tongue, light in my hearing and light in my sight.',
        source: hadith('Muslim 763; Bukhari 6316'),
      },
    },
    sunnah: {
      title: 'A Sunnah start to the morning',
      description:
        "On waking, say the waking du'a, wipe the sleep from your face with your hand, make wudu, and pray the 2 sunnah rak'ahs before Fajr. The Prophet ﷺ said: \"The two rak'ahs of Fajr are better than this world and everything in it.\"",
      source: hadith('Muslim 725; Bukhari 183'),
    },
    character: {
      trait: 'Commitment',
      arabic: 'الالتزام',
      description:
        'Commitment means showing up even when it is hard. Fajr tests it like nothing else.',
      action:
        'Make a firm intention tonight to wake for Fajr each day of this path, and write it down.',
    },
    hadith: {
      arabic: 'مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ',
      meaning: '"Whoever prays Subh (Fajr) is under the protection of Allah."',
      source: hadith('Muslim 657'),
    },
    reflection:
      'How does it feel to rise before the world and stand before your Creator in the quiet of dawn?',
    tasks: [
      {
        id: '4_fajr_time',
        title: 'Pray Fajr early in its time',
        titleBeginner: 'Pray Fajr before sunrise',
        titleAdvanced:
          'Pray Fajr early in its time, then say the morning adhkar',
        category: 'prayer',
      },
      {
        id: '4_sunnah_fajr',
        title: "Pray the 2 sunnah rak'ahs before Fajr",
        category: 'prayer',
      },
      {
        id: '4_waking_dua',
        title: "Say the waking du'a when you wake up",
        category: 'dhikr',
      },
      {
        id: '4_quran',
        title: 'Read Al-Isra 17:78-79 and reflect',
        category: 'quran',
      },
      {
        id: '4_sleep_early',
        title: 'Sleep early tonight so you can wake for Fajr',
        category: 'sunnah',
      },
      {
        id: '4_commitment',
        title: 'Write down your Fajr commitment',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 5 ─────────────────────────────
  {
    day: 5,
    theme: "Khushu'",
    themeArabic: 'الخشوع',
    intro:
      "Khushu' is the heart being present with Allah in prayer; it is the soul of salah. Without it the body prays while the heart is elsewhere.",
    morningDhikr: [
      {
        id: 'ya_hayyu_ya_qayyum',
        arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
        transliteration: 'Yā Ḥayyu yā Qayyūmu bi-raḥmatika astaghīth',
        meaning:
          '(In times of distress) O Ever-Living, O Sustainer, by Your mercy I seek help',
        count: 1,
        source: hadith('Tirmidhi 3524', 'hasan'),
      },
      {
        id: 'dua_dhun_nun',
        arabic:
          'لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبۡحَٰنَكَ إِنِّي كُنتُ مِنَ ٱلظَّٰلِمِينَ',
        transliteration:
          'Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn',
        meaning:
          'There is no god but You, glory be to You; I have been among the wrongdoers',
        count: 1,
        source: quran('Quran 21:87'),
      },
    ],
    eveningDhikr: [
      {
        id: 'subhanallahil_azim',
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
        transliteration: 'SubḥānAllāhi wa biḥamdihī, subḥānAllāhil-ʿAẓīm',
        meaning:
          'Glory be to Allah and praise be to Him; glory be to Allah the Magnificent',
        count: 10,
        source: hadith('Muslim 2694'),
      },
      {
        id: 'salawat',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
        transliteration: 'Allāhumma ṣalli ʿalā Muḥammad',
        meaning: 'O Allah, send blessings upon Muhammad',
        count: 10,
        source: null,
      },
    ],
    quran: {
      surah: "Al-Mu'minun",
      surahNumber: 23,
      ayahs: '1-2',
      note: 'The first quality of the successful believers is khushu\' in prayer: "Successful indeed are the believers, those who are humble in their prayer."',
    },
    prayerFocus: {
      prayer: 'dhuhr',
      tip: 'Before Dhuhr, remind yourself that you are about to speak to Allah. Slow every movement and make your ruku\' and sujood longer than usual. The Prophet ﷺ said: "The closest a servant is to his Lord is when he is in prostration, so make much du\'a."',
      dua: {
        arabic:
          'سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي',
        transliteration:
          'Subḥānakallāhumma Rabbanā wa biḥamdik, Allāhummaghfir lī',
        meaning:
          "(In ruku' and sujood) Glory be to You, O Allah, our Lord, and praise be to You. O Allah, forgive me.",
        source: hadith('Bukhari 817; Muslim 484'),
      },
    },
    sunnah: {
      title: 'Long, unhurried sujood',
      description:
        "Make your prostration longer than usual today. In sujood, repeat \"Subhana Rabbiyal-A'la\" (Glory be to my Lord, the Most High), then make your own du'a. In his night prayer, the Prophet's ﷺ prostration lasted as long as it takes to recite fifty verses.",
      source: hadith('Muslim 772; Bukhari 1123'),
    },
    character: {
      trait: 'Mindfulness',
      arabic: 'المراقبة',
      description:
        'Being present in prayer trains you to be present in life, and it carries over into how you treat people.',
      action:
        'Be fully present in 3 conversations today: put your phone away, make eye contact and truly listen.',
    },
    hadith: {
      arabic: 'صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي',
      meaning: '"Pray as you have seen me praying."',
      source: hadith('Bukhari 631'),
    },
    reflection:
      'When did you last feel truly close to Allah in prayer? What made that moment special?',
    tasks: [
      {
        id: '5_khushu',
        title: 'Pray one prayer with your heart fully present',
        titleBeginner: 'Pray one prayer slowly, without rushing',
        titleAdvanced:
          'Pray every prayer today slowly, with your heart present',
        category: 'prayer',
      },
      {
        id: '5_sujood',
        title: "Make a long sujood with your own du'a",
        category: 'prayer',
      },
      {
        id: '5_quran',
        title: "Memorise Al-Mu'minun 23:1-2",
        category: 'quran',
      },
      {
        id: '5_presence',
        title: 'Be fully present in 3 conversations',
        category: 'character',
      },
      {
        id: '5_dhikr',
        title: 'Say SubhanAllahi wa bihamdihi, SubhanAllahil-Azim 10 times',
        category: 'dhikr',
        tasbih: [{ dhikrId: 'subhanallahil_azim', target: 10 }],
      },
      {
        id: '5_reflection',
        title: "Reflect on your experience of khushu'",
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 6 ─────────────────────────────
  {
    day: 6,
    theme: 'Quran',
    themeArabic: 'القرآن',
    intro:
      'The Quran is the speech of Allah, and a daily Quran habit is one of the most powerful things a Muslim can build. Today you begin a lifelong bond with the Book of Allah.',
    morningDhikr: [
      {
        id: 'ihdini_li_ahsanil_akhlaq',
        arabic:
          'وَاهْدِنِي لأَحْسَنِ الأَخْلاَقِ لاَ يَهْدِي لأَحْسَنِهَا إِلاَّ أَنْتَ وَاصْرِفْ عَنِّي سَيِّئَهَا لاَ يَصْرِفُ عَنِّي سَيِّئَهَا إِلاَّ أَنْتَ',
        transliteration:
          'Wahdinī li-aḥsanil-akhlāqi lā yahdī li-aḥsanihā illā ant, waṣrif ʿannī sayyiʾahā lā yaṣrifu ʿannī sayyiʾahā illā ant',
        meaning:
          "(From a longer du'a) And guide me to the best of character, for none guides to the best of it but You; and turn away from me its evil, for none turns away its evil but You",
        count: 1,
        source: hadith('Muslim 771'),
      },
    ],
    eveningDhikr: [
      {
        id: 'rabi_qalbi',
        arabic:
          'اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجِلَاءَ حُزْنِي، وَذَهَابَ هَمِّي',
        transliteration:
          'Allāhummajʿalil-Qurʾāna rabīʿa qalbī, wa nūra ṣadrī, wa jalāʾa ḥuznī, wa dhahāba hammī',
        meaning:
          'O Allah, make the Quran the spring of my heart, the light of my chest, the remover of my sorrow and the reliever of my distress',
        count: 1,
        source: hadith('Ahmad 3712'),
      },
      SUBHANALLAHI_WA_BIHAMDIHI,
    ],
    quran: {
      surah: 'Al-Baqarah',
      surahNumber: 2,
      ayahs: '1-5',
      note: 'Read the opening of Al-Baqarah. It describes the people of taqwa: they believe in the unseen, establish prayer, and spend from what they are given.',
    },
    prayerFocus: {
      prayer: 'isha',
      tip: 'Read some Quran around Isha or before bed tonight. Even 5 to 10 minutes is a blessed habit. Recite slowly and with care; quality matters more than quantity.',
    },
    sunnah: {
      title: 'A daily Quran habit',
      description:
        'Set a fixed time each day for the Quran. The Prophet ﷺ said: "The best of you are those who learn the Quran and teach it." Even one verse read with reflection is valuable. Start small and stay consistent.',
      source: hadith('Bukhari 5027'),
    },
    character: {
      trait: 'Consistency',
      arabic: 'المداومة',
      description:
        'The Prophet ﷺ said: "The most beloved of deeds to Allah are the most consistent, even if small." A small daily Quran habit shapes the soul over time.',
      action:
        'Choose a fixed daily Quran time, even 10 minutes, and protect it.',
    },
    hadith: {
      arabic:
        'مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا، لاَ أَقُولُ الم حَرْفٌ، وَلَكِنْ أَلِفٌ حَرْفٌ وَلاَمٌ حَرْفٌ وَمِيمٌ حَرْفٌ',
      meaning:
        '"Whoever reads a letter from the Book of Allah receives a good deed for it, and a good deed is multiplied ten times. I do not say that Alif-Lam-Mim is one letter; rather Alif is a letter, Lam is a letter and Mim is a letter."',
      source: hadith('Tirmidhi 2910'),
    },
    reflection:
      'What Quran goal would you like to reach by the end of this year? How will you shape your daily recitation?',
    tasks: [
      {
        id: '6_quran_habit',
        title: 'Read Quran for 15 minutes',
        titleBeginner: 'Read Quran for 5 minutes',
        category: 'quran',
      },
      {
        id: '6_baqarah',
        title: 'Read Al-Baqarah 2:1-5 with its explanation',
        category: 'quran',
      },
      {
        id: '6_all_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '6_dhikr',
        title: 'Say SubhanAllahi wa bihamdihi 100 times',
        category: 'dhikr',
        tasbih: [{ dhikrId: 'subhanallahi_wa_bihamdihi', target: 100 }],
      },
      {
        id: '6_quran_calendar',
        title: 'Put a fixed daily Quran time in your routine',
        category: 'sunnah',
      },
      {
        id: '6_reflection',
        title: 'Write down your Quran goal for this year',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 7 ─────────────────────────────
  {
    day: 7,
    theme: 'Tawbah',
    themeArabic: 'التوبة',
    intro:
      'The door of repentance is always open, and Allah loves those who return to Him. Today, turn back to Him sincerely, let go of the weight of past sins, and begin fresh.',
    morningDhikr: [
      {
        id: 'astaghfirullah_al_azim',
        arabic:
          'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
        transliteration:
          'Astaghfirullāhal-ʿAẓīmal-ladhī lā ilāha illā huwal-Ḥayyul-Qayyūmu wa atūbu ilayh',
        meaning:
          'I seek forgiveness from Allah the Magnificent, besides whom there is no god, the Ever-Living, the Sustainer, and I repent to Him',
        count: 1,
        source: hadith('Tirmidhi 3577'),
      },
    ],
    eveningDhikr: [SAYYID_ISTIGHFAR],
    quran: {
      surah: 'Az-Zumar',
      surahNumber: 39,
      ayahs: '53',
      note: 'One of the most hopeful verses in the Quran: "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins."',
    },
    prayerFocus: {
      prayer: 'isha',
      tip: 'Tonight, before you sleep or in the last part of the night before Fajr, pray 2 or more rak\'ahs of night prayer. Ask Allah sincerely for forgiveness. Allah descends to the lowest heaven in the last third of the night and asks, "Who is asking Me for forgiveness, that I may forgive him?" (Bukhari 1145)',
      dua: {
        arabic:
          'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ',
        transliteration:
          'Allāhumma innī asʾalukal-ʿafwa wal-ʿāfiyata fid-dunyā wal-ākhirah',
        meaning:
          'O Allah, I ask You for pardon and well-being in this world and the Hereafter.',
        source: hadith('Abu Dawud 5074; Ibn Majah 3871'),
      },
    },
    sunnah: {
      title: 'Sayyid al-Istighfar',
      description:
        "Say the master du'a of seeking forgiveness in the morning and the evening. The Prophet ﷺ said that whoever says it with certainty during the day and dies before evening, or says it at night and dies before morning, is of the people of Paradise.",
      source: hadith('Bukhari 6306'),
    },
    character: {
      trait: "Hope in Allah's mercy",
      arabic: 'الرجاء',
      description:
        "Never despair of Allah's mercy. No sin is too great for His forgiveness, and sincere repentance wipes the slate clean.",
      action:
        'Write down anything weighing on your conscience, then sincerely seek forgiveness for each one.',
    },
    hadith: {
      arabic:
        'وَاللَّهِ إِنِّي لأَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ فِي الْيَوْمِ أَكْثَرَ مِنْ سَبْعِينَ مَرَّةً',
      meaning:
        '"By Allah, I seek Allah\'s forgiveness and turn to Him in repentance more than seventy times a day."',
      source: hadith('Bukhari 6307'),
    },
    reflection:
      'What sins or regrets have been weighing on your heart? How does knowing that Allah forgives all sins make you feel?',
    tasks: [
      {
        id: '7_tawbah',
        title: 'Make sincere tawbah for past sins',
        category: 'dhikr',
      },
      {
        id: '7_tahajjud',
        title: "Pray 2 rak'ahs of night prayer (tahajjud)",
        titleBeginner: "Pray 2 extra rak'ahs before you sleep",
        titleAdvanced: 'Wake in the last third of the night and pray tahajjud',
        category: 'prayer',
      },
      {
        id: '7_sayyid',
        title: 'Say Sayyid al-Istighfar morning and evening',
        category: 'dhikr',
      },
      {
        id: '7_quran',
        title: 'Read Az-Zumar 39:53 and take in its hope',
        category: 'quran',
      },
      {
        id: '7_sins',
        title: 'List your regrets and seek forgiveness for each',
        category: 'reflection',
      },
      {
        id: '7_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced:
          'Pray all 5 prayers on time, saying astaghfirullah 3 times after each',
        category: 'prayer',
      },
    ],
  },

  // ───────────────────────────── Day 8 ─────────────────────────────
  {
    day: 8,
    theme: 'Dhikr',
    themeArabic: 'الذكر',
    intro:
      'Remembrance of Allah nourishes the heart: "Verily, in the remembrance of Allah do hearts find rest." Today you build a morning and evening dhikr routine to carry with you every day.',
    morningDhikr: [
      {
        id: 'three_quls',
        arabic:
          'قُلۡ هُوَ ٱللَّهُ أَحَدٌ ٱللَّهُ ٱلصَّمَدُ لَمۡ يَلِدۡ وَلَمۡ يُولَدۡ وَلَمۡ يَكُن لَّهُۥ كُفُوًا أَحَدُۢ\nقُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ مِن شَرِّ مَا خَلَقَ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلۡعُقَدِ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ\nقُلۡ أَعُوذُ بِرَبِّ ٱلنَّاسِ مَلِكِ ٱلنَّاسِ إِلَٰهِ ٱلنَّاسِ مِن شَرِّ ٱلۡوَسۡوَاسِ ٱلۡخَنَّاسِ ٱلَّذِي يُوَسۡوِسُ فِي صُدُورِ ٱلنَّاسِ مِنَ ٱلۡجِنَّةِ وَٱلنَّاسِ',
        transliteration:
          'Qul huwallāhu aḥad… (Al-Ikhlas) · Qul aʿūdhu bi-rabbil-falaq… (Al-Falaq) · Qul aʿūdhu bi-rabbin-nās… (An-Nas)',
        meaning:
          'Surahs Al-Ikhlas, Al-Falaq and An-Nas, three times each in the morning and evening. The Prophet ﷺ said they will suffice you against everything.',
        count: 3,
        source: hadith('Abu Dawud 5082', 'hasan'),
      },
      {
        id: 'afini_fi_badani',
        arabic:
          'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',
        transliteration:
          'Allāhumma ʿāfinī fī badanī, Allāhumma ʿāfinī fī samʿī, Allāhumma ʿāfinī fī baṣarī, lā ilāha illā ant',
        meaning:
          'O Allah, grant me well-being in my body, my hearing and my sight; there is no god but You',
        count: 3,
        source: hadith('Abu Dawud 5090', 'hasan'),
      },
      {
        id: 'hasbiyallah',
        arabic:
          'حَسۡبِيَ ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَۖ عَلَيۡهِ تَوَكَّلۡتُۖ وَهُوَ رَبُّ ٱلۡعَرۡشِ ٱلۡعَظِيمِ',
        transliteration:
          'Ḥasbiyallāhu lā ilāha illā huwa ʿalayhi tawakkaltu wa huwa Rabbul-ʿArshil-ʿAẓīm',
        meaning:
          'Allah is sufficient for me; there is no god but Him; in Him I trust, and He is Lord of the Mighty Throne',
        count: 1,
        source: quran('Quran 9:129'),
      },
    ],
    eveningDhikr: [
      {
        id: 'bismillah_alladhi',
        arabic:
          'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        transliteration:
          'Bismillāhil-ladhī lā yaḍurru maʿasmihī shayʾun fil-arḍi wa lā fis-samāʾi wa huwas-Samīʿul-ʿAlīm',
        meaning:
          'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing',
        count: 3,
        source: hadith('Abu Dawud 5088; Tirmidhi 3388'),
      },
      {
        id: 'amsayna_wa_amsal_mulk',
        arabic:
          'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
        transliteration:
          'Amsaynā wa amsal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʿalā kulli shayʾin qadīr. Rabbi asʾaluka khayra mā fī hādhihil-laylati wa khayra mā baʿdahā, wa aʿūdhu bika min sharri mā fī hādhihil-laylati wa sharri mā baʿdahā. Rabbi aʿūdhu bika minal-kasali wa sūʾil-kibar. Rabbi aʿūdhu bika min ʿadhābin fin-nāri wa ʿadhābin fil-qabr',
        meaning:
          'We have entered the evening and the dominion belongs to Allah; praise be to Allah; none has the right to be worshipped but Allah alone, without partner; His is the dominion and the praise, and He is able to do all things. My Lord, I ask You for the good of this night and what follows it, and seek refuge in You from the evil of this night and what follows it. My Lord, I seek refuge in You from laziness and the misery of old age. My Lord, I seek refuge in You from punishment in the Fire and in the grave',
        count: 1,
        source: hadith('Muslim 2723'),
      },
    ],
    quran: {
      surah: "Ar-Ra'd",
      surahNumber: 13,
      ayahs: '28',
      note: 'The well-known verse about dhikr and the heart: "Verily, in the remembrance of Allah do hearts find rest."',
    },
    prayerFocus: {
      prayer: 'maghrib',
      tip: "After Maghrib tonight, don't rush away. Stay seated and say the evening adhkar before you get up.",
    },
    sunnah: {
      title: 'Morning and evening adhkar',
      description:
        'Begin learning the morning and evening adhkar. Today, at the least, recite the three Quls (Al-Ikhlas, Al-Falaq and An-Nas) three times each, morning and evening, and the tasbih after your prayers (33 + 33 + 33, then the tahlil). Recite Ayat al-Kursi before you sleep.',
      source: hadith('Abu Dawud 5082', 'hasan'),
    },
    character: {
      trait: 'Gratitude',
      arabic: 'الشكر',
      description:
        'Dhikr trains the heart in gratitude. When you remember Allah often, you notice His countless blessings.',
      action:
        'Name 10 specific blessings today. Be specific: not just "health" but "I can see, I have food, I have a home."',
    },
    hadith: {
      arabic:
        'مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لاَ يَذْكُرُ رَبَّهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ',
      meaning:
        '"The example of one who remembers his Lord and one who does not is like the living and the dead."',
      source: hadith('Bukhari 6407'),
    },
    reflection: 'How does your heart feel before and after sincere dhikr?',
    tasks: [
      {
        id: '8_morning_adhkar',
        title: 'Say the morning adhkar',
        titleBeginner: 'Recite the three Quls in the morning',
        category: 'dhikr',
      },
      {
        id: '8_evening_adhkar',
        title: 'Say the evening adhkar',
        titleBeginner:
          'Say Bismillahil-ladhi la yadurru 3 times in the evening',
        category: 'dhikr',
      },
      {
        id: '8_ayat_kursi',
        title: 'Recite Ayat al-Kursi before you sleep',
        category: 'dhikr',
      },
      {
        id: '8_quran',
        title: "Read Ar-Ra'd 13:28 and sit with it",
        category: 'quran',
      },
      {
        id: '8_gratitude',
        title: 'List 10 specific blessings',
        category: 'reflection',
      },
      {
        id: '8_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced:
          'Pray all 5 prayers on time and stay seated for the adhkar after each',
        category: 'prayer',
      },
    ],
  },

  // ───────────────────────────── Day 9 ─────────────────────────────
  {
    day: 9,
    theme: 'Sunnah',
    themeArabic: 'السنة',
    intro:
      'Following the Sunnah means living as the Prophet ﷺ lived. Every Sunnah you revive is an act of love for him and a source of great reward.',
    morningDhikr: [
      {
        id: 'salawat_ibrahimiyyah',
        arabic:
          'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ، وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
        transliteration:
          'Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka Ḥamīdun Majīd. Allāhumma bārik ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā bārakta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka Ḥamīdun Majīd.',
        meaning:
          'O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious.',
        count: 1,
        source: hadith('Bukhari 3370'),
      },
    ],
    eveningDhikr: [
      {
        id: 'salawat',
        arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
        transliteration: 'Allāhumma ṣalli ʿalā Muḥammad',
        meaning: 'O Allah, send blessings upon Muhammad',
        count: 100,
        source: null,
      },
    ],
    quran: {
      surah: 'Al-Ahzab',
      surahNumber: 33,
      ayahs: '21',
      note: 'The verse that makes the Prophet ﷺ our finest example: "There has certainly been for you in the Messenger of Allah an excellent example."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: "Today, focus on praying as the Prophet ﷺ prayed. Learn one Sunnah of prayer you may have missed, such as the opening du'a (istiftah), the du'a between the two prostrations, or a du'a in the final tashahhud.",
    },
    sunnah: {
      title: 'The Sunnah of eating',
      description:
        'Today, practise the Sunnah of eating: say Bismillah, eat with your right hand and from what is in front of you (Bukhari 5376; Muslim 2022); never criticise food (Bukhari 5409; Muslim 2064); lick your fingers when you finish (Muslim 2031); and praise Allah afterwards (Muslim 2734).',
      source: hadith('Bukhari 5376; Muslim 2022'),
    },
    character: {
      trait: 'Love for the Prophet ﷺ',
      arabic: 'محبة النبي ﷺ',
      description:
        'True love for the Prophet ﷺ shows in following his way, not just in claiming love. Every Sunnah you follow is a sign of it.',
      action:
        'Read one chapter of the Seerah (his biography) today to deepen your love and understanding of who he was.',
    },
    hadith: {
      arabic:
        'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى أَكُونَ أَحَبَّ إِلَيْهِ مِنْ وَالِدِهِ وَوَلَدِهِ وَالنَّاسِ أَجْمَعِينَ',
      meaning:
        '"None of you truly believes until I am more beloved to him than his father, his child and all of mankind."',
      source: hadith('Bukhari 15; Muslim 44'),
    },
    reflection:
      'Which Sunnah of the Prophet ﷺ do you most want to make a permanent part of your life?',
    tasks: [
      {
        id: '9_sunnah_eating',
        title: 'Practise the Sunnah of eating at every meal',
        category: 'sunnah',
      },
      {
        id: '9_salawat',
        title: 'Send salawat on the Prophet ﷺ 100 times',
        category: 'dhikr',
        tasbih: [{ dhikrId: 'salawat', target: 100 }],
      },
      {
        id: '9_seerah',
        title: 'Read one chapter of the Seerah',
        category: 'sunnah',
      },
      { id: '9_quran', title: 'Memorise Al-Ahzab 33:21', category: 'quran' },
      {
        id: '9_prayers',
        title: "Pray all 5 prayers with their sunnah rak'ahs",
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced:
          "Pray all 5 prayers with their sunnah rak'ahs and the opening du'a",
        category: 'prayer',
      },
      {
        id: '9_reflection',
        title: 'Journal: the Sunnah you most want to revive',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 10 ─────────────────────────────
  {
    day: 10,
    theme: "Du'a",
    themeArabic: 'الدعاء',
    intro:
      'Du\'a is worship itself, and Allah says, "Call upon Me; I will respond to you." Today you learn to speak to Allah in your own words and trust in His answer.',
    morningDhikr: [
      {
        id: 'hamm_wal_hazan',
        arabic:
          'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
        transliteration:
          'Allāhumma innī aʿūdhu bika minal-hammi wal-ḥazan, wal-ʿajzi wal-kasal, wal-jubni wal-bukhl, wa ḍalaʿid-dayni wa ghalabatir-rijāl',
        meaning:
          'O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from cowardice and miserliness, from the burden of debt and from being overpowered by men',
        count: 1,
        source: hadith('Bukhari 6369'),
      },
    ],
    eveningDhikr: [
      {
        id: 'tahlil',
        arabic:
          'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration:
          'Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʿalā kulli shayʾin qadīr',
        meaning:
          'None has the right to be worshipped but Allah alone, without partner; His is the dominion and His is the praise, and He is able to do all things',
        count: 10,
        source: hadith('Bukhari 6404'),
      },
    ],
    quran: {
      surah: 'Al-Baqarah',
      surahNumber: 2,
      ayahs: '186',
      note: 'The verse that shows Allah is always near and always listening: "I am near. I respond to the call of the one who calls upon Me."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: "In every sujood today, make du'a in your own words for your needs, your family and the ummah. The Prophet ﷺ said: \"The closest a servant is to his Lord is when he is prostrating, so make much du'a.\" This Quranic du'a was the one he made most often.",
      dua: {
        arabic:
          'رَبَّنَآ ءَاتِنَا فِي ٱلدُّنۡيَا حَسَنَةࣰ وَفِي ٱلۡأٓخِرَةِ حَسَنَةࣰ وَقِنَا عَذَابَ ٱلنَّارِ',
        transliteration:
          'Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ʿadhāban-nār',
        meaning:
          'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
        source: quran('Quran 2:201'),
      },
    },
    sunnah: {
      title: "Times when du'a is answered",
      description:
        "The Prophet ﷺ taught us special times for du'a: the last third of the night (Bukhari 1145), between the adhan and the iqamah (Abu Dawud 521; Tirmidhi 212), in sujood (Muslim 482), at the end of the obligatory prayers (Tirmidhi 3499), and the hour on Friday, sought in the last hour after Asr (Bukhari 935; Abu Dawud 1048). Use at least 3 of these times today.",
      source: hadith(
        'Bukhari 1145; Muslim 482; Abu Dawud 521; Tirmidhi 3499; Bukhari 935',
        'hasan',
      ),
    },
    character: {
      trait: 'Reliance on Allah',
      arabic: 'التوكل',
      description:
        "Du'a is an expression of tawakkul: knowing that everything is in Allah's hands and that He alone can help.",
      action:
        'Write a heartfelt list of 10 things you need from Allah. Be specific, then trust Him and let go.',
    },
    hadith: {
      arabic: 'الدُّعَاءُ هُوَ الْعِبَادَةُ',
      meaning:
        '"Supplication is worship itself." Then he recited: "And your Lord says: Call upon Me; I will respond to you" (Ghafir 40:60).',
      source: hadith('Tirmidhi 2969; Abu Dawud 1479'),
    },
    reflection:
      "Have you ever felt a du'a of yours was answered? What did it feel like? Are there du'as you have stopped hoping for?",
    tasks: [
      {
        id: '10_dua_list',
        title: "Write your personal list of 10 du'as",
        category: 'reflection',
      },
      {
        id: '10_sujood_dua',
        title: "Make your own du'a in every sujood today",
        titleBeginner: "Make one du'a of your own in sujood",
        titleAdvanced:
          "Make your own du'a in every sujood, and say Rabbana atina after each prayer",
        category: 'prayer',
      },
      {
        id: '10_times',
        title: "Make du'a at 3 of the special times today",
        category: 'dhikr',
      },
      { id: '10_quran', title: 'Memorise Al-Baqarah 2:186', category: 'quran' },
      {
        id: '10_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '10_reflection',
        title: 'Reflect on answered prayers in your life',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 11 ─────────────────────────────
  {
    day: 11,
    theme: 'Sadaqah',
    themeArabic: 'الصدقة',
    intro:
      'Giving in the way of Allah purifies your wealth, eases hardship and earns His love. The Prophet ﷺ was the most generous of people, and even more generous in Ramadan.',
    morningDhikr: [
      {
        id: 'yunfiqu_fa_tukhlif',
        arabic: 'اللَّهُمَّ اجْعَلْنَا مِمَّن يُنفِقُ فَتُخْلِفُ لَهُ',
        transliteration: 'Allāhummajʿalnā mimman yunfiqu fa-tukhlifu lah',
        meaning:
          "(Personal du'a, inspired by the angels' du'a in Bukhari 1442) O Allah, make us among those who spend, and You replace it for them",
        count: 1,
        // Not itself a narrated du'a (verification-2 R31), so no source is shown.
        source: null,
      },
    ],
    eveningDhikr: [
      {
        id: 'bismillah_before_eating',
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillāh',
        meaning: '(Before eating) In the name of Allah',
        count: 1,
        source: hadith('Bukhari 5376; Muslim 2022'),
      },
      SUBHANALLAHI_WA_BIHAMDIHI,
    ],
    quran: {
      surah: 'Al-Baqarah',
      surahNumber: 2,
      ayahs: '261',
      note: 'The parable of those who spend in the way of Allah: like a grain that grows seven ears, with a hundred grains in each ear. "And Allah multiplies for whom He wills."',
    },
    prayerFocus: {
      prayer: 'fajr',
      tip: 'Every morning two angels come down. One says, "O Allah, give the one who spends something in return," and the other says, "O Allah, give the one who withholds loss" (Bukhari 1442; Muslim 1010). Give some sadaqah early today, after Fajr.',
    },
    sunnah: {
      title: 'Sadaqah jariyah (ongoing charity)',
      description:
        'The Prophet ﷺ said: "When a person dies, his deeds come to an end except for three: ongoing charity, knowledge that benefits, or a righteous child who prays for him." Start an ongoing charity today: share beneficial knowledge, teach someone a Sunnah, plant a tree, give to a masjid fund or support an orphan.',
      source: hadith('Muslim 1631'),
    },
    character: {
      trait: 'Generosity',
      arabic: 'الكرم',
      description:
        'True generosity is giving when it is hard to give, giving what you love, and expecting nothing in return.',
      action:
        'Give sadaqah today, even a small coin, a smile or some food. Give something that costs you something.',
    },
    hadith: {
      arabic:
        'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلاَّ عِزًّا',
      meaning:
        '"Charity does not decrease wealth, and Allah does not increase a servant who forgives except in honour."',
      source: hadith('Muslim 2588'),
    },
    reflection:
      'What are you holding back from giving: money, time, knowledge or kindness? What would happen if you gave more?',
    tasks: [
      {
        id: '11_sadaqah',
        title: 'Give sadaqah today (any amount)',
        titleBeginner: 'Give any small sadaqah, even a smile',
        category: 'character',
      },
      {
        id: '11_ongoing',
        title: 'Do one act of ongoing charity (sadaqah jariyah)',
        category: 'sunnah',
      },
      {
        id: '11_quran',
        title: 'Read Al-Baqarah 2:261 and reflect on its promise',
        category: 'quran',
      },
      {
        id: '11_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '11_dhikr',
        title: 'Say SubhanAllahi wa bihamdihi 100 times',
        category: 'dhikr',
        tasbih: [{ dhikrId: 'subhanallahi_wa_bihamdihi', target: 100 }],
      },
      {
        id: '11_reflection',
        title: 'Reflect on your relationship with giving',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 12 ─────────────────────────────
  {
    day: 12,
    theme: 'Halal Rizq',
    themeArabic: 'الرزق الحلال',
    intro:
      'What we earn and consume shapes our hearts and our worship. Today, look at your livelihood in the light of Islam.',
    morningDhikr: [
      {
        id: 'ikfini_bi_halalik',
        arabic:
          'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
        transliteration:
          'Allāhummak-finī bi-ḥalālika ʿan ḥarāmik, wa aghninī bi-faḍlika ʿamman siwāk',
        meaning:
          'O Allah, suffice me with what You have made lawful instead of what You have forbidden, and by Your grace make me free of need of anyone besides You',
        count: 1,
        source: hadith('Tirmidhi 3563', 'hasan'),
      },
    ],
    eveningDhikr: [
      {
        id: 'audhu_minal_faqr',
        arabic:
          'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْفَقْرِ وَالْقِلَّةِ وَالذِّلَّةِ، وَأَعُوذُ بِكَ مِنْ أَنْ أَظْلِمَ أَوْ أُظْلَمَ',
        transliteration:
          'Allāhumma innī aʿūdhu bika minal-faqri wal-qillati wadh-dhillah, wa aʿūdhu bika min an aẓlima aw uẓlam',
        meaning:
          'O Allah, I seek refuge in You from poverty, from scarcity and from humiliation, and I seek refuge in You from wronging others or being wronged',
        count: 1,
        source: hadith('Abu Dawud 1544'),
      },
      {
        id: 'astaghfirullah',
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        transliteration: 'Astaghfirullāh',
        meaning:
          "I seek Allah's forgiveness. The Prophet ﷺ sought forgiveness a hundred times a day.",
        count: 100,
        source: hadith('Muslim 2702'),
      },
    ],
    quran: {
      surah: 'Al-Baqarah',
      surahNumber: 2,
      ayahs: '168-169',
      note: 'Allah commands us to eat of what is lawful and good, and warns us not to follow the footsteps of Shaytan: "Indeed, he is to you a clear enemy."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: "Pray 2 rak'ahs of Duha today, between sunrise and Dhuhr. Every morning a charity is due for each joint of your body, and two rak'ahs of Duha suffice for all of it (Muslim 720).",
    },
    sunnah: {
      title: "A du'a for lawful provision",
      description:
        'Make this du\'a often: "Allahummak-fini bi-halalika \'an haramika wa aghnini bi-fadlika \'amman siwak" (O Allah, suffice me with what You have made lawful instead of what You have forbidden, and make me free of need of anyone besides You). After Fajr, also ask Allah for "beneficial knowledge, good provision and accepted deeds" (Ibn Majah 925).',
      source: hadith('Tirmidhi 3563', 'hasan'),
    },
    character: {
      trait: 'Contentment',
      arabic: 'القناعة',
      description:
        'The Prophet ﷺ said: "Wealth is not having many possessions; true wealth is contentment of the soul" (Bukhari 6446).',
      action:
        'Practise contentment today: hold back from one purchase or desire you would normally give in to, and say "Alhamdulillah" for what you have.',
    },
    hadith: {
      arabic:
        'أَيُّهَا النَّاسُ، إِنَّ اللَّهَ طَيِّبٌ لاَ يَقْبَلُ إِلاَّ طَيِّبًا',
      meaning: '"O people, Allah is Good and accepts only what is good."',
      source: hadith('Muslim 1015'),
    },
    reflection:
      'Is there anything in how you earn or spend money that you need to review in the light of Islam?',
    tasks: [
      {
        id: '12_duha',
        title: "Pray 2 rak'ahs of Duha",
        category: 'prayer',
      },
      {
        id: '12_rizq_dua',
        title: "Say the du'a for lawful provision",
        category: 'dhikr',
      },
      {
        id: '12_quran',
        title: 'Read Al-Baqarah 2:168-169',
        category: 'quran',
      },
      {
        id: '12_contentment',
        title: 'Hold back from one desire and say Alhamdulillah',
        category: 'character',
      },
      {
        id: '12_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '12_reflection',
        title: 'Review your income and spending in the light of Islam',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 13 ─────────────────────────────
  {
    day: 13,
    theme: 'Tawakkul',
    themeArabic: 'التوكل',
    intro:
      "Tawakkul means doing your best and then placing the result entirely in Allah's hands. It is not laziness; it is one of the highest levels of faith.",
    morningDhikr: [
      {
        id: 'hasbunallah',
        arabic: 'حَسۡبُنَا ٱللَّهُ وَنِعۡمَ ٱلۡوَكِيلُ',
        transliteration: 'Ḥasbunallāhu wa niʿmal-wakīl',
        meaning:
          'Allah is sufficient for us, and He is the best disposer of affairs',
        count: 1,
        source: quran('Quran 3:173'),
      },
      {
        id: 'leaving_home_dua',
        arabic:
          'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ',
        transliteration:
          'Bismillāh, tawakkaltu ʿalallāh, lā ḥawla wa lā quwwata illā billāh',
        meaning:
          '(On leaving home) In the name of Allah; I place my trust in Allah; there is no might nor power except by Allah',
        count: 1,
        source: hadith('Abu Dawud 5095; Tirmidhi 3426'),
      },
    ],
    eveningDhikr: [
      {
        id: 'tahlil',
        arabic:
          'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration:
          'Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʿalā kulli shayʾin qadīr',
        meaning:
          'None has the right to be worshipped but Allah alone, without partner; His is the dominion and His is the praise, and He is able to do all things',
        count: 100,
        source: hadith('Muslim 2691'),
      },
    ],
    quran: {
      surah: 'At-Talaq',
      surahNumber: 65,
      ayahs: '3',
      note: 'The well-known verse on trust: "And whoever relies upon Allah, He is sufficient for him. Indeed, Allah will accomplish His purpose."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: "If you have a decision to make, big or small, pray istikhara today: two voluntary rak'ahs followed by the istikhara du'a, which the Prophet ﷺ taught his Companions for every matter (Bukhari 6382). Then move forward, trusting that Allah is guiding your steps.",
    },
    sunnah: {
      title: 'Tie your camel first',
      description:
        'A man asked the Prophet ﷺ whether he should tie his camel and trust in Allah, or leave it untied and trust in Allah. He said: "Tie it, and trust in Allah." Tawakkul includes doing your part fully, then letting go of the outcome.',
      source: hadith('Tirmidhi 2517', 'hasan'),
    },
    character: {
      trait: 'Releasing anxiety',
      arabic: 'رفع القلق',
      description:
        'Much anxiety comes from trying to control outcomes. Tawakkul replaces anxiety with peace, because Allah is in control.',
      action:
        'Write down your top 3 worries. Then sincerely hand each one to Allah\'s care, saying "Hasbunallahu wa ni\'mal wakil."',
    },
    hadith: {
      arabic:
        'لَوْ أَنَّكُمْ كُنْتُمْ تَوَكَّلُونَ عَلَى اللَّهِ حَقَّ تَوَكُّلِهِ لَرُزِقْتُمْ كَمَا تُرْزَقُ الطَّيْرُ، تَغْدُو خِمَاصًا وَتَرُوحُ بِطَانًا',
      meaning:
        '"If you relied on Allah as He truly deserves, you would be provided for as the birds are provided for: they go out hungry in the morning and return full in the evening."',
      source: hadith('Tirmidhi 2344'),
    },
    reflection:
      'In which part of your life do you struggle most to trust Allah? What would happen if you truly let go?',
    tasks: [
      {
        id: '13_tahlil',
        title: 'Say the tahlil (La ilaha illallahu wahdahu...) 100 times',
        category: 'dhikr',
        tasbih: [{ dhikrId: 'tahlil', target: 100 }],
      },
      {
        id: '13_worries',
        title: 'Hand your top 3 worries to Allah',
        category: 'reflection',
      },
      {
        id: '13_istikhara',
        title: 'Pray istikhara for a current decision',
        titleBeginner: "Learn the istikhara du'a for your next decision",
        category: 'prayer',
      },
      { id: '13_quran', title: 'Memorise At-Talaq 65:3', category: 'quran' },
      {
        id: '13_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '13_reflection',
        title: 'Journal on trust and anxiety',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 14 ─────────────────────────────
  {
    day: 14,
    theme: 'Shukr',
    themeArabic: 'الشكر',
    intro:
      'Allah says, "If you are grateful, I will surely increase you." Today, learn to see every moment as a gift from Him, and to show gratitude in word and deed.',
    morningDhikr: [
      {
        id: 'waking_dua',
        arabic:
          'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration:
          'Al-ḥamdu lillāhil-ladhī aḥyānā baʿda mā amātanā wa ilayhin-nushūr',
        meaning:
          '(On waking) Praise be to Allah who gave us life after causing us to die, and to Him is the resurrection',
        count: 1,
        source: hadith('Bukhari 6312; Muslim 2711'),
      },
      {
        id: 'waking_dua_afani',
        arabic:
          'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ',
        transliteration:
          'Al-ḥamdu lillāhil-ladhī ʿāfānī fī jasadī, wa radda ʿalayya rūḥī, wa adhina lī bi-dhikrih',
        meaning:
          '(On waking) Praise be to Allah who gave health to my body, returned my soul to me and permitted me to remember Him',
        count: 1,
        source: hadith('Tirmidhi 3401', 'hasan'),
      },
    ],
    eveningDhikr: [
      {
        id: 'hamdan_kathiran',
        arabic: 'الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
        transliteration:
          'Al-ḥamdu lillāhi ḥamdan kathīran ṭayyiban mubārakan fīh',
        meaning: 'Praise be to Allah, abundant, good and blessed praise',
        count: 1,
        source: hadith('Muslim 600; Bukhari 799'),
      },
      {
        id: 'ainni_ala_dhikrik',
        arabic:
          'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
        transliteration:
          'Allāhumma aʿinnī ʿalā dhikrika wa shukrika wa ḥusni ʿibādatik',
        meaning:
          '(At the end of each prayer) O Allah, help me to remember You, thank You and worship You well',
        count: 1,
        source: hadith("Abu Dawud 1522; Nasa'i 1303"),
      },
    ],
    quran: {
      surah: 'Ibrahim',
      surahNumber: 14,
      ayahs: '7',
      note: 'Allah\'s promise that gratitude brings increase: "If you are grateful, I will surely increase you; but if you deny, indeed, My punishment is severe."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: 'When good news or a blessing reaches you today, fall into a single prostration of gratitude (sujud ash-shukr). Whenever something pleasing came to the Prophet ﷺ, he would fall down in prostration, thanking Allah (Abu Dawud 2774). After each prayer, ask Allah to help you thank Him.',
    },
    sunnah: {
      title: 'Thank people too',
      description:
        'The Prophet ﷺ said: "Whoever does not thank people does not thank Allah." Show gratitude in two ways today: thank Allah directly (Alhamdulillah), and thank the people through whom He blessed you.',
      source: hadith('Abu Dawud 4811; Tirmidhi 1954'),
    },
    character: {
      trait: 'Seeing the good',
      arabic: 'حسن الظن',
      description:
        'Shukr trains us to see blessings even in hardship. Everything Allah decrees has wisdom, even what hurts.',
      action:
        'Think of something that is difficult in your life right now. Write down 3 blessings that may be hidden in it.',
    },
    hadith: {
      arabic:
        'انْظُرُوا إِلَى مَنْ أَسْفَلَ مِنْكُمْ وَلاَ تَنْظُرُوا إِلَى مَنْ هُوَ فَوْقَكُمْ، فَهُوَ أَجْدَرُ أَنْ لاَ تَزْدَرُوا نِعْمَةَ اللَّهِ عَلَيْكُمْ',
      meaning:
        '"Look at those below you and do not look at those above you, for that is more fitting, so that you do not belittle the favours of Allah upon you."',
      source: hadith('Muslim 2963; Bukhari 6490'),
    },
    reflection:
      'What is one blessing you often overlook or take for granted? How would your day change if you truly appreciated it?',
    tasks: [
      {
        id: '14_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced:
          "Pray all 5 prayers on time, saying Allahumma a'inni 'ala dhikrika wa shukrika after each",
        category: 'prayer',
      },
      {
        id: '14_sujud_shukr',
        title:
          'Make a prostration of gratitude (sujud ash-shukr) for a blessing',
        category: 'sunnah',
      },
      {
        id: '14_shukr_list',
        title: 'Write down 20 specific blessings',
        titleBeginner: 'Write down 5 specific blessings',
        category: 'reflection',
      },
      {
        id: '14_thank_people',
        title: 'Sincerely thank 3 people today',
        category: 'character',
      },
      {
        id: '14_quran',
        title: 'Read Ibrahim 14:7 and take in its promise',
        category: 'quran',
      },
      {
        id: '14_difficulty',
        title: 'Find 3 blessings in a current difficulty',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 15 ─────────────────────────────
  {
    day: 15,
    theme: 'Sidq',
    themeArabic: 'الصدق',
    intro:
      'Truthfulness in speech, in action and in the heart is the foundation of noble character. Today you practise complete honesty, with others and with yourself.',
    morningDhikr: [
      {
        id: 'sidq_dua',
        arabic:
          'اللَّهُمَّ إِنِّي أَسْأَلُكَ الصِّدْقَ فِي الْقَوْلِ وَالْعَمَلِ',
        transliteration: 'Allāhumma innī asʾalukaṣ-ṣidqa fil-qawli wal-ʿamal',
        meaning:
          "(Personal du'a) O Allah, I ask You for truthfulness in speech and in action",
        count: 1,
        source: null,
      },
    ],
    eveningDhikr: [
      {
        id: 'ighsilni',
        arabic:
          'اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ',
        transliteration:
          'Allāhummaghsilnī min khaṭāyāya bil-māʾi wath-thalji wal-barad',
        meaning: 'O Allah, wash away my sins with water, snow and hail',
        count: 1,
        source: hadith("Nasa'i 895"),
      },
      {
        id: 'astaghfirullah',
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        transliteration: 'Astaghfirullāh',
        meaning:
          "I seek Allah's forgiveness. The Prophet ﷺ sought forgiveness a hundred times a day.",
        count: 100,
        source: hadith('Muslim 2702'),
      },
    ],
    quran: {
      surah: 'At-Tawbah',
      surahNumber: 9,
      ayahs: '119',
      note: 'The command to stand with the truthful: "O you who believe, fear Allah and be with those who are truthful."',
    },
    prayerFocus: {
      prayer: 'isha',
      tip: "Among the qualities Allah praises alongside truthfulness is seeking forgiveness before dawn (Al 'Imran 3:17). Tonight, pray 2 or more rak'ahs of night prayer, before you sleep or before Fajr, and ask Him for forgiveness.",
    },
    sunnah: {
      title: 'No white lies or half-truths',
      description:
        'When the Prophet ﷺ called the tribes of Quraysh together, they told him: "We have never experienced anything from you but truthfulness." Today, be completely honest in every interaction: no white lies, exaggerations or misleading statements, even ones that seem harmless.',
      source: hadith('Bukhari 4770'),
    },
    character: {
      trait: 'Honest self-assessment',
      arabic: 'المحاسبة',
      description:
        'True sidq includes being honest with yourself about your flaws and weaknesses, without excuses or self-deception.',
      action:
        "Write an honest self-assessment: where do you fall short? What do you tell yourself that isn't fully true?",
    },
    hadith: {
      arabic:
        'إِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ، وَإِنَّ الرَّجُلَ لَيَصْدُقُ حَتَّى يَكُونَ صِدِّيقًا، وَإِنَّ الْكَذِبَ يَهْدِي إِلَى الْفُجُورِ، وَإِنَّ الْفُجُورَ يَهْدِي إِلَى النَّارِ، وَإِنَّ الرَّجُلَ لَيَكْذِبُ، حَتَّى يُكْتَبَ عِنْدَ اللَّهِ كَذَّابًا',
      meaning:
        '"Truthfulness leads to righteousness, and righteousness leads to Paradise. A man keeps telling the truth until he becomes truthful. Lying leads to wickedness, and wickedness leads to the Fire. A man keeps lying until he is written before Allah as a liar."',
      source: hadith('Bukhari 6094; Muslim 2607'),
    },
    reflection:
      'Is there an area where you have been less than fully honest, with others or with yourself?',
    tasks: [
      {
        id: '15_full_honesty',
        title: 'Be completely honest in every interaction today',
        titleBeginner: 'Avoid even one white lie today',
        category: 'character',
      },
      {
        id: '15_self_assess',
        title: 'Write an honest self-assessment',
        category: 'reflection',
      },
      { id: '15_quran', title: 'Memorise At-Tawbah 9:119', category: 'quran' },
      {
        id: '15_tahajjud',
        title: "Pray 2 rak'ahs of night prayer (tahajjud)",
        titleBeginner: "Pray 2 extra rak'ahs before you sleep",
        titleAdvanced: 'Wake in the last third of the night and pray tahajjud',
        category: 'prayer',
      },
      {
        id: '15_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '15_dhikr',
        title: 'Say astaghfirullah 100 times',
        category: 'dhikr',
        tasbih: [{ dhikrId: 'astaghfirullah', target: 100 }],
      },
    ],
  },

  // ───────────────────────────── Day 16 ─────────────────────────────
  {
    day: 16,
    theme: 'Amanah',
    themeArabic: 'الأمانة',
    intro:
      'Amanah means fulfilling trusts, keeping promises and being reliable in every role: in your family, with friends, at work and as a Muslim. Even before prophethood, the Prophet ﷺ was known among his people for his trustworthiness.',
    morningDhikr: [
      {
        id: 'audhu_minal_khiyanah',
        arabic:
          'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْجُوعِ فَإِنَّهُ بِئْسَ الضَّجِيعُ، وَأَعُوذُ بِكَ مِنَ الْخِيَانَةِ فَإِنَّهَا بِئْسَتِ الْبِطَانَةُ',
        transliteration:
          'Allāhumma innī aʿūdhu bika minal-jūʿi fa-innahū biʾsaḍ-ḍajīʿ, wa aʿūdhu bika minal-khiyānati fa-innahā biʾsatil-biṭānah',
        meaning:
          'O Allah, I seek refuge in You from hunger, for it is a wretched bed-fellow, and from treachery, for it is a wretched inner companion',
        count: 1,
        source: hadith("Abu Dawud 1547; Nasa'i 5468", 'hasan'),
      },
    ],
    eveningDhikr: [
      {
        id: 'subhanallahil_azimi_wa_bihamdihi',
        arabic: 'سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ',
        transliteration: 'SubḥānAllāhil-ʿAẓīmi wa biḥamdih',
        meaning: 'Glory be to Allah the Magnificent, and praise be to Him',
        count: 100,
        source: hadith('Abu Dawud 5091'),
      },
    ],
    quran: {
      surah: 'Al-Anfal',
      surahNumber: 8,
      ayahs: '27',
      note: '"O you who believe, do not betray Allah and the Messenger, and do not knowingly betray your trusts."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: "Prayer itself is a trust from Allah. Fulfil it completely today: pray all 5 prayers on time, with their sunnah rak'ahs, with good wudu, facing the qiblah.",
    },
    sunnah: {
      title: 'Keeping promises',
      description:
        'The Prophet ﷺ said: "The signs of a hypocrite are three: when he speaks he lies, when he promises he breaks his promise, and when he is trusted he betrays the trust." List any promises or commitments you have not kept, and fulfil at least one today.',
      source: hadith('Bukhari 33; Muslim 59'),
    },
    character: {
      trait: 'Reliability',
      arabic: 'الموثوقية',
      description:
        'Be the person people can count on. Your word is your bond: when you say you will do something, do it.',
      action:
        'Pick one unfulfilled promise or commitment. Fulfil it today, or speak honestly with the person involved.',
    },
    hadith: {
      // Exact excerpt as in Bukhari 7138 and Muslim 1829 (Bukhari 893 has the same without أَلاَ).
      arabic: 'أَلاَ كُلُّكُمْ رَاعٍ، وَكُلُّكُمْ مَسْئُولٌ عَنْ رَعِيَّتِهِ',
      meaning:
        '"Indeed, each of you is a shepherd, and each of you is responsible for his flock."',
      source: hadith('Bukhari 7138; Muslim 1829'),
    },
    reflection:
      'Who and what has been placed in your care? In which of those roles could you be more trustworthy or reliable?',
    tasks: [
      {
        id: '16_promises',
        title: 'Fulfil one unkept promise today',
        category: 'character',
      },
      {
        id: '16_all_prayers',
        title: "Pray all 5 prayers on time with their sunnah rak'ahs",
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced:
          "Pray all 5 prayers early in their time, with all their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '16_quran',
        title: 'Read Al-Anfal 8:27 and reflect',
        category: 'quran',
      },
      {
        id: '16_dhikr',
        title: 'Say SubhanAllahil-Azimi wa bihamdihi 100 times',
        category: 'dhikr',
        tasbih: [{ dhikrId: 'subhanallahil_azimi_wa_bihamdihi', target: 100 }],
      },
      {
        id: '16_reflection',
        title: 'Review your promises and commitments',
        category: 'reflection',
      },
      {
        id: '16_amanah_act',
        title: 'Be the most reliable person in one situation today',
        category: 'sunnah',
      },
    ],
  },

  // ───────────────────────────── Day 17 ─────────────────────────────
  {
    day: 17,
    theme: 'Sabr',
    themeArabic: 'الصبر',
    intro:
      '"Indeed, Allah is with the patient." Sabr is not passive resignation; it is active, disciplined perseverance, knowing that Allah is testing and refining you.',
    morningDhikr: [
      {
        id: 'sabr_dua',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الصَّبْرَ عَلَى أَقْدَارِكَ',
        transliteration: 'Allāhumma innī asʾalukaṣ-ṣabra ʿalā aqdārik',
        meaning:
          "(Personal du'a) O Allah, I ask You for patience with what You decree",
        count: 1,
        source: null,
      },
      {
        id: 'istirja',
        arabic:
          'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا',
        transliteration:
          "Innā lillāhi wa innā ilayhi rājiʿūn, Allāhumma'jurnī fī muṣībatī wa akhlif lī khayran minhā",
        meaning:
          '(At a calamity) We belong to Allah and to Him we return. O Allah, reward me in my affliction and replace it for me with something better',
        count: 1,
        source: hadith('Muslim 918'),
      },
    ],
    eveningDhikr: [
      {
        id: 'audhu_minal_jaza',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْجَزَعِ',
        transliteration: 'Allāhumma innī aʿūdhu bika minal-jazaʿ',
        meaning:
          "(Personal du'a) O Allah, I seek refuge in You from panic and despair in hardship",
        count: 1,
        source: null,
      },
      SUBHANALLAHI_WA_BIHAMDIHI,
    ],
    quran: {
      surah: 'Al-Baqarah',
      surahNumber: 2,
      ayahs: '155-157',
      note: 'Allah tests us with fear, hunger and loss, "but give good tidings to the patient: those who, when disaster strikes them, say: Indeed we belong to Allah, and indeed to Him we will return."',
    },
    prayerFocus: {
      prayer: 'fajr',
      tip: 'Fajr is itself a test of sabr: leaving sleep and a warm bed. Today, when the alarm rings, practise patience by getting up straight away. Each morning is training in sabr.',
    },
    sunnah: {
      title: 'Patience in anger',
      description:
        'The Prophet ﷺ said: "The strong one is not the one who overcomes people by his strength, but the one who controls himself when angry." When something irritates you today, pause and say "A\'udhu billahi minash-shaytanir-rajim" (Bukhari 6115). If you are standing, sit down (Abu Dawud 4782).',
      source: hadith('Bukhari 6114; Muslim 2609; Bukhari 6115; Abu Dawud 4782'),
    },
    character: {
      trait: 'Self-control',
      arabic: 'ضبط النفس',
      description:
        'Sabr in the face of anger, frustration and difficulty is the highest level of this quality.',
      action:
        'When you feel irritated or frustrated today, stop and say "Alhamdulillah \'ala kulli hal" (praise be to Allah in every situation) before you respond.',
    },
    hadith: {
      arabic:
        'عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ وَلَيْسَ ذَاكَ لأَحَدٍ إِلاَّ لِلْمُؤْمِنِ إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ',
      meaning:
        '"How wonderful is the affair of the believer! All of it is good, and that is for no one except the believer. If something good happens to him, he is grateful, and that is good for him. If something bad happens to him, he is patient, and that is good for him."',
      source: hadith('Muslim 2999'),
    },
    reflection:
      'What tests you most in life right now? How can you see it as something Allah is using to raise you?',
    tasks: [
      {
        id: '17_anger',
        title: 'Practise sabr in one frustrating situation',
        category: 'character',
      },
      {
        id: '17_fajr',
        title: 'Get up at the first alarm and pray Fajr',
        titleBeginner: 'Pray Fajr before sunrise',
        titleAdvanced:
          'Get up at the first alarm and pray Fajr early in its time',
        category: 'prayer',
      },
      {
        id: '17_quran',
        title: 'Read Al-Baqarah 2:155-157 and take it to heart',
        category: 'quran',
      },
      {
        id: '17_inna_lillah',
        title:
          'Say "Inna lillahi wa inna ilayhi raji\'un" at every difficulty today',
        category: 'dhikr',
      },
      {
        id: '17_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '17_reflection',
        title: 'See a current trial as Allah refining you',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 18 ─────────────────────────────
  {
    day: 18,
    theme: "Tawadu'",
    themeArabic: 'التواضع',
    intro:
      "The Prophet ﷺ was the most humble of people, though he was the greatest of them. True tawadu' comes from knowing Allah and knowing yourself.",
    morningDhikr: [
      {
        id: 'audhu_minal_kibr',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكِبْرِ وَالْعُجْبِ',
        transliteration: 'Allāhumma innī aʿūdhu bika minal-kibri wal-ʿujb',
        meaning:
          "(Personal du'a) O Allah, I seek refuge in You from arrogance and self-admiration",
        count: 1,
        source: null,
      },
    ],
    eveningDhikr: [
      {
        id: 'kaffarat_al_majlis',
        arabic:
          'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
        transliteration:
          'Subḥānakallāhumma wa biḥamdik, ashhadu an lā ilāha illā ant, astaghfiruka wa atūbu ilayk',
        meaning:
          '(At the end of a sitting) Glory be to You, O Allah, and praise; I testify there is no god but You; I seek Your forgiveness and repent to You',
        count: 1,
        source: hadith('Abu Dawud 4859; Tirmidhi 3433'),
      },
    ],
    quran: {
      surah: 'Al-Isra',
      surahNumber: 17,
      ayahs: '37',
      note: '"And do not walk upon the earth arrogantly. Indeed, you will never tear the earth apart, and you will never reach the mountains in height."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: 'Placing your forehead on the ground is the fullest physical expression of humility. In every sujood today, say "Subhana Rabbiyal-A\'la" (Glory be to my Lord, the Most High; Muslim 772) and feel its meaning: you are submitting completely to Him. Let that feeling stay with you.',
    },
    sunnah: {
      title: 'Be the first to give salam',
      description:
        'The Prophet ﷺ would greet even children with salam (Bukhari 6247; Muslim 2168), and he said: "The people closest to Allah are those who begin the greeting of salam." Today, be the first to say salam to everyone you meet.',
      source: hadith('Abu Dawud 5197; Bukhari 6247'),
    },
    character: {
      trait: 'Avoiding pride',
      arabic: 'ترك الكبر',
      description:
        'Pride (kibr) is a disease of the heart. The Prophet ﷺ said that no one with an atom\'s weight of pride in his heart will enter Paradise, and he defined pride as "rejecting the truth and looking down on people" (Muslim 91).',
      action:
        "Sincerely praise someone's work or quality today without comparing them to yourself. Celebrate someone else's success.",
    },
    hadith: {
      arabic:
        'إِنَّ اللَّهَ أَوْحَى إِلَىَّ أَنْ تَوَاضَعُوا حَتَّى لاَ يَفْخَرَ أَحَدٌ عَلَى أَحَدٍ وَلاَ يَبْغِي أَحَدٌ عَلَى أَحَدٍ',
      meaning:
        '"Allah has revealed to me that you must be humble towards one another, so that no one boasts over another and no one wrongs another."',
      source: hadith('Muslim 2865'),
    },
    reflection:
      'In which situations do you feel superior to others? How can you grow real humility in those moments?',
    tasks: [
      {
        id: '18_salam_first',
        title: 'Be the first to say salam to everyone today',
        category: 'sunnah',
      },
      {
        id: '18_compliment',
        title: 'Sincerely praise someone without comparing yourself',
        category: 'character',
      },
      {
        id: '18_sujood',
        title: 'Feel humility deeply in every sujood today',
        titleBeginner: 'Make one sujood slow and humble',
        category: 'prayer',
      },
      { id: '18_quran', title: 'Memorise Al-Isra 17:37', category: 'quran' },
      {
        id: '18_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '18_reflection',
        title: 'Reflect on moments of pride and how to address them',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 19 ─────────────────────────────
  {
    day: 19,
    theme: 'Rahmah',
    themeArabic: 'الرحمة',
    intro:
      'The Prophet ﷺ was sent as a mercy to all the worlds. Mercy towards people, animals and all of creation is a sign of strong faith.',
    morningDhikr: [
      {
        id: 'basmalah',
        arabic: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',
        transliteration: 'Bismillāhir-Raḥmānir-Raḥīm',
        meaning: 'In the name of Allah, the Most Gracious, the Most Merciful',
        count: 1,
        source: quran('Quran 1:1'),
      },
      {
        id: 'irhamna_bi_rahmatik',
        arabic:
          'اللَّهُمَّ ارْحَمْنَا بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ',
        transliteration:
          'Allāhummarḥamnā bi-raḥmatikal-latī wasiʿat kulla shayʾ',
        meaning:
          "(Personal du'a) O Allah, have mercy on us with Your mercy that encompasses all things",
        count: 1,
        source: null,
      },
    ],
    eveningDhikr: [
      {
        id: 'ighfir_lil_muminin',
        arabic: 'اللَّهُمَّ اغْفِرْ لِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ',
        transliteration: 'Allāhummaghfir lil-muʾminīna wal-muʾmināt',
        meaning: 'O Allah, forgive the believing men and women',
        count: 10,
        // A general du'a echoing Quran 47:19 and 71:28; not their exact wording, so no source.
        source: null,
      },
      {
        id: 'rabbana_wasita',
        arabic:
          'رَبَّنَا وَسِعۡتَ كُلَّ شَيۡءࣲ رَّحۡمَةࣰ وَعِلۡمࣰا فَٱغۡفِرۡ لِلَّذِينَ تَابُواْ وَٱتَّبَعُواْ سَبِيلَكَ وَقِهِمۡ عَذَابَ ٱلۡجَحِيمِ',
        transliteration:
          'Rabbanā wasiʿta kulla shayʾin raḥmatan wa ʿilman faghfir lilladhīna tābū wattabaʿū sabīlaka wa qihim ʿadhābal-jaḥīm',
        meaning:
          'Our Lord, You encompass all things in mercy and knowledge, so forgive those who repent and follow Your way, and protect them from the punishment of Hellfire',
        count: 1,
        source: quran('Quran 40:7'),
      },
    ],
    quran: {
      surah: 'Al-Anbiya',
      surahNumber: 21,
      ayahs: '107',
      note: 'The summary of the Prophet\'s ﷺ mission: "And We have not sent you except as a mercy to the worlds."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: 'In today\'s prayers, make specific du\'a for others: your parents, your family, the sick and suffering, and Muslims around the world. The Prophet ﷺ said that when a believer prays for his brother in his absence, the angel says, "And the same for you" (Muslim 2732).',
    },
    sunnah: {
      title: 'Mercy to animals',
      description:
        'The Prophet ﷺ told of a woman who entered the Fire because of a cat she locked up without food or water, and of a man who gave water to a thirsty dog, so Allah thanked him and admitted him to Paradise. Today, show active mercy: feed a bird, put out water, be gentle with animals and reduce waste.',
      source: hadith('Bukhari 3482; Bukhari 173'),
    },
    character: {
      trait: 'Compassion for those who struggle',
      arabic: 'الشفقة',
      description:
        'True rahmah means feeling the pain of others and acting to relieve it, without judging their struggles.',
      action:
        'Reach out to someone you know who is struggling. Not to advise them, just to listen and show you care.',
    },
    hadith: {
      arabic:
        'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ',
      meaning:
        '"The merciful are shown mercy by the Most Merciful. Be merciful to those on earth, and the One above the heavens will have mercy on you."',
      source: hadith('Tirmidhi 1924'),
    },
    reflection:
      'Who in your life needs more mercy and compassion from you? How can you show it this week?',
    tasks: [
      {
        id: '19_reach_out',
        title: 'Reach out to someone who is struggling',
        category: 'character',
      },
      {
        id: '19_dua_others',
        title: "Make specific du'a for others in every prayer",
        titleBeginner: "Make du'a for one other person in your prayer",
        category: 'prayer',
      },
      {
        id: '19_mercy_animal',
        title: 'Show mercy to an animal or to nature today',
        category: 'sunnah',
      },
      { id: '19_quran', title: 'Memorise Al-Anbiya 21:107', category: 'quran' },
      {
        id: '19_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '19_reflection',
        title: 'Think about who needs your mercy most',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 20 ─────────────────────────────
  {
    day: 20,
    theme: 'Silat ar-Rahim',
    themeArabic: 'صلة الرحم',
    intro:
      'Keeping family ties is one of the most emphasised duties in Islam, and cutting them is a serious sin. Today, actively strengthen your bonds with your family.',
    morningDhikr: [
      {
        id: 'barik_li_fi_ahli',
        arabic: 'اللَّهُمَّ بَارِكْ لِي فِي أَهْلِي وَمَالِي',
        transliteration: 'Allāhumma bārik lī fī ahlī wa mālī',
        meaning: "(Personal du'a) O Allah, bless me in my family and my wealth",
        count: 1,
        source: null,
      },
    ],
    eveningDhikr: [
      {
        id: 'ijma_shamla_ahli',
        arabic: 'اللَّهُمَّ اجْمَعْ شَمْلَ أَهْلِي عَلَى طَاعَتِكَ',
        transliteration: 'Allāhummajmaʿ shamla ahlī ʿalā ṭāʿatik',
        meaning: "(Personal du'a) O Allah, unite my family in obeying You",
        count: 1,
        source: null,
      },
      SUBHANALLAHI_WA_BIHAMDIHI,
    ],
    quran: {
      surah: 'An-Nisa',
      surahNumber: 4,
      ayahs: '1',
      note: 'Allah links keeping family ties directly to fearing Him: "And fear Allah, through whom you ask one another, and the wombs."',
    },
    prayerFocus: {
      prayer: 'fajr',
      tip: "After Fajr, call or message a family member you haven't spoken to recently, so your day begins with keeping ties.",
    },
    sunnah: {
      title: "Keeping ties even when others don't",
      description:
        'The Prophet ﷺ said: "The one who keeps ties is not the one who only returns the favour, but the one who keeps ties when they have been cut." Today, reach out to a family member you have drifted away from.',
      source: hadith('Bukhari 5991'),
    },
    character: {
      trait: 'Forgiveness in the family',
      arabic: 'العفو في العائلة',
      description:
        'Family conflicts are inevitable. The question is whether you hold grudges or choose to forgive for the sake of Allah.',
      action:
        'If there is a rift in any family relationship, take the first step today to repair it, even with a simple kind message.',
    },
    hadith: {
      arabic:
        'مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ',
      meaning:
        '"Whoever loves that his provision be expanded and his life be extended, let him keep the ties of kinship."',
      source: hadith('Bukhari 5986; Muslim 2557'),
    },
    reflection:
      'Which family relationships need your attention and repair? What small step can you take today?',
    tasks: [
      {
        id: '20_call_family',
        title:
          'Call, message or visit a family member today, ideally after Fajr',
        category: 'character',
      },
      {
        id: '20_family_dua',
        title: "Make du'a for each member of your family by name",
        category: 'dhikr',
      },
      {
        id: '20_repair',
        title: 'Take one step to repair a family rift',
        category: 'character',
      },
      {
        id: '20_quran',
        title: 'Read An-Nisa 4:1 and reflect',
        category: 'quran',
      },
      {
        id: '20_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '20_reflection',
        title: 'Map out your family relationships and what they need',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 21 ─────────────────────────────
  {
    day: 21,
    theme: 'Husn al-Khuluq',
    themeArabic: 'حسن الخلق',
    intro:
      "Nothing is heavier on the believer's scale on the Day of Resurrection than good character. Today you consciously practise beautiful manners in every interaction.",
    morningDhikr: [
      {
        id: 'ihdini_li_ahsanil_akhlaq',
        arabic:
          'وَاهْدِنِي لأَحْسَنِ الأَخْلاَقِ لاَ يَهْدِي لأَحْسَنِهَا إِلاَّ أَنْتَ وَاصْرِفْ عَنِّي سَيِّئَهَا لاَ يَصْرِفُ عَنِّي سَيِّئَهَا إِلاَّ أَنْتَ',
        transliteration:
          'Wahdinī li-aḥsanil-akhlāqi lā yahdī li-aḥsanihā illā ant, waṣrif ʿannī sayyiʾahā lā yaṣrifu ʿannī sayyiʾahā illā ant',
        meaning:
          "(From a longer du'a) And guide me to the best of character, for none guides to the best of it but You; and turn away from me its evil, for none turns away its evil but You",
        count: 1,
        source: hadith('Muslim 771'),
      },
    ],
    eveningDhikr: [
      {
        id: 'ahsanta_khalqi',
        arabic: 'اللَّهُمَّ أَحْسَنْتَ خَلْقِي فَأَحْسِنْ خُلُقِي',
        transliteration: 'Allāhumma aḥsanta khalqī fa-aḥsin khuluqī',
        meaning:
          'O Allah, You have made my form beautiful, so make my character beautiful',
        count: 1,
        // Narrated in Ahmad (sahih per al-Albani, Irwa' 74), but the Musnad number is unverified, so no ref is shown.
        source: null,
      },
      {
        id: 'astaghfirullah',
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        transliteration: 'Astaghfirullāh',
        meaning:
          "I seek Allah's forgiveness. The Prophet ﷺ sought forgiveness a hundred times a day.",
        count: 100,
        source: hadith('Muslim 2702'),
      },
    ],
    quran: {
      surah: 'Al-Qalam',
      surahNumber: 68,
      ayahs: '4',
      note: 'Allah\'s description of the Prophet ﷺ: "And indeed, you are of a great moral character."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: 'Pray each salah today with softness and calm, and let the sweetness of the prayer carry into how you treat people afterwards.',
    },
    sunnah: {
      title: 'The smile',
      description:
        'The Prophet ﷺ said: "Your smiling in the face of your brother is charity for you." Jarir said that from the day he accepted Islam, the Prophet ﷺ never saw him without smiling at him. Today, smile genuinely at every person you meet: at home, at work and in the street.',
      source: hadith('Tirmidhi 1956; Bukhari 3035; Muslim 2475'),
    },
    character: {
      trait: 'Kind speech',
      arabic: 'طيب الكلام',
      description:
        'The Prophet ﷺ said that a good word is charity (Bukhari 2989; Muslim 1009). The words you choose can lift people up or tear them down, so choose every word with care today.',
      action:
        'Speak kindly and warmly to every person today. Go out of your way to say something encouraging to at least 3 people.',
    },
    hadith: {
      arabic: 'إِنَّ مِنْ خِيَارِكُمْ أَحْسَنَكُمْ أَخْلاَقًا',
      meaning:
        '"Indeed, among the best of you are those with the best character."',
      source: hadith('Bukhari 3559; Muslim 2321'),
    },
    reflection:
      'Who in your life deserves more kindness and patience from you? How has your character grown over these 21 days?',
    tasks: [
      {
        id: '21_smile',
        title: 'Smile genuinely at every person today',
        category: 'sunnah',
      },
      {
        id: '21_kind_words',
        title: 'Encourage 3 people with genuine kind words',
        category: 'character',
      },
      { id: '21_quran', title: 'Memorise Al-Qalam 68:4', category: 'quran' },
      {
        id: '21_character_dua',
        title: "Recite the du'a for good character in the morning and evening",
        category: 'dhikr',
      },
      {
        id: '21_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '21_reflection',
        title: 'Look back at how your character has grown over 3 weeks',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 22 ─────────────────────────────
  {
    day: 22,
    theme: 'Ilm',
    themeArabic: 'العلم',
    intro:
      "Knowledge of the deen is the light by which you worship Allah as He deserves. Today you rekindle the pursuit of 'ilm as an act of worship.",
    morningDhikr: [
      {
        id: 'ilman_nafian',
        arabic:
          'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
        transliteration:
          'Allāhumma innī asʾaluka ʿilman nāfiʿan, wa rizqan ṭayyiban, wa ʿamalan mutaqabbalā',
        meaning:
          '(After the salam of Fajr) O Allah, I ask You for beneficial knowledge, good provision and accepted deeds',
        count: 1,
        source: hadith('Ibn Majah 925', 'hasan'),
      },
    ],
    eveningDhikr: [
      {
        id: 'rabbi_zidni_ilma',
        arabic: 'رَّبِّ زِدۡنِي عِلۡمࣰا',
        transliteration: 'Rabbi zidnī ʿilmā',
        meaning: 'My Lord, increase me in knowledge',
        count: 1,
        source: quran('Quran 20:114'),
      },
      SUBHANALLAHI_WA_BIHAMDIHI,
    ],
    quran: {
      surah: 'Ta-Ha',
      surahNumber: 20,
      ayahs: '114',
      note: 'The only thing the Prophet ﷺ was commanded to ask for more of: "And say: My Lord, increase me in knowledge."',
    },
    prayerFocus: {
      prayer: 'fajr',
      tip: "After Fajr, while the mind is fresh and the world is quiet, spend 15 minutes studying one Islamic topic. Begin with the du'a for beneficial knowledge that the Prophet ﷺ said after the salam of Fajr.",
    },
    sunnah: {
      title: 'Learn one new thing about your deen',
      description:
        'The Prophet ﷺ said: "Whoever Allah wants good for, He gives him understanding of the religion." Learn one new thing about your deen today: a ruling of fiqh, a name of Allah, a hadith or the tafsir of an ayah.',
      source: hadith('Bukhari 71; Muslim 1037'),
    },
    character: {
      trait: 'Intellectual humility',
      arabic: 'التواضع العلمي',
      description:
        'The more you learn, the more you realise how little you know. True scholars are the most humble.',
      action:
        'Read one article or listen to one Islamic lecture today. Write down 3 things you learned.',
    },
    hadith: {
      arabic:
        'وَمَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
      meaning:
        '"Whoever travels a path seeking knowledge, Allah will make easy for him a path to Paradise."',
      source: hadith('Muslim 2699'),
    },
    reflection:
      'What gaps in your Islamic knowledge cause you the most uncertainty in your daily life?',
    tasks: [
      {
        id: '22_learn',
        title: 'Listen to one Islamic lecture or read Islamic content',
        category: 'reflection',
      },
      {
        id: '22_after_fajr',
        title: 'Study one Islamic topic after Fajr',
        category: 'sunnah',
      },
      {
        id: '22_quran',
        title: "Read Ta-Ha 20:114 and make its du'a",
        category: 'quran',
      },
      {
        id: '22_dhikr',
        title: 'Say SubhanAllahi wa bihamdih 100 times',
        category: 'dhikr',
        tasbih: [{ dhikrId: 'subhanallahi_wa_bihamdihi', target: 100 }],
      },
      {
        id: '22_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '22_reflection',
        title: 'Write down 3 things you want to learn about Islam',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 23 ─────────────────────────────
  {
    day: 23,
    theme: 'Tafakkur',
    themeArabic: 'التفكر',
    intro:
      'Allah repeatedly calls us to reflect on His creation and on ourselves. Today, step back from the rush of life and contemplate the signs of Allah.',
    morningDhikr: [
      {
        id: 'subhanallahi_adada_khalqih',
        arabic:
          'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ',
        transliteration:
          'SubḥānAllāhi wa biḥamdihī ʿadada khalqihī, wa riḍā nafsihī, wa zinata ʿarshihī, wa midāda kalimātih',
        meaning:
          '(Three times, after Fajr) Glory be to Allah and praise be to Him, as many times as the number of His creation, as much as pleases Him, as much as the weight of His Throne, and as much as the ink of His words',
        count: 3,
        source: hadith('Muslim 2726'),
      },
    ],
    eveningDhikr: [
      {
        id: 'rabbana_ma_khalaqta',
        arabic:
          'رَبَّنَا مَا خَلَقۡتَ هَٰذَا بَٰطِلࣰا سُبۡحَٰنَكَ فَقِنَا عَذَابَ ٱلنَّارِ',
        transliteration:
          'Rabbanā mā khalaqta hādhā bāṭilan subḥānaka fa-qinā ʿadhāban-nār',
        meaning:
          'Our Lord, You did not create this in vain; glory be to You, so protect us from the punishment of the Fire',
        count: 1,
        source: quran('Quran 3:191'),
      },
    ],
    quran: {
      surah: 'Al-Imran',
      surahNumber: 3,
      ayahs: '190-191',
      note: 'The people of understanding remember Allah standing, sitting and lying down, and reflect on the creation of the heavens and the earth.',
    },
    prayerFocus: {
      prayer: 'all',
      tip: 'If you can, pray at least one prayer outdoors today: on a balcony, in a garden or at a park. Let the creation around you remind you of the Creator.',
    },
    sunnah: {
      title: 'Reflecting on creation',
      description:
        'Allah praises those who "reflect on the creation of the heavens and the earth" and say: "Our Lord, You did not create this in vain." Take 15 minutes outside today: walk, sit and look at the sky, and say "SubhanAllah" at each sign of creation you notice.',
      source: quran('Quran 3:191'),
    },
    character: {
      trait: 'Deeper thinking',
      arabic: 'العمق الفكري',
      description:
        "In a world of constant distraction, the ability to think deeply about life's real questions is increasingly rare, and precious.",
      action:
        'Spend 15 minutes in complete silence today. No phone, no noise: just you, your thoughts and Allah.',
    },
    hadith: {
      arabic:
        'قَعَدَ فَنَظَرَ إِلَى السَّمَاءِ فَقَالَ ﴿إِنَّ فِي خَلْقِ السَّمَوَاتِ وَالأَرْضِ وَاخْتِلاَفِ اللَّيْلِ وَالنَّهَارِ لآيَاتٍ لأُولِي الأَلْبَابِ﴾',
      meaning:
        'Ibn \'Abbas said that when it was the last third of the night, the Prophet ﷺ sat up, looked at the sky and recited: "Indeed, in the creation of the heavens and the earth and the alternation of night and day are signs for those of understanding" (3:190).',
      source: hadith('Bukhari 4569'),
    },
    reflection:
      "What in creation most fills you with a sense of Allah's greatness? The stars? The human body? The ocean?",
    tasks: [
      {
        id: '23_nature',
        title: 'Spend 15 minutes outside reflecting on creation',
        category: 'sunnah',
      },
      {
        id: '23_silence',
        title: 'Sit in 15 minutes of complete silence',
        category: 'reflection',
      },
      {
        id: '23_quran',
        title: 'Read Al-Imran 3:190-191 slowly and reflect',
        category: 'quran',
      },
      {
        id: '23_dhikr',
        title: "Say the 'adada khalqih' glorification 3 times",
        category: 'dhikr',
        tasbih: [{ dhikrId: 'subhanallahi_adada_khalqih', target: 3 }],
      },
      {
        id: '23_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced:
          'Pray all 5 prayers on time, with at least one prayed outdoors',
        category: 'prayer',
      },
      {
        id: '23_reflection',
        title: 'Write about the signs of Allah you noticed today',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 24 ─────────────────────────────
  {
    day: 24,
    theme: 'Zuhd',
    themeArabic: 'الزهد',
    intro:
      'Zuhd does not mean poverty; it means your heart is not enslaved to worldly things. You use the world, but your heart lives for the akhirah.',
    morningDhikr: [
      {
        id: 'la_tajal_ad_dunya',
        arabic:
          'وَلاَ تَجْعَلِ الدُّنْيَا أَكْبَرَ هَمِّنَا وَلاَ مَبْلَغَ عِلْمِنَا',
        transliteration:
          'Wa lā tajʿalid-dunyā akbara hamminā wa lā mablagha ʿilminā',
        meaning:
          "(From a longer du'a he often made before rising from a gathering) And do not make this world our greatest concern nor the limit of our knowledge",
        count: 1,
        source: hadith('Tirmidhi 3502', 'hasan'),
      },
    ],
    eveningDhikr: [
      {
        id: 'asalukal_jannah',
        arabic:
          'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ',
        transliteration:
          'Allāhumma innī asʾalukal-jannata wa mā qarraba ilayhā min qawlin aw ʿamal',
        meaning:
          'O Allah, I ask You for Paradise and for whatever word or deed brings me near to it',
        count: 1,
        source: hadith('Ibn Majah 3846'),
      },
    ],
    quran: {
      surah: 'Al-Hadid',
      surahNumber: 57,
      ayahs: '20',
      note: 'The parable of this world: "Know that the life of this world is but amusement and diversion and adornment and boasting to one another and competition in increase of wealth and children..."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: "A sign of zuhd is giving your time to prayer over worldly pursuits. Today, pray the sunnah prayers with each fard: the Prophet ﷺ said that whoever prays twelve rak'ahs in a day and night, a house is built for him in Paradise (Muslim 728).",
    },
    sunnah: {
      title: 'A digital detox',
      description:
        'The Prophet ﷺ said: "There are two blessings that many people are cheated of: health and free time." Today, take a 3-hour break from social media and entertainment, and use that time for worship instead.',
      source: hadith('Bukhari 6412'),
    },
    character: {
      trait: 'Akhirah-oriented thinking',
      arabic: 'التوجه نحو الآخرة',
      description:
        'Before every major decision, ask: "How does this serve my akhirah?" Let that question reframe your choices.',
      action:
        'Identify one thing you own or one habit you have that is more hindrance than benefit to your deen. Consider reducing it.',
    },
    hadith: {
      arabic: 'كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ، أَوْ عَابِرُ سَبِيلٍ',
      meaning: '"Be in this world as if you were a stranger or a traveller."',
      source: hadith('Bukhari 6416'),
    },
    reflection:
      'Which worldly attachment (money, status, entertainment or comfort) has the strongest grip on your heart?',
    tasks: [
      {
        id: '24_digital_detox',
        title: 'Take a 3-hour social media break and use it for worship',
        category: 'sunnah',
      },
      {
        id: '24_all_sunnahs',
        title: 'Pray the sunnah prayers with your fard prayers',
        titleBeginner: "Pray the 2 sunnah rak'ahs before Fajr",
        titleAdvanced:
          "Pray all 12 sunnah rak'ahs with all 5 fard prayers on time",
        category: 'prayer',
      },
      {
        id: '24_quran',
        title: 'Read Al-Hadid 57:20 and reflect on this world',
        category: 'quran',
      },
      {
        id: '24_dhikr',
        title:
          "Make the du'a against worldly worry in the morning and the du'a for Paradise in the evening",
        category: 'dhikr',
      },
      {
        id: '24_worldly',
        title: 'Identify and reduce one worldly attachment',
        category: 'character',
      },
      {
        id: '24_reflection',
        title:
          'Reflect: how much time do you give this world, and how much your deen?',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 25 ─────────────────────────────
  {
    day: 25,
    theme: 'Ikhlas',
    themeArabic: 'الإخلاص',
    intro:
      'Sincerity is the soul of all worship: a deed is only accepted when it is done for Allah alone. Today you examine and purify your intentions.',
    morningDhikr: [
      {
        id: 'audhu_an_ushrika',
        arabic:
          'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أُشْرِكَ بِكَ وَأَنَا أَعْلَمُ، وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ',
        transliteration:
          'Allāhumma innī aʿūdhu bika an ushrika bika wa ana aʿlam, wa astaghfiruka limā lā aʿlam',
        meaning:
          'O Allah, I seek refuge in You from knowingly associating anything with You, and I seek Your forgiveness for what I do not know',
        count: 1,
        // al-Adab al-Mufrad 716 (sahih per al-Albani) is not in the verification mirror, so no ref is shown.
        source: null,
      },
    ],
    eveningDhikr: [
      {
        id: 'umar_dua_ikhlas',
        arabic:
          'اللَّهُمَّ اجْعَلْ عَمَلِي كُلَّهُ صَالِحًا، وَاجْعَلْهُ لِوَجْهِكَ خَالِصًا، وَلَا تَجْعَلْ لِأَحَدٍ فِيهِ شَيْئًا',
        transliteration:
          'Allāhummajʿal ʿamalī kullahū ṣāliḥā, wajʿalhu li-wajhika khāliṣā, wa lā tajʿal li-aḥadin fīhi shayʾā',
        meaning:
          "(Du'a of 'Umar ibn al-Khattab) O Allah, make all my deeds righteous, purely for Your Face, and let no one have any share in them",
        count: 1,
        source: athar("Du'a of 'Umar ibn al-Khattab (Ahmad, az-Zuhd)"),
      },
    ],
    quran: {
      surah: 'Al-Bayyinah',
      surahNumber: 98,
      ayahs: '5',
      note: 'The essence of the religion: "And they were not commanded except to worship Allah, sincere to Him in religion, inclining to truth, and to establish prayer and to give zakah. And that is the correct religion."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: 'Before each prayer today, check your intention: "Am I praying because people might see me, or purely for Allah?" Let every rak\'ah be for Him alone.',
    },
    sunnah: {
      title: 'The showing-off test',
      description:
        'Allah says in a hadith qudsi: "I am the most free of need of any partner. Whoever does a deed in which he associates anyone else with Me, I leave him and his association." Test each action today: "Would I do this the same way if no one was watching?" If not, correct your intention.',
      source: hadith('Muslim 2985'),
    },
    character: {
      trait: 'Private worship',
      arabic: 'العبادة السرية',
      description:
        'Among the seven whom Allah will shade on the Day when there is no shade but His is "a man who gives charity so secretly that his left hand does not know what his right hand gives" (Bukhari 660; Muslim 1031).',
      action:
        'Do one significant act of worship today that only you and Allah know about. No telling, no posting, no hints.',
    },
    hadith: {
      arabic:
        'إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ',
      meaning:
        '"Allah does not look at your forms or your wealth, but He looks at your hearts and your deeds."',
      source: hadith('Muslim 2564'),
    },
    reflection:
      'Which of your acts of worship might be tainted by the desire for praise or recognition?',
    tasks: [
      {
        id: '25_secret_deed',
        title: 'Do one significant act of worship in secret',
        category: 'character',
      },
      {
        id: '25_intention_check',
        title: 'Check your intention before every prayer today',
        category: 'prayer',
      },
      { id: '25_quran', title: 'Memorise Al-Bayyinah 98:5', category: 'quran' },
      {
        id: '25_dhikr',
        title: "Recite the du'as for sincerity in the morning and evening",
        category: 'dhikr',
      },
      {
        id: '25_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '25_reflection',
        title: 'Reflect on where you seek validation from people',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 26 ─────────────────────────────
  {
    day: 26,
    theme: 'Muraqabah',
    themeArabic: 'المراقبة',
    intro:
      'Muraqabah is living with the awareness that Allah sees your actions, your words and your secret thoughts. It is the heart of ihsan, the highest level of worship.',
    morningDhikr: [SAYYID_ISTIGHFAR],
    eveningDhikr: [
      {
        id: 'yuraqibuka',
        arabic:
          'اللَّهُمَّ اجْعَلْنِي مِمَّنْ يُرَاقِبُكَ فِي السِّرِّ وَالْعَلَانِيَةِ',
        transliteration:
          'Allāhummajʿalnī mimman yurāqibuka fis-sirri wal-ʿalāniyah',
        meaning:
          "(Personal du'a) O Allah, make me among those who are mindful of You in private and in public",
        count: 1,
        source: null,
      },
      SUBHANALLAHI_WA_BIHAMDIHI,
    ],
    quran: {
      surah: 'Al-Hadid',
      surahNumber: 57,
      ayahs: '4',
      note: '"And He is with you wherever you are. And Allah, of what you do, is Seeing."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: "Bring the awareness that Allah sees you into every rak'ah today, from the opening takbir to the final salam.",
    },
    sunnah: {
      title: 'Muhasabah (self-accounting)',
      description:
        '\'Umar ibn al-Khattab said: "Hold yourselves to account before you are held to account." This is a saying of \'Umar, not a hadith. Before sleeping, review your day: what did you do well, where did you fall short, and what will you improve tomorrow?',
      source: athar(
        "Athar of 'Umar ibn al-Khattab, cited by at-Tirmidhi under no. 2459",
      ),
    },
    character: {
      trait: 'The same in private',
      arabic: 'الثبات في الخلوة',
      description:
        'Who are you when no one is watching? Muraqabah means your private self and your public self are one and the same.',
      action:
        'Today, behave exactly the same whether or not you think you are being observed.',
    },
    hadith: {
      arabic:
        'أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ',
      meaning:
        '"[Ihsan is] to worship Allah as if you see Him, and if you do not see Him, He surely sees you."',
      source: hadith('Bukhari 50; Muslim 8'),
    },
    reflection:
      'How would your behaviour change if you were always aware that Allah sees you? What would you stop doing, and what would you start?',
    tasks: [
      {
        id: '26_ihsan',
        title: 'Pray every prayer with the awareness that Allah sees you',
        titleBeginner:
          'Pray one prayer today with full awareness that Allah sees you',
        titleAdvanced:
          "Pray all 5 prayers on time with their sunnah rak'ahs, with ihsan",
        category: 'prayer',
      },
      {
        id: '26_muhasabah',
        title: 'Review your day before you sleep (muhasabah)',
        category: 'reflection',
      },
      {
        id: '26_private',
        title: 'Behave the same in private as in public',
        category: 'character',
      },
      { id: '26_quran', title: 'Memorise Al-Hadid 57:4', category: 'quran' },
      {
        id: '26_dhikr',
        title: 'Say SubhanAllahi wa bihamdih 100 times',
        category: 'dhikr',
        tasbih: [{ dhikrId: 'subhanallahi_wa_bihamdihi', target: 100 }],
      },
      {
        id: '26_reflection',
        title: 'Reflect on whether your private and public selves match',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 27 ─────────────────────────────
  {
    day: 27,
    theme: 'Tawbah Nasuha',
    themeArabic: 'التوبة النصوحة',
    intro:
      'Tawbah nasuha is sincere repentance: real remorse, leaving the sin, and resolving never to return to it. Today you make a deep spiritual cleanse before the final days.',
    morningDhikr: [
      {
        id: 'rabbana_zalamna',
        arabic:
          'رَبَّنَا ظَلَمۡنَآ أَنفُسَنَا وَإِن لَّمۡ تَغۡفِرۡ لَنَا وَتَرۡحَمۡنَا لَنَكُونَنَّ مِنَ ٱلۡخَٰسِرِينَ',
        transliteration:
          'Rabbanā ẓalamnā anfusanā wa in lam taghfir lanā wa tarḥamnā lanakūnanna minal-khāsirīn',
        meaning:
          'Our Lord, we have wronged ourselves; if You do not forgive us and have mercy on us, we will surely be among the losers',
        count: 1,
        source: quran('Quran 7:23'),
      },
    ],
    eveningDhikr: [
      {
        id: 'asalukal_afiyah',
        arabic:
          'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
        transliteration:
          'Allāhumma innī asʾalukal-ʿāfiyata fid-dunyā wal-ākhirah. Allāhumma innī asʾalukal-ʿafwa wal-ʿāfiyata fī dīnī wa dunyāya wa ahlī wa mālī. Allāhummastur ʿawrātī wa āmin rawʿātī. Allāhummaḥ-faẓnī min bayni yadayya wa min khalfī wa ʿan yamīnī wa ʿan shimālī wa min fawqī, wa aʿūdhu bi-ʿaẓamatika an ughtāla min taḥtī',
        meaning:
          '(Morning and evening) O Allah, I ask You for well-being in this world and the next. O Allah, I ask You for pardon and well-being in my religion, my worldly life, my family and my wealth. O Allah, cover my faults and calm my fears. O Allah, guard me from in front, behind, my right, my left and above me, and I seek refuge in Your greatness from being struck down from beneath me',
        count: 1,
        source: hadith('Abu Dawud 5074; Ibn Majah 3871'),
      },
      {
        id: 'astaghfirullah_al_azim',
        arabic:
          'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
        transliteration:
          'Astaghfirullāhal-ʿAẓīmal-ladhī lā ilāha illā huwal-Ḥayyul-Qayyūmu wa atūbu ilayh',
        meaning:
          'I seek forgiveness from Allah the Magnificent, besides whom there is no god, the Ever-Living, the Sustainer, and I repent to Him',
        count: 1,
        source: hadith('Tirmidhi 3577'),
      },
    ],
    quran: {
      surah: 'At-Tahrim',
      surahNumber: 66,
      ayahs: '8',
      note: 'The command to repent sincerely: "O you who believe, turn to Allah in sincere repentance. Perhaps your Lord will remove from you your misdeeds and admit you into gardens beneath which rivers flow."',
    },
    prayerFocus: {
      prayer: 'isha',
      tip: 'In the last third of tonight, when Allah descends to the lowest heaven and asks, "Who is seeking My forgiveness, that I may forgive him?" (Bukhari 1145), pray tahajjud and make the most sincere tawbah of your life. Be specific about what you are repenting from.',
    },
    sunnah: {
      title: "Two rak'ahs of repentance (Salat at-Tawbah)",
      description:
        "The Prophet ﷺ said: \"No servant commits a sin, then purifies himself well, stands and prays two rak'ahs, then seeks Allah's forgiveness, except that Allah forgives him.\" Then he recited Al 'Imran 3:135. Make wudu carefully today, pray two rak'ahs and ask Allah to forgive you.",
      source: hadith('Abu Dawud 1521; Tirmidhi 406', 'hasan'),
    },
    character: {
      trait: 'Courage to change',
      arabic: 'الشجاعة على التغيير',
      description:
        'Real tawbah takes the courage to admit wrongdoing honestly and commit to change, even when it is uncomfortable.',
      action:
        'Make a list of 5 specific things you want to change or improve for good. These become your commitments after the 30 days.',
    },
    hadith: {
      arabic:
        'اللَّهُ أَفْرَحُ بِتَوْبَةِ عَبْدِهِ مِنْ أَحَدِكُمْ سَقَطَ عَلَى بَعِيرِهِ، وَقَدْ أَضَلَّهُ فِي أَرْضِ فَلاَةٍ',
      meaning:
        '"Allah is more pleased with the repentance of His servant than one of you who comes upon his camel after losing it in a desolate land."',
      source: hadith('Bukhari 6309; Muslim 2747'),
    },
    reflection:
      'What is the one thing you most need to change about yourself? Are you ready to make that change for good?',
    tasks: [
      {
        id: '27_tahajjud_tawbah',
        title: 'Pray tahajjud tonight and make sincere tawbah',
        titleBeginner:
          "Pray two rak'ahs before you sleep and ask Allah for forgiveness",
        titleAdvanced:
          'Pray tahajjud in the last third of the night and make sincere tawbah',
        category: 'prayer',
      },
      {
        id: '27_5_changes',
        title: 'Write down 5 lasting changes you commit to',
        category: 'reflection',
      },
      {
        id: '27_salat_tawbah',
        title: "Make wudu well and pray two rak'ahs of repentance",
        category: 'sunnah',
      },
      {
        id: '27_quran',
        title: 'Read At-Tahrim 66:8 and reflect',
        category: 'quran',
      },
      {
        id: '27_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '27_istighfar',
        title: "Say the day's istighfar in the morning and evening",
        category: 'dhikr',
      },
    ],
  },

  // ───────────────────────────── Day 28 ─────────────────────────────
  {
    day: 28,
    theme: 'Ummah',
    themeArabic: 'الأمة',
    intro:
      'The Prophet ﷺ likened the believers, in their mercy and affection for one another, to one body. Today you invest in your community.',
    morningDhikr: [
      {
        id: 'aslih_ummata_muhammad',
        arabic:
          'اللَّهُمَّ أَصْلِحْ أُمَّةَ مُحَمَّدٍ، وَفَرِّجْ عَنْ أُمَّةِ مُحَمَّدٍ، وَارْحَمْ أُمَّةَ مُحَمَّدٍ',
        transliteration:
          'Allāhumma aṣliḥ ummata Muḥammad, wa farrij ʿan ummati Muḥammad, warḥam ummata Muḥammad',
        meaning:
          "(Personal du'a) O Allah, set right the ummah of Muhammad, relieve the ummah of Muhammad, and have mercy on the ummah of Muhammad",
        count: 1,
        source: null,
      },
    ],
    eveningDhikr: [
      {
        id: 'unsur_al_islam',
        arabic: 'اللَّهُمَّ انْصُرِ الْإِسْلَامَ وَالْمُسْلِمِينَ',
        transliteration: 'Allāhummanṣuril-Islāma wal-Muslimīn',
        meaning:
          "(Personal du'a) O Allah, give victory to Islam and the Muslims",
        count: 1,
        source: null,
      },
      SUBHANALLAHI_WA_BIHAMDIHI,
    ],
    quran: {
      surah: 'Al-Imran',
      surahNumber: 3,
      ayahs: '110',
      note: '"You are the best nation produced for mankind. You enjoin what is right, forbid what is wrong and believe in Allah."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: "If it is Friday, attend Jumu'ah. If not, pray at least one fard prayer in congregation at the masjid today: prayer in congregation is twenty-seven degrees better than praying alone (Bukhari 645).",
    },
    sunnah: {
      title: 'Serving the community',
      description:
        'The Prophet ﷺ said: "Whoever fulfils the need of his brother, Allah will fulfil his need; and whoever relieves a Muslim of a hardship, Allah will relieve him of a hardship on the Day of Resurrection." Today, volunteer, help a neighbour, contribute to a community cause or visit a sick Muslim.',
      source: hadith('Bukhari 2442; Muslim 2580'),
    },
    character: {
      trait: 'Brotherhood and sisterhood',
      arabic: 'الأخوة',
      description:
        'True brotherhood in Islam means feeling the pain of your brothers and sisters, not just knowing them.',
      action:
        "Make du'a for 5 specific Muslims by name today, living and deceased, and feel the bond of the ummah in that du'a.",
    },
    hadith: {
      arabic:
        'الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا',
      meaning:
        '"The believer to the believer is like a building, each part strengthening the other."',
      source: hadith('Bukhari 481; Muslim 2585'),
    },
    reflection:
      'How can you serve your local Muslim community more actively in the next 30 days?',
    tasks: [
      {
        id: '28_masjid',
        title: 'Pray at least one prayer in congregation at the masjid',
        titleBeginner:
          'Pray one prayer in congregation, at home or at the masjid',
        titleAdvanced: 'Pray all 5 prayers in congregation at the masjid',
        category: 'prayer',
      },
      {
        id: '28_serve',
        title: 'Do one act of service for your community',
        category: 'character',
      },
      {
        id: '28_dua_ummah',
        title: "Make du'a for 5 specific Muslims by name",
        category: 'dhikr',
      },
      {
        id: '28_quran',
        title: 'Read Al-Imran 3:110 and reflect on your role',
        category: 'quran',
      },
      {
        id: '28_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '28_reflection',
        title: 'Plan how you will serve your community',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 29 ─────────────────────────────
  {
    day: 29,
    theme: "Da'wah",
    themeArabic: 'الدعوة',
    intro:
      'Every Muslim represents the deen, and da\'wah is not only for scholars: it is living Islam so beautifully that others are inspired. "And who is better in speech than one who invites to Allah?"',
    morningDhikr: [
      {
        id: 'hudatan_muhtadin',
        arabic:
          'اللَّهُمَّ زَيِّنَّا بِزِينَةِ الْإِيمَانِ، وَاجْعَلْنَا هُدَاةً مُهْتَدِينَ',
        transliteration:
          'Allāhumma zayyinnā bi-zīnatil-īmān, wajʿalnā hudātan muhtadīn',
        meaning:
          'O Allah, adorn us with the beauty of faith, and make us guides who are themselves rightly guided',
        count: 1,
        source: hadith("Nasa'i 1305"),
      },
    ],
    eveningDhikr: [
      {
        id: 'salawat_ibrahimiyyah',
        arabic:
          'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ، وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
        transliteration:
          'Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka Ḥamīdun Majīd. Allāhumma bārik ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā bārakta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka Ḥamīdun Majīd.',
        meaning:
          'O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious.',
        count: 1,
        source: hadith('Bukhari 3370'),
      },
    ],
    quran: {
      surah: 'Fussilat',
      surahNumber: 41,
      ayahs: '33',
      note: '"And who is better in speech than one who invites to Allah, does righteousness and says: Indeed, I am of the Muslims."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: "In your prayers today, make heartfelt du'a by name for people who are not Muslim or who have drifted from Islam. The Prophet ﷺ prayed for people's guidance: \"O Allah, guide Daws\" (Bukhari 2937), and he prayed for the guidance of Abu Hurayrah's mother (Muslim 2491).",
    },
    sunnah: {
      title: 'Be the best advertisement for Islam',
      description:
        'The Prophet ﷺ said: "That Allah guides one person through you is better for you than red camels." The greatest da\'wah is your character: when you are kind, honest, reliable, generous and humble, people see Islam in action. Embody these qualities in every interaction today.',
      source: hadith('Bukhari 3009; Muslim 2406'),
    },
    character: {
      trait: 'Inspiring others',
      arabic: 'الإلهام',
      description:
        "You don't need to give lectures to do da'wah. Share an Islamic reminder, or simply tell someone one beautiful thing about your deen.",
      action:
        'Share one beneficial Islamic reminder or piece of knowledge with someone today: a family member, friend or colleague.',
    },
    hadith: {
      arabic: 'بَلِّغُوا عَنِّي وَلَوْ آيَةً',
      meaning: '"Convey from me, even if it is one verse."',
      source: hadith('Bukhari 3461'),
    },
    reflection:
      'Who in your life most needs a connection to Islam or to Allah? How can you be a bridge for them?',
    tasks: [
      {
        id: '29_share_reminder',
        title: 'Share one Islamic reminder with someone',
        category: 'character',
      },
      {
        id: '29_dua_guidance',
        title: "Make du'a for the guidance of specific people",
        category: 'dhikr',
      },
      {
        id: '29_character_dawah',
        title: 'Show the best of Islamic character all day',
        category: 'sunnah',
      },
      { id: '29_quran', title: 'Memorise Fussilat 41:33', category: 'quran' },
      {
        id: '29_prayers',
        title: 'Pray all 5 prayers on time',
        titleBeginner: 'Pray as many of the 5 prayers on time as you can',
        titleAdvanced: "Pray all 5 prayers on time with their sunnah rak'ahs",
        category: 'prayer',
      },
      {
        id: '29_reflection',
        title: 'Reflect on your role as an ambassador of Islam',
        category: 'reflection',
      },
    ],
  },

  // ───────────────────────────── Day 30 ─────────────────────────────
  {
    day: 30,
    theme: 'Istiqamah',
    themeArabic: 'الاستقامة',
    intro:
      'You have reached Day 30, but the journey does not end here; it begins here. Istiqamah means staying on the straight path consistently, as the Prophet ﷺ taught: "Say: I believe in Allah, then be steadfast."',
    morningDhikr: [
      {
        id: 'ya_muqallibal_qulub',
        arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
        transliteration: 'Yā Muqallibal-qulūbi thabbit qalbī ʿalā dīnik',
        meaning:
          "(The du'a he said most often) O Turner of hearts, make my heart firm upon Your religion",
        count: 1,
        source: hadith('Tirmidhi 3522; Tirmidhi 2140'),
      },
    ],
    eveningDhikr: [
      {
        id: 'musarrifal_qulub',
        arabic:
          'اللَّهُمَّ مُصَرِّفَ الْقُلُوبِ صَرِّفْ قُلُوبَنَا عَلَى طَاعَتِكَ',
        transliteration:
          'Allāhumma muṣarrifal-qulūbi ṣarrif qulūbanā ʿalā ṭāʿatik',
        meaning:
          'O Allah, Director of hearts, direct our hearts to Your obedience',
        count: 1,
        // sunnah.com numbers this Muslim 2654; the hadith-api mirror's arabicnumber is off by one here and shows 2655.
        source: hadith('Muslim 2654'),
      },
      {
        id: 'ighfir_li_ma_qaddamtu',
        arabic:
          'اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي، أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخِّرُ، وَأَنْتَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration:
          'Allāhummagh-fir lī mā qaddamtu wa mā akhkhart, wa mā asrartu wa mā aʿlant, wa mā anta aʿlamu bihī minnī, antal-Muqaddimu wa antal-Muʾakhkhir, wa anta ʿalā kulli shayʾin qadīr',
        meaning:
          'O Allah, forgive me what I have done before and what I have left for later, what I did in secret and what I did openly, and what You know better than I. You are the One who brings forward and the One who puts back, and You are able to do all things',
        count: 1,
        source: hadith('Muslim 2719'),
      },
    ],
    quran: {
      surah: 'Fussilat',
      surahNumber: 41,
      ayahs: '30',
      note: 'The promise to those who remain steadfast: "Indeed, those who say, Our Lord is Allah, and then remain steadfast, the angels will descend upon them: Do not fear and do not grieve, but receive good tidings of Paradise, which you were promised."',
    },
    prayerFocus: {
      prayer: 'all',
      tip: "Make today a complete day of prayer: the five fard prayers, the twelve sunnah rak'ahs (Muslim 728), Duha in the morning and tahajjud tonight. Let it be the high point of your 30-day prayer journey.",
    },
    sunnah: {
      title: 'Plan the next 30 days',
      description:
        'The Prophet ﷺ said: "The most beloved of deeds to Allah are the most consistent, even if small." Plan a daily routine of prayer, Quran, dhikr and character work for the next 30 days that you can keep up.',
      source: hadith('Bukhari 6464'),
    },
    character: {
      trait: 'Lifelong commitment',
      arabic: 'الالتزام مدى الحياة',
      description:
        'Today is not an ending; it is a beginning. Your 30 days have built habits, and now they must become your way of life.',
      action:
        'Write your covenant with Allah: your personal commitment to the acts of worship and qualities of character you will keep for life.',
    },
    hadith: {
      arabic: 'قُلْ آمَنْتُ بِاللَّهِ فَاسْتَقِمْ',
      meaning:
        '"Say: I believe in Allah, then be steadfast." (His answer to Sufyan ibn \'Abdullah ath-Thaqafi, who asked for a teaching he would never need to ask anyone else about.)',
      source: hadith('Muslim 38'),
    },
    reflection:
      'Looking back over 30 days: what has changed in you? What is your covenant with Allah from here on?',
    tasks: [
      {
        id: '30_all_prayers',
        title: "Pray all 5 fard prayers and the 12 sunnah rak'ahs today",
        titleBeginner: 'Pray all 5 prayers on time',
        titleAdvanced:
          "Pray all 5 fard prayers, the 12 sunnah rak'ahs and Duha",
        category: 'prayer',
      },
      {
        id: '30_tahajjud',
        title: 'Pray tahajjud tonight',
        titleBeginner: "Pray two rak'ahs before you sleep",
        category: 'prayer',
      },
      {
        id: '30_covenant',
        title: 'Write your personal covenant with Allah',
        category: 'reflection',
      },
      {
        id: '30_quran',
        title: 'Read Fussilat 41:30 and reflect on its promise',
        category: 'quran',
      },
      {
        id: '30_dhikr',
        title: 'Complete your morning and evening adhkar',
        category: 'dhikr',
      },
      {
        id: '30_plan_ahead',
        title: 'Plan your spiritual routine for the next 30 days',
        category: 'sunnah',
      },
    ],
  },
];

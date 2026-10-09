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
        source: hadith('Ibn Majah 925'),
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
          'اللَّهُمَّ اهْدِنِي لِأَحْسَنِ الْأَخْلَاقِ لَا يَهْدِي لِأَحْسَنِهَا إِلَّا أَنْتَ، وَاصْرِفْ عَنِّي سَيِّئَهَا لَا يَصْرِفُ عَنِّي سَيِّئَهَا إِلَّا أَنْتَ',
        transliteration:
          'Allāhummah-dinī li-aḥsanil-akhlāqi lā yahdī li-aḥsanihā illā anta, waṣrif ʿannī sayyiʾahā lā yaṣrifu ʿannī sayyiʾahā illā ant',
        meaning:
          'O Allah, guide me to the best of character, for none guides to the best of it but You; and turn away from me its evil, for none turns away its evil but You',
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
];

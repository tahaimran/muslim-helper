import type { Source, SourcedText } from './types';

// Sources: docs/content-sources/verification-1.md ("Duas" section). Every hadith wording below
// was checked word-for-word against the fawazahmed0 hadith-api mirror of sunnah.com (Muslim by
// Abd al-Baqi number). Quran Arabic is fetched from fawazahmed0/quran-api (ara-quranuthmanihaf),
// never hand-typed.

export interface DuaEntry {
  id: string;
  title: string;
  titleArabic: string;
  occasion?: string;
  text: SourcedText;
}

export interface DuaCategory {
  id: string;
  title: string;
  titleArabic: string;
  duas: DuaEntry[];
}

const hadith = (ref: string, grade: 'sahih' | 'hasan' = 'sahih'): Source => ({
  kind: 'hadith',
  ref,
  grade,
});
const quran = (ref: string): Source => ({ kind: 'quran', ref, grade: null });

const BISMILLAH_LA_YADURR: SourcedText = {
  arabic:
    'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
  transliteration:
    'Bismillāhil-ladhī lā yaḍurru maʿasmihī shayʾun fil-arḍi wa lā fis-samāʾi wa huwas-Samīʿul-ʿAlīm',
  meaning:
    'In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
  source: hadith('Abu Dawud 5088'),
};

export const DUA_CATEGORIES: DuaCategory[] = [
  {
    id: 'morning',
    title: 'Morning',
    titleArabic: 'أذكار الصباح',
    duas: [
      {
        id: 'waking_up',
        title: 'Waking up',
        titleArabic: 'عند الاستيقاظ',
        occasion: 'When you wake up',
        text: {
          arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
          transliteration: 'Al-ḥamdu lillāhil-ladhī aḥyānā baʿda mā amātanā wa ilayhin-nushūr',
          meaning:
            'All praise is for Allah who gave us life after causing us to die, and to Him is the resurrection.',
          source: hadith('Bukhari 6312'),
        },
      },
      {
        id: 'morning_bika_asbahna',
        title: 'Entering the morning',
        titleArabic: 'اللهم بك أصبحنا',
        occasion: 'Once in the morning',
        text: {
          arabic:
            'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
          transliteration:
            'Allāhumma bika aṣbaḥnā, wa bika amsaynā, wa bika naḥyā, wa bika namūtu, wa ilaykan-nushūr',
          meaning:
            'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.',
          source: hadith('Abu Dawud 5068'),
        },
      },
      {
        id: 'morning_bismillah_protection',
        title: 'Protection',
        titleArabic: 'بسم الله الذي لا يضر',
        occasion: '3 times in the morning',
        text: BISMILLAH_LA_YADURR,
      },
    ],
  },
  {
    id: 'evening',
    title: 'Evening',
    titleArabic: 'أذكار المساء',
    duas: [
      {
        id: 'evening_bika_amsayna',
        title: 'Entering the evening',
        titleArabic: 'اللهم بك أمسينا',
        occasion: 'Once in the evening',
        text: {
          arabic:
            'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
          transliteration:
            'Allāhumma bika amsaynā, wa bika aṣbaḥnā, wa bika naḥyā, wa bika namūtu, wa ilaykal-maṣīr',
          meaning:
            'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.',
          source: hadith('Ibn Majah 3868'),
        },
      },
      {
        id: 'evening_bismillah_protection',
        title: 'Protection',
        titleArabic: 'بسم الله الذي لا يضر',
        occasion: '3 times in the evening',
        text: BISMILLAH_LA_YADURR,
      },
    ],
  },
  {
    id: 'prayer',
    title: 'Prayer',
    titleArabic: 'أدعية الصلاة',
    duas: [
      {
        id: 'after_adhan',
        title: 'After the adhan',
        titleArabic: 'بعد الأذان',
        occasion: 'When the call to prayer ends',
        text: {
          arabic:
            'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
          transliteration:
            'Allāhumma Rabba hādhihid-daʿwatit-tāmmah, waṣ-ṣalātil-qāʾimah, āti Muḥammadanil-wasīlata wal-faḍīlah, wabʿath-hu maqāman maḥmūdanil-ladhī waʿadtah',
          meaning:
            'O Allah, Lord of this perfect call and the prayer about to be established, grant Muhammad al-Wasilah and excellence, and raise him to the praised station You promised him.',
          source: hadith('Bukhari 614'),
        },
      },
      {
        id: 'opening_dua_salah',
        title: 'Opening du‘a of prayer',
        titleArabic: 'دعاء الاستفتاح',
        occasion: 'Inside the prayer, after the opening takbir',
        text: {
          arabic:
            'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ',
          transliteration:
            'Allāhumma bāʿid baynī wa bayna khaṭāyāya kamā bāʿadta baynal-mashriqi wal-maghrib. Allāhumma naqqinī minal-khaṭāyā kamā yunaqqath-thawbul-abyaḍu minad-danas. Allāhummaghsil khaṭāyāya bil-māʾi wath-thalji wal-barad',
          meaning:
            'O Allah, put distance between me and my sins as You have put distance between the East and the West. O Allah, cleanse me of sins as a white garment is cleansed of dirt. O Allah, wash away my sins with water, snow and hail.',
          source: hadith('Bukhari 744'),
        },
      },
      {
        id: 'after_salah',
        title: 'Right after the salam',
        titleArabic: 'بعد السلام من الصلاة',
        occasion: 'After every prayer',
        text: {
          arabic:
            'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ. اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ ذَا الْجَلَالِ وَالْإِكْرَامِ',
          transliteration:
            'Astaghfirullāh, astaghfirullāh, astaghfirullāh. Allāhumma antas-Salāmu wa minkas-salām, tabārakta dhal-jalāli wal-ikrām',
          meaning:
            'I seek Allah’s forgiveness (three times). O Allah, You are Peace and from You comes peace; blessed are You, Possessor of majesty and honour.',
          source: hadith('Muslim 591'),
        },
      },
    ],
  },
  {
    id: 'daily',
    title: 'Daily life',
    titleArabic: 'أدعية الحياة اليومية',
    duas: [
      {
        id: 'before_eating',
        title: 'Before eating',
        titleArabic: 'قبل الأكل',
        occasion: 'Mention Allah’s name before you eat',
        text: {
          arabic: 'بِسْمِ اللَّهِ',
          transliteration: 'Bismillāh',
          meaning:
            'In the name of Allah. The Prophet ﷺ told a boy: “Mention the name of Allah, eat with your right hand, and eat from what is in front of you.”',
          source: hadith('Bukhari 5376; Muslim 2022'),
        },
      },
      {
        id: 'forgot_bismillah_eating',
        title: 'If you forgot to say Bismillah',
        titleArabic: 'إذا نسي التسمية',
        occasion: 'When you remember during the meal',
        text: {
          arabic: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ',
          transliteration: 'Bismillāhi awwalahū wa ākhirah',
          meaning: 'In the name of Allah, at its beginning and at its end.',
          source: hadith('Abu Dawud 3767'),
        },
      },
      {
        id: 'after_eating',
        title: 'After eating',
        titleArabic: 'بعد الأكل',
        occasion: 'When you finish a meal',
        text: {
          arabic:
            'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
          transliteration:
            'Al-ḥamdu lillāhil-ladhī aṭʿamanī hādhā wa razaqanīhi min ghayri ḥawlin minnī wa lā quwwah',
          meaning:
            'All praise is for Allah who fed me this and provided it for me without any might or power on my part.',
          source: hadith('Tirmidhi 3458', 'hasan'),
        },
      },
      {
        id: 'before_sleeping',
        title: 'Before sleeping',
        titleArabic: 'قبل النوم',
        occasion: 'When you lie down to sleep',
        text: {
          arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
          transliteration: 'Bismika Allāhumma amūtu wa aḥyā',
          meaning: 'In Your name, O Allah, I die and I live.',
          source: hadith('Bukhari 6324'),
        },
      },
      {
        id: 'entering_mosque',
        title: 'Entering the mosque',
        titleArabic: 'دخول المسجد',
        occasion: 'As you walk into the masjid',
        text: {
          arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
          transliteration: 'Allāhummaftaḥ lī abwāba raḥmatik',
          meaning: 'O Allah, open for me the doors of Your mercy.',
          source: hadith('Muslim 713'),
        },
      },
      {
        id: 'leaving_mosque',
        title: 'Leaving the mosque',
        titleArabic: 'الخروج من المسجد',
        occasion: 'As you walk out of the masjid',
        text: {
          arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
          transliteration: 'Allāhumma innī asʾaluka min faḍlik',
          meaning: 'O Allah, I ask You of Your bounty.',
          source: hadith('Muslim 713'),
        },
      },
      {
        id: 'leaving_home',
        title: 'Leaving home',
        titleArabic: 'الخروج من المنزل',
        occasion: 'As you step out of the house',
        text: {
          arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
          transliteration: 'Bismillāh, tawakkaltu ʿalallāh, lā ḥawla wa lā quwwata illā billāh',
          meaning:
            'In the name of Allah; I place my trust in Allah; there is no might nor power except by Allah.',
          source: hadith('Abu Dawud 5095; Tirmidhi 3426'),
        },
      },
    ],
  },
  {
    id: 'quran',
    title: 'Quran',
    titleArabic: 'أدعية متعلقة بالقرآن',
    duas: [
      {
        id: 'before_reciting_quran',
        title: 'Before reciting the Quran',
        titleArabic: 'الاستعاذة قبل القراءة',
        occasion: 'Before you begin reciting',
        text: {
          arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
          transliteration: 'Aʿūdhu billāhi minash-shayṭānir-rajīm',
          meaning:
            'I seek refuge in Allah from Shaytan, the accursed. Allah says: “When you recite the Quran, seek refuge in Allah from Shaytan, the accursed.”',
          source: quran('Quran 16:98'),
        },
      },
      {
        id: 'dua_for_knowledge',
        title: 'Asking for knowledge',
        titleArabic: 'دعاء طلب العلم',
        text: {
          arabic: 'وَقُل رَّبِّ زِدۡنِي عِلۡمࣰا',
          transliteration: 'Wa qur-Rabbi zidnī ʿilmā',
          meaning: 'And say: “My Lord, increase me in knowledge.” (Allah tells the Prophet ﷺ to say this; the du‘a itself is “Rabbi zidnī ʿilmā”.)',
          source: quran('Quran 20:114'),
        },
      },
    ],
  },
  {
    id: 'forgiveness',
    title: 'Forgiveness',
    titleArabic: 'الاستغفار والتوبة',
    duas: [
      {
        id: 'sayyid_istighfar',
        title: 'The best way to ask forgiveness',
        titleArabic: 'سيد الاستغفار',
        occasion: 'Morning and evening',
        text: {
          arabic:
            'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
          transliteration:
            'Allāhumma anta Rabbī lā ilāha illā ant, khalaqtanī wa ana ʿabduk, wa ana ʿalā ʿahdika wa waʿdika mastaṭaʿt, aʿūdhu bika min sharri mā ṣanaʿt, abūʾu laka bi-niʿmatika ʿalayya, wa abūʾu laka bi-dhanbī, faghfir lī fa-innahū lā yaghfirudh-dhunūba illā ant',
          meaning:
            'O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I keep Your covenant and my promise to You as much as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.',
          source: hadith('Bukhari 6306'),
        },
      },
      {
        id: 'tawbah',
        title: 'Repentance',
        titleArabic: 'التوبة',
        occasion: 'Any time; the Prophet ﷺ said it more than seventy times a day',
        text: {
          arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
          transliteration: 'Astaghfirullāha wa atūbu ilayh',
          meaning: 'I seek Allah’s forgiveness and I turn to Him in repentance.',
          source: hadith('Bukhari 6307'),
        },
      },
    ],
  },
];

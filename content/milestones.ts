import type { MilestoneId } from '../lib/milestones';
import type { SourcedText } from './types';

// Quran Arabic below was fetched from fawazahmed0/quran-api (ara-quranuthmanihaf); hadith Arabic per docs/content-sources/verification-1.md.
export const MILESTONE_CONTENT: Record<MilestoneId, { title: string; text: SourcedText }> = {
  first_step: {
    title: "Your first step",
    text: {
      arabic: "وَإِنْ تَقَرَّبَ إِلَىَّ بِشِبْرٍ تَقَرَّبْتُ إِلَيْهِ ذِرَاعًا ... وَإِنْ أَتَانِي يَمْشِي أَتَيْتُهُ هَرْوَلَةً",
      meaning: "Allah says: \"If he draws near to Me a hand-span, I draw near to him an arm's length… and if he comes to Me walking, I come to him running.\"",
      source: {"kind":"hadith","ref":"Bukhari 7405; Muslim 2675","grade":"sahih"},
    },
  },
  first_full_salah_day: {
    title: "All five prayers in one day",
    text: {
      arabic: "فَذَلِكَ مِثْلُ الصَّلَوَاتِ الْخَمْسِ، يَمْحُو اللَّهُ بِهَا الْخَطَايَا",
      meaning: "\"That is the likeness of the five prayers: through them Allah wipes away sins.\" (Like bathing in a river at your door five times a day.)",
      source: {"kind":"hadith","ref":"Bukhari 528; Muslim 667","grade":"sahih"},
    },
  },
  three_days: {
    title: "Three days of showing up",
    text: {
      arabic: "وَٱلَّذِينَ جَٰهَدُواْ فِينَا لَنَهۡدِيَنَّهُمۡ سُبُلَنَاۚ وَإِنَّ ٱللَّهَ لَمَعَ ٱلۡمُحۡسِنِينَ",
      meaning: "\"And those who strive for Us, We will surely guide them to Our ways. And indeed, Allah is with the doers of good.\"",
      source: {"kind":"quran","ref":"Quran 29:69","grade":null},
    },
  },
  week_one: {
    title: "One week on the path",
    text: {
      arabic: "إِنَّ الدِّينَ يُسْرٌ ... فَسَدِّدُوا وَقَارِبُوا وَأَبْشِرُوا",
      meaning: "\"The religion is ease… so do what is right, come as close as you can, and rejoice.\"",
      source: {"kind":"hadith","ref":"Bukhari 39","grade":"sahih"},
    },
  },
  streak_7: {
    title: "Seven days in a row",
    text: {
      arabic: "وَٱعۡبُدۡ رَبَّكَ حَتَّىٰ يَأۡتِيَكَ ٱلۡيَقِينُ",
      meaning: "\"And worship your Lord until there comes to you the certainty (death).\"",
      source: {"kind":"quran","ref":"Quran 15:99","grade":null},
    },
  },
  fajr_7: {
    title: "Seven Fajr prayers",
    text: {
      arabic: "مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ",
      meaning: "\"Whoever prays the two cool prayers (Fajr and 'Asr) will enter Paradise.\"",
      source: {"kind":"hadith","ref":"Bukhari 574; Muslim 635","grade":"sahih"},
    },
  },
  first_reflection: {
    title: "Your first reflection",
    text: {
      arabic: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُواْ ٱتَّقُواْ ٱللَّهَ وَلۡتَنظُرۡ نَفۡسࣱ مَّا قَدَّمَتۡ لِغَدࣲۖ وَٱتَّقُواْ ٱللَّهَۚ إِنَّ ٱللَّهَ خَبِيرُۢ بِمَا تَعۡمَلُونَ",
      meaning: "\"O you who believe, fear Allah, and let every soul look to what it has sent forth for tomorrow. And fear Allah; indeed, Allah is Aware of what you do.\"",
      source: {"kind":"quran","ref":"Quran 59:18","grade":null},
    },
  },
  tasbih_1000: {
    title: "A thousand glorifications",
    text: {
      arabic: "أَيَعْجِزُ أَحَدُكُمْ أَنْ يَكْسِبَ كُلَّ يَوْمٍ أَلْفَ حَسَنَةٍ ... يُسَبِّحُ مِائَةَ تَسْبِيحَةٍ فَيُكْتَبُ لَهُ أَلْفُ حَسَنَةٍ أَوْ يُحَطُّ عَنْهُ أَلْفُ خَطِيئَةٍ",
      meaning: "\"Is any of you unable to earn a thousand good deeds each day? He glorifies Allah a hundred times, and a thousand good deeds are written for him or a thousand sins are removed.\"",
      source: {"kind":"hadith","ref":"Muslim 2698","grade":"sahih"},
    },
  },
  halfway: {
    title: "Halfway through your journey",
    text: {
      arabic: "فَإِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرًا ﴿٥﴾ إِنَّ مَعَ ٱلۡعُسۡرِ يُسۡرࣰا",
      meaning: "\"For indeed, with hardship comes ease. Indeed, with hardship comes ease.\"",
      source: {"kind":"quran","ref":"Quran 94:5-6","grade":null},
    },
  },
  journey_complete: {
    title: "Thirty days complete",
    text: {
      arabic: "لَئِن شَكَرۡتُمۡ لَأَزِيدَنَّكُمۡ",
      meaning: "\"If you are grateful, I will surely increase you.\"",
      source: {"kind":"quran","ref":"Quran 14:7","grade":null},
    },
  },
};

export const WELCOME_BACK: SourcedText = {
  arabic: "وَأَنَّ أَحَبَّ الأَعْمَالِ أَدْوَمُهَا إِلَى اللَّهِ وَإِنْ قَلَّ",
  meaning: "\"The most beloved of deeds to Allah are the most consistent, even if small.\"",
  source: {"kind":"hadith","ref":"Bukhari 6464; Muslim 782","grade":"sahih"},
};

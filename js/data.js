const APP = {
  "title": "המכונה האחת",
  "storageKey": "nand2tetris-lomda-v12"
};

const PARTS = [
  {
    "id": "part-1",
    "title": "חלק 1: מבוא"
  },
  {
    "id": "part-2",
    "title": "חלק 2: מכונות חישוב"
  },
  {
    "id": "part-3",
    "title": "חלק 3: זיכרון"
  },
  {
    "id": "part-4",
    "title": "חלק 4: מכונת חישוב אחת שתחליף את כולן"
  }
];

const CHAPTERS = [
  {
    "id": "chapter-1",
    "story": true,
    "partId": "part-1",
    "title": "1.1 המכתב",
    "sceneId": "einstein-letter"
  },
  {
    "id": "chapter-2",
    "story": true,
    "partId": "part-1",
    "title": "1.2 הפרויקט",
    "sceneId": "berkeley-1942"
  },
  {
    "id": "chapter-3",
    "story": true,
    "partId": "part-1",
    "title": "1.3 המחשב האלקטרוני",
    "sceneId": "oppenheimer-von-neumann-1943"
  },
  {
    "id": "chapter-4",
    "partId": "part-2",
    "title": "2.1 Nand",
    "sceneId": "nand-workshop-1943"
  },
  {
    "id": "chapter-5",
    "partId": "part-2",
    "title": "2.2 שערים פשוטים",
    "sceneId": "simple-gates"
  },
  {
    "id": "chapter-6",
    "partId": "part-2",
    "title": "2.3 ניתוב",
    "sceneId": "complex-gates"
  },
  {
    "id": "chapter-7",
    "partId": "part-2",
    "title": "2.4 בסים",
    "sceneId": "buses"
  },
  {
    "id": "chapter-8",
    "partId": "part-2",
    "title": "2.5 אריתמטיקה",
    "sceneId": "arithmetic"
  },
  {
    "id": "chapter-9",
    "partId": "part-2",
    "title": "2.6 ALU",
    "sceneId": "alu"
  },
  {
    "id": "chapter-10",
    "partId": "part-3",
    "title": "3.1 פליפ פלופ",
    "sceneId": "flipflop"
  },
  {
    "id": "chapter-11",
    "partId": "part-3",
    "title": "3.2 רגיסטרים",
    "sceneId": "registers"
  },
  {
    "id": "chapter-12",
    "partId": "part-3",
    "title": "3.3 RAM",
    "sceneId": "ram"
  },
  {
    "id": "chapter-13",
    "partId": "part-3",
    "title": "3.4 פורטים",
    "sceneId": "ports"
  },
  {
    "id": "chapter-14",
    "partId": "part-3",
    "title": "3.5 יצור",
    "sceneId": "production",
    "story": true
  },
  {
    "id": "chapter-15",
    "partId": "part-4",
    "title": "4.1 מבנה המחשב",
    "sceneId": "simple-computer"
  },
  {
    "id": "chapter-16",
    "partId": "part-4",
    "title": "4.2 בניית מחשב פשוט",
    "sceneId": "build-simple-computer"
  }
];

const SCENES = {
  "einstein-letter": {
    "id": "einstein-letter",
    "type": "story",
    "chapterId": "chapter-1",
    "year": "1939",
    "panels": [
      {
        "image": "assets/panels/panel01.svg",
        "read": "איינשטיין: ליאו, טוב לראות אותך."
      },
      {
        "image": "assets/panels/panel02.svg",
        "read": "סילארד: אלברט, אנחנו צריכים לדבר..."
      },
      {
        "image": "assets/panels/panel03.svg",
        "read": "איינשטיין: אנחנו מדברים..."
      },
      {
        "image": "assets/panels/panel04.svg",
        "read": "סילארד: אתה זוכר שאמרת לי לא לכתוב, לא לדבר ואפילו לא לחשוב, על העניין ההוא?"
      },
      {
        "image": "assets/panels/panel05.svg",
        "read": "איינשטיין: זוכר..."
      },
      {
        "image": "assets/panels/panel06.svg",
        "read": "סילארד: אז אנחנו צריכים לדבר על זה."
      },
      {
        "image": "assets/panels/panel07.svg",
        "read": "איינשטיין: השתגעת, עכשיו, עם כל המתיחות באירופה, להעלות את הנושא של חשמל מביקוע גרעיני, זה סכנת נפשות. הרי דיברנו על זה, אפשר לעשות עם זה ממש לא רק חשמל. רק כשתהיה ממשלה עולמית חזקה, מונהגת על ידי מדענים יהיה אפשר לדבר על זה."
      },
      {
        "image": "assets/panels/panel08.svg",
        "read": "סילארד: אז זהו, שלא באתי לדבר על ייצור חשמל."
      },
      {
        "image": "assets/panels/panel09.svg",
        "read": "איינשטיין: אז על מה!?"
      },
      {
        "image": "assets/panels/panel10.svg",
        "read": "סילארד: אתה יודע על מה! אנשים קוראים את המאמר שכתבתי לפני 5 שנים. האן ושטרסמן עשו ניסויים עם אורניום, שהוכיחו שהוא מתבקע. הייזנברג חושב על זה. נילס בור כתב לי שהייזנברג נפגש איתו ושאל שאלות. נילס כמובן נפנף אותו, אבל אתה יודע שהייזנברג לא טיפש."
      },
      {
        "image": "assets/panels/panel11.svg",
        "read": "איינשטיין: כן. נאצי - כן, טיפש - ממש לא."
      },
      {
        "image": "assets/panels/panel12.svg",
        "read": "סילארד: הם עובדים על זה. אנחנו צריכים לעשות את זה לפניהם."
      },
      {
        "image": "assets/panels/panel13.svg",
        "read": "איינשטיין: אנחנו!? אתה מתכוון לממשלה? הדבר שאתה מדבר עליו יכול ליצור פצצה יותר חזקה מכל הפצצות בעולם ביחד. אי אפשר לסמוך על אף ממשלה להחזיק כוח כזה. אני אסיר תודה למדינה הזאת על הרבה דברים, אבל אני לא סומך עליה, או על אף מדינה אחרת. עם אנרגיה גרעינית, אני אסמוך רק על ממשלה עולמית, וגם אז היא לעולם לא תפתח פצצות גרעיניות."
      },
      {
        "image": "assets/panels/panel14.svg",
        "read": "סילארד: אתה יודע שאני שותף לחזון שלך של ממשלה עולמית, אבל אני מדבר איתך על המציאות, לא על החזון. אתה לימדת אותנו שהכול יחסי. השאלה היא לא האם אתה סומך על ארצות הברית, אלא על מי אתה סומך יותר: על רוזוולט וממשלת ארצות הברית או על היטלר והממשלה של גרמניה הנאצית. אני לא חושב שזאת שאלה קשה..."
      },
      {
        "image": "assets/panels/panel15.svg",
        "read": "איינשטיין: אתה צודק... אז מה אתה מציע?"
      },
      {
        "image": "assets/panels/panel16.svg",
        "read": "סילארד: אנחנו צריכים לכתוב מכתב לנשיא. להסביר לו את העניין. הוא צריך להקצות משאבים לפיתוח פצצה המבוססת על ביקוע גרעיני. הוא חייב לעשות את זה לפני היטלר. חשוב שאתה תחתום על המכתב, את השם אלברט איינשטיין כולם מכירים. את השם ליאו סילארד לא ממש."
      },
      {
        "image": "assets/panels/panel17.svg",
        "read": "איינשטיין: תכתוב. אני אחתום."
      }
    ]
  },
  "berkeley-1942": {
    "id": "berkeley-1942",
    "type": "story",
    "chapterId": "chapter-2",
    "year": "1942",
    "panels": [
      {
        "image": "assets/panels/panel17a.svg",
        "read": "לאחר 3 שנים",
        "year": ""
      },
      {
        "image": "assets/panels/panel18.svg",
        "read": "גלינג גלינג."
      },
      {
        "image": "assets/panels/panel19.svg",
        "read": "מזכירה: המחלקה לפיזיקה, אוניברסיטת ברקלי."
      },
      {
        "image": "assets/panels/panel20.svg",
        "read": "מהצד השני: שלום, מדברים מלשכת הנשיא."
      },
      {
        "image": "assets/panels/panel21.svg",
        "read": "מזכירה: במה אני יכולה לעזור לפרופסור ספרול?"
      },
      {
        "image": "assets/panels/panel22.svg",
        "read": "מהצד השני: למי?"
      },
      {
        "image": "assets/panels/panel23.svg",
        "read": "מזכירה: לפרופסור ספרול, נשיא האוניברסיטה."
      },
      {
        "image": "assets/panels/panel24.svg",
        "read": "מהצד השני: מדברים מלשכת נשיא ארצות הברית."
      },
      {
        "image": "assets/panels/panel25.svg",
        "read": "מזכירה: אהה- אה – סליחה. במה אני יכולה לעזור?"
      },
      {
        "image": "assets/panels/panel26.svg",
        "read": "מהצד השני: הנשיא רוצה לדבר עם פרופסור אופנהיימר."
      },
      {
        "image": "assets/panels/panel27.svg",
        "read": "מזכירה: כבר."
      },
      {
        "image": "assets/panels/panel28.svg",
        "read": "מזכירה: פרופסור אופנהיימר, נשיא ארצות הברית רוצה לדבר איתך."
      },
      {
        "image": "assets/panels/panel29.svg",
        "read": "אופנהיימר: מה?!"
      },
      {
        "image": "assets/panels/panel30.svg",
        "read": "מזכירה: אתה יכול לדבר איתו?"
      },
      {
        "image": "assets/panels/panel31.svg",
        "read": "אופנהיימר: כן..."
      },
      {
        "image": "assets/panels/panel32.svg",
        "read": "אופנהיימר: הלו?"
      },
      {
        "image": "assets/panels/panel33.svg",
        "read": "מהצד השני: מדברים מהבית הלבן. האם אתה יכול לדבר עם הנשיא?"
      },
      {
        "image": "assets/panels/panel34.svg",
        "read": "אופנהיימר: כן."
      },
      {
        "image": "assets/panels/panel35.svg",
        "read": "רוזוולט: שלום פרופסור אופנהיימר, מדבר הנשיא רוזוולט."
      },
      {
        "image": "assets/panels/panel36.svg",
        "read": "אופנהיימר: כן, אדוני הנשיא."
      },
      {
        "image": "assets/panels/panel37.svg",
        "read": "רוזוולט: המולדת צריכה שתנהל עבורה פרויקט לאומי בעל חשיבות עליונה."
      },
      {
        "image": "assets/panels/panel38.svg",
        "read": "אופנהיימר: במה מדובר, אדוני הנשיא?"
      },
      {
        "image": "assets/panels/panel39.svg",
        "read": "רוזוולט: אני לא יכול להגיד את זה בטלפון, אתה תקבל את כל הפרטים עם שליח, אבל אתה צריך להתחייב לשמור על סודיות מוחלטת."
      },
      {
        "image": "assets/panels/panel40.svg",
        "read": "אופנהיימר: אמ.."
      },
      {
        "image": "assets/panels/panel41.svg",
        "read": "רוזוולט: אתה תוכל כמובן לסרב, אבל לא תוכל לדבר על זה עם איש."
      },
      {
        "image": "assets/panels/panel42.svg",
        "read": "אופנהיימר: בסדר."
      },
      {
        "image": "assets/panels/panel43.svg",
        "read": ""
      },
      {
        "image": "assets/panels/panel44.svg",
        "read": ""
      },
      {
        "image": "assets/panels/panel45.svg",
        "read": ""
      },
      {
        "image": "assets/panels/panel46.svg",
        "read": ""
      },
      {
        "image": "assets/panels/panel47.svg",
        "read": "אופנהיימר: מה לעזאזל?!"
      },
      {
        "image": "assets/panels/panel48.svg",
        "read": "מזכירה: פרופסור אופנהיימר, הכול בסדר?"
      },
      {
        "image": "assets/panels/panel49.svg",
        "read": "אופנהיימר: אה... כן.. הם פשוט רוצים שאני אנתח תוצאות של ניסוי מוזר במזג האוויר."
      },
      {
        "image": "assets/panels/panel50.svg",
        "youngImage": "assets/panels/panel50_young.svg",
        "read": "אופנהיימר: לעזאזל עם רוזוולט, לעזאזל עם איינשטיין, לעזאזל עם סילארד, ולעזאזל איתי. כולנו בני כלבות.",
        "youngRead": "אופנהיימר: לעזאזל עם רוזוולט, לעזאזל עם איינשטיין, לעזאזל עם סילארד, ולעזאזל איתי."
      }
    ]
  },
  "oppenheimer-von-neumann-1943": {
    "id": "oppenheimer-von-neumann-1943",
    "type": "story",
    "chapterId": "chapter-3",
    "year": "1943",
    "panels": [
      {
        "image": "assets/panels/panel51.svg",
        "read": "לאחר מספר חודשים."
      },
      {
        "image": "assets/panels/panel52.svg",
        "read": "אופנהיימר: שלום ג'ון, מדבר רוברט, רוברט אופנהיימר."
      },
      {
        "image": "assets/panels/panel53.svg",
        "read": "פון נוימן: שלום רוברט, שנים שלא דיברנו. מה שלומך?"
      },
      {
        "image": "assets/panels/panel54.svg",
        "read": "אופנהיימר: יכול היה להיות יותר טוב. אני קורס בעבודה."
      },
      {
        "image": "assets/panels/panel55.svg",
        "read": "פון נוימן: על מה אתה עובד?"
      },
      {
        "image": "assets/panels/panel56.svg",
        "read": "אופנהיימר: אז זהו, על זה רציתי לדבר איתך. אני צריך את עזרתך בפרויקט לאומי בעל חשיבות עליונה. אני לא יכול להגיד לך בשלב זה במה מדובר, אבל..."
      },
      {
        "image": "assets/panels/panel57.svg",
        "read": "פון נוימן: תפסיק עם הפורמליות. אני יודע בדיוק על מה מדובר. מי אתה חושב שכנע את סילארד לדבר עם איינשטיין? אתה יודע כמה הייתי צריך לחפור לו? אתם והגישה הפציפיסטית שלכם הביאו אותנו לברוך הזה. אני שמח שסוף סוף התעשתם. בטח שאשמח לעזור. זה או אנחנו או היטלר או סטלין. אני מעדיף שזה יהיה אנחנו. זה לא ממש התחום שלי, אבל אני יכול לנסות."
      },
      {
        "image": "assets/panels/panel58.svg",
        "read": "אופנהיימר: מתי אתה יכול להגיע ללוס אלמוס, ניו-מקסיקו?"
      },
      {
        "image": "assets/panels/panel59.svg",
        "read": "פון נוימן: ניו-מקסיקו!? מכל המקומות בעולם בחרת דווקא את ניו-מקסיקו? טוב, שיהיה. לכמה זמן?"
      },
      {
        "image": "assets/panels/panel60.svg",
        "read": "אופנהיימר: עד סוף המלחמה, או עד סוף הפרויקט, המוקדם מביניהם."
      },
      {
        "image": "assets/panels/panel61.svg",
        "read": "פון נוימן: אממ... תן לי שבועיים, אני צריך לסגור את זה עם המכון. קלרה והילדה יבואו תוך חודש, אני צריך שתסדר לנו דירה."
      },
      {
        "image": "assets/panels/panel62.svg",
        "read": "אופנהיימר: מה שתגיד."
      },
      {
        "image": "assets/panels/panel63.svg",
        "read": "לאחר מספר חודשים."
      },
      {
        "image": "assets/panels/panel64.svg",
        "read": "פון נוימן: מה עם החישוב שביקשתי?"
      },
      {
        "image": "assets/panels/panel65.svg",
        "read": "פון נוימן: כמה זמן אתם צריכים?"
      },
      {
        "image": "assets/panels/panel66.svg",
        "read": "פון נוימן: שלושה ימים זה הרבה מדי. זה תוקע אותי. תשתדלו לגמור עד מחר."
      },
      {
        "image": "assets/panels/panel67.svg",
        "read": "פון נוימן: אי אפשר לעבוד כך. החישובים לוקחים יותר מדי זמן. עד שנגמור את הפצצה הנאצים יהרסו את כל אירופה. יש לי עדיין קרובים בהונגריה, כרגע הם יחסית בטוחים, אבל זה יכול להשתנות בכל רגע, אומרים שהנאצים רוצחים את כל היהודים שהם יכולים."
      },
      {
        "image": "assets/panels/panel68.svg",
        "read": "פון נוימן: כל חישוב לוקח ימים כי הם צריכים לבנות את המכונה מחדש, לכל חישוב בנפרד. זה לא צריך להיות כך. לא באמצע המאה ה-20. בבג' הבין את זה עוד במאה הקודמת. אפשר לבנות מכונה אחת שתוכל לבצע כל חישוב. גם טיורינג כתב על זה לפני כמה שנים. בבג' היו רק גלגלי שיניים אז הוא לא הצליח לבנות את המכונה הזאת. אבל לנו יש טריודות מבוססות שפופרות ריק. אנחנו יכולים לעשות את זה. אנחנו חייבים לעשות את זה."
      },
      {
        "image": "assets/panels/panel69.svg",
        "read": "פון נוימן: רוברט לא יאשר לקחת לזה אנשים. הוא לא אוהב לקחת סיכונים. אני צריך לבוא אליו עם משהו שעובד לפני שאני מבקש משהו. אבל אני לא יכול להתעסק בזה בעצמי. רוברט הפיל עליי יותר מדי פרויקטים. אני צריך למצוא מישהו חכם אחד שיוכל לעשות את זה, בלי שרוברט ידע. רק איפה אני אמצא מישהו כזה?"
      },
      {
        "image": "assets/panels/panel70.svg",
        "femaleImage": "assets/panels/panel70_girl.svg",
        "read": "פון נוימן: אתה! אתה נראה לי ברנש לעניין. יש לי משימה סודית עבורך. אתה מכיר את המקצוע מחשב, אתה יודע, בן אדם שהתפקיד שלו זה לחשב.",
        "femaleRead": "פון נוימן: את! את נראית לי בחורה לעניין. יש לי משימה סודית עבורך. את מכירה את המקצוע מחשב, את יודעת, בן אדם שהתפקיד שלו זה לחשב."
      },
      {
        "image": "assets/panels/panel71.svg",
        "femaleImage": "assets/panels/panel71_girl.svg",
        "read": "פון נוימן: אתה תצטרך לבנות מכונה שעושה את זה במקום הבן-אדם. זאת תהיה מכונת חישוב שתוכל לעשות כל חישוב. נקרא לה מחשב אלקטרוני. אולי פעם היא תחליף את המחשבים, ואז יקראו לה מחשב.",
        "femaleRead": "פון נוימן: את תצטרכי לבנות מכונה שעושה את זה במקום הבן-אדם. זאת תהיה מכונת חישוב שתוכל לעשות כל חישוב. נקרא לה מחשב אלקטרוני. אולי פעם היא תחליף את המחשבים, ואז יקראו לה מחשב."
      },
      {
        "image": "assets/panels/panel72.svg",
        "femaleImage": "assets/panels/panel72_girl.svg",
        "read": "פון נוימן: אל תדאג, זה בטח יהיה עוד המון שנים, אז לא יפטרו אותם כל כך מהר.",
        "femaleRead": "פון נוימן: אל תדאגי, זה בטח יהיה עוד המון שנים, אז לא יפטרו אותם כל כך מהר."
      },
      {
        "image": "assets/panels/panel73.svg",
        "femaleImage": "assets/panels/panel73_girl.svg",
        "read": "פון נוימן: אני לא יכול לספר לך כרגע למה צריך את המכונה, אבל תאמין לי, זה חשוב לכל האנושות. אני אתן לך את מה שאתה צריך, אבל אתה תצטרך לעשות הכול לבד. אסור לך לדבר על זה עם אף אחד. אפילו לא עם רוברט.",
        "femaleRead": "פון נוימן: אני לא יכול לספר לך כרגע למה צריך את המכונה, אבל תאמיני לי, זה חשוב לכל האנושות. אני אתן לך את מה שאת צריכה, אבל את תצטרכי לעשות הכול לבד. אסור לך לדבר על זה עם אף אחד. אפילו לא עם רוברט."
      }
    ]
  },
  "nand-workshop-1943": {
    "id": "nand-workshop-1943",
    "type": "story",
    "chapterId": "chapter-4",
    "year": "1943",
    "panels": [
      {
        "image": "assets/panels/panel73a_ch4_intro.svg",
        "femaleImage": "assets/panels/panel73a_ch4_intro_girl.svg",
        "read": "פון נוימן: מצוין. זה המחסן שלנו. תתחיל להכיר את הציוד. אני צריך לרוץ לפגישה עם רוברט.",
        "femaleRead": "פון נוימן: מצוין. זה המחסן שלנו. תתחילי להכיר את הציוד. אני צריך לרוץ לפגישה עם רוברט."
      },
      {
        "image": "assets/panels/panel74.svg",
        "read": ""
      },
      {
        "image": "assets/panels/panel74a.svg",
        "read": "",
        "hotspot": {
          "action": "next",
          "ariaLabel": "לחץ על נאנד",
          "left": 39,
          "top": 62,
          "width": 20,
          "height": 26
        }
      },
      {
        "image": "assets/panels/panel75.svg",
        "femaleImage": "assets/panels/panel75_girl.svg",
        "read": "נאנד: שלום, אני Nand. אני אחד המעגלים הכי פשוטים שיש. אני בנוי רק משתי טריודות ונגד. אבל אפשר לבנות ממני כל מכונת חישוב, אפילו את המחשב שאתה וג'ון מנסים לבנות.",
        "femaleRead": "נאנד: שלום, אני Nand. אני אחד המעגלים הכי פשוטים שיש. אני בנוי רק משתי טריודות ונגד. אבל אפשר לבנות ממני כל מכונת חישוב, אפילו את המחשב שאת וג'ון מנסים לבנות."
      },
      {
        "image": "assets/panels/panel76.svg",
        "read": "נאנד: יש לי שתי כניסות."
      },
      {
        "image": "assets/panels/panel77.svg",
        "read": "נאנד: ויציאה אחת."
      },
      {
        "image": "assets/panels/panel78.svg",
        "read": "נאנד: טוב, האמת היא שאני גם צריך חיבור קבוע למקור מתח."
      },
      {
        "image": "assets/panels/panel79.svg",
        "femaleImage": "assets/panels/panel79_girl.svg",
        "read": "נאנד: אבל אתה לא צריך לדאוג לזה, לג'ון יש אנשים שמטפלים בזה.",
        "femaleRead": "נאנד: אבל את לא צריכה לדאוג לזה, לג'ון יש אנשים שמטפלים בזה."
      },
      {
        "image": "assets/panels/panel82.svg",
        "femaleImage": "assets/panels/panel82_girl.svg",
        "read": "נאנד: רוצה לדעת מה אני עושה? תנסה לחבר חלק מהכניסות שלי למקור מתח ואת היציאה למנורה. רק אל תתבלבל ביניהן. זה יכול לשרוף אותי.",
        "femaleRead": "נאנד: רוצה לדעת מה אני עושה? תנסי לחבר חלק מהכניסות שלי למקור מתח ואת היציאה למנורה. רק אל תתבלבלי ביניהן. זה יכול לשרוף אותי.",
        "workspaceLaunch": true
      },
      {
        "image": "assets/panels/panel80.svg",
        "read": "נאנד: עכשיו, בשנת 1943, אני די גדול, אבל בעוד מספר שנים יופיעו טריודות חדשות, שמבוססות על מוליכים למחצה ולא על שפופרות ריק. הן נקראות טרנזיסטורים. הן הרבה יותר קטנות, כך שגם אני אקטן בהרבה, ואהפוך גם למהיר בהרבה. עם השנים אני אהפוך לקטן ומהיר עוד יותר, כך שעד סוף המאה ה-20 אני אהיה כל כך קטן שאפשר יהיה לראות אותי רק במיקרוסקופ. זה חשוב, כי צריך אלפים ממני כדי לבנות מחשב פשוט, ומיליונים בשביל מחשב של המאה ה-21."
      },
      {
        "image": "assets/panels/panel81.svg",
        "read": "נאנד: היום, כדי להרכיב ממספר Nand-ים רכיב אלקטרוני, צריך לסדר אותנו על גבי כרטיס ולהלחים. עוד מספר עשורים יהיה אפשר לייצר — בעצם להדפיס — אלפים או אפילו מיליונים ממני בבת אחת, מחוברים יחד לפי תכנון מראש וארוזים בקופסה קטנה שנקראת צ'יפ. את הצ'יפים האלה ירכיבו על כרטיסים, ומהם יבנו מחשבים."
      }
    ]
  },
  "simple-gates": {
    "id": "simple-gates",
    "type": "story",
    "chapterId": "chapter-5",
    "year": "1943",
    "panels": [
      {
        "image": "assets/panels/panel83_simple_gates_01.svg",
        "read": ""
      },
      {
        "image": "assets/panels/panel84_simple_gates_02.svg",
        "read": ""
      },
      {
        "image": "assets/panels/panel85_simple_gates_03.svg",
        "read": ""
      },
      {
        "image": "assets/panels/panel86_simple_gates_04.svg",
        "read": ""
      },
      {
        "image": "assets/panels/panel87_simple_gates_worktable.svg",
        "read": "",
        "hotspots": [
          {
            "action": "open-note-tasks",
            "ariaLabel": "לחץ על הפתק",
            "left": 14,
            "top": 58,
            "width": 17,
            "height": 15
          },
          {
            "action": "return-to-nand-dialog",
            "ariaLabel": "הקש על Nand",
            "left": 39,
            "top": 59,
            "width": 18,
            "height": 24
          }
        ],
        "returnToNand": true
      }
    ]
  },
  "complex-gates": {
    "id": "complex-gates",
    "type": "story",
    "chapterId": "chapter-6",
    "year": "1943",
    "panels": [
      {
        "image": "assets/panels/panel88_chapter_2_3_intro.svg",
        "read": "פון נוימן: מצוין. עבודה טובה"
      },
      {
        "image": "assets/panels/panel89_chapter_2_3_routing_concept.svg",
        "read": "פון נוימן: אנחנו רוצים שהמחשב שלנו יוכל לעשות פעולות שונות. לכן אנחנו רוצים להיות מסוגלים להגיד לו לבחור בין אפשרויות. בשביל זה נבנה שני כרטיסים מיוחדים. בסופו של דבר מדובר בכרטיסים שעושים חישוב רגיל, כמו אלה שכבר בנית. אפשר אפילו לכתוב להם טבלת אמת, אבל הם יאפשרו לנו לבחור בין תוצאות חישוב שונות, או להפעיל כרטיסים שונים, כאילו יש שם איש קטן שמחבר כבלים שונים לפי מה שאומרים לו.",
        "unlocksExplanation": "why-route"
      },
      {
        "image": "assets/panels/panel90_chapter_2_3_note_placed.svg",
        "read": ""
      },
      {
        "image": "assets/panels/panel91_chapter_2_3_tasks_intro.svg",
        "femaleImage": "assets/panels/panel91_chapter_2_3_tasks_intro_girl.svg",
        "read": "פון נוימן: יש פה 2 כרטיסים שאתה צריך לבנות.",
        "femaleRead": "פון נוימן: יש פה 2 כרטיסים שאת צריכה לבנות."
      },
      {
        "image": "assets/panels/panel92_chapter_2_3_feynman_meeting.svg",
        "babyImage": "assets/panels/panel92_chapter_2_3_feynman_meeting_baby.svg",
        "olderImage": "assets/panels/panel92_chapter_2_3_feynman_meeting_older.svg",
        "read": "פון נוימן: אני צריך ללכת לפגישה עם בחור צעיר אחד, קוראים לו דיק פיינמן. הוא טיפוס בלתי נסבל, מתנהג כמו ילד בן 5 ומשוכנע שהוא האיש הכי חכם בעולם, הבעיה היא שהוא כנראה צודק... אולי אני צריך לערוך לכם היכרות בהזדמנות. עכשיו נכנס לו הרעיון שכדאי לספר לסטודנטים שעוזרים כאן עם החישובים מה אנחנו עושים כאן באמת, כדי שיפסיקו להתבטל ויתחילו לעבוד כמו בני אדם. גם כאן הוא כנראה צודק...",
        "babyRead": "פון נוימן: אני צריך ללכת לפגישה עם בחור צעיר אחד, קוראים לו דיק פיינמן. הוא טיפוס בלתי נסבל, מתנהג כמו תינוק ומשוכנע שהוא האיש הכי חכם בעולם, הבעיה היא שהוא כנראה צודק... אולי אני צריך לערוך לכם היכרות בהזדמנות. עכשיו נכנס לו הרעיון שכדאי לספר לסטודנטים שעוזרים כאן עם החישובים מה אנחנו עושים כאן באמת, כדי שיפסיקו להתבטל ויתחילו לעבוד כמו בני אדם. גם כאן הוא כנראה צודק...",
        "olderRead": "פון נוימן: אני צריך ללכת לפגישה עם בחור צעיר אחד, קוראים לו דיק פיינמן. הוא טיפוס בלתי נסבל, מתנהג כמו ילד בן 15 ומשוכנע שהוא האיש הכי חכם בעולם, הבעיה היא שהוא כנראה צודק... אולי אני צריך לערוך לכם היכרות בהזדמנות. עכשיו נכנס לו הרעיון שכדאי לספר לסטודנטים שעוזרים כאן עם החישובים מה אנחנו עושים כאן באמת, כדי שיפסיקו להתבטל ויתחילו לעבוד כמו בני אדם. גם כאן הוא כנראה צודק...",
        "year": ""
      },
      {
        "image": "assets/panels/panel93_chapter_2_3_worktable.svg",
        "read": "",
        "hotspots": [
          {
            "action": "open-routing-note-tasks",
            "ariaLabel": "לחץ על הפתק",
            "left": 14,
            "top": 58,
            "width": 17,
            "height": 15
          },
          {
            "action": "return-to-nand-dialog",
            "ariaLabel": "הקש על Nand",
            "left": 39,
            "top": 59,
            "width": 18,
            "height": 24
          }
        ],
        "returnToNand": true
      }
    ]
  },
  "buses": {
    "id": "buses",
    "type": "story",
    "chapterId": "chapter-7",
    "year": "1943",
    "panels": [
      {
        "image": "assets/panels/panel94_chapter_2_4_intro.svg",
        "read": "פון נוימן: עבודה מצוינת. כל הכרטיסים שבנית טובים מאוד, אבל הם עובדים עם ביטים בודדים. אנחנו צריכים להיות מסוגלים לעבוד עם הרבה ביטים בו זמנית."
      },
      {
        "image": "assets/panels/panel95_chapter_2_4_equipment.svg",
        "read": "פון נוימן: יש לך כאן ציוד שיעזור לך עם זה."
      },
      {
        "image": "assets/panels/panel96_chapter_2_4_placing.svg",
        "read": ""
      },
      {
        "image": "assets/panels/panel97_chapter_2_4_tasks.svg",
        "read": "פון נוימן: והנה עוד כמה משימות."
      },
      {
        "image": "assets/panels/panel98_chapter_2_4_break.svg",
        "read": "פון נוימן: טוב אני צריך הפסקה. השיחה עם דיק הרגה אותי. הוא באמת טיפוס בלתי נסבל. ממש מוכשר אבל בלתי נסבל. אתה תמשיך לעבוד.",
        "femaleImage": "assets/panels/panel98_chapter_2_4_break_girl.svg",
        "femaleRead": "פון נוימן: טוב אני צריך הפסקה. השיחה עם דיק הרגה אותי. הוא באמת טיפוס בלתי נסבל. ממש מוכשר אבל בלתי נסבל. את תמשיכי לעבוד."
      },
      {
        "image": "assets/panels/panel99_chapter_2_4_worktable.svg",
        "read": "",
        "hotspots": [
          {
            "action": "buses-note",
            "ariaLabel": "לחץ על הפתק",
            "left": 14,
            "top": 58,
            "width": 17,
            "height": 15
          },
          {
            "action": "return-to-nand-dialog",
            "ariaLabel": "הקש על Nand",
            "left": 39,
            "top": 59,
            "width": 18,
            "height": 24
          },
          {
            "action": "buses-crate-right",
            "ariaLabel": "האגף הימני של הארגז החדש",
            "left": 47,
            "top": 40,
            "width": 8,
            "height": 12
          },
          {
            "action": "buses-crate-left",
            "ariaLabel": "האגף השמאלי של הארגז החדש",
            "left": 55,
            "top": 40,
            "width": 8,
            "height": 12
          }
        ]
      },
      {
        "image": "assets/panels/panel99b_chapter_2_4_von_neumann.svg",
        "read": "פון נוימן: שוב אתה משחק במקום לעבוד?",
        "femaleImage": "assets/panels/panel99b_chapter_2_4_von_neumann_girl.svg",
        "femaleRead": "פון נוימן: שוב את משחקת במקום לעבוד?"
      },
      {
        "image": "assets/panels/panel99c_chapter_2_4_vn_done.svg",
        "read": "פון נוימן: אהה, גמרת הכול. טוב, עבודה טובה."
      },
      {
        "image": "assets/panels/panel99d_chapter_2_4_vn_multibit.svg",
        "read": "פון נוימן: עכשיו אנחנו צריכים לבנות כרטיסים שיודעים לבחור בין יותר מ-2 אפשרויות. בשביל זה הם יצטרכו יותר מביט בקרה אחד. למשל, כדי לבחור בין 4 אפשרויות אנחנו צריכים 2 ביטים. הראשון בוחר אם אנחנו רוצים אחת משתי האפשרויות הראשונות או אחת משתי האחרונות, והשני בוחר אחת מבין השתיים שבחר הביט הראשון."
      },
      {
        "image": "assets/panels/panel99e_chapter_2_4_vn_eight.svg",
        "read": "פון נוימן: תנסה לחשוב כמה ביטים צריך כדי לבחור בין 8 אפשרויות...",
        "femaleImage": "assets/panels/panel99e_chapter_2_4_vn_eight_girl.svg",
        "femaleRead": "פון נוימן: תנסי לחשוב כמה ביטים צריך כדי לבחור בין 8 אפשרויות..."
      },
      {
        "image": "assets/panels/panel96_chapter_2_4_placing.svg",
        "read": ""
      },
      {
        "image": "assets/panels/panel99f_chapter_2_4_fermi.svg",
        "read": "פון נוימן: הנה המשימות שלך. אני צריך לפגוש את אנריקו פרמי, הוא בדיוק הגיע משיקגו. עכשיו הם צריכים להעתיק את הכור שהוא בנה שם לכאן, ובקנה מידה גדול יותר."
      },
      {
        "image": "assets/panels/panel99g_chapter_2_4_worktable_next.svg",
        "read": "",
        "hotspots": [
          {
            "action": "buses-note",
            "ariaLabel": "לחץ על הפתק",
            "left": 14,
            "top": 58,
            "width": 17,
            "height": 15
          },
          {
            "action": "return-to-nand-dialog",
            "ariaLabel": "הקש על Nand",
            "left": 39,
            "top": 59,
            "width": 18,
            "height": 24
          },
          {
            "action": "buses-crate-right",
            "ariaLabel": "האגף הימני של הארגז החדש",
            "left": 47,
            "top": 40,
            "width": 8,
            "height": 12
          },
          {
            "action": "buses-crate-left",
            "ariaLabel": "האגף השמאלי של הארגז החדש",
            "left": 55,
            "top": 40,
            "width": 8,
            "height": 12
          }
        ]
      },
      {
        "image": "assets/panels/panel99h_chapter_2_4_vn_midnight.svg",
        "read": "פון נוימן: עבודה מצוינת. עכשיו כבר חצות. אתה יכול ללכת לישון. נמשיך לעבוד מחר ב-8 בבוקר. אנחנו צריכים ללמד את המחשב שלנו לעבוד עם מספרים, ולא סתם עם ביטים. אני צריך שתיזכר איך עושים פעולות חשבון עם מספרים גדולים."
      },
      {
        "image": "assets/panels/panel99i_chapter_2_4_vn_library.svg",
        "read": "פון נוימן: מחר ב-7 בבוקר גש לספרייה ועבור על הספר באריתמטיקה של סטון-מיילס כדי שתהיה מוכן."
      },
      {
        "image": "assets/panels/panel99j_chapter_2_4_night.svg",
        "read": ""
      }
    ]
  },
  "arithmetic": {
    "id": "arithmetic",
    "type": "story",
    "chapterId": "chapter-8",
    "year": "07:15",
    "panels": [
      {
        "image": "assets/panels/panel100_chapter_2_5_library.svg",
        "read": ""
      },
      {
        "image": "assets/panels/panel101_chapter_2_5_library_inside_v2.svg",
        "read": "",
        "comment": "Click-zones live in panel101_chapter_2_5_library_inside_v2.svg (editable in Inkscape). The 6 reference links are 'object' rects; the Stone-Millis book is an 'action' rect whose geometry is synced onto this button. The position below is only a fallback for when the SVG script has not posted yet.",
        "hotspots": [
          { "ariaLabel": "מחברת האריתמטיקה", "action": "stone-millis-book", "left": 66.6, "top": 42.7, "width": 12.2, "height": 35.1 }
        ]
      },
      {
        "image": "assets/panels/panel102_chapter_2_5_library_vn.svg",
        "year": "07:55",
        "read": "פון נוימן: אני מקווה שעברת על החומר כמו שצריך. בוא, יש לנו הרבה עבודה."
      },
      {
        "image": "assets/panels/panel103_chapter_2_5_binary_1.svg",
        "year": "1943",
        "read": "פון נוימן: אני צריך לספר לך איך מכונות חישוב עובדות עם מספרים. זה לא נוח לעבוד עם ספרות. אנחנו מעדיפים לעבוד עם ביטים. לביט יש רק שתי אפשרויות: 0 ו-1. כך שעם ביט אחד אפשר לכתוב רק את המספרים האלה. אם אנחנו רוצים לכתוב את 2 אנחנו נצטרך ביט נוסף. בדיוק כמו שכשמשתמשים בספרות אנחנו צריכים ספרה נוספת למספרים שגדולים מ-9."
      },
      {
        "image": "assets/panels/panel104_chapter_2_5_binary_2.svg",
        "year": "1943",
        "read": "פון נוימן: השיטה לכתוב מספרים עם ביטים נקראת השיטה הבינרית, כתיבה בבסיס ספירה 2. היא דומה לשיטה העשרונית שאתה מכיר אבל הבסיס הוא 2 במקום 10. כשכותבים בשיטה הבינרית הספרה הימנית ביותר היא ספרת האחדות (כמו בשיטה העשרונית). הספרה הבאה מימין היא ספרת ה-2, אחריה ספרת ה-4 אז ספרת ה-8 וכך הלאה (כל פעם מכפילים פי-2). כל ספרה היא בעצם ביט (היא יכולה להיות רק 0 או 1). למשל המספר 101 בשיטה הבינרית הוא 5: ה-1 הימני מייצג 1, ה-0 שאחריו מייצג 0 פעמים 2 (שהם 0) וה-1 שאחריו מייצג 4. דוגמה נוספת היא המספר 111 שהוא המספר התלת-ספרתי הגדול ביותר בשיטה הבינרית. הוא למעשה המספר 1+2+4=7. בשביל לכתוב 8 יש צורך בספרה נוספת: 1000. באופן כללי התפקיד של כל ספרה הוא פי 2 יותר מאשר של הספרה הקודמת, בדיוק כמו שבשיטה העשרונית התפקיד של כל ספרה הוא פי-10 יותר משל הספרה הקודמת."
      },
      {
        "image": "assets/panels/panel105_chapter_2_5_binary_3.svg",
        "year": "1943",
        "read": "פון נוימן: כדי לציין שאנחנו כותבים מספר בשיטה הבינרית אנחנו מוסיפים 2 קטן בתחתית המספר. למשל 110₂=6."
      },
      {
        "image": "assets/panels/panel106_chapter_2_5_workshop_vn.svg",
        "year": "1943",
        "read": "פון נוימן: יש כאן כמה תרגילים על השיטה הבינרית. לפני שאתה מלמד את המחשב לעבוד עם השיטה הבינרית, כדאי שתכיר אותה טוב בעצמך. אני הולך עכשיו לפגוש את נילס בוהר. הוא הגיע מאנגליה. מזל שהוא הצליח לצאת מדנמרק ברגע האחרון."
      },
      {
        "image": "assets/panels/panel107_chapter_2_5_workshop.svg",
        "year": "1943",
        "read": "",
        "comment": "Click-zones live in panel107_chapter_2_5_workshop.svg (editable in Inkscape). Object rects link to reference articles; the action rects (binary-booklet, the bus/splitter crates and the NAND) get their precise geometry from the SVG — the percentages below are fallbacks before the SVG posts. The bus/splitter/NAND zones are reused from the 2.4 worktable (same image); the table zone is injected by warehouse-hotspots.js.",
        "hotspots": [
          { "ariaLabel": "חוברת התרגילים", "action": "binary-booklet", "left": 58.4, "top": 73.7, "width": 11.4, "height": 11.5 },
          { "ariaLabel": "הקש על Nand", "action": "return-to-nand-dialog", "left": 39, "top": 59, "width": 18, "height": 24 },
          { "ariaLabel": "האגף הימני של הארגז החדש", "action": "buses-crate-right", "left": 47, "top": 40, "width": 8, "height": 12 },
          { "ariaLabel": "האגף השמאלי של הארגז החדש", "action": "buses-crate-left", "left": 55, "top": 40, "width": 8, "height": 12 }
        ]
      },
      {
        "comment": "The bits-range dialogue, shown once right after all binary-booklet tasks are completed (see binWalkthroughFinish). Each slide is its own SVG whose speech text is baked into the art (read is the TTS narration); two of them gate advancement behind a numeric answer.",
        "image": "assets/panels/panel108_chapter_2_5_bits_1.svg",
        "year": "1943",
        "read": "מצוין, אני רואה שהבנת את הפרינציפ. עכשיו צריך ללמד את זה את המחשב שלנו. אנחנו יכולים לייצג מספרים באמצעות רצף של ביטים. אם אנחנו רוצים לבנות כרטיס שיבצע פעולה עם מספרים, אנחנו נכניס לתוכו בסים שייצגו מספרים. בס ברוחב 4 יכול לייצג מספר 4 ספרתי בשיטה הבינרית. אני לא בטוח שזה מספיק לנו. מה המספר הכי גדול שאפשר לייצג כך?",
        "question": { "answer": 15, "wrong": "אני לא חושב" }
      },
      {
        "image": "assets/panels/panel109_chapter_2_5_bits_2.svg",
        "year": "1943",
        "read": "נכון. המספר החמש ספרתי הכי קטן הוא 10000 בבינרית שזה בעצם 16. לכן המספר הארבע ספרתי הכי גדול, הוא אחד פחות מזה 1111 בבינרית שזה בעצם 15."
      },
      {
        "image": "assets/panels/panel110_chapter_2_5_bits_3.svg",
        "year": "1943",
        "read": "זה ממש לא מספיק לנו. אנחנו צריכים לפעמים מספרים בגודל של עשרות אלפים. אני מניח שמספרים עד 50,000 יספיקו לנו. כמה ביטים נצטרך בשביל זה?",
        "question": { "answer": 16, "wrong": "אני לא חושב" }
      },
      {
        "image": "assets/panels/panel111_chapter_2_5_bits_4.svg",
        "year": "1943",
        "read": "נכון. עם 10 ביטים אפשר לייצג 1024 מספרים שזה בערך 1000. לאחר מכן כל ביט מכפיל פי-2, לכן עם 15 ביטים אפשר לייצג בערך 32,000 מספרים, שזה עוד לא מספיק לנו. אבל עם 16 ביטים אפשר לייצג 64,000 מספרים שזה כבר סבבה בינתיים.",
        "unlocksExplanation": "words-bytes",
        "cornerLink": { "text": "ג'ון לא אמר לך את כל האמת. רוצה לדעת את האמת? לחץ כאן", "action": "open-words-bytes" }
      },
      {
        "image": "assets/panels/panel112_chapter_2_5_bits_5.svg",
        "year": "1943",
        "read": "כשאני מדבר על מספרים 16 ספרתיים אני כמובן כולל גם מספרים עם פחות ספרות, פשוט אפשר לכתוב 0 בספרות שלא מופיעות. אפשר לעשות את זה גם בשיטה העשרונית. למשל, לכתוב 032 במקום 32. ביום יום זה לא מקובל, כי ה-0 סתם נראה מיותר, אבל בעולם של מכונות חישוב, זה מאוד נוח, כי המכונות שלנו עובדות עם מספר קבוע של ספרות, אנחנו הרי לא רוצים לחבר כל פעם את החוטים מחדש. לכן, אנחנו קובעים מראש את מספר הספרות וכותבים 0 בספרות שלא צריך. אנחנו גם מקפידים שלא לחרוג ממספר הספרות שקבענו."
      },
      {
        "image": "assets/panels/panel113_chapter_2_5_add_1.svg",
        "year": "1943",
        "read": "פעולת החשבון הכי בסיסית היא חיבור. אנחנו רוצים לבנות כרטיס שמחבר 2 מספרים. הוא יקבל 2 בסים של 16 ביטים (שמייצגים 2 מספרים) ויוציא בס של 16 ביטים (שמייצג את הסכום שלהם). אנחנו נעשה את זה בדיוק כמו שאתה עשית כשחישבת סכום של 2 מספרים בטור. השלב הבסיסי הוא לחבר 2 ספרות. שים לב שהתוצאה יכולה להיות דו ספרתית. יש לה ספרת אחדות וספרת 2. בספרת האחדות נשתמש כמו שהיא, ואת ספרת ה-2 נעביר הלאה לספרה הבאה. קוראים לספרה שמעבירים הלאה נשיאה ובאנגלית carry."
      },
      {
        "image": "assets/panels/panel114_chapter_2_5_add_2.svg",
        "year": "1943",
        "read": "הבעיה היא שכרטיס שמחבר 2 ספרות לא מספיק לנו. כי לאחר שנחבר את ספרת האחדות, נצטרך גם להתמודד עם ה-carry הקודם. לכן אנו צריכים לבנות גם כרטיס שמחבר 3 ספרות."
      },
      {
        "image": "assets/panels/panel115_chapter_2_5_add_3.svg",
        "year": "1943",
        "read": "אחרי שהוא יהיה מוכן יהיה אפשר לבנות כרטיס שמחבר מספרים רב ספרתיים (במקרה שלנו 16 ספרתיים בכתיבה בינרית)."
      },
      {
        "image": "assets/panels/panel116_chapter_2_5_add_4.svg",
        "year": "1943",
        "read": "יש רק בעיה קטנה אחת: סכום של שני מספרים 16 ספרתיים הוא לעיתים 17 ספרתי. אנחנו נתעלם מהספרה המובילה, כי במחשב כל החיבורים קבועים, ואנחנו לא יכולים להרחיב אותם עד אינסוף. כל עוד כל המספרים המעורבים (כולל התוצאה) לא יעלו על 64,000, זה יהיה בסדר. אם נעבור את הגודל המותר זה יוביל לתקלה שנקראת גלישה נומרית. ננסה להימנע מזה..."
      },
      {
        "comment": "Wordless beat: von Neumann picks up the note to hand over the tasks.",
        "image": "assets/panels/panel117_chapter_2_5_handover.svg",
        "year": "1943",
        "read": ""
      },
      {
        "comment": "Von Neumann in the doorway, handing over the tasks.",
        "image": "assets/panels/panel118_chapter_2_5_doorway.svg",
        "year": "1943",
        "read": "טוב, הנה המשימות שלך."
      },
      {
        "comment": "Von Neumann leaves the binary→decimal converter devices for checking work.",
        "image": "assets/panels/panel118b_chapter_2_5_converters.svg",
        "year": "1943",
        "read": "אני משאיר לך כאן מכשירים שממירים בסים עם מספרים בינריים למספרים עשרוניים. תוכל להשתמש בהם בשביל לבדוק מה אתה עושה."
      },
      {
        "comment": "Von Neumann's farewell before leaving for Bohr (moved out of the doorway slide).",
        "image": "assets/panels/panel118c_chapter_2_5_farewell.svg",
        "year": "1943",
        "read": "אני צריך לחזור לנילס. יש לו רעיון הזוי לחלוק עם הקומוניסטים את הפרויקט שלנו. אני צריך להוריד אותו מזה, ומהר. אומנם עכשיו יש לנו אויב משותף, אבל סטלין לא הרבה פחות גרוע מהיטלר, וזה יהיה אסון לתת לו נשק כזה, גם אם זה יקדם אותנו קצת בפרויקט. מצד שני קשה לשפוט את נילס, הוא היה בדנמרק כשהנאצים נכנסו ושמע מקרוב על הזוועות של הנאצים שעליהם אנחנו שומעים מרחוק."
      },
      {
        "comment": "The empty arithmetic worktable. Click-zones mirror panel107, plus a (not-yet-implemented) tasks-note zone. These are fallback percentages until a hotspot-carrying SVG is authored.",
        "image": "assets/panels/panel119_chapter_2_5_worktable.svg",
        "year": "1943",
        "read": "",
        "hotspots": [
          { "ariaLabel": "פתק המשימות", "action": "arith-tasks-note", "left": 18, "top": 65, "width": 15, "height": 15 },
          { "ariaLabel": "הממיר העליון (בינרי לעשרוני)", "action": "arith-converter-in", "left": 1.5, "top": 45, "width": 10, "height": 7 },
          { "ariaLabel": "הממיר התחתון (עשרוני לבינרי)", "action": "arith-converter-out", "left": 0, "top": 52.5, "width": 15, "height": 11 },
          { "ariaLabel": "חוברת התרגילים", "action": "binary-booklet", "left": 58.4, "top": 73.7, "width": 11.4, "height": 11.5 },
          { "ariaLabel": "הקש על Nand", "action": "return-to-nand-dialog", "left": 39, "top": 59, "width": 18, "height": 24 },
          { "ariaLabel": "האגף הימני של הארגז החדש", "action": "buses-crate-right", "left": 47, "top": 40, "width": 8, "height": 12 },
          { "ariaLabel": "האגף השמאלי של הארגז החדש", "action": "buses-crate-left", "left": 55, "top": 40, "width": 8, "height": 12 }
        ]
      }
    ]
  },
  "alu": {
    "id": "alu",
    "type": "story",
    "chapterId": "chapter-9",
    "year": "1943",
    "panels": [
      {
        "comment": "Chapter 2.6 (ALU) opening: von Neumann speech over the reused 2.5 farewell room. Speech is baked into each SVG; read is the TTS narration.",
        "image": "assets/panels/panel120_chapter_2_6_alu_1.svg",
        "year": "1943",
        "read": "מצוין. עבודה טובה. עכשיו יש לנו מכונה שמחברת מספרים. אנחנו נצטרך עוד מכונות שעושות עוד חישובים. אנחנו רוצים לבנות מכונה אחת שתעשה את כל החישובים שנצטרך. היא תקבל את המספרים שעליהם אנחנו רוצים לעשות את החישוב ובס נוסף שיגיד לה איזה חישוב לעשות."
      },
      {
        "image": "assets/panels/panel121_chapter_2_6_alu_2.svg",
        "year": "1943",
        "read": "תזכור, בפועל המכונה לא באמת בוחרת שום דבר. היא עושה את כל החישובים ובסוף רק אחד מהם יוצא. כמו שאתה זוכר יש לנו כרטיס שיכול \"לבחור\" בין אפשרויות. זה עדיין לא המחשב שאנחנו רוצים לעשות, כי המכונה הזאת תוכל לבצע רק חישובים פשוטים - של צעד אחד. וצריך \"להגיד\" לה לעשות כל חישוב בנפרד. היא יותר דומה למחשבון. אבל זה צעד חשוב בבניית המחשב. בסופו של דבר כל חישוב מורכב בנוי מהרבה צעדים פשוטים."
      },
      {
        "image": "assets/panels/panel122_chapter_2_6_alu_3.svg",
        "year": "1943",
        "read": "נקרא לה ALU ראשי תיבות באנגלית של \"יחידה לוגית אריתמטית\". היא תוכל לעשות פעולות אריתמטיות כמו חיבור ופעולות לוגיות כמו AND."
      },
      {
        "comment": "Von Neumann leans over the worktable placing the ALU tasks note. No speech bubble.",
        "image": "assets/panels/panel123_chapter_2_6_alu_handover.svg",
        "year": "1943",
        "read": ""
      },
      {
        "comment": "Von Neumann's farewell (reused 2.5 farewell room) as he hands over the ALU tasks and leaves.",
        "image": "assets/panels/panel124_chapter_2_6_alu_farewell.svg",
        "year": "1943",
        "read": "הנה המשימות שלך. אני צריך לחזור לעבודה. סוף-סוף חזרו התוצאות של החישוב שביקשתי, ואני יכול להמשיך לעבוד על ניתוח של תנועת הגזים בפיצוץ. זה פיצוץ רגיל, אבל אנחנו צריכים לדעת לכוון אותו במדויק כדי לגרום ל.... טוב לא משנה...."
      },
      {
        "comment": "The ALU worktable. Same room and click-zones as panel119, but the tasks note opens the 2.6 ALU list (alu-tasks-note).",
        "image": "assets/panels/panel125_chapter_2_6_alu_worktable.svg",
        "year": "1943",
        "read": "",
        "hotspots": [
          { "ariaLabel": "פתק המשימות", "action": "alu-tasks-note", "left": 18, "top": 65, "width": 15, "height": 15 },
          { "ariaLabel": "הממיר העליון (בינרי לעשרוני)", "action": "arith-converter-in", "left": 1.5, "top": 45, "width": 10, "height": 7 },
          { "ariaLabel": "הממיר התחתון (עשרוני לבינרי)", "action": "arith-converter-out", "left": 0, "top": 52.5, "width": 15, "height": 11 },
          { "ariaLabel": "חוברת התרגילים", "action": "binary-booklet", "left": 58.4, "top": 73.7, "width": 11.4, "height": 11.5 },
          { "ariaLabel": "הקש על Nand", "action": "return-to-nand-dialog", "left": 39, "top": 59, "width": 18, "height": 24 },
          { "ariaLabel": "האגף הימני של הארגז החדש", "action": "buses-crate-right", "left": 47, "top": 40, "width": 8, "height": 12 },
          { "ariaLabel": "האגף השמאלי של הארגז החדש", "action": "buses-crate-left", "left": 55, "top": 40, "width": 8, "height": 12 }
        ]
      },
      {
        "comment": "Reached after ALL the 2.6 ALU cards are built: von Neumann back in the doorway, the room as it was before the tasks. His 'you built an ALU' monologue runs over four slides (126, 126b, 126c, 126d) — same art and same balloon, only the text changes. Speech is baked into each SVG.",
        "image": "assets/panels/panel126_chapter_2_6_alu_done_1.svg",
        "year": "1943",
        "read": "מצוין, בנית ALU, זאת לא סתם מכונה שעושה חישוב אחד, אלא ממש מכונה שאפשר להגיד לה איזה חישוב היא תעשה."
      },
      {
        "comment": "The monologue continues: what the ALU's control bus IS — the 12-bit \"instructions\".",
        "image": "assets/panels/panel126b_chapter_2_6_alu_instructions.svg",
        "year": "1943",
        "read": "בס הבקרה של ה-ALU נקרא \"הוראות\", כי הוא מורה לו איזה חישוב לעשות. ההוראות של ה-ALU שלנו מורכבות מ-12 ביטים. הן יכולות לבחור על איזה 2 מתוך שלוש הכניסות של ה-ALU תתבצע הפעולה. הן גם יכולות לבחור שלא תתבצע פעולה כלל ובמקום זה ה-ALU יוציא את ההוראות עצמן, אבל הכי חשוב, הן מאפשרות לבחור בין 64 פעולות ולבצע אותם על שני בסים של 16 ביט כל אחד."
      },
      {
        "comment": "And what those 64 operations are worth: some duplicates, some odd ones, still plenty that matter.",
        "image": "assets/panels/panel126c_chapter_2_6_alu_operations.svg",
        "year": "1943",
        "read": "חלק מ-64 הפעולות האלה זהות זו לזו, חלקן מוזרות וכנראה לא שימושיות, אבל אחרי כל זה אנחנו עדיין נשארים עם לא מעט פעולות שימושיות שיאפשרו לנו לבצע חישובים מסובכים."
      },
      {
        "comment": "The closing beat of the monologue: not a computer yet, but progress.",
        "image": "assets/panels/panel126d_chapter_2_6_alu_progress.svg",
        "year": "1943",
        "read": "ה-ALU הוא עדיין לא מחשב שיכול לעשות חישובים רב שלביים, אבל זאת התקדמות."
      },
      {
        "comment": "Second half of the monologue: the teaser about subtraction, leading into the (still to be scripted) inactive workbench with side bubbles.",
        "image": "assets/panels/panel127_chapter_2_6_alu_done_2.svg",
        "year": "1943",
        "read": "אתה אולי שאלת את עצמך איך עושים חיסור, זו הרי פעולה לא פחות חשובה מחיבור. הנה תראה משהו מגניב:"
      }
    ]
  },
  "flipflop": {
    "id": "flipflop",
    "type": "story",
    "chapterId": "chapter-10",
    "year": "1943",
    "panels": [
      {
        "comment": "Chapter 3.1 (part 3, memory) opening: von Neumann back in the warehouse, introducing the need for memory (speech baked into the SVG). Reached after the subtraction demo.",
        "image": "assets/panels/panel128_chapter_3_1_memory.svg",
        "year": "1943",
        "read": "טוב, נפסיק לברבר ונמשיך לעבוד. כדי שהמחשב שלנו יוכל לבצע חישובים מסובכים הוא צריך אפשרות לזכור את מה שהוא עושה. בשביל זה הוא צריך זיכרון. עד עכשיו כל הכרטיסים שבנינו ידעו לבצע חישוב אבל לא ידעו לשמור שום דבר. אנחנו צריכים לבנות כרטיסים שיכולים לשמור משהו. זאת אומרת שחוץ מכניסות ויציאות הם יוכלו להימצא גם במצבים שונים ונוכל להעביר אותם ממצב למצב על ידי שינוי הכניסות."
      },
      {
        "comment": "Chapter 3.1: how to build memory - feedback (connect outputs back to inputs) and the idea that NANDs have propagation delay. Same raster as panel128 (reuses panel118c), fresh baked bubble.",
        "image": "assets/panels/panel129_chapter_3_1_feedback.svg",
        "year": "1943",
        "read": "הדרך לעשות את זה היא לחבר יציאות חזרה לכניסות, כך שנוצר מעין מעגל. שים לב, ה-NANDים ברכיבים השונים לא מגיבים מיד. אם אתה משנה את הכניסה לוקח זמן מה עד שהיציאה משתנה בהתאם."
      },
      {
        "comment": "Chapter 3.1: hand-off to the workbench - try connecting a NOT in a loop. Leads into the clocked (sequential) scenario workbench. Same raster as panel128.",
        "image": "assets/panels/panel130_chapter_3_1_try_not_loop.svg",
        "year": "1943",
        "read": "הנה, תנסה לחבר את ה-NOT במעגל."
      },
    ]
  },
  "registers": {
    "id": "registers",
    "type": "story",
    "chapterId": "chapter-11",
    "year": "1943",
    "panels": [
      {
        "comment": "Chapter 3.1 warehouse epilogue (reached AFTER the clocked table collapses the MUX-latch into a single FF card, via finishMuxDemo → exitFlipflopToWarehouse). Von Neumann in the doorway looking at the FF on the worktable: one bit of memory is not enough.",
        "image": "assets/panels/panel131_chapter_3_1_more_memory.svg",
        "year": "1943",
        "read": "טוב, יש לנו המון עבודה. לא יספיק לנו ליצור זיכרון של ביט אחד. צריך הרבה יותר זיכרון."
      },
      {
        "comment": "Wordless beat: von Neumann leans over the worktable and lays down a card (a 16-bit register) next to the flip-flop.",
        "image": "assets/panels/panel132_chapter_3_1_place_card.svg",
        "year": "1943",
        "read": ""
      },
      {
        "comment": "Back to the doorway pose (reuses panel131's raster): the card he laid down is a 16-bit memory — and it has a name, רגיסטר / אוגר. The basic unit of information the machine works with.",
        "image": "assets/panels/panel133_chapter_3_1_sixteen_bits.svg",
        "year": "1943",
        "read": "תתחיל מזה. זה כרטיס שיודע לשמור 16 ביטים. קוראים לכרטיס כזה \"רגיסטר\" (בעברית \"אוגר\"). כמו שאמרנו קודם, אנחנו נשתמש ב-16 ביטים בשביל לשמור מספרים. ובכלל, זאת תהיה היחידה הבסיסית של מידע שהמחשב שלנו עובד איתה."
      },
      {
        "comment": "Von Neumann's parting line before going back to work (reuses panel131's raster).",
        "image": "assets/panels/panel134_chapter_3_1_back_to_work.svg",
        "year": "1943",
        "read": "אני חוזר לעבודה. סוף סוף לא צריך לחכות המון זמן לחישובים."
      },
      {
        "comment": "Chapter 3.2 memory worktable: the tasks note opens the memory-card list (Register4 → Register), and the נעץ (nail) box has its own optional monologue. The REAL geometry lives in the panel SVG (hotspot-action-* rects, editable in Inkscape) and is posted to the app; the percentages below are only the fallback used until that message arrives.",
        "image": "assets/panels/panel135_chapter_3_1_memory_worktable.svg",
        "year": "1943",
        "read": "",
        "hotspots": [
          { "ariaLabel": "פתק המשימות", "action": "memory-tasks-note", "left": 23, "top": 66, "width": 10, "height": 9 },
          { "ariaLabel": "קופסת הנעצים", "action": "nail-box", "left": 58, "top": 56, "width": 12, "height": 10 },
          { "ariaLabel": "הממיר העליון (בינרי לעשרוני)", "action": "arith-converter-in", "left": 1.5, "top": 45, "width": 10, "height": 7 },
          { "ariaLabel": "הממיר התחתון (עשרוני לבינרי)", "action": "arith-converter-out", "left": 0, "top": 52.5, "width": 15, "height": 11 },
          { "ariaLabel": "חוברת התרגילים", "action": "binary-booklet", "left": 58.4, "top": 73.7, "width": 11.4, "height": 11.5 },
          { "ariaLabel": "הקש על Nand", "action": "return-to-nand-dialog", "left": 39, "top": 59, "width": 18, "height": 24 },
          { "ariaLabel": "האגף הימני של הארגז החדש", "action": "buses-crate-right", "left": 47, "top": 40, "width": 8, "height": 12 },
          { "ariaLabel": "האגף השמאלי של הארגז החדש", "action": "buses-crate-left", "left": 55, "top": 40, "width": 8, "height": 12 }
        ]
      },
      {
        "comment": "Reached AFTER both memory cards (Register4, Register) are built (completion-gating wired with the task build). Von Neumann standing in the doorway (reuses panel131's raster): good work, it's past midnight, get some sleep.",
        "image": "assets/panels/panel136_chapter_3_1_good_work.svg",
        "year": "1943",
        "read": "אני רואה שהסתדרת עם הרגיסטרים. עבודה טובה. הספקנו היום הרבה. שוב אחרי חצות. לך לישון. מחר מתחילים לעבוד ב-7:30."
      },
      {
        "comment": "The night that passes between the register cards and the RAM briefing: a Los Alamos night exterior (reuses the 2.4 night raster).",
        "image": "assets/panels/panel137_chapter_3_1_night.svg",
        "year": "1943",
        "read": ""
      }
    ]
  },
  "ram": {
    "id": "ram",
    "title": "3.3 RAM",
    "panels": [
      {
        "comment": "Chapter 3.3 RAM beat, next morning. Von Neumann back in the doorway (reuses panel131's raster).",
        "image": "assets/panels/panel138_chapter_3_3_ram_intro.svg",
        "year": "1943",
        "read": "אני מקווה שישנת טוב. יש לנו המון עבודה."
      },
      {
        "comment": "The RAM briefing itself — a wide bubble on the same doorway raster: 1000 registers, one written at a time, the two inputs plus control, and the MUX that picks which register is active.",
        "image": "assets/panels/panel139_chapter_3_3_ram_brief.svg",
        "year": "1943",
        "read": "אנחנו נרצה שלמחשב שלנו יהיה זיכרון הרבה יותר גדול מרגיסטר אחד. 1000 רגיסטרים אמורים להספיק בינתיים. זה לא מעשי לכתוב בו זמנית ל-1000 רגיסטרים. לכן בכל רגע נכתוב רק לרגיסטר אחד. לזיכרון שלנו יהיו 2 כניסות. אחת אומרת מה אנחנו רוצים לכתוב לתוכו והשנייה אומרת לאיזה רגיסטר אנחנו רוצים לכתוב. כמובן יש גם את כניסת הבקרה שאומרת האם אנחנו רוצים לכתוב. כמו שאתה יודע, אי אפשר לשנות את החיבורים בזמן פעולת המחשב, כך שהכניסות צריכות להיות מחוברות לכל הרגיסטרים, אבל אנחנו יכולים להשתמש ב-MUX כדי לגרום רק לרגיסטר אחד להיות פעיל. תתחיל עם זיכרונות קטנים, ותעבור בהדרגתיות ליותר גדולים."
      },
      {
        "comment": "Wordless beat: von Neumann lays the new tasks note on the worktable (reuses the 2.6 handover raster).",
        "image": "assets/panels/panel140_chapter_3_3_ram_handover.svg",
        "year": "1943",
        "read": ""
      },
      {
        "comment": "Chapter 3.3 RAM worktable: the same click-zones as panel135, but the tasks note opens the RAM list (RAM4 → RAM1024). None of those is implemented yet, so a tapped card answers 'המשך יבוא...'. The REAL geometry lives in the panel SVG (hotspot-action-* rects, editable in Inkscape); the percentages below are only the fallback used until that message arrives.",
        "image": "assets/panels/panel141_chapter_3_3_ram_worktable.svg",
        "year": "1943",
        "read": "",
        "hotspots": [
          { "ariaLabel": "פתק המשימות", "action": "ram-tasks-note", "left": 23, "top": 66, "width": 10, "height": 9 },
          { "ariaLabel": "קופסת הנעצים", "action": "nail-box", "left": 58, "top": 56, "width": 12, "height": 10 },
          { "ariaLabel": "הממיר העליון (בינרי לעשרוני)", "action": "arith-converter-in", "left": 1.5, "top": 45, "width": 10, "height": 7 },
          { "ariaLabel": "הממיר התחתון (עשרוני לבינרי)", "action": "arith-converter-out", "left": 0, "top": 52.5, "width": 15, "height": 11 },
          { "ariaLabel": "חוברת התרגילים", "action": "binary-booklet", "left": 58.4, "top": 73.7, "width": 11.4, "height": 11.5 },
          { "ariaLabel": "הקש על Nand", "action": "return-to-nand-dialog", "left": 39, "top": 59, "width": 18, "height": 24 },
          { "ariaLabel": "האגף הימני של הארגז החדש", "action": "buses-crate-right", "left": 47, "top": 40, "width": 8, "height": 12 },
          { "ariaLabel": "האגף השמאלי של הארגז החדש", "action": "buses-crate-left", "left": 55, "top": 40, "width": 8, "height": 12 }
        ]
      },
      {
        "comment": "Reached once all five RAM cards are built: von Neumann back in the doorway (panel131's art, as in panel138/139). What 1000 registers are worth.",
        "image": "assets/panels/panel142_chapter_3_3_ram_thousand.svg",
        "year": "1943",
        "read": "מצוין. בנית זיכרון גדול למדי שיכול לשמור 1000 רגיסטרים. זה אולי לא מספיק בשביל לשמור את כל המידע שצריך לשמור, אך בהחלט מספיק כדי לבצע חישובים רב שלביים מורכבים למדי."
      },
      {
        "comment": "What the name RAM means, and why it is a silly one.",
        "image": "assets/panels/panel143_chapter_3_3_ram_name.svg",
        "year": "1943",
        "read": "לזיכרון הזה יש תכונה מיוחדת, אפשר לגשת במהירות לכל רגיסטר בזיכרון ולשנות אותו או לקרוא ממנו. קוראים לזיכרון כזה RAM אלו הן ראשי תיבות של Random Access Memory או בעברית זיכרון גישה אקראית. זהו שם די מטופש, אין כאן שום דבר אקראי, שם מתאים יותר היה יכול להיות \"זיכרון גישה ישירה\", אבל נתקענו עם השם הזה."
      },
      {
        "comment": "The alternative: paper tape — cheap and big, but you cannot jump about in it.",
        "image": "assets/panels/panel144_chapter_3_3_ram_paper_tape.svg",
        "year": "1943",
        "read": "יש לנו זיכרונות אחרים גדולים וזולים יותר, אבל אין להם את התכונה של גישה ישירה. למשל יש לנו סלילי נייר עליהם יש שורות שורות של נקבים. 16 מקומות לנקב בכל שורה, אך לא כל 16 המקומות מנוקבים. יש לנו מכשיר שאפשר להעביר דרכו את הסליל ובכל שורה הוא בודק איפה יש את הנקבים (לפי איפה שעובר החשמל; הנייר לא נותן לחשמל לעבור) ומוציא את המידע הזה לבס של 16 כבלים. אפשר להזין את המידע הזה למכונות חישוב כמו ה-ALU למשל. אם רוצים לעבור על כל השורות מהתחלה ועד הסוף, זה אפילו די מהיר (יותר איטי מהזיכרון שלנו, בגלל שזה מכני ולא חשמלי אבל עדיין סביר). אולם אם רוצים לגשת למקום ספציפי זה נהיה בעייתי, צריך לגלגל חלק ניכר מהסליל כדי להגיע למקום הרצוי. אם כל פעם רוצים לקפוץ לאיזור אחר בסליל זה נהיה לא מעשי בכלל. ב-RAM שלנו לעומת זאת, זה פשוט מאוד."
      },
      {
        "comment": "The rest of the trade: easy to write to, expensive to make, and volatile.",
        "image": "assets/panels/panel145_chapter_3_3_ram_volatile.svg",
        "year": "1943",
        "read": "ל-RAM יש עוד יתרון, אפשר לכתוב לתוכו בקלות ולא רק לקרוא ממנו. החיסרון המרכזי של ה-RAM הוא שהוא יקר וקשה ליצור, לכן אנחנו נאלצים להסתפק ב-1000 רגיסטרים. ל-RAM יש עוד חיסרון - אם מנתקים אותו מהחשמל הכל הופך ל-0 כי אין מתח בשום מקום. לכן אומרים שזה זיכרון נדיף - המידע מתנדף ממנו. זה לא מאוד מפריע לנו כי גם כך ה-RAM שלנו קטן מדי כדי לשמור בו דברים חשובים לאורך זמן. אנחנו נשתמש בו רק בשביל שהמחשב יוכל לעשות חישובים."
      }
    ]
  },
  "ports": {
    "id": "ports",
    "title": "3.4 פורטים",
    "panels": [
      {
        "comment": "Chapter 3.4 Ports: von Neumann back in the doorway (panel131 art). Why the machine has to be able to talk to devices at all.",
        "image": "assets/panels/panel146_chapter_3_4_ports_intro.svg",
        "year": "1943",
        "read": "יש עוד עניין שאנחנו צריכים לטפל בו. אנחנו רוצים להיות מסוגלים לחבר מכשירים למחשב שלנו כדי לקבל ממנו מידע ולהעביר לו מידע. אחרת, לא באמת נוכל להשתמש בו."
      },
      {
        "comment": "The route chosen: do it through the memory.",
        "image": "assets/panels/panel147_chapter_3_4_ports_memory.svg",
        "year": "1943",
        "read": "יש כל מיני דרכים לעשות זאת, אנחנו נשתמש בזיכרון שלו למטרה הזאת."
      },
      {
        "comment": "Eight more registers, each with its own bus straight out to a device — no address needed.",
        "image": "assets/panels/panel148_chapter_3_4_ports_eight_registers.svg",
        "year": "1943",
        "read": "נוסיף לזיכרון עוד 8 רגיסטרים שאליהם נוכל לחבר מכשירים מחוץ למחשב שיוכלו לכתוב ולקרוא מידע מהם. הם יהיו דומים לכרטיסי זיכרון רגילים, רק שבנוסף לכניסות והיציאות הרגילות יהיו להם עוד כניסות ויציאות שמאפשרות גישה ישירה לרגיסטרים, בלי כתובות - לכל רגיסטר בס משלו."
      },
      {
        "comment": "To the computer they are ordinary memory addresses; to the world they are a way in.",
        "image": "assets/panels/panel149_chapter_3_4_ports_part_of_memory.svg",
        "year": "1943",
        "read": "מבחינת המחשב שלנו הם יהיו חלק בלתי נפרד מהזיכרון, והוא יוכל לפנות אליהם עם כתובות כמו שהוא פונה לרגיסטרים האחרים, אבל הם יאפשרו לו לתקשר עם העולם החיצוני, בגלל שגם מכשירים אחרים יכולים לקרוא ולכתוב לשם."
      },
      {
        "comment": "The one difference the computer can feel: some of those registers are read-only, so two writers never collide.",
        "image": "assets/panels/panel150_chapter_3_4_ports_read_only.svg",
        "year": "1943",
        "read": "למעשה גם מבחינת המחשב שלנו יהיה הבדל קטן. לחלק מהרגיסטרים האלה לא נוכל לכתוב, אלא רק לקרוא, זאת מכיוון שאנחנו לא רוצים לאפשר לשני גורמים לכתוב בו זמנית לאותו רגיסטר. זה ייצור בלגן. אבל זה לא אמור להדאיג אותך, אם המחשב ינסה לכתוב לכתובת שאסור לו, אז פשוט לא יקרה כלום."
      },
      {
        "comment": "Wordless beat: von Neumann lays the 3.4 tasks note on the worktable (3.3's handover art).",
        "image": "assets/panels/panel151_chapter_3_4_ports_handover.svg",
        "year": "1943",
        "read": ""
      },
      {
        "comment": "Chapter 3.4 ports worktable: the same click-zones as panel141, but the tasks note opens the ports list (OPorts / IPorts / Ports / RAM). The REAL geometry lives in the panel SVG (hotspot-action-* rects, editable in Inkscape); the percentages below are only the fallback.",
        "image": "assets/panels/panel152_chapter_3_4_ports_worktable.svg",
        "year": "1943",
        "read": "",
        "hotspots": [
          { "ariaLabel": "פתק המשימות", "action": "ports-tasks-note", "left": 23, "top": 66, "width": 10, "height": 9 },
          { "ariaLabel": "קופסת הנעצים", "action": "nail-box", "left": 58, "top": 56, "width": 12, "height": 10 },
          { "ariaLabel": "הממיר העליון (בינרי לעשרוני)", "action": "arith-converter-in", "left": 1.5, "top": 45, "width": 10, "height": 7 },
          { "ariaLabel": "הממיר התחתון (עשרוני לבינרי)", "action": "arith-converter-out", "left": 0, "top": 52.5, "width": 15, "height": 11 },
          { "ariaLabel": "חוברת התרגילים", "action": "binary-booklet", "left": 58.4, "top": 73.7, "width": 11.4, "height": 11.5 },
          { "ariaLabel": "הקש על Nand", "action": "return-to-nand-dialog", "left": 39, "top": 59, "width": 18, "height": 24 },
          { "ariaLabel": "האגף הימני של הארגז החדש", "action": "buses-crate-right", "left": 47, "top": 40, "width": 8, "height": 12 },
          { "ariaLabel": "האגף השמאלי של הארגז החדש", "action": "buses-crate-left", "left": 55, "top": 40, "width": 8, "height": 12 }
        ]
      }
    ]
  },
  "production": {
    "id": "production",
    "title": "3.5 יצור",
    "type": "story",
    "chapterId": "chapter-14",
    "year": "1943",
    "panels": [
      {
        "comment": "3.5 opens where 3.4 did: von Neumann in the doorway (panel131 art). The design is finished; the machine does not exist.",
        "image": "assets/panels/panel153_chapter_3_5_production_intro.svg",
        "year": "1943",
        "read": "מצוין, עכשיו יש לנו את כל הזיכרון שאנחנו צריכים ביחד עם הפורטים. יש רק בעיה אחת, אין לנו אותו. יש לנו רק תכנון. כל פעם שאתה משתמש בכרטיס שכבר בנית, אתה רק מסמן, ומישהו צריך להרכיב. קודם היית יכול לדחוף את זה לאנשים שבונים מכונות חישוב בלי שהם ישימו לב. אבל פה מדובר בכרטיס עצום. הם ישימו לב..."
      },
      {
        "comment": "The move: a big roomy place, barely reachable — and there is a good reason for that.",
        "image": "assets/panels/panel154_chapter_3_5_production_move.svg",
        "year": "1943",
        "read": "אין ברירה, תצטרך לעשות את זה בעצמך. אתה לא תוכל להמשיך לעבוד כאן. אין כאן מספיק מקום. מצאתי מקום גדול ומרווח בשבילך. בקושי מגיעים לשם, כך שתוכל לעבוד בשקט בלי שישאלו אותך שאלות מיותרות. יש רק בעיה אחת. יש סיבה טובה למה בקושי מגיעים לשם, כך שנצטרך להיזהר."
      },
      {
        "comment": "Wordless: he leans in and lays the pen dosimeter on the table.",
        "image": "assets/panels/panel155_chapter_3_5_dosimeter_placed.svg",
        "year": "1943",
        "read": ""
      },
      {
        "comment": "The briefing: check the meter every few minutes, and what to do at 100 and at 200.",
        "image": "assets/panels/panel156_chapter_3_5_dosimeter_brief.svg",
        "year": "1943",
        "read": "קח את זה. כל כמה דקות תצטרך להציץ בעינית ולבדוק את המד. אם המספר שם מעל ל-100, תפסיק מיד הכול ולך הביתה עד למחרת. אם מאיזושהי סיבה הוא הגיע למקסימום (200), עזוב הכול ורוץ מיד אליי. אם אני לא במשרד, תבוא למגורים שלי. לא חשוב מה השעה. תעיר אותי אם צריך. בוא נקווה שזה לא יקרה."
      },
      {
        "comment": "The same picture without the speech: a click-zone over the dosimeter opens its reference window, whose 'לקחת' button walks on to the next slide. The zone's percentages were measured off the art: the pen lies at x 485-538, y 745-812 of 1448x1086, and the zone pads that.",
        "image": "assets/panels/panel157_chapter_3_5_dosimeter_pick.svg",
        "year": "1943",
        "read": "",
        "hotspots": [
          {
            "action": "panel-object",
            "objectId": "dosimeter",
            "ariaLabel": "תא עיפרון",
            "left": 32,
            "top": 65.5,
            "width": 9,
            "height": 11
          }
        ]
      },
      {
        "comment": "The dosimeter is taken, so the table is bare again (panel131 art).",
        "image": "assets/panels/panel158_chapter_3_5_lets_go.svg",
        "year": "1943",
        "read": "בוא נלך."
      },
      {
        "comment": "Wordless: where they were going — Project Y, Bldg. 1, behind the radiation-hazard signs.",
        "image": "assets/panels/panel159_chapter_3_5_project_y.svg",
        "year": "1943",
        "read": ""
      },
      {
        "comment": "Inside the hangar: room to build in, and the order of work — ports and frame first, then registers from address 0 up.",
        "image": "assets/panels/panel160_chapter_3_5_hangar_space.svg",
        "year": "1943",
        "read": "כמו שאתה רואה, יש כאן הרבה מקום. תוכל לבנות כאן את הזיכרון בנחת. אנסה להביא לך רגיסטרים מוכנים מדי פעם. אני אביא לך גם כונניות שתוכל לסדר עליהן את מה שאתה בונה. תתחיל מלבנות את הפורטים ואת המסגרת הכללית, ואז למלא אותה ברגיסטרים. תתחיל מכתובת 0 ותתקדם משם, כך שאם נראה שאנחנו לא יכולים לבנות הכול בזמן סביר, יהיה לנו זיכרון מתפקד קטן יותר, שנוכל להשתמש בו להדגמות, ובהמשך, כשנקבל עוד אנשים, נוכל להשלים אותו."
      },
      {
        "comment": "A second memory, for the program.",
        "image": "assets/panels/panel161_chapter_3_5_hangar_program_ram.svg",
        "year": "1943",
        "read": "ועוד דבר אחד. אנחנו צריכים זיכרון נוסף שעליו נשמור את התוכנה שלנו. אז אתה צריך לבנות עוד RAM1024 בשביל זה. גם כאן, אתה לא חייב לבנות את הכול, רק את המסגרת וכמה מאות רגיסטרים בהתחלה."
      },
      {
        "comment": "One day the two memories might become one — for now it is too complicated.",
        "image": "assets/panels/panel162_chapter_3_5_hangar_someday.svg",
        "year": "1943",
        "read": "אולי פעם נלמד לאחד את הזיכרונות, כדי שנוכל לתכנת את המחשב שלנו מתוך המחשב עצמו. בינתיים זה מסובך מדי."
      },
      {
        "comment": "The last warning: loud noises from the popy mean stop everything and come.",
        "image": "assets/panels/panel163_chapter_3_5_popy_warning.svg",
        "year": "1943",
        "read": "דבר אחרון. אם אתה שומע קולות חזקים מהפופי, תפסיק את מה שאתה עושה ותגיע אליי מיד."
      },
      {
        "comment": "Von Neumann has gone; the hangar is the learner's. Two reference click-zones: the radioactive-waste drums along the right wall, and the popy (a proportional counter) on the table. המשך from here ends the chapter on \"המשך יבוא...\".",
        "image": "assets/panels/panel164_chapter_3_5_hangar_objects.svg",
        "year": "1943",
        "read": "",
        "hotspots": [
          {
            "action": "panel-object",
            "objectId": "nuclearWaste",
            "ariaLabel": "פסולת גרעינית",
            "left": 55,
            "top": 31,
            "width": 35,
            "height": 22
          },
          {
            "action": "panel-object",
            "objectId": "nuclearWasteLeft",
            "ariaLabel": "פסולת גרעינית",
            "left": 5.4,
            "top": 38.4,
            "width": 10,
            "height": 11
          },
          {
            "action": "panel-object",
            "objectId": "popy",
            "ariaLabel": "פופי",
            "left": 5.3,
            "top": 57.1,
            "width": 25.6,
            "height": 30.3
          }
        ]
      }
    ]
  },
  "simple-computer": {
    "id": "simple-computer",
    "title": "4.1 מחשב פשוט",
    "type": "story",
    "chapterId": "chapter-15",
    "year": "1944",
    "panels": [
      {
        "comment": "4.1 opens on the desert title card: a few months have passed and the machine now stands.",
        "image": "assets/panels/panel63.svg",
        "year": "1944",
        "read": ""
      },
      {
        "comment": "4.1 opens in the finished computer room: the RAM shelves are wired and working.",
        "image": "assets/panels/panel165_chapter_4_1_memory_works.svg",
        "year": "1944",
        "read": "נהדר! יש לנו זיכרון מתפקד. זה בסדר שלא בנית את כל הרגיסטרים, זה יספיק לנו כדי להדגים יכולת. אחר כך יהיה לנו הרבה יותר קל להשלים את העבודה."
      },
      {
        "comment": "What is left: turning the ALU into a processor.",
        "image": "assets/panels/panel166_chapter_4_1_alu_to_cpu.svg",
        "year": "1944",
        "read": "יש לנו גם ALU שיכול לעשות חישובים רבים. מה שנשאר עכשיו זה להפוך את ה-ALU למעבד. המעבד יוכל לא רק לעשות חישובים אלא גם לכתוב בזיכרון את התוצאה וגם לקרוא ממנו את הפקודה הבאה שהוא צריך לעשות."
      },
      {
        "comment": "The fetch-execute cycle: processor and memory feed each other, forever.",
        "image": "assets/panels/panel167_chapter_4_1_fetch_execute.svg",
        "year": "1944",
        "read": "המעבד והזיכרון יהיו מחוברים באופן קבוע ויזינו אחד את השני. יחד הם יהוו את המחשב שלנו. הם יפעלו במחזור פעולה: המעבד קורא מהזיכרון פקודה המעבד מבצע את הפקודה וחוזר חלילה. זה יאפשר לנו לבצע תוכנות ארוכות ומסובכות שיהיו בזיכרון המחשב."
      },
      {
        "comment": "An instruction is nothing but a 16-bit word — the machine understands nothing else.",
        "image": "assets/panels/panel168_chapter_4_1_instructions_are_bits.svg",
        "year": "1944",
        "read": "שים לב. הפקודות שאנחנו מדברים עליהן הן למעשה רצפי ביטים. המכונות שלנו לא מבינות שום דבר אחר. מכיוון שקבענו שהיחידה הבסיסית של המחשב שלנו תהיה 16 ביטים, גם הפקודות שלנו יהיו 16 ביטים."
      },
      {
        "comment": "The memory splits in two: data memory (the RAM he built) and program memory.",
        "image": "assets/panels/panel169_chapter_4_1_two_memories.svg",
        "year": "1944",
        "read": "הפקודות יהיו רשומות בזיכרון. כדי להקל על העבודה, הזיכרון שלנו יהיה מחולק ל-2 חלקים: זיכרון דאטה (בקיצור \"הזיכרון\") — זה כרטיס ה-RAM שבנית — הוא יכיל את המידע שעליו אנחנו רוצים לבצע את החישובים זיכרון תוכנה — זה יהיה עוד כרטיס RAM1024 שעליו תישמר רשימת הפקודות"
      },
      {
        "comment": "Program memory is read-only to the computer; we write it from the outside.",
        "image": "assets/panels/panel170_chapter_4_1_program_memory_readonly.svg",
        "year": "1944",
        "read": "המחשב שלנו לא יוכל לכתוב לזיכרון התוכנה, אלא רק לקרוא ממנו. אנחנו נוכל לכתוב לזיכרון התוכנה מבחוץ וכך נוכל לתכנת את המחשב שלנו לעשות מה שנרצה. אולי בעתיד נאפשר למחשב לכתוב לזיכרון התוכנה וכך נוכל לתכנת אותו מתוך המחשב עצמו."
      },
      {
        "comment": "The word 'processor', and why CPU is a slightly silly name here.",
        "image": "assets/panels/panel171_chapter_4_1_cpu_name.svg",
        "year": "1944",
        "read": "למעבד קוראים באנגלית processor. לפעמים גם קוראים לו CPU שהם ראשי תיבות של central processing unit — יחידת עיבוד מרכזית. זה שם לא ממש רלוונטי בשבילנו, כי זה לא שיש לנו עוד יחידות עיבוד, אבל נשתמש בו מדי פעם כי הוא קצר."
      },
      {
        "comment": "The processor's three parts.",
        "image": "assets/panels/panel172_chapter_4_1_cpu_parts.svg",
        "year": "1944",
        "read": "המעבד יהיה מורכב מ-3 חלקים: ה-ALU רגיסטרים יחידת בקרה"
      },
      {
        "comment": "Its three registers, by name.",
        "image": "assets/panels/panel173_chapter_4_1_cpu_registers.svg",
        "year": "1944",
        "read": "המעבד יכיל 3 רגיסטרים: A D PC"
      },
      {
        "comment": "Why more registers when the memory already holds a thousand: an address is a detour.",
        "image": "assets/panels/panel174_chapter_4_1_why_registers.svg",
        "year": "1944",
        "read": "אתה בטח רוצה לשאול למה אנחנו צריכים עוד רגיסטרים כשיש לנו כבר יותר מ-1000 רגיסטרים בזיכרון. העניין הוא שכדי לפנות לרגיסטר בזיכרון אנחנו צריכים כתובת, מה שמסבך את הפנייה. הרגיסטרים של המעבד מחוברים באופן ישיר לאן שהם צריכים להיות מחוברים ולכן קל בהרבה לטפל בהם."
      },
      {
        "comment": "\"Where is the data?\" is itself data — and it has to stop somewhere.",
        "image": "assets/panels/panel175_chapter_4_1_where_is_the_data.svg",
        "year": "1944",
        "read": "הם מאפשרים לנו לשמור מידע בלי לשמור גם איפה הוא נמצא. במידה מסוימת זה הכרחי, כי \"איפה המידע נמצא?\" זה גם מידע שגם אותו צריך לשמור איפשהו, ואם נצטרך לשמור איפה המידע הזה נמצא אז לא יהיה לדבר סוף."
      },
      {
        "comment": "What each of A, D and PC is for.",
        "image": "assets/panels/panel176_chapter_4_1_register_roles.svg",
        "year": "1944",
        "read": "לכל רגיסטר של המעבד יהיה תפקיד מוגדר למדי: רגיסטר A יכיל כתובת בזיכרון הדאטה שאליה נרצה לכתוב וממנה נרצה לקרוא. אנחנו גם נשתמש בו לעוד דברים רגיסטר D יכיל מידע שהמעבד יוכל לעבוד עליו באופן ישיר הרגיסטר PC יכיל את הכתובת בזיכרון התוכנה של הפקודה אותה המעבד צריך לבצע"
      },
      {
        "comment": "The control unit is the one that 'knows'.",
        "image": "assets/panels/panel177_chapter_4_1_control_unit.svg",
        "year": "1944",
        "read": "יחידת הבקרה היא זאת שתפקח על פעולת המעבד. היא \"תדע\" לאן לרשום את תוצאת הפעולה של ה-ALU ומה הפקודה הבאה שצריך לבצע."
      },
      {
        "comment": "First a simpler computer — a base for changes, not a component.",
        "image": "assets/panels/panel178_chapter_4_1_simple_first.svg",
        "year": "1944",
        "read": "לבנות את המחשב זו משימה מורכבת. לכן בשלב הראשון נתחיל מגרסה פשוטה יותר של המחשב. היא לא תוכל לבצע כל חישוב אבל היא תהיה טובה בתור התחלה. אנחנו לא נשתמש בה בתור רכיב של המחשב שלנו אלא בתור בסיס לשינויים."
      },
      {
        "comment": "The instruction layout: 16 cells, cut 12 + 2 + 2.",
        "image": "assets/panels/panel179_chapter_4_1_instruction_layout.svg",
        "year": "1944",
        "read": "הנה מבנה הפקודה של המחשב הפשוט:",
        "instruction": {
          "bits": ""
        }
      },
      {
        "comment": "The first 12 bits are the ALU's own instruction; its three inputs are wired for good.",
        "image": "assets/panels/panel180_chapter_4_1_alu_field.svg",
        "year": "1944",
        "read": "12 הביטים הראשונים הם ההוראה ל-ALU. אתה זוכר של-ALU שלנו יש 3 כניסות (לא כולל את ההוראות). אנחנו נחבר את הכניסות האלה באופן קבוע לשלושת הבסים שמכילים את הדברים הבאים: התוכן של רגיסטר D (נסמן אותו ב-D) התוכן של רגיסטר A (נסמן אותו ב-A) התוכן של הרגיסטר בזיכרון שכתובתו היא התוכן של A (נסמן אותו ב-*A)",
        "instruction": {
          "bits": "",
          "lit": [
            1,
            12
          ]
        }
      },
      {
        "comment": "The next 2 bits: where the result is written (0-3).",
        "image": "assets/panels/panel181_chapter_4_1_dest_field.svg",
        "year": "1944",
        "read": "2 הביטים הבאים אומרים לאן אנחנו רושמים את התוצאה של חישוב ה-ALU. הם מייצגים מספר בינרי בין 0 ל-3 שלפיו מחליטים: 0. לא רושמים כלל. סתם מחשבים ומתעלמים מהתוצאה. פקודה מיותרת אבל אפשרית 1. D 2. A 3. *A",
        "instruction": {
          "bits": "",
          "lit": [
            13,
            14
          ]
        }
      },
      {
        "comment": "The last 2 bits are ignored in the simple computer.",
        "image": "assets/panels/panel182_chapter_4_1_unused_field.svg",
        "year": "1944",
        "read": "משני הביטים האחרונים נתעלם. אנחנו לא צריכים אותם במחשב הפשוט.",
        "instruction": {
          "bits": "",
          "lit": [
            15,
            16
          ]
        }
      },
      {
        "comment": "Example 1: add D and A, write the result into A.",
        "image": "assets/panels/panel183_chapter_4_1_example_add.svg",
        "year": "1944",
        "read": "אתן לך כמה דוגמאות: הפקודה הזאת אומרת: חבר את D עם A וכתוב את התוצאה ל-A",
        "instruction": {
          "bits": "1000000100001000"
        }
      },
      {
        "comment": "Bit 1: the ALU computes.",
        "image": "assets/panels/panel184_chapter_4_1_example_add_compute_bit.svg",
        "year": "1944",
        "read": "הביט הזה אומר שה-ALU צריך לבצע חישוב.",
        "instruction": {
          "bits": "1000000100001000",
          "lit": [
            1,
            1
          ]
        }
      },
      {
        "comment": "Bits 7-12: addition.",
        "image": "assets/panels/panel185_chapter_4_1_example_add_op_bits.svg",
        "year": "1944",
        "read": "ששת הביטים האלה מסמנים חיבור.",
        "instruction": {
          "bits": "1000000100001000",
          "lit": [
            7,
            12
          ]
        }
      },
      {
        "comment": "Bit 6: operate on the ALU's first two inputs — D and A.",
        "image": "assets/panels/panel186_chapter_4_1_example_add_input_bit.svg",
        "year": "1944",
        "read": "הביט הזה אומר שאנחנו פועלים על שתי הכניסות הראשונות של ה-ALU, הלא הן D ו-A.",
        "instruction": {
          "bits": "1000000100001000",
          "lit": [
            6,
            6
          ]
        }
      },
      {
        "comment": "All 12 together: \"add D and A\".",
        "image": "assets/panels/panel187_chapter_4_1_example_add_alu.svg",
        "year": "1944",
        "read": "יחד 12 הביטים האלה הם ההוראה של ה-ALU: \"חבר את D ו-A\".",
        "instruction": {
          "bits": "1000000100001000",
          "lit": [
            1,
            12
          ]
        }
      },
      {
        "comment": "Bits 13-14: write the answer into A.",
        "image": "assets/panels/panel188_chapter_4_1_example_add_dest.svg",
        "year": "1944",
        "read": "2 הביטים האלה אומרים שאנחנו רושמים את התשובה ל-A.",
        "instruction": {
          "bits": "1000000100001000",
          "lit": [
            13,
            14
          ]
        }
      },
      {
        "comment": "Example 2: put the number 1025 into D.",
        "image": "assets/panels/panel189_chapter_4_1_example_num.svg",
        "year": "1944",
        "read": "עוד דוגמה: הפקודה הזאת אומרת: שים את המספר 1025 ב-D",
        "instruction": {
          "bits": "0100000000010100"
        }
      },
      {
        "comment": "Bit 1 = 0: the ALU computes nothing, it just emits its instruction.",
        "image": "assets/panels/panel190_chapter_4_1_example_num_literal_bit.svg",
        "year": "1944",
        "read": "הביט הזה אומר שה-ALU לא מחשב כלום אלא מוציא את ההוראות שלו כפלט.",
        "instruction": {
          "bits": "0100000000010100",
          "lit": [
            1,
            1
          ]
        }
      },
      {
        "comment": "Bits 2-12 spell 1025.",
        "image": "assets/panels/panel191_chapter_4_1_example_num_value_bits.svg",
        "year": "1944",
        "read": "הביטים האלה הם המספר 1025.",
        "instruction": {
          "bits": "0100000000010100",
          "lit": [
            2,
            12
          ]
        }
      },
      {
        "comment": "All 12 together: \"emit the number 1025\".",
        "image": "assets/panels/panel192_chapter_4_1_example_num_alu.svg",
        "year": "1944",
        "read": "יחד 12 הביטים האלה הם ההוראה של ה-ALU: \"הוצא את המספר 1025\".",
        "instruction": {
          "bits": "0100000000010100",
          "lit": [
            1,
            12
          ]
        }
      },
      {
        "comment": "Bits 13-14: write the answer into D.",
        "image": "assets/panels/panel193_chapter_4_1_example_num_dest.svg",
        "year": "1944",
        "read": "2 הביטים האלה אומרים שאנחנו רושמים את התשובה ל-D.",
        "instruction": {
          "bits": "0100000000010100",
          "lit": [
            13,
            14
          ]
        }
      },
      {
        "comment": "Example 3: add D to the memory register addressed by A, back into it.",
        "image": "assets/panels/panel194_chapter_4_1_example_mem.svg",
        "year": "1944",
        "read": "עוד דוגמה: הפקודה הזאת אומרת: חבר את D עם *A וכתוב את התוצאה ל-*A",
        "instruction": {
          "bits": "1000010100001100"
        }
      },
      {
        "comment": "Bit 6 = 1: the first and the third input.",
        "image": "assets/panels/panel195_chapter_4_1_example_mem_input_bit.svg",
        "year": "1944",
        "read": "הביט הזה אומר שאנחנו פועלים על הכניסה הראשונה והשלישית של ה-ALU, הלא הן D ו-*A.",
        "instruction": {
          "bits": "1000010100001100",
          "lit": [
            6,
            6
          ]
        }
      },
      {
        "comment": "Bits 7-12: addition, the same six as in the first example.",
        "image": "assets/panels/panel196_chapter_4_1_example_mem_op_bits.svg",
        "year": "1944",
        "read": "ששת הביטים האלה מסמנים חיבור, בדיוק כמו בדוגמה הראשונה.",
        "instruction": {
          "bits": "1000010100001100",
          "lit": [
            7,
            12
          ]
        }
      },
      {
        "comment": "All 12 together.",
        "image": "assets/panels/panel197_chapter_4_1_example_mem_alu.svg",
        "year": "1944",
        "read": "יחד 12 הביטים האלה הם ההוראה של ה-ALU: \"חבר את D ו-*A\".",
        "instruction": {
          "bits": "1000010100001100",
          "lit": [
            1,
            12
          ]
        }
      },
      {
        "comment": "Bits 13-14 = 3: back into that same memory register.",
        "image": "assets/panels/panel198_chapter_4_1_example_mem_dest.svg",
        "year": "1944",
        "read": "שני הביטים האלה הם המספר 3, ולכן התשובה נרשמת ל-*A. שים לב ש-*A הוא גם אחת מהכניסות של החישוב וגם המקום שאליו נכתבת התוצאה.",
        "instruction": {
          "bits": "1000010100001100",
          "lit": [
            13,
            14
          ]
        }
      },
      {
        "comment": "Example 4: subtract A from D into D.",
        "image": "assets/panels/panel199_chapter_4_1_example_sub.svg",
        "year": "1944",
        "read": "דוגמה אחרונה: הפקודה הזאת אומרת: חסר את A מ-D וכתוב את התוצאה ל-D",
        "instruction": {
          "bits": "1000001100100100"
        }
      },
      {
        "comment": "Bit 6 = 0: the first two inputs again, D and A.",
        "image": "assets/panels/panel200_chapter_4_1_example_sub_input_bit.svg",
        "year": "1944",
        "read": "הביט הזה אומר שאנחנו פועלים שוב על שתי הכניסות הראשונות, D ו-A.",
        "instruction": {
          "bits": "1000001100100100",
          "lit": [
            6,
            6
          ]
        }
      },
      {
        "comment": "Bits 7-12 = 110010: subtraction, the code from the 2.6 demo.",
        "image": "assets/panels/panel201_chapter_4_1_example_sub_op_bits.svg",
        "year": "1944",
        "read": "ששת הביטים האלה מסמנים חיסור. אלה בדיוק הביטים 110010 שהכנסנו לכניסת הבקרה של ה-ALU כשהראיתי לך איך מחסרים. הסדר חשוב: הם מחסרים את הכניסה השנייה מהראשונה, כלומר את A מ-D.",
        "instruction": {
          "bits": "1000001100100100",
          "lit": [
            7,
            12
          ]
        }
      },
      {
        "comment": "All 12 together.",
        "image": "assets/panels/panel202_chapter_4_1_example_sub_alu.svg",
        "year": "1944",
        "read": "יחד 12 הביטים האלה הם ההוראה של ה-ALU: \"חסר את A מ-D\".",
        "instruction": {
          "bits": "1000001100100100",
          "lit": [
            1,
            12
          ]
        }
      },
      {
        "comment": "Bits 13-14: write the answer into D.",
        "image": "assets/panels/panel203_chapter_4_1_example_sub_dest.svg",
        "year": "1944",
        "read": "שני הביטים האלה אומרים שאנחנו רושמים את התשובה ל-D.",
        "instruction": {
          "bits": "1000001100100100",
          "lit": [
            13,
            14
          ]
        }
      },
      {
        "comment": "Enough theory — he does not expect it to click straight away.",
        "image": "assets/panels/panel208_chapter_4_1_dont_worry.svg",
        "year": "1944",
        "read": "טוב, נפסיק לחפור. אני לא מצפה שתבין את זה מיד. זה מסובך, אבל אם תשבור את הראש על זה מספיק אז תבין."
      },
      {
        "comment": "Before building it: we must be able to test it, which means knowing the answer first.",
        "image": "assets/panels/panel209_chapter_4_1_need_a_test.svg",
        "year": "1944",
        "read": "לפני שאנחנו מתחילים לבנות את המחשב הפשוט אנחנו צריכים להיות מסוגלים לבדוק אותו. הדרך לעשות את זה תהיה להכניס לו כמה פקודות ולוודא שהתוצאה היא מה שהיא צריכה להיות. בשביל זה אנחנו צריכים לדעת מה היא צריכה להיות."
      },
      {
        "comment": "Wordless: he leans in and lays a sheet of paper on the worktable.",
        "image": "assets/panels/panel210_chapter_4_1_paper_placed.svg",
        "year": "1944",
        "read": ""
      },
      {
        "comment": "The exercise: fill in the registers and the first three memory cells after each instruction.",
        "image": "assets/panels/panel211_chapter_4_1_the_exercise.svg",
        "year": "1944",
        "read": "יש לך כאן מספר פקודות, אתה צריך לכתוב לי ליד כל אחת מה היה רשום ברגיסטרים של המעבד וב-3 הרגיסטרים הראשונים של הזיכרון לאחר הפעלתה. זכור שהמצב ההתחלתי של כל הרגיסטרים הוא 0, ושהפקודות מבוצעות בזו אחר זו, כך שהן משפיעות אחת על השנייה. אל תטרח לכתוב מספרים בכתיב בינרי. אנחנו חושבים על כל רגיסטר כעל מספר, מספיק שתכתוב לי את הצורה העשרונית שלו."
      },
      {
        "comment": "He goes back to work, and lets slip what the other team is building.",
        "image": "assets/panels/panel212_chapter_4_1_back_to_work.svg",
        "year": "1944",
        "read": "טוב. אני חוזר לעבודה. החברה שעובדים על המנגנון השני עוקפים אותנו. אם יהיה לנו מחשב אלקטרוני, אנחנו נעקוף אותם. הם לא צריכים חישובים, רק המון צנטריפוגות. טוב, לא משנה, אני לא אמור לדבר איתך על זה..."
      },
      {
        "comment": "Wordless: von Neumann is gone; the room, the racks and the note are left behind.",
        "image": "assets/panels/panel213_chapter_4_1_empty_room.svg",
        "year": "1944",
        "read": "",
        "hotspots": [
          {
            "action": "panel-object",
            "objectId": "aluRack",
            "ariaLabel": "ארון ה-ALU",
            "left": 40.4,
            "top": 18.42,
            "width": 14.64,
            "height": 37.29
          },
          {
            "action": "panel-object",
            "objectId": "ramRack",
            "ariaLabel": "ארונות ה-RAM",
            "left": 59.05,
            "top": 15.84,
            "width": 40.95,
            "height": 46.04
          },
          {
            "action": "panel-object",
            "objectId": "aluIn1",
            "ariaLabel": "IN1 של ה-ALU",
            "left": 37.5,
            "top": 59.02,
            "width": 2.9,
            "height": 4.24
          },
          {
            "action": "panel-object",
            "objectId": "aluIn2",
            "ariaLabel": "IN2 של ה-ALU",
            "left": 40.4,
            "top": 59.67,
            "width": 2.9,
            "height": 4.24
          },
          {
            "action": "panel-object",
            "objectId": "aluIn3",
            "ariaLabel": "IN3 של ה-ALU",
            "left": 43.23,
            "top": 60.13,
            "width": 2.9,
            "height": 4.24
          },
          {
            "action": "panel-object",
            "objectId": "aluOut",
            "ariaLabel": "OUT של ה-ALU",
            "left": 45.99,
            "top": 60.5,
            "width": 2.9,
            "height": 4.24
          },
          {
            "action": "panel-object",
            "objectId": "aluInst",
            "ariaLabel": "INST של ה-ALU",
            "left": 48.62,
            "top": 60.68,
            "width": 2.9,
            "height": 4.24
          },
          {
            "action": "panel-object",
            "objectId": "aluFlags",
            "ariaLabel": "ng ו-zr של ה-ALU",
            "left": 50.69,
            "top": 62.62,
            "width": 3.31,
            "height": 4.42
          },
          {
            "action": "panel-object",
            "objectId": "ramIn",
            "ariaLabel": "IN של הזיכרון",
            "left": 53.31,
            "top": 77.44,
            "width": 3.87,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramAdr",
            "ariaLabel": "ADR של הזיכרון",
            "left": 56.63,
            "top": 77.99,
            "width": 4.14,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramOut",
            "ariaLabel": "OUT של הזיכרון",
            "left": 60.91,
            "top": 78.73,
            "width": 3.87,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramWrite",
            "ariaLabel": "כבל הבקרה של הזיכרון",
            "left": 64.78,
            "top": 77.44,
            "width": 2.76,
            "height": 9.21
          },
          {
            "action": "panel-object",
            "objectId": "ramIn0",
            "ariaLabel": "פורט כניסה IN0",
            "left": 68.99,
            "top": 78.82,
            "width": 3.59,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramIn1",
            "ariaLabel": "פורט כניסה IN1",
            "left": 72.03,
            "top": 79.56,
            "width": 3.59,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramIn2",
            "ariaLabel": "פורט כניסה IN2",
            "left": 76.31,
            "top": 80.66,
            "width": 3.73,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramIn3",
            "ariaLabel": "פורט כניסה IN3",
            "left": 79.9,
            "top": 81.22,
            "width": 3.45,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramOut0",
            "ariaLabel": "פורט יציאה OUT0",
            "left": 83.01,
            "top": 81.68,
            "width": 3.59,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramOut1",
            "ariaLabel": "פורט יציאה OUT1",
            "left": 87.09,
            "top": 82.14,
            "width": 3.73,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramOut2",
            "ariaLabel": "פורט יציאה OUT2",
            "left": 92.13,
            "top": 82.69,
            "width": 3.73,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramOut3",
            "ariaLabel": "פורט יציאה OUT3",
            "left": 95.99,
            "top": 83.43,
            "width": 3.73,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "nuclearWaste",
            "ariaLabel": "פסולת גרעינית",
            "left": 4.14,
            "top": 37.57,
            "width": 11.88,
            "height": 11.05
          },
          {
            "action": "panel-object",
            "objectId": "popy",
            "ariaLabel": "פופי",
            "left": 2.76,
            "top": 56.35,
            "width": 27.28,
            "height": 23.02
          },
          {
            "action": "panel-object",
            "objectId": "tasksNote",
            "ariaLabel": "הפתק",
            "left": 37.85,
            "top": 78.45,
            "width": 6.63,
            "height": 5.89
          },
          {
            "action": "panel-object",
            "objectId": "workArea",
            "ariaLabel": "איזור העבודה",
            "left": 43.0,
            "top": 66.5,
            "width": 10.5,
            "height": 9.5
          }
        ]
      }
    ]
  },
  "build-simple-computer": {
    "id": "build-simple-computer",
    "type": "story",
    "chapterId": "chapter-16",
    "year": "1944",
    "panels": [
      {
        "comment": "He will check the exercise himself too — an error there would hide an error in the machine.",
        "image": "assets/panels/panel214_chapter_4_1_checked_it.svg",
        "year": "1944",
        "read": "טוב מאוד. אנחנו נשתמש בזה כדי לבדוק את המחשב. אני מקווה מאוד שבדקת בשבע עיניים. אם יש לנו טעות לא נוכל לדעת מה קורה עם המחשב. אבדוק גם בעצמי ליתר ביטחון."
      },
      {
        "comment": "Wordless: he lays the second note — the build tasks — on the worktable.",
        "image": "assets/panels/panel215_chapter_4_1_tasks_placed.svg",
        "year": "1944",
        "read": ""
      },
      {
        "comment": "The tasks for building the simple computer, and back to his own work.",
        "image": "assets/panels/panel216_chapter_4_1_here_are_the_tasks.svg",
        "year": "1944",
        "read": "הנה המשימות לבניית המחשב הפשוט. אני חוזר לעבודה."
      },
      {
        "comment": "Wordless: the room again, with the note of build tasks on the table.",
        "image": "assets/panels/panel217_chapter_4_1_build_room.svg",
        "year": "1944",
        "read": "",
        "hotspots": [
          {
            "action": "panel-object",
            "objectId": "aluRack",
            "ariaLabel": "ארון ה-ALU",
            "left": 40.4,
            "top": 18.42,
            "width": 14.64,
            "height": 37.29
          },
          {
            "action": "panel-object",
            "objectId": "ramRack",
            "ariaLabel": "ארונות ה-RAM",
            "left": 59.05,
            "top": 15.84,
            "width": 40.95,
            "height": 46.04
          },
          {
            "action": "panel-object",
            "objectId": "aluIn1",
            "ariaLabel": "IN1 של ה-ALU",
            "left": 37.5,
            "top": 59.02,
            "width": 2.9,
            "height": 4.24
          },
          {
            "action": "panel-object",
            "objectId": "aluIn2",
            "ariaLabel": "IN2 של ה-ALU",
            "left": 40.4,
            "top": 59.67,
            "width": 2.9,
            "height": 4.24
          },
          {
            "action": "panel-object",
            "objectId": "aluIn3",
            "ariaLabel": "IN3 של ה-ALU",
            "left": 43.23,
            "top": 60.13,
            "width": 2.9,
            "height": 4.24
          },
          {
            "action": "panel-object",
            "objectId": "aluOut",
            "ariaLabel": "OUT של ה-ALU",
            "left": 45.99,
            "top": 60.5,
            "width": 2.9,
            "height": 4.24
          },
          {
            "action": "panel-object",
            "objectId": "aluInst",
            "ariaLabel": "INST של ה-ALU",
            "left": 48.62,
            "top": 60.68,
            "width": 2.9,
            "height": 4.24
          },
          {
            "action": "panel-object",
            "objectId": "aluFlags",
            "ariaLabel": "ng ו-zr של ה-ALU",
            "left": 50.69,
            "top": 62.62,
            "width": 3.31,
            "height": 4.42
          },
          {
            "action": "panel-object",
            "objectId": "ramIn",
            "ariaLabel": "IN של הזיכרון",
            "left": 53.31,
            "top": 77.44,
            "width": 3.87,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramAdr",
            "ariaLabel": "ADR של הזיכרון",
            "left": 56.63,
            "top": 77.99,
            "width": 4.14,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramOut",
            "ariaLabel": "OUT של הזיכרון",
            "left": 60.91,
            "top": 78.73,
            "width": 3.87,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramWrite",
            "ariaLabel": "כבל הבקרה של הזיכרון",
            "left": 64.78,
            "top": 77.44,
            "width": 2.76,
            "height": 9.21
          },
          {
            "action": "panel-object",
            "objectId": "ramIn0",
            "ariaLabel": "פורט כניסה IN0",
            "left": 68.99,
            "top": 78.82,
            "width": 3.59,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramIn1",
            "ariaLabel": "פורט כניסה IN1",
            "left": 72.03,
            "top": 79.56,
            "width": 3.59,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramIn2",
            "ariaLabel": "פורט כניסה IN2",
            "left": 76.31,
            "top": 80.66,
            "width": 3.73,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramIn3",
            "ariaLabel": "פורט כניסה IN3",
            "left": 79.9,
            "top": 81.22,
            "width": 3.45,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramOut0",
            "ariaLabel": "פורט יציאה OUT0",
            "left": 83.01,
            "top": 81.68,
            "width": 3.59,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramOut1",
            "ariaLabel": "פורט יציאה OUT1",
            "left": 87.09,
            "top": 82.14,
            "width": 3.73,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramOut2",
            "ariaLabel": "פורט יציאה OUT2",
            "left": 92.13,
            "top": 82.69,
            "width": 3.73,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "ramOut3",
            "ariaLabel": "פורט יציאה OUT3",
            "left": 95.99,
            "top": 83.43,
            "width": 3.73,
            "height": 5.34
          },
          {
            "action": "panel-object",
            "objectId": "nuclearWaste",
            "ariaLabel": "פסולת גרעינית",
            "left": 4.14,
            "top": 37.57,
            "width": 11.88,
            "height": 11.05
          },
          {
            "action": "panel-object",
            "objectId": "popy",
            "ariaLabel": "פופי",
            "left": 2.76,
            "top": 56.35,
            "width": 27.28,
            "height": 23.02
          },
          {
            "action": "panel-object",
            "objectId": "buildNote",
            "ariaLabel": "הפתק",
            "left": 37.85,
            "top": 78.45,
            "width": 6.63,
            "height": 5.89
          },
          {
            "action": "panel-object",
            "objectId": "workArea",
            "ariaLabel": "איזור העבודה",
            "left": 43.0,
            "top": 66.5,
            "width": 10.5,
            "height": 9.5
          }
        ]
      }
    ]
  }
};

const END_DIALOGS = {
  "helpPrompt": {
    "size": "small",
    "ariaLabel": "בקשת עזרה",
    "title": "האם אתה מסכים לעזור"
  },
  "helpRefusal": {
    "size": "large",
    "ariaLabel": "סירוב לעזור",
    "paragraphs": [
      "חבל מאוד. פון-נוימן לא יצליח לבנות את המחשב לבד בזמן הפרויקט. את הפצצה הגרעינית הם יצליחו לבנות, אבל מאוחר מדי. גרמניה הנאצית תיכנע כמה חודשים קודם לכן, אבל לא לפני שהיא תהרוס את אירופה ותרצח כמעט את כל היהודים בה. חלק גדול מהיהודים נרצחו ממש בחודשים האחרונים של המלחמה. אם הפצצה הייתה מוכנה שנה קודם לכן, מותם היה נמנע.",
      "בסופו של דבר הצליח פון-נוימן לממש את החזון של בבג', טיורינג ושלו, ובנה מחשב אלקטרוני. אבל זה לקח עוד 10 שנים. המחשבים האלקטרוניים לא רק החליפו את המחשבים האנושיים, הם הפכו לאחד הכלים המרכזיים בעולם המודרני. מלבד המחשבים האישיים המקיפים אותנו, היום יש מחשבים כמעט בכל מכשיר אלקטרוני. אפשר רק לדמיין איפה היינו היום אם המהפכה הזאת הייתה קורה 10 שנים קודם.",
      "אבל הי, כנראה שיש לך דברים יותר חשובים לעשות...",
      "או שאולי לא..., האם תרצה לשנות את דעתך?"
    ]
  },
  "returnToNandPrompt": {
    "size": "small",
    "ariaLabel": "חזרה אל Nand",
    "title": "היי, אתה כבר מכיר אותי. רוצה לשמוע עליי שוב?"
  }
};

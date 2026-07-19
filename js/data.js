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
  }
];

const CHAPTERS = [
  {
    "id": "chapter-1",
    "partId": "part-1",
    "title": "1.1 המכתב",
    "sceneId": "einstein-letter"
  },
  {
    "id": "chapter-2",
    "partId": "part-1",
    "title": "1.2 הפרויקט",
    "sceneId": "berkeley-1942"
  },
  {
    "id": "chapter-3",
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
        "read": "סילארד: אתה יודע על מה! אנשים קוראים את המאמר שכתבתי לפני 5 שנים. האן ושטרסמן עשו ניסויים עם אורניום, שהוכיחו שהוא מתבקע. היזנברג חושב על זה. נילס בור כתב לי שהיזנברג נפגש איתו ושאל שאלות. נילס כמובן נפנף אותו, אבל אתה יודע שהיזנברג לא טיפש."
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
        "read": "סילארד: אתה יודע שאני שותף לחזון שלך של ממשלה עולמית, אבל אני מדבר איתך על המציאות, לא על החזון. אתה לימדת אותנו שהכול יחסי. השאלה היא לא האם אתה סומך על ארצות הברית, אלא על מי אתה סומך יותר: על רוזבלט וממשלת ארצות הברית או על היטלר והממשלה של גרמניה הנאצית. אני לא חושב שזאת שאלה קשה..."
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
        "read": "רוזבלט: שלום פרופסור אופנהיימר, מדבר הנשיא רוזבלט."
      },
      {
        "image": "assets/panels/panel36.svg",
        "read": "אופנהיימר: כן, אדוני הנשיא."
      },
      {
        "image": "assets/panels/panel37.svg",
        "read": "רוזבלט: המולדת צריכה שתנהל עבורה פרויקט לאומי בעל חשיבות עליונה."
      },
      {
        "image": "assets/panels/panel38.svg",
        "read": "אופנהיימר: במה מדובר, אדוני הנשיא?"
      },
      {
        "image": "assets/panels/panel39.svg",
        "read": "רוזבלט: אני לא יכול להגיד את זה בטלפון, אתה תקבל את כל הפרטים עם שליח, אבל אתה צריך להתחייב לשמור על סודיות מוחלטת."
      },
      {
        "image": "assets/panels/panel40.svg",
        "read": "אופנהיימר: אמ.."
      },
      {
        "image": "assets/panels/panel41.svg",
        "read": "רוזבלט: אתה תוכל כמובן לסרב, אבל לא תוכל לדבר על זה עם איש."
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
        "read": "אופנהיימר: לעזאזל עם רוזבלט, לעזאזל עם איינשטיין, לעזאזל עם סילארד, ולעזאזל איתי. כולנו בני כלבות.",
        "youngRead": "אופנהיימר: לעזאזל עם רוזבלט, לעזאזל עם איינשטיין, לעזאזל עם סילארד, ולעזאזל איתי."
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
        "read": "פון נוימן: תפסיק עם הפורמליות. אני יודע בדיוק על מה מדובר. מי אתה חושב שכנע את סילארד לדבר עם איינשטיין? אתה יודע כמה הייתי צריך לחפור לו? אתם והגישה הפציפיסטית שלכם הביאו אותנו לברוך הזה. אני שמח שסוף סוף התעשתתם. בטח שאשמח לעזור. זה או אנחנו או היטלר או סטלין. אני מעדיף שזה יהיה אנחנו. זה לא ממש התחום שלי, אבל אני יכול לנסות."
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
        "read": "פון נוימן: כל חישוב לוקח ימים כי הם צריכים לבנות את המכונה מחדש, לכל חישוב בנפרד. זה לא צריך להיות כך. לא באמצע המאה ה-20. בבג' הבין את זה עוד במאה הקודמת. אפשר לבנות מכונה אחת שתוכל לבצע כל חישוב. גם טיורינג כתב על זה לפני כמה שנים. בבג' היו רק גלגלי שיניים אז הוא לא הצליח לבנות את המכונה הזאת. אבל לנו יש טריודות מבוססות שפורפרות ריק. אנחנו יכולים לעשות את זה. אנחנו חייבים לעשות את זה."
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
        "image": "assets/panels/panel80.svg",
        "read": "נאנד: עכשיו, בשנת 1943, אני די גדול, אבל בעוד מספר שנים יופיעו טריודות חדשות, שמבוססות על מוליכים למחצה ולא על שפורפרות ריק. הן נקראות טרנזיסטורים. הן הרבה יותר קטנות, כך שגם אני אקטן בהרבה, ואהפוך גם למהיר בהרבה. עם השנים אני אהפוך לקטן ומהיר עוד יותר, כך שעד סוף המאה ה-20 אני אהיה כל כך קטן שאפשר יהיה לראות אותי רק במיקרוסקופ. זה חשוב, כי צריך אלפים ממני כדי לבנות מחשב פשוט, ומיליונים בשביל מחשב של המאה ה-21."
      },
      {
        "image": "assets/panels/panel81.svg",
        "read": "נאנד: היום, כדי להרכיב ממספר Nand-ים רכיב אלקטרוני, צריך לסדר אותנו על גבי כרטיס ולהלחים. עוד מספר עשורים יהיה אפשר לייצר — בעצם להדפיס — אלפים או אפילו מיליונים ממני בבת אחת, מחוברים יחד לפי תכנון מראש וארוזים בקופסה קטנה שנקראת צ'יפ. את הצ'יפים האלה ירכיבו על כרטיסים, ומהם יבנו מחשבים."
      },
      {
        "image": "assets/panels/panel82.svg",
        "femaleImage": "assets/panels/panel82_girl.svg",
        "read": "נאנד: רוצה לדעת מה אני עושה? תנסה לחבר חלק מהכניסות שלי למקור מתח ואת היציאה למנורה. רק אל תתבלבל ביניהן. זה יכול לשרוף אותי.",
        "femaleRead": "נאנד: רוצה לדעת מה אני עושה? תנסי לחבר חלק מהכניסות שלי למקור מתח ואת היציאה למנורה. רק אל תתבלבלי ביניהן. זה יכול לשרוף אותי.",
        "workspaceLaunch": true
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
        "read": "פון נוימן: אנחנו רוצים שהמחשב שלנו יוכל לעשות פעולות שונות. לכן אנחנו רוצים להיות מסוגלים להגיד לו לבחור בין אפשרויות. בשביל זה נבנה שני כרטיסים מיוחדים. בסופו של דבר מדובר בכרטיסים שעושים חישוב רגיל, כמו אלה שכבר בנית. אפשר אפילו לכתוב להם טבלת אמת, אבל הם יאפשרו לנו לבחור בין תוצאות חישוב שונות, או להפעיל כרטיסים שונים, כאילו יש שם איש קטן שמחבר כבלים שונים לפי מה שאומרים לו."
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
        "read": "נכון. עם 10 ביטים אפשר לייצג 1024 מספרים שזה בערך 1000. לאחר מכן כל ביט מכפיל פי-2, לכן עם 15 ביטים אפשר לייצג בערך 32,000 מספרים, שזה עוד לא מספיק לנו. אבל עם 16 ביטים אפשר לייצג 64,000 מספרים שזה כבר סבבה לבינתיים.",
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
        "read": "יש רק בעיה קטנה אחת: סכום של שני מספרים 16 ספרתיים הוא לעיתים 17 ספרתי. אנחנו נתעלם מהספרה המובילה, כי במחשב כל החיבורים קבועים, ואנחנו לא יכולים להרחיב אותם בלי די. כל עוד כל המספרים המעורבים (כולל התוצאה) לא יעלו על 64,000, זה יהיה בסדר. אם נעבור את הגודל המותר זה יוביל לתקלה שנקראת גלישה נומרית. ננסה להימנע מזה..."
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
          { "ariaLabel": "חוברת התרגילים", "action": "binary-booklet", "left": 58.4, "top": 73.7, "width": 11.4, "height": 11.5 },
          { "ariaLabel": "הקש על Nand", "action": "return-to-nand-dialog", "left": 39, "top": 59, "width": 18, "height": 24 },
          { "ariaLabel": "האגף הימני של הארגז החדש", "action": "buses-crate-right", "left": 47, "top": 40, "width": 8, "height": 12 },
          { "ariaLabel": "האגף השמאלי של הארגז החדש", "action": "buses-crate-left", "left": 55, "top": 40, "width": 8, "height": 12 }
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
      "בסופו של דבר הצליח פון-נוימן לממש את החזון של בבג', טיורינג ושלו, ובנה מחשב אלקטרוני. אבל זה לקח עוד 10 שנים. המחשבים האלקטרוניים לא רק החליפו את המחשבים האנושיים, הם הפכו לאחד הכלים המרכזיים בעולם המודרני. מלבד המחשבים האישיים המקיפים אותנו, היום יש מחשבים כמעט בכל מכשיר אלקטרוני. אפשר רק לדמיין איפה היינו היום אם המהפכה הזאת הייתה קורית 10 שנים קודם.",
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

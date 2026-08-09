# סנכרון העותק המקומי (git pull שנתקע)

הפיתוח כולו נעשה בענף `claude/github-project-editing-bw3mcp` ונדחף אליו.
העותק שלך על המחשב אמור רק *למשוך* משם. אם `git pull` נכשל עם

```
error: Pulling is not possible because you have unmerged files.
fatal: Exiting because of an unresolved conflict.
```

זה אומר שיש בעותק המקומי שלך מיזוג שנתקע באמצע. הנה מה לעשות, שלב-שלב.

---

## הדרך הקצרה — בלוק אחד להעתיק ולהדביק

פתח טרמינל, היכנס לתיקיית הפרויקט (`cd <התיקייה שבה שמור TheOneMachine>`),
והדבק את כל הבלוק הזה בבת אחת:

```bash
git merge --abort 2>/dev/null; git rebase --abort 2>/dev/null; \
git fetch origin claude/github-project-editing-bw3mcp && \
git reset --hard FETCH_HEAD && \
git checkout -B claude/github-project-editing-bw3mcp origin/claude/github-project-editing-bw3mcp && \
git branch --set-upstream-to=origin/claude/github-project-editing-bw3mcp && \
git log --oneline -1
```

בסוף תודפס שורה אחת עם הקומיט האחרון — זה סימן שהכול הסתדר.

**שים לב:** הבלוק הזה **מוחק שינויים מקומיים** שלא נדחפו. אם כתבת משהו
בעצמך בעותק המקומי וחשוב לך לשמור אותו, הרץ קודם `git status --short`
והעתק את הקבצים לתיקייה מחוץ לפרויקט.

מכאן והלאה, כדי למשוך עדכונים:

```bash
git pull origin claude/github-project-editing-bw3mcp
```

---

## הדרך הארוכה — שלב אחרי שלב

### שלב 1 — לראות מה קורה (לא משנה כלום)

פתח טרמינל, והיכנס לתיקייה של הפרויקט:

```
cd <התיקייה שבה שמור TheOneMachine>
```

הרץ:

```
git status
```

תראה רשימה. שים לב לשתי שורות:

* `You have unmerged paths` — יש מיזוג תקוע.
* מתחת ל-`Unmerged paths:` — רשימת הקבצים שנתקעו.

ואז הרץ:

```
git branch -vv
```

השורה שמתחילה בכוכבית `*` היא הענף שאתה נמצא עליו, ובסוגריים המרובעים
כתוב לאיזה ענף מרוחק הוא "מחובר". **הוא חייב להיות
`origin/claude/github-project-editing-bw3mcp`.** אם כתוב שם
`origin/claude/continue-dev-branch-uleqf0` — זה הענף המת, וזאת הסיבה
שדברים מתנגשים.

---

### שלב 2 — לבטל את המיזוג התקוע

```
git merge --abort
```

אם הפקודה הזאת מחזירה שגיאה שאומרת שאין מיזוג בעיצומו, נסה במקומה:

```
git rebase --abort
```

ואם גם זה נכשל, זה בסדר — פשוט המשך לשלב הבא.

---

### שלב 3 — לוודא שאין לך עבודה מקומית שחבל עליה

```
git status --short
```

* אם לא הודפס **כלום** — אין לך שינויים מקומיים, אפשר להמשיך בשקט.
* אם כן הודפסו שורות (`M` = קובץ ששונה, `??` = קובץ חדש) — אלה שינויים
  שקיימים רק אצלך. השלב הבא ימחק אותם. אם משהו שם חשוב לך, העתק אותו
  קודם לתיקייה אחרת מחוץ לפרויקט.

---

### שלב 4 — למשוך מחדש את הענף הנכון

```
git fetch origin claude/github-project-editing-bw3mcp
git checkout -B claude/github-project-editing-bw3mcp origin/claude/github-project-editing-bw3mcp
git reset --hard origin/claude/github-project-editing-bw3mcp
```

בסוף אמורה להופיע שורה שמתחילה ב-`HEAD is now at` ואחריה ההודעה של
הקומיט האחרון. זה סימן שהכול הסתדר.

---

### שלב 5 — לתקן את החיבור לענף, כדי שזה לא יקרה שוב

```
git branch --set-upstream-to=origin/claude/github-project-editing-bw3mcp claude/github-project-editing-bw3mcp
```

מעכשיו `git pull` סתם ימשוך מהענף הנכון.

**עדיף בכל זאת למשוך תמיד במפורש:**

```
git pull origin claude/github-project-editing-bw3mcp
```

---

## תקלה אחרת: `Permission denied` בזמן `git pull`

אם `git pull` נכשל עם משהו כזה:

```
error: unable to write file .git/objects/6a/1f00f7cb8be2...: Permission denied
fatal: failed to write object
fatal: unpack-objects failed
```

זו **לא** בעיה בענף ולא בשרת. גיט הוריד את הקבצים בהצלחה ונכשל רק כשניסה
לכתוב אותם לתיקייה `.git/objects` שבעותק המקומי שלך — כלומר אין לך הרשאת
כתיבה שם. הסיבה כמעט תמיד אחת: בשלב כלשהו הורצה פקודת גיט עם `sudo`,
ומאז חלק מהקבצים בתוך `.git` שייכים למשתמש `root` ולא לך.

### הדרך הקצרה — בלוק אחד להעתיק ולהדביק (macOS / Linux)

פתח טרמינל, היכנס לתיקיית הפרויקט (`cd <התיקייה שבה שמור TheOneMachine>`),
והדבק את כל הבלוק. הוא יבקש ממך את סיסמת המחשב שלך (זה מה ש-`sudo` עושה):

```bash
sudo chown -R "$(id -un)":"$(id -gn)" . && \
find .git -type d -exec chmod u+rwx {} + && \
git pull origin claude/github-project-editing-bw3mcp && \
git log --oneline -1
```

בסוף תודפס שורה אחת עם הקומיט האחרון — זה סימן שהכול הסתדר.

### מה כל שורה עושה

1. `sudo chown -R ...` — מחזיר את הבעלות על כל קבצי הפרויקט (כולל `.git`)
   אליך במקום ל-`root`. זה התיקון האמיתי.
2. `find .git -type d -exec chmod u+rwx {} +` — מוודא שיש לך הרשאת כתיבה
   לכל התיקיות בתוך `.git`.
3. `git pull ...` — מושך שוב. הפעם זה יעבוד.

### לבדוק לפני, אם אתה רוצה לראות מה קורה (לא משנה כלום)

```bash
ls -ld .git .git/objects
```

בכל שורה, השדה השלישי הוא שם הבעלים. אם כתוב שם `root` במקום שם המשתמש
שלך — זו בדיוק התקלה.

### על Windows (Git Bash / PowerShell)

ל-Windows אין `sudo`, ושם הסיבה בדרך כלל שונה: או שהאנטי-וירוס נעל את
התיקייה, או שיש חלון של תוכנה אחרת (VS Code, GitHub Desktop, סייר הקבצים)
שמחזיק קובץ בתוך `.git`. סדר הפעולות:

1. סגור את VS Code, את GitHub Desktop ואת כל חלונות סייר הקבצים שפתוחים
   על תיקיית הפרויקט.
2. פתח **PowerShell כמנהל**: לחץ על כפתור "התחל" (Start) בפינה השמאלית
   התחתונה, הקלד `powershell`, ואז לחץ ימני על "Windows PowerShell"
   שמופיע ברשימה ובחר **"Run as administrator"** בתפריט שנפתח.
3. הדבק (עם הנתיב שלך):

```powershell
cd <התיקייה שבה שמור TheOneMachine>
takeown /F .git /R /D Y
icacls .git /grant "$env:USERNAME:(OI)(CI)F" /T
git pull origin claude/github-project-editing-bw3mcp
```

### אם עדיין נכשל — הפתרון האחרון שתמיד עובד

לשכפל את הפרויקט מחדש לתיקייה נקייה. **זה מוחק שינויים מקומיים שלא נדחפו** —
אם יש כאלה, הרץ קודם `git status --short` והעתק את הקבצים לתיקייה מחוץ
לפרויקט.

```bash
cd <התיקייה שמעל תיקיית הפרויקט>
mv TheOneMachine TheOneMachine-old
git clone https://github.com/Rami5743/TheOneMachine.git
cd TheOneMachine
git checkout claude/github-project-editing-bw3mcp
```

---

## למה זה קרה

הקלון המקומי מגיע כשהוא מחובר לענף `claude/continue-dev-branch-uleqf0`,
שהוא ענף **מת** — הוא נמצא 338 קומיטים מאחורי ענף הפיתוח ואף אחד לא דוחף
אליו. `git pull` בלי לציין ענף הולך לשם, וזה מה שמייצר את הבלגן.
לעולם אל תדחוף ואל תמשוך מהענף הזה.

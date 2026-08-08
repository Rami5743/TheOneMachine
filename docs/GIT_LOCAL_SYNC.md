# סנכרון העותק המקומי (git pull שנתקע)

הפיתוח כולו נעשה בענף `claude/github-project-editing-bw3mcp` ונדחף אליו.
העותק שלך על המחשב אמור רק *למשוך* משם. אם `git pull` נכשל עם

```
error: Pulling is not possible because you have unmerged files.
fatal: Exiting because of an unresolved conflict.
```

זה אומר שיש בעותק המקומי שלך מיזוג שנתקע באמצע. הנה מה לעשות, שלב-שלב.

---

## שלב 1 — לראות מה קורה (לא משנה כלום)

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

## שלב 2 — לבטל את המיזוג התקוע

```
git merge --abort
```

אם הפקודה הזאת מחזירה שגיאה שאומרת שאין מיזוג בעיצומו, נסה במקומה:

```
git rebase --abort
```

ואם גם זה נכשל, זה בסדר — פשוט המשך לשלב הבא.

---

## שלב 3 — לוודא שאין לך עבודה מקומית שחבל עליה

```
git status --short
```

* אם לא הודפס **כלום** — אין לך שינויים מקומיים, אפשר להמשיך בשקט.
* אם כן הודפסו שורות (`M` = קובץ ששונה, `??` = קובץ חדש) — אלה שינויים
  שקיימים רק אצלך. השלב הבא ימחק אותם. אם משהו שם חשוב לך, העתק אותו
  קודם לתיקייה אחרת מחוץ לפרויקט.

---

## שלב 4 — למשוך מחדש את הענף הנכון

```
git fetch origin claude/github-project-editing-bw3mcp
git checkout -B claude/github-project-editing-bw3mcp origin/claude/github-project-editing-bw3mcp
git reset --hard origin/claude/github-project-editing-bw3mcp
```

בסוף אמורה להופיע שורה שמתחילה ב-`HEAD is now at` ואחריה ההודעה של
הקומיט האחרון. זה סימן שהכול הסתדר.

---

## שלב 5 — לתקן את החיבור לענף, כדי שזה לא יקרה שוב

```
git branch --set-upstream-to=origin/claude/github-project-editing-bw3mcp claude/github-project-editing-bw3mcp
```

מעכשיו `git pull` סתם ימשוך מהענף הנכון.

**עדיף בכל זאת למשוך תמיד במפורש:**

```
git pull origin claude/github-project-editing-bw3mcp
```

---

## למה זה קרה

הקלון המקומי מגיע כשהוא מחובר לענף `claude/continue-dev-branch-uleqf0`,
שהוא ענף **מת** — הוא נמצא 338 קומיטים מאחורי ענף הפיתוח ואף אחד לא דוחף
אליו. `git pull` בלי לציין ענף הולך לשם, וזה מה שמייצר את הבלגן.
לעולם אל תדחוף ואל תמשוך מהענף הזה.

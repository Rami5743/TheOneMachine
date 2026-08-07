# הגדרת Supabase — טבלת הדירוגים (rankings)

מסמך זה מסביר איך להריץ את ה-SQL שמכין את טבלת הדירוגים (יעילות + מהירות + מהירות תכנון) בענן.
צריך לעשות את זה פעם אחת, וגם שוב בכל פעם שמתווספת עמודה חדשה (המסמך יעודכן).

הקובץ המלא נמצא ב-`supabase-rankings.sql` שבשורש הפרויקט.

---

## הוראות הרצה

**כנס ללינק:**
https://supabase.com/dashboard/project/oemhzqjfamqbinikmvfd/sql/new

(אם צריך — התחבר לחשבון Supabase שלך קודם. `oemhzqjfamqbinikmvfd` הוא מזהה
הפרויקט, נלקח מ-`js/auth-config.js`.)

**שם תלחץ על** "SQL Editor" **שנמצא** בסרגל הצד השמאלי (האייקון עם הסימן `</>`).
אם הלינק כבר פתח את עורך ה-SQL — דלג על השלב הזה.

**אחר כך תלחץ על** "+ New query" **שנמצא** בראש סרגל הצד השמאלי, מעל רשימת
השאילתות השמורות (פותח תיבת עריכה ריקה).

**הדבק את הטקסט הבא לתיבת** העריכה הגדולה **שנמצאת** במרכז המסך (לחץ בתוכה ואז
Ctrl+V):

```sql
create table if not exists public.rankings (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  nickname   text not null default 'ללא שם',
  counts     jsonb not null default '{}'::jsonb,
  serial     jsonb not null default '{}'::jsonb,
  design     jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.rankings add column if not exists serial jsonb not null default '{}'::jsonb;
alter table public.rankings add column if not exists design jsonb not null default '{}'::jsonb;
alter table public.rankings enable row level security;
create policy "rankings read all" on public.rankings for select using (true);
create policy "rankings insert own" on public.rankings for insert with check (auth.uid() = user_id);
create policy "rankings update own" on public.rankings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create unique index if not exists rankings_nickname_unique on public.rankings (lower(nickname)) where nickname <> 'ללא שם';
```

**ואז תלחץ על** "Run" **שנמצא** בפינה הימנית-תחתונה של עורך ה-SQL (כפתור ירוק;
קיצור מקלדת: Ctrl+Enter).

**לבסוף תראה** את ההודעה "Success. No rows returned" **שנמצאת** בפאנל התוצאות
מתחת לעורך — סימן שהצליח.

---

## הערות

- הקובץ **בטוח להרצה חוזרת** ואינו הרסני (ה-`if not exists` / `if exists`
  דואגים לזה). אם ריצה חוזרת נכשלת על שורות ה-`create policy` — זה תקין (ה-policy
  כבר קיים), אפשר להתעלם. השורה היחידה שחייבת לעבור בעדכון הזה היא ה-`add column`.
- אחרי ההרצה — רענון קשה של המשחק (Ctrl+Shift+R) כשאתה מחובר, ועמודות **דירוג**
  ו**שיא נוכחי** בכרטיסיית "דירוגי מהירות" יתחילו להתמלא.
- בלי ההרצה: הכל עובד מקומית (טור "נאנדים בטור"), רק הדירוג/שיא הצולבים במהירות
  לא זמינים.

---

## איפוס דירוגים של כרטיס שדרישותיו השתנו

צריך להריץ בכל פעם שמשנים דרישות של כרטיס, אחרת שיאים שנמדדו לפי הדרישות הישנות
ממשיכים להופיע בלוח השיאים שלו. ההוראות המלאות נמצאות במסמך נפרד:

    SUPABASE_RESET_CARD_RECORDS.md

וה-SQL עצמו:

    supabase-reset-card-records.sql

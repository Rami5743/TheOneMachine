# solution-layouts

קובץ JSON לכל פתרון (walkthrough) במשחק. שם הקובץ = מזהה המשימה.

כל קובץ:
- `components`: רשימת רכיבים. ערוך בעיקר `x,y` (מרכז הרכיב בקואורדינטות הלוח) כדי להזיז רכיב.
  אל תשנה `id`/`type`. לספליטר: `outputs` (מס׳ רגליים), `width` (רוחב רגל), `mirrored` (כיוון).
  לממיר dec→bin: `value`,`width`.
- `wires`: חיווט. כל חוט `{a,b}` = שני קצוות (`component.pin`).

הלוח מוגבל בגבולות — ערכים קיצוניים ייחתכו אוטומטית.

ערוך את הקבצים ששינית ושלח לי חזרה (או דחוף לענף) ואטמיע את המיקומים בקוד הפתרונות.

משימות: halfAdder, fullAdder, Add4, Add16, Inc, ALU0, PreperNum, Dmux4way, Mux4way16, Not4, Not16, AND4, OR4, AND16, MUX4, MUX16, Mux, DMux, Not, And, Or, Xor, AND3way, OR4way

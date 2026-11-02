// Amigo language switcher: Arabic (default) <-> English.
// UI text is translated in place using window.AMIGO_DICT (see i18n-dict.js).
// Course/faculty/instructor content stored in the database is translated with
// the DATA_PAIRS below, in both directions, so content follows the chosen
// language too: Arabic-stored items get English text in English mode, and
// English-stored items get Arabic text in Arabic mode.
(function () {
  var KEY = 'amigo-lang';
  var lang = 'ar';
  try { lang = localStorage.getItem(KEY) || 'ar'; } catch (e) {}
  var DICT = window.AMIGO_DICT || {};
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }
  var MAP = {};
  Object.keys(DICT).forEach(function (k) { MAP[norm(k)] = DICT[k]; });

  // [arabic, english] pairs for database content (courses, faculties, instructors).
  var DATA_PAIRS = [
    ['مهارات الحاسب - كورس تجريبي مشترك', 'Computer Skills – Shared Demo Course'],
    ['كورس تجريبي مشترك لطلاب الأعمال والهندسة.', 'A shared demo course for Business and Engineering students.'],
    ['مقدمة في الرياضيات الهندسية - تجريبي', 'Introduction to Engineering Mathematics – Demo'],
    ['مثال لكورس تخصصي لطلاب الهندسة.', 'An example of a specialized course for Engineering students.'],
    ['مبادئ المحاسبة', 'Principles of Accounting'],
    ['أساسيات المحاسبة المالية لطلاب إدارة الأعمال: الدورة المحاسبية، وقيود اليومية، والقوائم المالية الرئيسية.', 'Fundamentals of financial accounting for business students: the accounting cycle, journal entries, and the main financial statements.'],
    ['مهارات الكمبيوتر', 'Computer Skills'],
    ['مهارات الكمبيوتر الأساسية لطلاب إدارة الأعمال: التعامل مع أنظمة التشغيل، ومعالجة النصوص، والعروض التقديمية، والجداول الإلكترونية.', 'Essential computer skills for business students: working with operating systems, word processing, presentations, and spreadsheets.'],
    ['تحليل البيانات', 'Data Analysis'],
    ['مقدمة في تحليل البيانات للأعمال: جمع البيانات وتنقيتها، وتحليلها باستخدام الجداول الإلكترونية، وعرض النتائج بصريًا، واتخاذ قرارات مبنية على البيانات.', 'Introduction to data analysis for business: collecting and cleaning data, analyzing it with spreadsheets, visualizing results, and making data-driven decisions.'],
    ['كلية الأعمال والاقتصاد - تجريبي', 'Faculty of Business and Economics – Demo'],
    ['كلية نموذجية لاختبار عرض الكورسات والطلاب.', 'A demo faculty for testing how courses and students are displayed.'],
    ['كلية الهندسة - تجريبي', 'Faculty of Engineering – Demo'],
    ['د. سارة الحسيني', 'Dr. Sara El-Husseini'],
    ['محاضرة في نظم المعلومات والمهارات الرقمية، بخبرة تزيد عن عشر سنوات في تدريس مهارات الحاسب وتحليل البيانات لطلاب كليات الأعمال والهندسة.', 'A lecturer in information systems and digital skills, with over ten years of experience teaching computer skills and data analysis to Business and Engineering students.'],
    ['م. كريم الشاذلي', 'Eng. Karim El-Shazly'],
    ['محاضر في الرياضيات التطبيقية وتحليل البيانات، يدرّس لطلاب الهندسة وإدارة الأعمال ويهتم بتبسيط المفاهيم الكمية.', 'A lecturer in applied mathematics and data analysis who teaches Engineering and Business students and focuses on making quantitative concepts simple.'],
    ['د. منى عبد الرحمن', 'Dr. Mona Abdel Rahman'],
    ['أستاذة المحاسبة المالية، بخبرة واسعة في تدريس مبادئ المحاسبة وإعداد القوائم المالية لطلاب كلية إدارة الأعمال.', 'A professor of financial accounting with extensive experience teaching Principles of Accounting and financial statement preparation to Business students.'],
    ['مبتدئ', 'Beginner'],
    ['العربية', 'Arabic'],
    ['الإنجليزية', 'English']
  ];
  // Longest first so full titles/descriptions win over short shared values.
  var FWD = DATA_PAIRS.slice().sort(function (a, b) { return b[0].length - a[0].length; });
  var REV = DATA_PAIRS.map(function (p) { return [p[1], p[0]]; })
    .sort(function (a, b) { return b[0].length - a[0].length; });
  function dataPass(text, pairs) {
    var out = text;
    pairs.forEach(function (p) {
      if (out.indexOf(p[0]) > -1) out = out.split(p[0]).join(p[1]);
    });
    return out === text ? null : out;
  }

  var PATTERNS = [
    [/^(\d+) كورسات$/, '$1 Courses'],
    [/^(\d+) كورس$/, '$1 Course'],
    [/^كورسات$/, 'Courses'],
    [/^كورس$/, 'Course'],
    [/^المستوى: (.+)$/, 'Level: $1'],
    [/^اللغة: (.+)$/, 'Language: $1'],
    [/^الفرقة (.+) · الفصل (.+)$/, 'Year $1 · Term $2']
  ];
  function translateEN(text) {
    var n = norm(text);
    if (!n) return null;
    if (Object.prototype.hasOwnProperty.call(MAP, n)) return MAP[n];
    var withData = dataPass(n, FWD);
    var base = withData === null ? n : withData;
    for (var i = 0; i < PATTERNS.length; i++) {
      if (PATTERNS[i][0].test(base)) return base.replace(PATTERNS[i][0], PATTERNS[i][1]);
    }
    if (withData !== null) return withData;
    if (n.indexOf('|') > -1) {
      var parts = n.split('|').map(function (p) {
        var t = translateEN(p);
        return t === null ? norm(p) : t;
      });
      var joined = parts.join(' | ');
      if (joined !== n) return joined;
    }
    return null;
  }
  function translateAR(text) {
    var n = norm(text);
    if (!n) return null;
    return dataPass(n, REV);
  }
  var translateText = lang === 'en' ? translateEN : translateAR;

  var ATTRS = lang === 'en' ? ['placeholder', 'title', 'aria-label', 'alt'] : [];
  function translateAttrs(el) {
    if (!el.getAttribute) return;
    ATTRS.forEach(function (a) {
      var v = el.getAttribute(a);
      if (v) { var t = translateText(v); if (t !== null) el.setAttribute(a, t); }
    });
    if (lang === 'en' && el.tagName === 'INPUT' && (el.type === 'submit' || el.type === 'button') && el.value) {
      var t2 = translateText(el.value);
      if (t2 !== null) el.value = t2;
    }
  }
  function translateNode(root) {
    if (root.nodeType === 3) {
      if (root.parentElement && root.parentElement.id === 'lang-toggle') return;
      var t = translateText(root.nodeValue);
      if (t !== null) root.nodeValue = t;
      return;
    }
    if (root.nodeType !== 1) return;
    if (root.tagName === 'SCRIPT' || root.tagName === 'STYLE') return;
    translateAttrs(root);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    var texts = [];
    var cur;
    while ((cur = walker.nextNode())) {
      if (cur.nodeType === 3) texts.push(cur); else translateAttrs(cur);
    }
    texts.forEach(translateNode);
  }
  function apply() {
    if (lang === 'en') {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    }
    translateNode(document.body);
    if (lang === 'en') {
      var t = translateText(document.title);
      if (t !== null) document.title = t;
    }
  }
  function setupToggle() {
    var btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.textContent = lang === 'en' ? 'عربي' : 'EN';
    btn.addEventListener('click', function () {
      try { localStorage.setItem(KEY, lang === 'en' ? 'ar' : 'en'); } catch (e) {}
      location.reload();
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    setupToggle();
    apply();
    var applying = false;
    var observer = new MutationObserver(function (mutations) {
      if (applying) return;
      applying = true;
      try {
        mutations.forEach(function (m) {
          if (m.type === 'characterData') translateNode(m.target);
          m.addedNodes.forEach(translateNode);
        });
      } finally {
        applying = false;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
})();

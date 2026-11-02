// Amigo language switcher: Arabic (default) <-> English.
// The Arabic site is the source; when English is chosen we translate UI text
// in place using window.AMIGO_DICT (see i18n-dict.js), flip the page to LTR,
// and keep watching for content rendered later (catalog cards, auth messages).
(function () {
  var KEY = 'amigo-lang';
  var lang = 'ar';
  try { lang = localStorage.getItem(KEY) || 'ar'; } catch (e) {}
  var DICT = window.AMIGO_DICT || {};
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }
  var MAP = {};
  Object.keys(DICT).forEach(function (k) { MAP[norm(k)] = DICT[k]; });
  var PATTERNS = [
    [/^(\d+) كورسات$/, '$1 Courses'],
    [/^(\d+) كورس$/, '$1 Course'],
    [/^كورسات$/, 'Courses'],
    [/^كورس$/, 'Course']
  ];
  function translateText(text) {
    var n = norm(text);
    if (!n) return null;
    if (Object.prototype.hasOwnProperty.call(MAP, n)) return MAP[n];
    for (var i = 0; i < PATTERNS.length; i++) {
      if (PATTERNS[i][0].test(n)) return n.replace(PATTERNS[i][0], PATTERNS[i][1]);
    }
    if (n.indexOf('|') > -1) {
      var parts = n.split('|').map(function (p) {
        var t = translateText(p);
        return t === null ? norm(p) : t;
      });
      var joined = parts.join(' | ');
      if (joined !== n) return joined;
    }
    return null;
  }
  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
  function translateAttrs(el) {
    if (!el.getAttribute) return;
    ATTRS.forEach(function (a) {
      var v = el.getAttribute(a);
      if (v) { var t = translateText(v); if (t !== null) el.setAttribute(a, t); }
    });
    if (el.tagName === 'INPUT' && (el.type === 'submit' || el.type === 'button') && el.value) {
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
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    translateNode(document.body);
    var t = translateText(document.title);
    if (t !== null) document.title = t;
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
    if (lang !== 'en') return;
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

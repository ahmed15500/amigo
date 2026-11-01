(() => {
  const menu = document.querySelector('.menu-toggle');
  menu?.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!expanded));
    document.querySelector('#nav-links')?.classList.toggle('open', !expanded);
  });
  const grid = document.querySelector('#course-grid');
  if (grid) {
    const ids = ['faculty', 'shared', 'level', 'language', 'teacher'];
    const filters = Object.fromEntries(ids.map(id => [id, document.querySelector(`#${id}-filter`)]));
    const search = document.querySelector('#search');
    const cards = [...grid.querySelectorAll('[data-course]')];
    const update = () => {
      const q = search.value.trim().toLocaleLowerCase('ar');
      let count = 0;
      cards.forEach(card => {
        const d = card.dataset;
        const matches = (!q || d.search.toLocaleLowerCase('ar').includes(q)) &&
          (!filters.faculty.value || d.faculties.split(',').includes(filters.faculty.value)) &&
          (!filters.shared.value || d.shared === filters.shared.value) &&
          (!filters.level.value || d.level === filters.level.value) &&
          (!filters.language.value || d.language === filters.language.value) &&
          (!filters.teacher.value || d.teacher === filters.teacher.value);
        card.hidden = !matches;
        if (matches) count++;
      });
      document.querySelector('#result-count').textContent = count;
      document.querySelector('#empty-results').hidden = count !== 0;
    };
    search.addEventListener('input', update);
    Object.values(filters).forEach(select => select.addEventListener('change', update));
    document.querySelector('#reset-filters').addEventListener('click', () => {
      search.value = '';
      Object.values(filters).forEach(select => { select.value = ''; });
      update();
    });
    update();
  }
  const form = document.querySelector('#profile-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    try {
      localStorage.setItem('amigo-demo-profile', JSON.stringify({faculty: document.querySelector('#profile-faculty').value, year: document.querySelector('#profile-year').value}));
      location.assign('/dashboard');
    } catch (_) { alert('تعذّر حفظ الاختيار على هذا الجهاز.'); }
  });
  const recs = document.querySelector('#recommendations');
  if (recs) {
    let profile = null;
    try { profile = JSON.parse(localStorage.getItem('amigo-demo-profile') || 'null'); } catch (_) {}
    const cards = [...recs.querySelectorAll('[data-course]')];
    let count = 0;
    cards.forEach(card => {
      const matches = !!profile && card.dataset.faculties.split(',').includes(profile.faculty) && card.dataset.year === profile.year;
      card.hidden = !matches;
      if (matches) count++;
    });
    document.querySelector('#recommendations-empty').hidden = !profile || count > 0;
    if (profile) document.querySelector('#profile-summary').textContent = 'الكورسات المعروضة مرتبطة بكليتك وفرقتك التي اخترتها على هذا الجهاز.';
  }
})();

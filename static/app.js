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
})();

(() => {
  const menu = document.querySelector('.menu-toggle');
  menu?.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!expanded));
    document.querySelector('#nav-links')?.classList.toggle('open', !expanded);
  });
})();

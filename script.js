(() => {
  const links = [...document.querySelectorAll('.nav a[data-section]')];
  const sections = links.map(l => document.getElementById(l.dataset.section));
  const activate = id => links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
  links.forEach(l => l.addEventListener('click', () => activate(l.dataset.section)));

  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) activate(visible.target.id);
  }, {rootMargin:'-20% 0px -58% 0px', threshold:[0,.2,.4,.6,.8,1]});
  sections.forEach(s => sectionObserver.observe(s));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
  }, {threshold:.16});
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth', block:'start'});
  }));

  // Раннее размытие фона (старт при ~45% высоты hero-секции)
  const bg = document.querySelector('.page-bg');
  let ticking = false;
  const updateBackground = () => {
    const hero = document.getElementById('home');
    const trigger = hero.offsetTop + hero.offsetHeight * 0.45;
    const ramp = Math.min(1, Math.max(0, (window.scrollY - trigger) / Math.max(60, window.innerHeight * 0.10)));
    const blur = (ramp * 16).toFixed(1);
    bg.style.setProperty('--bg-blur', `${blur}px`);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateBackground); ticking = true; }
  }, {passive:true});
  window.addEventListener('resize', updateBackground);
  updateBackground();
})();
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

  // The supplied background is one continuous layer for the whole document.
  const bg = document.querySelector('.page-bg');
  let ticking = false;
  const sizeBackground = () => {
    const pageHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.clientHeight
    );
    bg.style.height = `${pageHeight}px`;
    bg.style.width = '100%';
  };
  const updateBackground = () => {
    sizeBackground();
    const hero = document.getElementById('home');
    const trigger = Math.max(hero.offsetHeight * 0.35, window.innerHeight * 0.35);
    const ramp = Math.min(1, Math.max(0, (window.scrollY - trigger) / Math.max(180, window.innerHeight * 0.55)));
    const blur = (ramp * 4).toFixed(1);
    bg.style.setProperty('--bg-blur', `${blur}px`);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateBackground); ticking = true; }
  }, {passive:true});
  window.addEventListener('resize', updateBackground);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeBackground);
  updateBackground();

  // Glass objects: while scrolling, the current set gently blurs out and
  // the next set appears, so the background never feels static.
  const floatingSets = [...document.querySelectorAll('.floating-set')];
  const updateFloatingSets = () => {
    if (!floatingSets.length) return;
    const step = Math.max(window.innerHeight * 0.72, 520);
    const position = window.scrollY / step;
    const base = Math.floor(position) % floatingSets.length;
    const progress = position - Math.floor(position);
    floatingSets.forEach((set, i) => {
      const distance = (i - base + floatingSets.length) % floatingSets.length;
      set.classList.remove('is-active', 'is-blurring');
      if (distance === 0) {
        set.classList.add(progress > .72 ? 'is-blurring' : 'is-active');
      } else if (distance === 1 && progress > .48) {
        set.classList.add('is-active');
      }
    });
  };
  let floatingTick = false;
  window.addEventListener('scroll', () => {
    if (!floatingTick) {
      requestAnimationFrame(() => { updateFloatingSets(); floatingTick = false; });
      floatingTick = true;
    }
  }, {passive:true});
  window.addEventListener('resize', updateFloatingSets);
  updateFloatingSets();

})();
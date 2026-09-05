const links=[...document.querySelectorAll('.nav-link')];
const sections=links.map(l=>document.getElementById(l.dataset.section));
function setActive(id){links.forEach(l=>l.classList.toggle('active',l.dataset.section===id));}
const observer=new IntersectionObserver((entries)=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(visible) setActive(visible.target.id);
},{rootMargin:'-25% 0px -55% 0px',threshold:[0,.2,.45,.7,1]});
sections.forEach(s=>observer.observe(s));
links.forEach(l=>l.addEventListener('click',e=>{
  e.preventDefault();
  document.getElementById(l.dataset.section).scrollIntoView({behavior:'smooth',block:'start'});
}));

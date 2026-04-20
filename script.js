// Filter existing VPN cards by tag (cards are rendered inline in HTML)
function applyFilter(activeTag) {
  const grid = document.getElementById('ratingGrid');
  if (!grid) return;

  const pinnedWrap = document.getElementById('pinnedGrid');
  const restWrap = document.getElementById('restGrid');
  const pinnedLabel = grid.querySelector('.pinned-label');
  const restLabel = grid.querySelector('.rest-label');

  let pinnedVisible = 0, restVisible = 0;

  const matchTag = (card) => {
    if (activeTag === 'all') return true;
    let tags = [];
    try { tags = JSON.parse(card.dataset.tags || '[]'); } catch (e) {}
    return tags.includes(activeTag);
  };

  grid.querySelectorAll('.vpn-card').forEach(card => {
    const show = matchTag(card);
    card.style.display = show ? '' : 'none';
    if (show) {
      if (card.dataset.pinned === 'true') pinnedVisible++;
      else restVisible++;
    }
  });

  if (pinnedWrap) pinnedWrap.style.display = pinnedVisible ? '' : 'none';
  if (pinnedLabel) pinnedLabel.style.display = pinnedVisible ? '' : 'none';
  if (restWrap) restWrap.style.display = restVisible ? '' : 'none';
  if (restLabel) restLabel.style.display = restVisible ? '' : 'none';

  // Empty state
  let emptyState = grid.querySelector('.empty-state');
  if (pinnedVisible === 0 && restVisible === 0) {
    if (!emptyState) {
      emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.style.cssText = 'padding:36px;text-align:center;color:var(--muted);background:var(--paper);border:1px dashed var(--line);border-radius:2px;font-family:var(--mono);font-size:13px';
      emptyState.textContent = 'По выбранному фильтру VPN не найдено';
      grid.appendChild(emptyState);
    } else {
      emptyState.style.display = '';
    }
  } else if (emptyState) {
    emptyState.style.display = 'none';
  }
}

// Filter tags click handler
const filterTagsEl = document.getElementById('filterTags');
if (filterTagsEl) {
  filterTagsEl.addEventListener('click', function(e) {
    const btn = e.target.closest('.filter-tag');
    if (!btn) return;
    document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.tag);
  });
}

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', function() {
    const item = this.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Install tabs
const installTabs = document.getElementById('installTabs');
if (installTabs) {
  installTabs.addEventListener('click', function(e) {
    const btn = e.target.closest('.itab');
    if (!btn) return;
    const tab = btn.dataset.tab;
    document.querySelectorAll('.itab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.itab-body').forEach(body => {
      body.classList.toggle('active', body.dataset.tabBody === tab);
    });
  });
}

// Mobile menu
const burger = document.getElementById('headerBurger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('open');
  if (mobileOverlay) mobileOverlay.classList.remove('open');
  if (burger) burger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
}

if (burger && mobileMenu) {
  burger.addEventListener('click', function() {
    const isOpen = mobileMenu.classList.toggle('open');
    if (mobileOverlay) mobileOverlay.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  });
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

// Active section highlight
const navSections = ['rating','routers','install','table','buying','faq','reviews']
  .map(id => document.getElementById(id))
  .filter(Boolean);
const navLinks = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
navSections.forEach(el => sectionObserver.observe(el));

/* 内容管理前端：从 content/*.json 读取内容并渲染到页面。
   读取失败时（如本地 file:// 直接打开），页面保留原有静态内容。 */
(function () {
  function load(path) {
    return fetch(path, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }
  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  function applyText(data) {
    document.querySelectorAll('[data-cms-text]').forEach(function (el) {
      var v = get(data, el.getAttribute('data-cms-text'));
      if (typeof v === 'string' && v.trim()) el.textContent = v;
    });
  }
  function applyImages(data) {
    document.querySelectorAll('[data-cms-img]').forEach(function (el) {
      var v = get(data, el.getAttribute('data-cms-img'));
      if (typeof v === 'string' && v.trim()) el.setAttribute('src', v);
    });
  }
  function renderBadges(list) {
    var box = document.getElementById('heroBadges');
    if (!box || !Array.isArray(list)) return;
    box.innerHTML = list.map(function (b) {
      return '<div class="b"><b>' + (b.num || '') + '</b>' + (b.label || '') + '</div>';
    }).join('');
  }
  function renderStats(list) {
    var box = document.getElementById('statsGrid');
    if (!box || !Array.isArray(list)) return;
    box.innerHTML = list.map(function (s) {
      return '<div class="stat"><div class="num">' + (s.num || '') + '</div><div class="lbl">' + (s.label || '') + '</div></div>';
    }).join('');
  }
  function renderProducts(items) {
    var box = document.getElementById('productGrid');
    if (!box || !Array.isArray(items)) return;
    box.innerHTML = items.map(function (p) {
      var icon = (p.image && p.image.trim())
        ? '<div class="icon"><img src="' + p.image + '" alt="' + (p.title || '') + '"></div>'
        : '<div class="icon">&#10022;</div>';
      return '<a class="card" href="' + (p.href || 'product-detail.html') + '">' + icon +
        '<h3>' + (p.title || '') + '</h3><p>' + (p.desc || '') + '</p>' +
        '<span class="tag">Learn more &#8594;</span></a>';
    }).join('');
  }
  function renderNews(items) {
    var box = document.getElementById('newsGrid');
    if (!box || !Array.isArray(items)) return;
    box.innerHTML = items.map(function (n) {
      var thumb = (n.image && n.image.trim())
        ? '<div class="thumb"><img src="' + n.image + '" alt="' + (n.title || '') + '"></div>'
        : '<div class="thumb">' + (n.date || '') + '</div>';
      return '<a class="news" href="' + (n.href || 'news-detail.html') + '">' + thumb +
        '<div class="body"><div class="date">' + (n.date || '') + '</div>' +
        '<h4>' + (n.title || '') + '</h4><p>' + (n.excerpt || '') + '</p>' +
        '<span class="more">Learn more &#8594;</span></div></a>';
    }).join('');
  }
  function applyPoster(site) {
    var hero = document.getElementById('heroSection');
    if (hero && site.hero && site.hero.poster) {
      hero.style.backgroundImage = "linear-gradient(rgba(10,37,64,.86),rgba(10,37,64,.92)), url('" + site.hero.poster + "')";
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
    }
    var av = document.getElementById('aboutVisual');
    if (av && site.about && site.about.image) {
      av.style.backgroundImage = "url('" + site.about.image + "')";
      av.style.backgroundSize = 'cover';
      av.style.backgroundPosition = 'center';
      av.classList.add('has-img');
    }
  }
  async function init() {
    var site = await load('content/site.json');
    if (site) {
      applyText(site);
      applyImages(site);
      renderBadges(site.hero && site.hero.badges);
      renderStats(site.stats);
      applyPoster(site);
    }
    var products = await load('content/products.json');
    if (products) renderProducts(products.items);
    var news = await load('content/news.json');
    if (news) renderNews(news.items);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

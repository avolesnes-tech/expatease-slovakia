/* ExpatBase — live listing counts from Supabase.
   Any element with data-eb-results="<Category>" becomes a results bar
   count ("Showing N <noun> <scope>"), hidden when zero.
   Any element with data-eb-count="<Category>" gets "<prefix>N <noun>"
   (or "<prefix><noun>" when zero). Counts auto-update with real data.
   Self-contained, safe to fail. */
(function () {
  var SB = 'https://etxqrlrqbjcbjmitnspv.supabase.co';
  var KEY = 'sb_publishable_i38f7jyt2HYOjUTNuOsklg_aMofdDvE';

  function countFor(cat) {
    return fetch(SB + '/rest/v1/businesses?status=eq.approved&category=eq.' +
      encodeURIComponent(cat) + '&select=id',
      { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rows) { return rows && Array.isArray(rows) ? rows.length : null; })
      .catch(function () { return null; });
  }

  var needs = {};
  document.querySelectorAll('[data-eb-count],[data-eb-results]').forEach(function (el) {
    var cat = el.getAttribute('data-eb-count') || el.getAttribute('data-eb-results');
    if (cat) { (needs[cat] = needs[cat] || []).push(el); }
  });

  Object.keys(needs).forEach(function (cat) {
    countFor(cat).then(function (n) {
      if (n === null) return;
      needs[cat].forEach(function (el) { apply(el, n); });
    });
  });

  function apply(el, n) {
    if (el.hasAttribute('data-eb-results')) {
      var noun = el.getAttribute('data-eb-noun') || 'listings';
      var scope = el.getAttribute('data-eb-scope') || 'in Bratislava';
      var bar = el.closest('.results-bar');
      if (n > 0) {
        el.innerHTML = 'Showing <strong>' + n + ' ' + noun + '</strong> ' + scope;
        if (bar) bar.style.display = '';
      } else if (bar) {
        bar.style.display = 'none';
      } else {
        el.textContent = '';
      }
    } else {
      var noun2 = el.getAttribute('data-eb-noun') || 'listings';
      var prefix = el.getAttribute('data-eb-prefix');
      if (prefix == null) prefix = '';
      el.textContent = n > 0 ? (prefix + n + ' ' + noun2) : (prefix + noun2);
    }
  }
})();

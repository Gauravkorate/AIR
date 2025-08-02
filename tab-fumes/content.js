(() => {
  chrome.storage.local.get(null, (data) => {
    const last = Object.keys(data).pop();
    if (!last) return;

    const favicon = document.querySelector("link[rel*='icon']");
    if (!favicon) return;

    const hue = data[last] === 'dirty-ish' ? 1 : 0;
    favicon.href = favicon.href.replace(/#.*/, '') + '#t=' + hue;
  });
})();
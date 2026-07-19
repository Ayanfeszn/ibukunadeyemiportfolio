// Lazy-load videos: only fetch + play once a video actually scrolls near the viewport,
// and pause it again once it scrolls away. Keeps pages with many autoplay clips
// (case studies, the Lab scrapboard) from trying to load everything at once.
(function () {
  var lazyVideos = document.querySelectorAll('video[data-src]');
  if (!lazyVideos.length) return;

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (!v.src && v.dataset.src) {
            v.src = v.dataset.src;
            v.load();
          }
          var playPromise = v.play();
          if (playPromise !== undefined) playPromise.catch(function () {});
        } else {
          v.pause();
        }
      });
    },
    { rootMargin: '400px 0px', threshold: 0.01 }
  );

  lazyVideos.forEach(function (v) {
    io.observe(v);
  });
})();

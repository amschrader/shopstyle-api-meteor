Package.describe({
  summary: "infinite-scroll"
});

Package.on_use(function (api, where) {
  api.add_files(['jquery.infinitescroll.min.js'], 'client');
});
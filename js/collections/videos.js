var app = app || {};

(function(){
  var VideoList = Backbone.Collection.extend({
    model: app.Video
  });

  app.Videos = new VideoList();
})();
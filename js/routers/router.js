var app = app || {};

(function(){

  var Workspace = Backbone.Router.extend({
    routes: {
      'video/:id': 'watch'
    },

    test: function(){
      console.log('test');
    },

    watch: function(yt_video_id){
      app.Videos.trigger('watch', yt_video_id);
    }
  });

  app.VideoRouter = new Workspace();
  Backbone.history.start();

})();
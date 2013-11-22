var app = app || {};

$(function(){

  app.VideoView = Backbone.View.extend({
    tagName: 'li',

    template: _.template( $('#video-template').html() ),

    events: {

    },

    initialize: function(){
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    clear: function(){
      this.model.destroy();
    }

  });

});
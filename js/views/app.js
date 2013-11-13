var app = app || {};

$(function($){

  var ENTER_KEY = 13;

  app.AppView = Backbone.View.extend({
    el: '#youtubeapp',

    events: {
      //'keypress #search-text': 'searchOnEnter',
      //'click #search-button': 'search',
      'click #video-viewer-close': 'stopWatch',
      'click .close': 'stopWatch'
    },

    initialize: function(){
      this.setting();
      this.count = 0;
      this.channels = [];
      //this.channels.push('Sprout',SesameStreet','yogabbagabba','simplekidscrafts','cartoonnetwork','MuppetsStudio','WordWorldPBS','bigredhatkids','babyeinstein','hooplakidz');
      this.channels.push('Sprout','SesameStreet');

      this.$search = this.$('#search-text');
      this.$videos = this.$('#videos-list');
      this.$viewer = this.$('#video-viewer');
      this.$wrapper = this.$('#video-wrapper');

      this.listenTo(app.Videos, 'add', this.addOne);
      this.listenTo(app.Videos, 'reset', this.addAll);
      this.listenTo(app.Videos, 'all', this.render);
      this.listenTo(app.Videos, 'watch', this.watch);

      this.widthWindow = $( window ).width()+'px';
      this.heightWindow = $( window ).height()+'px';

      $('#welcome').css('width',this.widthWindow);
      $('#welcome').css('height',this.heightWindow);

      $('#container').css('width',this.widthWindow);
      $('#container').css('height',this.heightWindow);

      $('#video-wrapper').css('width',this.widthWindow);
      $('#video-wrapper').css('height',this.heightWindow);

      this.render();

      $('#welcome').show();

      //console.log(navigator);

    },

    setting:function(){
      $('#welcome').hide();
      $('.close').hide();
      $('body').css('overflow','hidden');
      $('#container').html('class');
      $('#welcome').on('click', function(){
        $('#welcome').hide();
        $('.c--block').removeClass('blur');
        $('body').css('overflow','auto');
      });
    },


    addOne: function(video){
      var view = new app.VideoView({ model: video });
      this.$videos.append(view.render().el);
    },

    addAll: function(){
      this.$videos.html('');
      app.Videos.each(this.addOne, this);
    },

    render: function(){
      var that = this;
      this.color = []; 
      this.color.push('#db49d8','#ed4694','#ff4351','#fd6631','#fc880f','#feae1b','#ffd426','#a5de37','#49e845','#55dae1','#1b9af7','#7b72e9','#f668ca','#fe9949','#ffe93b','#80edf0','#ff667a','#ffeb94','#b6f9b2','#dcd4f9');
      that.$videos.addClass('loading');
      this.channels.forEach(function(str) {
          if(!str){
            return;
          }
          $.ajax({
            type: "GET",
            //url: 'http://gdata.youtube.com/feeds/api/videos?q='+str+'&format=5&max-results=5&v=2&alt=jsonc',
            url: 'https://gdata.youtube.com/feeds/api/users/'+str+'/uploads',
            dataType:"xml",
            //dataType:"jsonp",
            success: $.proxy(that.handleYoutubeResponse, that)
          });
      });
    },

    searchOnEnter: function(e){
      if(e.which !== ENTER_KEY){
        return;
      }
      this.search();
    },

    handleYoutubeResponse: function(response){
      var that = this;
      //var results = response.data.items;
      var results = response; //.getElementsByTagName("entry");
      console.log(results);

      if(!results || results.length < 1){
        this.$videos.removeClass('loading');
        this.$videos.text('No videos found');
        return;
      }

      var numResults = results.getElementsByTagName("entry").length;

      this.$videos.removeClass('loading');
      var j = 0;
      for(var i = 1; i < numResults+1; i++){
        //console.log(results.getElementsByTagName("entry")[i]);
        $('#wrapper').attr('id',that.count);
        $('#'+that.count).css('background-color',that.color[j]);
        $('#'+that.count).addClass('blur');
        /*
        get values
        */
        var id        = results.getElementsByTagName("id")[i].textContent.split('videos/');
        var author    = results.getElementsByTagName("name")[i].textContent;
        var thumb     = results.getElementsByTagName("thumbnail")[i].getAttribute('url');
        var title     = results.getElementsByTagName("title")[i].textContent;
        //console.log(id[1]);
        //console.log(thumb);
        //console.log(title);
        app.Videos.create({'id':id[1],'author':author,'thumb':thumb,'title':title});
        if (j<that.color.length){j+=1;that.count+=1;}else{j=0;}
      }
    },

    watch: function(yt_video_id){
      var that = this;
      this.url = "http://www.youtube.com/embed/" + yt_video_id + '?controls=0&autoplay=1&allowfullscreen=false&fs=1&rel=0&showinfo=0',
        style = "height:"+this.heightWindow+"; width:"+this.widthWindow+";"; 
      this.$viewer.show();
      this.$videos.hide();
      

      this.$wrapper.html('<iframe id="video" src="'+this.url+'" style="'+style+'" />');
      $('.close').show();

      /*
      this.$wrapper.youTubeEmbed({
        video       : 'http://www.youtube.com/watch?v='+yt_video_id,
        width       : that.widthWindow,
        height      : 5,
        progressBar : false
      });
*/

      //var $this = $('.button-block button').parent();
      //$this.toggleClass('canceled');

    },

    stopWatch: function(){
      this.$wrapper.html('');
      this.$viewer.hide();
      this.$videos.show();
      $('.close').hide();
    }
  });

});
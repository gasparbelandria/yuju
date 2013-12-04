var app = app || {};

$(function($){

  var ENTER_KEY = 13;

  app.AppView = Backbone.View.extend({
    el: '#youtubeapp',

    events: {
      //'keypress #search-text': 'searchOnEnter',
      'click #delete': 'del',
      'click #video-viewer-close': 'stopWatch',
      'click .close': 'stopWatch',
      'click .config, .return': 'showOptions',
      'click #list' : 'list',
      'click p' : 'delete',
      'click #add' : 'add',
      'click #search-button' : 'search',
      'click #feedback' : 'feedback'
    },

    initialize: function(){
      var that = this;
      this.setting();
      this.count = 0;
      this.$search = this.$('#search-text');
      this.$videos = this.$('#videos-list');
      this.$config = this.$('#config');
      this.$viewer = this.$('#video-viewer');
      this.$wrapper = this.$('#video-wrapper');

      this.listenTo(app.Videos, 'add', this.addOne);
      this.listenTo(app.Videos, 'reset', this.addAll);
      this.listenTo(app.Videos, 'all', this.render);
      this.listenTo(app.Videos, 'watch', this.watch);

      $(window).resize(function() {
        that.resize();
      });      

      this.widthWindow = $( window ).width()+'px';
      this.heightWindow = $( window ).height()+'px';

      $('#container').css('width',this.widthWindow);
      $('#container').css('height',this.heightWindow);

      $('#video-wrapper').css('width',this.widthWindow);
      $('#video-wrapper').css('height',this.heightWindow);

      $('#view_config').css('width',this.widthWindow);
      $('#view_config').css('height',this.heightWindow);

      $('#view_list').css('width',this.widthWindow);
      $('#view_list').css('height',this.heightWindow);

      $('#view_add').css('width',this.widthWindow);
      $('#view_add').css('height',this.heightWindow);

      $('#view_feedback').css('width',this.widthWindow);
      $('#view_feedback').css('height',this.heightWindow);

      this.getVideo();

    },

    showOptions: function(){
      // change button
      $('.config').hide();
      $('.return').hide();
      $('.close').show();
      // change view
      $('#videos-list').hide();
      $('#view_list').hide();
      $('#view_add').hide();
      $("#view_config").show();
      $("#view_feedback").hide();
    },

    list: function(){
      // change button
      $('.config').hide();
      $('.return').show();
      $('.close').hide();
      // change view
      $('#videos-list').hide();
      $('#view_list').show();
      $('#view_add').hide();
      $("#view_config").hide();
      $("#view_feedback").hide();

      this.channels.forEach(function(str) {
        $('#view_list').append('<p id="'+str+'">'+str+'<img src="img/trash.png"></p>');
      });
    },

    add: function(){
      // change button
      $('.config').hide();
      $('.return').show();
      $('.close').hide();
      // change view
      $('#videos-list').hide();
      $('#view_list').hide();
      $('#view_add').show();
      $("#view_config").hide();
      $("#view_feedback").hide();
    },

    delete: function(e){
      var $elem = e.target;
      var attrs = $elem.attributes;
      $('#'+attrs[0].value).remove();
      var i = this.channels.indexOf(attrs[0].value);
      if(i != -1) {
        this.channels.splice(i, 1);
        window.localStorage.setItem("sources", JSON.stringify(this.channels));
      }
    },

    feedback: function(){
      // change button
      $('.config').hide();
      $('.return').show();
      $('.close').hide();
      // change view
      $('#videos-list').hide();
      $('#view_list').hide();
      $('#view_add').hide();
      $("#view_config").hide();
      $("#view_feedback").show();

      this.channels.forEach(function(str) {
        $('#view_list').append('<p id="'+str+'">'+str+'<img src="img/trash.png"></p>');
      });
    },

    search: function(){
      var that = this;
      this.str = $('#search-text').val();
      if (this.str!=""){
        var url = 'https://gdata.youtube.com/feeds/api/users/'+this.str+'/uploads';
        if(!this.str){
          return;
        }
        $.ajax({
          type: "GET",
          url: url,
          dataType:"xml",
          success: $.proxy(that.handleChannel, that),
          statusCode: {
            404: function() {
              $('#searchMessage').html('<p style="margin-top:100px">Channel not found</p>');
            }
          }
        });
      }
    },

    handleChannel: function(response){
      var that = this;
      var results = response;
      if(!results || results.length < 1){
        $('#searchMessage').html('<p style="margin-top:100px">No videos found</p>');
        return;
      }else{
        var author = results.getElementsByTagName("name")[0].textContent;
        var logo = results.getElementsByTagName("logo")[0].textContent;
        $('#searchMessage').html('<p style="margin-top:100px"><img src="'+logo+'"><br />'+author+'</p><p>processing, please wait</p>');
        this.channels.push(this.str);
        window.localStorage.setItem("sources", JSON.stringify(this.channels));
        this.stopWatch();
      }
    },

    resize:function(){
      this.widthWindow = $( window ).width()+'px';
      this.heightWindow = $( window ).height()+'px';

      $('#config').css('width',this.widthWindow);
      $('#config').css('height',this.heightWindow);

      $('#video').css('width',this.widthWindow);
      $('#video').css('height',this.heightWindow);

      $('#container').css('width',this.widthWindow);
      $('#container').css('height',this.heightWindow);

      $('#video-wrapper').css('width',this.widthWindow);
      $('#video-wrapper').css('height',this.heightWindow);

      $('#view_config').css('width',this.widthWindow);
      $('#view_config').css('height',this.heightWindow);

      $('#view_list').css('width',this.widthWindow);
      $('#view_list').css('height',this.heightWindow);

      $('#view_add').css('width',this.widthWindow);
      $('#view_add').css('height',this.heightWindow);

      $('#view_feedback').css('width',this.widthWindow);
      $('#view_feedback').css('height',this.heightWindow);
    },

    setting:function(){
      $('.close').hide();
      $('.return').hide();
      $('#view_config').hide();
      $('#view_list').hide();
      $('#view_add').hide();
      $('#view_feedback').hide();
    },

    addOne: function(video){
      var view = new app.VideoView({ model: video });
      this.$videos.append(view.render().el);
    },

    addAll: function(){
      this.$videos.html('');
      app.Videos.each(this.addOne, this);
    },

    getVideo: function(){
      var that = this;
      app.Videos.reset();
      this.channels = [];
      this.channels = JSON.parse(window.localStorage.getItem("sources"));
      var ram = Math.floor((Math.random()*2));
      switch(ram) {
          case 0:
              this.channels = this.channels.sort();
              break;
          case 1:
              this.channels = this.channels.reverse();
              break;
      }      
      this.color = []; 
      this.color.push('#db49d8','#ed4694','#ff4351','#fd6631','#fc880f','#feae1b','#ffd426','#a5de37','#49e845','#55dae1','#1b9af7','#7b72e9','#f668ca','#fe9949','#ffe93b','#80edf0','#ff667a','#ffeb94','#b6f9b2','#dcd4f9');
      this.channels.forEach(function(str) {
        var url = 'https://gdata.youtube.com/feeds/api/users/'+str+'/uploads';
        if(!str){
          return;
        }
        $.ajax({
          type: "GET",
          //url: 'http://gdata.youtube.com/feeds/api/videos?q='+str+'&format=5&max-results=5&v=2&alt=jsonc',
          //dataType:"jsonp",
          url: url,
          dataType:"xml",
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
      console.log(response);
      var that = this;
      var results = response; 
      if(!results || results.length < 1){
        this.$videos.text('No videos found');
        return;
      }
      var numResults = results.getElementsByTagName("entry").length;
      var j = 0;
      for(var i = 0; i < numResults; i++){
        var entry = results.getElementsByTagName("entry")[i];
        if (results.getElementsByTagName("id")[i]){
          $('#wrapper').attr('id',that.count);
          $('#'+that.count).css('background-color',that.color[j]);
          var id        = entry.getElementsByTagName("id")[0].textContent.split('videos/');
          var author    = entry.getElementsByTagName("name")[0].textContent;
          var thumb     = entry.getElementsByTagName("thumbnail")[1].getAttribute('url');
          var title     = entry.getElementsByTagName("title")[0].textContent;
          var duration  = that.seconds2time(entry.getElementsByTagName("duration")[0].getAttribute('seconds'));
          var uri       = entry.getElementsByTagName("uri")[0].textContent;
          var longt     = uri.length;
          var str       = uri.substr(42, longt);
          app.Videos.create({'id':id[1],'author':author,'thumb':thumb,'title':title,'duration':duration,'str':str});
          if (j<that.color.length){j+=1;that.count+=1;}else{j=0;}
        }
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
      $('.config').hide();
      $('.return').hide();

      $('#view_config').hide();
      $('#view_list').hide();
      $('#view_add').hide();
      $('#view_feedback').hide();


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

    del:function(){
      $('.bt-overlay').css('background-color','white');
    },

    seconds2time: function(seconds) {
        var hours   = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - (hours * 3600)) / 60);
        var seconds = seconds - (hours * 3600) - (minutes * 60);
        var time = "";

        if (hours != 0) {
          time = hours+":";
        }
        if (minutes != 0 || time !== "") {
          minutes = (minutes < 10 && time !== "") ? "0"+minutes : String(minutes);
          time += minutes+":";
        }
        if (time === "") {
          time = seconds+"s";
        }
        else {
          time += (seconds < 10) ? "0"+seconds : String(seconds);
        }
        return time;
    },

    stopWatch: function(){
      this.$wrapper.html('');
      this.$viewer.hide();
      this.$videos.show();
      

      $('.close').hide();
      $('.config').show();
      $('#view_config').hide();
      $('#view_add').hide();
      this.getVideo();      
    }
  });

});
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

window.rainbow = false;

function renderTwitterFeed() {
    var url = "http://my-cors-proxy.azurewebsites.net/twitrss.me/twitter_user_to_rss/?user=dubtypescript";
    $.get(url, (html) => {
        var cards = $(html).find("item").toArray().map(function(item, index) {
            return twitterCard(index, item)
        });
        $("#feed").html(cards.join("")).masonry({ 
            itemSelector: '.card'
        });
    });
}

function twitterCard(index, item) {
    var description = $(item).find("description").html();
    var content = description.split("<![CDATA[").join("").split("]]>").join("");
    let pubDate = new Date($(item).find("pubDate").text()).toLocaleString();
    return `
        <div class="card" data-key="${index}">
            <div class="card-profile">
                <img src="./assets/twitter_profile.png" />
            </div>
            <div class="card-content">
                ${content}
            </div>
            <div style="clear: both;" />
            <div class="card-details">
                <div class="date">${pubDate}</div>
            </div>
        </div>
    `;
}

(function() {
  
  $("#year").html(new Date().getFullYear());

  // animation logic
  var Skyline = (function() {

    var cloudSizes = ["small", "medium", "large"];

    var clouds = {
      small : '<div class="cloud cloud-small">&nbsp;</div>',
      medium : '<div class="cloud cloud-medium">&nbsp;</div>',
      large : '<div class="cloud cloud-large">&nbsp;</div>'
    };

    function Skyline(speed, cloudCount, cloudRatio) {
      this.speed = speed;
      this.cloudCount = cloudCount;
      this.cloudRatio = cloudRatio * 100;
      this.timeSinceLastCloudAdded = this.cloudRatio;
    };

    Skyline.prototype.render = function() {

      this.timeSinceLastCloudAdded = this.timeSinceLastCloudAdded + 1;
      var $clouds = $('.cloud');

      var notEnoughClouds = $clouds.length < this.cloudCount;
      var enoughSpaceBetweenClouds = this.timeSinceLastCloudAdded > this.cloudRatio;

      // add a cloud if no clouds and clouds not too close
      if(notEnoughClouds && enoughSpaceBetweenClouds) {
        
        var $cloud = $(clouds[cloudSizes[Math.floor(Math.random() * 3)]]);

        if (new Date().getMinutes() % 5 === 0 && rainbow === false) {
          var bg_img = "background: url('./assets/rainbow_cat.png');";
          var bg_position = "background-size: contain;";
          var bg_repeat = "background-repeat: no-repeat;";
          $cloud.attr("style", bg_img + bg_position + bg_repeat);
          window.rainbow = true;
        } else {
          window.rainbow = false;
        }

        $('.sky').prepend($cloud);
        this.timeSinceLastCloudAdded = 0;
      }
      // if there are clouds
      else {


        // update clouds
        for(var i = 0; i < $clouds.length; i++) {

          var $cloud = $($clouds[i]);

          // if clous was just appended set left = 0
          var left = $cloud.css("left");
          if(left === "-350px") {
            var top = Math.floor(Math.random() * 250) + 50;
            $cloud.css("top", top);
            $cloud.css("left", -349);
          }
          else {
            // the cloud was previously appended
            left = left.replace("px","");
            left = parseInt(left);

            // if cloud is not out of the screen move right
            if(left < (window.innerWidth + 500)){
              left = left + this.speed;
              $cloud.css("left", left);
            }
            // if cloud is out of the screen remove it from DOM
            else {
              $cloud.remove();
            }
          }
        }

      }
    };

    return Skyline;
  })();

  // run animation
  var skyline = new Skyline(1,5,4);
  (function animloop() {
    requestAnimFrame(animloop);
    skyline.render();
  })();
  
  // render previous meetups
  $.get("./src/templates/previous_meetups.hbs", function(source) {
    $.getJSON("./data/previous_meetups.json", function(data) {
      var template = Handlebars.compile(source);
      var html = template(data);
      $('#previous_meetups').html(html);
      $('#previous_meetups .item').last().addClass("active");
      $('#previous_meetups .carousel').carousel();
    });
  });

  renderTwitterFeed();

})();

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

(function() {

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
        $('.sky').prepend(clouds[cloudSizes[Math.floor(Math.random() * 3)]]);
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
    $.get("./data/previous_meetups.json", function(data) {
      var template = Handlebars.compile(source);
      var html = template(data);
      $('#previous_meetups').html(html);
    });
  });

  // easter egg
  __konami__.enable(function() {
    var bg_img = "background: url('./assets/rainbow_cat.png');";
    var bg_position = "background-size: contain;";
    var bg_repeat = "background-repeat: no-repeat;";
    var style = "<style>.cloud{" + bg_img + bg_position + bg_repeat + "}</style>";
    $("head").append(style);
  }, { replay: false });
})();

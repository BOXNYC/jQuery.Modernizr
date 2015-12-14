
(function($, M){
  $.fn.modernizr = function(arg0, arg1){
    var $this = $(this),
        options = arg0;
    if(typeof $.modernizr === 'undefined') $.modernizr = {};
    if(typeof options !== 'object') {
      options = {};
      options[arg0] = arg1;
    }
    // Viewport Height/Width Unit
    $.each(options, function(attr, val){
      var valData = /^([\-0-9]{1,})\s*(vw|vh)$/i.exec(val);
      if(valData == null) return true;
      if(M.cssvwunit) return true;
      if(typeof $.modernizr.resizes === 'undefined')
        $.modernizr.resizes = [];
      $.modernizr.resizes.push({
        attr: attr,
        unit: valData[2],
        value: valData[1]
      });
    });
    // BackgroundSize
    $.each(options, function(attr, val){
      //if(M.backgroundsize) return true;
      //M.bgsizecover
      if(val == 'cover') {
        var image = $this.css('backgroundImage').replace(/^url\(|\)$|\"\'/g, ''),
            position = $this.css('backgroundPosition').split(' '),
            $img = $('<img>').attr('src', image).css({
              position: 'absolute',
              zIndex: 0,
              width: '100%',
              height: 'auto'
            }).prependTo($this);
        $this.css('backgroundImage', 'none').on('resize', function(){
          var width = $this.width(),
              height = $this.height(),
              css = {};
          $img.css(css);
        }).trigger('resize');
      }
    });
    if(typeof $.modernizr.resizes !== 'undefined' && $.modernizr.resizes.length) {
      if(typeof $.modernizr.resize === 'undefined') {
        var $window = $(window);
        $.modernizr.resize = function(){
          var size = {vw: 0, vh: 0},
              css = {};
          $.each($.modernizr.resizes, function(i, data){
            if(!size.vw && data.unit == 'vw') size.vw = $window.width();
            if(!size.vh && data.unit == 'vh') size.vh = $window.height();
            var percent = parseInt(data.value) / 100,
                viewportSize = size[data.unit];
            css[data.attr] = Math.round(percent * viewportSize) + 'px';
          });
          $this.css(css);
        }
        $window.on('resize', $.modernizr.resize).trigger('resize');
      }
    };
    return $this;
  }
})(jQuery, Modernizr);

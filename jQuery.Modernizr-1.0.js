
(function($, M){
  $.fn.modernizr = function(arg0, arg1){
    var $this = $(this),
        options = arg0;
    if(typeof $.moderniz === 'undefined') $.moderniz = {};
    if(typeof options !== 'object') {
      options = {};
      options[arg0] = arg1;
    }
    $.each(options, function(attr, val){
      var valData = /^([\-0-9]{1,})\s*(vw|vh)$/i.exec(val);
      if(valData == null) return true;
      if(M.cssvwunit) return true;
      if(typeof $.moderniz.resizes === 'undefined')
        $.moderniz.resizes = [];
      $.moderniz.resizes.push({
        attr: attr,
        unit: valData[2],
        value: valData[1]
      });
    });
    if(typeof $.moderniz.resizes !== 'undefined' && $.moderniz.resizes.length) {
      if(typeof $.moderniz.resize === 'undefined') {
        var $window = $(window);
        $.moderniz.resize = function(){
          var size = {vw: 0, vh: 0},
              css = {};
          $.each($.moderniz.resizes, function(i, data){
            if(!size.vw && data.unit == 'vw') size.vw = $window.width();
            if(!size.vh && data.unit == 'vh') size.vh = $window.height();
            var percent = parseInt(data.value) / 100,
                viewportSize = size[data.unit];
            css[data.attr] = Math.round(percent * viewportSize) + 'px';
          });
          $this.css(css);
        }
        $window.on('resize', $.moderniz.resize).trigger('resize');
      }
    };
    return $this;
  }
})(jQuery, Modernizr);

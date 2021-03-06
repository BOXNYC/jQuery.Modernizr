
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
      if(M.cssvwunit || M.cssvhunit) return true;
      if(typeof $.modernizr.resizes === 'undefined')
        $.modernizr.resizes = [];
      $.modernizr.resizes.push({
        type: 'viewportUnits',
        attr: attr,
        unit: valData[2],
        value: valData[1]
      });
    });
    // BackgroundSize
    $.each(options, function(attr, val){
      if(M.backgroundsize) return true;
      if(M.bgsizecover) return true;
      if(val == 'cover' || val == 'contain') {
        var image = $this.css('backgroundImage').replace(/^url\(|\)$|[\"\'\'\"]/g, ''),
            $img = $('<img>').attr('src', image).css({
              position: 'absolute',
              zIndex: 0
            }).prependTo($this);
        var img = new Image();
        img.src = image;
        if(typeof $.modernizr.resizes === 'undefined')
          $.modernizr.resizes = [];
        $this.css({
          backgroundImage: 'none',
          overflow: 'hidden',
          position: 'relative'
        }).bind('updateBackgroundSize', function(){
          var width = $this.width(),
              height = $this.height(),
              imgWidth = img.width,
              imgHeight = img.height,
              scaledWidth = imgWidth * (height/imgHeight),
              scaledHeight = imgHeight * (width/imgWidth),
              position = $this.css('backgroundPosition').split(' '),
              posV = position[1],
              posH = position[0];
          if(scaledHeight >= height && val != 'contain') {
            $img.css({
              width: '100%',
              height: 'auto'
            });
            switch(posV) {
              case 'center' : posV = 0.5; break;
              case 'top' : posV = 0.0; break;
              case 'bottom' : posV = 1.0; break;
            };
            if(typeof posV !== 'number') {
              if(posV.indexOf('%')>-1) {
                posV = parseInt(posV) / 100;
              } else if(posV.indexOf('px')>-1) {
                posV = parseInt(posV) / 100;
                $img.css('top', posV);
                return;
              };
            };
            var css = {top: -Math.round(((scaledHeight)-height)*posV)+'px'};
            $img.css(css);
            return;
          };
          $img.css({
            width: 'auto',
            height: '100%'
          });
          switch(posH) {
            case 'center' : posH = 0.5; break;
            case 'top' : posH = 0.0; break;
            case 'bottom' : posH = 1.0; break;
          };
          if(typeof posH !== 'number') {
            if(posH.indexOf('%')>-1) {
              posH = parseInt(posH) / 100;
            } else if(posH.indexOf('px')>-1) {
              posH = parseInt(posH) / 100;
              $img.css('left', posH);
              return;
            };
          };
          var css = {left: -Math.round(((scaledWidth)-width)*posH)+'px'};
          $img.css(css);
        });
        $.modernizr.resizes.push({
          type: 'backgroundSize',
          $: $this
        });
      }
    });
    // Window resizes
    if(typeof $.modernizr.resizes !== 'undefined' && $.modernizr.resizes.length) {
      if(typeof $.modernizr.resize === 'undefined') {
        var $window = $(window);
        $.modernizr.resize = function(){
          var size = {vw: 0, vh: 0},
              css = {},
              cssChanged = false;
          $.each($.modernizr.resizes, function(i, data){
            switch(data.type) {
              case 'viewportUnits' :
                if(!size.vw && data.unit == 'vw') size.vw = $window.width();
                if(!size.vh && data.unit == 'vh') size.vh = $window.height();
                var percent = parseInt(data.value) / 100,
                    viewportSize = size[data.unit];
                css[data.attr] = Math.round(percent * viewportSize) + 'px';
                cssChanged = true;
                break;
              case 'backgroundSize' :
                data.$.trigger('updateBackgroundSize');
                break;
            }
          });
          if(cssChanged) $this.css(css);
        }
        $window.on('resize', $.modernizr.resize).trigger('resize');
      }
    };
    return $this;
  }
})(jQuery, Modernizr);

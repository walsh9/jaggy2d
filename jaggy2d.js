var Jaggy2d = function() {

  var JaggyBase = {};
  JaggyBase.drawPoint = function(x, y, options) {
    var offset = (x + y * options.w) * 4;
    options.imgData.data[offset] = 255;
    options.imgData.data[offset+1] = 0;
    options.imgData.data[offset+2] = 0;
    options.imgData.data[offset+3] = 255;
  };

  JaggyBase.drawLine = function(x0, y0, x1, y1, options) {
    var deltaX = Math.abs(x1 - x0);
    var deltaY = -Math.abs(y1 - y0);
    var signX = x0 < x1 ? 1 : -1;
    var signY = y0 < y1 ? 1 : -1;
    var err = deltaX + deltaY;
    var e2;

    JaggyBase.drawPoint(x0, y0, options);
    while (!(x0 == x1 && y0 == y1)) {
        e2 = Math.floor(err * 2);
        if (e2 >= deltaY) {
            err += deltaY;
            x0 += signX;
        }
        if (e2 <= deltaX) {
            err += deltaX;
            y0 += signY;
        }
        JaggyBase.drawPoint(x0, y0, options);
    }
  };

  var JaggyPath = function() {
    this.path = [];
  };
  JaggyPath.prototype.moveTo = function(x, y) {
    var x = Math.round(x);
    var y = Math.round(y);
    this.path.push({action: 'move', x: x, y: y});
  };
  JaggyPath.prototype.lineTo = function(x, y) {
    var x = Math.round(x);
    var y = Math.round(y);
    this.path.push({action: 'line', x: x, y: y});
  };
  JaggyPath.prototype.stroke = function(drawingOptions) {

    var lastPoint, currentAction;
    while (this.path.length > 0) {
      currentAction = this.path.shift();
      switch (currentAction.action) {
      case 'move':
        lastPoint = {x: currentAction.x, y: currentAction.y};
        break;
      case 'line':
        JaggyBase.drawLine(lastPoint.x, lastPoint.y, currentAction.x, currentAction.y, drawingOptions);
        lastPoint = {x: currentAction.x, y: currentAction.y};
        break;
      default:
        break;
      }
    }
    return drawingOptions.imgData;
  };

  var jaggy = function(ctx) {
    jaggyCtx = {};
    jaggyCtx.baseContext = ctx;
    Object.getOwnPropertyNames(CanvasRenderingContext2D.prototype).forEach(
      function copyProp(property) {
        if (typeof ctx[property] === 'function') {
          jaggyCtx[property] = ctx[property].bind(ctx);
        } else {
          Object.defineProperty(jaggyCtx, property, {
            get: function() {
              return ctx[property];
            },
            set: function(value) {
              ctx[property] = value;
            }
          });
        }
      }
    );
    jaggyCtx.beginPath = function() {
      this.currentPath = new JaggyPath();
      this.baseContext.beginPath();
    };
    jaggyCtx.moveTo = function(x, y) {
      this.currentPath.moveTo(x, y);
      this.baseContext.moveTo(x, y);
    };
    jaggyCtx.lineTo = function(x, y) {
      this.currentPath.lineTo(x, y);
      this.baseContext.lineTo(x, y);
    };
    jaggyCtx.stroke = function() {
      var options = {};
      options.w = 32;
      options.h = 32;
      options.imgData = this.baseContext.createImageData(options.w, options.h);

      var imgData = this.currentPath.stroke(options);
      var tempCanvas = document.createElement('canvas');
      tempCanvas.getContext("2d").putImageData(imgData, 0, 0);
      var dataUrl = tempCanvas.toDataURL();
      var image = document.createElement('img');
      image.src = dataUrl;
      this.baseContext.drawImage(image, 0, 0);
      //this.baseContext.stroke();
    };
    jaggyCtx.strokeRect = function(x, y, width, height) {
      this.beginPath();
      this.moveTo(x, y);
      this.lineTo(x + width, y);
      this.lineTo(x + width, y + height);
      this.lineTo(x, y + height);
      this.lineTo(x, y);
      debugger;
      this.stroke();
    }
    return jaggyCtx;
  };

  return {jaggy: jaggy};

}();
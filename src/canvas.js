/*
 * canvas 1.0
 * A simple, canvas CanvasRenderingContext2D.prototype 原型扩展库，便于链式操作；
 * from wbh5.com @Author leiroc
 * Copyright 2015, MIT License
 *
 */


window.requestNextAnimationFrame = (function() {
    var originalWebkitRequestAnimationFrame = undefined,
        wrapper = undefined,
        callback = undefined,
        geckoVersion = 0,
        userAgent = navigator.userAgent,
        index = 0,
        self = this;

    // Workaround for Chrome 10 bug where Chrome
    // does not pass the time to the animation function

    if (window.webkitRequestAnimationFrame) {
        wrapper = function(time) {

            if (time === undefined) {
                time += new Date();
            }

            self.callback(time);
        };

        // Make the switch

        originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;

        window.webkitRequestAnimationFrame = function(wrapper, element) {
            self.callback = callback;

            // Browser calls the wrapper and wrapper calls the callback

            originalWebkitRequestAnimationFrame(wrapper, element);
        };
    }

    // Workaround for Gecko 2.0, which has a bug in
    // mozRequestAnimationFrame() that restricts animations
    // to 30-40 fps.

    if (window.mozRequestAnimationFrame) {
        // Check the Gecko version. Gecko is used by browsers
        // other than Firefox. Gecko 2.0 corresponds to
        // Firefox 4.0.

        index = userAgent.indexOf('rv:');

        if (userAgent.indexOf('Gecko') != -1) {
            geckoVersion = userAgent.substr(index + 3, 3);

            if (geckoVersion === '2.0') {
                // Forces the return statement to fall through
                // to the setTimeout() function.

                window.mozRequestAnimationFrame = undefined;
            }
        }
    }

    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function(callback, element) {
            var start,
                finish;

            window.setTimeout(function() {
                start = +new Date();
                callback(start);
                finish = +new Date();

                self.timeout = 1000 / 60 - (finish - start);

            }, self.timeout);
        };
})();


//停止动画
window.cancelAnimate = function(id) {
    return window.cancelAnimationFrame(id);
}

;
(function(prototype) {

    //绘制矩形
    prototype.drawRect = function(x, y, w, h, color, type) {
        //fillRect
        if (type == 'fill') {
            this.fillStyle = color + '';
            this.fillRect(x, y, w, h);
        } else if (type == 'stroke') {
            //strokeRect
            this.strokeStyle = color + '';
            this.strokeRect(x, y, w, h)
        } else if (type == 'round') {

        } else {
            alert('type 参数错误')
        }
        return this;
    }

    //清除
    prototype.clear = function(x, y, w, h) {
        this.clearRect(x, y, w, h);
        return this;
    }
    //圆角矩形
    prototype.roundRect = function(x, y, w, h, color, r, type) {
        this.beginPath();
        this.moveTo(x, y + r);
        this.lineTo(x, y + h - r);
        this.quadraticCurveTo(x, y + h, x + r, y + h);
        this.lineTo(x + w - r, y + h);
        this.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
        this.lineTo(x + w, y + r);
        this.quadraticCurveTo(x + w, y, x + w - r, y);
        this.lineTo(x + r, y);
        this.quadraticCurveTo(x, y, x, y + r);
        if (type == 'fill') {
            this.fillStyle = color + '';
            this.fill();
        } else if (type == 'stroke') {
            this.strokeStyle = color + '';
            this.stroke();
            this.closePath();
        }

        return this;
    }

    //绘制圆形
    prototype._arc = function(x, y, r, sAngle, eAngle, direction, objTo, color, type) {
        //type == false, 顺时针
        this.beginPath();
        this.arc(x, y, r, sAngle, eAngle, direction);
        if (objTo) {
            this.lineTo(objTo.x, objTo.y);
        }

        if (type == 'fill') {
            this.fillStyle = color + '';
            this.fill();
        } else if (type == 'stroke') {
            this.strokeStyle = color + '';
            this.stroke();
            this.closePath();
        }
        return this;
    }
    //绘制三角形
    prototype.triangle = function(x, y, objPos, color, type) {
        this.beginPath();
        this.moveTo(x, y);
        this.lineTo(objPos.x1, objPos.y1);
        this.lineTo(objPos.x2, objPos.y2);

        if (type == 'fill') {
            this.fillStyle = color + '';
            this.fill();
        } else if (type == 'stroke') {
            this.strokeStyle = color + '';
            this.lineTo(x, y);
            this.stroke();
            this.closePath();
        }

        return this;
    }

    //绘制图片
    prototype.drawImg = function(url, x, y, w, h) {
        var that = this,
            img = new Image();

        img.onload = function() {
            that.drawImage(img, x, y, w, h);
        }
        img.src = url;
        return this;
    }
    //线宽
    prototype.lineW = function(w) {
        this.lineWidth = w;
        return this;
    }
    //移动
    prototype.trans = function(x, y) {
        this.translate(x, y);
        return this;
    }
    //保存
    prototype._save = function() {
        this.save();
        return this;
    }
    prototype._moveTo = function(x, y) {
        this.moveTo(x, y);
        return this;
    }
    prototype._stroke = function() {
        this.stroke();
        return this;
    }
    prototype._lineTo = function(x, y) {
        this.lineTo(x, y);
        return this;
    }
    prototype.bPath = function() {
        this.beginPath();
        return this;
    }
    prototype.cPath = function() {
        this.closePath();
        return this;
    }
    prototype.sStyle = function(color) {
        this.strokeStyle = color;
        return this;
    }
    prototype.fStyle = function(color) {
        this.fillStyle = color;
        return this;
    }
    prototype._rotate = function(deg) {
        this.rotate(deg);
        return this;
    }
    prototype.sText = function(text, x, y) {
        this.strokeText(text, x, y);
        return this;
    }

    prototype.fText = function(text, x, y) {
        this.fillText(text, x, y);
        return this;
    }

    prototype._font = function(p) {
        this.font = p + 'px Arial';
        return this;
    }

    prototype._restore = function() {
        this.restore();
        return this;
    }
    prototype._scale = function(x, y) {
        this.scale(x, y);
        return this;
    }

    prototype._gco = function(str) {
        this.globalCompositeOperation = str;
        return this;
    }

    prototype._lineJoin = function(str) {
        this.lineJoin = str;
        return this;
    }

    prototype._lineCap = function(str) {
        this.lineCap = str;
        return this;
    }
})(CanvasRenderingContext2D.prototype)
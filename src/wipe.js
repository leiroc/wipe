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
})(CanvasRenderingContext2D.prototype);


/*
 * wipe 1.0
 * A simple, efficent mobile wipe(简单的移动端涂抹插件)
 * from wbh5.com @Author leiroc
 * Copyright 2015, MIT License
 *
*/

/**
 * animation parmas:
 *
 * @param {Element}      el         canvas 外层元素
 * @param {String}       fg         涂抹层（可以使图片{.png|.jpg}，和16进制颜色 #ccc）
 * @param {Number}       size       涂抹笔直径
 * @param {Boolean}      debug      显示控制数据输出，true时，会在控制台输出轨迹数据
 * @param {Boolean}      autoWipe   是否自动播放
 * @param {Array}        data       自动播放的数据
 * @param {Function}     onswiping  涂抹时的回调函数
 */

function Wipe(opts) {
    this.opts = {
        el: '#wipe',
        fg: '#ccc',
        size: 10,
        debug: false,
        autoWipe: false,
        data: [],
        onswiping: function(percent, data) {}
    };
    for (var i in opts) {
        this.opts[i] = opts[i]
    }
    this.init();
}

Wipe.prototype = {
    doc: document,
    $: function(name) {
        return this.doc.querySelector(name);
    },
    init: function() {
        var self = this,
            devicePixelRatio = window.devicePixelRatio || 1;

        this.devicePixelRatio = devicePixelRatio;
        //insert canvas el
        this.wrap = this.$(this.opts.el);
        //clear html
        this.wrap.innerHTML = null;
        this.wrap.appendChild(this.doc.createElement('canvas'));
        this.wrapWidth = parseInt(this.wrap.offsetWidth);
        this.wrapHeight = parseInt(this.wrap.offsetHeight);
        //prevent defalut
        this.wrap.addEventListener('touchmove', function(e) {
            e.preventDefault()
        });
        //get canvas
        this.canvas = this.wrap.childNodes[0];
        this.canvas.style.cssText += 'width: 100%; height: 100%';
        this.ctx = this.canvas.getContext('2d');
        //set attr
        this.canvas.setAttribute('width', this.wrapWidth * devicePixelRatio);
        this.canvas.setAttribute('height', this.wrapHeight * devicePixelRatio);
        //get width & height
        this.cWidth = this.canvas.width;
        this.cHeight = this.canvas.height;
        //canvas context scale
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
        //pixels
        this.pixels = Math.floor(this.cWidth * this.cHeight);
        //drawFg
        this.drawFg();
        //set Event
        this.setEvent();
        // auto wipe
        if (this.opts.autoWipe) {
            setTimeout(function() {
                self.autoWipe();
            }, 100)
        }
        //path
        this.path = [];
    },
    reset: function (fg) {
        this.drawFg(fg);
        //path
        this.path = [];
    },
    winTcanvasXY: function (canvas, x, y) {
        var cC = canvas.getBoundingClientRect();
        return {
            x: x - cC.left,
            y: y - cC.top
        }
    },
    clear: function() {
        this.ctx.clear(0, 0, this.cWidth, this.cHeight);
    },
    drawFg: function(fg) {
        if (this.opts.fg || fg) {
            //fixed wipe_img bug
            if (this.opts.fg.charAt(0) === '#' || (fg && fg.charAt(0) === '#')) {
                this.ctx.drawRect(0, 0, this.cWidth, this.cHeight, this.opts.fg || fg, 'fill');
            } else if (/png|jpg/.test(this.opts.fg)) {
                //draw bg img
                this.ctx.drawImg(this.opts.fg, 0, 0, this.wrapWidth, this.wrapHeight);
            }
        }
    },
    wipeStart: function(ctx, e, self) {
        if (e == undefined) return;
        self.startTime = +new Date; //start time
        var x, y;
        if (self.opts.autoWipe) {
            x = e.x;
            y = e.y;
        } else {
            var xy = self.winTcanvasXY(self.canvas, e.touches[0].pageX, e.touches[0].pageY);
            x = xy.x;
            y = xy.y;
        }

        if (!self.opts.autoWipe) {
            if (self.startTime + 20 * 1000 < self.endTime) {
                self.path = [];
            } else {
                self.path.push('pause');
            }
        }

        ctx._gco('destination-out')._lineJoin('round')._lineCap('round')
            .sStyle(this.opts.color).lineW(this.opts.size);

        //draw touchstart without move
        ctx.bPath()._arc(x, y, this.opts.size / 2, 0, Math.PI * 2, true, null, this.opts.color, 'fill').cPath();
        //start path for move
        ctx.bPath()._moveTo(x, y);
    },
    wipeMove: function(ctx, e, self) {
        var x, y;
        if (e == undefined) return;
        if (self.opts.autoWipe) {
            x = e.x;
            y = e.y;
        } else {
            var xy = self.winTcanvasXY(self.canvas, e.touches[0].pageX, e.touches[0].pageY);
            x = xy.x;
            y = xy.y;
        }
        ctx._lineTo(x, y)._stroke();

        //catch data
        !self.opts.autoWipe && self.path.push({
            x: x,
            y: y
        })
    },
    wipeEnd: function(ctx, e, self) {
        self.endTime = +new Date; //end time
        ctx.cPath();
        self.opts.onswiping.call(self, self.wipePercent(self), JSON.stringify(self.path));
        self.opts.debug && console.log(JSON.stringify(self.path));
    },
    setEvent: function() {
        var self = this,
            ctx = this.ctx;

        this.canvas.addEventListener('touchstart', function(e) {
            self.wipeStart(ctx, e, self);
        });
        this.canvas.addEventListener('touchmove', function(e) {
            self.wipeMove(ctx, e, self);
        });
        this.canvas.addEventListener('touchend', function(e) {
            self.wipeEnd(ctx, e, self);
        });
    },
    wipePercent: function(self) {
        //local img will be error ,so use try
        try {
            var that;
            self ? that = self : that = this;

            var hits = 0,
                imgData = that.ctx.getImageData(0, 0, that.cWidth, that.cHeight);

            for (var i = 0, len = imgData.data.length; i < len; i += 4) {
                if (imgData.data[i] === 0 && imgData.data[i + 1] === 0 &&
                    imgData.data[i + 2] === 0 && imgData.data[i + 3] === 0) {
                    hits++;
                }
            }

            return (hits / that.pixels) * 100

        } catch (e) {
            console.log(e)
        }
    },
    //相识度
    similar: function (datasFist, datasSecond) {
        var fLen = datasFist.length,
            sLen = datasSecond.length,
            si = 0;

        for (var i = 0; i < fLen; i++) {
            if (datasFist[i].x == datasSecond[i].x || datasFist[i].x <= datasSecond[i].x + 1 || datasFist[i].x <= datasSecond[i].x - 1) {
                if (datasFist[i].y == datasSecond[i].y || datasFist[i].y <= datasSecond[i].y + 1 || datasFist[i].y<= datasSecond[i].y - 1) {
                    si ++;
                }
            }
        }
        return Math.floor(si / fLen * 100);
    },
    autoWipe: function(datas) {
        var self = this,
            ctx = this.ctx,
            data = datas || self.opts.data,
            len = data.length,
            i = 0,
            animID;

        function animate() {
            //start animation
            animID = requestNextAnimationFrame(animate);

            if (data[i] === 'pause') {
                self.wipeEnd(ctx, data[i], self);
                self.wipeStart(ctx, data[i], self);
                i++;
                if (i >= len - 1) {
                    cancelAnimate(animID);
                    //end
                    self.wipeEnd(ctx, data[len - 1], self);
                }
            } else {
                self.wipeMove(ctx, data[i], self);
                i++;
                if (i >= len - 1) {
                    cancelAnimate(animID);
                    //end
                    self.wipeEnd(ctx, data[len - 1], self);
                }
            }
        }

        //sart
        self.wipeStart(ctx, data[i], self);
        //move
        requestNextAnimationFrame(animate);
    }

};
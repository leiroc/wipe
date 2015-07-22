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
            if (this.opts.fg.charAt(0) === '#' || fg.charAt(0) === '#') {
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



        //move

        /*var i = 1,
            loop = setInterval(function() {
                if (data[i] === 'pause') {
                    i++;
                    self.wipeEnd(ctx, data[i], self);
                    self.wipeStart(ctx, data[i], self);
                    if (i >= len - 1) {
                        clearInterval(loop);
                        //end
                        self.wipeEnd(ctx, data[len - 1], self);
                    }
                } else {
                    self.wipeMove(ctx, data[i], self);
                    i++;
                    if (i >= len - 1) {
                        clearInterval(loop);
                        //end
                        self.wipeEnd(ctx, data[len - 1], self);
                    }
                }
            }, 10);*/
    }

}
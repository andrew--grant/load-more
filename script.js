var LoadMore = function (userOptions) {
    this.options = {
        "pageSize": 10,
        "dataUrl": "",
        "container": "#container",
        "triggerText": "Show More",
        "triggerLoadingText": "...loading",
        "trigger": "#showMoreTrigger",
        "callback": null
    };
    $.extend(this.options, userOptions);
    this._index = 0;
    this._itemsCurrentlyDisplayed = 0;
};

LoadMore.prototype.scrollToElement = function (selector, time, verticalOffset) {
    time = typeof(time) != 'undefined' ? time : 1000;
    verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
    var element = $(selector);
    var offset = element.offset();
    var offsetTop = offset.top + verticalOffset;
    $('html, body').animate({
        scrollTop: offsetTop
    }, time);
};

LoadMore.prototype.loadData = function () {
    var self = this;
    self.triggerFeedback(true);
    var f = function () {
    $.getJSON(self.options.dataUrl,
        function (data) {
            self.triggerFeedback(false);
            var totalResults = data.results.length;
            var items = [];
            var dataArr = data.results.splice(self._index, self.options.pageSize);
            if (dataArr.length > 0) {
                $.each(dataArr, function (key, val) {
                    items.push("<div class='result'><h2>" + val.title + "</h2>" + "<p>" + val.description + "</p></div>");
                });
                $(items.join("")).appendTo(self.options.container);
                var scrollToEl = $(".result").get(self._index);
                self._index += self.options.pageSize;
                if(scrollToEl){
                    // occurs only when not the initial
                    // load of data
                    self.scrollToElement(scrollToEl);
                }

                self._itemsCurrentlyDisplayed += dataArr.length;
                if (self._itemsCurrentlyDisplayed >= totalResults) {
                    self._trigger.hide();
                }
                if (self.options.callback != null) {
                    self.options.callback();
                }
            }
        });
    }

    setTimeout(f, 1000);
};

LoadMore.prototype.triggerFeedback = function (isLoading) {
    if (isLoading) {
        this._trigger.text(this.options.triggerLoadingText);
    } else {
        this._trigger.text(this.options.triggerText);
    }
};

LoadMore.prototype.init = function () {
    var self = this;
    $(document).ready(
        function () {
            self._trigger = $(self.options.trigger);
            self.loadData();
            self._trigger.on("click", function () {
                self.loadData();
            });
        });
};


// example usage
var loadMore = new LoadMore(
    {
        "dataUrl": "data.json",
        "pageSize":3
    });

loadMore.init();
var LoadMore = function (pageSize) {
    this._pageSize = pageSize;
    this._index = 0;
    this._itemsCurrentlyDisplayed = 0;
    this._trigger = null;
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

LoadMore.prototype.loadData = function (dataUrl, callback) {
    var self = this;
    $.getJSON("data.json",
        function (data) {
            var totalResults = data.results.length;
            var items = [];
            var dataArr = data.results.splice(self._index, self._pageSize);
            if (dataArr.length > 0) {
                $.each(dataArr, function (key, val) {
                    items.push("<div class='result'><h2>" + val.title + "</h2>" + "<p>" + val.description + "</p></div>");
                });
                $(items.join("")).appendTo(self._container);
                self.scrollToElement($(".result").get(self._index));
                self._itemsCurrentlyDisplayed += dataArr.length;
                if (self._itemsCurrentlyDisplayed >= totalResults) {
                    self._trigger.hide();
                }
                self._index += self._pageSize;
                if (callback != null) {
                    callback();
                }
            }
        });
};

LoadMore.prototype.init = function (dataUrl, trigger, container, callback) {
    var self = this;
    $(document).ready(
        function () {
            self._container = container;
            self._trigger = $(trigger);
            self.loadData(dataUrl, callback);
            $(trigger).on("click", function () {
                self.loadData(self._index, callback);
            });
        });
};

var loadMore = new LoadMore(4);
loadMore.init(
    "data.json",
    "#load-more",
    "#results",
    function () {
        // todo: feedback anim
        // todo: options approach
        // todo: some unit tests
        // $("#load-more").text(".......");
    });


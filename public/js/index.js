var SortTable = function (options) {
    this.el = document.querySelector(options.el || 'body');
    this.url = options.url || '/data';

    this.init();
};

Origin = SortTable.prototype;

Origin.init = function () {
    var self = this;
    self.getData({}, function (data) {
        var html = self.render(data.data);
        self.el.innerHTML = html;
        // 
        self.evnets();
    });
};
Origin.evnets = function () {
    var self = this;
    self.el.querySelectorAll('th').forEach(function (item, index) {
        item.addEventListener("click", function () {
            var dataMark = self.el.getAttribute('data-mark'),
                dataType = self.el.getAttribute('data-type');

            self.el.querySelectorAll('.sort-icon').forEach(function (item, index) {
                item.classList.remove("icon-up", "icon-down");
            });
            var sortIcon = this.querySelector('.sort-icon'),
                sortObj = {
                    name: this.getAttribute('data-mark'),
                    type: 1
                };

            if (sortObj.name == dataMark) {
                dataType = parseInt(dataType);
                if (dataType == 1) {
                    sortObj.type = 2;
                } else if (dataType == 2) {
                    sortObj.type = 0;
                } else {
                    sortObj.type = 1;
                }
            }
            self.el.setAttribute('data-mark', sortObj.name);
            self.el.setAttribute('data-type', sortObj.type);
            // 
            self.getData(sortObj, function (data) {
                self.el.innerHTML = "...";
                var html = self.render(data.data);
                self.el.innerHTML = html;
                // 
                self.evnets();
            });
        });
    })
};
Origin.render = function (data) {
    var html =
        '<table class="sort-table">' +
        '<thead>' +
        '<tr>' +
        '<th>姓名</th>';
    for (var i = 0; i < data.head.length; i++) {
        html += '<th data-mark="' + data.head[i].mark + '">' + data.head[i].name + '<span class="sort-icon ';
        if (data.head[i].type) {
            html += data.head[i].type == 1 ? "icon-up" : "icon-down";
        }
        html += '"></span></th>';
    }
    html +=
        '</tr>' +
        '</thead>' +
        '<tbody>';
    for (var i = 0; i < data.data.length; i++) {
        html +=
            '<tr>' +
            '<td>' + data.data[i].name + '</td>';
        for (var j = 0; j < data.head.length; j++) {
            html += '<td>' + data.data[i][data.head[j].mark] + '</td>';
        }
        html += '</tr>';
    }
    html +=
        '</tbody>' +
        '</table>';
    return html;
};
Origin.getData = function (param, callback) {
    var self = this;
    //   
    var querystring = [];
    if (param) {
        for (var key in param) {
            querystring.push(key + "=" + param[key]);
        }
        querystring = "?" + querystring.join('&');
    }
    //
    var url = self.url + querystring;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            var data = JSON.parse(this.response);
            // 
            callback && callback.call(self, data);
        } else {
            // error
        }
    };
    request.onerror = function () {
        // error
    };
    request.send();
};


var sorttable = new SortTable({
    el: '#sorttable'
});

document.querySelector(".mock-btn").addEventListener('click',function () {
    var len = document.querySelector(".mock-len").value;
    var cate = document.querySelector(".mock-cate").value;

    if (!len || !cate) {
        alert("必填");
        return;
    }
    var url = "/mock?len=" + len + "&course=" + cate;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            var data = JSON.parse(this.response);
            // 
           alert("成功");
        } else {
            // error
        }
    };
    request.onerror = function () {
        // error
    };
    request.send();

});



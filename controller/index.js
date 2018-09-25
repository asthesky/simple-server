const fs = require('fs');
const path = require('path');

exports.data = (sort) => {
    var data = fs.readFileSync(path.join(__dirname, '../model/index.json'));
    data = JSON.parse(data);
    // 
    if (sort.type) {
        sort.type = parseInt(sort.type);
    } else {
        sort.type = 1;
    }
    // 
    if (sort.type == 0) {
        return data;
    }
    // 
    try {
        data.data = data.data.sort((x, y) => {
            if (sort.type == 1) {
                // 升序
                return x[sort.name] > y[sort.name] ? 1 : -1;
            }
            if (sort.type == 2) {
                // 降序
                return x[sort.name] > y[sort.name] ? -1 : 1;
            }
        });
        data.head.forEach((item, index) => {
            if (item.mark == sort.name) {
                item.type = sort.type;
            }
        });
    } catch (e) {
    }
    return data;
};

var name = [
    "赵钱孙李",
    "周吴郑王",
    "冯陈诸卫",
    "蒋沈韩杨",
    "朱秦尤许",
    "何吕施张",
    "孔曹严华",
    "金魏陶姜",
    "戚谢邹喻",
    "柏水窦章",
    "云苏潘葛",
    "奚范彭郎"
].join('');

var course = {
    "ch": '语文',
    "ma": '数学',
    "en": '英语',
    "ph": '物理',
    "che": '化学',
    "pe": '体育',
}
// 
exports.mack = (param) => {
    var len = param.len < 48 ? param.len : 48;
    var courseList = param.course;
    var mockData = [], mockTh = [], mockLi;
    for (var i = 0; i < len; i++) {
        mockLi = {};
        mockLi.name = "小" + name[i];
        for (var j = 0; j < courseList.length; j++) {
            if (course[courseList[j]]) {
                mockLi[courseList[j]] = Math.round(Math.random() * 50) + 50;
                if (i == 0) {
                    mockTh.push({
                        mark: courseList[j],
                        name: course[courseList[j]]
                    });
                }
            }
        }
        mockData.push(mockLi);
    }
    var writeData = JSON.stringify({
        head: mockTh,
        data: mockData
    });
    fs.writeFileSync(path.join(__dirname, '../model/index.json'), writeData);
}



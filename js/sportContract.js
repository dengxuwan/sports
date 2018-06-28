'use strict';
//评论对象
var Comment = function(obj) {
	if (typeof obj === "string") {
		obj = JSON.parse(obj);
	}
	if (typeof obj === "object") {
		this.id = obj.id;
		this.user = obj.user;
		this.time = obj.time;
		this.content = obj.content;
	} else {
		this.id = "";
		this.user = "";
		this.time = "";
		this.content = "";
	}
};
Comment.prototype = {
	toString: function() {
		return JSON.stringify(this);
	}
};
//活动信息
var ActivityInfo = function(obj) {
	if (typeof obj === "string") {
		obj = JSON.parse(obj);
	}
	if (typeof obj === "object") {
		this.id = obj.id;
		this.name = obj.name;
		this.author = obj.author;
		this.phone = obj.phone;
		this.address = obj.address;
		this.title = obj.title;
		this.category = obj.category;
		this.count = obj.count;
		this.price = obj.price;
		this.remark = obj.remark;
		this.goTime = obj.goTime;
		this.time = obj.time;
		this.attents = obj.attents;
		this.comments = obj.comments;
	} else {
		this.id = "";
		this.name = "";
		this.author = "";
		this.phone = "";
		this.address = "";
		this.title = "";
		this.category = "";
		this.count = "";
		this.price = "";
		this.goTime = "";
		this.remark = "";
		this.time = "";
		this.attents = [];
		this.comments = [];
	}
};
ActivityInfo.prototype = {
	toString: function() {
		return JSON.stringify(this);
	},
	//添加参与者信息
	addAttent: function(attent) {
		if (!this.attents || this.attents == null) {
			this.attents = [];
		}
		if (typeof attent != "undefined") {
			this.attents.push(attent);
		}
	},
	addComment: function(comment) {
		if (!this.comments || this.comments == null) {
			this.comments = [];
		}
		if (typeof comment != "undefined") {
			this.comments.push(comment);
		}
	}
};
//参与者信息对象
var AttentInfo = function(obj) {
	if (typeof obj === "string") {
		obj = JSON.parse(obj);
	}
	if (typeof obj === "object") {
		this.id = obj.id;
		this.address = obj.address;
		this.acvitityId = obj.acvitityId;
		this.name = obj.name;
		this.price = obj.price;
		this.phone = obj.phone;
		this.time = obj.time;
	} else {
		this.id = "";
		this.address = "";
		this.acvitityId = "";
		this.price = "";
		this.name = "";
		this.phone = "";
		this.time = "";
	}
};
AttentInfo.prototype = {
	toString: function() {
		return JSON.stringify(this);
	}
};
//财务记录对象
var FinanceRecord = function(obj) {
	if (typeof obj === "string") {
		obj = JSON.parse(obj);
	}
	if (typeof obj === "object") {
		this.id = obj.id;
		this.activityId = obj.activityId;
		this.from = obj.from;
		this.to = obj.to;
		this.type = obj.type;
		this.price = obj.price;
		this.time = obj.time;
	} else {
		this.id = "";
		this.activityId = "";
		this.from = "";
		this.to = "";
		this.type = "其它";
		this.price = "";
		this.time = "";
	}
};
FinanceRecord.prototype = {
	toString: function() {
		return JSON.stringify(this);
	}
};
var sportContract = function() {
	// 定义全局变量
	LocalContractStorage.defineProperties(this, {
		_currentUser: "", // 当前使用人地址
		_fee: new BigNumber(0.01),
		_wei: 1000000000000000000,
		_jSize: 0
	});
	// 定义全局的map变量
	LocalContractStorage.defineMapProperties(this, {
		"activityInfos": {
			parse: function(value) {
				return new ActivityInfo(value);
			},
			stringify: function(o) {
				return o.toString();
			}
		},
		"activityInfoKeys": {
			parse: function(value) {
				return value.toString();
			},
			stringify: function(o) {
				return o.toString();
			}
		},
		"recordInfos": {
			parse: function(value) {
				return new FinanceRecord(value);
			},
			stringify: function(o) {
				return o.toString();
			}
		},
		"recordInfoKeys": {
			parse: function(value) {
				return value.toString();
			},
			stringify: function(o) {
				return o.toString();
			}
		}
	});
};
sportContract.prototype = {
	init: function() {
		this._currentUser = Blockchain.transaction.from;
		this._fee = new BigNumber(0.01); // 手续费
		this._wei = 1000000000000000000; // 单位
		this._jSize = 0;
		this._rSize = 0;

		var activityInfo = new ActivityInfo({
			id: "one",
			name: "邓先生",
			author: "n1JeDTMq5xHq6Y16yApYbMdT4Vw4K9kzbK9",
			phone: "18907395221",
			address: "深圳南山体育馆01场",
			title: "相约打羽毛球，来的直接支付订场",
			category: "羽毛球",
			count: "5",
			price: "0.0001",
			remark: "自带羽毛球拍，这边羽毛球拍有限，谢谢",
			goTime: "1529111359517",
			time: "1529131359517",
			attents: [],
			comments: []
		});
		this.activityInfoKeys.set(this._jSize, activityInfo.id);
		this.activityInfos.set(activityInfo.id, activityInfo);
		this._jSize++;
	},
	//智能合约中验证地址正确性
	_verifyAddress: function(address) {
		// 1-valid, 0-invalid
		var result = Blockchain.verifyAddress(address);
		return {
			valid: result == 0 ? false : true
		};
	},
	currentUser: function() {
		return this._currentUser;
	},

	resetCurrentUser: function(addr) {
		if (this._currentUser === Blockchain.transaction.from && this.verifyAddress(addr)) {
			this._currentUser = addr;
		} else {
			return 'Permission denied!';
		}
	},

	wei: function() {
		return this._wei;
	},

	resetWei: function(wei) {
		if (this._creator === Blockchain.transaction.from) {
			this._wei = wei;
		} else {
			return 'Permission denied!';
		}
	},

	fee: function() {
		return this._fee;
	},

	resetFee: function(value) {
		if (this._creator === Blockchain.transaction.from) {
			this._fee = new BigNumber(value);
		} else {
			return 'Permission denied!';
		}
	},
	//对象深拷贝
	_deepCopy: function(obj) {
		var objClone;
		if (obj.constructor == Object) {
			objClone = new obj.constructor();
		} else if (obj.constructor == Array && obj.length == 0) {
			objClone = [];
		} else {
			objClone = new obj.constructor(obj.valueOf());
		}
		for (var key in obj) {
			if (objClone[key] != obj[key]) {
				if (typeof(obj[key]) == 'object') {
					if (obj[key].constructor == Array && obj[key].length == 0) {
						objClone[key] = [];
					} else {
						if (obj[key] == null) {
							objClone[key] = null;
						} else {
							objClone[key] = this._deepCopy(obj[key]);
						}
					}
				} else {
					objClone[key] = obj[key];
				}
			}
		}
		objClone.toString = obj.toString;
		objClone.valueOf = obj.valueOf;
		return objClone;
	},
	// 查询所有活动
	getAll: function() {
		var list = [];
		for (var i = 0; i < this._jSize; i++) {
			var key = this.activityInfoKeys.get(i);
			var activityInfo = this.activityInfos.get(key);
			activityInfo['id'] = key;
			list.push(activityInfo);
		}
		list = list.reverse(); //反转
		return list;
	},
	// 查询某类型下的活动
	getByCategory: function(category) {
		var list = [];
		for (var i = 0; i < this._jSize; i++) {
			var key = this.activityInfoKeys.get(i);
			var activityInfo = this.activityInfos.get(key);
			if (category === activityInfo.category) {
				activityInfo['id'] = key;
				list.push(activityInfo);
			}
		}
		list = list.reverse(); //反转
		return list;
	},
	//给活动添加评论
	comment: function(activityId, content) {
		var from = Blockchain.transaction.from;
		var time = Blockchain.transaction.timestamp.toString();
		var id = from + time;
		var activityInfo = this.activityInfoKeys.get(activityId);
		if (!activityInfo) {
			throw new Error("没有找到此活动信息!");
		}
		var comment = new Comment({
			id: id,
			user: from,
			content: content,
			time: time
		});
		activityInfo.addComment(comment);
		this.activityInfoKeys.set(activityId, activityInfo);
		return "success";
	},
	//添加活动信息
	addActivity: function(arg) {
		var from = Blockchain.transaction.from;
		var time = Blockchain.transaction.timestamp.toString();
		var args = new ActivityInfo(arg);
		args.author = from;
		args['id'] = from + time;
		args.comments = [];
		args.attents = [];
		args['time'] = time;

		this.activityInfoKeys.set(this._jSize, args.id);
		this.activityInfos.set(args.id, args);
		this._jSize++;
	},
	// 查询自己发布的活动
	getMyList: function() {
		var from = Blockchain.transaction.from;
		var list = [];
		for (var i = 0; i < this._jSize; i++) {
			var key = this.activityInfoKeys.get(i);
			var activityInfo = this.activityInfos.get(key);
			if (activityInfo.author === from) {
				list.push(activityInfo);
			}
		}
		return list.reverse();
	},
	//参加行程
	attention: function(activityId, name, phone) {
		var from = Blockchain.transaction.from;
		var time = Blockchain.transaction.timestamp.toString();
		var value = Blockchain.transaction.value;
		var activityInfo = this.activityInfos.get(activityId);
		if (!activityInfo) {
			throw new Error("没有找到此活动信息!");
		}
		if (!activityInfo.attents || activityInfo.attents.length >= activityInfo.count) {
			throw new Error("count fail");
		}
		if ((value.div(this._wei)).toString() !== activityInfo.price) {
			throw new Error("Error amount");
		}

		var result = Blockchain.transfer(activityInfo.author, value);
		if (!result) {
			throw new Error("fail transfer");
		}
		var attentInfo = new AttentInfo({
			id: from + time,
			address: from,
			activityId: activityId,
			name: name,
			phone: phone,
			time: time
		});
		activityInfo.addAttent(attentInfo);
		this.activityInfos.set(activityId, activityInfo);

		var id = from + time;
		var record = new FinanceRecord({
			id: id + "1",
			activityId: activityId,
			from: from,
			to: activityInfo.author,
			type: "支出",
			price: activityInfo.price,
			time: time
		});
		var record1 = new FinanceRecord({
			id: id + "2",
			activityId: activityId,
			from: from,
			to: activityInfo.author,
			type: "收入",
			price: activityInfo.price,
			time: time
		});
		this.recordInfoKeys.set(this._rSize, id + "1");
		this.recordInfos.set(id + "1", record);
		this._rSize++;

		this.recordInfoKeys.set(this._rSize, id + "2");
		this.recordInfos.set(id + "2", record1);
		this._rSize++;
		return "success";
	},
	//查看自己参加的活动列表
	getMyAttents: function() {
		var from = Blockchain.transaction.from;
		var list = [];
		for (var i = 0; i < this._jSize; i++) {
			var key = this.activityInfoKeys.get(i);
			var activityInfo = this.activityInfos.get(key);
			var attentInfos = activityInfo.attents;
			if (attentInfos.length > 0) {
				for (var j = 0; j < attentInfos.length; j++) {
					var attentInfo = attentInfos[j];
					if (attentInfo.address === from) {
						list.push(activityInfo);
					}
				}
			}
		}
		return list.reverse();
	},
	//获取我的财务记录
	getMyRecord: function() {
		var from = Blockchain.transaction.from;
		var list = [];
		for (var i = 0; i < this._rSize; i++) {
			var key = this.recordInfoKeys.get(i);
			var record = this.recordInfos.get(key);
			if (record.from === from || record.to === from) {
				list.push(record);
			}
		}
		return list.reverse();
	},
	//查询个人中心需要的信息
	personal: function() {
		var obj = {};
		obj['myActivies'] = this.getMyList();
		obj['attentsRecords'] = this.getMyAttents();
		obj['records'] = this.getMyRecord();
		return obj;
	}
};
module.exports = sportContract;
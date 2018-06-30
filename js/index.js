var vue = new Vue({
      el: '#app',
      created: function() {
            if (!window.webExtensionWallet) {
                  this.$notify({
                        showClose: true,
                        duration: 5000,
                        message: '温馨提示:使用本站所有功能请安装钱包插件，否则将无法正常使用本站功能！',
                        type: 'warning',
                        offset: 100
                  });
            }
            this.getWallectInfo();
            this.getAll();
      },
      mounted: function() {

      },
      updated: function() {},


      data() {
            return {
                  tempVar: true,
                  activityInfo: {
                        name: '',
                        phone: '',
                        address: '',
                        title: '',
                        category: '',
                        count: '',
                        price: '',
                        remark: '',
                        goTime: ''
                  },
                  attentRule: {
                        name: [{
                              trigger: 'change',
                              required: true,
                              message: '请填写姓名.'
                        }],
                        phone: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写联系方式"
                        }],
                  },
                  rules: {
                        name: [{
                              trigger: 'change',
                              required: true,
                              message: '请填写姓名.'
                        }],
                        phone: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写联系方式"
                        }],
                        category: [{
                              trigger: 'change',
                              required: true,
                              message: "请选择分类"
                        }],
                        address: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写场地地点！"
                        }],
                        goTime: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写活动时间！"
                        }],
                        title: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写标题！"
                        }],
                        count: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写剩余座位数！"
                        }],
                        price: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写拼车费用（nas）"
                        }],

                  },
                  allList: [], //所有活动列表
                  cloneList: [],
                  labelWidth: '100px', //表单左边label文字宽度
                  curWallet: "", //钱包地址
                  allListLoading: true,
                  dialogVisible: false,
                  attentInfo: {
                        name: "",
                        phone: "",
                  },
                  clickRow: {}, //点击的行对象
                  detailRow: {
                        name: '',
                        phone: '',
                        address: '',
                        title: '',
                        category: '',
                        count: '',
                        price: '',
                        remark: '',
                        goTime: '',
                        attents: []
                  },
                  tabPosition: 'left',
                  timer: {},
                  serialNumber: '',
                  // 要展开的行，数值的元素是row的key值
                  expands: [],
                  search: {
                        address: '',
                        status: '',
                        category:'羽毛球'
                  },
                  currentName:'羽毛球',
                  currentPostion:'1 1px',
                  options: [{
                      value: '足球',
                      label: '足球'
                    }, {
                      value: '羽毛球',
                      label: '羽毛球'
                    }, {
                      value: '网球',
                      label: '网球'
                    }, {
                      value: '篮球',
                      label: '篮球'
                    }, {
                      value: '乒乓球',
                      label: '乒乓球'
                    },{
                      value: '游泳',
                      label: '游泳'
                    },{
                      value: '健身',
                      label: '健身'
                    },{
                      value: '桌球',
                      label: '桌球'
                    },{
                      value: '瑜伽',
                      label: '瑜伽'
                    }]
            }
      },
      filters: {
            getDateTimeStr: function(v) {
                  var value = Number(v);
                  var y = new Date(value).getFullYear();
                  var m = new Date(value).getMonth() + 1
                  var d = new Date(value).getDate();

                  var h = new Date(value).getHours()
                  var mm = new Date(value).getMinutes()

                  if (m < 10) {
                        m = '0' + m;
                  }
                  if (d < 10) {
                        d = '0' + d;
                  }
                  if (mm < 10) {
                        mm = '0' + mm;
                  }
                  if (h < 10) {
                        h = '0' + h;
                  }
                  var result = y + "-" + m + '-' + d + " " + h + ':' + mm;
                  return result;
            }
      },

      methods: {
            tableRowClassName: function({
                  row,
                  rowIndex
            }) {
                  if (rowIndex % 2 === 0) {
                        return 'success-row';
                  } else if (rowIndex % 2 != 0) {
                        return '';
                  }

            },
            //发布行程
            toPublish: function() {
                  // if (this.curWallet === '') {
                  //       this.$notify({
                  //             showClose: true,
                  //             duration: 0,
                  //             message: '温馨提示:使用本站所有功能请安装钱包插件，否则将无法使用发布行程的功能！',
                  //             type: 'error',
                  //             offset: 150
                  //       });
                  //       return;
                  // }

                  this.$refs['ruleForm'].validate((valid) => {
                        if (valid) {
                              this.publish();
                        } else {
                              console.log('error submit!!');
                              return false;
                        }
                  });
            },
            //获取钱包地址
            getWallectInfo: function() {
                  window.postMessage({
                        "target": "contentscript",
                        "data": {},
                        "method": "getAccount",
                  }, "*");
                  window.addEventListener('message', function(e) {
                        if (e.data && e.data.data) {
                              if (e.data.data.account) {
                                    vue.curWallet = e.data.data.account;
                                    // vue.getAll();
                              }
                        }
                  });
            },
            //处理list
            handleList: function(respArr) {
                  for (var i = 0; i < respArr.length; i++) {
                        var obj = respArr[i];
                        obj['current'] = vue.curWallet;
                        var goTime = obj.goTime;
                        var current = new Date().getTime();
                        if (current > goTime) {
                              obj['status'] = true;
                              obj['statusStr'] = '已过期';
                        } else {
                              obj['status'] = false;
                              obj['statusStr'] = '进行中';
                        }


                        var attents = obj.attents;
                        var isAttent = false;
                        for (var j = 0; j < attents.length; j++) {
                              var attentInfo = attents[j];
                              if (attentInfo.address === vue.curWallet) {
                                    isAttent = true;
                              }
                        }
                        if (isAttent) {
                              obj['statusStr'] = '已参加';
                        }
                        obj['isAttent'] = isAttent;
                  }
                  return respArr;

            },
            //获取所有活动列表
            getAll: function() {
                  this.allListLoading = true;
                  query(config.myAddress, config.getAll, "", function(resp) {
                        console.log(resp, "查询所有活动列表");
                        var respArr = JSON.parse(resp.result);
                        vue.allList = vue.handleList(respArr);
                        vue.cloneList = vue.allList;
                        console.log(vue.allList, "查询所有多动列表");
                        vue.allList = vue.filterCategory(vue.cloneList,'羽毛球');
                        vue.allListLoading = false;
                        vue.tempVar = false;
                  });
            },
            filterCategory: function(list,category) {
                  console.log("将要过滤:"+category);
                  var result = [];
                  if (list && list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                              var activityInfo = list[i];
                              if (activityInfo.category === category) {
                                    result.push(activityInfo);
                              }
                        } 
                  }
                  return result;
            },
            toAttent: function(row) {
                  if (row.attents.length >= row.count) {
                        this.$message({
                              showClose: true,
                              duration: 5000,
                              message: '此活动参与人数已满！',
                              type: 'warning'
                        });
                        return;
                  }
                  this.attentInfo.name = "";
                  this.attentInfo.phone = "";
                  this.clickRow = row;
                  this.dialogVisible = true;
            },
            attent: function() {
                  this.$refs['ruleForm1'].validate((valid) => {
                        if (valid) {
                              if (this.clickRow) {
                                    var name = this.attentInfo.name;
                                    var phone = this.attentInfo.phone;
                                    var price = this.clickRow.price;
                                    var args = [this.clickRow.id, name, phone]
                                    defaultOptions.listener = function(data) {

                                          if (data.txhash) {
                                                vue.dialogVisible = false;
                                                vue.$notify({
                                                      message: "数据需要15秒时间写入区块链,是否成功请耐心等待系统自动通知！",
                                                      duration: 20000,
                                                      showClose: true,
                                                      type: "warning",
                                                      offset: 150
                                                });
                                                var neburl = "https://mainnet.nebulas.io";
                                                var txhash = data.txhash;
                                                intervalQuery = setInterval(() => {
                                                      console.log('wait......');
                                                      axios.post(neburl + "/v1/user/getTransactionReceipt", {
                                                                  hash: txhash
                                                            })
                                                            .then(d => {
                                                                  if (d.data && d.data.result.execute_result !== "") {
                                                                        vue.$confirm('数据已经成功写入区块链,点击查看浏览个人中心', '成功', {
                                                                              confirmButtonText: '查看',
                                                                              cancelButtonText: '取消',
                                                                              type: 'success'
                                                                        }).then(() => {
                                                                              window.location.href = "center.html#personal";
                                                                        }).catch(() => {
                                                                              
                                                                        });
                                                                        // success
                                                                        clearInterval(intervalQuery);
                                                                  } else if (d.data.result.status === 0) {
                                                                        vue.$notify({
                                                                              message: "参与失败，有可能是您的余额不足!",
                                                                              duration: 0,
                                                                              showClose: true,
                                                                              type: "error",
                                                                              offset: 150
                                                                        });
                                                                        clearInterval(intervalQuery);
                                                                  }
                                                            });
                                                }, 6000);
                                          } else {
                                                vue.$notify({
                                                      message: "交易已经取消！",
                                                      duration: 5000,
                                                      showClose: true,
                                                      type: "info",
                                                      offset: 150
                                                });
                                          }

                                    };
                                    var serialNumber = nebPay.call(config.contractAddr, price, config.attention, JSON.stringify(args), defaultOptions);
                                    console.log("交易号为" + serialNumber, "参加行程交易hash");
                              }
                        } else {
                              console.log('error submit!!');
                              return false;
                        }
                  });
            },
            toDetail: function(row) {
                  //处理
                  // row.price = row.price + "nas";
                  // row.count = row.count + "个";
                  this.detailRow = row;
                  $("#portfolioModal1").modal("show");
            },
            funcIntervalQuery: function() {
                  var defaultOptions = {
                        callback: "https://pay.nebulas.io/api/mainnet/pay"
                  }
                  nebPay.queryPayInfo(vue.serialNumber, defaultOptions) //search transaction result from server (result upload to server by app)
                        .then(function(resp) {
                              var respObject = JSON.parse(resp)
                              console.log(respObject, "获取交易状态返回对象") //resp is a JSON string
                              if (respObject.code === 0 && respObject.data.status === 1) { //说明成功写入区块链
                                    vue.getAll();
                                    //关闭定时任务
                                    clearInterval(intervalQuery)
                              }
                        })
                        .catch(function(err) {
                              console.log(err);
                        });
            },
            getRowKeys: function(row) {
                  return row.id;
            },
            toSearch: function() {
                  vue.allListLoading = true;
                  var list = [];
                  for (var i = 0; i < this.cloneList.length; i++) {
                        var obj = vue.cloneList[i];
                        var address = obj.address;
                        var goTime = obj.goTime;
                        var status = obj.statusStr;
                        var category = obj.category;
                        var isFrom = false;
                        var isTo = false;
                        var isStatus = false;
                        console.log(this.search)
                        if (this.search.address.trim() !== '' && !this.search.goTime ) {
                              if (address.indexOf(this.search.address) !== -1 && status.indexOf(this.search.status) !== -1) {
                                    list.push(obj);
                              }
                        } else if (this.search.address.trim() === '' && this.search.goTime) {
                              if (isToday(goTime,this.search.goTime)  && status.indexOf(this.search.status) !== -1) {
                                    list.push(obj);
                              }
                        } else if (this.search.address.trim() === '' && !this.search.goTime) {
                              if (status.indexOf(this.search.status) !== -1) {
                                    list.push(obj);
                              }
                        } else if (this.search.address.trim() !== '' && this.search.goTime) {
                              if (address.indexOf(this.search.from) !== -1 && isToday(goTime,this.search.goTime)  && status.indexOf(this.search.status) !== -1) {
                                    list.push(obj);
                              }
                        } else if (this.search.address.trim() === '' && this.search.goTime) {
                              if (isToday(goTime,this.search.goTime) && status.indexOf(this.search.status) !== -1) {
                                    list.push(obj);
                              }
                        }
                  }
                  vue.allList=vue.filterCategory(list,this.search.category);
                  vue.allListLoading = false;
            },
            clickCategory:function(name){
                  this.search.goTime ='';
                  this.search.address = '';
                  this.search.category = name;
                  var pt = "";
                  if (name == "羽毛球") {
                      pt = "1px 1px";
                  } else if (name == "游泳") {
                      pt = "-2px -80px";
                  } else if (name == "网球") {
                      pt = "0 -149px";
                  } else if (name == "篮球") {
                      pt = "0 -375px";
                  } else if (name == "乒乓球") {
                      pt = "0 -223px";
                  }  else if (name == "足球") {
                      pt = "0 -300px";
                  } else if (name == "壁球") {
                      pt = "2px -450px";
                  } else if (name == "桌球") {
                      pt = "0 -525px";
                  } else if (name == "攀岩") {
                      pt = "0 -600px";
                  } else if (name == "射箭") {
                      pt = "0 -678px";
                  } else if (name == "保龄球") {
                      pt = "0 -750px";
                  } else if (name == "高尔夫") {
                      pt = "-2px -820px";
                  } else if (name == "射击") {
                      pt = "0 -902px";
                  } else if (name == "溜冰") {
                      pt = "0 -978px";
                  } else if (name == "赛车") {
                      pt = "0 -1050px";
                  } else if (name == "排球") {
                      pt = "0 -1125px";
                  } else if (name == "轮滑") {
                      pt = "0 -1200px";
                  } else if (name == "滑板") {
                      pt = "1px -1269px";
                  } else if (name == "自行车") {
                      pt = "0 -1350px";
                  } else if (name == "滑雪") {
                      pt = "0 -1423px";
                  } else if (name == "卡丁车") {
                      pt = "0 -1650px";
                  } else if (name == "马术") {
                      pt = "0 -1575px";
                  } else if (name == "飞镖") {
                      pt = "0 -1500px";
                  } else if (name == "棒球") {
                      pt = "0 -1725px";
                  } else {
                      pt = "1px 1px";
                  }
                  vue.allList = vue.filterCategory(vue.cloneList,name);
                  this.currentPostion = pt;
                  this.currentName = name;
            }
      }
});
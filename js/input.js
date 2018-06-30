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
                  this.infoTitle = "请安装钱包插件!详情请点击导航栏中的使用方法";
                  this.infoType="warning";
            }else{
                  this.getWallectInfo(); 
            }
      },
      mounted: function() {

      },
      updated: function() {},


      data() {
            return {
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
                  labelWidth: '100px', //表单左边label文字宽度
                  curWallet: "", //钱包地址
                  dialogVisible: false,
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
                  // 要展开的行，数值的元素是row的key值
                  expands: [],
                  search: {
                        address: '',
                        status: ''
                  }, 
                  isShow: true,
                  infoTitle:"",
                  infoType:"success",
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
                    }],
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
                                    vue.infoTitle = "您的钱包地址:" + vue.curWallet;
                                    vue.infoType="success";
                              }
                        }
                  });
            },
            publish: function() {
                  var args = [JSON.stringify(vue.activityInfo)];
                  defaultOptions.listener = function(data) {
                        if (data.txhash) {
                              vue.$notify({
                                    message: "发布活动需要15秒时间写入区块链,写入成功之后会自动提醒您,请耐心等待！",
                                    duration: 20000,
                                    showClose: true,
                                    type: "warning",
                                    offset: 200
                              });
                              //清空
                              vue.activityInfo = {
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

                                    console.log("交易号为" + vue.serialNumber, "发布活动交易hash");
                              var neburl = "https://mainnet.nebulas.io";
                              var txhash = data.txhash;
                              intervalQuery = setInterval(() => {
                                    console.log('wait......');
                                    axios.post(neburl + "/v1/user/getTransactionReceipt", {
                                                hash: txhash
                                          })
                                          .then(d => {
                                                if (d.data && d.data.result.execute_result !== "") {
                                                      vue.$confirm('行程已经成功写入区块链, 点击查看?', '成功', {
                                                            confirmButtonText: '查看',
                                                            cancelButtonText: '取消',
                                                            type: 'success'
                                                      }).then(() => {
                                                            window.location.href = "index.html#allListTable";
                                                      }).catch(() => {

                                                      });
                                                      // success
                                                      clearInterval(intervalQuery);
                                                } else if (d.data.result.status === 0) {
                                                      vue.$notify({
                                                            message: "发币失败，有可能是您的余额不足!",
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
                                    message: "已经取消发布活动！",
                                    duration: 5000,
                                    showClose: true,
                                    type: "warning",
                                    offset: 200
                              });
                        }
                  };

                  vue.serialNumber = nebPay.call(config.contractAddr, "0", config.addActivity, JSON.stringify(args), defaultOptions);

            },
            toDetail: function(row) {
                  //处理
                  // row.price = row.price + "nas";
                  // row.count = row.count + "个";
                  this.detailRow = row;
                  $("#portfolioModal1").modal("show");
            },
            getRowKeys: function(row) {
                  return row.id;
            }
      }
});
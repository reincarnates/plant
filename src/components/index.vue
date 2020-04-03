<template>
  <div class="index">
    <el-tabs v-model="activeName">
      <el-tab-pane label="产品列表" name="first">
        <el-table :data="tableData" border="" style="width: 100%">
          <!-- <el-table-column fixed prop="id" label="ID" width="150"></el-table-column> -->
          <!-- <el-table-column prop="name" label="产品图片" width="120"></el-table-column> -->
          <el-table-column prop="name" label="产品名" width="520"></el-table-column>
          <el-table-column prop="number" label="SKU" width="120"></el-table-column>
          <!-- <el-table-column prop="buy" label="购货价" width="300"></el-table-column> -->
          <el-table-column prop="sell" label="销货价" width="120"></el-table-column>
          <el-table-column prop="status_txt" label="状态" width="160"></el-table-column>
          <el-table-column prop="production" label="产能" width="160"></el-table-column>
          <el-table-column prop="authentication" label="认证信息" width="360"></el-table-column>
          <el-table-column prop="attr_str" label="鉴定标准" width="321"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right; margin-top: 25px;">
          <el-pagination
            @current-change="handleCurrentChange"
            background=""
            layout="prev, pager, next"
            :total="tableCount"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="事务列表" name="second">
        <div class="btn-grow">
          <el-button type="primary" plain @click="addAffairStatus = true">创建事务</el-button>
        </div>
        <el-row>
          <el-col :span="6">
            <el-row class="tac">
              <el-col :span="24">
                <el-menu class="el-menu-vertical-demo">
                  <el-menu-item
                    v-for="(item, indexs) in workData"
                    :key="indexs"
                    :index="indexs + ''"
                    @click="menuClick(item)"
                    class="text-more"
                  >
                    <span slot="title" class="text-more" :title="item.title" style="margin-left: 10px;">{{item.title}}</span>
                    <el-tag size="small" v-if="item.status == 1">进行中</el-tag>
                    <el-tag size="small" type="success" v-if="item.status == 2">已完成</el-tag>
                    <el-tag size="small" type="danger" v-if="item.status == 3">已作废</el-tag>
                    <el-button class="btn" type="primary" size="mini" @click.stop="resetStatus(item.id)">修改状态</el-button>
                  </el-menu-item>
                </el-menu>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="4">
            <div class="remark-wrapper">
              <div v-if="isRemark">
                <el-col :span="24">
                  <div style="margin-bottom: 8px;">填写事务备注：</div>
                </el-col>
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入备注"
                  v-model="textarea">
                </el-input>
                <div style="margin-top: 10px; text-align: right;">
                  <el-button type="primary" size="mini" @click="confirmResetPrice2">发表</el-button>
                </div>
              </div>
              <div
                v-if="remarkData.length != 0"
                v-for="(item, index) in remarkData"
                :key="index"
                style="margin-top: 10px;"
              >
                <div style="font-size: 12px;">{{item.time}}</div>
                <div style="margin-top: 5px;">{{item.data}}</div>
              </div>
              <div style="color: #909399; line-height: 150px; text-align: center;" v-if="remarkData.length == 0">暂无数据</div>
            </div>
          </el-col>
          <el-col :span="14">
            <el-button type="primary" v-if="isAffair" @click="editAffiar">编辑报价单</el-button>
            <el-table :data="goodsData" border="" style="width: 100%; margin-top: 20px;">
              <!-- <el-table-column fixed prop="id" label="ID" width="150"></el-table-column> -->
              <!-- <el-table-column prop="name" label="产品图片" width="120"></el-table-column> -->
              <el-table-column prop="name" label="产品名" width="166"></el-table-column>
              <el-table-column prop="number" label="SKU" width="120"></el-table-column>
              <!-- <el-table-column prop="buy" label="购货价" width="300"></el-table-column> -->
              <el-table-column prop="price" label="报价" width="120"></el-table-column>
              <el-table-column prop="status_txt" label="状态" width="120"></el-table-column>
              <el-table-column prop="production" label="产能" width="120"></el-table-column>
              <el-table-column prop="authentication" label="认证信息" width="240"></el-table-column>
              <el-table-column label="证书文件" width="120">
                <template slot-scope="scope">
                  <a v-if="scope.row.auth_name != ''" :href="scope.row.authfile">{{scope.row.auth_name}}</a>
                  <div v-else>暂无文件</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button @click="revise(scope.row)" type="text" style="color: #8896b3; margin-left: 10px;" v-if="scope.row.is_ok == 0">修改报价</el-button>
                  <br>
                  <el-button @click="confirmPrice(scope.row)" type="text" style="color: #5cbb7a; margin-left: 10px;" v-if="scope.row.is_ok == 0">确认报价</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- <div style="text-align: right; margin-top: 25px;">
            <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="tableCount"> </el-pagination>
            </div>-->
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="修改报价" :visible.sync="dialogFormVisible" width="30%">
      <el-input
        placeholder="请输入报价"
        v-model="priceVal"
        clearable>
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmResetPrice" :loading="btnLoding">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑报价单" :visible.sync="dialogTableVisible" width="80%">
      <el-col :span="24">
        <div style="text-align: right;">
          <el-button type="primary" @click="addGoodsStatus = true">添加商品</el-button>
        </div>
      </el-col>
      <el-table :data="gridData">
        <el-table-column property="name" label="商品信息" width="330"></el-table-column>
        <el-table-column prop="number" label="SKU" width="120"></el-table-column>
        <el-table-column property="sell" label="单价" width="100"></el-table-column>
        <el-table-column label="报价" width="210">
          <template slot-scope="scope">
            <el-input placeholder="请输入报价" v-model="scope.row.price" :disabled="scope.row.is_ok != 0" clearable @input="changeState = 1"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="status_txt" label="状态" width="150"></el-table-column>
        <el-table-column prop="production" label="产能" width="150"></el-table-column>
        <el-table-column prop="authentication" label="认证信息" width="200"></el-table-column>
        <el-table-column label="证书文件" width="120">
          <template slot-scope="scope">
            <a v-if="scope.row.auth_name != ''" :href="scope.row.authfile">{{scope.row.auth_name}}</a>
            <div v-else>暂无文件</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="deleteAffair(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmGoods" :loading="btnLoding3">确 定</el-button>
      </div>
    </el-dialog>
    
    <el-dialog title="添加商品" :visible.sync="addGoodsStatus" width="70%">
      <el-table ref="multipleTable" :data="tableData2" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable='checkboxT' width="55"></el-table-column>
        <el-table-column property="name" label="商品信息" width="330"></el-table-column>
        <el-table-column prop="number" label="SKU" width="120"></el-table-column>
        <el-table-column property="sell" label="销货价格" width="100"></el-table-column>
        <el-table-column prop="status_txt" label="状态" width="150"></el-table-column>
        <el-table-column prop="production" label="产能" width="150"></el-table-column>
        <el-table-column prop="authentication" label="认证信息" width="370"></el-table-column>
      </el-table>
      <div style="text-align: right; margin-top: 25px;">
        <el-pagination
          @current-change="handleCurrentChange"
          background=""
          layout="prev, pager, next"
          :total="tableCount"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGoodsStatus = false">取 消</el-button>
        <el-button type="primary" @click="checkGoods">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加事务" :visible.sync="addAffairStatus" width="30%">
      <el-row>
        <el-col :span="24">
          <div style="font-size: 16px; margin-bottom: 15px;">事务标题</div>
        </el-col>
        <el-col :span="24">
          <el-input placeholder="请输入事务标题" v-model="affairTitle"></el-input>
          <div style="margin-top: 10px;">
            <el-tag type="info" @click="getTagsVal('【询价】')">询价</el-tag>
            <el-tag type="info" @click="getTagsVal('【沟通】')">沟通</el-tag>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAffairStatus = false">取 消</el-button>
        <el-button type="primary" @click="createAffair" :loading="btnLoding4">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改事务状态" :visible.sync="resetAffairStatus" width="20%">
      <el-row>
        <el-col :span="24">
          <el-select v-model="value" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetAffairStatus = false">取 消</el-button>
        <el-button type="primary" @click="confirmResetAffiar">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { showFullScreenLoading, hideFullScreenLoading } from "../until/loading.js";
var self, service;
export default {
  name: "index",
  data() {
    return {
      activeName: "second",
      tableData: [],
      tableData2: [],
      tableCount: null,
      workData: [],
      goodsData: [],
      remarkData: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      priceVal: '',
      resetPriceId: null,
      btnLoding: false,
      btnLoding2: false,
      btnLoding3: false,
      btnLoding4: false,
      menuId: null,
      textarea: '',
      remarkId: '',
      dialogTableVisible: false,
      gridData: [],
      addGoodsStatus: false,
      multipleSelection: [],
      goodsTitle: '',
      affairTitle: '',
      isRemark: false,
      addAffairStatus: false,
      isAffair: false,
      changeState: 0,
      typeData: '',
      resetAffairStatus: false,
      options: [{
        value: '1',
        label: '进行中'
      }, {
        value: '2',
        label: '已完成'
      }, {
        value: '3',
        label: '已作废'
      }],
      value: '',
      resetAffirId: '',
    };
  },

  created() {
    self = this;
    service = this.$service;
  },

  mounted() {
    showFullScreenLoading();
    self.getTable2(1);
    self.getWoking();
  },

  methods: {
    //下载文件弹框
    handleClick(tab, event) {
      this.$alert(`<div>文件名称：${tab.auth_name}<a target="_blank" href="${tab.authfile}" download="${tab.auth_name}">点击下载</a></div>`, "文件下载", {
          dangerouslyUseHTMLString: true
        }
      );
    },

    //获取事务列表
    getWoking() {
      service.get("http://diankeyun.com/page/index/geWorkingList", {}, function(res) {
        if (res.code == 0) {
          hideFullScreenLoading();
          self.workData = res.data;
        }
      });
    },

    //产品列表分页
    handleCurrentChange(val) {
      self.getTable2(val);
      self.menuClick(self.menuId);
    },

    //获取产品列表
    getTable(index) {
      showFullScreenLoading();
      service.get(
        "http://diankeyun.com/page/index/getGoodsList",
        { page: index, limit: 10 },
        function(res) {
          if (res.code == 0) {
            hideFullScreenLoading();
            self.tableData = res.data;
            self.tableData2 = res.data;
            self.tableCount = res.count;
          }
        }
      );
    },

    //获取产品列表
    getTable2(index) {
      showFullScreenLoading();
      service.get(
        "http://diankeyun.com/page/index/getGoodsList",
        { page: index, limit: 10 },
        function(res) {
          if (res.code == 0) {
            hideFullScreenLoading();
            self.tableData = res.data;
            self.tableData2 = res.data;
            self.tableCount = res.count;

            //添加商品的表格
            self.tableData2.forEach(item => {
              //编辑报价单的表格
              self.gridData.forEach(element => {
                if(item.id == element.goods & item.name == element.name) {
                  item.status2 = 0;
                }
              });
            });
          }
        }
      );
    },

    //点击事务列表获取备注和报价信息
    menuClick(item) {
      showFullScreenLoading();
      self.menuId = item.id;
      self.typeData = item.type_data;
      self.isRemark = true;
      self.isAffair = true;
      self.tableData2.forEach(item => {
        item.status2 = 1;
      });
      service.get(
        "http://diankeyun.com/page/index/geWorkingData",
        { id: item.id == undefined ? item : item.id },
        function(res) {
          if (res.code == 0) {
            hideFullScreenLoading();
            self.goodsData = res.data.goods;
            self.gridData = JSON.parse(JSON.stringify(res.data.goods));
            self.remarkData = res.data.log;
            
            
            //添加商品的表格
            self.tableData2.forEach(item => {
              //编辑报价单的表格
              self.gridData.forEach(element => {
                if(item.id == element.goods & item.name == element.name) {
                  item.status2 = 0;
                }
              });
            });
          } else if (res.data.length == 0) {
            hideFullScreenLoading();
            self.$message.error(res.msg);
            self.goodsData = [];
            self.gridData = [];
            self.remarkData = [];
            self.isRemark = false;
            self.isAffair = false;
          }
        }
      );
    },

    //修改报价
    revise(data) {
      console.log(data.id);
      self.resetPriceId = data.id;
      self.dialogFormVisible = true;
    },

    //确定修改报价
    confirmResetPrice() {
      var reg = /^\d+$|^\d*\.\d+$/g;
      if(!reg.test(self.priceVal)) {
        self.$message.error("输入格式有误，请输入数字。");
      } else if(self.priceVal == '') {
        self.$message.error("报价不能为空！");
      } else {
        self.btnLoding = true;
        service.get("http://diankeyun.com/page/index/upadatasell", { id: self.resetPriceId, value: self.priceVal }, function(res) {
          if(res.code == 0) {
            console.log(res);
            self.btnLoding = false;
            self.dialogFormVisible = false;
            self.menuClick(self.menuId);
          }
        });
      }
    },

    //确认报价
    confirmPrice(data) {
      console.log(data);
      const h = this.$createElement;
      this.$msgbox({
        title: '提示',
        message: h('p', null, '确认报价之后将不可更改, 是否继续?'),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            service.get("http://diankeyun.com/page/index/save_price", { id: data.id }, function(res) {
              if(res.code == 0) {
                done();
                instance.confirmButtonLoading = false;
                self.menuClick(self.menuId);
              }else {
                self.$message.error(res.msg);
              }
            });
            // setTimeout(() => {
            //   done();
            //   setTimeout(() => {
            //     instance.confirmButtonLoading = false;
            //   }, 300);
            // }, 3000);
          } else {
            done();
          }
        }
      }).then(action => {
        this.$message({
          type: 'success',
          message: '确认成功!'
        });
      });
    },

    //添加备注
    confirmResetPrice2() {
      console.log(self.menuId);
      if(self.textarea != '') {
        service.get('http://diankeyun.com/page/index/addWorkingLog', { wid: self.menuId, data: self.textarea }, function(res) {
          if(res.code == 0) {
            console.log(res);
            self.menuClick(self.menuId);
          }
        });
      } else {
        self.$message.error("备注不能为空！");
      }
    },

    handleSelectionChange(val) {
      self.multipleSelection = val;
    },

    //选择商品
    checkGoods() {
      self.multipleSelection.forEach((item, index) => {
        self.gridData.push({
          id: item.id,
          name: item.name,
          sell: item.sell,
          price: '',
          is_ok: 0
        });
      });
      self.addGoodsStatus = false
    },

    //复选框
    checkboxT(row,index){
      if(row.status2 != 0){
        return 1;
      }else{
        return 0;
      }
    },

    //选择标签
    getTagsVal(val) {
      self.affairTitle = val + self.affairTitle;
      console.log(self.affairTitle);
    },

    //删除报价单
    deleteAffair(data) {
      var index = self.gridData.indexOf(data);
      self.gridData.splice(index, 1);
    },

    //确定编辑报价单
    confirmGoods() {
      self.btnLoding3 = true;
      var params = {
        id: self.typeData,
        goods: []
      };
      // if(self.changeState == 0) {
      //   self.$message.error('请填写报价！');
      //   return false;
      // }
      self.gridData.forEach(item => {
        params.goods.push({
            id: item.goods != undefined ? item.goods : item.id,
            price: item.price,
            is_ok: item.is_ok
          })
      });
      console.log(params);
      service.post('page/page/index/addsale', params, function(res) {
        console.log(res);
        if(res.code == 0) {
          self.btnLoding3 = false;
          self.dialogTableVisible = false;
          self.$message({
            message: '修改报价单成功',
            type: 'success'
          });
          self.menuClick(self.menuId);
        }else{
          self.btnLoding3 = false;
          self.dialogTableVisible = false;
          self.$message.error(res.msg);
        }
      });
      // if(self.goodsTitle == '') {
      //   self.$message.error('请输入标题');
      // }else {
      //   service.post('page/page/index/addsale', params, function(res) {
      //     console.log(res);
      //   });
      // }
    },

    //创建事务
    createAffair() {
      self.btnLoding4 = true;
      if(self.affairTitle == '') {
        self.$message.error('请填写标题！');
      } else {
        service.get('http://diankeyun.com/page/index/addWorking', { title: self.affairTitle }, function(res) {
          if(res.code == 0) {
            self.btnLoding4 = false;
            self.addAffairStatus = false;
            self.$message({
              message: '创建成功',
              type: 'success'
            });
            self.getWoking();
          }
        });
      }
    },

    //点击报价单
    editAffiar() {
      self.dialogTableVisible = true;
      if(self.gridData.length == 0) {
        self.gridData = JSON.parse(JSON.stringify(self.goodsData));
      }
    },

    //修改事务状态
    resetStatus(id) {
      self.resetAffirId = id;
      self.resetAffairStatus = true;
    },

    //确定修改事务状态
    confirmResetAffiar() {
      service.post('page/page/index/updataWorking', { id: self.resetAffirId, status: self.value }, function(res) {
        if(res.code == 0) {
          self.resetAffairStatus = false;
          self.$message({
            message: '修改成功',
            type: 'success'
          });
          self.getWoking();
        }else {
          self.$message.error(res.msg);
          self.resetAffairStatus = false;
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a{
  text-decoration: none;
}
.title-more {
  width: 100%;
  height: 800px;
  overflow-y: auto;
}
.title {
  line-height: 50px;
  color: #333;
  font-weight: bold;
  font-size: 20px;
  padding: 0 20px;
  box-sizing: border-box;
  cursor: pointer;
}
.el-menu {
  height: 100%;
  overflow-y: auto;
  border-top: solid 1px #e6e6e6;
  border-left: solid 1px #e6e6e6;
  border-bottom: solid 1px #e6e6e6;
}
.btn {
  position: absolute;
  right: 20px;
  top: 14px;
}
.index {
  padding: 10px;
  box-sizing: border-box;
}
.remark-wrapper {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  font-size: 16px;
}
.btn-grow{
  padding: 20px 0;
  box-sizing: border-box;
}
</style>

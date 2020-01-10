<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <!-- 绘制form表单相关 -->
      <!-- search:寻找  searchForm: 数据检索的表单数据对象成员 -->
      <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
        <el-form-item label="文章状态：">
          <el-radio v-model="searchForm.status" label>全部</el-radio>
          <el-radio v-model="searchForm.status" :label=" 0 ">草稿</el-radio>
          <el-radio v-model="searchForm.status" :label=" 1 ">待审核</el-radio>
          <el-radio v-model="searchForm.status" :label=" 2 ">审核通过</el-radio>
          <el-radio v-model="searchForm.status" :label=" 3 ">审核失败</el-radio>
        </el-form-item>
        <el-form-item label="频道列表：">
          <el-select v-model="searchForm.channel_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间选择：">
          <el-date-picker
            v-model="timetotime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条符合条件的内容</span>
      </div>
      <el-table :data="articleList" style="width: 100%" border>
        <el-table-column prop="cover.images[0]" label="图标">
          <!-- 体现img图片标签效果 -->
          <!-- 想方设法把“当前的文章对象数据记录”获得到，进而获得对应的 cover.images[0]，以用于img标签显示使用
              数据通过“作用域插槽”体现的，名称为"row"
          -->
          <img
            slot-scope="stData"
            :src="stData.row.cover.images[0]"
            alt="没有图标"
            width="150"
            height="100"
          >
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>

        <el-table-column prop="status" label="状态">
          <!-- 获得“当前文章对象的status状态”数据，做判断进而显示对应的内容效果
          作用域插槽要被使用，与获取图标原理一致-->
          <!-- 如果许多标签都需要接收插槽数据，处于代码优雅考虑，可以通过一个名称为template的父标签统一接收 -->
          <template slot-scope="stData">
            <el-tag v-if="stData.row.status===0">草稿</el-tag>
            <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
            <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
            <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <!-- 修改、删除不属于数据部分，只是普通的按钮，那么可以不用设置prop，对应的内容可以通过el-table-column的标签“内容区域”体现 -->
        <el-table-column label="操作">
          <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </el-table-column>
      </el-table>

      <!-- 分页效果 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="  [10, 20, 30, 40]  "
        :page-size="searchForm.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
        <!-- <el-pagination
        @size-change="handleSizeChange" // 事件，每页条数变化的回调处理
        @current-change="handleCurrentChange" // 事件，当前页码变化的回调处理
        :current-page="currentPage4" // 属性绑定，默认当前页码，默认第1页
        :page-sizes="  [100, 200, 300, 400]  " // 属性绑定，下拉列表，设定每页显示条数
        :page-size="100"  // 属性绑定，设置默认每页显示条数的
        layout="total, sizes, prev, pager, next, jumper" // 分页布局元素构成
        :total="400" // 属性绑定，设置记录总条数
      ></el-pagination> -->
    </el-card>
  </div>
</template>

<script>
export default {
  // 每个组件都要设置一个唯一属性值的name属性，好处：在devtools里边方便寻找当前的组件
  name: 'Article',

  // 监听器设置
  watch: {
    // 对searchForm做深度监听
    searchForm: {
      handler: function (newV, oldV) {
        // console.log(newV)
        // 根据变化后的各个筛选条件，重新获得文章列表
        this.getArticleList()
      },
      deep: true
    },

    // 被检测的成员: function (newV, oldV) {
    //   // newV:数据变化后样子
    //   // oldV:数据变化前样子
    // }
    // 被检测成员一般就是data成员,它们的名称保持一致
    timetotime: function (newV) {
      // 把接收到的时间信息一分为二给到 begin_pubdate 和 end_pubdate
      if (newV) {
        this.searchForm.begin_pubdate = newV[0]
        this.searchForm.end_pubdate = newV[1]
      } else {
        // 清除时间信息
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    }
  },

  data () {
    return {
      articleList: [], // 文章列表
      tot: 0, // 文章总条数
      channelList: [], // 频道列表
      timetotime: '', // 时间范围临时接收成员
      // 检索表单数据对象
      searchForm: {
        page: 1, // 当前数据记录页码(默认)
        per_page: 10, // 分页数据记录每页条数(10~50)
        begin_pubdate: '', // 开始时间
        end_pubdate: '', // 结束时间
        channel_id: '', // 频道id
        status: '' // 文章状态，''-全部, 0-草稿，1-待审核，2-审核通过，3-审核失败
      }
    }
  },
  created () {
    // 获得频道
    this.getChannelList()
    // 获得文章
    this.getArticleList()
  },
  methods: {
    // 分页相关
    // 每条条数变化的回调处理
    handleSizeChange (val) {
      // val: 变化后的每页条数
      // 更新每页条数
      this.searchForm.per_page = val
      // 根据变化后的每页条数重新获得文章列表
      // this.getArticleList()
    },
    // 页码变化的回调处理
    handleCurrentChange (val) {
      // val: 变化后的页码
      // 更新页码
      this.searchForm.page = val
      // 根据变化后页码重新获得文章列表
      // this.getArticleList()
    },

    // 获得真实文章列表数据
    getArticleList () {
      // 把searchForm内部为空的成员都"过滤掉"
      let searchData = {}
      for (var i in this.searchForm) {
        // i:代表对象的成员属性名称, status、channel_id、begin_pudate等等
        if (this.searchForm[i] || this.searchForm[i] === 0) {
          // 成员值非空
          searchData[i] = this.searchForm[i]
        }
      }

      let pro = this.$http({
        url: '/mp/v1_0/articles',
        method: 'get',
        params: searchData
      })
      pro
        .then(result => {
          console.log(result)
          // data接收文章数据
          this.articleList = result.data.data.results
          // 接收总条数
          this.tot = result.data.data.total_count
        })
        .catch(err => {
          return this.$message.error('获得文章失败：' + err)
        })
    },
    // 获得真实频道列表数据
    getChannelList () {
      let pro = this.$http({
        url: '/mp/v1_0/channels',
        method: 'get'
      })
      pro
        .then(result => {
          // console.log(result)
          // data接收频道数据
          this.channelList = result.data.data.channels
        })
        .catch(err => {
          return this.$message.error('获得频道失败：' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
/*给卡片区设置统一样式*/
.box-card {
  margin-bottom: 15px;
}
/*分页组件样式*/
.el-pagination{margin-top:15px;}
</style>

<template>
  <div>
    <!--搜索卡片区-->
    <el-card class="box-card">
      <!--命名插槽，头部内容-->
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <!--匿名插槽，内容主体-->
      <div class="text item">
        <!--el-form搜索表单区域-->
        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态：">
            <el-radio v-model="searchForm.status" label>全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
            <el-radio v-model="searchForm.status" label="4">已删除</el-radio>
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
              start-placeholder="begin_pubdate"
              end-placeholder="end_pubdate"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  data () {
    return {
      // 搜索表单数据对象
      channelList: [],
      searchForm: {
        begin_pubdate: '', // 文章发布开始时间
        end_pubdate: '', // 文章发布结束时间
        status: '0', // 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部
        channel_id: ''
      },
      timetotime: []
    }
  },
  methods: {
    getChannelList () {
      let pro = this.$http({
        url: '/mp/v1_0/channels',
        method: 'get'
      })
      pro
        .then(result => {
          console.log(result)
          // data接收频道数据
          this.channelList = result.data.data.channels
        })
        .catch(err => {
          return this.$message.error('获得频道失败：' + err)
        })
    }
  },
  created () {
    this.getChannelList()
  },
  watch: {
    timetotime: function (newV) {
      if (newV) {
        this.searchForm.begin_pubdate = newV[0]
        this.searchForm.end_pubdate = newV[1]
      } else {
        // 清除时间信息
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    }
  }
}
</script>

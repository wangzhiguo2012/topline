<template>
  <div class="login-container">
    <div class="login-box">
     <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
       <img src="./logo_index.png" alt="">
         <el-form-item prop="mobile">
        <el-input v-model="loginForm.mobile" placeholder="请输入手机号码">
           <i slot="prefix" class="iconfont icon-shouji"></i>
        </el-input>
         </el-form-item>
         <el-form-item prop="code">
        <el-input v-model="loginForm.code" placeholder="请输入验证码">
                 <i slot="prefix" class="iconfont icon-yanzhengma"></i>
        </el-input>
        </el-form-item>
           <el-form-item style="text-align:left;" prop="xieyi">
        <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px;"></el-checkbox>
          <span>我已经阅读并同意
            <a href="#">用户协议</a>和
            <a href="#">隐私条款</a>
          </span>

       </el-form-item>
        <el-form-item>
          <el-button
           style="width:100%;"
           :loading="isLoading"
           :disabled="isLoading"
           type="primary"
           @click="login()">登录</el-button>
          </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
// 导入极验的gt.js文件本身没有做模块
// 内部有名称为initGeetest 的全局变量
import '@/assets/font/iconfont.css'
import './gt.js'
export default {

  data () {
    // 声明局部函数，实现校验
    var xieyiTest = function (rule, value, callback) {
      // rule:校验规则，一般不用
      // value:当前被校验的信息
      // callback：回调函数，校验成功或失败都需要执行
      // if (value) {
      //   callback()
      // } else {
      //   return callback(new Error('请无条件遵守规矩'))
      // }

      value ? callback() : callback(new Error('请无条件遵守规矩'))
    }

    return {
      capObj: null,
      isLoading: false, // 设置按钮是否处在等待在状态,和是否禁用
      loginForm: {
        mobile: '15271550677',
        code: '246810',
        xieyi: false

      },
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [
          { required: true, message: '验证码必填' }
        ],
        xieyi: [
          // {validator:函数名字}自定义校验
          { validator: xieyiTest }
        ]

      }
    }
  },
  methods: {
    login () {
      // 表单要做校验
      // el - form表单对象.validate()
      // console.log(this)
      // this.$refs.loginFormRef// 获得el-form的组件对象
      // this.$refs.loginFormRef.validate(回调函数)

      this.$refs.loginFormRef.validate(valid => {
        // vaild:true校验通过
        // valid:false校验失败
        // 校验失败,代码停止
        if (!valid) {
          return false
        }

        if (this.capObj !== null) {
          // return this.ctaObj.verify()
          return this.capObj.verify()// 激活窗口显示
        }
        // 注意：按钮等待 要在 之后设置
        this.isLoading = true

        // 服务端账号真实校验
        let pro = this.$http({
          url: '/mp/v1_0/captchas/' + this.loginForm.mobile,
          method: 'get'
        })
        pro
          .then(result => {
            // 从result里边解构下述的data对象出来()
            let { data } = result.data
            // console.log(result)
            window.initGeetest({
            // 以下配置参数来自服务端 SDK对象结构赋值
              gt: data.gt,
              challenge: data.challenge,
              offline: !data.success,
              new_captcha: true,
              product: 'bind'
            }, captchaObj => {
              // 这里可以调用验证实例 captchaObj 的实例方法
              // captchObj极验窗口对象
              captchaObj.onReady(() => {
                // 验证码ready之后才能调用verify方法显示验证码(可以显示窗口了)
                captchaObj.verify() // 显示验证码窗口
                this.isLoading = false
                this.capObj = captchaObj
              }).onSuccess(() => {
                // 行为校验正确的处理
                // B. 验证账号，登录系统
                this.loginAct()
              }).onError(() => {
                // 行为校验错误的处理
              })
            })
          })
          .catch(err => {
            return this.$message.error('获取秘钥失败' + err)
          })
        // this.loginAct()
      })
    },
    // 账号真实性检验
    loginAct () {
      let pro = this.$http({
        url: '/mp/v1_0/authorizations',
        method: 'POST',
        data: this.loginForm
      })
      pro
        .then(result => {
          // 路由编程式导航
          // this.$router.push('/home')
          // console.log(result) // 【data】  status statusText headers config request
          // 客户端浏览器把服务器端返回的秘钥等相关信息通过 sessionStorage 做记录，表明是登录状态
          window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
          // console.log(result)

          this.$router.push({ name: 'home' })
        })// name属性实现编程式导航
        .catch(err => {
          this.$message.error('手机号码或验证码错误' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: pink;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
   background-image:url('./login_bg.jpg');
   background-size: cover;
  .login-box {
    width: 410px;
    height: 340px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-form {
      width: 75%;
    }
  }

}
</style>

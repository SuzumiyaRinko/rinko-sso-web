<template>
  <div class="sso">
    <!-- 主页面 -->
    <div class="top">
      <img
        class="logo"
        :src="`${$store.state.SystemConst.resourcesPrefix}${logo}`"
        alt="logo"
      />
      <div class="title">
        <span>Rinko-AssAss噢！</span>
      </div>
    </div>
    <div class="login">
      <van-button type="primary" @click="loginShow = true">登录</van-button>
    </div>
    <div class="register">
      <van-button type="default" disabled @click="readyToRegister()"
        >注册</van-button
      >
    </div>
    <div style="color: red; margin-top: 0.1rem">
      ** 目前暂时不开放注册功能 **
    </div>
    <div class="loginAnonymously">
      <van-button color="grey" @click="loginAnonymouslyShow = true"
        >匿名登录</van-button
      >
    </div>
    <div class="bottom">
      <span>
        SuzumiyaRinko<br />
        CopyRight© 114514
      </span>
    </div>

    <!-- 注册 -->
    <van-dialog
      v-model:show="registerShow"
      title="注册"
      show-cancel-button
      confirm-button-text="注册"
      :before-close="onBeforeRegisterClose"
    >
      <van-form>
        <van-cell-group inset>
          <!-- 账号 -->
          <van-field
            v-model.trim="userRegisterDTO.username"
            required
            clearable
            label="邮箱"
            left-icon="envelop-o"
            placeholder="请输入邮箱"
            :rules="[{ validator: verifyMail, message: '邮箱格式错误' }]"
            :formatter="formatter"
          />
          <!-- 密码 -->
          <van-field
            v-model.trim="userRegisterDTO.password"
            type="password"
            required
            clearable
            maxlength="16"
            show-word-limit
            label="密码"
            left-icon="user-o"
            placeholder="请输入密码"
            :rules="[
              {
                validator: verifyPassword,
                message:
                  '密码格式错误 (长度为8-16，只能由A-Z,a-z,0-9以及下划线组成)',
              },
            ]"
            :formatter="formatter"
          />
          <!-- 确认密码 -->
          <van-field
            v-model.trim="userRegisterDTO.confirmPassword"
            type="password"
            required
            clearable
            maxlength="16"
            show-word-limit
            label="确认密码"
            left-icon="certificate"
            placeholder="请确认密码"
            :formatter="formatter"
          />
          <!-- 验证码 -->
          <van-field
            v-model.trim="userRegisterDTO.code"
            required
            clearable
            maxlength="4"
            show-word-limit
            label="验证码"
            left-icon="shield-o"
            placeholder="请输入验证码"
            :formatter="formatter"
          />
          <div class="verifyCode">
            <img :src="base64Code" alt="验证码" />
            <van-button type="default" @click="reflushCode()"
              >刷新验证码</van-button
            >
          </div>
        </van-cell-group>
      </van-form>
    </van-dialog>

    <!-- 登录 -->
    <van-dialog
      v-model:show="loginShow"
      title="登录"
      show-cancel-button
      confirm-button-text="登录"
      :before-close="onBeforeLoginClose"
    >
      <van-form>
        <van-cell-group inset>
          <!-- 账号 -->
          <van-field
            v-model.trim="userLoginDTO.username"
            required
            clearable
            label="邮箱"
            left-icon="envelop-o"
            placeholder="请输入邮箱"
            :rules="[{ validator: verifyMail, message: '邮箱格式错误' }]"
            :formatter="formatter"
          />
          <!-- 密码 -->
          <van-field
            v-model.trim="userLoginDTO.password"
            type="password"
            required
            clearable
            maxlength="16"
            show-word-limit
            label="密码"
            left-icon="user-o"
            placeholder="请输入密码"
            :rules="[
              {
                validator: verifyPassword,
                message:
                  '密码格式错误 (长度为8-16，只能由A-Z,a-z,0-9以及下划线组成)',
              },
            ]"
            :formatter="formatter"
          />
        </van-cell-group>
      </van-form>
    </van-dialog>

    <!-- 匿名登录 -->
    <van-dialog
      v-model:show="loginAnonymouslyShow"
      title="是否匿名登录"
      show-cancel-button
      confirm-button-text="登录"
      :before-close="onBeforeLoginAnonymouslyClose"
    >
      <span style="font-size: 0.3rem; color: red"
        >匿名登录用户在退出登录之后<br />无法再次登录该账号</span
      >
    </van-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";
import { showDialog, showNotify } from "vant";
import {
  getVerifyCode,
  register,
  login,
  loginAnonymously,
} from "@/api/registerOrLogin.js";
import {
  refreshAuthToken,
} from "@/util/utils.js";
import { showToast } from "vant";

import Cookies from "js-cookie";

export default {
  setup() {
    onMounted(async () => {
      var totalHeight = document.documentElement.clientHeight;
      document.querySelector(".logo").style.height = `${
        (totalHeight * 30) / 100
      }px`;

      // 欢迎
      showDialog({
        title: "欢迎使用",
        message: "🥰",
        theme: "round-button",
      });
    });

    onBeforeRouteLeave(() => {
      // oldRouter
      window.sessionStorage.setItem("oldRouter", "/");
    });

    // router
    const router = useRouter();
    // vuex
    const store = useStore();

    // logo
    const logo = ref("/logo.png");

    // Dialog开关
    const registerShow = ref(false);
    const loginShow = ref(false);
    const loginAnonymouslyShow = ref(false);

    // 弹出注册Dialog
    const readyToRegister = async () => {
      // 打开注册Dialog
      registerShow.value = true;
      // 获取验证码
      await reflushCode();
    };

    // 验证码
    let base64Code = ref("");

    // 刷新验证码
    const reflushCode = async () => {
      var baseResponse = (await getVerifyCode()).data;
      var verifyCodeVO = baseResponse.data;
      userRegisterDTO.correctCode = verifyCodeVO.code;
      base64Code.value = verifyCodeVO.base64Img;
      window.sessionStorage.setItem("uuid4Register", verifyCodeVO.uuid);
    };

    // 注册数据
    const userRegisterDTO = reactive({
      username: "",
      password: "",
      confirmPassword: "",
      code: "", // 用户输入的验证码
      correctCode: "", // 正确的验证码
      uuid: "", // 用户的唯一标识
    });

    // 登录数据
    const userLoginDTO = reactive({
      username: "",
      password: "",
    });

    // 校验邮箱
    const verifyMail = (val) => {
      var regex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      return regex.test(val);
    };

    // 校验密码
    const verifyPassword = (val) => {
      var regex = /^[A-Za-z0-9_]{8,16}$/;
      return regex.test(val);
    };

    const formatter = (str) => str.replace(/\s/g, "");

    // 注册Dialog关闭前的判断
    const onBeforeRegisterClose = async (action) => {
      if (action === "confirm") {
        // 数据格式
        if (
          !verifyMail(userRegisterDTO.username) ||
          !verifyPassword(userRegisterDTO.password) ||
          !verifyPassword(userRegisterDTO.confirmPassword)
        ) {
          showToast({
            message: "请填写好注册信息",
            icon: "cross",
          });
          return;
        }
        // password和confirmPassword
        if (userRegisterDTO.password != userRegisterDTO.confirmPassword) {
          showToast({
            message: "两次密码不一致",
            icon: "cross",
          });
          return;
        }

        var newUserRegisterDTO = {
          username: "",
          password: "",
          confirmPassword: "",
          code: "", // 用户输入的验证码
          uuid: "", // 用户的唯一标识
        };
        newUserRegisterDTO.username = userRegisterDTO.username;
        newUserRegisterDTO.password = userRegisterDTO.password;
        newUserRegisterDTO.confirmPassword = userRegisterDTO.confirmPassword;
        newUserRegisterDTO.code = userRegisterDTO.code;
        newUserRegisterDTO.uuid =
          window.sessionStorage.getItem("uuid4Register");

        var baseResponse = (await register(newUserRegisterDTO)).data;
        if (baseResponse.code != 200) {
          var exMessage = baseResponse.message;
          showToast({
            message: exMessage,
            icon: "cross",
          });
          return;
        }
        // 提醒用户激活账号
        showDialog({
          title: "注册成功",
          message: "软件将会发送一个邮件至您的邮箱\n请在30分钟内激活账号",
          theme: "round-button",
        });
      }
      registerShow.value = false;
    };

    // 登录Dialog关闭前的判断
    const onBeforeLoginClose = async (action) => {
      if (action === "confirm") {
        if (
          !verifyMail(userLoginDTO.username) ||
          !verifyPassword(userLoginDTO.password)
        ) {
          showToast({
            message: "请填写好登录信息",
            icon: "cross",
          });
          return;
        }
        // 登录
        var baseResponse = (await login(userLoginDTO)).data;
        if (baseResponse.code != 200) {
          var exMessage = baseResponse.message;
          showToast({
            message: exMessage,
            icon: "cross",
          });
          return;
        }
        // 保存Token到Cookie
        refreshAuthToken(baseResponse.data);

        // 跳转到SSO_backTo
        showDialog({
          title: "登录成功",
          message: "确认后将跳转到主页",
          theme: "round-button",
        }).then(() => {
          var SSO_backTo = Cookies.get("SSO_backTo");
          if(SSO_backTo == null) {
            
          }
          window.location.href = SSO_backTo;
        });
      }
      loginShow.value = false;
    };

    // 匿名登录Dialog关闭前的判断
    const onBeforeLoginAnonymouslyClose = async (action) => {
      if (action === "confirm") {
        // 登录
        var baseResponse = (await loginAnonymously()).data;
        if (baseResponse.code != 200) {
          var exMessage = baseResponse.message;
          showToast({
            message: exMessage,
            icon: "cross",
          });
          return;
        }
        // 保存Token到Cookie
        refreshAuthToken(baseResponse.data);

        // 跳转到SSO_backTo
        showDialog({
          title: "登录成功",
          message: "确认后将跳转到主页",
          theme: "round-button",
        }).then(() => {
          var SSO_backTo = Cookies.get("SSO_backTo");
          window.location.href = SSO_backTo;
        });
      }
      loginAnonymouslyShow.value = false;
    };

    return {
      router,
      store,
      logo,
      registerShow,
      loginShow,
      loginAnonymouslyShow,
      readyToRegister,
      base64Code,
      reflushCode,
      userRegisterDTO,
      userLoginDTO,
      verifyMail,
      verifyPassword,
      formatter,
      onBeforeRegisterClose,
      onBeforeLoginClose,
      onBeforeLoginAnonymouslyClose,
    };
  },
  components: {},
};
</script>

<style lang="less">
.sso {
  margin: 0 auto;
  text-align: center;
  .top {
    opacity: 0.8;
    .logo {
      margin: 0 auto;
      display: flex;
      margin-top: 1rem;
    }
    .title {
      text-align: center;
      font-size: 0.8rem;
      font-weight: 700;
      font-family: "Microsoft YaHei";
      margin-bottom: 1rem;
    }
  }
  .login {
    margin-top: 1rem;
    .van-button {
      width: 75%;
    }
  }
  .register {
    margin-top: 0.5rem;
    .van-button {
      width: 75%;
    }
  }
  .loginAnonymously {
    margin-top: 0.5rem;
    .van-button {
      width: 75%;
    }
  }
  .bottom {
    position: relative;
    display: block;
    // height: 100%;
    margin-top: 3.2rem;
    opacity: 0.8;
    text-align: center;
    span {
      position: absolute;
      bottom: 0;
      left: 3.5rem;
      // margin: 0 0.1rem;
      // text-align: center;
      font-size: 0.3rem;
      font-weight: 700;
      font-family: "Microsoft YaHei";
    }
  }
  .verifyCode {
    display: flex;
    justify-content: space-between;
    margin: 0 1.2rem;
  }
  .van-dialog__content {
    width: 100%;
    margin: 0.3rem auto;
  }
  .van-cell__title {
    width: 1.8rem;
  }
}
</style>

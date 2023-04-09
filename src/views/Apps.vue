<template>
  <div class="apps">
    <!-- Apps -->
    <div class="appsDiv">
      <span class="appsDivTitle">请选择应用</span>
      <!-- 遍历appDescription -->
      <div v-for="(appDescription, idx) in appDescriptions" key="idx">
        <div
          v-if="appDescription.isAvailable"
          class="appDescription"
          @click="abledClick(appDescription.appUrl)"
        >
          <img
            class="appDescriptionIcon"
            :src="`${$store.state.SystemConst.resourcesPrefix}${appDescription.iconUrl}`"
            alt="程序图标"
          />
          <span class="appDescriptionAppName">{{
            appDescription.appName
          }}</span>
        </div>
        <div
          v-if="!appDescription.isAvailable"
          class="appDescription appDisabled"
          @click="disabledClick()"
        >
          <img
            class="appDescriptionIcon"
            :src="`${$store.state.SystemConst.resourcesPrefix}${appDescription.iconUrl}`"
            alt="程序图标"
          />
          <span class="appDescriptionAppName">{{
            appDescription.appName
          }}</span>
        </div>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="logout">
      <van-button color="#d2221e" @click="logoutShow = true"
        >退出登录</van-button
      >
    </div>

    <!-- 确认gotoApp -->
    <van-dialog
      v-model:show="gotoAppShow"
      title="是否前往该应用"
      show-cancel-button
      confirm-button-text="确认"
      :before-close="onBeforeGotoAppClose"
    >
    </van-dialog>

    <!-- 确认logout -->
    <van-dialog
      v-model:show="logoutShow"
      title="是否退出登录"
      show-cancel-button
      confirm-button-text="确认"
      :before-close="onBeforeLogoutClose"
    >
    </van-dialog>
  </div>
</template>

<script>
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";
import { showDialog, showNotify } from "vant";
import { showToast } from "vant";

import { logout } from "@/api/registerOrLogin.js";
import { getApps } from "@/api/apps.js";
import { refreshAuthToken } from "@/util/utils.js";

import Cookies from "js-cookie";

export default {
  setup() {
    onBeforeMount(async () => {
      // appDescriptions
      appDescriptions.value = (await getApps()).data.data;
      console.log("appDescriptions", appDescriptions);
    });
    onMounted(async () => {
      var totalHeight = document.documentElement.clientHeight;
      document.querySelector(".appsDiv").style.height = `${
        (totalHeight * 60) / 100
      }px`;
      document.querySelector(".logout").style.height = `${
        (totalHeight * 5.5) / 100
      }px`;
    });

    onBeforeRouteLeave(() => {});

    // router
    const router = useRouter();
    // vuex
    const store = useStore();

    // logo
    const logo = ref("/logo.png");

    // appDescriptions
    const appDescriptions = ref([]);

    // Dialog开关
    const gotoAppShow = ref(false);
    const logoutShow = ref(false);

    const abledClick = (appUrl) => {
      gotoAppShow.value = true;
      window.sessionStorage.setItem("appUrl", appUrl);
    };

    const disabledClick = () => {
      showToast({
        message: "当前应用暂时不可使用",
        icon: "cross",
      });
    };

    const onBeforeGotoAppClose = async (action) => {
      if (action === "confirm") {
        gotoAppShow.value = false;
        window.location.href = window.sessionStorage.getItem("appUrl");
      }

      gotoAppShow.value = false;
    };

    // "退出登录Dialog"关闭前的判断
    const onBeforeLogoutClose = async (action) => {
      if (action === "confirm") {
        // 跳转到登录页面
        await logout();
        router.push("/");
      }
      logoutShow.value = false;
    };

    return {
      router,
      store,
      logo,
      appDescriptions,
      gotoAppShow,
      logoutShow,
      abledClick,
      disabledClick,
      onBeforeGotoAppClose,
      onBeforeLogoutClose,
    };
  },
  components: {},
};
</script>

<style lang="less">
.apps {
  margin: 0 auto;
  text-align: center;
  .appsDiv {
    // border: solid 1px black;
    margin-top: 0.5rem;
    .appsDivTitle {
      font-size: 0.7rem;
      font-weight: 700;
    }
    .appDescription {
      margin: 0.5rem auto;
      height: 1.5rem;
      width: 8rem;
      // padding-top: 0.5rem;
      // padding-bottom: 0.5rem;
      border: solid 2px black;
      border-radius: 1.5rem;
      box-shadow: 0 0 12px 1px #201f1f;
      .appDescriptionIcon {
        display: inline-block;
        vertical-align: middle;
        margin-top: 0.2rem;
        width: 1rem;
        height: 1rem;
        border-radius: 0.5rem;
        border: solid 3px black;
      }
      .appDescriptionAppName {
        display: inline-block;
        vertical-align: middle;
        margin-top: 0.2rem;
        margin-left: 0.5rem;
        font-size: 0.5rem;
        font-weight: 700;
        line-height: 1rem;
      }
    }
    .appDisabled {
      background-color: rgb(150, 146, 146);
    }
  }
  .logout {
    position: absolute;
    bottom: 1rem;
    .van-button {
      box-shadow: 0 0 12px 1px #201f1f;
      border-radius: 2rem;
      width: 6rem;
      height: 0.9rem;
      left: 2rem;
      bottom: 0.6rem;
    }
  }
}
</style>

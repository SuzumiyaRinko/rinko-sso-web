<template>
  <router-view />
</template>

<script>
export default {
  setup() {
    return {
    };
  },
};
</script>

<style lang="less">
html {
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
a {
  color: black;
}
.van-theme-dark body {
  color: #f5f5f5;
  background-color: black;
}
.van-notify {
  font-size: 0.4rem;
  text-align: center;
  font-weight: 600;
  color: #f5f5f5;
}
</style>

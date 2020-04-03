<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}

html,
body,
#app{
  width: 100%;
  height: 100%;
}

.text-more{
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  position: relative;
  border-bottom: 1px solid #e6e6e6;
}

.text-more:last-child{
  border-bottom: none;
}

.el-tabs__header {
  margin: 0 !important;
}
</style>

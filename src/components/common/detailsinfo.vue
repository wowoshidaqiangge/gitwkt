<template>
  <div class="detailsProduct">
    <div class="detailTop">
      <p>{{ title }}</p>
      <el-button type="add" icon="el-icon-back" @click="goback"> 返回</el-button>
    </div>
    <div class="detailcon">
      <div style="margin-bottom:15px">
        <div style="padding:0 0 10px 20px;font-weight:600;font-size:15px">{{ infotitle }}</div>
        <div class="infolist">
          <div class="info" v-for="(item, index) in infolist" :key="index">
            <p>
              <span>{{ item.name }}：</span>
            </p>
            <p>{{ item.value }}</p>
          </div>
        </div>
      </div>
    </div>
    <slot name="content"></slot>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String
    },
    infotitle: {
      type: String
    },
    infolist: {
      type: Array
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    goback() {
      this.$emit('goback', false);
    }
  }
};
</script>

<style lang="less">
.detailsProduct {
  width: 100%;
  height: 99%;
  border: 1px solid #ccc;
  border-radius: 3px;
  .detailTop {
    height: 50px;
    background: rgb(230, 235, 241);
    padding: 0 10px;
    display: flex;
    align-items: center;
    p {
      flex: 1;
      color: rgb(50, 25, 112);
      font-weight: 600;
    }
  }
  .detailcon {
    padding: 10px 20px;
    p {
      height: 35px;
      line-height: 35px;
    }
    .infolist {
      display: flex;
      flex-wrap: wrap;
      .info {
        width: 25%;
        display: flex;

        p {
          flex: 1;
        }
      }
      .info p:nth-of-type(1) {
        text-align: end;
        span {
          margin-right: 15px;
        }
      }
    }
  }
}
</style>

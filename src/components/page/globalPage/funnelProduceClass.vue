<template>
  <el-main class="chartContent">
    <div class="chart" id="funnelProduceClass"></div>
  </el-main>
</template>
<script>
import { produceClass } from '@/api/globalPage';
import { Chart } from '@antv/g2';

export default {
  data() {
    return {};
  },
  mounted() {
    this.funnelProduceClassFunc();
  },
  created() {},
  methods: {
    // 设备运行情况
    funnelProduceClassFunc() {
      produceClass()
        .then(res => {
          res = res.data;
          console.log('中下', res);
          let chartData = {
            data: [],
            other: [],
            otherRatio: 0
          };
          for (let i = 0; i < res.length; i++) {
            const { productName, rate } = res[i];
            const obj = { type: productName, value: parseFloat(res[i].rate) };
            chartData.data.push(obj);
          }

          chartData.otherRatio = parseFloat(res[3].rate);
          // debugger;
          for (let oitem of res[3].otherTypeList) {
            const { productName, rate } = oitem;
            const obj = { type: productName, value: parseFloat(oitem.rate) };
            chartData.other.push(obj);
          }
          // debugger;
          this.drawChart(chartData);
        })
        .catch(function(error) {
          console.log(error);
          debugger;
        });
    },
    drawChart(chartData) {
      // const otherRatio = 6.67 / 100; // Other 的占比
      const otherRatio = chartData.otherRatio / 100; // Other 的占比

      const otherOffsetAngle = otherRatio * Math.PI; // other 占的角度的一半
      // const data = [
      //   { type: '微博', value: 93.33 },
      //   { type: '其他', value: 6.67 }
      // ];
      // const other = [
      //   { type: '论坛', value: 1.77 },
      //   { type: '网站', value: 1.44 },
      //   { type: '微信', value: 1.12 },
      //   { type: '客户端', value: 1.05 },
      //   { type: '新闻', value: 0.81 },
      //   { type: '视频', value: 0.39 },
      //   { type: '博客', value: 0.37 },
      //   { type: '报刊', value: 0.17 }
      // ];
      const data = chartData.data;
      const other = chartData.other;
      const chart = new Chart({
        container: 'funnelProduceClass',
        autoFit: true,
        height: 500
      });
      chart.legend(false);
      chart.tooltip({
        showMarkers: true,
        opacity: '0.8',
        showTitle: false
        // itemTpl: '<li>{name}: {value}%</li>'
      });
      const view1 = chart.createView({
        region: {
          start: {
            x: 0,
            y: 0
          },
          end: {
            x: 0.5,
            y: 1
          }
        }
      });
      view1.coordinate('theta', {
        radius: 0.7,
        startAngle: 0 + otherOffsetAngle,
        endAngle: Math.PI * 2 + otherOffsetAngle
      });
      view1.data(data);
      view1.interaction('element-highlight');
      view1
        .interval()
        .adjust('stack')
        .position('value')
        .color('type', ['#49EADE', '#38c060', '#D6802C', '#2593fc'])
        .label('value', function() {
          return {
            offset: -15,
            style: { fill: '#eee' },
            content: obj => {
              return obj.type + '\n' + obj.value + '%';
            }
          };
        });

      const view2 = chart.createView({
        region: {
          start: {
            x: 0.5,
            y: 0.1
          },
          end: {
            x: 1,
            y: 0.9
          }
        }
      });
      view2.axis(false);
      view2.data(other);
      view2.interaction('element-highlight');
      view2
        .interval()
        .adjust('stack')
        .position('value')
        .color('type', ['#0CA1D8', '#D6802CFF', '#D6B02CFF', '#8CD62CFF', '#54BB2FFF', '#2CD6D0FF', '#A452EFFF'])
        .label('value', {
          position: 'right',
          offsetX: 5,
          offsetY: 10,
          style: { fill: '#eee' },
          content: obj => {
            return obj.type + ' ' + obj.value + '%';
          }
        });
      chart.render();
      drawLinkArea();
      chart.on('afterpaint', function() {
        drawLinkArea();
      });

      /* ---------绘制连接区间-----------*/
      function drawLinkArea() {
        const canvas = chart.getCanvas();
        const container = chart.backgroundGroup;
        const view1_coord = view1.getCoordinate();
        const center = view1_coord.getCenter();
        const radius = view1_coord.getRadius();
        const interval_geom = view2.geometries[0];
        const interval_container = interval_geom.container;
        const interval_bbox = interval_container.getBBox();
        const view2_coord = view2.getCoordinate();
        // area points
        const pie_start1 = {
          x: center.x + Math.cos(Math.PI * 2 - otherOffsetAngle) * radius,
          y: center.y + Math.sin(Math.PI * 2 - otherOffsetAngle) * radius
        };
        const pie_start2 = {
          x: center.x + Math.cos(otherOffsetAngle) * radius,
          y: center.y + Math.sin(otherOffsetAngle) * radius
        };
        const interval_end1 = {
          x: interval_bbox.minX,
          y: view2_coord.end.y
        };
        const interval_end2 = {
          x: interval_bbox.minX,
          y: view2_coord.start.y
        };
        const path = [
          ['M', pie_start1.x, pie_start1.y],
          ['L', pie_start2.x, pie_start2.y],
          ['L', interval_end2.x, interval_end2.y],
          ['L', interval_end1.x, interval_end1.y],
          ['Z']
        ];
        container.addShape('path', {
          attrs: {
            path,
            fill: '#8CCCF3'
          }
        });
        canvas.draw();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.chartContent {
  .chart {
    width: 100%;
    height: 100%;
  }
}
</style>

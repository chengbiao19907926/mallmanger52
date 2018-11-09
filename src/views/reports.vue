<template>
<el-card>
      <my-bread level1="数据统计" level2="数据统计"></my-bread>
      <!-- Echarts容器  -->
          <div id="main"
          ref="main"
          style="width: 600px;height:400px;"></div>
</el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  mounted() {
    this.useEcharts()
  },
  methods: {
    async useEcharts() {
      const myChart = echarts.init(this.$refs.main);

// legend: {data: Array(5)}
// series: (5) [{…}, {…}, {…}, {…}, {…}]
// xAxis: [{…}]
// yAxis: [{…}]

      const option2 = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },

        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      }
      const res = await this.$http.get(`reports/type/1`)
      console.log(res)




      const option1 = res.data.data
// arr = [...arr1,...arr2]
// ES6 ...展开运算符
// ...数组
// ...对象
const option = {...option1,...option2}

      myChart.setOption(option);

/*  */
// var obj = {
//   name:'abc'
// }
// var obj1 = {...obj}
// // obj===obj1
// console.log(obj===obj1);
// ES6 ...数组 ...对象


    }
  }
}
</script>


<style>
</style>

 <!-- 1. npm i echarts
 2. 设置容器 要给宽高
 3. init初始化容器
 4. 设置数据 option1+option2
 5. setOption()设置数据 -->

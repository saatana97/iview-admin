<template>
	<div class="container"></div>
</template>
<script>
import MathUtils from '@/utils/MathUtils';
import ObjectUtils from '@/utils/ObjectUtils';
import DictAPI from '@/api/dict';
const theme = 'macarons';
export default {
	name: 'AdminHome',
	data() {
		return {
			user: {},
			statistics: {
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				rechargeCount: 0,
				sendCount: 0,
				statusReportSuccRate: 0,
				userCount: 0,
				statusReportErrorRate: 0,
				statusReportSucc: 0,
				statusReportUnknownRate: 0,
				thirtyData: [],
				telemData: []
			},
			opts: {
				proType: []
			}
		};
	},
	async mounted() {
		this.user = JSON.parse(this.$store.session('user') || '{}');
		this.drawChart1();
		this.drawChart2();
		this.drawChart3();
	},
	methods: {
		async drawChart1() {
			let el = document.querySelectorAll('.chart')[0];
			if (!el) {
				return;
			}
			let chart = this.$echarts.init(el, theme);
			const opt = {
				title: {
					text: '各运营商状态成功量占比'
				},
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b} : {c} ({d}%)'
				},
				legend: {
					data: [],
					x: 'right',
					orient: 'vertical'
				},
				series: [
					{
						name: '运营商',
						type: 'pie',
						radius: ['50%', '80%'],
						data: [],
						legend: {
							orient: 'vertical',
							y: 'top',
							x: 'right',
							data: ['移动', '联通', '电信']
						},
						// roseType: "radius",
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								lineStyle: {
									color: 'rgba(255, 255, 255, 0.3)'
								}
							}
						},
						animationType: 'scale',
						animationEasing: 'elasticOut',
						animationDelay: function(idx) {
							return Math.random() * 200;
						}
					}
				]
			};
			for (let telecom in this.statistics.telemData) {
				opt.legend.data.push(telecom);
				opt.series[0].data.push({
					value: this.statistics.telemData[telecom] || 0,
					name: telecom
				});
			}
			chart.setOption(opt);
		},
		async drawChart2() {
			let el = document.querySelectorAll('.chart')[1];
			if (!el) {
				return;
			}
			let chart = this.$echarts.init(el, theme);
			const opt = {
				title: {
					text: '各产品类型当天发送量'
				},
				tooltip: {},
				legend: {
					data: [],
					x: 'right',
					orient: 'vertical'
				},
				xAxis: {
					data: [],
					silent: false,
					splitLine: {
						show: false
					}
				},
				yAxis: {
					minInterval: 1
				},
				series: [],
				animationEasing: 'elasticOut',
				animationDelayUpdate: function(idx) {
					return idx * 5;
				}
			};
			opt.legend.data = this.opts.proType;
			this.opts.proType.forEach((item, index) => {
				opt.series.push({
					name: item,
					type: 'bar',
					data: [this.statistics[index + 1]],
					animationDelay: function(idx) {
						return idx * 10;
					}
				});
			});
			chart.setOption(opt);
		},
		async drawChart3() {
			let el = document.querySelectorAll('.chart')[2];
			if (!el) {
				return;
			}
			let chart = this.$echarts.init(el, theme);
			const opt = {
				title: { text: '近三十天发送量数据趋势（单位：条）' },
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						crossStyle: {
							color: '#999'
						}
					}
				},
				toolbox: {
					feature: {
						dataView: { show: true, readOnly: false },
						magicType: { show: true, type: ['line', 'bar'] },
						restore: { show: true },
						saveAsImage: { show: true }
					}
				},
				legend: {
					data: ['状态报告成功量', '网关成功量']
				},
				xAxis: [
					{
						type: 'category',
						data: [],
						axisPointer: {
							type: 'shadow'
						},
						axisLabel: {
							rotate: 45
						}
					}
				],
				yAxis: [
					{
						type: 'value',
						name: '状态报告成功量',
						minInterval: 1,
						axisLabel: {
							formatter: value => {
								return new Number(value).toLocaleString();
							}
						}
					},
					{
						type: 'value',
						name: '网关成功量',
						minInterval: 1,
						axisLabel: {
							formatter: value => {
								return new Number(value).toLocaleString();
							}
						}
					}
				],
				series: [
					{
						name: '状态报告成功量',
						type: 'bar',
						data: []
					},
					{
						name: '网关成功量',
						type: 'line',
						yAxisIndex: 1,
						data: []
					}
				]
			};
			opt.xAxis[0].data = [];
			opt.series[0].data = [];
			opt.series[1].data = [];
			for (let i = 29; i >= 0; i--) {
				let date = Date.today()
					.addDays(i * -1)
					.toFormat('MM/DD');
				let data = [];
				let temp = this.statistics.thirtyData.find(item => {
					return date === new Date(item.statisticDateLong).toFormat('MM/DD');
				});
				if (temp) {
					data = [date, temp.statusReportSucc, temp.sendCount];
				} else {
					data = [date, 0, 0];
				}
				opt.xAxis[0].data.push(data[0]);
				opt.series[0].data.push(data[1]);
				opt.series[1].data.push(data[2]);
			}
			chart.setOption(opt);
		}
	}
};
</script>
<style lang="scss" scoped>
.container {
	.el-card {
		border-radius: 10px !important;
		margin-bottom: 1%;
		&:nth-child(1) {
			min-height: 150px;
		}
		&:nth-child(2) {
			min-height: 500px;
		}
	}
	.user-info {
		.user-photo {
			border-radius: 50%;
			width: 100px;
			height: 100px;
		}
		.el-form {
			.el-form-item {
				margin: 0;
			}
		}
	}
	div {
		p {
			text-align: center;
			&:nth-child(1) {
				font-size: 1.2em;
			}
			&:nth-child(2) {
				font-size: 1.6em;
				margin-top: 10px;
			}
		}
	}
	.chart {
		width: 40%;
		margin: 0 5%;
		height: 230px;
		&.fill {
			margin: 0;
			width: 100%;
		}
	}
}
</style>

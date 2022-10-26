<template>
	<div class="adLayout" @click="rightClick=false" @mouseup="release">
		<!-- 导入 -->
		<div class="import">
			<div>
				<p>图片</p>
			</div>
			<div>
				<p>视频</p>
			</div>
			<div>
				<p>时间</p>
			</div>
			<div>
				<p>音频</p>
			</div>
			<div>
				<p>多媒体</p>
			</div>
		</div>
		<!-- 容器 -->
		<div class="container">
			<div class="canvas">
				<div ref="canvas" @mousemove="move">
					<div :style="{pointerEvents: item.check ? 'none' : 'all', zIndex: item.zindex}" v-for="item,index in dataList" :key="index" :ref="'target'+index" @click="clickItem(index)" @mousedown="longPress($event, index)" @contextmenu.prevent="openMenu">
						<div class="resources">
                            <!-- 图片 -->
							<img :src="item.url" v-if="item.type == 'img'">
                            <!-- 视频 -->
                            <video :src="item.url" autoplay loop v-if="item.type == 'video'"></video>
						</div>
						<div class="border" v-show="item.active">
							<div @mousedown.stop="anchorPoint($event, 'nw')"></div>
							<div @mousedown.stop="anchorPoint($event, 'n')"></div>
							<div @mousedown.stop="anchorPoint($event, 'ne')"></div>
							<div @mousedown.stop="anchorPoint($event, 'w')"></div>
							<div @mousedown.stop="anchorPoint($event, 'e')"></div>
							<div @mousedown.stop="anchorPoint($event, 'sw')"></div>
							<div @mousedown.stop="anchorPoint($event, 's')"></div>
							<div @mousedown.stop="anchorPoint($event, 'se')"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="size">
				<div>
					<p>当前分辨率:</p>
					<input type="text" v-model="width" @change="resize">
					<label>*</label>
					<input type="text" v-model="height" @change="resize">
				</div>
				<div>
					<p>广告名称:</p>
					<input type="text">
				</div>
				<div>
					<p>广告时长:</p>
					<input type="text">
				</div>
			</div>
		</div>
		<!-- 选项 -->
		<div class="option">
			<div>
				<p>宽</p>
				<input type="text" v-model="dataList[targetIndex].width" min="50" @change="widthChange">
			</div>
			<div>
				<p>高</p>
				<input type="text" v-model="dataList[targetIndex].height" min="50" @change="heightChange">
			</div>
			<div>
				<p>顶部</p>
				<input type="text" v-model="dataList[targetIndex].top" @change="topChange">
			</div>
			<div>
				<p>左侧</p>
				<input type="text" v-model="dataList[targetIndex].left" @change="leftChange">
			</div>
		</div>

		<!-- 右键选项 -->
		<div class="rightClick" :style="{top: rcY + 'px', left: rcX + 'px'}" v-show="rightClick">
			<p>删除</p>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			width: 1080, // 宽
			height: 1920, // 高
			dataList: [
				{
					width: 50,
					height: 50,
					top: 0,
					left: 0,
					type: "img",
					url: require("../assets/logo.png"),
					active: false, // 显示边框
					check: false, // 是否选中
					zindex: 1, // 层级
				},
				{
					width: 50,
					height: 50,
					top: 0,
					left: 0,
                    type: "video",
					url: require("../assets/video.mp4"),
					active: false, // 显示边框
					check: false, // 是否选中
					zindex: 2, // 层级
				}
			], // 数据列表
			rightClick: false, // 右键
			rcX: 0, // 右键X轴
			rcY: 0, // 右键Y轴
			press: false, // 是否按下
			targetIndex: 0, // 目标索引
			targetW: 0, // 目标宽度
			targetH: 0, // 目标高度
			targetT: 0, // 目标顶部距离
			targetL: 0, // 目标左侧距离
			anchorPointX: 0, // 锚点X轴
			anchorPointY: 0, // 锚点Y轴
		}
	},
	mounted() {
		this.resize()
	},
	methods: {
		openMenu($event, item) {
			console.log($event.pageX, item)
			this.rcX = $event.pageX;
			this.rcY = $event.pageY;
			this.rightClick = true;
		},
		resize() {
			console.log(this.$refs.canvas)
			this.$refs.canvas.style.width = this.width + "px";
			this.$refs.canvas.style.height = this.height + "px";
		},
		clickItem(index) {

		},
		longPress(e, index) {
			console.log("按下" + index)
			// console.log(this.press)
			this.targetIndex = index;
			this.dataList = this.dataList.map(i => {
				i.active = false;
				i.check = true;
				return i;
			})
			this.dataList[index].active = true;

			if (this.dataList[index].zindex < Math.max(...this.dataList.map(i => i.zindex))) {
				this.dataList[index].zindex = Math.max(...this.dataList.map(i => i.zindex)) + 1;
			}

			this.press = true;
			let targetInfo = this.$refs['target' + index][0].getBoundingClientRect()
			this.targetW = targetInfo.width
			this.targetH = targetInfo.height
			this.targetL = e.offsetX
			this.targetT = e.offsetY
			// console.log(this.targetT, this.targetL)
		},
		release() {
			console.log(this.press)
			this.press = false;
			this.dataList = this.dataList.map(i => {
				i.check = false;
				return i;
			})
		},
		// 移动
		move(e) {
			console.log(e.offsetX, e.offsetY)
			if (!this.press) {
				return;
			}
			let left = e.offsetX - this.targetL;
			let top = e.offsetY - this.targetT

			this.dataList[this.targetIndex].top = top
			this.dataList[this.targetIndex].left = left

			if (left < 0 || (left + this.targetW) > this.width) {
				this.$refs['target' + this.targetIndex][0].style.left = left < 0 ? 0 : (this.width - this.targetW) + "px";
				this.$refs['target' + this.targetIndex][0].style.top = top + "px";
				return;
			}
			if (top < 0 || (top + this.targetH) > this.height) {
				this.$refs['target' + this.targetIndex][0].style.left = left + "px";
				this.$refs['target' + this.targetIndex][0].style.top = top < 0 ? 0 : (this.height - this.targetH) + "px";
				return;
			}
			// console.log(e.offsetX, this.targetL, e.offsetY, this.targetT)
			this.$refs['target' + this.targetIndex][0].style.left = left + "px";
			this.$refs['target' + this.targetIndex][0].style.top = top + "px";

		},
		anchorPoint(e, direction) {
			console.log(e)
			switch (direction) {
				case "nw":
					console.log("上左")
					break;
				case "n":
					console.log("上")
					break;
				case "ne":
					console.log("上右")
					break;
				case "w":
					console.log("左")
					break;
				case "e":
					console.log("右")
					break;
				case "sw":
					console.log("下左")
					break;
				case "s":
					console.log("下")
					break;
				case "se":
					console.log("下右")
					break;
			}
		},
		widthChange() {
			console.log(this.targetIndex)
			this.$refs['target' + this.targetIndex][0].style.width = this.dataList[this.targetIndex].width + "px";
		},
		heightChange() {
			console.log(this.targetIndex)
			this.$refs['target' + this.targetIndex][0].style.height = this.dataList[this.targetIndex].height + "px";
		},
		topChange() {
			console.log(this.targetIndex)
			this.$refs['target' + this.targetIndex][0].style.top = this.dataList[this.targetIndex].top + "px";
		},
		leftChange() {
			console.log(this.targetIndex)
			this.$refs['target' + this.targetIndex][0].style.left = this.dataList[this.targetIndex].left + "px";
		},
	}
}
</script>

<style scoped lang="scss">
.adLayout {
	width: 100%;
	height: 100%;
	background: #f6f6f6;
	display: flex;
	user-select: none;

	.import {
		width: 100px;
		height: 100%;
		background: #ffe2c8;
		display: flex;
		flex-direction: column;
		align-items: center;

		div {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			background: #1f91f5;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 10px;
		}
	}

	.container {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;

		.canvas {
			width: 100%;
			flex: 1;
			background: #fff;
			overflow: auto;

			> div {
				background: #ccc;
                overflow: hidden;
                transform: scale(0.5);
                transform-origin: 0 0;
				position: relative;

				> div {
					width: 50px;
					min-width: 50px;
					height: 50px;
					min-height: 50px;
					background: rgba($color: #000, $alpha: 0.8);
					position: absolute;

					.resources {
                        width: 100%;
						height: 100%;

						img,
                        video {
							width: 100%;
							height: 100%;
						}
					}
					.border {
						width: 100%;
						height: 100%;
						box-sizing: border-box;
						border: 1px solid #1f91f5;
						position: absolute;
						top: 0;
						left: 0;
						z-index: 10;

						> div {
							width: 4px;
							height: 4px;
							background: #1f91f5;
							border: 1px solid #1f91f5;
							position: absolute;
							top: 0;
							left: 0;
							z-index: 20;

							&:first-child {
								transform: translate(-50%, -50%);
								cursor: nw-resize;
							}

							&:nth-child(2) {
								transform: translate(-50%, -50%);
								left: 50%;
								cursor: n-resize;
							}

							&:nth-child(3) {
								transform: translate(-50%, -50%);
								left: 100%;
								cursor: ne-resize;
							}

							&:nth-child(4) {
								transform: translate(-50%, -50%);
								top: 50%;
								cursor: w-resize;
							}

							&:nth-child(5) {
								transform: translate(-50%, -50%);
								top: 50%;
								left: 100%;
								cursor: e-resize;
							}

							&:nth-child(6) {
								transform: translate(-50%, -50%);
								top: 100%;
								left: 0%;
								cursor: sw-resize;
							}

							&:nth-child(7) {
								transform: translate(-50%, -50%);
								top: 100%;
								left: 50%;
								cursor: s-resize;
							}

							&:last-child {
								transform: translate(-50%, -50%);
								top: 100%;
								left: 100%;
								cursor: se-resize;
							}
						}
					}
				}
			}
		}

		.size {
			width: 100%;
			height: 50px;
			display: flex;

			div {
				display: flex;
				align-items: center;
			}
		}
	}

	.option {
		width: 200px;
		height: 100%;
		background: #edb6b6;
	}

	.rightClick {
		position: fixed;
		cursor: default;
	}
}
</style>
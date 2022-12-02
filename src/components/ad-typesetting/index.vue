<template>
	<div class="ad-typesetting" @mousemove="move" @mouseleave="leaveItem" @mouseup="leaveItem">
		<div class="sidebar">
			<div>
				<div class="img" @click="importType(0)">
					<img src="./static/picture.png" alt="">
				</div>
				<div class="img" @click="importType(1)">
					<img src="./static/video.png" alt="">
				</div>
				<div class="img" @click="importType(2)">
					<img src="./static/flow.png" alt="">
				</div>
				<div class="img" @click="importType(3)">
					<img src="./static/audio.png" alt="">
				</div>
				<div class="img" @click="importType(4)">
					<img src="./static/time.png" alt="">
				</div>
			</div>
		</div>
		<div class="core" @click.stop>
			<div class="canvas" ref="canvas" :style="{width: canvasWidth + 'px', height: canvasHeight + 'px', background: canvasBackground}">
				<div :class="{item: true, movable: targetIndex === index, notOptional: targetIndex !== index && ismove}" :ref="'item' + index" :style="item.style" v-for="item,index in dataList" :key="item.id" @mousedown="pressItem($event, index)" @mouseup="leaveItem">
					<img :src="item.url" alt="" v-if="item.type == 'img'">

					<div class="border" v-if="targetIndex === index">
						<div class="lt" :ref="'lt' + index" @mousedown.stop="readyZoom($event, 'lt')"></div>
						<div class="tc" :ref="'tc' + index" @mousedown.stop="readyZoom($event, 'tc')"></div>
						<div class="rt" :ref="'rt' + index" @mousedown.stop="readyZoom($event, 'rt')"></div>
						<div class="lc" :ref="'lc' + index" @mousedown.stop="readyZoom($event, 'lc')"></div>
						<div class="rc" :ref="'rc' + index" @mousedown.stop="readyZoom($event, 'rc')"></div>
						<div class="lb" :ref="'lb' + index" @mousedown.stop="readyZoom($event, 'lb')"></div>
						<div class="bc" :ref="'bc' + index" @mousedown.stop="readyZoom($event, 'bc')"></div>
						<div class="rb" :ref="'rb' + index" @mousedown.stop="readyZoom($event, 'rb')"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="info">
			<div class="canvasSettings">
				<p>画布设置</p>
				<div class="item">
					<p>宽度</p>
					<div>
						<input type="number" :value="canvasWidth" max="4096" @blur="changeSize($event, 'canvasWidth')">
					</div>
				</div>
				<div class="item">
					<p>高度</p>
					<div>
						<input type="number" :value="canvasHeight" max="4096" @blur="changeSize($event, 'canvasHeight')">
					</div>
				</div>
				<div class="item">
					<p>颜色</p>
					<div>
						<input type="color" v-model="canvasBackground">
					</div>
				</div>
				<div class="item">
					<p>方向</p>
					<div class="direction">
						<img src="./static/screen_rotation1.png" title="竖屏" @click="changeDirection" v-if="canvasWidth <= canvasHeight">
						<img src="./static/screen_rotation2.png" title="横屏" @click="changeDirection" v-else>
					</div>
				</div>
			</div>
			<div class="projectSettings">
				<p>项目设置</p>
				<div>

				</div>
			</div>
			<div class="operation">
				<button @click="cancel()">退出</button>
				<button @click="determine()">保存</button>
			</div>
		</div>
	</div>
</template>

<script>
import props from "./props.js";
export default {
	mixins: [props],
	data() {
		return {
			canvasWidth: 500, // 画布宽度
			canvasHeight: 500, // 画布高度
			canvasBackground: "#ffffff", // 画布背景
			// 数据列表
			dataList: [
				{
					type: null,
					name: "",
					url: "",
					style: {
						width: "60px",
						height: "60px",
						background: "#ccc",
						zIndex: 0,
						top: 0,
						left: 0,
					}
				},
				{
					type: "img",
					name: "",
					url: "",
					style: {
						width: "60px",
						height: "60px",
						background: "#ccc",
						zIndex: 1,
						top: 0,
						left: 0,
					}
				},
				{
					type: "video",
					name: "",
					url: "",
					style: {
						width: "60px",
						height: "60px",
						background: "#ccc",
						zIndex: 2,
						top: 0,
						left: 0,
					}
				},
				{
					type: "audio",
					name: "",
					url: "",
					style: {
						width: "60px",
						height: "60px",
						background: "#ccc",
						zIndex: 3,
						top: 0,
						left: 0,
					}
				}
			],
			targetIndex: null, // 目标索引
			pressX: 0, // 按下X轴位置
			pressY: 0, // 按下Y轴位置
			startX: 0, // 开始X轴位置
			startY: 0, // 开始Y轴位置
			ismove: false, // 是否移动
			startW: 0, // 开始宽度
			startH: 0, // 开始高度
			iszoom: false, // 是否缩放
			direction: null, // 方向
		}
	},
	created() {
		window.onclick = () => {
			console.log("点击");
			this.targetIndex = null;
		}
		window.onkeydown = e => {
			console.log(e);
		}
	},
	methods: {
		// 导入类型
		importType(type) {
			switch (type) {
				case 0:
					console.log("导入图片");
					break;
				case 1:
					console.log("导入视频");
					break;
				case 2:
					console.log("导入流媒体");
					break;
				case 3:
					console.log("导入音频");
					break;
				case 4:
					console.log("导入时间");
					break;
			}
		},
		// 改变宽度
		changeSize(e, key) {
			this[key] = e.target.value;
		},
		// 改变方向
		changeDirection() {
			if (this.canvasWidth == this.canvasHeight) {
				return
			}
			let value = this.canvasWidth;
			this.canvasWidth = this.canvasHeight;
			this.canvasHeight = value;
		},
		// 取消
		cancel() {
			console.log("取消");
		},
		// 确定
		determine() {
			console.log("确定");
			console.log(this.randomColor());
		},

		// 点击项
		pressItem(e, index) {
			this.targetIndex = index;
			this.ismove = true;
			this.optionTop(index);

			this.pressX = e.screenX;
			this.pressY = e.screenY;
			let el = this.$refs["item" + index][0];
			this.startX = el.offsetLeft;
			this.startY = el.offsetTop;
			this.startW = parseInt(this.dataList[this.targetIndex].style.width);
			this.startH = parseInt(this.dataList[this.targetIndex].style.height);
		},
		// 移动
		move(e) {
			if (this.ismove) {
				this.moveItem(e.screenX, e.screenY);
				console.log("移动");
			}
			if (this.iszoom) {
				console.log("缩放");
				this.startZoom(e.screenX, e.screenY);
			}
		},
		// 移动项
		moveItem(screenX, screenY) {
			let el = this.$refs["item" + this.targetIndex][0];

			let x = (screenX - this.pressX) / window.devicePixelRatio + this.startX;
			let y = (screenY - this.pressY) / window.devicePixelRatio + this.startY;
			console.log(x, y)
			if (x < 0) {
				this.dataList[this.targetIndex].style.left = 0 + "px";
			} else if (x + this.startW > this.canvasWidth) {
				this.dataList[this.targetIndex].style.left = this.canvasWidth - this.startW + "px";
			} else {
				this.dataList[this.targetIndex].style.left = x + "px";
			}

			if (y < 0) {
				this.dataList[this.targetIndex].style.top = 0 + "px";
			} else if (y + this.startH > this.canvasHeight) {
				this.dataList[this.targetIndex].style.top = this.canvasHeight - this.startH + "px";
			} else {
				this.dataList[this.targetIndex].style.top = y + "px";
			}
		},
		// 离开项
		leaveItem() {
			this.ismove = false;
			this.iszoom = false;
		},
		// 准备缩放
		readyZoom(e, direction) {
			console.log("缩放", this.targetIndex);
			this.pressX = e.screenX;
			this.pressY = e.screenY;

			this.startX = parseInt(this.dataList[this.targetIndex].style.left);
			this.startY = parseInt(this.dataList[this.targetIndex].style.top);
			console.log(this.startX, this.startY);

			this.startW = parseInt(this.dataList[this.targetIndex].style.width);
			this.startH = parseInt(this.dataList[this.targetIndex].style.height);
			this.iszoom = true;
			this.direction = direction;

			console.log(this.startW, this.startH);
		},
		// 开始缩放
		startZoom(screenX, screenY) {
			this[this.direction](screenX, screenY);
		},
		// 缩放-左上
		lt(screenX, screenY) {
			console.log("左上")
			this.lc(screenX, screenY);
			this.tc(screenX, screenY);
		},
		// 缩放-上
		tc(screenX, screenY) {
			console.log("上")
			let deviation = (screenY - this.pressY) / window.devicePixelRatio;
			let y = -deviation + this.startH;

			if (deviation + this.startY < 0) {
				this.dataList[this.targetIndex].style.top = 0 + "px";
				this.dataList[this.targetIndex].style.height = this.startY + this.startH + "px";
			} else if (y < 10) {
				this.dataList[this.targetIndex].style.top = (this.startY + this.startH - 10) + "px";
				this.dataList[this.targetIndex].style.height = "10px";
			} else {
				this.dataList[this.targetIndex].style.top = this.startY + deviation + "px";
				this.dataList[this.targetIndex].style.height = y + "px";
			}
		},
		// 缩放-右上
		rt(screenX, screenY) {
			console.log("右上")
			this.rc(screenX, screenY);
			this.tc(screenX, screenY);
		},
		// 缩放-右
		rc(screenX, screenY) {
			console.log("右")
			console.log(this.direction)
			console.log(screenX - this.pressX, screenY - this.pressY)

			let x = (screenX - this.pressX) / window.devicePixelRatio + this.startW;
			// let y = (screenY - this.pressY) / window.devicePixelRatio + this.startH;

			if (x < 10) {
				this.dataList[this.targetIndex].style.width = "10px";
			} else if (x + this.startX > this.canvasWidth) {
				this.dataList[this.targetIndex].style.width = this.canvasWidth - this.startX + "px";
			} else {
				this.dataList[this.targetIndex].style.width = x + "px";
			}
		},
		// 缩放-右下
		rb(screenX, screenY) {
			console.log("右下");
			this.rc(screenX, screenY);
			this.bc(screenX, screenY);
		},
		// 缩放-下
		bc(screenX, screenY) {
			console.log("下")
			// let x = (screenX - this.pressX) / window.devicePixelRatio + this.startW;
			let y = (screenY - this.pressY) / window.devicePixelRatio + this.startH;

			if (y < 10) {
				this.dataList[this.targetIndex].style.height = "10px";
			} else if (y + this.startY > this.canvasHeight) {
				this.dataList[this.targetIndex].style.height = this.canvasHeight - this.startY + "px";
			} else {
				this.dataList[this.targetIndex].style.height = y + "px";
			}
		},
		// 缩放-左下
		lb(screenX, screenY) {
			console.log("左下")
			this.lc(screenX, screenY);
			this.bc(screenX, screenY);
		},
		// 缩放-左
		lc(screenX, screenY) {
			let deviation = (screenX - this.pressX) / window.devicePixelRatio;
			let x = -deviation + this.startW;

			if (deviation + this.startX < 0) {
				this.dataList[this.targetIndex].style.left = 0 + "px";
				this.dataList[this.targetIndex].style.width = this.startX + this.startW + "px";
			} else if (x < 10) {
				this.dataList[this.targetIndex].style.left = (this.startX + this.startW - 10) + "px";
				this.dataList[this.targetIndex].style.width = "10px";
			} else {
				this.dataList[this.targetIndex].style.left = this.startX + deviation + "px";
				this.dataList[this.targetIndex].style.width = x + "px";
			}
		},
		// 选项置顶
		optionTop(index) {
			let arr = this.dataList.map(i => i.style.zIndex);
			let max = Math.max(...arr);
			console.log(index);

			if (this.dataList[index].style.zIndex < max) {
				this.dataList[index].style.zIndex = Math.max(...arr) + 1;
			}
			console.log(this.dataList.map(i => i.style.zIndex));
		},

		// 随机颜色
		randomColor() {
			let color = [];
			for (let i = 0; i < 3; i++) {
				color.push(Math.round(Math.random() * 255));
			}
			return "rgb(" + color.join(", ") + ")";
		},
	}
}
</script>

<style scoped lang="scss">
.ad-typesetting {
	width: 100%;
	height: 100%;
	background: #474747;
	display: flex;

	.sidebar {
		width: 60px;
		height: 100%;
		box-sizing: border-box;
		padding: 1px 1px 1px 0;

		> div {
			width: 100%;
			height: 100%;
			background: #535353;
			border: 1px solid #383838;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			align-items: center;

			> .img {
				width: 40px;
				height: 40px;
				background: #3e3e3e;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 15px 0 0;
				cursor: pointer;

				> img {
					width: 50%;
					height: 50%;
				}
			}
		}
	}

	.core {
		width: calc(100% - 300px);
		height: 100%;
		background: #282828;
		border: 1px solid #383838;
		box-sizing: border-box;
		// display: flex;
		// justify-content: center;
		// align-items: center;
		overflow: auto;

		scrollbar-width: thin; // Firefox
		scrollbar-color: #ccc transparent; // Firefox

		&::-webkit-scrollbar {
			width: 8px;
			height: 8px;
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background: #ccc;
		}

		.canvas {
			transition: all 0.1s;
			user-select: none;
			position: relative;

			.item {
				position: absolute;
				top: 30px;
				left: 30px;

				.border {
					width: 100%;
					height: 100%;
					border: 1px solid #558ef0;
					box-sizing: border-box;
					position: absolute;
					top: 0;
					left: 0;

					> div {
						width: 9px;
						height: 9px;
						background: #f4f4f4;
						border: 1px solid #558ef0;
						box-sizing: border-box;
						position: absolute;
					}

					.lt {
						top: -5px;
						left: -5px;
						cursor: nw-resize;
					}

					.tc {
						top: -5px;
						left: calc(50% - 4.5px);
						cursor: n-resize;
					}

					.rt {
						top: -5px;
						right: -5px;
						cursor: ne-resize;
					}

					.lc {
						top: calc(50% - 4.5px);
						left: -5px;
						cursor: w-resize;
					}

					.rc {
						top: calc(50% - 4.5px);
						right: -5px;
						cursor: e-resize;
					}

					.lb {
						bottom: -5px;
						left: -5px;
						cursor: sw-resize;
					}

					.bc {
						bottom: -5px;
						left: calc(50% - 4.5px);
						cursor: s-resize;
					}

					.rb {
						bottom: -5px;
						right: -5px;
						cursor: se-resize;
					}
				}
			}

			.movable {
				cursor: move;
			}

			.notOptional {
				pointer-events: none;
			}
		}
	}

	.info {
		width: 240px;
		height: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 1px 0 1px 1px;

		.canvasSettings {
			width: 100%;
			height: auto;
			font-size: 12px;
			color: #f0f0f0;
			background: #535353;
			border: 1px solid #383838;
			box-sizing: border-box;
			padding: 10px;

			> p {
				margin: 0 0 10px;
			}

			.item {
				display: flex;
				align-items: center;
				margin: 0 0 8px;

				> p {
					width: 35px;
				}

				> div {
					flex: 1;

					input {
						font-size: 12px;
						color: #f0f0f0;
						background: #454545;
						border: 1px solid #666666;
						border-radius: 2px;
						outline: none;
						padding: 2px 4px;

						&:focus {
							border: 1px solid #0f64d2;
						}
					}

					input[type="color"] {
						height: 20px;
						width: 40px;
						padding: 0;
					}

					// 颜色选择单独设置火狐浏览器样式，与谷歌样式保持一致
					@-moz-document url-prefix() {
						input[type="color"] {
							padding: 4px 2px;
						}
					}
				}

				.direction {
					display: flex;
					align-items: center;

					img {
						width: 20px;
						height: 20px;
						display: block;
						cursor: pointer;
					}
				}
			}
		}

		.projectSettings {
			width: 100%;
			flex: 1;
			background: #535353;
			border: 1px solid #383838;
			box-sizing: border-box;
			margin: 1px 0;
		}

		.operation {
			padding: 10px;

			button {
				font-size: 12px;
				color: #ffffff;
				background: #383838;
				border: none;
				border-radius: 2px;
				padding: 6px 14px;
				margin-right: 10px;

				&:active {
					background: #222222;
				}
			}
		}
	}
}
</style>
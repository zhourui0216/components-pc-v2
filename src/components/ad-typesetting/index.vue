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
		<div class="core">
			<div class="canvas" :style="{width: canvasWidth + 'px', height: canvasHeight + 'px', background: canvasBackground}">
				<div :class="{item: true, movable: targetIndex === index, notOptional: targetIndex !== index && ismove}" :style="item.style" v-for="item,index in dataList" :key="item.id" @mousedown="pressItem($event, index)" @contextmenu.prevent="rightClick($event, index)">
					<img :src="item.url" alt="" v-if="item.type == 'img'">
					<video :src="item.url" autoplay muted loop v-if="item.type == 'video'"></video>

					<div class="border" v-if="targetIndex === index">
						<div class="lt" @mousedown.stop="readyZoom($event, 'lt')"></div>
						<div class="tc" @mousedown.stop="readyZoom($event, 'tc')"></div>
						<div class="rt" @mousedown.stop="readyZoom($event, 'rt')"></div>
						<div class="lc" @mousedown.stop="readyZoom($event, 'lc')"></div>
						<div class="rc" @mousedown.stop="readyZoom($event, 'rc')"></div>
						<div class="lb" @mousedown.stop="readyZoom($event, 'lb')"></div>
						<div class="bc" @mousedown.stop="readyZoom($event, 'bc')"></div>
						<div class="rb" @mousedown.stop="readyZoom($event, 'rb')"></div>
					</div>
				</div>
				<!-- 辅助线 -->
				<div class="guideX" ref="guideX" v-show="(ismove || iszoom) && showGuideX"></div>
				<div class="guideY" ref="guideY" v-show="(ismove || iszoom) && showGuideY"></div>
			</div>
			<!-- 右键菜单 -->
			<div class="menu" ref="menu" v-show="showMenu" @mousedown.stop @contextmenu.prevent>
				<p @click="targetIndex == setIndex ? uncheck() : check()"> {{ targetIndex == setIndex ? "取消选中" : "选中" }}</p>
				<p @click="setScale()" v-if="showMenu">{{ dataList[setIndex].style.scale ? "取消等比例" : "等比例" }}</p>
				<p @click="uponeLevel(setIndex)">向上一级</p>
				<p @click="downoneLevel(setIndex)">向下一级</p>
				<p @click="optionTop(setIndex)">置顶</p>
				<p @click="optionBottom(setIndex)">置底</p>
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
			canvasWidth: 360, // 画布宽度
			canvasHeight: 640, // 画布高度
			canvasBackground: "#ffffff", // 画布背景
			targetIndex: null, // 目标索引
			setIndex: null, // 设置目标索引
			pressX: 0, // 按下X轴位置
			pressY: 0, // 按下Y轴位置
			startX: 0, // 开始X轴位置
			startY: 0, // 开始Y轴位置
			startW: 0, // 开始宽度
			startH: 0, // 开始高度
			anchorX: 0, // 锚点X(等比例缩放使用)
			anchorY: 0, // 锚点Y
			scale: true, // 是否等比例显示
			ratio: null, // 缩放比例(宽/高)
			ismove: false, // 是否移动
			iszoom: false, // 是否缩放
			showMenu: false, // 显示菜单
			direction: null, // 方向
			guide: { x: null, y: null }, // 辅助线
			guideX: 0, // 辅助线X位置
			guideY: 0, // 辅助线Y位置
			showGuideX: false, // 显示辅助线X
			showGuideY: false, // 显示辅助线Y
			// 数据列表
			dataList: [
				{
					type: "img",
					name: "",
					url: "https://tse3-mm.cn.bing.net/th/id/OIP-C.6Abq-Mposjlq7sZxu4eVEAHaEo?w=280&h=180&c=7&r=0&o=5&pid=1.7",
					style: {
						width: "60px",
						height: "60px",
						background: "#ccc",
						scale: true,
						zIndex: 3,
						top: 0,
						left: 0,
					}
				},
				{
					type: "img",
					name: "",
					url: "https://tse1-mm.cn.bing.net/th/id/OIP-C.wc_dCG_KbIKZwMdtD3gL2QHaEt?w=288&h=183&c=7&r=0&o=5&pid=1.7",
					style: {
						width: "60px",
						height: "60px",
						background: "#ccc",
						scale: true,
						zIndex: 2,
						top: 0,
						left: 0,
					}
				},
				{
					type: null,
					name: "",
					url: "",
					style: {
						width: "60px",
						height: "60px",
						background: "#ccc",
						scale: true,
						zIndex: 1,
						top: 0,
						left: 0,
					}
				},
				{
					type: "video",
					name: "",
					url: "https://prod-streaming-video-msn-com.akamaized.net/fe13f13c-c2cc-4998-b525-038b23bfa9b5/1a9d30ca-54be-411e-8b09-d72ef4488e05.mp4",
					style: {
						width: "60px",
						height: "60px",
						background: "#ccc",
						scale: true,
						zIndex: 0,
						top: 0,
						left: 0,
					}
				}
			],
		}
	},
	created() {
		// 按下鼠标关闭菜单
		window.onmousedown = e => {
			this.showMenu = false;
		}

		// 选中目标按方向键移动
		window.onkeydown = e => {
			if (this.targetIndex === null) {
				return
			}

			e.preventDefault();

			if (e.keyCode == 37) {
				this.directionmove(-1, 0);
			} else if (e.keyCode == 38) {
				this.directionmove(0, -1);
			} else if (e.keyCode == 39) {
				this.directionmove(1, 0);
			} else if (e.keyCode == 40) {
				this.directionmove(0, 1);
			}
		}
	},
	methods: {
		/**
		 * 导入类型
		 * @param {number} type 类型
		 */
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
		/**
		 * 改变宽度
		 * @param {string} e 属性(宽或高)
		 * @param {number} key 值
		 */
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
		},
		/**
		 * 点击项
		 * @param {object} e 事件对象
		 * @param {number} index 点击目标的索引
		 */
		pressItem(e, index) {
			if (e.button !== 0) {
				return
			}

			this.targetIndex = index;
			this.ismove = true;

			this.pressX = e.screenX;
			this.pressY = e.screenY;

			this.startX = this.getStyle("left", true);
			this.startY = this.getStyle("top", true);

			this.startW = this.getStyle("width", true);
			this.startH = this.getStyle("height", true);

			this.optionTop(index);
			this.getGuide();
		},
		/**
		 * 右键
		 * @param {object} e 事件对象
		 * @param {number} index 点击目标的索引
		 */
		rightClick(e, index) {
			this.$refs.menu.style.top = e.y + "px";
			this.$refs.menu.style.left = e.x + "px";
			this.showMenu = true;
			this.setIndex = index;
		},
		/**
		 * 移动
		 * @param {object} e 事件对象
		 */
		move(e) {
			// 判断是否移动
			if (this.ismove) {
				this.moveItem(e.screenX, e.screenY);
			}
			// 判断是否缩放
			if (this.iszoom) {
				this[this.direction](e.screenX, e.screenY);
			}
		},
		/**
		 * 移动项
		 * @param {number} screenX 移动时屏幕X轴位置
		 * @param {number} screenY 移动时屏幕Y轴位置
		 */
		moveItem(screenX, screenY) {
			let x = (screenX - this.pressX) / window.devicePixelRatio + this.startX;
			let y = (screenY - this.pressY) / window.devicePixelRatio + this.startY;
			let alignX = this.moveFindAdsorption(x, "x");
			let alignY = this.moveFindAdsorption(y, "y");

			if (x < 0) {
				this.setStyle("left", 0);
			} else if (x + this.startW > this.canvasWidth) {
				this.setStyle("left", this.canvasWidth - this.startW + "px");
			} else if (alignX >= 0) {
				this.setStyle("left", alignX + "px");
				this.showGuides("x");
			} else {
				this.setStyle("left", x + "px");
			}

			if (y < 0) {
				this.setStyle("top", 0);
			} else if (y + this.startH > this.canvasHeight) {
				this.setStyle("top", this.canvasHeight - this.startH + "px");
			} else if (alignY >= 0) {
				this.setStyle("top", alignY + "px");
				this.showGuides("y");
			} else {
				this.setStyle("top", y + "px");
			}
		},
		/**
		 * 按下方向移动
		 * @param {number} deviationX X轴偏移距离
		 * @param {number} deviationY Y轴偏移距离
		 */
		directionmove(deviationX, deviationY) {
			let x = this.getStyle("left", true) + deviationX;
			let y = this.getStyle("top", true) + deviationY;

			if (x < 0) {
				this.setStyle("left", 0);
			} else if (x + this.startW > this.canvasWidth) {
				this.setStyle("left", this.canvasWidth - this.startW + "px");
			} else {
				this.setStyle("left", x + "px");
			}

			if (y < 0) {
				this.setStyle("top", 0);
			} else if (y + this.startH > this.canvasHeight) {
				this.setStyle("top", this.canvasHeight - this.startH + "px");
			} else {
				this.setStyle("top", y + "px");
			}
		},
		// 离开项
		leaveItem() {
			this.ismove = false;
			this.iszoom = false;
			this.showGuideX = false;
			this.showGuideY = false;
		},
		/**
		 * 按下准备缩放
		 * @param {object} e 事件对象
		 * @param {string} direction 缩放的方向
		 */
		readyZoom(e, direction) {
			this.showMenu = false;

			if (e.button !== 0) {
				return
			}

			this.direction = direction;
			this.iszoom = true;

			this.pressX = e.screenX;
			this.pressY = e.screenY;

			this.startX = this.getStyle("left", true);
			this.startY = this.getStyle("top", true);

			this.startW = this.getStyle("width", true);
			this.startH = this.getStyle("height", true);

			this.scale = this.dataList[this.targetIndex].style.scale;
			this.ratio = this.startW / this.startH;

			switch (direction) {
				case "lt":
					this.anchorX = this.startX + this.startW;
					this.anchorY = this.startY + this.startH;
					break;
				case "tc":
					this.anchorX = this.startX + this.startW / 2;
					this.anchorY = this.startY + this.startH;
					break;
				case "rt":
					this.anchorX = this.startX;
					this.anchorY = this.startY + this.startH;
					break;
				case "lc":
					this.anchorX = this.startX + this.startW;
					this.anchorY = this.startY + this.startH / 2;
					break;
				case "rc":
					this.anchorX = this.startX;
					this.anchorY = this.startY + this.startH / 2;
					break;
				case "lb":
					this.anchorX = this.startX + this.startW;
					this.anchorY = this.startY;
					break;
				case "bc":
					this.anchorX = this.startX + this.startW / 2;
					this.anchorY = this.startY;
					break;
				case "rb":
					this.anchorX = this.startX;
					this.anchorY = this.startY;
					break;
			}
		},
		/**
		 * 缩放-左上
		 * @param {number} screenX 缩放时屏幕X轴位置
		 * @param {number} screenY 缩放时屏幕Y轴位置
		 */
		lt(screenX, screenY) {
			if (this.scale) {
				this.cornerEqualScale("lt", screenX - this.pressX);
			} else {
				this.lc(screenX, screenY);
				this.tc(screenX, screenY);
			}
		},
		/**
		 * 缩放-上
		 * @param {number} screenX 缩放时屏幕X轴位置
		 * @param {number} screenY 缩放时屏幕Y轴位置
		 */
		tc(screenX, screenY) {
			let deviation = (screenY - this.pressY) / window.devicePixelRatio;
			let y = -deviation + this.startH;
			let alignY = this.scaleFindAdsorption(deviation + this.startY, "y");

			if (this.scale) {
				this.equalScale("top", y, deviation);
			} else if (y < 10) {
				this.setStyle("top", (this.startY + this.startH - 10) + "px");
				this.setStyle("height", "10px");
			} else if (deviation + this.startY < 0) {
				this.setStyle("top", 0);
				this.setStyle("height", this.startY + this.startH + "px");
			} else if (alignY >= 0) {
				this.setStyle("top", alignY + "px");
				this.setStyle("height", this.startY - alignY + this.startH + "px");
				this.showGuides("y");
			} else {
				this.setStyle("top", this.startY + deviation + "px");
				this.setStyle("height", y + "px");
			}
		},
		/**
		 * 缩放-右上
		 * @param {number} screenX 缩放时屏幕X轴位置
		 * @param {number} screenY 缩放时屏幕Y轴位置
		 */
		rt(screenX, screenY) {
			if (this.scale) {
				this.cornerEqualScale("rt", screenX - this.pressX);
			} else {
				this.rc(screenX, screenY);
				this.tc(screenX, screenY);
			}
		},
		/**
		 * 缩放-右
		 * @param {number} screenX 缩放时屏幕X轴位置
		 * @param {number} screenY 缩放时屏幕Y轴位置
		 */
		rc(screenX, screenY) {
			let x = (screenX - this.pressX) / window.devicePixelRatio + this.startW;
			let alignX = this.scaleFindAdsorption(x + this.startX, "x");

			if (this.scale) {
				this.equalScale("right", x);
			} else if (x < 10) {
				this.setStyle("width", "10px");
			} else if (x + this.startX > this.canvasWidth) {
				this.setStyle("width", this.canvasWidth - this.startX + "px");
			} else if (alignX >= 0) {
				this.setStyle("width", alignX - this.startX + "px");
				this.showGuides("x");
			} else {
				this.setStyle("width", x + "px");
			}
		},
		/**
		 * 缩放-右下
		 * @param {number} screenX 缩放时屏幕X轴位置
		 * @param {number} screenY 缩放时屏幕Y轴位置
		 */
		rb(screenX, screenY) {
			if (this.scale) {
				this.cornerEqualScale("rb", screenX - this.pressX);
			} else {
				this.rc(screenX, screenY, true);
				this.bc(screenX, screenY, true);
			}
		},
		/**
		 * 缩放-下
		 * @param {number} screenX 缩放时屏幕X轴位置
		 * @param {number} screenY 缩放时屏幕Y轴位置
		 */
		bc(screenX, screenY) {
			let y = (screenY - this.pressY) / window.devicePixelRatio + this.startH;
			let alignY = this.scaleFindAdsorption(y + this.startY, "y");

			if (this.scale) {
				this.equalScale("bottom", y);
			} else if (y < 10) {
				this.setStyle("height", "10px");
			} else if (y + this.startY > this.canvasHeight) {
				this.setStyle("height", this.canvasHeight - this.startY + "px");
			} else if (alignY >= 0) {
				this.setStyle("height", alignY - this.startY + "px");
				this.showGuides("y");
			} else {
				this.setStyle("height", y + "px");
			}
		},
		/**
		 * 缩放-左下
		 * @param {number} screenX 缩放时屏幕X轴位置
		 * @param {number} screenY 缩放时屏幕Y轴位置
		 */
		lb(screenX, screenY) {
			if (this.scale) {
				this.cornerEqualScale("lb", screenX - this.pressX);
			} else {
				this.lc(screenX, screenY);
				this.bc(screenX, screenY);
			}
		},
		/**
		 * 缩放-左
		 * @param {number} screenX 缩放时屏幕X轴位置
		 * @param {number} screenY 缩放时屏幕Y轴位置
		 */
		lc(screenX, screenY) {
			let deviation = (screenX - this.pressX) / window.devicePixelRatio;
			let x = -deviation + this.startW;
			let alignX = this.scaleFindAdsorption(deviation + this.startX, "x");

			if (this.scale) {
				this.equalScale("left", x, deviation);
			} else if (x < 10) {
				this.setStyle("left", (this.startX + this.startW - 10) + "px");
				this.setStyle("width", "10px");
			} else if (deviation + this.startX < 0) {
				this.setStyle("left", 0);
				this.setStyle("width", this.startX + this.startW + "px");
			} else if (alignX >= 0) {
				this.setStyle("left", alignX + "px");
				this.setStyle("width", this.startX - alignX + this.startW + "px");
				this.showGuides("x");
			} else {
				this.setStyle("left", this.startX + deviation + "px");
				this.setStyle("width", x + "px");
			}
		},
		/**
		 * 目标层级向上一级
		 * @param {number} index 目标索引
		 */
		uponeLevel(index) {
			let arr = this.dataList.map(i => i.style.zIndex);
			let max = Math.max(...arr);
			let current = this.dataList[index].style.zIndex;
			if (current < max) {
				this.dataList.forEach(i => {
					if (i.style.zIndex == current + 1) {
						i.style.zIndex--;
					}
					return i;
				})
				this.dataList[index].style.zIndex++;
			}
			this.showMenu = false;
		},
		/**
		 * 目标层级向下一级
		 * @param {number} index 目标索引
		 */
		downoneLevel(index) {
			let arr = this.dataList.map(i => i.style.zIndex);
			let min = Math.min(...arr);
			let current = this.dataList[index].style.zIndex;
			if (current > min) {
				this.dataList.forEach(i => {
					if (i.style.zIndex == current - 1) {
						i.style.zIndex++;
					}
					return i;
				})
				this.dataList[index].style.zIndex--;
			}
			this.showMenu = false;
		},
		/**
		 * 目标层级置顶
		 * @param {number} index 目标索引
		 */
		optionTop(index) {
			this.dataList.forEach(i => {
				let current = this.dataList[index].style.zIndex;
				if (i.style.zIndex > current) {
					i.style.zIndex--;
				}
				return i;
			})
			this.dataList[index].style.zIndex = this.dataList.length - 1;
			this.showMenu = false;
		},
		/**
		 * 目标层级置底
		 * @param {number} index 目标索引
		 */
		optionBottom(index) {
			this.dataList.forEach(i => {
				let current = this.dataList[index].style.zIndex;
				if (i.style.zIndex < current) {
					i.style.zIndex++;
				}
				return i;
			})
			this.dataList[index].style.zIndex = 0;
			this.showMenu = false;
		},
		// 选中
		check() {
			this.targetIndex = this.setIndex;
			this.showMenu = false;
		},
		// 取消选中
		uncheck() {
			if (this.targetIndex == this.setIndex) {
				this.targetIndex = null;
			}
			this.showMenu = false;
		},
		// 设置等比例
		setScale() {
			this.dataList[this.setIndex].style.scale = !this.scale;
			this.showMenu = false;
		},
		/**
		 * 等比例缩放
		 * @param {string} direction 方向(left/right/top/bottom)
		 * @param {number} size 大小
		 * @param {number} deviation 向左或向上偏移量
		 */
		equalScale(direction, size, deviation) {
			if (direction == "left") {
				let height = size / this.ratio;
				let left = this.anchorX - size;
				let top = this.startY - (height - this.startH) / 2;

				// 左侧溢出
				if (left < 0) {
					size = this.anchorX;
					height = size / this.ratio;
					left = 0;
					top = this.startY - (height - this.startH) / 2;
				}

				// 顶部溢出
				if (top < 0) {
					height = this.anchorY * 2;
					size = height * this.ratio;
					left = this.anchorX - size;
					top = 0;
				}

				// 底部溢出
				if (top + height > this.canvasHeight) {
					height = (this.canvasHeight - this.anchorY) * 2;
					size = height * this.ratio;
					left = this.anchorX - size;
					top = this.canvasHeight - height;
				}

				// 最小宽度
				if (size < 10) {
					size = 10;
					height = size / this.ratio;
					left = this.anchorX - size;
					top = this.anchorY - height / 2;
				}

				// 最小高度
				if (height < 10) {
					height = 10;
					size = height * this.ratio;
					left = this.anchorX - size;
					top = this.anchorY - height / 2;
				}

				this.setStyle("width", size + "px");
				this.setStyle("height", height + "px");
				this.setStyle("left", left + "px");
				this.setStyle("top", top + "px");
			} else if (direction == "top") {
				let width = size * this.ratio;
				let left = this.startX - (width - this.startW) / 2;
				let top = this.anchorY - size;

				// 顶部溢出
				if (top < 0) {
					size = this.anchorY;
					width = size * this.ratio;
					left = this.startX - (width - this.startW) / 2;
					top = 0;
				}

				// 左侧溢出
				if (left < 0) {
					width = this.anchorX * 2;
					size = width / this.ratio;
					left = 0;
					top = this.anchorY - size;
				}

				// 右侧溢出
				if (left + width > this.canvasWidth) {
					width = (this.canvasWidth - this.anchorX) * 2;
					size = width / this.ratio;
					left = this.canvasWidth - width;
					top = this.anchorY - size;
				}

				// 最小宽度
				if (width < 10) {
					width = 10;
					size = width / this.ratio;
					left = this.anchorX - width / 2;
					top = this.anchorY - size;
				}

				// 最小高度
				if (size < 10) {
					size = 10;
					width = size * this.ratio;
					left = this.anchorX - width / 2;
					top = this.anchorY - size;
				}

				this.setStyle("width", width + "px");
				this.setStyle("height", size + "px");
				this.setStyle("left", left + "px");
				this.setStyle("top", this.anchorY - size + "px");
			} else if (direction == "right") {
				let height = size / this.ratio;
				let top = this.startY - (height - this.startH) / 2;

				// 右侧溢出
				if (size + this.anchorX > this.canvasWidth) {
					size = this.canvasWidth - this.anchorX;
					height = size / this.ratio;
					top = this.startY - (height - this.startH) / 2;
				}

				// 顶部溢出
				if (top < 0) {
					height = this.anchorY * 2;
					size = height * this.ratio;
					top = 0;
				}

				// 底部溢出
				if (top + height > this.canvasHeight) {
					height = (this.canvasHeight - this.anchorY) * 2;
					size = height * this.ratio;
					top = this.canvasHeight - height;
				}

				// 最小宽度
				if (size < 10) {
					size = 10;
					height = size / this.ratio;
					top = this.anchorY - height / 2;
				}

				// 最小高度
				if (height < 10) {
					height = 10;
					size = height * this.ratio;
					top = this.anchorY - height / 2;
				}

				this.setStyle("width", size + "px");
				this.setStyle("height", height + "px");
				this.setStyle("top", top + "px");
			} else if (direction == "bottom") {
				let width = size * this.ratio;
				let left = this.startX - (width - this.startW) / 2;

				// 底部溢出
				if (size + this.anchorY > this.canvasHeight) {
					size = this.canvasHeight - this.anchorY;
					width = size * this.ratio;
					left = this.startX - (width - this.startW) / 2;
				}

				// 左侧溢出
				if (left < 0) {
					width = this.anchorX * 2;
					size = width / this.ratio;
					left = 0;
				}

				// 右侧溢出
				if (left + width > this.canvasWidth) {
					width = (this.canvasWidth - this.anchorX) * 2;
					size = width / this.ratio;
					left = this.canvasWidth - width;
				}

				// 最小宽度
				if (width < 10) {
					width = 10;
					size = width / this.ratio;
					left = this.anchorX - width / 2;
				}

				// 最小高度
				if (size < 10) {
					size = 10;
					width = size * this.ratio;
					left = this.anchorX - width / 2;
				}

				this.setStyle("width", width + "px");
				this.setStyle("height", size + "px");
				this.setStyle("left", left + "px");
			}
		},
		/**
		 * 边角等比例缩放
		 * @param {string} direction 方向
		 * @param {number} offset 偏移量
		 */
		cornerEqualScale(direction, offset) {
			if (direction == "lt") {
				let width = this.startW - offset;
				let height = width / this.ratio;
				let left = this.anchorX - width;
				let top = this.anchorY - height;

				// 左侧溢出
				if (left < 0) {
					width = this.anchorX;
					height = width / this.ratio;
					left = 0;
					top = this.anchorY - height;
				}

				// 顶部溢出
				if (top < 0) {
					height = this.anchorY
					width = height * this.ratio;
					left = this.anchorX - width;
					top = 0;
				}

				// 最小宽度
				if (width < 10) {
					width = 10;
					height = width / this.ratio;
					left = this.anchorX - width;
					top = this.anchorY - height;
				}

				this.setStyle("width", width + "px");
				this.setStyle("height", height + "px");
				this.setStyle("left", left + "px");
				this.setStyle("top", top + "px");
			} else if (direction == "rt") {
				let width = this.startW + offset;
				let height = width / this.ratio;
				let top = this.anchorY - height;

				// 右侧溢出
				if (width + this.anchorX > this.canvasWidth) {
					width = this.canvasWidth - this.anchorX;
					height = width / this.ratio;
					top = this.anchorY - height;
				}

				// 顶部溢出
				if (top < 0) {
					height = this.anchorY;
					width = height * this.ratio;
					top = 0;
				}

				// 最小宽度
				if (width < 10) {
					width = 10;
					height = width / this.ratio;
					top = this.anchorY - height;
				}

				this.setStyle("width", width + "px");
				this.setStyle("height", height + "px");
				this.setStyle("top", top + "px");
			} else if (direction == "rb") {
				let width = this.startW + offset;
				let height = width / this.ratio;

				// 右侧溢出
				if (width + this.anchorX > this.canvasWidth) {
					width = this.canvasWidth - this.anchorX;
					height = width / this.ratio;
				}

				// 底部溢出
				if (height + this.anchorY > this.canvasHeight) {
					height = this.canvasHeight - this.anchorY;
					width = height * this.ratio;
				}

				// 最小宽度
				if (width < 10) {
					width = 10;
					height = width / this.ratio;
				}

				this.setStyle("width", width + "px");
				this.setStyle("height", height + "px");
			} else if (direction == "lb") {
				let width = this.startW - offset;
				let height = width / this.ratio;
				let left = this.anchorX - width;

				// 左侧溢出
				if (left < 0) {
					width = this.anchorX;
					height = width / this.ratio;
					left = 0;
				}

				// 底部溢出
				if (height + this.anchorY > this.canvasHeight) {
					height = this.canvasHeight - this.anchorY;
					width = height * this.ratio;
					left = this.anchorX - width;
				}

				// 最小宽度
				if (width < 10) {
					width = 10;
					height = width / this.ratio;
					left = this.anchorX - width;
				}

				this.setStyle("width", width + "px");
				this.setStyle("height", height + "px");
				this.setStyle("left", left + "px");
			}
		},
		// 获取辅助线
		getGuide() {
			let arrX = [];
			let arrY = [];
			this.dataList.forEach((i, j) => {
				if (j != this.targetIndex) {
					let x = parseInt(i.style.left);
					let w = parseInt(i.style.width);
					arrX.push(x, x + w / 2, x + w);

					let y = parseInt(i.style.top);
					let h = parseInt(i.style.height);
					arrY.push(y, y + h / 2, y + h);
				}
			});
			this.guide.x = Array.from(new Set(arrX)).filter(i => i > 0 && i < this.canvasWidth).sort((a, b) => a - b);
			this.guide.y = Array.from(new Set(arrY)).filter(i => i > 0 && i < this.canvasHeight).sort((a, b) => a - b);
		},
		/**
		 * 移动查找吸附
		 * @param {number} position 移动时的位置
		 * @param {string} type 方向(X或Y轴)
		 * @returns {number} 可吸附的位置
		 */
		moveFindAdsorption(position, type) {
			if (type == "x") {
				// 移动X,判断Y
				let x = this.guide.x.find(i => i > position - 4 && i < position + 4);
				let r = this.guide.x.find(i => i > position + this.startW - 4 && i < position + this.startW + 4);
				let c = this.guide.x.find(i => i > position + this.startW / 2 - 4 && i < position + this.startW / 2 + 4);

				if (x) {
					this.guideY = x;
					return x;
				} else if (r) {
					this.guideY = r;
					return r - this.startW;
				} else if (c) {
					this.guideY = c;
					return c - this.startW / 2;
				} else {
					this.showGuideY = false;
					return -1;
				}
			} else if (type == "y") {
				// 移动Y,判断X
				let y = this.guide.y.find(i => i > position - 4 && i < position + 4);
				let r = this.guide.y.find(i => i > position + this.startH - 4 && i < position + this.startH + 4);
				let c = this.guide.y.find(i => i > position + this.startH / 2 - 4 && i < position + this.startH / 2 + 4);

				if (y) {
					this.guideX = y;
					return y;
				} else if (r) {
					this.guideX = r;
					return r - this.startH;
				} else if (c) {
					this.guideX = c;
					return c - this.startH / 2;
				} else {
					this.showGuideX = false;
					return -1;
				}
			}
		},
		/**
		 * 缩放查找吸附
		 * @param {number} position 移动时的位置
		 * @param {string} type 方向(X或Y轴)
		 * @returns {number} 可吸附的位置
		 */
		scaleFindAdsorption(position, type) {
			if (type == "x") {
				let x = this.guide.x.find(i => i > position - 4 && i < position + 4);

				if (x) {
					this.guideY = x;
					return x;
				} else {
					this.showGuideY = false;
					return -1
				}
			} else if (type == "y") {
				let y = this.guide.y.find(i => i > position - 4 && i < position + 4);

				if (y) {
					this.guideX = y;
					return y;
				} else {
					this.showGuideX = false;
					return -1
				}
			}
		},
		/**
		 * 显示参考线
		 * @param {string} type 方向(X或Y轴辅助线)
		 */
		showGuides(type) {
			if (type == "x") {
				this.showGuideY = true;
				this.$refs.guideY.style.left = this.guideY - 0.5 + "px";
			} else if (type == "y") {
				this.showGuideX = true;
				this.$refs.guideX.style.top = this.guideX - 0.5 + "px";
			}
		},
		/**
		 * 获取样式
		 * @param {string} key 属性
		 * @param {boolean} num 是否为数字
		 * @returns {string|number} 属性值
		 */
		getStyle(key, num) {
			if (num) {
				return parseInt(this.dataList[this.targetIndex].style[key]);
			} else {
				return this.dataList[this.targetIndex].style[key];
			}
		},
		/**
		 * 设置样式
		 * @param {string} key 属性
		 * @param {string|number} value 属性值
		 */
		setStyle(key, value) {
			this.dataList[this.targetIndex].style[key] = value;
		},
		/**
		 * 随机颜色
		 * @returns {string} rgb颜色
		 */
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
	user-select: none;

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
		min-width: 400px;
		height: 100%;
		background: #282828;
		border: 1px solid #383838;
		box-sizing: border-box;
		overflow: auto;

		scrollbar-width: thin; // Firefox
		scrollbar-color: #696969 #4a4a4a; // Firefox

		&::-webkit-scrollbar {
			width: 14px;
			height: 14px;
			background: #4a4a4a;
		}

		&::-webkit-scrollbar-thumb {
			background: #696969;
			border-radius: 2px;
		}

		.canvas {
			transition: all 0.1s;
			position: relative;
			margin: 20px;

			.item {
				position: absolute;

				img,
				video {
					width: 100%;
					height: 100%;
					object-fit: fill;
					position: absolute;
					top: 0;
					left: 0;
				}

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

			.guideX {
				width: 100%;
				height: 0;
				border-top: 1px dashed #666666;
				pointer-events: none;
				position: absolute;
				z-index: 9999;
			}

			.guideY {
				width: 0;
				height: 100%;
				border-left: 1px dashed #666666;
				pointer-events: none;
				position: absolute;
				z-index: 9999;
			}
		}

		.menu {
			background: #fff;
			border-radius: 4px;
			border: 1px solid #e7e7e7;
			padding: 2px;
			position: fixed;
			z-index: 9999;

			p {
				width: 60px;
				height: 24px;
				line-height: 24px;
				font-size: 12px;
				border-radius: 4px;
				display: block;
				padding: 0 10px;

				&:hover {
					background: #eeeeee;
				}
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
			@extend .canvasSettings;
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
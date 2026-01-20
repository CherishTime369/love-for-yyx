// 1. 设置你们在一起的日期 (格式: YYYY-MM-DDTHH:MM:SS)
const YOUR_START_DATE = "2025-05-10T00:00:00"; 

// 2. 更新计时器
function updateTimer() {
    const start = new Date(YOUR_START_DATE);
    const now = new Date();
    const diff = now - start;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("timer").innerHTML = 
        `${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒`;
}

// 每秒更新一次
setInterval(updateTimer, 1000);
updateTimer(); // 初始化立即执行一次

// 3. 打字机效果
const text = "在这个世界上，你是唯一的例外。愿我们的故事，没有终点，只有永远。我爱你！"; // 这里改成你想说的话
const typewriterElement = document.getElementById("typewriter");
let index = 0;

function typeWriter() {
    if (index < text.length) {
        typewriterElement.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, 150); // 打字速度，越小越快
    }
}

// 页面加载完成后开始打字
window.onload = typeWriter;

// 4. 按钮点击特效：生成满屏爱心
document.getElementById("loveBtn").addEventListener("click", function() {
    alert("我也超级爱你！💖"); // 这里可以改成简单的弹窗，或者播放音乐
    createHearts();
});

function createHearts() {
    const body = document.body;
    for (let i = 0; i < 30; i++) { // 生成30个爱心
        setTimeout(() => {
            const heart = document.createElement("div");
            heart.classList.add("heart");
            heart.innerHTML = "❤";
            heart.style.left = Math.random() * 100 + "vw"; // 随机水平位置
            heart.style.animationDuration = Math.random() * 2 + 3 + "s"; // 随机飘动速度
            body.appendChild(heart);
            
            // 动画结束后移除元素
            setTimeout(() => {
                heart.remove();
            }, 5000);
        }, i * 100);
    }
}
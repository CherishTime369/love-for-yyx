// --- 配置区 ---
const START_DATE = "2023-05-20T00:00:00"; // 在一起的日期

// --- 初始化 ---
window.onload = function() {
    initMusicAndEntry();
    initCarousel();
    initHeartGrid(); // 生成心形照片墙
};

// --- 1. 进场与音乐 ---
function initMusicAndEntry() {
    const startBtn = document.getElementById("start-btn");
    const welcome = document.getElementById("welcome-screen");
    const music = document.getElementById("bg-music");
    const typewriter = document.getElementById("typewriter");
    const text = "遇见你，是我这辈子最幸运的事。";

    startBtn.addEventListener("click", () => {
        music.play().catch(e => console.log("需交互播放"));
        welcome.style.opacity = 0;
        setTimeout(() => welcome.remove(), 1000);
        
        // 启动老虎机
        startSlotMachine();
        
        // 启动打字机
        let i = 0;
        function type() {
            if (i < text.length) {
                typewriter.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 150);
            }
        }
        type();
    });
}

// --- 2. 宽屏轮播逻辑 ---
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let index = 0;

    function showSlide(n) {
        slides.forEach(s => s.classList.remove('active'));
        index = (n + slides.length) % slides.length;
        slides[index].classList.add('active');
    }

    nextBtn.addEventListener('click', () => showSlide(index + 1));
    prevBtn.addEventListener('click', () => showSlide(index - 1));

    // 自动播放
    setInterval(() => showSlide(index + 1), 5000);
}

// --- 3. 老虎机数字滚动逻辑 (核心难点) ---
function startSlotMachine() {
    const slots = [
        document.getElementById("day-slot"),
        document.getElementById("hour-slot"),
        document.getElementById("min-slot"),
        document.getElementById("sec-slot")
    ];

    // 初始化：给每个框框里塞入 0-9 的长条
    slots.forEach(slot => {
        const strip = document.createElement("div");
        strip.className = "digit-strip";
        // 生成 0-9 以及多一组 0-9 用于无缝滚动
        let html = "";
        for (let i = 0; i < 10; i++) html += `<div>${i}</div>`; 
        strip.innerHTML = html;
        slot.appendChild(strip);
    });

    function updateTime() {
        const start = new Date(START_DATE);
        const now = new Date();
        const diff = now - start;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const values = [days, hours, minutes, seconds];

        // 依次更新天、时、分、秒
        // 注意：这里简化了逻辑，直接更新数值。
        // 如果要做完美的“滚动停下”动画，需要非常复杂的 CSS 计算。
        // 这里采用“翻牌”效果的变种：数字直接跳动，但配合秒数的流动。
        
        // 为了实现"定格"效果：
        // 刚开始我们让所有数字乱跳，然后依次停止。
        // 但这里为了代码稳定性，我们直接显示真实时间，
        // 配合 CSS 的 transition 让它滑进去。
        
        slots.forEach((slot, i) => {
            // 清空旧的，直接显示数字（最稳妥的方案，防止数字对不齐）
            // 如果要强行做滚动，可以改变 strip 的 translateY
            slot.innerHTML = values[i]; 
        });
    }

    // 模拟老虎机开场动画 (乱数 -> 定格)
    let scrambleCount = 0;
    let scrambleTimer = setInterval(() => {
        slots.forEach(slot => slot.innerText = Math.floor(Math.random() * 99));
        scrambleCount++;
        
        // 2秒后停止乱跳，显示真实时间
        if (scrambleCount > 20) {
            clearInterval(scrambleTimer);
            
            // 依次定格动画
            setTimeout(() => {
                updateTime(); // 显示一次
                setInterval(updateTime, 1000); // 开始每秒走动
            }, 100);
        }
    }, 100);
}

// --- 4. 心形 Grid 生成器 (关键布局) ---
function initHeartGrid() {
    const grid = document.getElementById("heart-grid");
    
    // 我们定义一个 9列 x 8行 的网格
    // 1 代表放图片，0 代表空白
    // 这是一个简单的心形矩阵
    const heartMap = [
        [0, 1, 1, 0, 0, 0, 1, 1, 0], // 第一行
        [1, 1, 1, 1, 0, 1, 1, 1, 1], // 第二行
        [1, 1, 1, 1, 1, 1, 1, 1, 1], // 第三行
        [1, 1, 1, 1, 1, 1, 1, 1, 1], // 第四行
        [0, 1, 1, 1, 1, 1, 1, 1, 0], // 第五行
        [0, 0, 1, 1, 1, 1, 1, 0, 0], // 第六行
        [0, 0, 0, 1, 1, 1, 0, 0, 0], // 第七行
        [0, 0, 0, 0, 1, 0, 0, 0, 0]  // 第八行 (尖尖)
    ];

    let imgIndex = 1;

    // 遍历矩阵生成 DOM
    heartMap.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === 1) {
                // 如果需要放图片
                const img = document.createElement("img");
                img.className = "heart-photo";
                // 循环使用 1-32 张图片
                const currentImgNum = (imgIndex % 32) || 32; 
                img.src = `images/gallery/${currentImgNum}.jpg`;
                img.onclick = () => openLightbox(img.src, `第 ${currentImgNum} 张回忆`);
                
                // 设置 Grid 位置
                img.style.gridColumnStart = colIndex + 1;
                img.style.gridRowStart = rowIndex + 1;
                
                grid.appendChild(img);
                imgIndex++;
            }
        });
    });
}

// 弹窗逻辑
function openLightbox(src, text) {
    const lightbox = document.getElementById("lightbox");
    document.getElementById("lightbox-img").src = src;
    document.getElementById("lightbox-text").innerText = text;
    lightbox.classList.remove("hidden");
    
    // 点击背景关闭
    lightbox.onclick = (e) => {
        if (e.target !== document.getElementById("lightbox-img")) {
            lightbox.classList.add("hidden");
        }
    }
}
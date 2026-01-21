// ==========================================
// 🔴 调试开关：true = 彩色积木模式 | false = 真实照片模式
const DEBUG_MODE = true; 
// ==========================================

const START_DATE = "2023-05-20T00:00:00"; 

// 25张照片的绝对布局数据
// r:行(1-8), c:列(1-8)
// 宽图(wide)跨2列，竖图(tall)跨2行，方图(sq)跨1格
const LAYOUT = [
    // --- 第1行 (顶部) ---
    { id:'s1', type:'sq',   r:1, c:2, file:'s1.jpg' },
    { id:'w1', type:'wide', r:1, c:3, file:'w1.jpg' }, // 占3,4
    { id:'w2', type:'wide', r:1, c:6, file:'w2.jpg' }, // 占6,7
    { id:'s2', type:'sq',   r:1, c:8, file:'s2.jpg' },

    // --- 第2行 (竖图开始支撑) ---
    { id:'p1', type:'tall', r:2, c:1, file:'p1.jpg' }, // 占r2,r3
    { id:'w3', type:'wide', r:2, c:2, file:'w3.jpg' }, 
    { id:'p2', type:'tall', r:2, c:4, file:'p2.jpg' }, 
    { id:'p3', type:'tall', r:2, c:5, file:'p3.jpg' }, 
    { id:'w4', type:'wide', r:2, c:6, file:'w4.jpg' }, 
    { id:'p4', type:'tall', r:2, c:8, file:'p4.jpg' }, 

    // --- 第3行 (填补竖图间的空隙) ---
    { id:'w5', type:'wide', r:3, c:2, file:'w5.jpg' },
    { id:'w6', type:'wide', r:3, c:6, file:'w6.jpg' },

    // --- 第4行 (最宽处) ---
    { id:'s3', type:'sq',   r:4, c:1, file:'s3.jpg' },
    { id:'w7', type:'wide', r:4, c:2, file:'w7.jpg' },
    { id:'s4', type:'sq',   r:4, c:4, file:'s4.jpg' },
    { id:'s5', type:'sq',   r:4, c:5, file:'s5.jpg' },
    { id:'w8', type:'wide', r:4, c:6, file:'w8.jpg' },
    { id:'s6', type:'sq',   r:4, c:8, file:'s6.jpg' },

    // --- 第5行 (收缩) ---
    { id:'p5', type:'tall', r:5, c:2, file:'p5.jpg' }, // 占r5,r6
    { id:'w9', type:'wide', r:5, c:3, file:'w9.jpg' },
    { id:'w10',type:'wide', r:5, c:5, file:'w10.jpg' },
    { id:'p6', type:'tall', r:5, c:7, file:'p6.jpg' },

    // --- 第6行 (填补) ---
    { id:'w11', type:'wide', r:6, c:3, file:'w11.jpg' },
    { id:'w12', type:'wide', r:6, c:5, file:'w12.jpg' },

    // --- 第7行 (尖尖) ---
    { id:'w13', type:'wide', r:7, c:4, file:'w13.jpg' } // 居中
];

// 自动生成虚拟文案
LAYOUT.forEach((item, i) => {
    item.date = `2023.05.${(i%30)+1}`;
    item.loc = i%2===0 ? "Home Sweet Home" : "Traveling";
    item.text = `这是关于 ${item.file} 的美好回忆。第 ${i+1} 个心动瞬间。`;
});


window.onload = function() {
    initEntry();
    renderGrid();
    initTimer();
};

// 1. 修复音频播放逻辑
function initEntry() {
    const btn = document.getElementById("enter-btn");
    const music = document.getElementById("bg-music");
    const screen = document.getElementById("welcome-screen");

    btn.addEventListener("click", () => {
        // 关键：在用户点击事件中调用 play()
        music.play().then(() => {
            console.log("Music Playing");
        }).catch(err => {
            console.log("Auto-play blocked, wait for interaction", err);
        });

        // 移除遮罩
        screen.style.opacity = 0;
        setTimeout(() => screen.remove(), 800);
    });
}

// 2. 渲染绝对定位网格
function renderGrid() {
    const grid = document.getElementById("heart-grid");
    
    LAYOUT.forEach(item => {
        const div = document.createElement("div");
        div.className = `brick brick-${item.type}`;
        
        // 绝对定位核心
        div.style.gridRowStart = item.r;
        div.style.gridColumnStart = item.c;
        
        // 跨度设置
        if(item.type === 'wide') div.style.gridColumnEnd = "span 2";
        if(item.type === 'tall') div.style.gridRowEnd = "span 2";

        if (DEBUG_MODE) {
            // 调试模式：显示色块和文字
            div.classList.add(`debug-${item.type}`);
            div.innerText = item.file;
        } else {
            // 正常模式：显示图片
            const img = document.createElement("img");
            img.src = `images/gallery/${item.file}`;
            div.appendChild(img);
            
            // 交互
            div.addEventListener("mouseenter", () => preview(item));
            div.addEventListener("click", (e) => lock(e, item, div));
        }

        grid.appendChild(div);
    });
}

// 3. 预览逻辑
const prevImg = document.getElementById("preview-img");
const placeholder = document.getElementById("placeholder");
const infoBar = document.getElementById("info-bar");
let isLocked = false;

function preview(item) {
    if(isLocked) return;
    
    placeholder.style.opacity = 0;
    prevImg.style.opacity = 0.8;
    
    // 简单的图片切换
    setTimeout(() => {
        prevImg.src = `images/gallery/${item.file}`;
        prevImg.style.opacity = 1;
    }, 50);
}

function lock(e, item, el) {
    isLocked = true;
    
    // 高亮当前
    document.querySelectorAll('.brick').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    
    // 强制显示当前图
    prevImg.src = `images/gallery/${item.file}`;
    prevImg.style.opacity = 1;
    placeholder.style.display = 'none';
    
    // 显示底部文字
    document.getElementById("p-date").innerText = item.date;
    document.getElementById("p-loc").innerText = item.loc;
    document.getElementById("p-text").innerText = item.text;
    
    infoBar.classList.add("show");
}

function initTimer() {
    const el = document.getElementById("timer");
    const start = new Date(START_DATE);
    setInterval(() => {
        const d = Math.floor((new Date() - start) / 86400000);
        el.innerText = `${d} DAYS OF LOVE`;
    }, 1000);
}
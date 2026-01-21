// ==========================================
// 🔴 调试开关：true = 显示色块 | false = 显示照片
// 请先保持 true 查看形状，准备好照片后再改为 false
const DEBUG_MODE = true; 
// ==========================================

const START_DATE = "2023-05-20T00:00:00"; 

// 37张照片布局 (10列 x 9行)
// 基础网格 50px
// sq: 1x1, wide: 2x1, tall: 1x2
const LAYOUT = [
    // --- Row 1 (顶部) ---
    // 左右两边各空1格, 中间空2格
    { id:'s1', type:'sq',   r:1, c:2, f:'s1.jpg' },
    { id:'w1', type:'wide', r:1, c:3, f:'w1.jpg' }, // c3-4
    { id:'w2', type:'wide', r:1, c:7, f:'w2.jpg' }, // c7-8
    { id:'s2', type:'sq',   r:1, c:9, f:'s2.jpg' },

    // --- Row 2 (最宽处) ---
    { id:'p1', type:'tall', r:2, c:1, f:'p1.jpg' }, // r2-3
    { id:'w3', type:'wide', r:2, c:2, f:'w3.jpg' },
    { id:'s3', type:'sq',   r:2, c:4, f:'s3.jpg' },
    { id:'s4', type:'sq',   r:2, c:5, f:'s4.jpg' },
    { id:'w4', type:'wide', r:2, c:6, f:'w4.jpg' }, // 修正：s4占5, w4占6-7
    { id:'w5', type:'wide', r:2, c:8, f:'w5.jpg' },
    { id:'p2', type:'tall', r:2, c:10, f:'p2.jpg' }, // r2-3

    // --- Row 3 (填充 Row 2 竖图中间) ---
    // p1(c1), p2(c10) 占着位
    { id:'w6', type:'wide', r:3, c:2, f:'w6.jpg' },
    { id:'p3', type:'tall', r:3, c:4, f:'p3.jpg' }, // r3-4
    { id:'w7', type:'wide', r:3, c:5, f:'w7.jpg' }, // 跨 c5-6
    { id:'p4', type:'tall', r:3, c:7, f:'p4.jpg' }, // r3-4
    { id:'w8', type:'wide', r:3, c:8, f:'w8.jpg' },

    // --- Row 4 (宽阔部) ---
    { id:'s5', type:'sq',   r:4, c:1, f:'s5.jpg' },
    { id:'w9', type:'wide', r:4, c:2, f:'w9.jpg' },
    // c4(p3占), c7(p4占)
    { id:'w10',type:'wide', r:4, c:5, f:'w10.jpg' },
    { id:'w11',type:'wide', r:4, c:8, f:'w11.jpg' },
    { id:'s6', type:'sq',   r:4, c:10,f:'s6.jpg' },

    // --- Row 5 (开始收缩) ---
    { id:'p5', type:'tall', r:5, c:2, f:'p5.jpg' }, // r5-6
    { id:'w12',type:'wide', r:5, c:3, f:'w12.jpg' },
    { id:'p6', type:'tall', r:5, c:5, f:'p6.jpg' }, // r5-6 (中柱)
    { id:'w13',type:'wide', r:5, c:6, f:'w13.jpg' }, // 修正：p6占5, w13占6-7
    { id:'p7', type:'tall', r:5, c:8, f:'p7.jpg' }, // r5-6
    { id:'w14',type:'wide', r:5, c:9, f:'w14.jpg' }, // 这里的w14太宽了会溢出? 不，c9-10 ok

    // --- Row 6 (填充) ---
    // p5(c2), p6(c5), p7(c8) 占位
    { id:'w15',type:'wide', r:6, c:3, f:'w15.jpg' },
    // p6占c5
    { id:'w16',type:'wide', r:6, c:6, f:'w16.jpg' },
    { id:'s7', type:'sq',   r:6, c:9, f:'s7.jpg' }, // 修正填空

    // --- Row 7 (下部) ---
    { id:'p8', type:'tall', r:7, c:3, f:'p8.jpg' }, // r7-8
    { id:'w17',type:'wide', r:7, c:4, f:'w17.jpg' },
    { id:'w18',type:'wide', r:7, c:6, f:'w18.jpg' },
    { id:'p9', type:'tall', r:7, c:8, f:'p9.jpg' }, // r7-8

    // --- Row 8 (填充) ---
    // p8(c3), p9(c8) 占位
    { id:'w19',type:'wide', r:8, c:4, f:'w19.jpg' },
    { id:'p10',type:'tall', r:8, c:6, f:'p10.jpg' }, // r8-9 (尖尖柱)

    // --- Row 9 (底部尖) ---
    { id:'s8', type:'sq',   r:9, c:5, f:'s8.jpg' }
    // p10 占c6
];

// 自动生成文案
LAYOUT.forEach((item, i) => {
    item.date = `2023.05.${(i%30)+1}`;
    item.loc = i%2===0 ? "Sweet Home" : "Date Place";
    item.text = `这是第 ${i+1} 张照片的回忆。`;
});

window.onload = function() {
    initEntry();
    renderGrid();
    initTimer();
};

function initEntry() {
    const btn = document.getElementById("enter-btn");
    const music = document.getElementById("bg-music");
    const screen = document.getElementById("welcome-screen");

    btn.addEventListener("click", () => {
        music.play().catch(e => console.log(e));
        screen.style.opacity = 0;
        setTimeout(() => screen.remove(), 800);
    });
}

function renderGrid() {
    const grid = document.getElementById("heart-grid");
    
    LAYOUT.forEach(item => {
        const div = document.createElement("div");
        div.className = "brick"; // 基础类
        
        // 绝对定位
        div.style.gridRowStart = item.r;
        div.style.gridColumnStart = item.c;
        if(item.type === 'wide') div.style.gridColumnEnd = "span 2";
        if(item.type === 'tall') div.style.gridRowEnd = "span 2";

        if (DEBUG_MODE) {
            // 调试模式：添加debug类和颜色类
            div.classList.add("debug", item.type);
            div.innerText = item.f;
        } else {
            // 正常模式：不添加debug类！
            const img = document.createElement("img");
            img.src = `images/gallery/${item.f}`;
            div.appendChild(img);
            
            div.addEventListener("mouseenter", () => preview(item));
            div.addEventListener("click", (e) => lock(e, item, div));
        }

        grid.appendChild(div);
    });
}

const prevImg = document.getElementById("preview-img");
const placeholder = document.getElementById("placeholder");
const infoBar = document.getElementById("info-bar");
let isLocked = false;

function preview(item) {
    if(isLocked) return;
    placeholder.style.opacity = 0;
    prevImg.style.opacity = 0.8;
    setTimeout(() => {
        prevImg.src = `images/gallery/${item.f}`;
        prevImg.style.opacity = 1;
    }, 50);
}

function lock(e, item, el) {
    isLocked = true;
    document.querySelectorAll('.brick').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    
    prevImg.src = `images/gallery/${item.f}`;
    prevImg.style.opacity = 1;
    placeholder.style.display = 'none';
    
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
        el.innerText = `${d} DAYS TOGETHER`;
    }, 1000);
}
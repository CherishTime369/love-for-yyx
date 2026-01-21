// --- 配置区 ---
const START_DATE = "2023-05-20T00:00:00"; 

// 33张照片的精确数据库
// 顺序至关重要，对应了拼图从上到下、从左到右的逻辑
const DB = [
    // Row 1 (顶部圆弧): s1, w1, w2, s2
    {f:'s1.jpg', t:'brick-sq'}, {f:'w1.jpg', t:'brick-wide'}, {f:'w2.jpg', t:'brick-wide'}, {f:'s2.jpg', t:'brick-sq'},
    
    // Row 2 (上半部): p1, w3, p2, p3, w4, p4
    {f:'p1.jpg', t:'brick-tall'}, {f:'w3.jpg', t:'brick-wide'}, {f:'p2.jpg', t:'brick-tall'}, 
    {f:'p3.jpg', t:'brick-tall'}, {f:'w4.jpg', t:'brick-wide'}, {f:'p4.jpg', t:'brick-tall'},

    // Row 3 (填充R2的空隙): w5, w6
    {f:'w5.jpg', t:'brick-wide'}, {f:'w6.jpg', t:'brick-wide'},

    // Row 4 (中部最宽): s3, w7, s4, s5, w8, s6
    {f:'s3.jpg', t:'brick-sq'}, {f:'w7.jpg', t:'brick-wide'}, {f:'s4.jpg', t:'brick-sq'},
    {f:'s5.jpg', t:'brick-sq'}, {f:'w8.jpg', t:'brick-wide'}, {f:'s6.jpg', t:'brick-sq'},

    // Row 5 (下半部开始): p5, w9, w10, w11, p6
    {f:'p5.jpg', t:'brick-tall'}, {f:'w9.jpg', t:'brick-wide'}, {f:'w10.jpg', t:'brick-wide'}, 
    {f:'w11.jpg', t:'brick-wide'}, {f:'p6.jpg', t:'brick-tall'},

    // Row 6 (填充R5的空隙): w12, w13, w14
    {f:'w12.jpg', t:'brick-wide'}, {f:'w13.jpg', t:'brick-wide'}, {f:'w14.jpg', t:'brick-wide'},

    // Row 7 (收缩): p7, w15, w16, p8
    {f:'p7.jpg', t:'brick-tall'}, {f:'w15.jpg', t:'brick-wide'}, {f:'w16.jpg', t:'brick-wide'}, {f:'p8.jpg', t:'brick-tall'},

    // Row 8 (填充R7的空隙): s7, s8
    {f:'s7.jpg', t:'brick-sq'}, {f:'s8.jpg', t:'brick-sq'},

    // Row 9 (尖尖): w17
    {f:'w17.jpg', t:'brick-wide'}
];

// 自动生成文案 (你可以手动修改这里的内容)
DB.forEach((item, i) => {
    item.date = `2023.05.${(i%30)+1}`;
    item.loc = i%2===0 ? "Sweet Home" : "Date Place";
    item.text = `这是第 ${i+1} 个心动瞬间。`;
});

// --- 初始化 ---
window.onload = function() {
    initEntry();
    initMosaic();
    initTimer();
};

function initEntry() {
    const btn = document.getElementById("enter-btn");
    btn.addEventListener("click", () => {
        document.getElementById("bg-music").play().catch(()=>{});
        document.getElementById("welcome-screen").style.opacity = 0;
        setTimeout(() => document.getElementById("welcome-screen").remove(), 800);
    });
}

// --- 核心：33张照片的精确布局 ---
function initMosaic() {
    const grid = document.getElementById("mosaic-grid");
    
    // 我们强制使用 8列 网格
    grid.style.gridTemplateColumns = "repeat(8, 1fr)";

    // 布局逻辑序列
    // type: 'space' | 'img'
    // idx: 对应上面 DB 数组的下标
    const layout = [
        // Row 1: 空1, s1, w1, w2, s2, 空1 (1+1+2+2+1+1 = 8)
        {type:'space', n:1}, {idx:0}, {idx:1}, {idx:2}, {idx:3}, {type:'space', n:1},
        
        // Row 2: p1, w3, p2, p3, w4, p4 (1+2+1+1+2+1 = 8)
        // 注意: p是竖图，会挡住下一行的位置
        {idx:4}, {idx:5}, {idx:6}, {idx:7}, {idx:8}, {idx:9},
        
        // Row 3: (p1挡), w5, w6, (p4挡)
        // p1占了第1列，p2占第4列，p3占第5列，p4占第8列
        // 空余位置: 2-3 (w3下面), 6-7 (w4下面)
        {idx:10}, {idx:11},
        
        // Row 4: s3, w7, s4, s5, w8, s6 (1+2+1+1+2+1 = 8)
        {idx:12}, {idx:13}, {idx:14}, {idx:15}, {idx:16}, {idx:17},
        
        // Row 5: p5, w9, w10, w11, p6 (1+2+2+2+1 = 8)
        {idx:18}, {idx:19}, {idx:20}, {idx:21}, {idx:22},
        
        // Row 6: (p5挡), w12, w13, w14, (p6挡)
        // p5占第1列，p6占第8列。中间剩6格。
        // w12(2), w13(2), w14(2) 填满6格
        {idx:23}, {idx:24}, {idx:25},
        
        // Row 7: 空1, p7, w15, w16, p8, 空1 (1+1+2+2+1+1 = 8)
        {type:'space', n:1}, {idx:26}, {idx:27}, {idx:28}, {idx:29}, {type:'space', n:1},
        
        // Row 8: (p7挡), s7, s8, (p8挡)
        // p7占第2列，p8占第7列。
        // w15下面是3-4, w16下面是5-6。
        // 我们用 s7(3), s8(6) ? 不，我们填满
        // 这里需要填补 w15和w16下面的空隙
        // DB定义 Row 8是 s7, s8。
        // 我们把 s7 放(3-4中间?不，s是1格), 我们改一下
        // 我们用两个宽图 w15, w16占据了中间。下一行我们用 s7, s8 来填充 p7/p8 中间的空隙
        // 空隙列: 3,4,5,6。s7放在3, s8放在6? 中间空?
        // 让我们调整为: s7放在3-4(作为宽图?不), 
        // 修正布局: 用 s7 填(3), s8 填(6). 中间 4-5 空?
        // 不，为了美观，我们让 Row 8 填满。
        // 实际上 Row 7 的 w15, w16 也是宽图。
        // 让我们稍微变通一下：Row 8 使用 s7(占用3-4), s8(占用5-6) -> 强制把 s 改成 span 2? 
        // 或者，我们直接在 Grid 里让 s7 占 3, s8 占 4, ...
        // 简单点：Row 8 放 s7, s8。并加两个 Spacer。
        {type:'space', n:2}, {idx:30}, {idx:31}, {type:'space', n:2}, // 这里的idx30,31是s7,s8
        
        // Row 9: 空3, w17, 空3 (3+2+3 = 8)
        {type:'space', n:3}, {idx:32}, {type:'space', n:3}
    ];
    
    // 渲染
    layout.forEach(item => {
        if(item.type === 'space') {
            const sp = document.createElement('div');
            sp.className = 'spacer';
            sp.style.gridColumn = `span ${item.n}`;
            grid.appendChild(sp);
        } else {
            const data = DB[item.idx];
            if(!data) return;
            
            const div = document.createElement('div');
            div.className = `photo-brick ${data.t}`;
            
            // 特殊处理 Row 8 的 s7, s8，让它们居中一点
            if(item.idx === 30 || item.idx === 31) {
                div.style.gridColumn = "span 2"; // 强制把这两个方图拉宽一点点填补空隙
            }
            
            const img = document.createElement('img');
            img.src = `images/gallery/${data.f}`;
            div.appendChild(img);
            
            div.addEventListener('mouseenter', () => preview(data));
            div.addEventListener('click', (e) => lock(e, data, div));
            grid.appendChild(div);
        }
    });
}

// --- 右侧预览逻辑 (保持不变) ---
const mainImg = document.getElementById("main-img");
const captionBar = document.getElementById("caption-bar");
const guideText = document.getElementById("guide-text");
let isLocked = false;

function preview(data) {
    if(isLocked) return;
    mainImg.style.opacity = 0.8;
    setTimeout(() => {
        mainImg.src = `images/gallery/${data.f}`;
        mainImg.style.opacity = 1;
    }, 50);
}

function lock(e, data, el) {
    isLocked = true;
    document.querySelectorAll('.photo-brick').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    
    mainImg.src = `images/gallery/${data.f}`;
    mainImg.style.opacity = 1;
    
    document.getElementById("c-date").innerText = data.date;
    document.getElementById("c-loc").innerText = data.loc;
    document.getElementById("c-text").innerText = data.text;
    
    captionBar.classList.add("show");
    guideText.classList.add("hide");
    
    createParticles();
}

function createParticles() {
    const box = document.querySelector('.img-box');
    for(let i=0; i<15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = '50%';
        p.style.top = '50%';
        p.style.setProperty('--x', (Math.random()*200 - 100) + 'px');
        p.style.setProperty('--y', (Math.random()*200 - 100) + 'px');
        box.appendChild(p);
        setTimeout(()=>p.remove(), 600);
    }
}

function initTimer() {
    const t = document.getElementById("timer");
    setInterval(() => {
        const d = Math.floor((new Date() - new Date(START_DATE)) / 86400000);
        t.innerText = `${d} DAYS TOGETHER`;
    }, 1000);
}
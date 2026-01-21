// --- 1. 配置数据 ---
const START_DATE = "2023-05-20T00:00:00"; 

// 19张照片配置
// 注意：现在 v 代表 4:3 横图, h 代表 16:9 横图
// 顺序对应心形从上到下，从左到右的位置
const MEMORY_DATA = [
    // --- Row 1 (顶部凸起, 4:3 比较合适) ---
    { file: 'v1.jpg', date: '2023.06.01', loc: '公园', text: '初夏的微风，和你嘴角的笑意。' },
    { file: 'v2.jpg', date: '2023.06.15', loc: '书店', text: '安静的午后，时光变得很慢。' },
    { file: 'v3.jpg', date: '2023.07.02', loc: '奶茶店', text: '你说这杯奶茶有恋爱的甜味。' },
    { file: 'v4.jpg', date: '2023.07.20', loc: '地铁', text: '靠在我的肩膀，睡得很香。' },
    
    // --- Row 2 (加宽部分, 16:9 比较合适) ---
    { file: 'h1.jpg', date: '2023.08.01', loc: '海边', text: '浪花拍打着脚踝，我们牵手走过。' },
    { file: 'h2.jpg', date: '2023.08.05', loc: '日出', text: '第一缕阳光洒在你脸上，真美。' },
    { file: 'h3.jpg', date: '2023.08.10', loc: '晚餐', text: '浪漫的烛光，倒映在你眼中。' },

    // --- Row 3 (最宽部分, 16:9) ---
    { file: 'h4.jpg', date: '2023.09.01', loc: '游乐园', text: '旋转木马转啊转，幸福也围着我们转。' },
    { file: 'h5.jpg', date: '2023.09.12', loc: '城堡', text: '在童话世界里，你就是我的公主。' },
    { file: 'h6.jpg', date: '2023.10.01', loc: '过山车', text: '尖叫声中，抓紧彼此的手。' },

    // --- Row 4 (开始收缩, 16:9) ---
    { file: 'h7.jpg', date: '2023.11.11', loc: '影院', text: '电影散场，故事还在继续。' },
    { file: 'h8.jpg', date: '2023.12.25', loc: '圣诞', text: '雪花落下，心是热的。' },

    // --- Row 5 (下部, 4:3) ---
    { file: 'v5.jpg', date: '2024.01.01', loc: '跨年', text: '新年快乐，往后余生请多指教。' },
    { file: 'v6.jpg', date: '2024.02.14', loc: '情人节', text: '玫瑰和你，都是我的珍宝。' },
    { file: 'v7.jpg', date: '2024.03.20', loc: '踏青', text: '春风十里，不如你的一笑。' },
    { file: 'v8.jpg', date: '2024.04.05', loc: '雨天', text: '小小的伞下，是我们的全世界。' },

    // --- Row 6 (尖尖, 16:9 居中) ---
    { file: 'h9.jpg', date: '2024.05.20', loc: '一周年', text: '爱是积累，是每一天的点点滴滴。' }
];

// --- 2. 初始化 ---
window.onload = function() {
    initEntry();
    initHeartGrid();
};

function initEntry() {
    document.getElementById("start-btn").addEventListener("click", () => {
        document.getElementById("bg-music").play().catch(()=>console.log("AutoPlay Blocked"));
        document.getElementById("welcome-screen").style.transform = "translateY(-100%)";
        
        setTimeout(startOdometer, 800);
        // 默认显示第1张
        changeViewer(0);
        // 默认点亮第1张心形
        document.querySelector('.heart-item').classList.add('active');
    });
}

// --- 3. 渲染心形墙 ---
function initHeartGrid() {
    const grid = document.getElementById("heart-mosaic");
    
    MEMORY_DATA.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = `heart-item pos-${index + 1}`;
        
        const img = document.createElement("img");
        img.src = `images/gallery/${item.file}`;
        img.loading = "lazy";
        
        div.appendChild(img);
        
        // 点击事件
        div.addEventListener("click", () => {
            // 切换高亮
            document.querySelectorAll(".heart-item").forEach(el => el.classList.remove("active"));
            div.classList.add("active");
            // 切换右侧内容
            changeViewer(index);
        });

        grid.appendChild(div);
    });
}

// --- 4. 切换右侧视窗 (淡入淡出) ---
function changeViewer(index) {
    const data = MEMORY_DATA[index];
    const container = document.querySelector(".viewer-container");
    const imgEl = document.getElementById("view-img");
    const dateEl = document.getElementById("view-date");
    const locEl = document.getElementById("view-loc");
    const textEl = document.getElementById("view-text");

    // 1. 淡出
    container.classList.remove("visible");

    // 2. 只有当CSS动画结束后才切换内容 (300ms后)
    setTimeout(() => {
        imgEl.src = `images/gallery/${data.file}`;
        dateEl.innerText = data.date;
        locEl.innerText = data.loc;
        textEl.innerText = data.text;
        
        // 3. 淡入
        container.classList.add("visible");
    }, 300);
}

// --- 5. 老虎机计时器 (优化版) ---
function startOdometer() {
    const start = new Date(START_DATE);
    const now = new Date();
    const diff = now - start;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    const container = document.getElementById("timer-container");
    container.innerHTML = ""; 
    
    // 创建数字组
    const createGroup = (value, label) => {
        const group = document.createElement("div");
        group.className = "odo-group";
        
        const digits = value.toString().split("");
        if (label !== "天" && digits.length < 2) digits.unshift("0");

        digits.forEach((num, i) => {
            const digitBox = document.createElement("div");
            digitBox.className = "odo-digit";
            const strip = document.createElement("div");
            strip.className = "odo-strip";
            
            // 构造滚动序列: 0...9 + 目标数字
            let html = "";
            for(let j=0; j<=9; j++) html += `<div>${j}</div>`;
            html += `<div>${num}</div>`; 
            strip.innerHTML = html;
            
            digitBox.appendChild(strip);
            group.appendChild(digitBox);
            
            // 延迟滚动，制造波浪感
            setTimeout(() => {
                strip.style.transform = `translateY(-${10 * 30}px)`;
            }, i * 200); 
        });
        
        const unit = document.createElement("span");
        unit.className = "odo-label";
        unit.innerText = label;
        group.appendChild(unit);
        
        container.appendChild(group);
    };

    createGroup(days, "DAYS");
    createGroup(hours, "HRS");
    createGroup(minutes, "MIN");
}
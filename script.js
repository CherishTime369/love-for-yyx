// --- 配置区 ---
const START_DATE = "2023-05-20T00:00:00"; // 在一起的日期
const CAROUSEL_IMAGES = ["slide1.jpg", "slide2.jpg", "slide3.jpg"]; // 轮播图文件名，请确保images文件夹里有
const TYPING_TEXT = "遇见你是我所有美好的开始，愿我们的未来如星河般璀璨。";

// 1. 模拟生成照片数据 (后期你可以把这里改成手动填写)
// 格式: { img: '1.jpg', date: '...', loc: '...', text: '...' }
const MEMORIES = [
    { img: '1.jpg', date: '2023-05-20', loc: '外滩', text: '这是我们第一次约会，你那天穿白裙子真美。' },
    { img: '2.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '3.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '4.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '5.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '6.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '7.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '8.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '9.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '10.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '11.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '12.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '13.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '14.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' }, 
    { img: '15.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '16.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '17.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '18.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '19.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    { img: '20.jpg', date: '2023-06-01', loc: '电影院', text: '看恐怖片你吓得躲进我怀里。' },
    // ... 继续添加
];
// --- 初始化执行 ---
window.onload = function() {
    initMusicClick();
    initCarousel();
    initGallery();
};

// --- 功能 1: 进场与音乐 ---
function initMusicClick() {
    const startBtn = document.getElementById("start-btn");
    const welcomeScreen = document.getElementById("welcome-screen");
    const music = document.getElementById("bg-music");
    const typewriterElement = document.getElementById("typewriter");

    startBtn.addEventListener("click", () => {
        // 播放音乐
        music.play().catch(e => console.log("音乐播放失败:", e));
        
        // 隐藏欢迎层
        welcomeScreen.classList.add("fade-out");
        
        // 开始各种动画
        startTimerAnimation();     // 启动计时器动画
        startTypewriter(typewriterElement); // 启动打字机
    });
}

// --- 功能 2: 数字拨动计时器 ---
function startTimerAnimation() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    // A. 疯狂乱跳阶段 (持续2秒)
    let scrambleInterval = setInterval(() => {
        daysEl.innerText = Math.floor(Math.random() * 999);
        hoursEl.innerText = Math.floor(Math.random() * 24);
        minutesEl.innerText = Math.floor(Math.random() * 60);
        secondsEl.innerText = Math.floor(Math.random() * 60);
    }, 50);

    // B. 2秒后定格并开始正常计时
    setTimeout(() => {
        clearInterval(scrambleInterval);
        realTimer(); // 执行一次
        setInterval(realTimer, 1000); // 开启每秒更新
    }, 2000);

    function realTimer() {
        const start = new Date(START_DATE);
        const now = new Date();
        const diff = now - start;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        // 补零函数
        const fmt = (n) => n < 10 ? "0" + n : n;

        daysEl.innerText = days;
        hoursEl.innerText = fmt(hours);
        minutesEl.innerText = fmt(minutes);
        secondsEl.innerText = fmt(seconds); // 秒数持续跳动
    }
}

// --- 功能 3: 头部轮播图 ---
function initCarousel() {
    const imgEl = document.getElementById("carousel-img");
    let currentIndex = 0;

    // 预加载图片防止闪烁
    CAROUSEL_IMAGES.forEach(src => {
        const img = new Image();
        img.src = "images/" + src;
    });

    setInterval(() => {
        // 1. 淡出
        imgEl.style.opacity = 0;
        
        setTimeout(() => {
            // 2. 切换图片
            currentIndex = (currentIndex + 1) % CAROUSEL_IMAGES.length;
            imgEl.src = "images/" + CAROUSEL_IMAGES[currentIndex];
            
            // 3. 淡入
            imgEl.style.opacity = 1;
        }, 500); // 等待0.5秒淡出动画完成
    }, 4000); // 每4秒切换一次
}

// --- 功能 4: 照片墙与弹窗交互 ---
function initGallery() {
    const galleryContainer = document.getElementById("gallery");
    const lightbox = document.getElementById("lightbox");
    const lbImg = document.getElementById("lightbox-img");
    const lbDate = document.getElementById("lightbox-date");
    const lbLoc = document.querySelector("#lightbox-loc span");
    const lbText = document.getElementById("lightbox-text");
    const closeBtn = document.querySelector(".close-btn");

    // 渲染照片墙
    MEMORIES.forEach((memory) => {
        const card = document.createElement("div");
        card.className = "photo-card";
        
        // 这里假设图片在 images/gallery/ 文件夹下
        // 注意：你需要确保图片路径正确
        const imgPath = `images/gallery/${memory.img}`; 
        
        card.innerHTML = `<img src="${imgPath}" loading="lazy" alt="Memory">`;
        
        // 点击事件
        card.addEventListener("click", () => {
            lbImg.src = imgPath;
            lbDate.innerText = memory.date;
            lbLoc.innerText = memory.loc;
            lbText.innerText = memory.text;
            
            lightbox.classList.add("active");
            lightbox.classList.remove("hidden");
        });

        galleryContainer.appendChild(card);
    });

    // 关闭弹窗
    const hideLightbox = () => {
        lightbox.classList.remove("active");
        setTimeout(() => lightbox.classList.add("hidden"), 300);
    };

    closeBtn.addEventListener("click", hideLightbox);
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) hideLightbox();
    });
}

// --- 辅助: 打字机 ---
function startTypewriter(element) {
    let i = 0;
    element.innerHTML = "";
    function type() {
        if (i < TYPING_TEXT.length) {
            element.innerHTML += TYPING_TEXT.charAt(i);
            i++;
            setTimeout(type, 150);
        }
    }
    type();
}
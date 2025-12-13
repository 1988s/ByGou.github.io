/**
 * ByGou Script - Compliance & Features
 */

/* --- Configuration & Mock API --- */
const API = {
    async login(email, pwd) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(email && pwd) {
                    resolve({ 
                        data: { 
                            token: "mock-token", 
                            user: { name: "张同学", school: "北京大学", avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${email}` } 
                        } 
                    });
                } else reject();
            }, 600);
        });
    },
    async register(name, email, pwd) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ 
                    data: { 
                        token: "mock-token", 
                        user: { name: name || "新同学", school: "未认证", avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${email}` } 
                    } 
                });
            }, 600);
        });
    },
    async publish(data) { return new Promise(resolve => setTimeout(resolve, 800)); }
};

/* --- State --- */
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    // 恢复状态
    const saved = sessionStorage.getItem('user_info');
    if (saved) { currentUser = JSON.parse(saved); updateUI(true); }
    
    // 动画
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
        if(e.isIntersecting) e.target.classList.add('visible');
    }), { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(e => obs.observe(e));
    
    // 全局点击关闭菜单
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('userDropdown');
        const trigger = document.getElementById('navUserArea');
        if (menu && menu.classList.contains('show') && !menu.contains(e.target) && !trigger.contains(e.target)) {
            menu.classList.remove('show');
        }
    });

    // 发布页逻辑
    const schoolDisplay = document.getElementById('userSchoolDisplay');
    if(schoolDisplay && currentUser) schoolDisplay.innerText = currentUser.school;
});

/* --- Auth --- */
async function handleLogin(e) {
    const btn = e.target;
    btn.innerText = "登录中...";
    btn.disabled = true;
    try {
        const res = await API.login(document.getElementById('loginEmail').value, document.getElementById('loginPwd').value);
        currentUser = res.data.user;
        sessionStorage.setItem('user_info', JSON.stringify(currentUser));
        updateUI(true);
        closeModal(null, 'authModal');
        showToast(`欢迎回来，${currentUser.name}`);
    } catch(err) { showToast("登录失败，请检查账号"); } 
    finally { btn.innerText = "立即登录"; btn.disabled = false; }
}

async function handleRegister(e) {
    // 协议勾选检查
    const agree = document.getElementById('agreeChk');
    if(!agree.checked) {
        showToast("请先阅读并同意用户协议");
        agree.parentElement.style.color = "var(--accent-red)";
        setTimeout(() => agree.parentElement.style.color = "var(--text-sec)", 1000);
        return;
    }

    const btn = e.target;
    btn.innerText = "注册中...";
    try {
        const res = await API.register(document.getElementById('regName').value, document.getElementById('regEmail').value, "pwd");
        currentUser = res.data.user;
        sessionStorage.setItem('user_info', JSON.stringify(currentUser));
        updateUI(true);
        closeModal(null, 'authModal');
        showToast("注册成功");
    } catch(err) { showToast("注册失败"); } 
    finally { btn.innerText = "注册并登录"; }
}

function logout() {
    sessionStorage.clear(); currentUser = null; updateUI(false);
    document.getElementById('userDropdown').classList.remove('show');
    showToast("已退出登录");
}

/* --- UI Logic --- */
function toggleUserMenu() { document.getElementById('userDropdown').classList.toggle('show'); }

function updateUI(isLoggedIn) {
    const loginBtn = document.getElementById('navLoginBtn');
    const userArea = document.getElementById('navUserArea');
    if(!loginBtn || !userArea) return;
    if (isLoggedIn) {
        loginBtn.style.display = 'none'; userArea.style.display = 'flex';
        document.getElementById('userNameDisplay').innerText = currentUser.name;
        document.getElementById('userAvatarImg').src = currentUser.avatar;
        const badge = document.getElementById('currentSchool');
        if(badge) badge.innerText = currentUser.school;
    } else {
        loginBtn.style.display = 'block'; userArea.style.display = 'none';
    }
}

function switchTab(el, id) {
    document.querySelectorAll('.tab-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    if(id === 'home') window.scrollTo({top:0, behavior:'smooth'});
    if(id === 'cat' || id === 'guide') document.getElementById(id).scrollIntoView({behavior:'smooth'});
}

function handleMobileMine(el) {
    switchTab(el, 'mine');
    if(currentUser) showToast(`当前登录: ${currentUser.name}`);
    else openAuthModal('login');
}

function selectSchool(name) {
    const el = document.getElementById('currentSchool');
    if(el) el.innerText = name;
    document.querySelectorAll('.school-opt').forEach(opt => opt.classList.remove('active'));
    closeModal(null, 'schoolModal');
    if(currentUser) { currentUser.school = name; sessionStorage.setItem('user_info', JSON.stringify(currentUser)); }
}

/* --- Modals & QR --- */
function openAuthModal(view) { 
    document.getElementById('authModal').classList.add('active'); 
    document.getElementById('loginView').style.display = view === 'login' ? 'block' : 'none';
    document.getElementById('registerView').style.display = view === 'register' ? 'block' : 'none';
}
function switchView(view) { openAuthModal(view); }
function closeModal(e, id) { if(!e || e.target === document.getElementById(id)) document.getElementById(id).classList.remove('active'); }
function openSchoolModal() { document.getElementById('schoolModal').classList.add('active'); }

// 协议弹窗
function openAgreement(e) {
    if(e) { e.preventDefault(); e.stopPropagation(); }
    document.getElementById('agreementModal').classList.add('active');
}

// 二维码生成
let qrGenerated = false;
function openQrModal() {
    document.getElementById('qrModal').classList.add('active');
    if(!qrGenerated) {
        const container = document.getElementById('qrcode');
        container.innerHTML = "";
        new QRCode(container, {
            text: "https://u.wechat.com/MHZpcZWcZcedZ2T6VT8qlLg?s=2", // 替换为真实链接
            width: 170, height: 170,
            colorDark : "#000000", colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        qrGenerated = true;
    }
}

/* --- Utils --- */
function toggleTheme() {
    const b = document.body;
    b.setAttribute('data-theme', b.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}
function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').innerText = msg;
    t.style.top = "20px"; t.style.opacity = "1";
    setTimeout(() => { t.style.top = "-60px"; t.style.opacity = "0"; }, 2500);
}
function checkAuthAndAction() {
    if(!currentUser) { showToast("请先登录"); openAuthModal('login'); } 
    else { window.location.href = "publish.html"; }
}

/* --- Publish Page Image Logic --- */
function handleImageSelect(e) {
    const files = e.target.files;
    const grid = document.getElementById('imageGrid');
    if(!grid) return;
    grid.innerHTML = ''; grid.classList.add('has-images');
    for(let f of files) {
        const r = new FileReader();
        r.onload = function(ev) {
            const img = document.createElement('img');
            img.src = ev.target.result; img.className = 'preview-img';
            grid.appendChild(img);
        }
        r.readAsDataURL(f);
    }
}
async function submitPublish() {
    const title = document.getElementById('pubTitle').value;
    const price = document.getElementById('pubPrice').value;
    if(!title || !price) { showToast("请填写标题和价格"); return; }
    const btn = document.querySelector('.pub-submit-btn');
    btn.innerText = "发布中..."; btn.disabled = true;
    await API.publish();
    showToast("发布成功！");
    setTimeout(() => window.location.href = "index.html", 1000);
}

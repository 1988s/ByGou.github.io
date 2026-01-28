// js/app.js

document.addEventListener('alpine:init', () => {
    Alpine.data('landingPage', () => ({
        config: {
            appName: "白狗回收",
            wechatName: "白狗回收",
            qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://weixin.qq.com/r/example-placeholder", 
            contactEmail: "support@baigou.com",
            contactWechat: "baigou_support"
        },

        // 跑马灯文字
        marqueeText: "NIKE / JORDAN / DUNK / YEEZY / NEW BALANCE / SALOMON / ASICS /",

        features: [
            { icon: "camera", title: "拍照即估", desc: "无需寄出，在线先看价" },
            { icon: "lock-key", title: "价格锁定", desc: "确认回收即锁定金额" },
            { icon: "clock-afternoon", title: "48H 打款", desc: "验收无误极速到账" }
        ],
        
        steps: [
            { step: "01", title: "拍照提交", desc: "小程序上传照片", icon: "camera" },
            { step: "02", title: "获得报价", desc: "客服在线估价", icon: "chat-dots" },
            { step: "03", title: "预约发货", desc: "确认后寄出快递", icon: "package" },
            { step: "04", title: "验收打款", desc: "48小时内到账", icon: "bank" }
        ],

        faqs: [
            { q: "邮费谁来承担？", a: "寄出邮费需您先垫付。成交后我们会根据当前活动规则提供相应的邮费补贴。" },
            { q: "会不会到手刀？", a: "绝不。只要实物与您提交的照片一致，我们承诺不压价。诚信是我们的底线。" },
            { q: "多久能收到钱？", a: "仓库签收并验收通过后，48小时内款项会直接打入您的微信零钱。" },
            { q: "只收鞋盒吗？", a: "是的，我们专注于回收闲置的正品鞋盒，不需要鞋子。" }
        ],

        modalOpen: false,
        isWeChat: /MicroMessenger/i.test(navigator.userAgent),
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        copied: false,
        activeFaq: 0,
        loaded: false,

        init() {
            // 页面加载后触发入场动画
            setTimeout(() => { this.loaded = true }, 100);
        },

        handleMainCTA() {
            if (!this.isMobile) {
                const footer = document.getElementById('footer');
                if(footer) footer.scrollIntoView({ behavior: 'smooth' });
                return;
            }
            this.modalOpen = true;
        },

        copyText() {
            const text = this.config.wechatName;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => this.showCopied());
            } else {
                this.showCopied();
            }
        },

        showCopied() {
            this.copied = true;
            setTimeout(() => this.copied = false, 2000);
        },

        toggleFaq(index) {
            this.activeFaq = this.activeFaq === index ? null : index;
        }
    }));
});

/**
 * Assistive Touch Floating Button for Electricity Billing System
 * * ဤဖိုင်သည် main.html နှင့် unit.html ကို မူရင်းကုဒ်များမပျက်စီးစေဘဲ
 * iPhone Assistive Touch ကဲ့သို့ ရွှေ့ပြောင်းနိုင်သော ခလုတ်တစ်ခုကို ဖန်တီးပေးပါသည်။
 */

(function() {
    // ၁။ HTML Element ကို JavaScript သုံးပြီး Dynamic ဖန်တီးခြင်း
    const floatingBtn = document.createElement('div');
    floatingBtn.id = 'floatingCalcBtn';
    floatingBtn.className = 'floating-touch-btn';
    
    // ခလုတ်အတွင်းပိုင်းတည်ဆောက်ပုံ (unit.html သို့ ချိတ်ဆက်ထားသည်)
    floatingBtn.innerHTML = `
        <a href="unit.html" class="touch-btn-link" draggable="false" id="touchLink">
            <div class="zap-icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
            </div>
            <span class="touch-btn-text">မီတာယူနစ်တွက်မည်</span>
        </a>
    `;
    
    // Page ရဲ့ body အောက်ဆုံးထဲသို့ ခလုတ်ကို ထည့်သွင်းခြင်း
    document.body.appendChild(floatingBtn);

    // ၂။ CSS Style ကို JavaScript သုံးပြီး Header ထဲသို့ Dynamic ထည့်သွင်းခြင်း
    const style = document.createElement('style');
    style.textContent = `
        .floating-touch-btn {
            position: fixed;
            bottom: 100px;
            left: 20px;
            transform: translateY(-50%);
            z-index: 9999;
            display: flex;
            align-items: center;
            cursor: grab;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none; /* ဖုန်းမှာ drag ဆွဲစဉ် page scroll မဖြစ်အောင် တားဆီးရန် */
        }

        .floating-touch-btn:active {
            cursor: grabbing;
        }

        .touch-btn-link {
            display: flex;
            align-items: center;
            text-decoration: none;
            background-color: #1e293b;
            border: 2px solid #334155;
            padding: 6px;
            border-radius: 40px;
            color: #ffffff;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            max-width: 50px;
            overflow: hidden;
            white-space: nowrap;
            transition: max-width 0.4s ease, border-color 0.3s;
            pointer-events: auto;
        }

        /* Hover လုပ်ချိန်၊ Drag ဆွဲနေစဉ် သို့မဟုတ် Active (Expanded) ဖြစ်နေစဉ် စာသားကို ချဲ့ပြရန် */
        .floating-touch-btn:hover .touch-btn-link,
        .floating-touch-btn.dragging .touch-btn-link,
        .floating-touch-btn.expanded .touch-btn-link {
            max-width: 220px;
            background-color: #0f172a;
            border-color: #ef4444;
        }

        .zap-icon-circle {
            background-color: #ef4444;
            color: #ffffff;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .touch-btn-text {
            font-family: sans-serif;
            font-size: 14px;
            font-weight: bold;
            margin-left: 10px;
            margin-right: 15px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .floating-touch-btn:hover .touch-btn-text,
        .floating-touch-btn.dragging .touch-btn-text,
        .floating-touch-btn.expanded .touch-btn-text {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // ၃။ Drag & Drop နှင့် Touch လုပ်ဆောင်ချက်များ ရေးသားခြင်း
    let isDragging = false;
    let startX, startY;
    let initialX, initialY;
    let hasMoved = false;

    function dragStart(e) {
        isDragging = true;
        floatingBtn.classList.add('dragging');
        hasMoved = false;

        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        const rect = floatingBtn.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;

        startX = clientX;
        startY = clientY;

        floatingBtn.style.left = initialX + 'px';
        floatingBtn.style.top = initialY + 'px';
        floatingBtn.style.bottom = 'auto';
        floatingBtn.style.right = 'auto';
        floatingBtn.style.transform = 'none';
    }

    function dragMove(e) {
        if (!isDragging) return;

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const dx = clientX - startX;
        const dy = clientY - startY;

        // တကယ်ပဲ ရွှေ့နေတယ်ဆိုရင် Click နှိပ်တာမဟုတ်ဘဲ Dragging လုပ်နေတယ်လို့ သတ်မှတ်ခြင်း
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
            hasMoved = true;
        }

        let nextX = initialX + dx;
        let nextY = initialY + dy;

        // ဖန်သားပြင်ဘောင်ကျော်မသွားအောင် ကန့်သတ်ခြင်း (Boundary Check)
        const padding = 15;
        const maxW = window.innerWidth - floatingBtn.offsetWidth - padding;
        const maxH = window.innerHeight - floatingBtn.offsetHeight - padding;

        nextX = Math.max(padding, Math.min(nextX, maxW));
        nextY = Math.max(padding, Math.min(nextY, maxH));

        floatingBtn.style.left = nextX + 'px';
        floatingBtn.style.top = nextY + 'px';

        if (e.cancelable) e.preventDefault();
    }

    function dragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        floatingBtn.classList.remove('dragging');
    }

    // Mouse Events (PC / Laptop အတွက်)
    floatingBtn.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);

    // Touch Events (ဖုန်းများအတွက်)
    floatingBtn.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('touchend', dragEnd);

    // ခလုတ်အပြင်ဘက်ကို နှိပ်မိပါက စာသားပြန်ပိတ်ရန် လုပ်ဆောင်ချက်
    function closeExpandedBtn(e) {
        if (!floatingBtn.contains(e.target)) {
            floatingBtn.classList.remove('expanded');
            document.removeEventListener('click', closeExpandedBtn);
            document.removeEventListener('touchstart', closeExpandedBtn);
        }
    }

    // ဖုန်းတွင် ပထမတစ်ချက်နှိပ်ပါက စာသားကိုအရင်ပြသပြီး၊ ဒုတိယတစ်ချက်နှိပ်မှသာ Link ထဲသို့ သွားစေခြင်း
    const touchLink = document.getElementById('touchLink');
    touchLink.addEventListener('click', function(e) {
        if (hasMoved) {
            e.preventDefault(); // drag ဆွဲနေတာဖြစ်ရင် သွားမယ့် link ကို ပိတ်ထားမယ်
            return;
        }

        const isExpanded = floatingBtn.classList.contains('expanded');

        if (!isExpanded) {
            e.preventDefault(); // ပထမတစ်ချက်နှိပ်လျှင် link ထဲသို့ တိုက်ရိုက်မသွားစေရန် တားဆီးသည်
            floatingBtn.classList.add('expanded');

            // ပြင်ပနေရာကို နှိပ်လျှင် ခလုတ်ပြန်ကျုံ့သွားစေရန် Event Listener ချိတ်ဆက်ခြင်း
            setTimeout(() => {
                document.addEventListener('click', closeExpandedBtn);
                document.addEventListener('touchstart', closeExpandedBtn);
            }, 50);
        }
        // ဒုတိယတစ်ချက် (isExpanded ဖြစ်နေချိန်) နှိပ်ပါက link ထဲသို့ ပုံမှန်အတိုင်း ဝင်ရောက်သွားပါလိမ့်မည်။
    });
})();

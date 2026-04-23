// ၁။ Google Sheets သို့ Data ပို့ပေးမည့် URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyfYIlPb7vxHegkX6Z_aAtUjpt8nNFsjcLvkZfsvhJHTcLcA7-u1eoKMr6eokHJsiTQg/exec";

// Google Sheet ဆီသို့ Data ပို့ပေးသည့် function
function logSearchToSheet(keyword) {
    if (!keyword || keyword.trim() === "") return;

    // Browser Console မှာ စစ်ဆေးရန် (F12 နှိပ်ပြီးကြည့်နိုင်သည်)
    console.log("Sending to Sheet:", keyword);

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: keyword })
    })
    .then(() => {
        console.log("Logged successfully!");
    })
    .catch(err => {
        console.error("Fetch Error:", err);
    });
}

/**
 * Search လုပ်သည့်အခါ ခေါ်ယူမည့် function
 */
function performSearch() {
    // နည်းလမ်း (၁) - ID ဖြင့်ရှာခြင်း
    let searchInput = document.getElementById('searchInput');
    let query = "";

    if (searchInput) {
        query = searchInput.value;
    } 
    
    // နည်းလမ်း (၂) - အကယ်၍ ID မရှိလျှင် input box ကို တိုက်ရိုက်ရှာခြင်း
    if (!query) {
        const allInputs = document.querySelectorAll('input[type="text"]');
        // website မှာ input box တွေအများကြီးရှိနိုင်လို့ အနီးစပ်ဆုံး placeholder နဲ့ရှာကြည့်မယ်
        allInputs.forEach(input => {
            if (input.placeholder.includes('ရှာ') || input.className.includes('search')) {
                query = input.value;
            }
        });
        
        // အပေါ်ကမှ မရရင် ပထမဆုံးတွေ့တဲ့ input ထဲက စာကိုယူမယ်
        if (!query && allInputs.length > 0) {
            query = allInputs[0].value;
        }
    }

    if (query) {
        logSearchToSheet(query);
        console.log("Performing search for:", query);
    }
}

// ၃။ Website ပေါ်က ဘယ်နေရာမှာပဲဖြစ်ဖြစ် Enter ခေါက်ရင် အလုပ်လုပ်အောင်လုပ်ခြင်း
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        // ခဏစောင့်ပြီးမှ ယူခြင်း (Vue data update ဖြစ်ချိန်ပေးရန်)
        setTimeout(performSearch, 100);
    }
});

// ၄။ Search Button ကို နှိပ်ရင်လည်း အလုပ်လုပ်အောင် Event Listener ထည့်ခြင်း
document.addEventListener('click', function(e) {
    // Button စာသားက 'Search' ဖြစ်ရင် ဒါမှမဟုတ် search icon ဖြစ်ရင်
    if (e.target.innerText && e.target.innerText.toLowerCase().includes('search')) {
        setTimeout(performSearch, 100);
    }
});

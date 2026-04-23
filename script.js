// ၁။ Google Sheets သို့ Data ပို့ပေးမည့် URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyfYIlPb7vxHegkX6Z_aAtUjpt8nNFsjcLvkZfsvhJHTcLcA7-u1eoKMr6eokHJsiTQg/exec";

// Google Sheet ဆီသို့ Data ပို့ပေးသည့် function
function logSearchToSheet(keyword) {
    if (!keyword || keyword.trim() === "") return;

    console.log("Attempting to log keyword:", keyword);

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
        console.log("Success: Sent to Google Sheets");
    })
    .catch(err => {
        console.error("Fetch Error:", err);
    });
}

/**
 * Search လုပ်သည့်အခါ ခေါ်ယူမည့် function
 * index.html ရှိ <form @submit.prevent="performSearch()"> သို့မဟုတ် 
 * <button onclick="performSearch()"> တွင် ချိတ်ဆက်ထားရမည်။
 */
function performSearch() {
    // Input element ကို ID ဖြင့် ရှာသည်
    const searchInput = document.getElementById('searchInput');
    
    // အကယ်၍ ID ဖြင့် ရှာမတွေ့ပါက Vue.js ရဲ့ model ထဲက data ကို ယူရန် ကြိုးစားကြည့်မည်
    let query = "";
    
    if (searchInput) {
        query = searchInput.value;
    } else {
        // ID မပါလျှင် သို့မဟုတ် Vue သုံးထားလျှင် Selector ဖြင့် ထပ်ရှာသည်
        const vueInput = document.querySelector('input[type="text"]');
        if (vueInput) query = vueInput.value;
    }

    if (query) {
        logSearchToSheet(query);
        console.log("Searching for: " + query);
        
        // --- သင်၏ မူလ Search Filtering Logic များ ဤနေရာတွင် ရှိနိုင်သည် ---
    }
}

// Enter Key နှိပ်ခြင်းကို စစ်ဆေးရန်
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'INPUT') {
            performSearch();
        }
    }
});

// ၁။ ဖိုင်ရဲ့ အပေါ်ဆုံး (Line 1) မှာ ဒါကို အရင်ထည့်ပါ
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyfYIlPb7vxHegkX6Z_aAtUjpt8nNFsjcLvkZfsvhJHTcLcA7-u1eoKMr6eokHJsiTQg/exec";

function logSearchToSheet(keyword) {
    if (!keyword || keyword.trim() === "") return;

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: keyword })
    })
    .then(() => console.log("Search keyword logged to Google Sheets"))
    .catch(err => console.error("Error logging to Sheet:", err));
}

// ၂။ သင်၏ မူလ performSearch function ကို ရှာပြီး (Line 131 ဝန်းကျင်မှာ ရှိတတ်သည်)
// အောက်ပါအတိုင်း logSearchToSheet(query) စာကြောင်းလေး ထည့်ပေးပါ
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value;

    if (query) {
        // ဒီစာကြောင်းလေးကို if (query) အောက်မှာ ထည့်ပါ
        logSearchToSheet(query);

        console.log("Searching for: " + query);
        
        // သင်၏ မူလ filtering logic များ...
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        displayProducts(filteredProducts);
    }
}

// ၃။ ဖိုင်ရဲ့ အောက်ဆုံးမှာ Enter key အတွက် ဒါလေးကို ပေါင်းထည့်ပါ
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

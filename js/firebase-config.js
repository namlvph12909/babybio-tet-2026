/**
 * Firebase Configuration
 * 
 * HƯỚNG DẪN THIẾT LẬP:
 * 1. Truy cập https://console.firebase.google.com/
 * 2. Tạo một Project mới (ví dụ: "babybio-tet-2026")
 * 3. Vào Project Settings > General > Your apps > Add app (Web)
 * 4. Copy các giá trị cấu hình và dán vào đây
 * 5. Vào Firestore Database > Create database > Start in production mode
 * 6. Cập nhật Security Rules cho Firestore (xem file firestore.rules)
 */

// TODO: Thay thế bằng cấu hình Firebase thực của bạn
const firebaseConfig = {
    apiKey: "AIzaSyAoYsL_8i2S7_0XBfla-1BjmJewDiIyh8M",
    authDomain: "babybio-web.firebaseapp.com",
    projectId: "babybio-web",
    storageBucket: "babybio-web.firebasestorage.app",
    messagingSenderId: "724487945220",
    appId: "1:724487945220:web:5b4b08b48d7b39c115c951"
};

// Kiểm tra xem đã cấu hình chưa
const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey !== "YOUR_API_KEY";
};

// Export for use in other modules
window.FIREBASE_CONFIG = firebaseConfig;
window.IS_FIREBASE_CONFIGURED = isFirebaseConfigured;

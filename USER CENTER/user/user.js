// 检查用户是否已登录
async function checkUserAuth() {
    try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        
        if (!data.isAuthenticated) {
            // 未登录则重定向到登录页面
            sessionStorage.setItem('redirectUrl', window.location.href);
            window.location.href = '/AUTH/public/login.html';
        }
    } catch (error) {
        console.error('认证检查失败:', error);
    }
}

// 页面加载时检查认证状态
document.addEventListener('DOMContentLoaded', checkUserAuth); 
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        console.log('正在发送登录请求...'); // 添加日志
        
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });
        
        console.log('收到服务器响应:', response.status); // 添加日志
        
        const data = await response.json();
        console.log('响应数据:', data); // 添加日志
        
        if (data.success) {
            // 登录成功
            localStorage.setItem('userInfo', JSON.stringify({
                username: username
            }));
            
            // 获取之前保存的返回URL，如果没有则返回首页
            const returnUrl = sessionStorage.getItem('redirectUrl') || '/SEARCH/index.html';
            console.log('准备重定向到:', returnUrl); // 添加日志
            
            sessionStorage.removeItem('redirectUrl'); // 清除保存的URL
            window.location.href = returnUrl;
        } else {
            alert(data.message || '登录失败');
        }
    } catch (error) {
        console.error('登录请求失败:', error);
        alert('登录失败，请稍后重试');
    }
}

// 页面加载完成后添加表单提交事件监听
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}); 
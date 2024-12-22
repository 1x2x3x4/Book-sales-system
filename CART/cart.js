// 显示购物车内容
function displayCart() {
    const cartList = document.getElementById('cartList');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartList.innerHTML = '<p class="empty-cart">购物车是空的，快去选购心仪的图书吧！</p>';
        updateCartSummary();
        return;
    }
    
    const cartHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-cover">
                <img src="${item.coverImage}" alt="${item.title}">
            </div>
            <div class="item-info">
                <h3 class="item-title">${item.title}</h3>
                <p class="item-price">￥${item.price.toFixed(2)}</p>
                <div class="item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeItem(${item.id})">删除</button>
        </div>
    `).join('');
    
    cartList.innerHTML = cartHTML;
    updateCartSummary();
}

// 更新购物车汇总信息
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = `￥${totalPrice.toFixed(2)}`;
    document.getElementById('finalPrice').textContent = `￥${totalPrice.toFixed(2)}`;
}

// 清空购物车
function clearCart() {
    if (confirm('确定要清空购物车吗？')) {
        localStorage.removeItem('cart');
        displayCart();
    }
}

// 结算功能
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('购物车是空的，请先添加商品！');
        return;
    }

    // 计算总金额
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // 显示确认对话框
    if (confirm(`总计金额：￥${totalPrice.toFixed(2)}\n确认结算？`)) {
        // 清空购物车
        localStorage.removeItem('cart');
        
        // 显示结算成功消息
        alert('结算成功！感谢您的购买！');
        
        // 刷新购物车显示
        displayCart();
        
        // 更新购物车图标
        const cartLink = document.getElementById('cartLink');
        if (cartLink) {
            cartLink.textContent = '购物车(0)';
        }
    }
}

// 更新商品数量
function updateQuantity(itemId, change) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart.find(i => i.id === itemId);
        
        if (item) {
            const newQuantity = item.quantity + change;
            
            // 检查数量是否在有效范围内
            if (newQuantity < 1) {
                if (confirm('是否要删除该商品？')) {
                    removeItem(itemId);
                }
                return;
            }
            
            if (newQuantity > item.stock) {
                alert('超出库存数量！');
                return;
            }
            
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        }
    } catch (error) {
        console.error('更新数量失败:', error);
        alert('更新数量失败，请重试');
    }
}

// 移除商品
function removeItem(itemId) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    } catch (error) {
        console.error('删除商品失败:', error);
        alert('删除商品失败，请重试');
    }
}

// 页面加载时显示购物车内容
document.addEventListener('DOMContentLoaded', () => {
    displayCart();
}); 
// 从 URL 获取书籍 ID
function getBookIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('bookId');
}

// 页面加载时获取并显示书籍详情
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const bookId = getBookIdFromUrl();
        console.log('获取到的 bookId:', bookId); // 调试信息
        
        if (!bookId) {
            throw new Error('未找到书籍ID');
        }

        // 确保 bookData 已经加载
        if (typeof bookData === 'undefined') {
            throw new Error('书籍数据未加载');
        }

        // 直接从 bookData 数组中获取书籍信息
        const book = bookData.find(b => b.id === parseInt(bookId));
        console.log('找到的书籍:', book); // 调试信息
        
        if (!book) {
            throw new Error('未找到该书籍');
        }

        displayBookDetails(book);
    } catch (error) {
        console.error('加载书籍详情失败:', error);
        alert('加载书籍信息失败：' + error.message);
    }
});

// 显示书籍详情
function displayBookDetails(book) {
    try {
        // 更新页面标题
        document.title = `${book.title} - 云间书阁`;
        
        // 更新书籍基本信息
        const elements = {
            title: document.querySelector('.book-title'),
            author: document.querySelector('.book-author'),
            publisher: document.querySelector('.book-publisher'),
            isbn: document.querySelector('.book-isbn'),
            price: document.querySelector('.book-price'),
            stock: document.querySelector('.book-stock'),
            category: document.querySelector('.book-category'),
            description: document.querySelector('.book-description'),
            cover: document.querySelector('.book-cover img'),
            buyButton: document.querySelector('.buy-button')
        };

        // 更新各个元素的内容
        if (elements.title) elements.title.textContent = decodeURIComponent(book.title);
        if (elements.author) elements.author.textContent = `作者：${decodeURIComponent(book.author)}`;
        if (elements.publisher) elements.publisher.textContent = `出版社：${decodeURIComponent(book.publisher)}`;
        if (elements.isbn) elements.isbn.textContent = `ISBN：${book.isbn}`;
        
        // 更新价格信息
        if (elements.price) {
            elements.price.innerHTML = `
                <span class="current-price">¥${book.price.original.toFixed(2)}</span>
            `;
        }
        
        // 更新库存信息
        if (elements.stock) {
            elements.stock.textContent = `库存：${book.stock}本`;
        }
        
        // 更新书籍封面图片
        if (elements.cover) {
            elements.cover.src = book.coverImage;
            elements.cover.alt = decodeURIComponent(book.title);
        }
        
        // 更新书籍描述
        if (elements.description) {
            elements.description.textContent = decodeURIComponent(book.description);
        }
        
        // 更新分类信息
        if (elements.category) {
            elements.category.textContent = `分类：${getCategoryName(book.category)}`;
        }

    } catch (error) {
        console.error('显示书籍详情失败:', error);
        alert('显示书籍信息失败，请刷新页面重试');
    }
}

// 获取分类的中文名称
function getCategoryName(category) {
    const categoryMap = {
        'literature': '文学小说',
        'history': '历史传记',
        'philosophy': '哲学思想',
        'art': '艺术设计',
        'science': '科学技术',
        'life': '生活休闲'
    };
    return categoryMap[category] || category;
}

// ��物车功能
function addToCart() {
    try {
        const bookId = getBookIdFromUrl();
        const book = bookData.find(b => b.id === parseInt(bookId));
        
        if (!book) {
            throw new Error('未找到书籍信息');
        }

        // 从 localStorage 获取购物车数据
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // 检查书籍是否已经在购物车中
        const existingItem = cart.find(item => item.id === book.id);
        
        if (existingItem) {
            // 如果已存在，增加数量
            existingItem.quantity += 1;
            if (existingItem.quantity > book.stock) {
                alert('超出库存数量！');
                existingItem.quantity = book.stock;
                return;
            }
        } else {
            // 如果不存在，添加新项目
            cart.push({
                id: book.id,
                title: decodeURIComponent(book.title),
                price: book.price.current || book.price.original,
                coverImage: book.coverImage,
                quantity: 1,
                stock: book.stock
            });
        }
        
        // 保存到 localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // 显示成功提示
        alert('已添加到购物车！');
        
        // 更新购物车图标
        updateCartIcon();
    } catch (error) {
        console.error('添加到购物车失败:', error);
        alert('添加到购物车失败：' + error.message);
    }
}

// 更新购物车图标
function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartLink = document.getElementById('cartLink');
    if (cartLink) {
        cartLink.textContent = `购物车(${totalItems})`;
    }
}

// 页面加载时更新购物车图标
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
});

// 为加入购物车按钮添加点击事件
document.querySelector('.buy-button').addEventListener('click', addToCart); 
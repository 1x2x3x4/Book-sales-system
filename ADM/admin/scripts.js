// 页面切换逻辑
const sidebar = document.querySelector('.sidebar ul');
const mainContent = document.querySelector('.main-content');
const booksContent = document.querySelector('.books-content');
const siteManagementContent = document.querySelector('.site-management-content');
const dashBoard = document.querySelector('.dashboard');
const orderContent = document.querySelector('.order-content'); // 新增
const developingContent = document.querySelector('.developing-content'); // 保证HTML中已存在该DIV

sidebar.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;

    // 切换active状态
    sidebar.querySelectorAll('li').forEach(item => item.classList.remove('active'));
    li.classList.add('active');

    const page = li.getAttribute('data-page');

    // 根据点击的菜单项显示对应的内容区
    if (page === 'dashboard') {
        dashBoard.style.display = 'block';
        siteManagementContent.style.display = 'none';
        booksContent.style.display = 'none';
        orderContent.style.display = 'none';
        if (developingContent) developingContent.style.display = 'none';
    } else if (page === 'site-management') {
        dashBoard.style.display = 'none';
        siteManagementContent.style.display = 'block';
        booksContent.style.display = 'none';
        orderContent.style.display = 'none';
        if (developingContent) developingContent.style.display = 'none';
    } else if (page === 'content-management') {
        dashBoard.style.display = 'none';
        siteManagementContent.style.display = 'none';
        booksContent.style.display = 'block';
        orderContent.style.display = 'none';
        if (developingContent) developingContent.style.display = 'none';
    } else if (page === 'order-content') {
        dashBoard.style.display = 'none';
        siteManagementContent.style.display = 'none';
        booksContent.style.display = 'none';
        orderContent.style.display = 'block';
        if (developingContent) developingContent.style.display = 'none';
    } else if (page === 'developing') {
        dashBoard.style.display = 'none';
        siteManagementContent.style.display = 'none';
        booksContent.style.display = 'none';
        orderContent.style.display = 'none';
        if (developingContent) developingContent.style.display = 'block';
    } else {
        // 未实现的页面全部隐藏
        dashBoard.style.display = 'none';
        siteManagementContent.style.display = 'none';
        booksContent.style.display = 'none';
        orderContent.style.display = 'none';
        if (developingContent) developingContent.style.display = 'none';
    }
});

// 获取全选框和tbody
const selectAllCheckbox = document.querySelector('.ALL');
const booksTableBody = document.getElementById('books-table-body');

// 当全选框状态改变时触发
selectAllCheckbox.addEventListener('change', () => {
    // 获取所有行的复选框
    const checkboxes = booksTableBody.querySelectorAll('.book-checkbox');

    // 根据全选框的状态设置所有行复选框的状态
    checkboxes.forEach(cb => {
        cb.checked = selectAllCheckbox.checked;
    });
});


// 获取元素
const modal = document.getElementById('book-modal');
const openModalButton = document.getElementById('open-modal-button');
const closeModal = document.getElementById('close-modal');
const cancelButton = document.getElementById('cancel-button');

// 打开模态窗口
openModalButton.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// 关闭模态窗口
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    clearForm();
});

cancelButton.addEventListener('click', () => {
    modal.style.display = 'none';
    clearForm();
});

// 点击窗口外部关闭模态窗口
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
        clearForm();
    }
});

// 清空表单
function clearForm() {
    document.getElementById('book-form').reset();
    document.getElementById('book-id').value = '';
    document.getElementById('form-title').innerText = '新增书籍';
    document.getElementById('cancel-button').style.display = 'none';
}

// 处理表单提交
document.getElementById('book-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        category: document.getElementById('category').value,
        coverImage: document.getElementById('coverImage').value,
        description: document.getElementById('description').value,
        price: {
            original: parseFloat(document.getElementById('originalPrice').value) || 0,
            current: parseFloat(document.getElementById('currentPrice').value) || 0,
            discount: parseFloat(document.getElementById('discount').value) || 0
        },
        isbn: document.getElementById('isbn').value,
        publisher: document.getElementById('publisher').value,
        stock: parseInt(document.getElementById('stock').value) || 0
    };

    const bookId = document.getElementById('book-id').value;

    if (bookId) {
        // 编辑现有书籍
        updateBook(bookId, bookData);
    } else {
        // 添加新书籍
        addBook(bookData);
    }
});

async function addBook(book) {
    try {
        const response = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });
        if (!response.ok) {
            throw new Error('网络响应错误');
        }
        await response.json();
        modal.style.display = 'none';
        clearForm();
        loadBooks();
    } catch (error) {
        alert('保存失败: ' + error.message);
    }
}

async function updateBook(id, book) {
    try {
        const response = await fetch(`/api/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });
        if (!response.ok) {
            throw new Error('网络响应错误');
        }
        await response.json();
        modal.style.display = 'none';
        clearForm();
        loadBooks();
    } catch (error) {
        alert('更新失败: ' + error.message);
    }
}

// 获取查询输入框和查询、重置按钮
const searchTitleInput = document.getElementById('search-title');
const searchAuthorInput = document.getElementById('search-author');
const searchCategoryInput = document.getElementById('search-category');
const searchIsbnInput = document.getElementById('search-isbn');
const searchButton = document.getElementById('search-button');
const resetButton = document.getElementById('reset-button');

// 点击查询按钮时，根据输入框的内容来请求数据
searchButton.addEventListener('click', () => {
    const query = {
        title: searchTitleInput.value.trim(),
        author: searchAuthorInput.value.trim(),
        category: searchCategoryInput.value.trim(),
        isbn: searchIsbnInput.value.trim()
    };

    // 发起查询请求
    loadBooks(query);
});

// 点击重置按钮时，清空输入框并重新加载全部数据
resetButton.addEventListener('click', () => {
    searchTitleInput.value = '';
    searchAuthorInput.value = '';
    searchCategoryInput.value = '';
    searchIsbnInput.value = '';
    loadBooks(); // 不传查询参数，加载全部数据
});

// 修改loadBooks函数：增加可选的query参数
async function loadBooks(query = {}) {
    try {
        // 将查询参数附加到请求URL上
        let url = '/api/books';
        const params = new URLSearchParams();

        if (query.title) params.append('title', query.title);
        if (query.author) params.append('author', query.author);
        if (query.category) params.append('category', query.category);
        if (query.isbn) params.append('isbn', query.isbn);

        if ([...params].length > 0) { 
            url += '?' + params.toString();
        }

        console.log(`Fetching books from URL: ${url}`);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('无法加载书籍列表');
        }
        const books = await response.json();
        console.log('Received books:', books);
        const tbody = document.getElementById('books-table-body');
        tbody.innerHTML = '';
        books.forEach(book => {
            const currentPrice = (book.price && typeof book.price.current === 'number') ? book.price.current : 0;
            let discount = (book.price && typeof book.price.discount === 'number') ? book.price.discount : 0;
            discount = discount === 1 ? '无折扣' : (discount * 100) + '%';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" class="book-checkbox"></td>
                <td>${book.id}</td>
                <td><img src="${book.coverImage || '/images/books/default.jpg'}" alt="${book.title}" width="50"></td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>${currentPrice.toFixed(2)}</td>
                <td>${discount}</td>
                <td>${book.stock}</td>
                <td>${book.isbn}</td>
                <td>${book.publisher}</td>
                <td>${book.description}</td>
                <td>
                    <button onclick="editBook(${book.id})">编辑</button>
                    <button onclick="deleteBook(${book.id})">删除</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        alert('加载书籍列表失败: ' + error.message);
        console.error('加载书籍列表失败:', error);
    }
}

window.onload = loadBooks;


async function editBook(id) {
    try {
        const response = await fetch(`/api/books/${id}`);
        if (!response.ok) {
            throw new Error('无法获取书籍信息');
        }
        const book = await response.json();
        document.getElementById('book-id').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('category').value = book.category;
        document.getElementById('coverImage').value = book.coverImage;
        document.getElementById('description').value = book.description;
        if (book.price) {
            document.getElementById('originalPrice').value = book.price.original;
            document.getElementById('currentPrice').value = book.price.current;
            document.getElementById('discount').value = book.price.discount;
        } else {
            document.getElementById('originalPrice').value = '';
            document.getElementById('currentPrice').value = '';
            document.getElementById('discount').value = '';
        }
        document.getElementById('stock').value = book.stock;
        document.getElementById('isbn').value = book.isbn;
        document.getElementById('publisher').value = book.publisher;
        document.getElementById('form-title').innerText = '编辑书籍';
        document.getElementById('cancel-button').style.display = 'inline-block';
        modal.style.display = 'flex';
    } catch (error) {
        alert('无法获取书籍信息: ' + error.message);
    }
}

async function deleteBook(id) {
    if (confirm('确定要删除此书籍吗？')) {
        try {
            const response = await fetch(`/api/books/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('删除失败');
            }
            loadBooks();
        } catch (error) {
            alert('删除失败: ' + error.message);
        }
    }
}

function updateCurrentPrice() {
    const originalPrice = parseFloat(document.getElementById('originalPrice').value);
    const discount = parseFloat(document.getElementById('discount').value);

    if (!isNaN(originalPrice) && !isNaN(discount) && discount >= 0 && discount <= 1) {
        const currentPrice = originalPrice * discount;
        document.getElementById('currentPrice').value = currentPrice.toFixed(2);
    } else {
        document.getElementById('currentPrice').value = '';
    }
}


document.getElementById('logout-button').addEventListener('click', () => {
    console.log('登出按钮被点击！');
    // 发送登出请求到正确的 API 路径
    fetch('/api/logout', {
        method: 'POST',
        credentials: 'include' // 如果你使用 cookie 或 session 进行认证，记得加上这个选项
    }).then(res => {
        if (res.ok) {
            // 登出成功后跳转到登录页
            window.location.href = 'login.html';
        } else {
            alert('登出失败，请重试');
        }
    }).catch(err => {
        console.error('登出请求错误', err);
        alert('登出请求错误');
    });
});

 // 连接到 Socket.IO 服务器
 const socket = io();

 let stockChart;

 // 生成颜色函数
 function generateColors(count) {
     const colors = [];
     const baseColors = [
         '#FF6384', '#36A2EB', '#FFCE56',
         '#4BC0C0', '#9966FF', '#FF9F40',
         '#C9CBCF', '#8B0000', '#00FF7F', '#FFD700'
     ];
     for (let i = 0; i < count; i++) {
         colors.push(baseColors[i % baseColors.length]);
     }
     return colors;
 }

 // 绘制或更新饼图
 function drawChart(labels, data) {
     const ctx = document.getElementById('stockChart').getContext('2d');

     const colors = generateColors(labels.length);

     if (stockChart) {
         // 更新现有图表
         stockChart.data.labels = labels;
         stockChart.data.datasets[0].data = data;
         stockChart.data.datasets[0].backgroundColor = colors;
         stockChart.update();
     } else {
         // 创建新图表
         stockChart = new Chart(ctx, {
             type: 'pie',
             data: {
                 labels: labels,
                 datasets: [{
                     label: '图书库存',
                     data: data,
                     backgroundColor: colors,
                     borderColor: '#ffffff',
                     borderWidth: 1
                 }]
             },
             options: {
                 responsive: true,
                 plugins: {
                     legend: {
                         position: 'top',
                     },
                     title: {
                         display: true,
                         text: '各类别图书库存分布'
                     }
                 }
             },
         });
     }
 }

 // 监听来自服务器的数据更新
 socket.on('updateData', (categoryStock) => {
     console.log('接收到更新的数据:', categoryStock);
     const labels = Object.keys(categoryStock);
     const data = Object.values(categoryStock);
     drawChart(labels, data);
 });
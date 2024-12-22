// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const http = require('http'); // 新增
const socketIo = require('socket.io'); // 新增
const chokidar = require('chokidar'); // 新增
const session = require('express-session');

const app = express();
const PORT = 3000;

// 创建 HTTP 服务器
const server = http.createServer(app);

// 创建 Socket.IO 实例
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// 中间件
app.use(bodyParser.json());
app.use(cors());

app.use(session({
    secret: 'your-secret-key', // 用于加密 session 的密钥
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000 // 设置cookie过期时间为24小时
    }
}));

// 添加静态文件服务配置
// 配置静态文件目录，使各个页面可以访问对应的静态资源
app.use(express.static(path.join(__dirname))); // 添加根目录的静态文件服务
app.use('/SEARCH', express.static(path.join(__dirname, 'SEARCH')));
app.use('/LOGIN', express.static(path.join(__dirname, 'LOGIN')));
app.use('/CART', express.static(path.join(__dirname, 'CART')));
app.use('/AUTH', express.static(path.join(__dirname, 'AUTH'))); // 添加 AUTH 目录
app.use('/USER CENTER', express.static(path.join(__dirname, 'USER CENTER'))); // 添加 USER CENTER 目录
app.use('/images', express.static(path.join(__dirname, 'images')));

// 添加错误处理中间件
app.use((err, req, res, next) => {
    console.error('文件访问错误:', err);
    if (err.code === 'ENOENT') {
        // 如果文件不存在，返回默认图片
        res.sendFile(path.join(__dirname, 'images', 'default-book.jpg'));
    } else {
        next(err);
    }
});

// 修改根路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'SEARCH', 'index.html'));
});

// API 路由
const booksFilePath = path.join(__dirname, 'books.txt');

async function readBooks() {
    try {
        const data = await fs.readFile(booksFilePath, 'utf-8');
        // 尝试解析为 JSON 数组
        try {
            const books = JSON.parse(data);
            if (!Array.isArray(books)) {
                throw new Error('books.txt 内容不是一个 JSON 数组');
            }
            return books;
        } catch (err) {
            // 如果不是 JSON 数组，尝试逐行解析 JSON 对象
            const lines = data.split('\n');
            const books = [];
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine) {
                    try {
                        const book = JSON.parse(trimmedLine);
                        books.push(book);
                    } catch (e) {
                        console.warn(`无法解析行: ${trimmedLine}`);
                    }
                }
            }
            return books;
        }
    } catch (error) {
        console.error('读取 books.txt 失败:', error);
        return [];
    }
}

async function writeBooks(books) {
    try {
        const data = JSON.stringify(books, null, 4);
        await fs.writeFile(booksFilePath, data, 'utf-8');
    } catch (error) {
        console.error('写入 books.txt 失败:', error);
        throw error;
    }
}

app.get('/api/books', async (req, res) => {
    console.log('收到 GET /api/books 请求');
    const books = await readBooks();
    const { q, category, minPrice, maxPrice } = req.query;

    let filteredBooks = books;

    if (q && q.trim() !== '') {
        const regex = new RegExp(q.replace(/\*/g, '.*'), 'i');
        filteredBooks = filteredBooks.filter(b => regex.test(b.title) || regex.test(b.author));
    }

    if (category && category.trim() !== '' && category !== 'all') {
        filteredBooks = filteredBooks.filter(b => b.category === category);
    }

    if (minPrice && !isNaN(minPrice)) {
        filteredBooks = filteredBooks.filter(b => parseFloat(b.price.current) >= parseFloat(minPrice));
    }

    if (maxPrice && !isNaN(maxPrice)) {
        filteredBooks = filteredBooks.filter(b => parseFloat(b.price.current) <= parseFloat(maxPrice));
    }

    res.json(filteredBooks);
});


app.get('/api/books/:id', async (req, res) => {
    console.log(`收到 GET /api/books/${req.params.id} 请求`);
    const books = await readBooks();
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: '书籍未找到' });
    }
});

app.post('/api/books', async (req, res) => {
    console.log('收到 POST /api/books 请求');
    const books = await readBooks();
    const newBook = req.body;
    newBook.id = books.length > 0 ? books[books.length - 1].id + 1 : 1;
    books.push(newBook);
    try {
        await writeBooks(books);
        res.status(201).json(newBook);
    } catch {
        res.status(500).json({ message: '添加书籍失败' });
    }
});

app.post('/api/logout', (req, res) => {
    // 清除session
    req.session.destroy((err) => {
        if (err) {
            console.error('清除session失败:', err);
            res.status(500).json({ success: false, message: '退出失败' });
            return;
        }
        res.json({ success: true, message: '已成功退出' });
    });
});


app.put('/api/books/:id', async (req, res) => {
    console.log(`收到 PUT /api/books/${req.params.id} 请求`);
    const books = await readBooks();
    const index = books.findIndex(b => b.id === parseInt(req.params.id));
    if (index !== -1) {
        books[index] = { ...books[index], ...req.body };
        if (req.body.price) {
            books[index].price = { ...books[index].price, ...req.body.price };
        }
        try {
            await writeBooks(books);
            res.json(books[index]);
        } catch {
            res.status(500).json({ message: '更新书籍失败' });
        }
    } else {
        res.status(404).json({ message: '书籍未找到' });
    }
});

app.delete('/api/books/:id', async (req, res) => {
    console.log(`收到 DELETE /api/books/${req.params.id} 请求`);
    let books = await readBooks();
    const index = books.findIndex(b => b.id === parseInt(req.params.id));
    if (index !== -1) {
        const deletedBook = books.splice(index, 1)[0];
        try {
            await writeBooks(books);
            res.json(deletedBook);
        } catch {
            res.status(500).json({ message: '删除书籍失败' });
        }
    } else {
        res.status(404).json({ message: '书籍未找到' });
    }
});

// 添加用户状态检查API
app.get('/api/check-auth', (req, res) => {
    if (req.session.user) {
        res.json({
            isAuthenticated: true,
            user: {
                username: req.session.user.username,
                // 其他需要的用户信息
            }
        });
    } else {
        res.json({ isAuthenticated: false });
    }
});

// 添加一个模拟的用户数据库
const users = [
    { username: 'test', password: 'test123' }
];

// 修改登录处理路由
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('收到登录请求:', { username, password }); // 添加日志
    
    try {
        // 在模拟数据库中查找用户
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // 登录成功，设置session
            req.session.user = {
                username: username
            };
            
            console.log('登录成功，session已设置:', req.session.user); // 添加日志
            
            res.json({
                success: true,
                message: '登录成功',
                redirectUrl: '/SEARCH/index.html'
            });
        } else {
            console.log('登录失败：用户名或密码错误'); // 添加日志
            res.status(401).json({
                success: false,
                message: '用户名或密码错误'
            });
        }
    } catch (error) {
        console.error('登录错误:', error); // 添加错误日志
        res.status(500).json({
            success: false,
            message: '登录失败，请稍后重试'
        });
    }
});

// 添加路由处理登录页面
app.get('/AUTH/public/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'AUTH', 'public', 'login.html'));
});

// 添加路由处理注册页面
app.get('/AUTH/public/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'AUTH', 'public', 'register.html'));
});

// 处理404错误（应该放在所有路由之后）
app.use((req, res, next) => {
    res.status(404).send('抱歉，页面未找到');
});

// Socket.IO 连接
io.on('connection', (socket) => {
    console.log('有一个客户端连接');

    // 发送初始数据
    sendCategoryStock(socket);

    socket.on('disconnect', () => {
        console.log('客户端断开连接');
    });
});

// 监控 books.txt 文件的变化
const watcher = chokidar.watch(booksFilePath, {
    persistent: true,
    usePolling: true,
    interval: 1000, // 每秒检查一次
});

watcher.on('change', () => {
    console.log('books.txt 文件已修改');
    io.emit('updateData', getCategoryStock());
});

// 聚合每个类别的库存数量
function getCategoryStock() {
    const data = fs.readFile(booksFilePath, 'utf-8')
        .then(content => {
            let books = [];
            try {
                books = JSON.parse(content);
                if (!Array.isArray(books)) throw new Error('不是 JSON 数组');
            } catch (err) {
                // 尝试逐行解析
                const lines = content.split('\n');
                books = [];
                lines.forEach(line => {
                    const trimmed = line.trim();
                    if (trimmed) {
                        try {
                            const book = JSON.parse(trimmed);
                            books.push(book);
                        } catch (e) {
                            console.warn(`无法解析行: ${trimmed}`);
                        }
                    }
                });
            }

            const categoryStock = {};
            books.forEach(book => {
                const category = book.category;
                const stock = book.stock || 0;
                if (category) {
                    if (categoryStock[category]) {
                        categoryStock[category] += stock;
                    } else {
                        categoryStock[category] = stock;
                    }
                }
            });

            return categoryStock;
        })
        .catch(err => {
            console.error('获取类别库存失败:', err);
            return {};
        });

    return data;
}

// 发送别库存数据给指定的 socket
async function sendCategoryStock(socket) {
    const categoryStock = await getCategoryStock();
    socket.emit('updateData', categoryStock);
}

// 启动服务器
server.listen(PORT, () => {
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});

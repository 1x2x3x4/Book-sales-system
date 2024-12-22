// 存储所有图书数据
let allBooks = [];
let currentCategory = 'all';

// 从 ADM/books.txt 读取图书数据
async function loadBooksData() {
    try {
        const response = await fetch('/api/books');
        if (!response.ok) {
            throw new Error('无法加载图书数据');
        }
        const data = await response.json();
        
        // 处理数据格式
        return data.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            coverImage: book.coverImage,
            category: book.category,
            description: book.description,
            price: {
                original: parseFloat(book.price.original),
                current: parseFloat(book.price.current || book.price.original),
                discount: parseFloat(book.price.discount || 1)
            },
            isbn: book.isbn,
            publisher: book.publisher,
            stock: parseInt(book.stock)
        }));
    } catch (error) {
        console.error('加载图书数据失败:', error);
        return [];
    }
}


// 图书数据 (从 ADM/books.txt 同步)
// const bookData = [
//     {
//         "id": 1,
//         "title": "活着",
//         "author": "余华",
//         "coverImage": "/images/books/活着.jpg",
//         "category": "literature",
//         "description": "这是一个历尽世间沧桑和磨难老人的人生感言，是一幕演绎人生苦难经历的戏剧。小说的叙述者\"我\"在年轻时获得了一个游手好闲的职业——去乡间收集民间歌谣。在夏天刚刚来到的季节，遇到那位名叫福贵的老人，听他讲述了自己坎坷的人生经历。",
//         "price": {
//             "original": 45,
//             "current": 31,
//             "discount": 0.8
//         },
//         "isbn": "9787530215593",
//         "publisher": "北京十月文艺出版社",
//         "stock": 25
//     },
//     {
//         "id": 2,
//         "title": "局外人",
//         "author": "[法] 阿尔贝·加缪",
//         "coverImage": "/images/books/局外人.jpg",
//         "category": "literature",
//         "description": "《加缪作品：局外人》是加缪的成名作、代表作，也是存在主义文学最重要的代表作品之一。它形象地体现了存在主义哲学关于荒谬的观点；由于人和世界的分离，世界对于人来说是荒诞的、毫无意义的，而人对荒谬的世界无能为力，因此不抱任何希望，对一切事物都无动于衷。",
//         "price": {
//             "original": 9.9,
//             "current": 9.9,
//             "discount": 1
//         },
//         "isbn": "9787532761760",
//         "publisher": "上海译文出版社",
//         "stock": 40
//     },
//     {
//         "id": 3,
//         "title": "猛将还乡：洞庭东山的新江南史",
//         "author": "赵世瑜",
//         "coverImage": "/images/books/猛将还乡-洞庭东山的新江南史.jpg",
//         "category": "history",
//         "description": "江南史研究已取得累累硕果，在农业开发、市镇兴起以及社会与文化的发展等诸多领域有了丰富的认识。本书以太湖东山的刘猛将信仰为切入点，试图对东太湖地区水上人上岸的过程及其对江南社会经济的影响加以梳理。",
//         "price": {
//             "original": 118,
//             "current": 118,
//             "discount": 1
//         },
//         "isbn": "9787520189057",
//         "publisher": "社会科学文献出版社",
//         "stock": 30
//     },
//     {
//         "id": 4,
//         "title": "明朝那些事儿",
//         "author": "当年明月",
//         "coverImage": "/images/books/明朝那些事儿.jpg",
//         "category": "history",
//         "description": "《明朝那些事儿》讲述从1344年到1644年这三百年间关于明朝的一些事情，以史料为基础，以年代和具体人物为主线，并加入了小说的笔法，对明朝十七帝和其他王公权贵和小人物命运进行全景展示。",
//         "price": {
//             "original": 29.8,
//             "current": 29.8,
//             "discount": 1
//         },
//         "isbn": "9787213046339",
//         "publisher": "浙江人民出版社",
//         "stock": 50
//     },
//     {
//         "id": 5,
//         "title": "纳瓦尔宝典",
//         "author": "[美] 埃里克·乔根森",
//         "coverImage": "/images/books/纳瓦尔宝典.jpg",
//         "category": "management",
//         "description": "致富不仅仅靠运气，幸福也不是从天而降的。积累财富和幸福生活都是我们可以且需要学习的技能。本书收集整理了硅谷知名天使投资人纳瓦尔的智慧箴言录，尤其是关于财富积累和幸福人生的原则与方法。",
//         "price": {
//             "original": 47,
//             "current": 31,
//             "discount": 0.66
//         },
//         "isbn": "9787521741124",
//         "publisher": "中信出版社",
//         "stock": 20
//     },
//     {
//         "id": 6,
//         "title": "年月日",
//         "author": "阎连山",
//         "coverImage": "/images/books/年月日.jpg",
//         "category": "literature",
//         "description": "《年月日》描写一个老汉，在大旱之年所有人都举家逃离的时候，他独自留下来照看一棵勉强存活的玉米秧苗，陪着他的只有一条瞎眼老狗。",
//         "price": {
//             "original": 48,
//             "current": 32.2,
//             "discount": 0.67
//         },
//         "isbn": "9787559459244",
//         "publisher": "江苏凤凰文艺出版社",
//         "stock": 15
//     },
//     {
//         "id": 7,
//         "title": "未来科技",
//         "author": "[美] 查尔斯·皮德克",
//         "coverImage": "/images/books/未来科技.jpg",
//         "category": "science",
//         "description": "《未来科技》介绍了仿生学领域许多令人兴奋的发展，以及纳米技术、生物工程学，当然还有机器人技术的相关知识。",
//         "price": {
//             "original": 21,
//             "current": 21,
//             "discount": 1
//         },
//         "isbn": "9787501603657",
//         "publisher": "人民大学出版社",
//         "stock": 35
//     },
//     {
//         "id": 8,
//         "title": "这就是ChatGPT",
//         "author": "[美] 斯蒂芬·沃尔弗拉姆",
//         "coverImage": "/images/books/这就是ChatGPT.jpg",
//         "category": "technology",
//         "description": "ChatGPT是OpenAI开发的人工智能聊天机器人程序，于2022年11月推出。本书会大致介绍ChatGPT的内部机理，然后探讨一为什么它能很好地生成我们认为是有意义的文本。",
//         "price": {
//             "original": 29,
//             "current": 29,
//             "discount": 1
//         },
//         "isbn": "9787115618085",
//         "publisher": "人民邮电出版社",
//         "stock": 45
//     },
//     {
//         "id": 9,
//         "title": "JavaScript百炼成仙",
//         "author": "杨逸飞",
//         "coverImage": "/images/books/JavaScript百炼成仙.jpg",
//         "category": "technology",
//         "description": "这是一本讲解JavaScript编程语言的技术书籍。通过本书，你可以领悟到JavaScript的函数七重关秘籍；学会使用jQuery操作DOM对象；学会目前流行的Vue基础语法；学会最新的ES6常用语法。",
//         "price": {
//             "original": 46.2,
//             "current": 43.56,
//             "discount": 0.94
//         },
//         "isbn": "9787302566625",
//         "publisher": "清华大学出版社",
//         "stock": 60
//     },
//     {
//         "id": 10,
//         "title": "福尔摩斯探案集",
//         "author": "[英] 柯南·道尔",
//         "coverImage": "/images/books/福尔摩斯探案集.jpg",
//         "category": "novel",
//         "description": "《福尔摩斯探案集》塑造了福尔摩斯这一栩栩如生，深得人心的形象。作品情节离奇曲折，惊人动人；结构巧妙安排，丝丝入扣而悬念丛生；前后呼应而跌宕起伏，使人读起来欲罢不能。",
//         "price": {
//             "original": 45,
//             "current": 31,
//             "discount": 0.69
//         },
//         "isbn": "9787550248076",
//         "publisher": "北京联合出版公司",
//         "stock": 30
//     },
//     {
//         "id": 11,
//         "title": "薄雾",
//         "author": "微风几许、魅丽文化",
//         "coverImage": "/images/books/薄雾.jpg",
//         "category": "novel",
//         "description": "超忆症，患上它的人能清楚地记得人生中的每一个细节，大到世界转折，小到脑海中产生过的每一个想法。他们过目不忘、求知若渴，使得他们极易成为某种意上的天才。",
//         "price": {
//             "original": 46.8,
//             "current": 46.8,
//             "discount": 1
//         },
//         "isbn": "9787559454164",
//         "publisher": "江苏凤凰文艺出版社",
//         "stock": 20
//     },
//     {
//         "id": 12,
//         "title": "全球高考",
//         "author": "木苏里",
//         "coverImage": "/images/books/全球高考.jpg",
//         "category": "novel",
//         "description": "游惑等人因为意外而误入考试系统中，不得已为了生存而心怀勇气地战斗，最后与主考官秦究一同找回记忆的冒险故事。",
//         "price": {
//             "original": 65,
//             "current": 65,
//             "discount": 1
//         },
//         "isbn": "9787540258405",
//         "publisher": "北京燕山出版社",
//         "stock": 10
//     },
//     {
//         "id": 13,
//         "title": "撒野",
//         "author": "巫哲",
//         "coverImage": "/images/books/撒野.jpg",
//         "category": "novel",
//         "description": "讲述了温以凡和江延之间的故事。温以凡是一个家庭幸福、长相漂亮、性格活泼的学霸，而江延则是校霸兼学霸，虽然平时上课以睡觉为主，但成稳居年级第一。两人因文理分科后成为同桌，从互相打闹、拌嘴的欢喜冤家，发展到多年后成为恋人。",
//         "price": {
//             "original": 69.8,
//             "current": 69.8,
//             "discount": 1
//         },
//         "isbn": "9787573609939",
//         "publisher": "青岛出版社",
//         "stock": 20
//     },
//     {
//         "id": 14,
//         "title": "一级律师",
//         "author": "木苏里",
//         "coverImage": "/images/books/一级律师.jpg",
//         "category": "novel",
//         "description": "法学院毕业典礼上，院长燕绥之提出假设教学，顾晏以\"不收讼棍，建议开除\"回应。多年后，燕绥之为调查案件伪装成实习生进入顾晏所在律所，反成其学生，遭遇顾晏的\"添堵\"。",
//         "price": {
//             "original": 37.8,
//             "current": 37.8,
//             "discount": 1
//         },
//         "isbn": "9787559448699",
//         "publisher": "江苏凤凰文艺出版社",
//         "stock": 25
//     },
//     {
//         "id": 15,
//         "title": "来我怀里躲躲",
//         "author": "岁见",
//         "coverImage": "/images/books/来我怀里躲躲.jpg",
//         "category": "novel",
//         "description": "林窕和江延之间的故事。林窕是一个家庭幸福、长相漂亮、性格活泼的学霸，而江延则是校霸兼霸，虽然平时上课以睡觉为主但绩稳居年级第一。两人因文理分科后成为同桌，从互相打闹、拌嘴的欢喜冤家，发展到多年后成为恋人。",
//         "price": {
//             "original": 69.8,
//             "current": 69.8,
//             "discount": 1
//         },
//         "isbn": "9787514520231",
//         "publisher": "中国致公出版社",
//         "stock": 40
//     },
//     {
//         "id": 16,
//         "title": "难哄",
//         "author": "竹已",
//         "coverImage": "/images/books/难哄.jpg",
//         "category": "novel",
//         "description": "讲述了温以凡和桑延之间的故事。温以凡和桑延曾是高中同学，机缘巧合之下合租在一起。两人之间发生了许多有趣而又温馨的故事，展现了他们之间的情感变化和成长。",
//         "price": {
//             "original": 48,
//             "current": 48,
//             "discount": 1
//         },
//         "isbn": "9787559452788",
//         "publisher": "江苏凤凰文艺出版社",
//         "stock": 30
//     },
//     {
//         "id": 17,
//         "title": "陷入我们的热恋",
//         "author": "耳东兔子",
//         "coverImage": "/images/books/陷入我们的热恋.jpg",
//         "category": "novel",
//         "description": "讲述了高考后，黑马徐栀意外失踪，邂逅\"混球\"陈周。两人误会连连，徐栀感亲切似亲人，陈周误以为追求者，实则各有归属，上演了一场乌龙情缘。",
//         "price": {
//             "original": 27,
//             "current": 27,
//             "discount": 1
//         },
//         "isbn": "9787573609939",
//         "publisher": "青岛出版社",
//         "stock": 20
//     },
//     {
//         "id": 18,
//         "title": "全职高手",
//         "author": "蝴蝶兰",
//         "coverImage": "/images/books/全职高手.jpg",
//         "category": "novel",
//         "description": "讲述了被迫退役的第一高手叶修从无到有组建职业战队，最终在职业联赛中夺冠的故事。",
//         "price": {
//             "original": 25,
//             "current": 25,
//             "discount": 1
//         },
//         "isbn": "9787535362872",
//         "publisher": "湖北少年儿童出版社",
//         "stock": 50
//     },
//     {
//         "id": 19,
//         "title": "莲花楼",
//         "author": "藤萍",
//         "coverImage": "/images/books/莲花楼.jpg",
//         "category": "novel",
//         "description": "讲述了闻名武林的四顾门门主李相夷在一次大战后身受重伤，从此退隐江湖成为淡泊名利的郎中李莲花，在遇到新交方多病与旧敌笛飞声后重卷入江湖的故事。",
//         "price": {
//             "original": 59.8,
//             "current": 59.8,
//             "discount": 1
//         },
//         "isbn": "9787547005545",
//         "publisher": "浙江文艺出版社",
//         "stock": 15
//     },
//     {
//         "id": 20,
//         "title": "庆余年",
//         "author": "猫腻",
//         "coverImage": "/images/books/庆余年.jpg",
//         "category": "novel",
//         "description": "讲述了叫范闲的年轻人的成长路程，庆国几十年起伏的画卷慢慢地呈现出来。几十年的历程中，我们看到的是三代风云人物的起起落落、轮转更替。两条线索，范闲的成长、叶轻眉的一生贯穿着整个小说，一明一暗，把几十年的庆国风雨尽揽其中的故事。",
//         "price": {
//             "original": 25,
//             "current": 25,
//             "discount": 1
//         },
//         "isbn": "9787505724365",
//         "publisher": "中国友谊出版公司",
//         "stock": 20
//     },
//     {
//         "id": 21,
//         "title": "地球物理调查技术规程",
//         "author": "国家海洋局908专项办公室",
//         "coverImage": "/images/books/地球物理调查技术规程.jpg",
//         "category": "science",
//         "description": "本技术程对近海重力、地磁、单道地震和浅地层剖面的调查范围、调查方法、技术指标、资料绘制的有关要求作出相应的规定。",
//         "price": {
//             "original": 15,
//             "current": 15,
//             "discount": 1
//         },
//         "isbn": "7502764860",
//         "publisher": "海洋出版社",
//         "stock": 40
//     },
//     {
//         "id": 22,
//         "title": "太阳系简史",
//         "author": "汪诘",
//         "coverImage": "/images/books/太阳系简史.jpg",
//         "category": "science",
//         "description": "该书包括16个章节，涵盖近30年人类探索太阳系的重要事件，从火星到冥王星，从小行星到星际天体，全景展示人类探索太阳系的伟大征程。",
//         "price": {
//             "original": 62,
//             "current": 62,
//             "discount": 1
//         },
//         "isbn": "9787572209369",
//         "publisher": "浙江教育出版社",
//         "stock": 25
//     },
//     {
//         "id": 23,
//         "title": "天气的秘密",
//         "author": "[英] 特里斯坦·古利",
//         "coverImage": "/images/books/天气的秘密.jpg",
//         "category": "science",
//         "description": "本书是《水的密码》作者特里斯坦·古利的新作。者延续了他以小见大的写作手法，细腻敏锐地捕捉到风、雨、霜、雪、雾等日常生活中的常见天气现象，结合气象、水文、物理、生物等众多科学原理，用轻松幽默的语言剖析天气背后的奥秘。",
//         "price": {
//             "original": 89,
//             "current": 89,
//             "discount": 1
//         },
//         "isbn": "9787544797658",
//         "publisher": "译林出版社",
//         "stock": 30
//     },
//     {
//         "id": 24,
//         "title": "宇宙简史：起源与归宿",
//         "author": "斯蒂芬·霍金",
//         "coverImage": "/images/books/宇宙简史-起源与归宿.jpg",
//         "category": "science",
//         "description": "本书是斯蒂芬·霍金在英国剑桥大学所作的七场讲学，包含了他毕生钻研宇宙学的精华，精辟扼要。霍金就宇宙以及我们在宇宙中的地位问题，向读者展现了一次引人入胜的探索式旅行。",
//         "price": {
//             "original": 28,
//             "current": 28,
//             "discount": 1
//         },
//         "isbn": "9787544727860",
//         "publisher": "译林出版社",
//         "stock": 35
//     },
//     {
//         "id": 25,
//         "title": "地球物理引论",
//         "author": "刘光鼎",
//         "coverImage": "/images/books/地球物理引论.jpg",
//         "category": "science",
//         "description": "本书阐述了20世纪以来地球科学的发展, 即对地的认识经历了大陆漂移、海底扩张到岩石层板块化及其对矿产资源的制约作用。",
//         "price": {
//             "original": 19,
//             "current": 19,
//             "discount": 1
//         },
//         "isbn": "753238005X",
//         "publisher": "上海科学技术出版社",
//         "stock": 25
//     },
//     {
//         "id": 26,
//         "title": "地图寻绎",
//         "author": "张燕燕, 展文元",
//         "coverImage": "/images/books/地图寻绎.jpg",
//         "category": "science",
//         "description": "通过地图可以了解到所表达地域的陆地海洋、地貌地形、河流湖泊、地质矿产、道路交通、居民地、境界区划、社会文化、历史...多层面、多角度、多视点地认识地图。",
//         "price": {
//             "original": 15,
//             "current": 15,
//             "discount": 1
//         },
//         "isbn": "750654136X",
//         "publisher": "中国人民解放军出版社",
//         "stock": 40
//     },
//     {
//         "id": 27,
//         "title": "火星：人类的第二故乡",
//         "author": "吴沅",
//         "coverImage": "/images/books/火星-人类的第二故乡.jpg",
//         "category": "science",
//         "description": "本书中你将了解极地生物如何生存；帝企鹅的迁徙以及关于极地的十大趣事。本书内容包括：极地永远不化的冰；白雪之王；在冰上漫步；在雪上摇摆前行；世界上最大的海豹；白色的獠牙等。",
//         "price": {
//             "original": 25,
//             "current": 25,
//             "discount": 1
//         },
//         "isbn": "9787543975286",
//         "publisher": "上海科学技术文献出版社",
//         "stock": 20
//     },
//     {
//         "id": 28,
//         "title": "极地旅行",
//         "author": "意大利白星出版社",
//         "coverImage": "/images/books/极地旅行.jpg",
//         "category": "science",
//         "description": "本书中你将了解极地生物如何生存；帝企鹅的迁徙以及关于极地的十大趣事。本书内容包括：极地永远不化的冰；白雪之王；在冰上漫步；在雪上摇摆前行；世界上最大的海豹；白色的獠牙等。",
//         "price": {
//             "original": 180,
//             "current": 180,
//             "discount": 1
//         },
//         "isbn": "9787569936254",
//         "publisher": "北京时代华文书局",
//         "stock": 30
//     },
//     {
//         "id": 29,
//         "title": "世界自然奇景",
//         "author": "纪江红",
//         "coverImage": "/images/books/世界自然奇景.jpg",
//         "category": "science",
//         "description": "本书分上、中、下三卷，按照世界七大洲分为七章，展现了火山、湖泊、洞穴、岩石、森林、沙漠、瀑布、高山等一百多个壮丽奇景。",
//         "price": {
//             "original": 88,
//             "current": 88,
//             "discount": 1
//         },
//         "isbn": "9787508044583",
//         "publisher": "华夏出版社",
//         "stock": 25
//     },
//     {
//         "id": 30,
//         "title": "天文奇象",
//         "author": "刘川浩",
//         "coverImage": "/images/books/天文奇象.jpg",
//         "category": "science",
//         "description": "本书包括宇宙起源的秘密、话说宇宙的未来、宇宙的形状、宇宙中的难解之谜等，讲述了天体之中的奥秘。",
//         "price": {
//             "original": 15.8,
//             "current": 15.8,
//             "discount": 1
//         },
//         "isbn": "7531919184",
//         "publisher": "黑龙江少年儿童出版社",
//         "stock": 30
//     }
// ];

// 检查登录状态
function checkLoginStatus() {
    try {
        // 从 localStorage 获取用户信息
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const userInfoDiv = document.getElementById('userInfo');
        const loginLink = document.getElementById('loginLink');
        const registerLink = document.getElementById('registerLink');
        const logoutLink = document.getElementById('logoutLink');
        const cartLink = document.getElementById('cartLink');

        if (userInfo && userInfo.username) {
            // 用户已登录
            if (userInfoDiv) userInfoDiv.innerHTML = `<span>欢迎，${userInfo.username}</span>`;
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (logoutLink) logoutLink.style.display = 'block';
            if (cartLink) cartLink.style.display = 'block';
            return true;
        } else {
            // 用户未登录
            if (userInfoDiv) userInfoDiv.innerHTML = '';
            if (loginLink) loginLink.style.display = 'block';
            if (registerLink) registerLink.style.display = 'block';
            if (logoutLink) logoutLink.style.display = 'none';
            if (cartLink) cartLink.style.display = 'none';
            return false;
        }
    } catch (error) {
        console.error('检查登录状态时出错:', error);
        return false;
    }
}



// 退出登录功能
function logout() {
    try {
        localStorage.removeItem('userInfo');
        checkLoginStatus();
        window.location.href = '/AUTH/login.html';
    } catch (error) {
        console.error('退出登录时出错:', error);
    }
}

// 修改 fetchBooks 函数
async function fetchBooks() {
    try {
        // 从 books.txt 读取数据
        const booksData = await loadBooksData();
        if (booksData && booksData.length > 0) {
            allBooks = booksData;
            console.log('成功加载图书数据:', allBooks); // 添加调试日志
        } else {
            // 如果读取失败，使用默认数据
            allBooks = bookData.map(book => ({
                ...book,
                category: getCategoryByTitle(book.title)
            }));
            console.log('使用默认数据:', allBooks); // 添加调试日志
        }
        
        displayBooks(allBooks);
    } catch (error) {
        console.error('获取图书数据失败:', error);
        displayError('获取图书数据失败，请稍后重试');
    }
}

// 根据书名判断分类的辅助函数
function getCategoryByTitle(title) {
    const categories = {
        literature: ['小说', '文学', '诗', '散文', '活', '局人'],
        history: ['历史', '传记', '回忆录', '明朝', '猛将'],
        philosophy: ['哲学', '思想', '宗教', '年月日'],
        art: ['艺术', '设计', '摄影', '音乐'],
        science: ['科学', '技术', '计算机', 'ChatGPT', 'JavaScript', '未来科技'],
        life: ['生活', '休闲', '旅游', '美食', '宝典']
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => title.includes(keyword))) {
            return category;
        }
    }
    return 'literature';
}

// 修改 displayBooks 函数
function displayBooks(books) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    if (books.length === 0) {
        bookList.innerHTML = '<p class="no-results">未找到相关图书</p>';
        return;
    }

    const isLoggedIn = checkLoginStatus();

    // 创建行容器
    let currentRow;
    books.forEach((book, index) => {
        // 每5本书创建一个新行
        if (index % 5 === 0) {
            currentRow = document.createElement('div');
            currentRow.className = 'book-row';
            bookList.appendChild(currentRow);
        }

        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        // 修改这里：将整个卡片变成可点击的，并添加 cursor: pointer 样式
        bookCard.style.cursor = 'pointer';
        bookCard.onclick = () => {
            window.location.href = `/CART/detail.html?bookId=${book.id}&title=${encodeURIComponent(book.title)}`;
        };

        bookCard.innerHTML = `
            <div class="book-cover">
                <img src="${book.coverImage}"
                     alt="${book.title}" 
                     onerror="this.onerror=null; this.src='/images/default-book.jpg'">
                ${book.price.discount < 1 ? `
                    <div class="discount-badge">${(book.price.discount * 10).toFixed(1)}折</div>
                ` : ''}
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">作者：${book.author}</p>
                <p class="book-price">
                    ￥${book.price.current.toFixed(2)}
                    ${book.price.discount < 1 ? `
                        <span class="original-price">￥${book.price.original.toFixed(2)}</span>
                    ` : ''}
                </p>
                <p class="book-stock">库存：${book.stock}本</p>
                ${isLoggedIn ? 
                    `<button class="buy-btn" onclick="event.stopPropagation(); addToCart(${book.id})">加入购物车</button>` :
                    `<button class="buy-btn" onclick="event.stopPropagation(); window.location.href='../LOGIN/login.html'">登录后购买</button>`
                }
            </div>
        `;
        currentRow.appendChild(bookCard);
    });
}

// 搜索功能
function searchBooks(query) {
    query = query.toLowerCase().trim();
    const filteredBooks = allBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(query) ||
                            book.author.toLowerCase().includes(query);
        const matchesCategory = currentCategory === 'all' || book.category === currentCategory;
        const matchesPrice = book.price.current >= priceRange.min && 
                           book.price.current <= (priceRange.max || Infinity);
        return matchesSearch && matchesCategory && matchesPrice;
    });
    displayBooks(filteredBooks);
}

// 分类过滤功能
function filterByCategory(category) {
    currentCategory = category;
    const filteredBooks = category === 'all' 
        ? allBooks 
        : allBooks.filter(book => book.category === category);
    displayBooks(filteredBooks);

    // 更新分类按钮状态
    document.querySelectorAll('.category-list a').forEach(link => {
        link.classList.toggle('active', link.dataset.category === category);
    });
}

// 显示错误信息
function displayError(message) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = `<p class="error-message">${message}</p>`;
}

// 添加购物车功能
async function addToCart(bookId) {
    if (!checkLoginStatus()) {
        // 保存当前页面URL
        sessionStorage.setItem('redirectUrl', window.location.href);
        window.location.href = '/AUTH/login.html';
        return;
    }

    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookId })
        });

        if (response.ok) {
            alert('成功添加到购物车！');
        } else {
            const error = await response.json();
            throw new Error(error.message || '添加失败');
        }
    } catch (error) {
        console.error('添加到购物车失败:', error);
        alert('添加到购物车失败，请稍后重试');
    }
}

// 更新购买按钮状态
function updateBuyButtons() {
    const isLoggedIn = checkLoginStatus();
    document.querySelectorAll('.buy-btn').forEach(btn => {
        if (isLoggedIn) {
            btn.textContent = '加入购物车';
            const bookId = btn.getAttribute('data-book-id');
            btn.onclick = () => addToCart(bookId);
        } else {
            btn.textContent = '登录后购买';
            btn.onclick = () => {
                sessionStorage.setItem('redirectUrl', window.location.href);
                window.location.href = '/AUTH/public/login.html';
            };
        }
    });
}

// 添加收藏功能
async function toggleFavorite(bookId) {
    try {
        const response = await fetch('/api/favorites/toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookId })
        });

        if (response.ok) {
            const btn = event.target;
            btn.classList.toggle('favorited');
            btn.textContent = btn.classList.contains('favorited') ? '已收藏' : '收藏';
        } else {
            throw new Error('操作失败');
        }
    } catch (error) {
        alert('操作失败，请稍后重试');
    }
}

// 事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 初始化加载图书
    fetchBooks();

    // 搜索按钮点击事件
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    
    searchButton.addEventListener('click', () => {
        searchBooks(searchInput.value);
    });

    // 搜索输入框回车事件
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBooks(searchInput.value);
        }
    });

    // 分类点击事件
    document.querySelectorAll('.category-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            filterByCategory(category);
        });
    });

    // 修改登录链接点击事件处理
    document.getElementById('loginLink').addEventListener('click', (e) => {
        e.preventDefault();
        // 保存当前页面URL到sessionStorage
        sessionStorage.setItem('redirectUrl', window.location.href);
        // 使用绝对路径
        window.location.href = '/AUTH/public/login.html';
    });

    // 修改注册链接点击事件处理
    document.getElementById('registerLink').addEventListener('click', (e) => {
        e.preventDefault();
        // 保存当前页面URL到sessionStorage
        sessionStorage.setItem('redirectUrl', window.location.href);
        // 使用绝对路径
        window.location.href = '/AUTH/public/register.html';
    });

    // 修改购买按钮的逻辑
    function updateBuyButtons() {
        document.querySelectorAll('.buy-btn').forEach(btn => {
            if (btn.textContent === '登录后购买') {
                btn.onclick = function(e) {
                    e.preventDefault();
                    // 保存当前页面URL到sessionStorage
                    sessionStorage.setItem('redirectUrl', window.location.href);
                    // 跳转到AUTH模块的登录页面
                    window.location.href = '/AUTH/public/login.html';
                };
            }
        });
    }

    // 在显示书籍后更新按钮
    const originalDisplayBooks = displayBooks;
    displayBooks = function(books) {
        originalDisplayBooks(books);
        updateBuyButtons();
    };

    // 检查登录状态
    checkLoginStatus();

    // 添加价格筛选的回车键支持
    document.getElementById('minPrice').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyPriceFilter();
    });
    document.getElementById('maxPrice').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyPriceFilter();
    });

    // 添加退出按钮点击事件
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// 更新CSS样式
const style = document.createElement('style');
style.textContent = `
    #bookList {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .book-row {
        display: flex;
        justify-content: flex-start;
        gap: 20px;
        width: 100%;
    }

    .book-card {
        flex: 1;
        max-width: calc(20% - 16px);
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
        transition: transform 0.2s;
        display: flex;
        flex-direction: column;
    }

    .book-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .book-cover {
        position: relative;
        width: 100%;
        padding-top: 140%;
    }

    .book-cover img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .book-info {
        padding: 12px;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .book-title {
        font-size: 14px;
        font-weight: bold;
        margin: 0 0 8px 0;
        color: #333;
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .book-author {
        font-size: 12px;
        color: #666;
        margin: 0 0 8px 0;
    }

    .book-price {
        color: #e53935;
        font-size: 16px;
        font-weight: bold;
        margin: 0 0 8px 0;
    }

    .original-price {
        text-decoration: line-through;
        color: #999;
        font-size: 12px;
        margin-left: 5px;
    }

    .book-stock {
        font-size: 12px;
        color: #666;
        margin: 0 0 12px 0;
    }

    .discount-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #e53935;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }

    .buy-btn {
        width: 100%;
        padding: 8px;
        background: #1a237e;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        margin-top: auto;
        transition: background 0.2s;
    }

    .buy-btn:hover {
        background: #283593;
    }

    @media (max-width: 1200px) {
        .book-card {
            max-width: calc(25% - 15px);
        }
    }

    @media (max-width: 900px) {
        .book-card {
            max-width: calc(33.33% - 14px);
        }
    }

    @media (max-width: 600px) {
        .book-card {
            max-width: calc(50% - 10px);
        }
    }

    .book-card {
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .book-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .book-title {
        color: #1a237e;
        text-decoration: none;
    }

    .book-card:hover .book-title {
        color: #3f51b5;
    }

    .buy-btn {
        position: relative;
        z-index: 1;
    }
`;
document.head.appendChild(style);

// 添加价格筛选功能
let priceRange = { min: 0, max: Infinity };

function setPriceRange(min, max) {
    priceRange.min = min || 0;
    priceRange.max = max || Infinity;
    filterBooks();
}

function filterBooks() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const filteredBooks = allBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(query) ||
                            book.author.toLowerCase().includes(query);
        const matchesCategory = currentCategory === 'all' || book.category === currentCategory;
        const matchesPrice = book.price.current >= priceRange.min && book.price.current <= priceRange.max;
        return matchesSearch && matchesCategory && matchesPrice;
    });
    displayBooks(filteredBooks);
}

// 添加价格筛选函数
function applyPriceFilter() {
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    setPriceRange(minPrice, maxPrice);
}

// 添加布局样式
const layoutStyle = document.createElement('style');
layoutStyle.textContent = `
    .container {
        display: flex;
        gap: 20px;
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px;
        position: relative;
    }

    .book-list {
        flex: 1;
        min-width: 0;
        margin-right: 260px;
    }

    .sidebar {
        width: 240px;
        position: fixed;
        right: calc((100% - 1400px) / 2 + 20px);
        top: 20px;
        max-height: calc(100vh - 40px);
        overflow-y: auto;
    }

    @media (max-width: 1400px) {
        .sidebar {
            right: 20px;
        }
    }

    @media (max-width: 900px) {
        .container {
            padding: 10px;
        }
        
        .book-list {
            margin-right: 0;
        }
        
        .sidebar {
            position: static;
            width: 100%;
            max-height: none;
            margin-bottom: 20px;
        }
    }

    .filter-section,
    .category-section {
        background: white;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .filter-section h2,
    .category-section h2 {
        font-size: 16px;
        color: #333;
        margin: 0 0 15px 0;
        padding-bottom: 10px;
        border-bottom: 2px solid #f0f0f0;
    }

    .price-filter {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .price-inputs {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .price-inputs input {
        width: 80px;
        padding: 6px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .filter-btn {
        width: 100%;
        padding: 8px;
        background: #1a237e;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.2s;
    }

    .filter-btn:hover {
        background: #283593;
    }

    .category-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .category-list li {
        margin-bottom: 8px;
    }

    .category-list a {
        display: block;
        padding: 8px 12px;
        color: #666;
        text-decoration: none;
        border-radius: 4px;
        transition: all 0.2s;
    }

    .category-list a:hover,
    .category-list a.active {
        background: #f0f0f0;
        color: #1a237e;
    }
`;
document.head.appendChild(layoutStyle);

// 添加滚动监听，优化固定定位效果
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const header = document.querySelector('.site-header');
    
    function updateSidebarPosition() {
        const sidebar = document.querySelector('.sidebar');
        const header = document.querySelector('.site-header');
    
        if (!sidebar || !header) return; // 如果缺少必要的元素，直接返回
    
        const headerHeight = header.offsetHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
        if (window.innerWidth > 900) { // 只在大屏幕上应用
            if (scrollTop > headerHeight) {
                sidebar.style.top = '20px';
            } else {
                sidebar.style.top = `${headerHeight - scrollTop + 20}px`;
            }
        } else {
            sidebar.style.top = ''; // 在小屏幕上清除定位
        }
    }

    window.addEventListener('scroll', updateSidebarPosition);
    window.addEventListener('resize', updateSidebarPosition);
    updateSidebarPosition(); // 初始化位置
});

// 渲染搜索结果
function renderSearchResults(books) {
    const resultsGrid = document.getElementById('resultsGrid');
    resultsGrid.innerHTML = ''; // 清空现有结果
    
    // 更新结果数量显示
    document.getElementById('resultsCount').textContent = `找到 ${books.length} 本相关图书`;
    
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        // 添加点击事件，跳转到详情页
        bookCard.onclick = () => {
            window.location.href = `../CART/detail.html?id=${book.id}`;
        };
        
        bookCard.innerHTML = `
            <div class="book-cover">
                <img src="${book.coverUrl}" alt="${book.title}封面" onerror="this.onerror=null; this.src='/images/default-book.jpg'">
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-price">
                    <span class="current-price">¥${book.price.current.toFixed(2)}</span>
                    ${book.price.discount < 1 ? `
                        <span class="original-price">¥${book.price.original.toFixed(2)}</span>
                        <span class="discount-tag">${Math.round(book.price.discount * 10)}折</span>
                    ` : ''}
                </p>
            </div>
        `;
        
        resultsGrid.appendChild(bookCard);
    });
    
    // 显示加载更多按钮（如果更多结果）
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.style.display = books.length >= 20 ? 'block' : 'none';
}

// 搜索图书
async function searchBooks(query = '', filters = {}) {
    try {
        // 显示加载状态
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) loadingIndicator.style.display = 'flex';
        
        // 构建查询参数
        const params = new URLSearchParams({
            q: query,
            category: filters.category || '',
            minPrice: filters.minPrice || '',
            maxPrice: filters.maxPrice || '',
            sort: filters.sort || 'default'
        });
        
        const response = await fetch(`/api/books?${params}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
            allBooks = data.map(book => ({
                ...book,
                price: {
                    original: parseFloat(book.price.original),
                    current: parseFloat(book.price.current || book.price.original),
                    discount: parseFloat(book.price.discount || 1)
                },
                stock: parseInt(book.stock)
            }));
            console.log('成功加载图书数据:', allBooks); // 添加调试日志
            displayBooks(allBooks);
        } else {
            throw new Error('无效的图书数据格式');
        }
    } catch (error) {
        console.error('搜索错误:', error);
        displayError('搜索服务暂时不可用，请稍后重试');
    } finally {
        // 隐藏加载状态
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}


// 在search.js中添加错误处理，以防图片加载失败
document.addEventListener('DOMContentLoaded', function() {
    // 为所有图片添加错误处理
    document.querySelectorAll('img').forEach(img => {
        img.onerror = function() {
            // 当图片加载失败时，可以设置一个默认图片
            this.src = '/images/default-book.jpg';
            // 或者添加一个CSS类来显示占位符
            this.classList.add('image-load-error');
        };
    });
});

// 检查用户登录状态
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();
        
        const guestNav = document.getElementById('guestNav');
        const userNav = document.getElementById('userNav');
        
        if (data.isAuthenticated) {
            // 用户已登录
            guestNav.style.display = 'none';
            userNav.style.display = 'flex';
            // 可以显示用户名等信息
            if (data.user.username) {
                document.getElementById('userCenterLink').textContent = 
                    `个人中心 (${data.user.username})`;
            }
        } else {
            // 用户未登录
            guestNav.style.display = 'flex';
            userNav.style.display = 'none';
        }
    } catch (error) {
        console.error('检查登录状态失败:', error);
    }
}

// 处理退出登录
async function handleLogout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            // 清除本地存储的用户信息
            localStorage.removeItem('userInfo');
            // 刷新页面或重定向到首页
            window.location.reload();
        }
    } catch (error) {
        console.error('退出登录失败:', error);
    }
}

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    
    // 绑定退出登录事件
    document.getElementById('logoutLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });
});

// 渲染书籍列表的函数
function renderBooks(books) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = ''; // 清空现有内容

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-item';
        
        // 创建书籍链接，点击跳转到详情页
        const bookLink = document.createElement('a');
        bookLink.href = `/CART/detail.html?bookId=${book.id}`;
        bookLink.textContent = book.title;
        
        // 创建作者和价格信息
        const authorP = document.createElement('p');
        authorP.textContent = `作者：${book.author}`;
        
        const priceP = document.createElement('p');
        priceP.textContent = `价格：¥${book.price.current.toFixed(2)}`;
        
        // 组装书籍卡片
        bookDiv.appendChild(bookLink);
        bookDiv.appendChild(authorP);
        bookDiv.appendChild(priceP);
        
        bookList.appendChild(bookDiv);
    });
}

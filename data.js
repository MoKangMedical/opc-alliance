// ============================================
// OPC Alliance — Seed Data
// ============================================

const SEED_IDEAS = [
    {
        id: 'seed-1', author: 'Pieter Levels', avatar: 'P',
        category: 'insight', content: '2026年的趋势：AI-native SaaS 不需要后端。一个前端 + AI API = 完整产品。我用Cursor + Claude一天能出3个MVP。传统团队根本追不上这个速度。',
        tags: ['AI', 'SaaS', 'ship-fast'], likes: 47, comments: [
            { author: 'Marc Lou', text: '完全同意，我的Zenvoice就是用AI写完所有代码的', time: '2小时前' },
            { author: 'Tony Dinh', text: '关键是找到对的市场，技术已经不是瓶颈了', time: '1小时前' }
        ], time: '3小时前', bookmarked: false
    },
    {
        id: 'seed-2', author: 'Naval Ravikant', avatar: 'N',
        category: 'idea', content: '想法：建立一个「OPC技能交换市场」。独立开发者帮设计师做网站，设计师帮开发者做UI。不用钱，用时间信用(Time Credits)交换。每个人的时间价值相同。',
        tags: ['marketplace', 'skills', 'time-banking'], likes: 82, comments: [
            { author: 'Derek Sivers', text: '这很像我以前做的音乐人互助网络。关键是信任系统。', time: '5小时前' }
        ], time: '6小时前', bookmarked: true
    },
    {
        id: 'seed-3', author: 'James Clear', avatar: 'J',
        category: 'experience', content: '经验分享：我花了3年写newsletter才出书。大部分创业者太早追求变现。先建立受众，再考虑产品。Atomic Habits出版时已经有50万人等著买了。耐心是最大的杠杆。',
        tags: ['newsletter', 'books', 'patience'], likes: 156, comments: [], time: '1天前', bookmarked: false
    },
    {
        id: 'seed-4', author: 'Sahil Lavingia', avatar: 'S',
        category: 'question', content: '提问：各位一人公司创业者，你们怎么处理"孤独感"？不是工作上的，而是没有同事可以随便聊聊的那种。Gumroad做到第三年我差点放弃，就是因为太孤独了。',
        tags: ['mental-health', 'solopreneur', 'community'], likes: 203, comments: [
            { author: 'Paul Jarvis', text: '我每周固定和另外3个独立创始人视频聊天。不是工作，就是聊聊生活。', time: '12小时前' },
            { author: 'Daniel Vassallo', text: 'Twitter/X就是我的办公室。每天和同行互动，感觉不孤独。', time: '8小时前' },
            { author: 'Justin Welsh', text: '加入小型mastermind群。5-6人，每周一次，坚持了2年。', time: '6小时前' }
        ], time: '2天前', bookmarked: true
    },
    {
        id: 'seed-5', author: 'Jack Butcher', avatar: 'J',
        category: 'tool', content: '工具推荐：Figma + 可视化思维 = 一个人的设计公司。我用Figma做所有东西：课程封面、NFT artwork、社交媒体图、产品截图。学会一个工具，替代十个。',
        tags: ['design', 'figma', 'tools'], likes: 91, comments: [], time: '3天前', bookmarked: false
    },
    {
        id: 'seed-6', author: 'Daniel Vassallo', avatar: 'D',
        category: 'idea', content: '商业想法：做「小而美」SaaS的目录网站。类似Product Hunt但只收MRR < $5K的产品。帮小产品找到前100个付费用户。收费模式：上架费$20 + 推荐佣金。',
        tags: ['saas', 'directory', 'small-bets'], likes: 68, comments: [
            { author: 'Jon Yongfook', text: '好主意。Bannerbear就是靠类似的小众目录获得了前50个用户。', time: '1天前' }
        ], time: '4天前', bookmarked: false
    },
    {
        id: 'seed-7', author: 'Tim Ferriss', avatar: 'T',
        category: 'insight', content: '洞察：播客是我的"付费学习"平台。每次采访一个专家，我免费获得了一次大师课。900M次下载是副产品。真正的产品是我的知识网络。一人公司最好的学习方式：采访你崇拜的人。',
        tags: ['podcast', 'learning', 'networking'], likes: 124, comments: [], time: '5天前', bookmarked: true
    },
    {
        id: 'seed-8', author: 'Marc Lou', avatar: 'M',
        category: 'experience', content: '经验：我launch了20个产品，只有4个赚钱。但那4个赚的钱足够覆盖所有试错成本。创业的数学不是成功率，是期望值。1% × $1M > 100% × $1K。大胆尝试，快速失败。',
        tags: ['ship-fast', 'portfolio', 'math'], likes: 178, comments: [], time: '1周前', bookmarked: false
    },
    {
        id: 'seed-9', author: '刘小排', avatar: '刘',
        category: 'idea', content: '想法：做一个「AI翻译+本地化」工具，专门服务中国出海开发者。功能：一键翻译产品UI/文档/landing page，自动适配目标市场的文化习惯。定价：$29/月，面向百万中国出海开发者。',
        tags: ['出海', 'AI翻译', '本地化', 'SaaS'], likes: 45, comments: [
            { author: 'Tony Dinh', text: '好方向！TypingMind的国际化就是手动做的，如果有自动化工具会好很多。', time: '2天前' }
        ], time: '3天前', bookmarked: false
    },
    {
        id: 'seed-10', author: '孔繁利', avatar: '孔',
        category: 'experience', content: '出海经验：我用Stripe Atlas注册美国公司花了$500，Vercel部署免费，域名$12/年。总启动成本不到¥4000。产品上线第一个月就收到了来自美国的付费用户。地理套利是真实存在的。',
        tags: ['出海', 'Stripe Atlas', '低成本', 'SaaS'], likes: 89, comments: [], time: '5天前', bookmarked: false
    },
    {
        id: 'seed-11', author: '何夕', avatar: '何',
        category: 'insight', content: '洞察：中国独立开发者最大的误解是"国内付费意愿低"。真相是：你找错了用户。知识星球、小报童、付费社群的数据证明，只要内容够好，中国用户的付费意愿是世界前列的。关键是找到对的场景。',
        tags: ['中国', '付费意愿', '内容变现'], likes: 134, comments: [
            { author: '吴俊宇', text: '完全同意。我的知识星球年费365元，续费率65%以上。关键是深度。', time: '1天前' }
        ], time: '1周前', bookmarked: true
    },
    {
        id: 'seed-12', author: '吴俊宇', avatar: '吴',
        category: 'tool', content: '工具推荐：飞书妙记 + Cursor + ChatGPT = 中国独立写作者的最强组合。飞书妙记记录会议→Cursor整理笔记→ChatGPT润色文章。一个人日产出3000字深度分析。',
        tags: ['写作', 'AI', '效率', '工具链'], likes: 67, comments: [], time: '4天前', bookmarked: false
    }
];

const SEED_RESOURCES = [
    { id: 'r1', title: 'Cursor AI', url: 'https://cursor.sh', category: 'tool', desc: 'AI代码编辑器，一人公司的开发利器。用自然语言写代码，10倍速。', tags: ['AI', 'coding'], addedBy: 'Pieter Levels', votes: 34 },
    { id: 'r2', title: 'Gumroad', url: 'https://gumroad.com', category: 'tool', desc: '最简单的数字产品销售平台。上传产品，设置价格，开始赚钱。', tags: ['creator-economy', 'payments'], addedBy: 'Sahil Lavingia', votes: 28 },
    { id: 'r3', title: 'Rework (书)', url: 'https://basecamp.com/rework', category: 'book', desc: '37signals写的商业圣经。教你用最少的人、最少的资源做最好的产品。', tags: ['business', 'bootstrapping'], addedBy: 'Jason Fried', votes: 45 },
    { id: 'r4', title: 'The Almanack of Naval Ravikant', url: 'https://navalmanack.com', category: 'book', desc: '免费电子书。财富创造和幸福的完整指南。每个创业者必读。', tags: ['philosophy', 'wealth'], addedBy: 'Naval Ravikant', votes: 67 },
    { id: 'r5', title: 'Plausible Analytics', url: 'https://plausible.io', category: 'tool', desc: '开源、隐私友好的网站分析。替代Google Analytics，一个人就能维护。', tags: ['analytics', 'privacy'], addedBy: 'Paul Jarvis', votes: 22 },
    { id: 'r6', title: 'Visualize Value', url: 'https://visualizevalue.com', category: 'course', desc: 'Jack Butcher的视觉思维课程。学会用简单图形表达复杂想法。', tags: ['design', 'visual'], addedBy: 'Jack Butcher', votes: 31 },
    { id: 'r7', title: 'Stripe Atlas', url: 'https://stripe.com/atlas', category: 'tool', desc: '一键注册美国公司。全球一人公司创业者必备，$500搞定一切。', tags: ['incorporation', 'payments'], addedBy: 'Marc Lou', votes: 39 },
    { id: 'r8', title: 'Indie Hackers', url: 'https://indiehackers.com', category: 'community', desc: '独立创业者社区。看别人怎么从0到$10K MRR，学真实的创业故事。', tags: ['community', 'bootstrapping'], addedBy: 'Courtland Allen', votes: 41 },
    { id: 'r9', title: 'Lemon Squeezy', url: 'https://lemonsqueezy.com', category: 'tool', desc: '全球税务合规的数字产品支付方案。Merchant of Record，你不用操心税务。', tags: ['payments', 'tax'], addedBy: 'Tony Dinh', votes: 26 },
    { id: 'r10', title: '小报童 (xiaobaotong)', url: 'https://xiaobaotong.com', category: 'tool', desc: '中文付费newsletter平台。适合国内独立创作者，支持微信支付。', tags: ['newsletter', 'china'], addedBy: '运营喵', votes: 18 },
    { id: 'r11', title: 'Cal.com', url: 'https://cal.com', category: 'tool', desc: '开源日程预约工具。替代Calendly，自托管免费。一人公司必备。', tags: ['scheduling', 'open-source'], addedBy: 'Peer Richelsen', votes: 20 },
    { id: 'r12', title: 'Atomic Habits (书)', url: 'https://jamesclear.com/atomic-habits', category: 'book', desc: '习惯养成系统。一人公司最大的敌人不是竞争对手，是自己的坏习惯。', tags: ['habits', 'productivity'], addedBy: 'James Clear', votes: 52 },
    { id: 'r13', title: '小报童 (xiaobaotong)', url: 'https://xiaobaotong.com', category: 'tool', desc: '中文付费newsletter平台。适合国内独立创作者，支持微信支付。', tags: ['newsletter', 'china'], addedBy: '运营喵', votes: 28 },
    { id: 'r14', title: '知识星球', url: 'https://zsxq.com', category: 'community', desc: '中国最大的付费社群平台。适合建立付费社区，年费模式，续费率高。', tags: ['community', 'china', '付费社群'], addedBy: '吴俊宇', votes: 22 },
    { id: 'r15', title: 'Cursor AI', url: 'https://cursor.sh', category: 'tool', desc: 'AI代码编辑器。中国独立开发者用它一天能写完过去一周的代码。vibe coding必备。', tags: ['AI', 'coding', 'vibe-coding'], addedBy: '刘小排', votes: 45 },
    { id: 'r16', title: 'Stripe Atlas', url: 'https://stripe.com/atlas', category: 'tool', desc: '一键注册美国公司。$500搞定LLC+EIN+Stripe账号。中国出海创业者必备第一步。', tags: ['出海', '公司注册', 'payments'], addedBy: '孔繁利', votes: 33 },
    { id: 'r17', title: 'Vercel', url: 'https://vercel.com', category: 'tool', desc: '免费部署Next.js应用。全球CDN，自带域名，一人公司最佳部署方案。', tags: ['deployment', 'hosting', 'free'], addedBy: 'Marc Lou', votes: 38 },
    { id: 'r18', title: 'Notion', url: 'https://notion.so', category: 'tool', desc: '一人公司的操作系统。项目管理+知识库+CRM+写作。免费版够用。', tags: ['productivity', 'all-in-one'], addedBy: 'Justin Welsh', votes: 30 }
];

const SEED_DISCUSSIONS = [
    {
        id: 'd1', title: '一人公司 vs 创业团队：2026年哪个更有优势？',
        content: 'AI工具让一个人能做的事越来越多。但有些市场还是需要团队。讨论一下：什么情况下一人公司更好，什么情况下需要团队？',
        author: '张三', comments: [
            { author: 'Pieter Levels', text: '工具类SaaS → 一人公司。平台类 → 需要团队。', time: '3小时前' },
            { author: 'Sahil Lavingia', text: '取决于你想做什么规模的公司。$1M ARR以下，一人够了。', time: '2小时前' }
        ], time: '5小时前', views: 234
    },
    {
        id: 'd2', title: '如何用AI在72小时内从0到上线一个SaaS？',
        content: '分享我的流程：Day 1: 用Claude设计产品架构 + 数据库。Day 2: 用Cursor写代码。Day 3: 用Vercel部署 + Product Hunt发布。总成本：$0（除了域名）。有人想一起试试吗？',
        author: 'Marc Lou', comments: [
            { author: 'Tony Dinh', text: '我做过类似的事。关键是第一天就确定MVP范围，不要feature creep。', time: '1天前' }
        ], time: '2天前', views: 567
    },
    {
        id: 'd3', title: '独立开发者如何定价？按月 vs 一次性 vs 按用量',
        content: '我做了个小工具，不知道怎么收费。看到有的同行搞lifetime deal，有的坚持月订阅，还有的按API调用次数收费。每种模式的优劣是什么？',
        author: '李明', comments: [], time: '3天前', views: 189
    }
];

const SEED_PROJECTS = [
    { id: 'p1', name: 'Photo AI', url: 'https://photoai.com', desc: 'AI照片生成器。上传自拍照，生成专业头像、产品图。Pieter的最新爆款。', tech: ['Next.js', 'Stable Diffusion', 'Stripe'], revenue: '$100K/mo', author: 'Pieter Levels', votes: 56 },
    { id: 'p2', name: 'TypingMind', url: 'https://typingmind.com', desc: '更好的ChatGPT UI。支持多模型、插件、知识库。终身版$79。', tech: ['React', 'OpenAI API', 'Firebase'], revenue: '$40K/mo', author: 'Tony Dinh', votes: 48 },
    { id: 'p3', name: 'Bannerbear', url: 'https://bannerbear.com', desc: '自动生成图片和视频的API。社交媒体图、电商banner、证书一键生成。', tech: ['Ruby on Rails', 'ImageMagick', 'AWS'], revenue: '$25K/mo', author: 'Jon Yongfook', votes: 37 },
    { id: 'p4', name: 'Visualize Value', url: 'https://visualizevalue.com', desc: '视觉思维框架集合。用简单图形解释复杂商业概念。课程+模板+NFT。', tech: ['Figma', 'Next.js', 'Stripe'], revenue: '$50K/mo', author: 'Jack Butcher', votes: 42 },
    { id: 'p5', name: '小和AI助手', url: '#', desc: '基于多Agent架构的医患讨论AI平台。4个专业Agent协作，支持中英文，面向罕见病诊疗场景。', tech: ['FastAPI', 'React', 'GPT-4', 'WebSocket'], revenue: 'Pre-revenue', author: '你', votes: 0 }
];

const DAILY_QUESTIONS = [
    '如果你只能做一个产品来养活自己，你会做什么？',
    '你从失败的项目里学到的最重要的教训是什么？',
    '一人公司最大的优势是什么？最大的劣势呢？',
    '你觉得未来5年，哪个行业最适合一人公司？',
    '你用过最值钱的免费工具是什么？',
    '如果你能回到创业第一天，你会告诉自己什么？',
    '你如何平衡"做产品"和"做营销"的时间？',
    '一人公司需要"公司文化"吗？如果需要，是什么样的？',
    '你觉得"被动收入"真的存在吗？',
    '你每天花多少时间在"不产生直接收入"但重要的事情上？',
    '如果你的产品明天就成功了，你最想做什么？',
    '你认为"Build in Public"的边界在哪里？什么不该分享？',
    '中国独立开发者出海，最大的障碍是什么？',
    '你觉得AI会替代独立开发者还是赋能独立开发者？',
    '一个人怎么建立"可信赖"的个人品牌？'
];

const WEEKLY_TOPICS = [
    { week: '2026-W16', title: '🎯 本周话题：你的第一个1美元是怎么赚到的？', desc: '分享你的"第一桶金"故事。是付费用户、广告、还是咨询？哪个瞬间让你觉得"这事儿能成"？', tags: ['第一桶金', '变现', '里程碑'] },
    { week: '2026-W17', title: '🛠️ 本周话题：一人公司必备的10个工具', desc: '分享你日常离不开的工具。代码编辑器、设计工具、支付平台、部署工具...每人推荐一个最值的。', tags: ['工具', '效率', '推荐'] },
    { week: '2026-W18', title: '🌏 本周话题：中国开发者出海经验分享', desc: '你有面向海外市场的产品吗？遇到了哪些坑？支付、客服、合规怎么解决的？', tags: ['出海', '全球化', '经验'] },
    { week: '2026-W19', title: '🤖 本周话题：AI时代，一人公司的机会在哪里？', desc: 'AI让一个人能做的事越来越多。你觉得哪些领域会被重新洗牌？哪些机会是AI独创的？', tags: ['AI', '机会', '趋势'] },
    { week: '2026-W20', title: '💰 本周话题：定价的艺术——你的产品怎么定价的？', desc: '按月收费还是一次性？免费增值还是纯付费？分享你的定价策略和背后思考。', tags: ['定价', '变现', '策略'] }
];

window.SEED_IDEAS = SEED_IDEAS;
window.SEED_RESOURCES = SEED_RESOURCES;
window.SEED_DISCUSSIONS = SEED_DISCUSSIONS;
window.SEED_PROJECTS = SEED_PROJECTS;
window.DAILY_QUESTIONS = DAILY_QUESTIONS;
window.WEEKLY_TOPICS = WEEKLY_TOPICS;

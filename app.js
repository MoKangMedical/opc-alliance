// ============================================
// OPC Alliance — App
// ============================================

(function() {
    'use strict';

    // ---- Storage Keys ----
    const STORE = {
        user: 'opc_user',
        ideas: 'opc_ideas',
        resources: 'opc_resources',
        discussions: 'opc_discussions',
        projects: 'opc_projects',
        bookmarks: 'opc_bookmarks',
        likes: 'opc_likes'
    };

    // ---- Helpers ----
    function load(key, fallback) {
        try { return JSON.parse(localStorage.getItem(key)) || fallback; }
        catch { return fallback; }
    }
    function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
    function uid() { return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8); }
    function timeAgo(ts) {
        const diff = Date.now() - ts;
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
        if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
        return Math.floor(diff / 86400000) + '天前';
    }
    function getInitial(name) { return (name || '?').charAt(0).toUpperCase(); }

    // ---- State ----
    let user = load(STORE.user, null);
    let ideas = load(STORE.ideas, null);
    let resources = load(STORE.resources, null);
    let discussions = load(STORE.discussions, null);
    let projects = load(STORE.projects, null);
    let bookmarks = load(STORE.bookmarks, []);
    let likes = load(STORE.likes, []);

    // Init seed data on first visit
    if (ideas === null) {
        ideas = SEED_IDEAS.map(i => ({ ...i, id: uid(), ts: Date.now() - Math.random() * 86400000 * 7 }));
        save(STORE.ideas, ideas);
    }
    if (resources === null) {
        resources = SEED_RESOURCES;
        save(STORE.resources, resources);
    }
    if (discussions === null) {
        discussions = SEED_DISCUSSIONS.map(d => ({ ...d, id: uid(), ts: Date.now() - Math.random() * 86400000 * 5 }));
        save(STORE.discussions, discussions);
    }
    if (projects === null) {
        projects = SEED_PROJECTS;
        save(STORE.projects, projects);
    }

    // ---- DOM ----
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ---- Onboarding ----
    const obModal = $('#onboardingModal');
    const roleBtns = $$('.role-btn');
    let selectedRole = 'developer';

    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            roleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedRole = btn.dataset.role;
        });
    });

    if (user) {
        obModal.classList.remove('active');
    }

    $('#obSubmit').addEventListener('click', () => {
        const name = $('#obName').value.trim();
        const bio = $('#obBio').value.trim();
        if (!name) { $('#obName').focus(); return; }

        user = {
            name,
            bio: bio || 'OPC创业者',
            role: selectedRole,
            joined: Date.now(),
            ideasCount: 0,
            resourcesCount: 0
        };
        save(STORE.user, user);
        obModal.classList.remove('active');
        updateUserUI();
        renderAll();
    });

    // ---- Navigation ----
    const navItems = $$('.nav-item');
    const seeAllLinks = $$('.see-all');

    function navigateTo(page) {
        $$('.page').forEach(p => p.classList.remove('active'));
        navItems.forEach(n => n.classList.remove('active'));
        const target = $(`#page-${page}`);
        if (target) target.classList.add('active');
        navItems.forEach(n => {
            if (n.dataset.page === page) n.classList.add('active');
        });
        // Close mobile sidebar
        $('#sidebar').classList.remove('open');
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(item.dataset.page);
        });
    });

    seeAllLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    // Mobile menu
    $('#menuToggle').addEventListener('click', () => {
        $('#sidebar').classList.toggle('open');
    });
    $('#sidebarClose').addEventListener('click', () => {
        $('#sidebar').classList.remove('open');
    });

    // ---- Update User UI ----
    function updateUserUI() {
        if (!user) return;
        const initial = getInitial(user.name);
        const roleLabels = {
            developer: '💻 开发者', designer: '🎨 设计师', creator: '✍️ 内容创作者',
            marketer: '📢 营销人', investor: '💰 投资人', founder: '🚀 创业者'
        };
        $('#userAvatarSidebar').textContent = initial;
        $('#userNameSidebar').textContent = user.name;
        $('#userRoleSidebar').textContent = roleLabels[user.role] || user.role;
        $('#composeAvatar').textContent = initial;
    }

    // ---- Render Stats ----
    function renderStats() {
        const members = load('opc_members', generateFakeMembers());
        $('#statMembers').textContent = members.length;
        $('#statIdeas').textContent = ideas.length;
        $('#statResources').textContent = resources.length;
        $('#statProjects').textContent = projects.length;
        $('#ideasBadge').textContent = ideas.length;
    }

    // ---- Generate Fake Members ----
    function generateFakeMembers() {
        const names = [
            { name: 'Pieter Levels', role: 'developer', bio: 'Serial shipper, built 70+ products' },
            { name: 'Naval Ravikant', role: 'investor', bio: 'Philosopher & AngelList founder' },
            { name: 'James Clear', role: 'creator', bio: 'Author of Atomic Habits' },
            { name: 'Sahil Lavingia', role: 'founder', bio: 'Gumroad founder, minimalist' },
            { name: 'Jack Butcher', role: 'designer', bio: 'Visualize Value, visual thinker' },
            { name: 'Marc Lou', role: 'developer', bio: 'Serial shipper, vibe coder' },
            { name: 'Daniel Vassallo', role: 'developer', bio: 'Small bets, ex-AWS' },
            { name: 'Tony Dinh', role: 'developer', bio: 'Indie maker from Vietnam' },
            { name: 'Jon Yongfook', role: 'developer', bio: 'Bannerbear, solo in Japan' },
            { name: 'Paul Jarvis', role: 'creator', bio: 'Company of One author' },
            { name: 'Derek Sivers', role: 'creator', bio: 'CD Baby founder, author' },
            { name: 'Tim Ferriss', role: 'creator', bio: '4-Hour Workweek, podcaster' },
            { name: 'Jason Fried', role: 'founder', bio: 'Basecamp / 37signals' },
            { name: 'Justin Welsh', role: 'creator', bio: 'LinkedIn solopreneur' },
            { name: 'Pat Flynn', role: 'creator', bio: 'Smart Passive Income' }
        ];
        // Add current user if exists
        if (user) {
            names.unshift({ name: user.name, role: user.role, bio: user.bio, isUser: true });
        }
        const members = names.map((m, i) => ({
            ...m,
            id: uid(),
            ideasCount: m.isUser ? user.ideasCount || 0 : Math.floor(Math.random() * 20),
            resourcesCount: m.isUser ? user.resourcesCount || 0 : Math.floor(Math.random() * 8),
            score: m.isUser ? 0 : Math.floor(Math.random() * 500) + 100
        }));
        save('opc_members', members);
        return members;
    }

    // ---- Render Home ----
    function renderHome() {
        // Latest ideas (top 5)
        const sorted = [...ideas].sort((a, b) => (b.ts || 0) - (a.ts || 0));
        const homeIdeasEl = $('#homeIdeas');
        homeIdeasEl.innerHTML = sorted.slice(0, 5).map(i => renderIdeaCard(i, true)).join('');
        attachIdeaActions(homeIdeasEl);

        // Daily question
        const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_QUESTIONS.length;
        $('#dailyQuestion').textContent = DAILY_QUESTIONS[dayIndex];

        // Weekly topic
        if (typeof WEEKLY_TOPICS !== 'undefined' && WEEKLY_TOPICS.length) {
            const weekIndex = Math.floor(Date.now() / (86400000 * 7)) % WEEKLY_TOPICS.length;
            const topic = WEEKLY_TOPICS[weekIndex];
            $('#weeklyTopic').innerHTML = `
                <div style="font-weight:600;font-size:0.9rem;margin-bottom:6px;">${topic.title}</div>
                <div style="font-size:0.82rem;color:var(--text-dim);line-height:1.6;margin-bottom:8px;">${topic.desc}</div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">${topic.tags.map(t => `<span class="idea-tag">#${t}</span>`).join('')}</div>
            `;
        }

        // Top members
        const members = load('opc_members', generateFakeMembers());
        const top = [...members].sort((a, b) => b.score - a.score).slice(0, 5);
        $('#topMembers').innerHTML = top.map(m => `
            <div class="top-member">
                <div class="mini-avatar">${getInitial(m.name)}</div>
                <span class="top-member-name">${m.name}</span>
                <span class="top-member-score">${m.score} pts</span>
            </div>
        `).join('');

        // Quick resources
        const quickRes = resources.slice(0, 5);
        const catIcons = { tool: '🛠️', template: '📄', course: '🎓', book: '📚', community: '👥', api: '🔗' };
        $('#quickResources').innerHTML = quickRes.map(r => `
            <a href="${r.url}" target="_blank" class="quick-res-item">
                <span class="quick-res-icon">${catIcons[r.category] || '📦'}</span>
                <span>${r.title}</span>
            </a>
        `).join('');
    }

    // ---- Render Ideas ----
    function renderIdeas(filter = 'all') {
        const sorted = [...ideas].sort((a, b) => (b.ts || 0) - (a.ts || 0));
        const filtered = filter === 'all' ? sorted : sorted.filter(i => i.category === filter);
        const list = $('#ideasList');
        list.innerHTML = filtered.length ? filtered.map(i => renderIdeaCard(i)).join('') : '<div class="panel"><p style="color:var(--text-muted);text-align:center;">暂无想法，来分享第一个吧 ✨</p></div>';
        attachIdeaActions(list);
    }

    function renderIdeaCard(idea, compact = false) {
        const isLiked = likes.includes(idea.id);
        const isBookmarked = bookmarks.includes(idea.id);
        const catLabels = { idea: '💡 想法', insight: '🔍 洞察', question: '❓ 提问', experience: '📖 经验', tool: '🛠️ 工具' };
        return `
            <div class="idea-card" data-id="${idea.id}">
                <div class="idea-header">
                    <div class="idea-avatar">${getInitial(idea.author)}</div>
                    <span class="idea-author">${idea.author}</span>
                    <span class="idea-category-badge">${catLabels[idea.category] || '💡'}</span>
                    <span class="idea-time">${idea.time || timeAgo(idea.ts || Date.now())}</span>
                </div>
                <div class="idea-body">${idea.content}</div>
                ${idea.tags && idea.tags.length ? `<div class="idea-tags">${idea.tags.map(t => `<span class="idea-tag">#${t}</span>`).join('')}</div>` : ''}
                <div class="idea-actions">
                    <button class="idea-action ${isLiked ? 'liked' : ''}" data-action="like" data-id="${idea.id}">
                        ${isLiked ? '❤️' : '🤍'} ${idea.likes || 0}
                    </button>
                    <button class="idea-action" data-action="comment" data-id="${idea.id}">
                        💬 ${(idea.comments || []).length}
                    </button>
                    <button class="idea-action ${isBookmarked ? 'bookmarked' : ''}" data-action="bookmark" data-id="${idea.id}">
                        ${isBookmarked ? '⭐' : '☆'} 收藏
                    </button>
                </div>
            </div>
        `;
    }

    function attachIdeaActions(container) {
        container.querySelectorAll('.idea-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const id = btn.dataset.id;
                if (action === 'like') toggleLike(id);
                else if (action === 'bookmark') toggleBookmark(id);
                else if (action === 'comment') openComments(id);
            });
        });
    }

    function toggleLike(id) {
        const idx = likes.indexOf(id);
        if (idx > -1) { likes.splice(idx, 1); }
        else { likes.push(id); }
        save(STORE.likes, likes);
        // Update idea likes count
        const idea = ideas.find(i => i.id === id);
        if (idea) {
            idea.likes = (idea.likes || 0) + (likes.includes(id) ? 1 : -1);
            if (idea.likes < 0) idea.likes = 0;
            save(STORE.ideas, ideas);
        }
        renderAll();
    }

    function toggleBookmark(id) {
        const idx = bookmarks.indexOf(id);
        if (idx > -1) { bookmarks.splice(idx, 1); }
        else { bookmarks.push(id); }
        save(STORE.bookmarks, bookmarks);
        renderAll();
    }

    // ---- Comment Modal ----
    let commentTargetId = null;

    function openComments(id) {
        commentTargetId = id;
        const idea = ideas.find(i => i.id === id);
        if (!idea) return;

        const comments = idea.comments || [];
        $('#commentThreadContent').innerHTML = `
            <div class="idea-body" style="margin-bottom:16px;font-size:0.95rem;">${idea.content}</div>
            <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:12px;">${comments.length} 条评论</div>
            ${comments.length ? comments.map(c => `
                <div class="comment-item">
                    <div class="comment-author">${c.author}</div>
                    <div class="comment-text">${c.text}</div>
                    <div class="comment-time">${c.time}</div>
                </div>
            `).join('') : '<p style="color:var(--text-muted);font-size:0.85rem;">还没有评论，来说两句吧</p>'}
        `;
        $('#commentModal').classList.add('active');
    }

    $('#closeCommentModal').addEventListener('click', () => {
        $('#commentModal').classList.remove('active');
    });
    $('#commentModal').addEventListener('click', (e) => {
        if (e.target === $('#commentModal')) $('#commentModal').classList.remove('active');
    });

    $('#postComment').addEventListener('click', () => {
        const text = $('#commentInput').value.trim();
        if (!text || !commentTargetId) return;
        const idea = ideas.find(i => i.id === commentTargetId);
        if (!idea) return;
        if (!idea.comments) idea.comments = [];
        idea.comments.push({
            author: user ? user.name : '匿名',
            text,
            time: '刚刚'
        });
        save(STORE.ideas, ideas);
        $('#commentInput').value = '';
        openComments(commentTargetId);
        renderAll();
    });

    // ---- Post Idea ----
    $('#postIdea').addEventListener('click', () => {
        const content = $('#ideaInput').value.trim();
        if (!content) { $('#ideaInput').focus(); return; }
        const category = $('#ideaCategory').value;
        const tagsStr = $('#ideaTags').value.trim();
        const tags = tagsStr ? tagsStr.split(/[,，]/).map(t => t.trim()).filter(Boolean) : [];

        const newIdea = {
            id: uid(),
            author: user ? user.name : '匿名',
            category,
            content,
            tags,
            likes: 0,
            comments: [],
            time: '刚刚',
            ts: Date.now(),
            bookmarked: false
        };
        ideas.unshift(newIdea);
        save(STORE.ideas, ideas);

        if (user) {
            user.ideasCount = (user.ideasCount || 0) + 1;
            save(STORE.user, user);
        }

        $('#ideaInput').value = '';
        $('#ideaTags').value = '';
        renderAll();
    });

    // ---- Ideas Filter ----
    $$('#page-ideas .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('#page-ideas .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderIdeas(btn.dataset.filter);
        });
    });

    // ---- Resources ----
    function renderResources(cat = 'all') {
        const catIcons = { tool: '🛠️', template: '📄', course: '🎓', book: '📚', community: '👥', api: '🔗' };
        const filtered = cat === 'all' ? resources : resources.filter(r => r.category === cat);
        $('#resourcesList').innerHTML = filtered.map(r => `
            <div class="resource-card">
                <div class="resource-icon">${catIcons[r.category] || '📦'}</div>
                <div class="resource-title">${r.title}</div>
                <div class="resource-desc">${r.desc}</div>
                <div class="resource-meta">
                    <span class="resource-cat">by ${r.addedBy}</span>
                    ${r.url && r.url !== '#' ? `<a href="${r.url}" target="_blank" class="resource-link">访问 →</a>` : ''}
                </div>
                <div class="resource-tags">
                    ${(r.tags || []).map(t => `<span class="idea-tag">#${t}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    $('#addResourceBtn').addEventListener('click', () => {
        $('#resourceForm').classList.toggle('hidden');
    });
    $('#cancelResource').addEventListener('click', () => {
        $('#resourceForm').classList.add('hidden');
    });
    $('#submitResource').addEventListener('click', () => {
        const title = $('#resTitle').value.trim();
        const url = $('#resUrl').value.trim();
        if (!title) return;
        const newRes = {
            id: uid(),
            title,
            url: url || '#',
            category: $('#resCategory').value,
            desc: $('#resDesc').value.trim() || '暂无描述',
            tags: ($('#resTags').value.trim() || '').split(/[,，]/).map(t => t.trim()).filter(Boolean),
            addedBy: user ? user.name : '匿名',
            votes: 0
        };
        resources.unshift(newRes);
        save(STORE.resources, resources);
        if (user) { user.resourcesCount = (user.resourcesCount || 0) + 1; save(STORE.user, user); }
        $('#resTitle').value = ''; $('#resUrl').value = ''; $('#resDesc').value = ''; $('#resTags').value = '';
        $('#resourceForm').classList.add('hidden');
        renderAll();
    });

    $$('.cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderResources(btn.dataset.cat);
        });
    });

    // ---- Members ----
    function renderMembers(search = '') {
        const members = load('opc_members', generateFakeMembers());
        const roleLabels = { developer: '💻 开发者', designer: '🎨 设计师', creator: '✍️ 创作者', marketer: '📢 营销人', investor: '💰 投资人', founder: '🚀 创业者' };
        const filtered = search ? members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || (m.bio || '').toLowerCase().includes(search.toLowerCase())) : members;
        $('#membersList').innerHTML = filtered.map(m => `
            <div class="member-card">
                <div class="member-avatar">${getInitial(m.name)}</div>
                <div class="member-name">${m.name}</div>
                <div class="member-role-badge">${roleLabels[m.role] || m.role}</div>
                <div class="member-bio">${m.bio || ''}</div>
                <div class="member-stats">
                    <div class="member-stat"><span class="member-stat-num">${m.ideasCount || 0}</span><span class="member-stat-label">想法</span></div>
                    <div class="member-stat"><span class="member-stat-num">${m.resourcesCount || 0}</span><span class="member-stat-label">资源</span></div>
                    <div class="member-stat"><span class="member-stat-num">${m.score || 0}</span><span class="member-stat-label">积分</span></div>
                </div>
            </div>
        `).join('');
    }

    $('#memberSearch').addEventListener('input', (e) => {
        renderMembers(e.target.value);
    });

    // ---- Discussions ----
    function renderDiscussions() {
        const sorted = [...discussions].sort((a, b) => (b.ts || 0) - (a.ts || 0));
        $('#discussionsList').innerHTML = sorted.map(d => `
            <div class="discussion-card" data-id="${d.id}">
                <div class="disc-title">${d.title}</div>
                <div class="disc-preview">${d.content}</div>
                <div class="disc-meta">
                    <span>👤 ${d.author}</span>
                    <span>💬 ${(d.comments || []).length} 回复</span>
                    <span>👁️ ${d.views || 0} 浏览</span>
                    <span>${d.time || timeAgo(d.ts || Date.now())}</span>
                </div>
            </div>
        `).join('');

        // Click to view
        $('#discussionsList').querySelectorAll('.discussion-card').forEach(card => {
            card.addEventListener('click', () => {
                const d = discussions.find(x => x.id === card.dataset.id);
                if (!d) return;
                d.views = (d.views || 0) + 1;
                save(STORE.discussions, discussions);

                const comments = d.comments || [];
                $('#commentThreadContent').innerHTML = `
                    <h3 style="font-family:var(--font-display);margin-bottom:12px;">${d.title}</h3>
                    <div class="idea-body" style="margin-bottom:8px;">${d.content}</div>
                    <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:16px;">${d.author} · ${d.time} · ${d.views} 浏览</div>
                    <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:12px;">${comments.length} 条回复</div>
                    ${comments.map(c => `
                        <div class="comment-item">
                            <div class="comment-author">${c.author}</div>
                            <div class="comment-text">${c.text}</div>
                            <div class="comment-time">${c.time}</div>
                        </div>
                    `).join('')}
                `;
                commentTargetId = d.id;
                // Override post comment for discussions
                $('#postComment').onclick = () => {
                    const text = $('#commentInput').value.trim();
                    if (!text) return;
                    if (!d.comments) d.comments = [];
                    d.comments.push({ author: user ? user.name : '匿名', text, time: '刚刚' });
                    save(STORE.discussions, discussions);
                    $('#commentInput').value = '';
                    renderDiscussions();
                    // Re-open
                    card.click();
                };
                $('#commentModal').classList.add('active');
            });
        });
    }

    $('#newDiscussionBtn').addEventListener('click', () => {
        $('#discussionForm').classList.toggle('hidden');
    });
    $('#cancelDiscussion').addEventListener('click', () => {
        $('#discussionForm').classList.add('hidden');
    });
    $('#submitDiscussion').addEventListener('click', () => {
        const title = $('#discTitle').value.trim();
        const content = $('#discContent').value.trim();
        if (!title || !content) return;
        discussions.unshift({
            id: uid(), title, content,
            author: user ? user.name : '匿名',
            comments: [], time: '刚刚', ts: Date.now(), views: 0
        });
        save(STORE.discussions, discussions);
        $('#discTitle').value = ''; $('#discContent').value = '';
        $('#discussionForm').classList.add('hidden');
        renderAll();
    });

    // ---- Projects ----
    function renderProjects() {
        const sorted = [...projects].sort((a, b) => (b.votes || 0) - (a.votes || 0));
        $('#projectsList').innerHTML = sorted.map(p => `
            <div class="project-card">
                <div class="project-name">${p.name}</div>
                ${p.url && p.url !== '#' ? `<a href="${p.url}" target="_blank" class="project-link">${p.url} →</a>` : ''}
                <div class="project-desc">${p.desc}</div>
                <div class="project-tech">${(p.tech || []).map(t => `<span>${t}</span>`).join('')}</div>
                <div class="project-footer">
                    <span class="project-author">by ${p.author}</span>
                    ${p.revenue ? `<span class="project-revenue">${p.revenue}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    $('#newProjectBtn').addEventListener('click', () => {
        $('#projectForm').classList.toggle('hidden');
    });
    $('#cancelProject').addEventListener('click', () => {
        $('#projectForm').classList.add('hidden');
    });
    $('#submitProject').addEventListener('click', () => {
        const name = $('#projName').value.trim();
        if (!name) return;
        projects.unshift({
            id: uid(), name,
            url: $('#projUrl').value.trim() || '#',
            desc: $('#projDesc').value.trim() || '暂无描述',
            tech: ($('#projTech').value.trim() || '').split(/[,，]/).map(t => t.trim()).filter(Boolean),
            revenue: $('#projRevenue').value.trim() || '',
            author: user ? user.name : '匿名',
            votes: 0
        });
        save(STORE.projects, projects);
        $('#projName').value = ''; $('#projUrl').value = ''; $('#projDesc').value = ''; $('#projTech').value = ''; $('#projRevenue').value = '';
        $('#projectForm').classList.add('hidden');
        renderAll();
    });

    // ---- Global Search ----
    $('#globalSearch').addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        if (!q) { renderAll(); return; }
        // Search ideas
        const matchedIdeas = ideas.filter(i => i.content.toLowerCase().includes(q) || (i.tags || []).some(t => t.toLowerCase().includes(q)));
        const matchedRes = resources.filter(r => r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q));
        // Show in current page context
        if (matchedIdeas.length) {
            navigateTo('ideas');
            const list = $('#ideasList');
            list.innerHTML = matchedIdeas.map(i => renderIdeaCard(i)).join('');
            attachIdeaActions(list);
        } else if (matchedRes.length) {
            navigateTo('resources');
            const catIcons = { tool: '🛠️', template: '📄', course: '🎓', book: '📚', community: '👥', api: '🔗' };
            $('#resourcesList').innerHTML = matchedRes.map(r => `
                <div class="resource-card">
                    <div class="resource-icon">${catIcons[r.category] || '📦'}</div>
                    <div class="resource-title">${r.title}</div>
                    <div class="resource-desc">${r.desc}</div>
                    <div class="resource-meta">
                        <span class="resource-cat">by ${r.addedBy}</span>
                        ${r.url && r.url !== '#' ? `<a href="${r.url}" target="_blank" class="resource-link">访问 →</a>` : ''}
                    </div>
                </div>
            `).join('');
        }
    });

    // ---- Render All ----
    function renderAll() {
        renderStats();
        renderHome();
        renderIdeas();
        renderResources();
        renderMembers();
        renderDiscussions();
        renderProjects();
    }

    // ---- Init ----
    updateUserUI();
    if (user) renderAll();

    // ========================================
    // AI Advisor
    // ========================================

    // AI tab switching
    document.querySelectorAll('[data-ai-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('[data-ai-tab]').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.ai-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('ai' + tab.dataset.aiTab.charAt(0).toUpperCase() + tab.dataset.aiTab.slice(1)).classList.add('active');
        });
    });

    // Chat message helpers
    function addChatMessage(container, role, text) {
        const div = document.createElement('div');
        div.className = `ai-msg ${role}`;
        div.innerHTML = `
            <div class="ai-msg-avatar">${role === 'user' ? '👤' : '🤖'}</div>
            <div class="ai-msg-bubble ${role === 'assistant' && !text ? 'thinking' : ''}">${text || '思考中...'}</div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        return div;
    }

    // Advisor chat
    async function sendAdvisorMessage(question) {
        const container = document.getElementById('advisorMessages');
        // Remove welcome if exists
        const welcome = container.querySelector('.ai-welcome');
        if (welcome) welcome.remove();

        addChatMessage(container, 'user', question);
        const thinkingMsg = addChatMessage(container, 'assistant', '');

        const result = await MimoAI.askAdvisor(question);
        const bubble = thinkingMsg.querySelector('.ai-msg-bubble');

        if (result.ok) {
            bubble.textContent = result.content;
            bubble.classList.remove('thinking');
        } else {
            bubble.textContent = '⚠️ ' + (result.error || '连接失败，请检查网络');
            bubble.classList.remove('thinking');
        }
    }

    document.getElementById('advisorSend').addEventListener('click', () => {
        const input = document.getElementById('advisorInput');
        const q = input.value.trim();
        if (!q) return;
        input.value = '';
        sendAdvisorMessage(q);
    });

    document.getElementById('advisorInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('advisorSend').click();
        }
    });

    // Quick questions
    document.querySelectorAll('.ai-quick-q').forEach(btn => {
        btn.addEventListener('click', () => sendAdvisorMessage(btn.dataset.q));
    });

    // Idea Evaluator
    document.getElementById('evalSubmit').addEventListener('click', async () => {
        const input = document.getElementById('ideaEvalInput');
        const idea = input.value.trim();
        if (!idea) return;

        const resultEl = document.getElementById('evalResult');
        resultEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">🔍 AI正在评估你的想法...</div>';
        resultEl.classList.add('active');

        const result = await MimoAI.evaluateIdea(idea);

        if (result.ok && result.evaluation) {
            const ev = result.evaluation;
            const scoreClass = (v) => v >= 7 ? 'high' : v >= 4 ? 'mid' : 'low';
            const totalClass = scoreClass(ev.total);

            resultEl.innerHTML = `
                <div class="eval-scores">
                    ${Object.entries(ev.scores || {}).map(([key, val]) => {
                        const labels = { solo: '一人可执行', revenue: '变现潜力', speed: '启动速度', scale: '可扩展性', moat: '护城河' };
                        return `<div class="eval-score-item"><span class="eval-score-val ${scoreClass(val)}">${val}</span><span class="eval-score-label">${labels[key] || key}</span></div>`;
                    }).join('')}
                </div>
                <div class="eval-total">
                    <span class="eval-total-score ${totalClass}">${ev.total}</span>
                    <span class="eval-total-label">综合评分 / 10</span>
                    <div class="eval-verdict">${ev.verdict || ''}</div>
                </div>
                ${ev.strengths?.length ? `<div class="eval-section strengths"><h4>✅ 优势</h4><ul>${ev.strengths.map(s => `<li>${s}</li>`).join('')}</ul></div>` : ''}
                ${ev.risks?.length ? `<div class="eval-section risks"><h4>⚠️ 风险</h4><ul>${ev.risks.map(r => `<li>${r}</li>`).join('')}</ul></div>` : ''}
                ${ev.suggestions?.length ? `<div class="eval-section suggestions"><h4>💡 建议</h4><ul>${ev.suggestions.map(s => `<li>${s}</li>`).join('')}</ul></div>` : ''}
                ${ev.similarLegends?.length ? `<div class="eval-section"><h4>🏆 类似成功人物</h4><div class="eval-legend-tags">${ev.similarLegends.map(l => `<span class="eval-legend-tag">${l}</span>`).join('')}</div></div>` : ''}
            `;
        } else if (result.ok) {
            // Non-JSON response, show raw
            resultEl.innerHTML = `<div class="daily-card">${result.content}</div>`;
        } else {
            resultEl.innerHTML = `<div style="text-align:center;padding:40px;color:var(--red);">⚠️ ${result.error || '评估失败'}</div>`;
        }
    });

    // Daily Recommendation
    document.getElementById('dailyGenerate').addEventListener('click', async () => {
        const container = document.getElementById('dailyContent');
        container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">🔥 AI正在生成今日推荐...</div>';

        const result = await MimoAI.getDailyRecommendation();
        if (result.ok) {
            container.innerHTML = `<div class="daily-card">${result.content}</div>`;
        } else {
            container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--red);">⚠️ ${result.error || '生成失败'}</div>`;
        }
    });

    // ========================================
    // Membership & Payments
    // ========================================

    // WeChat Pay modal
    window.showWeChatPay = function(tier) {
        const modal = document.getElementById('wechatPayModal');
        const title = document.getElementById('payTitle');
        const amount = document.getElementById('payAmount');

        if (tier === 'pro') {
            title.textContent = '💎 开通 Pro 会员';
            amount.innerHTML = '¥99<small>/年</small>';
        } else {
            title.textContent = '👑 开通创始会员';
            amount.innerHTML = '¥299<small>/永久</small>';
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    document.getElementById('closeWechatPay').addEventListener('click', () => {
        document.getElementById('wechatPayModal').classList.remove('active');
        document.body.style.overflow = '';
    });
    document.getElementById('wechatPayModal').addEventListener('click', (e) => {
        if (e.target.id === 'wechatPayModal') {
            document.getElementById('wechatPayModal').classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Email subscription
    document.getElementById('subscribeBtn').addEventListener('click', () => {
        const email = document.getElementById('subscribeEmail').value.trim();
        const resultEl = document.getElementById('subscribeResult');

        if (!email || !email.includes('@')) {
            resultEl.textContent = '❌ 请输入有效的邮箱地址';
            resultEl.style.color = 'var(--red)';
            return;
        }

        const subs = JSON.parse(localStorage.getItem('opc_subscribers') || '[]');
        if (subs.includes(email)) {
            resultEl.textContent = '✅ 已订阅过了';
            resultEl.style.color = 'var(--green)';
            return;
        }
        subs.push(email);
        localStorage.setItem('opc_subscribers', JSON.stringify(subs));

        resultEl.textContent = '✅ 订阅成功！每周五发送OPC周报';
        resultEl.style.color = 'var(--green)';
        document.getElementById('subscribeEmail').value = '';
    });

    // ========================================
    // Legends / Hall of Fame
    // ========================================

    function renderLegendsCards(filter = 'all') {
        const grid = document.getElementById('legendsGrid');
        if (!grid || typeof LEGENDS === 'undefined') return;

        const filtered = filter === 'all' ? LEGENDS : LEGENDS.filter(l => l.category.includes(filter));

        grid.innerHTML = filtered.map((legend, i) => `
            <div class="legend-card fade-in" data-id="${legend.id}" style="animation-delay:${i * 0.05}s">
                <div class="legend-card-header">
                    <div class="legend-avatar-wrap">${legend.avatar}</div>
                    <div class="legend-info">
                        <h3>${legend.nameZh || legend.name}</h3>
                        <span class="legend-role">${legend.roleZh || legend.role}</span>
                    </div>
                </div>
                <p class="legend-bio">${legend.bioZh || legend.bio}</p>
                <div class="legend-metrics">
                    ${(legend.metrics || []).slice(0, 3).map(m => `
                        <div class="legend-metric">
                            <span class="val">${m.value}</span>
                            <span class="lbl">${m.labelZh || m.label}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="legend-tags">
                    ${(legend.tags || []).map(t => `<span class="legend-tag">${t}</span>`).join('')}
                </div>
            </div>
        `).join('');

        requestAnimationFrame(() => {
            grid.querySelectorAll('.fade-in').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 50);
            });
        });

        grid.querySelectorAll('.legend-card').forEach(card => {
            card.addEventListener('click', () => openLegendModal(card.dataset.id));
        });
    }

    function openLegendModal(id) {
        const legend = LEGENDS.find(l => l.id === id);
        if (!legend) return;

        document.getElementById('legendModalContent').innerHTML = `
            <div class="lg-modal-header">
                <div class="lg-modal-avatar">${legend.avatar}</div>
                <div>
                    <h2 class="lg-modal-title">${legend.nameZh || legend.name}</h2>
                    <p class="lg-modal-role">${legend.roleZh || legend.role}</p>
                    <div class="lg-modal-links">
                        ${legend.website ? `<a href="${legend.website}" target="_blank">官网</a>` : ''}
                        ${legend.twitter ? `<a href="${legend.twitter}" target="_blank">Twitter/X</a>` : ''}
                    </div>
                </div>
            </div>
            <div class="lg-modal-metrics">
                ${(legend.metrics || []).map(m => `
                    <div class="lg-metric-box">
                        <span class="v">${m.value}</span>
                        <span class="l">${m.labelZh || m.label}</span>
                    </div>
                `).join('')}
            </div>
            <div class="lg-section">
                <h4>简介</h4>
                <p>${legend.bioZh || legend.bio}</p>
            </div>
            <div class="lg-quote">"${legend.quoteZh || legend.quote}"</div>
            <div class="lg-section">
                <h4>商业哲学</h4>
                <ul>${(legend.philosophyZh || legend.philosophy || []).map(p => `<li>${p}</li>`).join('')}</ul>
            </div>
            <div class="lg-section">
                <h4>核心洞察</h4>
                <p>${legend.keyInsightZh || legend.keyInsight}</p>
            </div>
            <div class="lg-section">
                <h4>商业模式</h4>
                <p>${legend.businessModelZh || legend.businessModel}</p>
            </div>
        `;
        document.getElementById('legendModalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLegendModal() {
        document.getElementById('legendModalOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    // Legend filter buttons
    document.getElementById('legendsFilterBar')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('#legendsFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderLegendsCards(e.target.dataset.filter);
        }
    });

    // Legend modal close
    document.getElementById('legendModalClose')?.addEventListener('click', closeLegendModal);
    document.getElementById('legendModalOverlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'legendModalOverlay') closeLegendModal();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLegendModal(); });

    // ========================================
    // SecondMe Integration
    // ========================================
    const smCfg = SecondMe.getConfig();

    // Update profile bar
    function updateSMProfile() {
        const cfg = SecondMe.getConfig();
        document.getElementById('smName').textContent = cfg.nickname;
    }

    // Tab switching
    document.querySelectorAll('.sm-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.sm-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.sm-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('sm' + capitalize(tab.dataset.tab)).classList.add('active');
        });
    });

    function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    // Settings
    document.getElementById('smSettingsBtn').addEventListener('click', () => {
        const panel = document.getElementById('smSettings');
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            document.getElementById('smTokenInput').value = SecondMe.getConfig().token;
            document.getElementById('smApiInput').value = SecondMe.getConfig().apiBase;
            document.getElementById('smProxyInput').value = SecondMe.getConfig().proxyUrl || '';
        }
    });

    document.getElementById('smCancelBtn').addEventListener('click', () => {
        document.getElementById('smSettings').classList.add('hidden');
    });

    document.getElementById('smSaveBtn').addEventListener('click', () => {
        const token = document.getElementById('smTokenInput').value.trim();
        const apiBase = document.getElementById('smApiInput').value.trim();
        const proxyUrl = document.getElementById('smProxyInput').value.trim();
        const updates = {};
        if (token) updates.token = token;
        if (apiBase) updates.apiBase = apiBase;
        updates.proxyUrl = proxyUrl;
        SecondMe.updateConfig(updates);
        localStorage.setItem('opc_sm_proxy', proxyUrl);
        document.getElementById('smSettings').classList.add('hidden');
        checkSMConnection();
    });

    // Check connection
    async function checkSMConnection() {
        const statusEl = document.getElementById('smStatus');
        statusEl.textContent = '连接中...';
        statusEl.className = 'sm-status';
        
        const result = await SecondMe.getFeed(1);
        if (result.ok && result.data && result.data.code === 0) {
            statusEl.textContent = '● 已连接';
            statusEl.className = 'sm-status connected';
            document.getElementById('secondmeLive').style.display = 'inline';
        } else if (result.ok && result.data && result.data.code === 401) {
            statusEl.textContent = '⚠ Token无效';
            statusEl.className = 'sm-status error';
        } else if (result.status === 0) {
            statusEl.textContent = '⚠ CORS限制';
            statusEl.className = 'sm-status error';
        } else {
            statusEl.textContent = `⚠ 错误 ${result.data?.code || result.status}`;
            statusEl.className = 'sm-status error';
        }
    }

    // Load feed
    let smFeedPage = 1;

    async function loadSMFeed(page = 1) {
        const list = document.getElementById('smFeedList');
        list.innerHTML = '<div class="sm-empty"><p class="loading">加载中...</p></div>';

        const result = await SecondMe.getFeed(page);
        
        if (result.error === 'CORS_BLOCKED' || result.status === 0) {
            // CORS error — show proxy instructions
            list.innerHTML = `
                <div class="sm-empty">
                    <p>⚠️ 浏览器跨域限制</p>
                    <div style="text-align:left;max-width:500px;margin:16px auto;font-size:0.82rem;color:var(--text-dim);line-height:1.7;">
                        <p style="margin-bottom:12px;"><strong>一键解决（2分钟）：</strong></p>
                        <ol style="padding-left:20px;">
                            <li>打开 <a href="https://dash.cloudflare.com" target="_blank" style="color:var(--accent-light);">dash.cloudflare.com</a></li>
                            <li>Workers & Pages → Create Worker</li>
                            <li>把 <code style="background:var(--bg-surface);padding:2px 6px;border-radius:4px;">worker.js</code> 代码粘贴进去</li>
                            <li>点 Deploy，复制 Worker URL</li>
                            <li>点下面 ⚙️ 配置，填入代理 URL</li>
                        </ol>
                        <p style="margin-top:12px;color:var(--text-muted);">或安装 <a href="https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino" target="_blank" style="color:var(--accent-light);">CORS Unblock</a> 浏览器扩展后刷新</p>
                    </div>
                    <button class="btn-outline" style="margin-top:8px;" onclick="document.getElementById('smSettingsBtn').click()">⚙️ 配置代理</button>
                </div>`;
            document.getElementById('smStatus').textContent = '⚠ CORS限制';
            document.getElementById('smStatus').className = 'sm-status error';
            return;
        }

        if (!result.ok || !result.data || result.data.code !== 0) {
            list.innerHTML = `
                <div class="sm-empty">
                    <p>❌ 连接失败</p>
                    <p style="font-size:0.82rem;color:var(--text-muted);">${result.data?.message || '未知错误'}</p>
                    <button class="btn-outline" style="margin-top:12px;" onclick="document.getElementById('smSettingsBtn').click()">⚙️ 检查配置</button>
                </div>`;
            return;
        }

        const feed = result.data.data;
        const items = feed?.list || feed?.records || feed || [];
        
        if (!items.length) {
            list.innerHTML = '<div class="sm-empty"><p>暂无动态</p></div>';
            return;
        }

        list.innerHTML = items.map(item => {
            const author = item.author?.name || item.userName || '匿名用户';
            const content = item.content || item.text || item.body || '';
            const time = item.createTime || item.createdAt || '';
            const likes = item.likeCount || item.likes || 0;
            const comments = item.commentCount || item.comments || 0;
            const postId = item.id || item.postId || '';
            return `
                <div class="sm-feed-item">
                    <div class="sm-feed-header">
                        <div class="sm-feed-avatar">${author.charAt(0)}</div>
                        <span class="sm-feed-author">${author}</span>
                        <span class="sm-feed-time">${formatSMTime(time)}</span>
                    </div>
                    <div class="sm-feed-body">${escapeHtml(content)}</div>
                    <div class="sm-feed-actions">
                        <button class="sm-feed-action" onclick="smLike('${postId}', this)">❤️ ${likes}</button>
                        <button class="sm-feed-action">💬 ${comments}</button>
                        <button class="sm-feed-action" onclick="smSyncToOPC('${escapeHtml(content).replace(/'/g, "\\'")}')">🔄 同步到OPC</button>
                    </div>
                </div>`;
        }).join('');

        document.getElementById('smStatus').textContent = '● 已连接';
        document.getElementById('smStatus').className = 'sm-status connected';
        document.getElementById('secondmeLive').style.display = 'inline';
    }

    // Load discover
    async function loadSMDiscover() {
        const list = document.getElementById('smDiscoverList');
        list.innerHTML = '<div class="sm-empty"><p class="loading">发现中...</p></div>';

        const result = await SecondMe.discoverUsers(1);
        
        if (result.status === 0) {
            list.innerHTML = '<div class="sm-empty"><p>⚠️ 浏览器跨域限制，请安装 CORS 扩展</p></div>';
            return;
        }

        if (!result.ok || !result.data || result.data.code !== 0) {
            list.innerHTML = `<div class="sm-empty"><p>❌ ${result.data?.message || '加载失败'}</p></div>`;
            return;
        }

        const users = result.data.data?.list || result.data.data?.records || result.data.data || [];
        list.innerHTML = users.map(u => {
            const name = u.name || u.nickname || u.userName || '用户';
            const bio = u.bio || u.description || u.introduction || '';
            return `
                <div class="sm-discover-item">
                    <div class="sm-feed-avatar">${name.charAt(0)}</div>
                    <div style="flex:1;">
                        <div class="sm-feed-author">${name}</div>
                        <div style="font-size:0.82rem;color:var(--text-muted);">${escapeHtml(bio).substring(0, 80)}</div>
                    </div>
                    ${u.homepage || u.route ? `<a href="https://second.me/${u.route || u.homepage}" target="_blank" class="btn-outline btn-sm">访问</a>` : ''}
                </div>`;
        }).join('');
    }

    // Post to SecondMe
    document.getElementById('smPostBtn').addEventListener('click', async () => {
        const content = document.getElementById('smPostInput').value.trim();
        const tagsStr = document.getElementById('smPostTags').value.trim();
        if (!content) return;

        const tags = tagsStr ? tagsStr.split(/[,，]/).map(t => t.trim()).filter(Boolean) : [];
        const resultEl = document.getElementById('smPostResult');
        resultEl.textContent = '发布中...';
        resultEl.className = 'sm-post-result';

        const result = await SecondMe.createPost(content, tags);
        
        if (result.ok && result.data && result.data.code === 0) {
            resultEl.textContent = '✅ 发布成功！';
            resultEl.className = 'sm-post-result success';
            document.getElementById('smPostInput').value = '';
            document.getElementById('smPostTags').value = '';
        } else {
            resultEl.textContent = `❌ ${result.data?.message || result.error || '发布失败'}`;
            resultEl.className = 'sm-post-result error';
        }
    });

    // Like post
    window.smLike = async function(postId, btn) {
        if (!postId) return;
        await SecondMe.likePost(postId);
        btn.style.color = 'var(--red)';
    };

    // Sync idea to OPC
    window.smSyncToOPC = function(content) {
        if (!content) return;
        document.getElementById('ideaInput').value = content;
        document.getElementById('ideaCategory').value = 'insight';
        navigateTo('ideas');
    };

    // Load buttons
    document.getElementById('smLoadFeed').addEventListener('click', () => loadSMFeed(1));
    document.getElementById('smLoadDiscover').addEventListener('click', loadSMDiscover);

    // Populate sync list with latest OPC ideas
    function renderSyncList() {
        const list = document.getElementById('smSyncList');
        const sorted = [...ideas].sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 5);
        list.innerHTML = sorted.map(idea => `
            <div class="sm-sync-item">
                <div class="idea-body">${idea.content.substring(0, 80)}...</div>
                <button class="btn-outline btn-sm" onclick="syncOPCToSM('${escapeHtml(idea.content).replace(/'/g, "\\'").replace(/\n/g, '\\n')}')">→ 发布</button>
            </div>
        `).join('');
    }

    window.syncOPCToSM = async function(content) {
        if (!content) return;
        const result = await SecondMe.createPost(content, ['OPC', '创业者联盟']);
        if (result.ok && result.data && result.data.code === 0) {
            alert('✅ 已同步到SecondMe广场！');
        } else {
            alert(`❌ ${result.data?.message || '同步失败'}`);
        }
    };

    // Helpers
    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function formatSMTime(ts) {
        if (!ts) return '';
        if (typeof ts === 'string' && ts.includes('-')) return ts;
        const d = new Date(typeof ts === 'number' ? ts : parseInt(ts));
        const diff = Date.now() - d.getTime();
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
        if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
        return Math.floor(diff / 86400000) + '天前';
    }

    // Init
    updateSMProfile();
    renderSyncList();
    checkSMConnection();

    // Init Legends on first load
    renderLegendsCards();

})();

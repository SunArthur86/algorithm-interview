/* ===== Algorithm Interview — 主逻辑 (v2.0 增强版) ===== */
/* safeLS 由 safe-ls.js 统一定义，此处直接引用 */

var App = (function() {
  var state = {
    activeCat: '全部',
    activeDiff: '全部',
    activeSort: 'default', // default | id-asc | id-desc | diff
    search: '',
    completed: JSON.parse(safeLS.getItem('ah-completed') || '[]'),
    starred: JSON.parse(safeLS.getItem('ah-starred') || '[]'),
    currentProblem: null,
    view: 'problems',
    showCompletedOnly: false,
    showStarredOnly: false
  };

  var CATEGORIES = ['全部','哈希','双指针','滑动窗口','子串','普通数组','矩阵','链表','二叉树','图论','回溯','二分查找','栈','堆','贪心算法','动态规划','多维动态规划','技巧'];
  var DIFFS = ['全部','Easy','Medium','Hard'];
  var SORTS = [
    {key:'default', label:'默认顺序'},
    {key:'id-asc', label:'题号 ↑'},
    {key:'id-desc', label:'题号 ↓'},
    {key:'diff', label:'难度排序'}
  ];
  var DIFF_ORDER = {Easy:0, Medium:1, Hard:2};

  function $(id) { return document.getElementById(id); }

  function init() {
    renderStats();
    renderDashboard();
    renderCategoryTabs();
    renderDiffTabs();
    renderSortTabs();
    renderProblemList();
    renderExtraProblems();
    bindSearch();
    bindViewSwitch();
    bindKeyboard();
    bindBackToTop();
    if (typeof Algorithm !== 'undefined' && Algorithm.init) Algorithm.init();
  }

  // === Keyboard Shortcuts ===
  function bindKeyboard() {
    document.addEventListener('keydown', function(e) {
      // Ignore when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch(e.key) {
        case '/':
          e.preventDefault();
          $('search-input').focus();
          break;
        case 'Escape':
          closeModal();
          closeVizModal();
          break;
        case 'ArrowLeft':
          if (state.currentProblem) { e.preventDefault(); navigateProblem(-1); }
          break;
        case 'ArrowRight':
          if (state.currentProblem) { e.preventDefault(); navigateProblem(1); }
          break;
        case 't':
        case 'T':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleTheme();
          }
          break;
      }
    });
  }

  // Close visualization modal
  function closeVizModal() {
    var vm = document.getElementById('viz-modal');
    if (vm && (vm.style.display !== 'none' || vm.classList.contains('show'))) {
      vm.classList.remove('show');
      vm.style.display = 'none';
      if (typeof VizEngine !== 'undefined') VizEngine.stop();
    }
  }

  // Navigate to prev/next problem from modal
  function navigateProblem(dir) {
    if (!state.currentProblem) return;
    var idx = PROBLEMS.findIndex(function(p) { return p.id === state.currentProblem; });
    if (idx < 0) return;
    var next = idx + dir;
    if (next < 0 || next >= PROBLEMS.length) return;
    openProblemDetail(PROBLEMS[next].id);
  }

  // === Back to Top ===
  function bindBackToTop() {
    var btn = $('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) btn.classList.add('show');
      else btn.classList.remove('show');
    });
    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === View Switch ===
  function bindViewSwitch() {
    document.querySelectorAll('.view-switch-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var view = btn.dataset.view;
        state.view = view;
        document.querySelectorAll('.view-switch-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        $('view-problems').style.display = view === 'problems' ? 'block' : 'none';
        $('view-visualizer').style.display = view === 'visualizer' ? 'block' : 'none';
        if (view === 'visualizer' && typeof Algorithm !== 'undefined' && Algorithm.onShow) {
          setTimeout(function() { Algorithm.onShow(); }, 100);
        }
      });
    });
  }

  // === Stats ===
  // === Dashboard: Category mastery + Daily recommendation ===
  function renderDashboard() {
    // Category mastery bars
    var catContainer = $('cat-progress');
    if (!catContainer) return;
    var catStats = {};
    PROBLEMS.forEach(function(p) {
      if (!catStats[p.cat]) catStats[p.cat] = { total: 0, done: 0 };
      catStats[p.cat].total++;
      if (state.completed.indexOf(p.id) >= 0) catStats[p.cat].done++;
    });
    var html = '';
    Object.keys(catStats).forEach(function(cat) {
      var s = catStats[cat];
      var pct = Math.round(s.done / s.total * 100);
      var barColor = pct === 100 ? 'var(--color-success)' : pct >= 50 ? 'var(--color-primary)' : 'var(--color-text-tertiary)';
      html += '<div class="cat-bar-item">' +
        '<div class="cat-bar-label"><span>' + cat + '</span><span class="cat-bar-count">' + s.done + '/' + s.total + '</span></div>' +
        '<div class="cat-bar-track"><div class="cat-bar-fill" style="width:' + pct + '%;background:' + barColor + '"></div></div>' +
      '</div>';
    });
    catContainer.innerHTML = html;

    // Daily recommendation: pick 3 unsolved problems based on date seed
    var recContainer = $('daily-rec');
    if (!recContainer) return;
    var unsolved = PROBLEMS.filter(function(p) { return state.completed.indexOf(p.id) < 0; });
    var pool = unsolved.length >= 3 ? unsolved : PROBLEMS;
    var dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    var picked = [];
    var seed = dayOfYear;
    function pseudoRandom() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var tempPool = pool.slice();
    while (picked.length < 3 && tempPool.length > 0) {
      var idx = Math.floor(pseudoRandom() * tempPool.length);
      picked.push(tempPool.splice(idx, 1)[0]);
    }
    var diffEmoji = { Easy: '🟢', Medium: '🟡', Hard: '🔴' };
    var recHtml = '';
    picked.forEach(function(p) {
      var hasSol = typeof SOLUTIONS !== 'undefined' && SOLUTIONS[p.id];
      recHtml += '<div class="rec-item" data-id="' + p.id + '">' +
        '<span class="rec-diff">' + (diffEmoji[p.diff] || '⚪') + '</span>' +
        '<span class="rec-title">#' + p.id + ' ' + p.title + '</span>' +
        (hasSol ? '<span class="rec-badge">📝</span>' : '') +
      '</div>';
    });
    recContainer.innerHTML = recHtml;
    // Bind click to open modal
    recContainer.querySelectorAll('.rec-item').forEach(function(el) {
      el.addEventListener('click', function() {
        openProblemDetail(el.dataset.id);
      });
    });
  }

  function renderStats() {
    var total = PROBLEMS.length;
    var done = state.completed.length;
    var pct = Math.round(done / total * 100);
    $('stat-total').textContent = total;
    $('stat-pct').textContent = pct + '%';

    // Progress ring
    var ring = $('progress-ring-fill');
    if (ring) {
      var circumference = 2 * Math.PI * 52;
      var offset = circumference - (pct / 100) * circumference;
      ring.style.strokeDashoffset = offset;
    }

    var easyDone = 0, medDone = 0, hardDone = 0;
    var easyTotal = 0, medTotal = 0, hardTotal = 0;
    PROBLEMS.forEach(function(p) {
      if (p.diff === 'Easy') easyTotal++;
      else if (p.diff === 'Medium') medTotal++;
      else hardTotal++;
      if (state.completed.indexOf(p.id) >= 0) {
        if (p.diff === 'Easy') easyDone++;
        else if (p.diff === 'Medium') medDone++;
        else hardDone++;
      }
    });
    $('stat-easy').textContent = easyDone + '/' + easyTotal;
    $('stat-medium').textContent = medDone + '/' + medTotal;
    $('stat-hard').textContent = hardDone + '/' + hardTotal;

    // Streak
    renderStreak();
  }

  // === Streak Counter ===
  function renderStreak() {
    var today = new Date().toDateString();
    var lastActive = safeLS.getItem('ah-last-active');
    var streak = parseInt(safeLS.getItem('ah-streak') || '0', 10);

    if (lastActive !== today && state.completed.length > 0) {
      var yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastActive === yesterday) {
        streak++;
      } else if (lastActive !== today) {
        streak = 1;
      }
      safeLS.setItem('ah-streak', String(streak));
      safeLS.setItem('ah-last-active', today);
    }

    var streakEl = $('stat-streak');
    if (streakEl) streakEl.textContent = streak;
  }

  // === Category Tabs ===
  function renderCategoryTabs() {
    var container = $('category-tabs');
    container.innerHTML = '';
    CATEGORIES.forEach(function(cat) {
      var count = cat === '全部' ? PROBLEMS.length : PROBLEMS.filter(function(p) { return p.cat === cat; }).length;
      if (cat !== '全部' && count === 0) return;
      var btn = document.createElement('button');
      btn.className = 'cat-tab' + (cat === state.activeCat ? ' active' : '');
      btn.innerHTML = cat + ' <span class="cat-count">' + count + '</span>';
      btn.addEventListener('click', function() {
        state.activeCat = cat;
        document.querySelectorAll('.cat-tab').forEach(function(t) { t.classList.remove('active'); });
        btn.classList.add('active');
        renderProblemList();
      });
      container.appendChild(btn);
    });
  }

  // === Difficulty Tabs ===
  function renderDiffTabs() {
    var container = $('diff-tabs');
    container.innerHTML = '';
    DIFFS.forEach(function(diff) {
      var btn = document.createElement('button');
      btn.className = 'diff-tab' + (diff === state.activeDiff ? ' active' : '');
      if (diff !== '全部') btn.classList.add('diff-' + diff.toLowerCase());
      btn.textContent = diff;
      btn.addEventListener('click', function() {
        state.activeDiff = diff;
        document.querySelectorAll('.diff-tab').forEach(function(t) { t.classList.remove('active'); });
        btn.classList.add('active');
        renderProblemList();
      });
      container.appendChild(btn);
    });
  }

  // === Sort Tabs ===
  function renderSortTabs() {
    var container = $('sort-tabs');
    if (!container) return;
    container.innerHTML = '';
    SORTS.forEach(function(s) {
      var btn = document.createElement('button');
      btn.className = 'sort-tab' + (s.key === state.activeSort ? ' active' : '');
      btn.textContent = s.label;
      btn.addEventListener('click', function() {
        state.activeSort = s.key;
        document.querySelectorAll('.sort-tab').forEach(function(t) { t.classList.remove('active'); });
        btn.classList.add('active');
        renderProblemList();
      });
      container.appendChild(btn);
    });
  }

  // === Search ===
  function bindSearch() {
    var input = $('search-input');
    var timer;
    input.addEventListener('input', function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        state.search = input.value.trim().toLowerCase();
        renderProblemList();
      }, 200);
    });
  }

  // === Filter + Sort ===
  function getFiltered() {
    var list = PROBLEMS.filter(function(p) {
      if (state.activeCat !== '全部' && p.cat !== state.activeCat) return false;
      if (state.activeDiff !== '全部' && p.diff !== state.activeDiff) return false;
      if (state.showCompletedOnly && state.completed.indexOf(p.id) < 0) return false;
      if (state.showStarredOnly && state.starred.indexOf(p.id) < 0) return false;
      if (state.search) {
        var q = state.search;
        var matchTitle = p.title.toLowerCase().indexOf(q) >= 0;
        var matchId = p.id === q || p.id.indexOf(q) === 0;
        var matchSlug = p.slug.toLowerCase().indexOf(q) >= 0;
        var matchTags = p.tags.some(function(t) { return t.toLowerCase().indexOf(q) >= 0; });
        if (!matchTitle && !matchId && !matchSlug && !matchTags) return false;
      }
      return true;
    });

    // Sort
    switch(state.activeSort) {
      case 'id-asc':
        list.sort(function(a, b) { return parseInt(a.id) - parseInt(b.id); });
        break;
      case 'id-desc':
        list.sort(function(a, b) { return parseInt(b.id) - parseInt(a.id); });
        break;
      case 'diff':
        list.sort(function(a, b) {
          var d = DIFF_ORDER[a.diff] - DIFF_ORDER[b.diff];
          return d !== 0 ? d : parseInt(a.id) - parseInt(b.id);
        });
        break;
    }
    return list;
  }

  // === Render Problem List ===
  function renderProblemList() {
    var container = $('problem-list');
    var list = getFiltered();
    container.innerHTML = '';

    // Update filter toggles (before early return so empty state doesn't break toggles)
    updateFilterToggles();

    if (list.length === 0) {
      container.innerHTML = '<div class="empty-state">🔍 没有找到匹配的题目<br><span>试试其他关键词或分类</span></div>';
      return;
    }

    list.forEach(function(p, idx) {
      var card = document.createElement('div');
      card.className = 'problem-card';
      card.style.animationDelay = Math.min(idx * 15, 400) + 'ms';

      var isDone = state.completed.indexOf(p.id) >= 0;
      var isStarred = state.starred.indexOf(p.id) >= 0;
      var diffClass = 'diff-badge-' + p.diff.toLowerCase();
      var hasSolution = typeof SOLUTIONS !== 'undefined' && SOLUTIONS[p.id];

      card.innerHTML =
        '<div class="problem-card-left">' +
          '<button class="check-btn' + (isDone ? ' checked' : '') + '" data-id="' + p.id + '" title="标记完成">' +
            (isDone ? '✓' : '○') +
          '</button>' +
          '<span class="problem-num">#' + p.id + '</span>' +
          '<div class="problem-info">' +
            '<a href="' + p.url + '" target="_blank" class="problem-title">' + highlightSearch(p.title) + '</a>' +
            '<div class="problem-tags">' +
              '<span class="problem-cat">' + p.cat + '</span>' +
              p.tags.slice(0, 3).map(function(t) { return '<span class="tag">' + t + '</span>'; }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="problem-card-right">' +
          (hasSolution ? '<button class="sol-btn" data-id="' + p.id + '" title="查看题解">📝</button>' : '') +
          '<span class="diff-badge ' + diffClass + '">' + p.diff + '</span>' +
          '<button class="star-btn' + (isStarred ? ' starred' : '') + '" data-id="' + p.id + '" title="收藏">' +
            (isStarred ? '★' : '☆') +
          '</button>' +
        '</div>';

      // Click card to open detail (always available, even without solution)
      card.style.cursor = 'pointer';
      card.addEventListener('click', function(e) {
        openProblemDetail(p.id);
      });

      if (hasSolution) {
        card.querySelector('.sol-btn').addEventListener('click', function(e) {
          e.stopPropagation();
          openProblemDetail(p.id);
        });
        // Title link also opens detail
        var titleLink = card.querySelector('.problem-title');
        if (titleLink) {
          titleLink.addEventListener('click', function(e) {
            e.preventDefault();
            openProblemDetail(p.id);
          });
        }
      }

      card.querySelector('.check-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        toggleComplete(p.id);
      });
      card.querySelector('.star-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        toggleStar(p.id);
      });

      container.appendChild(card);
    });
  }

  // === Bonus / Extra Problems (outside LeetCode Hot 100) ===
  // Always rendered below the main list so learners can extend their practice.
  function renderExtraProblems() {
    var section = $('extra-section');
    var list = $('extra-list');
    var countEl = $('extra-count');
    if (!section || !list) return;
    var extras = (typeof EXTRA_SOLUTIONS !== 'undefined') ? EXTRA_SOLUTIONS : {};
    var keys = Object.keys(extras);
    if (keys.length === 0) { section.style.display = 'none'; return; }

    section.style.display = 'block';
    if (countEl) countEl.textContent = keys.length + ' 题';

    list.innerHTML = '';
    keys.forEach(function(id, idx) {
      var e = extras[id];
      var card = document.createElement('div');
      card.className = 'problem-card extra-card';
      card.style.animationDelay = Math.min(idx * 15, 300) + 'ms';
      card.innerHTML =
        '<div class="problem-card-left">' +
          '<span class="problem-num">#' + id + '</span>' +
          '<div class="problem-info">' +
            '<a href="' + (e.url || '#') + '" target="_blank" class="problem-title">' + e.title + '</a>' +
            '<div class="problem-tags">' +
              '<span class="problem-cat">' + e.cat + '</span>' +
              '<span class="tag tag-extra">🎁 扩展</span>' +
              (e.tags || []).slice(0, 3).map(function(t) { return '<span class="tag">' + t + '</span>'; }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="problem-card-right">' +
          '<button class="sol-btn" data-id="' + id + '" title="查看题解">📝</button>' +
          '<span class="diff-badge diff-badge-' + (e.diff || 'medium').toLowerCase() + '">' + e.diff + '</span>' +
        '</div>';

      card.style.cursor = 'pointer';
      card.addEventListener('click', function() { openProblemDetail(id); });
      var solBtn = card.querySelector('.sol-btn');
      if (solBtn) solBtn.addEventListener('click', function(ev) { ev.stopPropagation(); openProblemDetail(id); });
      var link = card.querySelector('.problem-title');
      if (link) link.addEventListener('click', function(ev) { ev.preventDefault(); openProblemDetail(id); });
      list.appendChild(card);
    });
  }

  function highlightSearch(text) {
    if (!state.search) return text;
    try {
      var re = new RegExp('(' + state.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      return text.replace(re, '<mark>$1</mark>');
    } catch(e) { return text; }
  }

  function updateFilterToggles() {
    var compBtn = $('toggle-completed');
    var starBtn = $('toggle-starred');
    if (compBtn) compBtn.classList.toggle('active', state.showCompletedOnly);
    if (starBtn) starBtn.classList.toggle('active', state.showStarredOnly);
  }

  // === Problem Detail Modal ===
  // Resolve a problem by id across main list + bonus extra solutions.
  // Returns {id,title,diff,cat,tags,url, fromExtra} or null.
  function resolveProblem(id) {
    var p = PROBLEMS.find(function(x) { return x.id === id; });
    if (p) {
      return { id: p.id, title: p.title, diff: p.diff, cat: p.cat, tags: p.tags, url: p.url, fromExtra: false };
    }
    if (typeof EXTRA_SOLUTIONS !== 'undefined' && EXTRA_SOLUTIONS[id]) {
      var e = EXTRA_SOLUTIONS[id];
      return { id: e.id || id, title: e.title, diff: e.diff, cat: e.cat, tags: e.tags, url: e.url, fromExtra: true };
    }
    return null;
  }

  function openProblemDetail(id) {
    var p = resolveProblem(id);
    if (!p) return;
    state.currentProblem = id;
    var sol = (typeof SOLUTIONS !== 'undefined' && SOLUTIONS[id]) ? SOLUTIONS[id]
            : (typeof EXTRA_SOLUTIONS !== 'undefined' && EXTRA_SOLUTIONS[id]) ? EXTRA_SOLUTIONS[id]
            : null;
    var isDone = state.completed.indexOf(p.id) >= 0;
    var isStarred = state.starred.indexOf(p.id) >= 0;

    var modal = $('problem-modal');
    var content = $('modal-content');

    var html = '';
    // Header
    html += '<div class="modal-header">';
    html += '  <div class="modal-header-left">';
    html += '    <span class="modal-id">#' + p.id + '</span>';
    html += '    <h2 class="modal-title">' + p.title + '</h2>';
    html += '    <div class="modal-tags">';
    html += '      <span class="diff-badge diff-badge-' + p.diff.toLowerCase() + '">' + p.diff + '</span>';
    html += '      <span class="problem-cat">' + p.cat + '</span>';
    if (p.fromExtra) {
      html += '      <span class="tag tag-extra">🎁 扩展练习</span>';
    }
    html += '      ' + p.tags.map(function(t) { return '<span class="tag">' + t + '</span>'; }).join('');
    html += '    </div>';
    html += '  </div>';
    html += '  <button class="modal-close" onclick="App.closeModal()">✕</button>';
    html += '  <button class="modal-nav modal-nav-prev" onclick="App.navigateProblem(-1)" title="上一题 (←)">‹</button>';
    html += '  <button class="modal-nav modal-nav-next" onclick="App.navigateProblem(1)" title="下一题 (→)">›</button>';
    html += '</div>';

    // Animation button
    html += '<div style="margin-bottom:16px;">';
    html += '  <button class="viz-btn" onclick="App.openViz(\'' + p.id + '\', \'' + p.title.replace(/'/g, "\\'") + '\')">🎬 动画演示</button>';
    html += '</div>';

    if (sol) {
      // Thinking
      if (sol.thinking) {
        html += '<div class="sol-section">';
        html += '  <div class="sol-section-title">💡 解题思路</div>';
        html += '  <div class="sol-thinking">' + sol.thinking + '</div>';
        html += '</div>';
      }

      // Static diagram (inline SVG, self-contained — works offline)
      if (typeof Diagrams !== 'undefined' && Diagrams.get(id)) {
        html += '<div class="sol-section sol-diagram">';
        html += '  <div class="sol-section-title">🖼 图解示意</div>';
        html += '  <div class="diagram-wrap">' + Diagrams.get(id) + '</div>';
        html += '</div>';
      }

      // Multiple approaches
      if (sol.approaches && sol.approaches.length > 0) {
        var approaches = sol.approaches;
        // Approach tabs
        if (approaches.length > 1) {
          html += '<div class="approach-tabs">';
          approaches.forEach(function(a, idx) {
            html += '<button class="approach-tab' + (idx === 0 ? ' active' : '') + '" onclick="App.switchApproach(' + idx + ')">' + a.name + '</button>';
          });
          html += '</div>';
        }
        // Approach panels
        approaches.forEach(function(a, idx) {
          var hidden = idx !== 0 ? ' style="display:none"' : '';
          html += '<div class="approach-panel" id="approach-' + idx + '"' + hidden + '>';
          // Approach name + description
          html += '<div class="sol-section">';
          html += '  <div class="sol-approach-name">📌 ' + a.name + '</div>';
          html += '  <div class="sol-approach-desc">' + a.desc + '</div>';
          html += '</div>';
          // Complexity
          if (a.complexity) {
            html += '<div class="sol-complexity-row">';
            html += '  <div class="sol-complexity-item">⏱ 时间复杂度 <strong>' + a.complexity.time + '</strong></div>';
            html += '  <div class="sol-complexity-item">📦 空间复杂度 <strong>' + a.complexity.space + '</strong></div>';
            html += '</div>';
          }
          // Steps
          if (a.steps && a.steps.length > 0) {
            html += '<div class="sol-section">';
            html += '  <div class="sol-section-title">📋 执行步骤</div>';
            html += '  <ol class="sol-steps">';
            a.steps.forEach(function(s) { html += '<li>' + s + '</li>'; });
            html += '  </ol>';
            html += '</div>';
          }
          // Java code
          if (a.code) {
            html += '<div class="sol-section">';
            html += '  <div class="sol-section-title">💻 Java 代码 <button class="copy-code-btn" onclick="App.copyCode(' + idx + ')">📋 复制</button></div>';
            html += '  <pre class="sol-code active" id="sol-code-' + idx + '"><code>' + highlightJava(a.code) + '</code></pre>';
            html += '</div>';
          }
          // Key points
          if (a.keyPoints && a.keyPoints.length > 0) {
            html += '<div class="sol-section">';
            html += '  <div class="sol-section-title">🎯 关键点</div>';
            html += '  <ul class="sol-keypoints">';
            a.keyPoints.forEach(function(kp) { html += '<li>' + kp + '</li>'; });
            html += '  </ul>';
            html += '</div>';
          }
          html += '</div>';
        });
      }

      // Pitfalls
      if (sol.pitfalls && sol.pitfalls.length > 0) {
        html += '<div class="sol-section sol-pitfalls-section">';
        html += '  <div class="sol-section-title">⚠️ 常见陷阱</div>';
        html += '  <ul class="sol-pitfalls">';
        sol.pitfalls.forEach(function(p) { html += '<li>' + p + '</li>'; });
        html += '  </ul>';
        html += '</div>';
      }
    } else {
      html += '<div class="sol-section"><div class="sol-no-solution">📝 题解正在编写中...</div></div>';
    }

    // Interactive section: quiz + demo link
    if (sol) {
      html += '<div class="sol-section interactive-section">';
      html += '  <div class="sol-section-title">🎮 互动学习</div>';
      
      // Quiz
      var quiz = getQuiz(p.id, p.cat);
      if (quiz) {
        html += '  <div class="quiz-box" id="quiz-box">';
        html += '    <div class="quiz-question">❓ ' + quiz.question + '</div>';
        html += '    <div class="quiz-options">';
        quiz.options.forEach(function(opt, i) {
          html += '<button class="quiz-option" onclick="App.answerQuiz(' + i + ', ' + quiz.answer + ')">' + String.fromCharCode(65+i) + '. ' + opt + '</button>';
        });
        html += '    </div>';
        html += '    <div class="quiz-feedback" id="quiz-feedback"></div>';
        html += '  </div>';
      }
      
      // Demo link
      var demo = getDemoLink(p.cat);
      if (demo) {
        html += '  <button class="demo-link-btn" onclick="App.openDemo(\'' + demo + '\')">';
        html += '    🎬 打开动画演示: ' + demo;
        html += '  </button>';
      }
      
      html += '</div>';
    }

    // Actions
    html += '<div class="modal-actions">';
    html += '  <button class="modal-btn' + (isDone ? ' done' : '') + '" onclick="App.toggleFromModal(\'' + p.id + '\', \'complete\')">';
    html += '    ' + (isDone ? '✅ 已完成' : '○ 标记完成');
    html += '  </button>';
    html += '  <button class="modal-btn' + (isStarred ? ' starred' : '') + '" onclick="App.toggleFromModal(\'' + p.id + '\', \'star\')">';
    html += '    ' + (isStarred ? '★ 已收藏' : '☆ 收藏');
    html += '  </button>';
    html += '  <a class="modal-btn leetcode-link" href="' + p.url + '" target="_blank">🔗 在 LeetCode 打开 →</a>';
    html += '</div>';

    content.innerHTML = html;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    var modal = $('problem-modal');
    if (modal) modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  function openViz(problemId, title) {
    var vizModal = document.getElementById('viz-modal');
    var vizTitle = document.getElementById('viz-title');
    if (vizTitle) vizTitle.textContent = '🎬 ' + title;
    if (vizModal) {
      vizModal.style.display = 'flex';
      vizModal.classList.add('show');
    }
    // Resize canvas to match container
    var canvas = document.getElementById('viz-canvas');
    if (canvas) {
      var container = canvas.parentElement;
      canvas.width = Math.min(800, container.offsetWidth - 20);
      canvas.height = 380;
    }
    if (typeof VizEngine !== 'undefined') {
      if (!VizEngine._initialized) {
        VizEngine.init();
        VizEngine._initialized = true;
      }
      var has = VizEngine.load(problemId);
      if (!has) {
        var msgEl = document.getElementById('viz-message');
        if (msgEl) msgEl.textContent = '此题暂无动画数据';
      }
    }
  }

  function toggleFromModal(id, type) {
    if (type === 'complete') toggleComplete(id);
    else if (type === 'star') toggleStar(id);
    // Re-render modal content
    openProblemDetail(id);
  }

  // ===== Interactive: Quiz =====
  function getQuiz(id, cat) {
    var quizzes = {
      '1': { question: '两数之和使用哈希表的时间复杂度是？', options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(1)'], answer: 1 },
      '49': { question: '字母异位词分组中，排序后字符串的作用是？', options: ['去重', '排序输出', '作为哈希键', '压缩存储'], answer: 2 },
      '15': { question: '三数之和中，固定第一个数后用什么方法找另外两个数？', options: ['哈希表', '双指针', '二分查找', '暴力枚举'], answer: 1 },
      '42': { question: '接雨水的双指针解法中，每次移动哪一边？', options: ['较高的一边', '较低的一边', '随机一边', '同时移动两边'], answer: 1 },
      '3': { question: '无重复字符的最长子串使用什么算法？', options: ['动态规划', '贪心', '滑动窗口', '回溯'], answer: 2 },
      '206': { question: '反转链表迭代法需要几个指针？', options: ['1个', '2个', '3个(prev/curr/next)', '4个'], answer: 2 },
      '121': { question: '买卖股票最佳时机维护哪个变量？', options: ['最大值', '最小值', '平均值', '中位数'], answer: 1 },
      '70': { question: '爬楼梯的状态转移方程是？', options: ['f(n)=f(n-1)+1', 'f(n)=f(n-1)+f(n-2)', 'f(n)=2*f(n-1)', 'f(n)=n*f(n-1)'], answer: 1 },
      '198': { question: '打家劫舍中，对于第i家可以选择？', options: ['必须偷', '偷或不偷取最优', '不能偷', '偷两家'], answer: 1 },
      '200': { question: '岛屿数量用什么方法标记已访问？', options: ['额外数组', '修改原网格为0', '集合记录', '以上都可以'], answer: 3 },
      '20': { question: '有效的括号使用什么数据结构？', options: ['队列', '栈', '哈希表', '堆'], answer: 1 },
      '215': { question: '找第K大元素，用小顶堆的时间复杂度？', options: ['O(n)', 'O(n log k)', 'O(n²)', 'O(k log n)'], answer: 1 },
      '136': { question: '只出现一次的数字用什么位运算？', options: ['AND', 'OR', 'XOR', 'NOT'], answer: 2 },
      '53': { question: 'Kadane算法的核心：当前和为负时？', options: ['继续累加', '重置为当前元素', '返回0', '取绝对值'], answer: 1 },
      '46': { question: '全排列的回溯需要什么辅助数组？', options: ['排序数组', 'visited标记数组', '前缀和数组', '不需要'], answer: 1 }
    };
    if (quizzes[id]) return quizzes[id];
    // Category-based generic quiz
    var catQuizzes = {
      '动态规划': { question: '动态规划的核心思想是？', options: ['分治', '状态转移+记忆化', '贪心选择', '回溯搜索'], answer: 1 },
      '二叉树': { question: '二叉树的中序遍历顺序是？', options: ['根→左→右', '左→根→右', '左→右→根', '右→左→根'], answer: 1 },
      '链表': { question: '链表操作中常用的技巧是？', options: ['二分查找', 'dummy头节点+双指针', '动态规划', '排序'], answer: 1 },
      '双指针': { question: '双指针法通常能将O(n²)优化到？', options: ['O(n)', 'O(n log n)', 'O(1)', 'O(n²)不变'], answer: 0 },
      '二分查找': { question: '二分查找的前提条件是？', options: ['数组无序', '数组有序', '数组长度为偶数', '元素唯一'], answer: 1 },
      '栈': { question: '栈的特点是？', options: ['先进先出', '后进先出(LIFO)', '随机访问', '双端操作'], answer: 1 },
      '回溯': { question: '回溯法的核心操作是？', options: ['排序', '选择→递归→撤销', '动态规划', '贪心'], answer: 1 }
    };
    return catQuizzes[cat] || null;
  }

  function answerQuiz(selected, correct) {
    var feedback = $('quiz-feedback');
    var options = document.querySelectorAll('.quiz-option');
    options.forEach(function(opt) { opt.disabled = true; });
    if (selected === correct) {
      if (feedback) {
        feedback.innerHTML = '✅ 正确！干得漂亮！';
        feedback.className = 'quiz-feedback correct';
      }
      options[selected].classList.add('quiz-correct');
    } else {
      if (feedback) {
        feedback.innerHTML = '❌ 不对。正确答案是 ' + String.fromCharCode(65+correct);
        feedback.className = 'quiz-feedback wrong';
      }
      options[selected].classList.add('quiz-wrong');
      options[correct].classList.add('quiz-correct');
    }
  }

  // ===== Demo Link =====
  function getDemoLink(cat) {
    var demoMap = {
      '双指针': 'two-pointer',
      '滑动窗口': 'sliding-window',
      '链表': 'll-reverse',
      '二叉树': 'tree-traverse',
      '动态规划': 'dp-knapsack',
      '多维动态规划': 'dp-lcs',
      '贪心算法': 'two-pointer',
      '堆': 'dp-knapsack',
      '子串': 'sliding-window',
      '普通数组': 'two-pointer',
      '哈希': 'two-pointer',
      '技巧': 'two-pointer'
    };
    return demoMap[cat] || null;
  }

  function openDemo(algoKey) {
    closeModal();
    // Switch to visualizer view
    var vizBtn = document.querySelector('[data-view="visualizer"]');
    if (vizBtn) vizBtn.click();
    setTimeout(function() {
      var btn = document.querySelector('[data-algo="' + algoKey + '"]');
      if (btn) btn.click();
      setTimeout(function() {
        var playBtn = document.getElementById('btn-algo-play');
        if (playBtn) playBtn.click();
      }, 200);
    }, 300);
  }

  function copyCode(idx) {
    var codeEl = (typeof idx === 'number') ? $('sol-code-' + idx) : document.querySelector('.sol-code.active');
    if (!codeEl) codeEl = document.querySelector('.sol-code');
    if (!codeEl) return;
    var text = codeEl.textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() {
        showToast('📋 Java 代码已复制！');
      });
    } else {
      showToast('📋 请手动复制');
    }
  }

  function switchApproach(idx) {
    // Hide all panels
    document.querySelectorAll('.approach-panel').forEach(function(p) {
      p.style.display = 'none';
    });
    // Show selected
    var panel = $('approach-' + idx);
    if (panel) panel.style.display = '';
    // Update tabs
    document.querySelectorAll('.approach-tab').forEach(function(t, i) {
      t.classList.toggle('active', i === idx);
    });
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // === Java Syntax Highlighting (lightweight) ===
  var JAVA_KEYWORDS = ['abstract','assert','boolean','break','byte','case','catch','char','class','const','continue','default','do','double','else','enum','extends','final','finally','float','for','goto','if','implements','import','instanceof','int','interface','long','native','new','package','private','protected','public','return','short','static','strictfp','super','switch','synchronized','this','throw','throws','transient','try','void','volatile','while','var','String','List','Map','Set','ArrayList','HashMap','HashSet','LinkedList','Queue','Deque','ArrayDeque','PriorityQueue','Stack','TreeNode','ListNode','Integer','Character','Boolean','Long','Double','Object'];
  var JAVA_KW_RE = new RegExp('\\b(' + JAVA_KEYWORDS.join('|') + ')\\b', 'g');

  function highlightJava(code) {
    // First escape HTML
    var html = esc(code);
    // Protect strings and comments with placeholders
    var placeholders = [];
    // Comments: // and /* */
    html = html.replace(/(\/\*[\s\S]*?\*\/|\/\/[^\n]*)/g, function(m) {
      var i = placeholders.length;
      placeholders.push('<span class="java-comment">' + m + '</span>');
      return '\x00C' + i + '\x00';
    });
    // Strings
    html = html.replace(/("(?:[^"\\]|\\.)*")/g, function(m) {
      var i = placeholders.length;
      placeholders.push('<span class="java-string">' + m + '</span>');
      return '\x00S' + i + '\x00';
    });
    // Annotations: @Override, @SuppressWarnings
    html = html.replace(/(@[A-Za-z_][A-Za-z0-9_]*)/g, '<span class="java-annotation">$1</span>');
    // Keywords
    html = html.replace(JAVA_KW_RE, '<span class="java-keyword">$1</span>');
    // Numbers
    html = html.replace(/\b(\d+\.?\d*[fFlLdD]?)\b/g, '<span class="java-number">$1</span>');
    // Restore placeholders
    html = html.replace(/\x00([CS])(\d+)\x00/g, function(m, type, idx) {
      return placeholders[parseInt(idx)];
    });
    return html;
  }

  // === Toggle Complete ===
  function toggleComplete(id) {
    var idx = state.completed.indexOf(id);
    if (idx >= 0) {
      state.completed.splice(idx, 1);
    } else {
      state.completed.push(id);
      var p = PROBLEMS.find(function(x) { return x.id === id; });
      var done = state.completed.length;
      var total = PROBLEMS.length;
      showToast('🎉 完成第 ' + id + ' 题！进度 ' + done + '/' + total);
      if (done === total) {
        setTimeout(function() { showToast('🏆 恭喜刷完 Hot 100！'); }, 2500);
      }
    }
    safeLS.setItem('ah-completed', JSON.stringify(state.completed));
    renderStats();
    renderDashboard();
    renderProblemList();
  }

  // === Toggle Star ===
  function toggleStar(id) {
    var idx = state.starred.indexOf(id);
    if (idx >= 0) {
      state.starred.splice(idx, 1);
    } else {
      state.starred.push(id);
    }
    safeLS.setItem('ah-starred', JSON.stringify(state.starred));
    renderProblemList();
  }

  // === Filter Toggles ===
  function toggleCompletedOnly() {
    state.showCompletedOnly = !state.showCompletedOnly;
    renderProblemList();
  }
  function toggleStarredOnly() {
    state.showStarredOnly = !state.showStarredOnly;
    renderProblemList();
  }

  // === Toast ===
  function showToast(msg) {
    var toast = $('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(function() {
      toast.classList.remove('show');
    }, 2500);
  }

  // === Theme Toggle ===
  function toggleTheme() {
    var html = document.documentElement;
    var current = html.getAttribute('data-theme');
    var newTheme = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    safeLS.setItem('ah-theme', newTheme);
    var btn = $('theme-toggle');
    if (btn) btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  }

  function loadTheme() {
    var saved = safeLS.getItem('ah-theme');
    if (!saved) {
      saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', saved);
    var btn = $('theme-toggle');
    if (btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';
  }

  return {
    init: init,
    toggleTheme: toggleTheme,
    loadTheme: loadTheme,
    showToast: showToast,
    closeModal: closeModal,
    openViz: openViz,
    closeVizModal: closeVizModal,
    navigateProblem: navigateProblem,
    toggleFromModal: toggleFromModal,
    copyCode: copyCode,
    switchApproach: switchApproach,
    answerQuiz: answerQuiz,
    openDemo: openDemo,
    toggleCompletedOnly: toggleCompletedOnly,
    toggleStarredOnly: toggleStarredOnly
  };
})();

document.addEventListener('DOMContentLoaded', function() {
  App.loadTheme();
  App.init();
  document.getElementById('theme-toggle').addEventListener('click', App.toggleTheme);
  // Click outside modal to close
  var modal = document.getElementById('problem-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) App.closeModal();
    });
  }
});

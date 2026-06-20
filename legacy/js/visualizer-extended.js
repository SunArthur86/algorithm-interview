/* ===== 扩展算法动画: DP / 链表 / 二叉树 / 双指针 / 滑动窗口 ===== */
/* 由 Algorithm 模块在 init 后调用 AlgorithmExtended.init() */

var AlgorithmExtended = (function() {
  var canvas, ctx;
  var running = false;
  var speed = 5;
  var stopFlag = false;
  var stepMode = false;
  var stepResolve = null;

  var EXT_ALGOS = {
    'dp-knapsack': { name: '0-1背包', cat: '动态规划' },
    'dp-lcs': { name: '最长公共子序列', cat: '动态规划' },
    'dp-climb': { name: '爬楼梯', cat: '动态规划' },
    'll-reverse': { name: '链表反转', cat: '链表' },
    'tree-traverse': { name: '二叉树遍历', cat: '二叉树' },
    'two-pointer': { name: '双指针', cat: '技巧' },
    'sliding-window': { name: '滑动窗口', cat: '技巧' }
  };

  function sleep(ms) {
    var delay = ms || (420 - speed * 38);
    if (delay < 20) delay = 20;
    return new Promise(function(r) { setTimeout(r, delay); });
  }

  async function pausePoint() {
    if (stopFlag) throw new Error('STOP');
    while (stepMode && !stopFlag) {
      await new Promise(function(r) { stepResolve = r; });
    }
    if (stopFlag) throw new Error('STOP');
  }

  function getCanvas() {
    canvas = document.getElementById('algo-canvas');
    if (!canvas) return false;
    ctx = canvas.getContext('2d');
    return true;
  }

  // 返回 CSS 像素尺寸（主模块 Algorithm 设置了 setTransform(dpr)，所以这里用 width/dpr）
  function size() {
    if (!canvas) return { w: 800, h: 400 };
    var dpr = window.devicePixelRatio || 1;
    return { w: canvas.width / dpr, h: canvas.height / dpr };
  }

  function clearCanvas() {
    if (!ctx) return;
    var s = size();
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary') || '#f5f5f7';
    ctx.fillRect(0, 0, s.w, s.h);
  }

  function getColor(name) {
    var root = getComputedStyle(document.documentElement);
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var colors = {
      bg: isDark ? '#1c1c1e' : '#f5f5f7',
      text: isDark ? '#fff' : '#1d1d1f',
      primary: '#0071e3',
      green: '#34c759',
      orange: '#ff9f0a',
      red: '#ff3b30',
      purple: '#af52de',
      gray: isDark ? '#48484a' : '#d1d1d6',
      lightGray: isDark ? '#2c2c2e' : '#e5e5ea'
    };
    return colors[name] || colors.primary;
  }

  // ===== DP: 0-1 Knapsack =====
  async function knapsackDemo() {
    var items = [
      {w: 2, v: 3, name: 'A'},
      {w: 3, v: 4, name: 'B'},
      {w: 4, v: 5, name: 'C'},
      {w: 5, v: 8, name: 'D'}
    ];
    var W = 8;
    var n = items.length;
    var dp = [];
    for (var i = 0; i <= n; i++) {
      dp.push(new Array(W + 1).fill(0));
    }
    var highlights = {};

    function drawDP(curI, curJ) {
      clearCanvas();
      var cw = size().w, ch = size().h;
      var cols = W + 1, rows = n + 1;
      var cellW = Math.min(60, (cw - 160) / cols);
      var cellH = Math.min(45, (ch - 100) / rows);
      var startX = 100, startY = 60;

      // Headers
      ctx.font = 'bold 13px -apple-system';
      ctx.fillStyle = getColor('text');
      ctx.textAlign = 'center';
      ctx.fillText('容量j', startX - 30, startY - 10);
      ctx.fillText('物品i', 40, startY + cellH / 2);

      for (var j = 0; j <= W; j++) {
        ctx.fillStyle = getColor('gray');
        ctx.font = '11px -apple-system';
        ctx.fillText(j, startX + j * cellW + cellW / 2, startY - 8);
      }
      for (var i = 0; i <= n; i++) {
        var label = i === 0 ? '空' : items[i-1].name + '(w' + items[i-1].w + ',v' + items[i-1].v + ')';
        ctx.fillStyle = getColor('gray');
        ctx.font = '10px -apple-system';
        ctx.textAlign = 'right';
        ctx.fillText(label, startX - 8, startY + i * cellH + cellH / 2 + 4);
      }

      // Draw cells
      ctx.textAlign = 'center';
      for (var i2 = 0; i2 <= n; i2++) {
        for (var j2 = 0; j2 <= W; j2++) {
          var x = startX + j2 * cellW;
          var y = startY + i2 * cellH;
          var key = i2 + ',' + j2;
          var bg = getColor('lightGray');
          if (highlights[key] === 'current') bg = getColor('orange');
          else if (highlights[key] === 'done') bg = getColor('green');
          else if (highlights[key] === 'compare') bg = getColor('purple');

          ctx.fillStyle = bg;
          ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
          ctx.strokeStyle = getColor('gray');
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);

          if (dp[i2][j2] > 0 || (i2 === 0 && j2 === 0) || highlights[key]) {
            ctx.fillStyle = highlights[key] ? '#fff' : getColor('text');
            ctx.font = 'bold 13px -apple-system';
            ctx.fillText(dp[i2][j2], x + cellW / 2, y + cellH / 2 + 4);
          }
        }
      }
    }

    for (var i = 1; i <= n; i++) {
      for (var j = 0; j <= W; j++) {
        highlights[i + ',' + j] = 'current';
        if (j >= items[i-1].w) {
          var without = dp[i-1][j];
          var withItem = dp[i-1][j - items[i-1].w] + items[i-1].v;
          highlights[(i-1) + ',' + j] = 'compare';
          highlights[(i-1) + ',' + (j - items[i-1].w)] = 'compare';
          drawDP(i, j);
          await sleep();
          await pausePoint();
          dp[i][j] = Math.max(without, withItem);
          delete highlights[(i-1) + ',' + j];
          delete highlights[(i-1) + ',' + (j - items[i-1].w)];
        } else {
          drawDP(i, j);
          await sleep();
          await pausePoint();
          dp[i][j] = dp[i-1][j];
        }
        highlights[i + ',' + j] = 'done';
        drawDP(i, j);
      }
    }
    drawDP(n, W);
  }

  // ===== DP: LCS =====
  async function lcsDemo() {
    var s1 = 'ABCBDAB', s2 = 'BDCAB';
    var m = s1.length, n = s2.length;
    var dp = [];
    for (var i = 0; i <= m; i++) dp.push(new Array(n + 1).fill(0));
    var hl = {};

    function draw() {
      clearCanvas();
      var cw = size().w, ch = size().h;
      var cellW = Math.min(50, (cw - 120) / (n + 2));
      var cellH = Math.min(40, (ch - 80) / (m + 2));
      var sx = 80, sy = 50;

      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = getColor('text');
      ctx.fillText('↓ s2', sx + cellW * (n/2 + 1), sy - 20);
      ctx.fillText('s1 →', sx - 40, sy + cellH * (m/2 + 1));

      for (var j = 0; j < n; j++) {
        ctx.fillStyle = getColor('primary');
        ctx.fillText(s2[j], sx + (j+1) * cellW + cellW/2, sy - 5);
      }
      for (var i = 0; i < m; i++) {
        ctx.fillStyle = getColor('green');
        ctx.fillText(s1[i], sx - 12, sy + (i+1) * cellH + cellH/2 + 4);
      }
      ctx.font = 'bold 12px -apple-system';
      for (var i2 = 0; i2 <= m; i2++) {
        for (var j2 = 0; j2 <= n; j2++) {
          var x = sx + j2 * cellW, y = sy + i2 * cellH;
          var k = i2 + ',' + j2;
          var bg = getColor('lightGray');
          if (hl[k] === 'current') bg = getColor('orange');
          else if (hl[k] === 'match') bg = getColor('green');
          else if (hl[k] === 'done') bg = getColor('primary');
          ctx.fillStyle = bg;
          ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
          if (dp[i2][j2] > 0) {
            ctx.fillStyle = hl[k] ? '#fff' : getColor('text');
            ctx.fillText(dp[i2][j2], x + cellW/2, y + cellH/2 + 4);
          }
        }
      }
    }

    for (var i = 1; i <= m; i++) {
      for (var j = 1; j <= n; j++) {
        hl[i + ',' + j] = 'current';
        draw();
        await sleep();
        await pausePoint();
        if (s1[i-1] === s2[j-1]) {
          dp[i][j] = dp[i-1][j-1] + 1;
          hl[i + ',' + j] = 'match';
        } else {
          dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
          hl[i + ',' + j] = 'done';
        }
        draw();
      }
    }
    draw();
  }

  // ===== DP: Climbing Stairs =====
  async function climbDemo() {
    var n = 8;
    var dp = new Array(n + 1).fill(0);
    dp[0] = 1; dp[1] = 1;

    function draw(step) {
      clearCanvas();
      var cw = size().w, ch = size().h;
      var stepW = Math.min(70, (cw - 80) / (n + 1));
      var stepH = 40;
      var baseY = ch / 2 + 40;

      // Draw stairs
      for (var i = 0; i <= n; i++) {
        var x = 40 + i * stepW;
        var y = baseY - i * stepH / 2;
        ctx.fillStyle = i <= step ? getColor('green') : getColor('lightGray');
        ctx.fillRect(x, y, stepW - 4, stepH);
        ctx.strokeStyle = getColor('gray');
        ctx.strokeRect(x, y, stepW - 4, stepH);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px -apple-system';
        ctx.textAlign = 'center';
        ctx.fillText(i, x + stepW/2 - 2, y + stepH/2 + 4);

        if (dp[i] > 0 && i <= step) {
          ctx.fillStyle = getColor('text');
          ctx.font = '11px -apple-system';
          ctx.fillText('f=' + dp[i], x + stepW/2 - 2, y - 8);
        }
      }

      // Formula
      ctx.fillStyle = getColor('text');
      ctx.font = 'bold 16px -apple-system';
      ctx.textAlign = 'left';
      ctx.fillText('f(n) = f(n-1) + f(n-2)', 40, 30);
      if (step >= 2) {
        ctx.fillStyle = getColor('primary');
        ctx.fillText('f(' + step + ') = f(' + (step-1) + ') + f(' + (step-2) + ') = ' + dp[step], 40, 55);
      }
    }

    draw(1);
    await sleep(500);
    await pausePoint();
    for (var i = 2; i <= n; i++) {
      dp[i] = dp[i-1] + dp[i-2];
      draw(i);
      await sleep();
      await pausePoint();
    }
    draw(n);
  }

  // ===== Linked List Reverse =====
  async function llReverseDemo() {
    var nodes = [];
    var vals = [1, 2, 3, 4, 5];
    vals.forEach(function(v) { nodes.push({val: v, next: null, prev: null}); });
    for (var i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i+1];

    var prev = null, curr = nodes[0], step = 0;

    function draw() {
      clearCanvas();
      var cw = size().w, ch = size().h;
      var nodeW = 70, nodeH = 50;
      var gap = 40;
      var totalW = nodes.length * (nodeW + gap) - gap;
      var startX = (cw - totalW) / 2;
      var y = ch / 2 - 20;

      ctx.font = 'bold 13px -apple-system';
      ctx.textAlign = 'center';

      // Draw pointers
      ctx.fillStyle = getColor('orange');
      ctx.fillText('prev', prev ? startX + nodes.indexOf(prev) * (nodeW + gap) + nodeW/2 : 40, y - 50);
      ctx.fillStyle = getColor('green');
      ctx.fillText('curr', curr ? startX + nodes.indexOf(curr) * (nodeW + gap) + nodeW/2 : 40, y - 80);

      for (var i = 0; i < nodes.length; i++) {
        var x = startX + i * (nodeW + gap);
        var isCurr = nodes[i] === curr;
        var isPrev = nodes[i] === prev;
        var bg = getColor('lightGray');
        if (isCurr) bg = getColor('green');
        else if (isPrev) bg = getColor('orange');
        else if (nodes[i].next === null && nodes[i].prev !== null) bg = getColor('primary');

        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(x, y, nodeW, nodeH, 10);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.fillText(nodes[i].val, x + nodeW/2, y + nodeH/2 + 4);

        // Draw arrows
        var nextNode = nodes[i].next;
        if (nextNode) {
          var nextI = nodes.indexOf(nextNode);
          var nx = startX + nextI * (nodeW + gap);
          ctx.strokeStyle = getColor('text');
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + nodeW, y + nodeH/2);
          ctx.lineTo(nx - 5, y + nodeH/2);
          ctx.stroke();
          // Arrow head
          ctx.beginPath();
          ctx.moveTo(nx - 5, y + nodeH/2);
          ctx.lineTo(nx - 12, y + nodeH/2 - 5);
          ctx.lineTo(nx - 12, y + nodeH/2 + 5);
          ctx.fill();
        }
      }

      // Step info
      ctx.fillStyle = getColor('text');
      ctx.font = 'bold 14px -apple-system';
      ctx.textAlign = 'left';
      ctx.fillText('Step ' + step + ': ', 20, ch - 20);
      if (curr) {
        ctx.fillStyle = getColor('primary');
        ctx.fillText('curr.next → prev (翻转指针)', 80, ch - 20);
      } else {
        ctx.fillStyle = getColor('green');
        ctx.fillText('完成！prev 是新的头节点', 80, ch - 20);
      }
    }

    draw();
    await sleep(600);
    while (curr) {
      var next = curr.next;
      curr.next = prev;
      step++;
      draw();
      await sleep();
      await pausePoint();
      prev = curr;
      curr = next;
    }
    draw();
  }

  // ===== Binary Tree Traversal =====
  async function treeTraverseDemo() {
    var root = {val:1, left:{val:2,left:{val:4},right:{val:5}}, right:{val:3,left:{val:6},right:{val:7}}};
    var visited = [];
    var allNodes = [];
    function collect(n) { if(!n) return; allNodes.push(n); collect(n.left); collect(n.right); }
    collect(root);

    function layout(node, x, y, spread) {
      if (!node) return;
      node.x = x; node.y = y;
      if (node.left) layout(node.left, x - spread, y + 80, spread / 2);
      if (node.right) layout(node.right, x + spread, y + 80, spread / 2);
    }
    layout(root, size().w / 2, 50, size().w / 5);

    function draw(highlightNode, order, orderName) {
      clearCanvas();
      var cw = size().w, ch = size().h;

      // Draw edges first
      function drawEdges(node) {
        if (!node) return;
        if (node.left) {
          ctx.strokeStyle = getColor('gray');
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y + 20);
          ctx.lineTo(node.left.x, node.left.y - 20);
          ctx.stroke();
          drawEdges(node.left);
        }
        if (node.right) {
          ctx.strokeStyle = getColor('gray');
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y + 20);
          ctx.lineTo(node.right.x, node.right.y - 20);
          ctx.stroke();
          drawEdges(node.right);
        }
      }
      drawEdges(root);

      // Draw nodes
      ctx.font = 'bold 16px -apple-system';
      ctx.textAlign = 'center';
      allNodes.forEach(function(n) {
        var isVisited = visited.indexOf(n) >= 0;
        var isCurrent = n === highlightNode;
        var bg = getColor('lightGray');
        if (isCurrent) bg = getColor('orange');
        else if (isVisited) bg = getColor('green');

        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = getColor('gray');
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.fillText(n.val, n.x, n.y + 5);
      });

      // Show traversal order
      if (order && order.length > 0) {
        ctx.fillStyle = getColor('text');
        ctx.font = 'bold 16px -apple-system';
        ctx.fillText(orderName + ': [' + order.join(', ') + ']', cw / 2, ch - 20);
      }
    }

    // In-order traversal
    async function inorder(node, result) {
      if (!node) return;
      draw(node, result, '中序遍历');
      await sleep(500);
      await pausePoint();
      await inorder(node.left, result);
      visited.push(node);
      result.push(node.val);
      draw(node, result, '中序遍历');
      await sleep();
      await pausePoint();
      await inorder(node.right, result);
    }

    draw(null, [], '中序遍历');
    await sleep(500);
    var result = [];
    await inorder(root, result);
    draw(null, result, '中序遍历');
  }

  // ===== Two Pointer =====
  async function twoPointerDemo() {
    var arr = [2, 7, 11, 15, 3, 8, 4, 9, 6, 1];
    var target = 13;
    var sorted = arr.slice().sort(function(a,b){return a-b;});
    var left = 0, right = sorted.length - 1;
    var found = false;

    function draw() {
      clearCanvas();
      var cw = size().w, ch = size().h;
      var cellW = Math.min(70, (cw - 60) / sorted.length);
      var cellH = 60;
      var baseY = ch / 2;
      var startX = (cw - sorted.length * cellW) / 2;

      ctx.font = 'bold 16px -apple-system';
      ctx.textAlign = 'center';

      for (var i = 0; i < sorted.length; i++) {
        var x = startX + i * cellW;
        var bg = getColor('lightGray');
        if (i === left) bg = getColor('orange');
        else if (i === right) bg = getColor('green');
        if (found && (i === left || i === right)) bg = getColor('red');

        ctx.fillStyle = bg;
        ctx.fillRect(x + 2, baseY, cellW - 4, cellH);
        ctx.strokeStyle = getColor('gray');
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, baseY, cellW - 4, cellH);

        ctx.fillStyle = '#fff';
        ctx.fillText(sorted[i], x + cellW/2, baseY + cellH/2 + 5);

        // Labels
        if (i === left) {
          ctx.fillStyle = getColor('orange');
          ctx.font = 'bold 13px -apple-system';
          ctx.fillText('← left', x + cellW/2, baseY - 10);
        }
        if (i === right) {
          ctx.fillStyle = getColor('green');
          ctx.font = 'bold 13px -apple-system';
          ctx.fillText('right →', x + cellW/2, baseY - 10);
        }
      }

      // Sum info
      var sum = sorted[left] + sorted[right];
      ctx.fillStyle = found ? getColor('red') : getColor('text');
      ctx.font = 'bold 18px -apple-system';
      ctx.fillText(sorted[left] + ' + ' + sorted[right] + ' = ' + sum + (found ? ' ✅ 找到!' : ''),
                   cw / 2, baseY + cellH + 40);
      ctx.fillStyle = getColor('gray');
      ctx.font = '14px -apple-system';
      ctx.fillText('目标: ' + target, cw / 2, baseY + cellH + 70);

      if (!found) {
        ctx.fillStyle = sum < target ? getColor('orange') : getColor('green');
        ctx.font = '13px -apple-system';
        ctx.fillText(sum < target ? '和太小 → left++' : '和太大 → right--', cw / 2, baseY + cellH + 95);
      }
    }

    draw();
    await sleep(600);
    while (left < right) {
      var sum = sorted[left] + sorted[right];
      draw();
      await sleep();
      await pausePoint();
      if (sum === target) {
        found = true;
        draw();
        return;
      } else if (sum < target) left++;
      else right--;
      draw();
    }
    draw();
  }

  // ===== Sliding Window =====
  async function slidingWindowDemo() {
    var s = 'abcabcbb';
    var chars = s.split('');
    var charSet = {};
    var left = 0, maxLen = 0, maxStart = 0;

    function draw(currRight) {
      clearCanvas();
      var cw = size().w, ch = size().h;
      var cellW = Math.min(70, (cw - 60) / chars.length);
      var cellH = 60;
      var baseY = ch / 2;
      var startX = (cw - chars.length * cellW) / 2;

      ctx.font = 'bold 18px -apple-system';
      ctx.textAlign = 'center';

      for (var i = 0; i < chars.length; i++) {
        var x = startX + i * cellW;
        var inWindow = i >= left && i <= currRight;
        var bg = getColor('lightGray');
        if (i === currRight) bg = getColor('orange');
        else if (inWindow) bg = getColor('primary');

        ctx.fillStyle = bg;
        ctx.fillRect(x + 2, baseY, cellW - 4, cellH);
        ctx.strokeStyle = getColor('gray');
        ctx.strokeRect(x + 2, baseY, cellW - 4, cellH);

        ctx.fillStyle = '#fff';
        ctx.fillText(chars[i], x + cellW/2, baseY + cellH/2 + 6);
      }

      // Window bracket
      var lx = startX + left * cellW;
      var rx = startX + currRight * cellW + cellW;
      ctx.strokeStyle = getColor('green');
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(lx, baseY - 5);
      ctx.lineTo(lx, baseY - 15);
      ctx.lineTo(rx, baseY - 15);
      ctx.lineTo(rx, baseY - 5);
      ctx.stroke();

      ctx.fillStyle = getColor('green');
      ctx.font = 'bold 13px -apple-system';
      ctx.fillText('窗口', (lx + rx) / 2, baseY - 22);

      // Info
      var winLen = currRight - left + 1;
      ctx.fillStyle = getColor('text');
      ctx.font = 'bold 16px -apple-system';
      ctx.fillText('窗口大小: ' + winLen + (winLen > maxLen ? ' 🏆 新纪录!' : ''), cw/2, baseY + cellH + 35);
      ctx.fillStyle = getColor('gray');
      ctx.font = '13px -apple-system';
      var setStr = Object.keys(charSet).join(', ');
      ctx.fillText('窗口内字符: {' + setStr + '}', cw/2, baseY + cellH + 60);
      ctx.fillStyle = getColor('primary');
      ctx.fillText('最大长度: ' + maxLen, cw/2, baseY + cellH + 85);
    }

    for (var right = 0; right < chars.length; right++) {
      while (chars[right] in charSet && left <= right) {
        draw(right);
        await sleep();
        await pausePoint();
        delete charSet[chars[left]];
        left++;
      }
      charSet[chars[right]] = true;
      if (right - left + 1 > maxLen) {
        maxLen = right - left + 1;
        maxStart = left;
      }
      draw(right);
      await sleep();
      await pausePoint();
    }
    draw(chars.length - 1);
  }

  // ===== Main runner =====
  async function runExt(algoKey) {
    if (!getCanvas()) return;
    running = true;
    stopFlag = false;
    clearCanvas();

    try {
      switch(algoKey) {
        case 'dp-knapsack': await knapsackDemo(); break;
        case 'dp-lcs': await lcsDemo(); break;
        case 'dp-climb': await climbDemo(); break;
        case 'll-reverse': await llReverseDemo(); break;
        case 'tree-traverse': await treeTraverseDemo(); break;
        case 'two-pointer': await twoPointerDemo(); break;
        case 'sliding-window': await slidingWindowDemo(); break;
      }
    } catch(e) {
      // Stopped
    }
    running = false;
  }

  function init() {
    // Add sidebar buttons
    var sidebar = document.getElementById('algo-list');
    if (!sidebar) return;

    var dpDiv = document.createElement('div');
    dpDiv.className = 'algo-cat-title';
    dpDiv.textContent = '动态规划';
    sidebar.appendChild(dpDiv);
    var dpBtns = ['dp-knapsack', 'dp-lcs', 'dp-climb'];
    dpBtns.forEach(function(key) {
      var info = EXT_ALGOS[key];
      var btn = document.createElement('button');
      btn.className = 'algo-btn';
      btn.dataset.algo = key;
      btn.dataset.ext = '1';
      btn.textContent = '📊 ' + info.name;
      sidebar.appendChild(btn);
    });

    var llDiv = document.createElement('div');
    llDiv.className = 'algo-cat-title';
    llDiv.textContent = '数据结构';
    sidebar.appendChild(llDiv);
    var dsBtns = ['ll-reverse', 'tree-traverse'];
    dsBtns.forEach(function(key) {
      var info = EXT_ALGOS[key];
      var btn = document.createElement('button');
      btn.className = 'algo-btn';
      btn.dataset.algo = key;
      btn.dataset.ext = '1';
      btn.textContent = (key === 'll-reverse' ? '🔗 ' : '🌳 ') + info.name;
      sidebar.appendChild(btn);
    });

    var tpDiv = document.createElement('div');
    tpDiv.className = 'algo-cat-title';
    tpDiv.textContent = '技巧';
    sidebar.appendChild(tpDiv);
    var tkBtns = ['two-pointer', 'sliding-window'];
    tkBtns.forEach(function(key) {
      var info = EXT_ALGOS[key];
      var btn = document.createElement('button');
      btn.className = 'algo-btn';
      btn.dataset.algo = key;
      btn.dataset.ext = '1';
      btn.textContent = (key === 'two-pointer' ? '👉👈 ' : '🪟 ') + info.name;
      sidebar.appendChild(btn);
    });

    // Hook into existing button click handler
    document.querySelectorAll('.algo-btn[data-ext]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var algoKey = btn.dataset.algo;
        // Deactivate other buttons
        document.querySelectorAll('.algo-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // Update info display
        var info = EXT_ALGOS[algoKey];
        var descEl = document.getElementById('algo-description');
        if (descEl) descEl.innerHTML = '<p>' + info.name + ' 动画演示</p>';

        // Hide pseudo for ext algos
        var pseudoPanel = document.getElementById('algo-pseudo-panel');
        if (pseudoPanel) pseudoPanel.style.display = 'none';

        // Reset canvas
        if (getCanvas()) clearCanvas();

        // Disable existing algorithm controls
        speed = parseInt(document.getElementById('algo-speed') ? document.getElementById('algo-speed').value : 5) || 5;
      });
    });

    // Hook play button
    var playBtn = document.getElementById('btn-algo-play');
    if (playBtn) {
      playBtn.addEventListener('click', function() {
        var activeBtn = document.querySelector('.algo-btn.active[data-ext]');
        if (activeBtn) {
          speed = parseInt(document.getElementById('algo-speed').value) || 5;
          runExt(activeBtn.dataset.algo);
        }
      });
    }

    // Hook step button
    var stepBtn = document.getElementById('btn-algo-step');
    if (stepBtn) {
      stepBtn.addEventListener('click', function() {
        var activeBtn = document.querySelector('.algo-btn.active[data-ext]');
        if (activeBtn && running) {
          stepMode = false;
          if (stepResolve) { stepResolve(); stepResolve = null; }
        }
      });
    }

    // Hook reset button
    var resetBtn = document.getElementById('btn-algo-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        stopFlag = true;
        stepMode = false;
        if (stepResolve) { stepResolve(); stepResolve = null; }
        if (getCanvas()) clearCanvas();
      });
    }

    // Hook speed slider
    var speedSlider = document.getElementById('algo-speed');
    if (speedSlider) {
      speedSlider.addEventListener('input', function() {
        speed = parseInt(this.value) || 5;
      });
    }
  }

  return {
    init: init,
    runExt: runExt,
    // 暴露扩展算法 key 列表，供主模块 Algorithm 判断是否应让出画布
    keys: function() { return Object.keys(EXT_ALGOS); }
  };
})();

// 全局快捷列表（供主模块 Algorithm.start() 判断当前是否为扩展算法）
var EXT_ALGO_KEYS = (function() {
  var k = [];
  if (typeof AlgorithmExtended !== 'undefined' && AlgorithmExtended.keys) k = AlgorithmExtended.keys();
  return k;
})();

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    if (typeof AlgorithmExtended !== 'undefined') {
      AlgorithmExtended.init();
    }
  }, 500);
});

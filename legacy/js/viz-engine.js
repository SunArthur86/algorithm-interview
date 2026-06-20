/* ===== 通用可视化引擎 ===== */
/* 支持7种可视化类型：array/hashmap/linkedlist/tree/grid/stack/dptable */
var VizEngine = (function() {
  var canvas, ctx;
  var frames = [];
  var currentFrame = 0;
  var playing = false;
  var timer = null;
  var speed = 800; // ms per frame

  function init() {
    canvas = document.getElementById('viz-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    // 播放控制
    document.getElementById('viz-play').addEventListener('click', togglePlay);
    document.getElementById('viz-step-fwd').addEventListener('click', function() { stop(); step(1); });
    document.getElementById('viz-step-back').addEventListener('click', function() { stop(); step(-1); });
    document.getElementById('viz-reset').addEventListener('click', function() { stop(); currentFrame = 0; render(); });
    document.getElementById('viz-speed').addEventListener('input', function() {
      speed = 1600 - parseInt(this.value, 10) * 150;
      document.getElementById('viz-speed-val').textContent = this.value;
    });
  }

  function load(problemId) {
    if (typeof VIZ_TRACES === 'undefined' || !VIZ_TRACES[problemId]) {
      frames = [];
    } else {
      try {
        frames = VIZ_TRACES[problemId]();  // call function to get frames
      } catch(e) {
        console.error('Trace error for problem', problemId, e);
        frames = [];
      }
    }
    currentFrame = 0;
    stop();
    render();
    return frames.length > 0;
  }

  function togglePlay() {
    if (playing) { stop(); return; }
    if (currentFrame >= frames.length - 1) currentFrame = 0;
    play();
  }

  function play() {
    playing = true;
    var btn = document.getElementById('viz-play');
    if (btn) btn.textContent = '⏸ 暂停';
    timer = setInterval(function() {
      if (currentFrame >= frames.length - 1) { stop(); return; }
      currentFrame++;
      render();
    }, speed);
  }

  function stop() {
    playing = false;
    var btn = document.getElementById('viz-play');
    if (btn) btn.textContent = '▶ 播放';
    if (timer) { clearInterval(timer); timer = null; }
  }

  function step(dir) {
    var next = currentFrame + dir;
    if (next < 0) next = 0;
    if (next >= frames.length) next = frames.length - 1;
    currentFrame = next;
    render();
  }

  function render() {
    if (!ctx || frames.length === 0) {
      drawEmpty();
      return;
    }
    var frame = frames[currentFrame];
    if (!frame) return;

    // 清空
    var w = canvas.width, h = canvas.height;
    ctx.fillStyle = getBg();
    ctx.fillRect(0, 0, w, h);

    // 根据类型渲染
    switch (frame.type) {
      case 'array': drawArray(frame); break;
      case 'hashmap': drawHashMap(frame); break;
      case 'linkedlist': drawLinkedList(frame); break;
      case 'tree': drawTree(frame); break;
      case 'grid': drawGrid(frame); break;
      case 'stack': drawStack(frame); break;
      case 'dptable': drawDPTable(frame); break;
      default: drawArray(frame);
    }

    // 更新状态信息
    updateStatus(frame);
  }

  function getBg() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return dark ? '#0a0a0a' : '#fafafa';
  }
  function getColor(name) {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var colors = {
      text: dark ? '#f5f5f7' : '#1d1d1f',
      text2: dark ? '#98989d' : '#86868b',
      accent: dark ? '#0a84ff' : '#0071e3',
      compare: '#ff9500',
      swap: '#af52de',
      sorted: '#34c759',
      pivot: '#ff3b30',
      current: '#0071e3',
      none: dark ? '#2c2c2e' : '#e0e0e5',
      bg2: dark ? '#1c1c1e' : '#ffffff'
    };
    return colors[name] || colors.text;
  }

  function drawEmpty() {
    var w = canvas.width, h = canvas.height;
    ctx.fillStyle = getBg();
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = getColor('text2');
    ctx.font = '16px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('暂无动画数据', w / 2, h / 2);
  }

  /* ===== 数组可视化 ===== */
  function drawArray(frame) {
    var arr = frame.array || [];
    var w = canvas.width, h = canvas.height;
    var cellW = Math.min(60, (w - 40) / Math.max(arr.length, 1));
    var cellH = 40;
    var startX = (w - arr.length * cellW) / 2;
    var startY = h / 2 - cellH / 2 - 20;
    var highlights = frame.highlights || {};
    var pointers = frame.pointers || {};

    // 绘制数组单元格
    arr.forEach(function(val, i) {
      var x = startX + i * cellW;
      var color = getColor('none');
      var textColor = getColor('text');
      var label = '';
      if (highlights[i]) {
        var hc = highlights[i];
        if (hc === 'compare' || hc === 'current') { color = getColor('compare'); textColor = '#fff'; }
        else if (hc === 'swap') { color = getColor('swap'); textColor = '#fff'; }
        else if (hc === 'sorted') { color = getColor('sorted'); textColor = '#fff'; }
        else if (hc === 'pivot') { color = getColor('pivot'); textColor = '#fff'; }
        else if (hc === 'window') { color = getColor('accent') + '40'; }
        else if (hc === 'found') { color = getColor('sorted'); textColor = '#fff'; label = '✓'; }
      }
      // 圆角矩形
      roundRect(x + 2, startY, cellW - 4, cellH, 6, color);
      ctx.fillStyle = textColor;
      ctx.font = 'bold 16px -apple-system, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(String(val), x + cellW / 2, startY + cellH / 2 + 5);
      if (label) {
        ctx.font = '12px sans-serif';
        ctx.fillText(label, x + cellW / 2, startY - 8);
      }
      // 索引
      ctx.fillStyle = getColor('text2');
      ctx.font = '11px sans-serif';
      ctx.fillText(i, x + cellW / 2, startY + cellH + 16);
    });

    // 绘制指针/箭头
    Object.keys(pointers).forEach(function(name) {
      var idx = pointers[name];
      if (typeof idx !== 'number' || idx < 0 || idx >= arr.length) return;
      var x = startX + idx * cellW + cellW / 2;
      var arrowY = startY - 20;
      var colors = { left: '#ff3b30', right: '#0071e3', slow: '#ff9500', fast: '#af52de', mid: '#34c759', i: '#0071e3', j: '#ff9500', k: '#af52de' };
      var ac = colors[name] || '#0071e3';
      // 箭头三角形
      ctx.fillStyle = ac;
      ctx.beginPath();
      ctx.moveTo(x, arrowY);
      ctx.lineTo(x - 6, arrowY - 12);
      ctx.lineTo(x + 6, arrowY - 12);
      ctx.closePath();
      ctx.fill();
      // 标签
      ctx.font = 'bold 12px -apple-system, sans-serif';
      ctx.fillText(name, x, arrowY - 16);
    });

    // 绘制额外信息（如窗口范围）
    if (frame.windowRange) {
      var wr = frame.windowRange;
      var wx = startX + wr[0] * cellW;
      var ww = (wr[1] - wr[0] + 1) * cellW;
      ctx.strokeStyle = getColor('accent');
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      roundRect(wx, startY - 4, ww, cellH + 8, 8, null);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  /* ===== 哈希表可视化 ===== */
  function drawHashMap(frame) {
    var arr = frame.array || [];
    var map = frame.map || {};
    var w = canvas.width, h = canvas.height;
    var cellW = Math.min(50, (w - 80) / Math.max(arr.length, 1));
    var cellH = 36;
    var startX = (w - arr.length * cellW) / 2;
    var arrY = 40;

    // 顶部：数组
    arr.forEach(function(val, i) {
      var x = startX + i * cellW;
      var hl = (frame.idx === i) ? getColor('compare') : getColor('none');
      var tc = (frame.idx === i) ? '#fff' : getColor('text');
      roundRect(x + 2, arrY, cellW - 4, cellH, 6, hl);
      ctx.fillStyle = tc;
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(String(val), x + cellW / 2, arrY + cellH / 2 + 5);
      ctx.fillStyle = getColor('text2');
      ctx.font = '10px sans-serif';
      ctx.fillText(i, x + cellW / 2, arrY + cellH + 14);
    });

    // 指针箭头
    if (typeof frame.idx === 'number' && frame.idx >= 0 && frame.idx < arr.length) {
      var ax = startX + frame.idx * cellW + cellW / 2;
      ctx.fillStyle = getColor('compare');
      ctx.beginPath();
      ctx.moveTo(ax, arrY - 8);
      ctx.lineTo(ax - 5, arrY - 18);
      ctx.lineTo(ax + 5, arrY - 18);
      ctx.closePath();
      ctx.fill();
    }

    // 底部：哈希表
    var keys = Object.keys(map);
    var mapStartY = arrY + cellH + 50;
    var mapCellW = 80, mapCellH = 32;
    var mapStartX = (w - keys.length * (mapCellW + 10)) / 2;
    if (keys.length === 0) mapStartX = w / 2 - mapCellW / 2;

    ctx.fillStyle = getColor('text2');
    ctx.font = '13px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('哈希表:', w / 2 - 100, mapStartY - 12);

    keys.forEach(function(key, i) {
      var x = mapStartX + i * (mapCellW + 10);
      var y = mapStartY;
      var hl = (frame.need !== undefined && String(frame.need) === key) ? getColor('found') : getColor('bg2');
      // key box
      roundRect(x, y, mapCellW / 2, mapCellH, 4, hl);
      ctx.strokeStyle = getColor('text2');
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = getColor('text');
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(key, x + mapCellW / 4, y + mapCellH / 2 + 4);
      // value box
      roundRect(x + mapCellW / 2, y, mapCellW / 2, mapCellH, 4, getColor('none'));
      ctx.fillStyle = getColor('text');
      ctx.fillText(String(map[key]), x + mapCellW * 0.75, y + mapCellH / 2 + 4);
    });

    if (keys.length === 0) {
      ctx.fillStyle = getColor('text2');
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('(空)', w / 2, mapStartY + 20);
    }

    // found 高亮
    if (frame.found && frame.found.length === 2) {
      ctx.fillStyle = getColor('sorted');
      ctx.font = 'bold 16px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓ 找到! 索引: [' + frame.found[0] + ', ' + frame.found[1] + ']', w / 2, mapStartY + 60);
    }
  }

  /* ===== 链表可视化 ===== */
  function drawLinkedList(frame) {
    var nodes = frame.nodes || [];
    var w = canvas.width, h = canvas.height;
    var nodeW = 56, nodeH = 36, gap = 20;
    var totalW = nodes.length * (nodeW + gap) - gap;
    var startX = (w - totalW) / 2;
    var startY = h / 2 - nodeH / 2;
    var highlights = frame.highlights || {};
    var pointers = frame.pointers || {};

    nodes.forEach(function(val, i) {
      var x = startX + i * (nodeW + gap);
      var hl = highlights[i];
      var color = getColor('none');
      var tc = getColor('text');
      if (hl === 'current') { color = getColor('compare'); tc = '#fff'; }
      else if (hl === 'sorted' || hl === 'done') { color = getColor('sorted'); tc = '#fff'; }
      else if (hl === 'swap') { color = getColor('swap'); tc = '#fff'; }
      else if (hl === 'new') { color = getColor('accent'); tc = '#fff'; }
      else if (hl === 'null') { color = 'transparent'; }

      if (hl !== 'null') {
        roundRect(x, startY, nodeW, nodeH, 8, color);
        ctx.strokeStyle = getColor('text2');
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = tc;
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(String(val), x + nodeW / 2, startY + nodeH / 2 + 5);
        // 分隔线 (val | next)
        ctx.strokeStyle = getColor('text2');
        ctx.beginPath();
        ctx.moveTo(x + nodeW * 0.65, startY);
        ctx.lineTo(x + nodeW * 0.65, startY + nodeH);
        ctx.stroke();
        // next 箭头标记
        ctx.fillStyle = tc;
        ctx.font = '10px sans-serif';
        ctx.fillText('•', x + nodeW * 0.82, startY + nodeH / 2 + 4);
      } else {
        // null node
        roundRect(x, startY, nodeW * 0.5, nodeH, 8, 'transparent');
        ctx.strokeStyle = getColor('text2');
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = getColor('text2');
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('null', x + nodeW * 0.25, startY + nodeH / 2 + 4);
      }

      // 箭头连接
      if (i < nodes.length - 1 && highlights[i] !== 'null') {
        ctx.strokeStyle = getColor('text2');
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + nodeW + 2, startY + nodeH / 2);
        ctx.lineTo(x + nodeW + gap - 2, startY + nodeH / 2);
        ctx.stroke();
        // 箭头头
        ctx.beginPath();
        ctx.moveTo(x + nodeW + gap - 2, startY + nodeH / 2);
        ctx.lineTo(x + nodeW + gap - 7, startY + nodeH / 2 - 4);
        ctx.lineTo(x + nodeW + gap - 7, startY + nodeH / 2 + 4);
        ctx.closePath();
        ctx.fillStyle = getColor('text2');
        ctx.fill();
      }
    });

    // 指针标签
    Object.keys(pointers).forEach(function(name) {
      var idx = pointers[name];
      if (typeof idx !== 'number' || idx < 0 || idx >= nodes.length) return;
      var x = startX + idx * (nodeW + gap) + nodeW / 2;
      var colors = { prev: '#ff3b30', curr: '#0071e3', next: '#34c759', slow: '#ff9500', fast: '#af52de', dummy: '#86868b' };
      var ac = colors[name] || '#0071e3';
      ctx.fillStyle = ac;
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      var labelY = startY - 14;
      ctx.fillText(name, x, labelY);
      ctx.beginPath();
      ctx.moveTo(x, labelY + 4);
      ctx.lineTo(x - 4, labelY - 6);
      ctx.lineTo(x + 4, labelY - 6);
      ctx.closePath();
      ctx.fill();
    });

    // 结果
    if (frame.result) {
      ctx.fillStyle = getColor('sorted');
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(frame.result, w / 2, startY + nodeH + 40);
    }
  }

  /* ===== 二叉树可视化 ===== */
  function drawTree(frame) {
    var tree = frame.tree; // 嵌套对象: {val, left, right}
    var w = canvas.width, h = canvas.height;
    var highlights = frame.highlights || {};
    var path = frame.path || [];

    if (!tree) {
      ctx.fillStyle = getColor('text2');
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('(空树)', w / 2, h / 2);
      return;
    }

    // 计算节点位置 (递归)
    var positions = [];
    function layout(node, depth, leftBound, rightBound) {
      if (!node) return;
      var x = (leftBound + rightBound) / 2;
      var y = 40 + depth * 70;
      positions.push({ val: node.val, x: x, y: y, id: node.id || (node.val + '_' + depth) });
      layout(node.left, depth + 1, leftBound, x);
      layout(node.right, depth + 1, x, rightBound);
    }
    layout(tree, 0, 30, w - 30);

    // 绘制连线
    function drawEdges(node, depth, leftBound, rightBound) {
      if (!node) return;
      var x = (leftBound + rightBound) / 2;
      var y = 40 + depth * 70;
      if (node.left) {
        var lx = (leftBound + x) / 2;
        var ly = 40 + (depth + 1) * 70;
        ctx.strokeStyle = getColor('text2');
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y + 14);
        ctx.lineTo(lx, ly - 14);
        ctx.stroke();
        drawEdges(node.left, depth + 1, leftBound, x);
      }
      if (node.right) {
        var rx = (x + rightBound) / 2;
        var ry = 40 + (depth + 1) * 70;
        ctx.strokeStyle = getColor('text2');
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y + 14);
        ctx.lineTo(rx, ry - 14);
        ctx.stroke();
        drawEdges(node.right, depth + 1, x, rightBound);
      }
    }
    drawEdges(tree, 0, 30, w - 30);

    // 绘制节点
    positions.forEach(function(p) {
      var hl = highlights[p.id] || highlights[p.val];
      var color = getColor('bg2');
      var tc = getColor('text');
      var onPath = path.indexOf(p.val) >= 0 || path.indexOf(p.id) >= 0;
      if (hl === 'current' || hl === 'visit') { color = getColor('compare'); tc = '#fff'; }
      else if (hl === 'done' || hl === 'found') { color = getColor('sorted'); tc = '#fff'; }
      else if (hl === 'checking') { color = getColor('pivot'); tc = '#fff'; }
      else if (onPath) { color = getColor('accent'); tc = '#fff'; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, 16, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = getColor('text2');
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = tc;
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(String(p.val), p.x, p.y + 4);
    });

    // 遍历结果
    if (frame.result) {
      ctx.fillStyle = getColor('sorted');
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('结果: ' + frame.result, w / 2, h - 20);
    }
  }

  /* ===== 矩阵/网格可视化 ===== */
  function drawGrid(frame) {
    var grid = frame.grid || [];
    var w = canvas.width, h = canvas.height;
    if (!grid.length) return;
    var rows = grid.length, cols = grid[0].length;
    var cellSize = Math.min(40, (w - 40) / cols, (h - 60) / rows);
    var startX = (w - cols * cellSize) / 2;
    var startY = (h - rows * cellSize) / 2 - 10;
    var highlights = frame.highlights || {};
    var pointers = frame.pointers || {};

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var x = startX + c * cellSize;
        var y = startY + r * cellSize;
        var key = r + ',' + c;
        var hl = highlights[key] || highlights[c]; // 支持列高亮
        var color = getColor('bg2');
        var tc = getColor('text');
        if (hl === 'visit' || hl === 'current') { color = getColor('compare'); tc = '#fff'; }
        else if (hl === 'done' || hl === 'sorted') { color = getColor('sorted'); tc = '#fff'; }
        else if (hl === 'check') { color = getColor('accent'); tc = '#fff'; }
        else if (hl === 'zero') { color = getColor('pivot'); tc = '#fff'; }
        else if (hl === 'path') { color = getColor('swap'); tc = '#fff'; }
        roundRect(x + 1, y + 1, cellSize - 2, cellSize - 2, 4, color);
        ctx.strokeStyle = getColor('text2');
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.fillStyle = tc;
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(String(grid[r][c]), x + cellSize / 2, y + cellSize / 2 + 5);
      }
    }

    // 行列指针
    ['r', 'c', 'row', 'col', 'i', 'j'].forEach(function(name) {
      if (pointers[name] !== undefined) {
        var val = pointers[name];
        var colors = { r: '#ff3b30', c: '#0071e3', row: '#ff3b30', col: '#0071e3', i: '#ff9500', j: '#34c759' };
        ctx.fillStyle = colors[name] || '#0071e3';
        ctx.font = 'bold 11px sans-serif';
        if (name === 'r' || name === 'row' || name === 'i') {
          ctx.textAlign = 'right';
          ctx.fillText(name + '=' + val, startX - 6, startY + val * cellSize + cellSize / 2 + 4);
        } else {
          ctx.textAlign = 'center';
          ctx.fillText(name + '=' + val, startX + val * cellSize + cellSize / 2, startY - 8);
        }
      }
    });

    if (frame.result) {
      ctx.fillStyle = getColor('sorted');
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(frame.result, w / 2, startY + rows * cellSize + 25);
    }
  }

  /* ===== 栈可视化 ===== */
  function drawStack(frame) {
    var stack = frame.stack || [];
    var stacks = frame.stacks || [stack]; // 支持多栈
    var w = canvas.width, h = canvas.height;
    var highlights = frame.highlights || {};
    var numStacks = stacks.length;
    var stackW = Math.min(120, (w - 40) / numStacks - 20);
    var totalW = numStacks * (stackW + 30) - 30;
    var startX = (w - totalW) / 2;
    var labels = frame.labels || stacks.map(function(_, i) { return 'Stack' + (i + 1); });

    stacks.forEach(function(stk, si) {
      var sx = startX + si * (stackW + 30);
      var label = labels[si] || ('Stack' + (si + 1));
      ctx.fillStyle = getColor('text2');
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, sx + stackW / 2, h - 20);

      // 底部线
      ctx.strokeStyle = getColor('text2');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, h - 36);
      ctx.lineTo(sx + stackW, h - 36);
      ctx.stroke();

      // 从底向上绘制
      var cellH = 30;
      stk.forEach(function(val, i) {
        var y = h - 40 - (i + 1) * cellH;
        var isTop = (i === stk.length - 1);
        var color = getColor('none');
        var tc = getColor('text');
        if (isTop && highlights.top) { color = getColor('compare'); tc = '#fff'; }
        else if (highlights[i]) { color = getColor('swap'); tc = '#fff'; }
        roundRect(sx + 5, y, stackW - 10, cellH - 2, 4, color);
        ctx.strokeStyle = getColor('text2');
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = tc;
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(String(val), sx + stackW / 2, y + cellH / 2 + 4);
      });

      // 空栈提示
      if (stk.length === 0) {
        ctx.fillStyle = getColor('text2');
        ctx.font = '12px sans-serif';
        ctx.fillText('(空)', sx + stackW / 2, h - 50);
      }
    });

    // 弹出的值
    if (frame.popped) {
      ctx.fillStyle = getColor('pivot');
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('← 弹出: ' + frame.popped, w / 2, 30);
    }

    if (frame.result) {
      ctx.fillStyle = getColor('sorted');
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(frame.result, w / 2, 56);
    }
  }

  /* ===== DP表格可视化 ===== */
  function drawDPTable(frame) {
    var table = frame.table || [];
    var w = canvas.width, h = canvas.height;
    if (!table.length) return;
    var rows = table.length, cols = table[0].length;
    var cellW = Math.min(50, (w - 60) / cols);
    var cellH = Math.min(36, (h - 60) / rows);
    var startX = (w - cols * cellW) / 2;
    var startY = (h - rows * cellH) / 2;
    var highlights = frame.highlights || {};
    var rowLabels = frame.rowLabels || [];
    var colLabels = frame.colLabels || [];

    // 列标签
    if (colLabels.length) {
      colLabels.forEach(function(label, c) {
        ctx.fillStyle = getColor('text2');
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(String(label), startX + c * cellW + cellW / 2, startY - 6);
      });
    }
    // 行标签
    if (rowLabels.length) {
      rowLabels.forEach(function(label, r) {
        ctx.fillStyle = getColor('text2');
        ctx.font = '11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(String(label), startX - 6, startY + r * cellH + cellH / 2 + 4);
      });
    }

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var x = startX + c * cellW;
        var y = startY + r * cellH;
        var key = r + ',' + c;
        var val = table[r][c];
        var hl = highlights[key];
        var color = getColor('none');
        var tc = getColor('text2');
        var showVal = true;
        if (val === null || val === undefined) { showVal = false; }
        else { tc = getColor('text'); }
        if (hl === 'current') { color = getColor('compare'); tc = '#fff'; }
        else if (hl === 'done' || hl === 'filled') { color = getColor('sorted'); tc = '#fff'; }
        else if (hl === 'dep1' || hl === 'dep2') { color = getColor('accent'); tc = '#fff'; }
        else if (hl === 'answer') { color = getColor('pivot'); tc = '#fff'; }

        roundRect(x + 1, y + 1, cellW - 2, cellH - 2, 4, color);
        ctx.strokeStyle = getColor('text2');
        ctx.lineWidth = 0.5;
        ctx.stroke();
        if (showVal) {
          ctx.fillStyle = tc;
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(String(val), x + cellW / 2, y + cellH / 2 + 4);
        }
      }
    }

    // 结果
    if (frame.result) {
      ctx.fillStyle = getColor('sorted');
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(frame.result, w / 2, startY + rows * cellH + 25);
    }
  }

  /* ===== 工具函数 ===== */
  function roundRect(x, y, w, h, r, fill) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  }

  function updateStatus(frame) {
    var msgEl = document.getElementById('viz-message');
    if (msgEl) msgEl.innerHTML = frame.msg || '';
    var counterEl = document.getElementById('viz-counter');
    if (counterEl) counterEl.textContent = 'Step ' + (currentFrame + 1) + ' / ' + frames.length;
    var barEl = document.getElementById('viz-progress');
    if (barEl) barEl.style.width = (frames.length > 0 ? ((currentFrame + 1) / frames.length * 100) : 0) + '%';
  }

  return { init: init, load: load, render: render, stop: stop };
})();

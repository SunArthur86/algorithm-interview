/* ===== 矩阵 (4题) + 链表 (14题) ====== */

// #73 矩阵置零
VIZ_TRACES["73"] = function() {
  var matrix = [[1,1,1],[1,0,1],[1,1,1]], frames = [];
  var rows = matrix.length, cols = matrix[0].length;
  var zeroRows = {}, zeroCols = {};
  frames.push({type:'grid', grid:matrix, msg:'遍历找所有0的位置, 记录行和列'});
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (matrix[r][c] === 0) {
        var hl = {}; hl[r+','+c] = 'current';
        frames.push({type:'grid', grid:matrix, highlights:hl, msg:'发现0: [' + r + ',' + c + ']'});
        zeroRows[r] = true; zeroCols[c] = true;
      }
    }
  }
  for (var r2 = 0; r2 < rows; r2++) {
    for (var c2 = 0; c2 < cols; c2++) {
      if (zeroRows[r2] || zeroCols[c2]) {
        matrix[r2][c2] = 0;
        var hl2 = {}; hl2[r2+','+c2] = 'zero';
        frames.push({type:'grid', grid:matrix, highlights:hl2, msg:'置零 [' + r2 + ',' + c2 + ']'});
      }
    }
  }
  frames.push({type:'grid', grid:matrix, msg:'✅ 完成'});
  return frames;
};

// #54 螺旋矩阵
VIZ_TRACES["54"] = function() {
  var matrix = [[1,2,3],[4,5,6],[7,8,9]], frames = [];
  var result = [], top = 0, bottom = matrix.length-1, left = 0, right = matrix[0].length-1;
  frames.push({type:'grid', grid:matrix, pointers:{top:0,bottom:bottom,left:0,right:right}, msg:'螺旋遍历: top/right/bottom/left 四个边界'});
  while (top <= bottom && left <= right) {
    var hl = {};
    for (var c = left; c <= right; c++) { result.push(matrix[top][c]); hl[top+','+c] = 'visit'; }
    frames.push({type:'grid', grid:matrix, highlights:hl, pointers:{top:top+1,bottom:bottom,left:left,right:right}, msg:'→ 向右: ' + result.join(',')});
    top++;
    for (var r = top; r <= bottom; r++) { result.push(matrix[r][right]); hl[r+','+right] = 'visit'; }
    frames.push({type:'grid', grid:matrix, highlights:hl, msg:'↓ 向下: ' + result.join(',')});
    right--;
    if (top <= bottom) {
      for (var c2 = right; c2 >= left; c2--) { result.push(matrix[bottom][c2]); hl[bottom+','+c2] = 'visit'; }
      frames.push({type:'grid', grid:matrix, highlights:hl, msg:'← 向左: ' + result.join(',')});
      bottom--;
    }
    if (left <= right) {
      for (var r2 = bottom; r2 >= top; r2--) { result.push(matrix[r2][left]); hl[r2+','+left] = 'visit'; }
      frames.push({type:'grid', grid:matrix, highlights:hl, msg:'↑ 向上: ' + result.join(',')});
      left++;
    }
  }
  frames.push({type:'grid', grid:matrix, result:'✅ 螺旋顺序: [' + result.join(',') + ']', msg:'✅ 结果: [' + result.join(',') + ']'});
  return frames;
};

// #48 旋转图像
VIZ_TRACES["48"] = function() {
  var matrix = [[1,2,3],[4,5,6],[7,8,9]], frames = [];
  var n = matrix.length;
  frames.push({type:'grid', grid:matrix, msg:'转置+翻转: ①沿主对角线转置'});
  for (var r = 0; r < n; r++) {
    for (var c = r+1; c < n; c++) {
      var hl = {}; hl[r+','+c] = 'current'; hl[c+','+r] = 'swap';
      var t = matrix[r][c]; matrix[r][c] = matrix[c][r]; matrix[c][r] = t;
    }
  }
  frames.push({type:'grid', grid:matrix, msg:'转置完成'});
  frames.push({type:'grid', grid:matrix, msg:'② 每行翻转'});
  for (var r2 = 0; r2 < n; r2++) matrix[r2].reverse();
  frames.push({type:'grid', grid:matrix, result:'✅ 旋转90°完成', msg:'✅ 旋转完成'});
  return frames;
};

// #240 搜索二维矩阵 II
VIZ_TRACES["240"] = function() {
  var matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], frames = [];
  var target = 5;
  var row = matrix.length-1, col = 0;
  frames.push({type:'grid', grid:matrix, pointers:{row:row, col:col}, msg:'从左下角开始, 搜索 ' + target});
  while (row >= 0 && col < matrix[0].length) {
    var hl = {}; hl[row+','+col] = 'current';
    frames.push({type:'grid', grid:matrix, highlights:hl, pointers:{row:row, col:col}, msg:'matrix[' + row + '][' + col + ']=' + matrix[row][col]});
    if (matrix[row][col] === target) {
      frames.push({type:'grid', grid:matrix, highlights:hl, result:'✅ 找到! 位置[' + row + ',' + col + ']', msg:'✅ 找到 ' + target + ' at [' + row + ',' + col + ']'});
      return frames;
    } else if (matrix[row][col] > target) {
      frames.push({type:'grid', grid:matrix, highlights:hl, msg:matrix[row][col] + ' > ' + target + ', 行-- (上方更小)'});
      row--;
    } else {
      frames.push({type:'grid', grid:matrix, highlights:hl, msg:matrix[row][col] + ' < ' + target + ', 列++ (右方更大)'});
      col++;
    }
  }
  frames.push({type:'grid', grid:matrix, result:'未找到', msg:'未找到 ' + target});
  return frames;
};

/* ====== 链表 (14题) ====== */

// #160 相交链表
VIZ_TRACES["160"] = function() {
  var frames = [];
  var a = [4,1], b = [5,6,1], common = [8,4,5];
  frames.push({type:'linkedlist', nodes:a.concat(['→']), msg:'链表A: 4→1→8→4→5'});
  frames.push({type:'linkedlist', nodes:b.concat(['→']), msg:'链表B: 5→6→1→8→4→5'});
  frames.push({type:'linkedlist', nodes:a.concat(common), highlights:{2:'found'}, msg:'双指针: pA走完A再走B, pB走完B再走A, 走相同步数后相遇在交点'});
  var merged = a.concat(common), merged2 = b.concat(common);
  frames.push({type:'linkedlist', nodes:merged, pointers:{curr:2}, highlights:{2:'found'}, msg:'pA走到位置2=' + merged[2] + ', pB也在位置' + (merged2.length - (common.length)) + '走到同一节点'});
  frames.push({type:'linkedlist', nodes:merged, result:'✅ 相交节点值 = 8', msg:'✅ 相交于节点 8'});
  return frames;
};

// #206 反转链表
VIZ_TRACES["206"] = function() {
  var nodes = [1,2,3,4,5], frames = [];
  var prev = -1, curr = 0;
  frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{prev:-1, curr:0}, msg:'初始: prev=null, curr=head(节点1)'});
  while (curr < nodes.length) {
    // 第1步：高亮当前 curr 节点，展示将要做的事
    var hl1 = {}; hl1[curr] = 'current';
    if (prev >= 0) hl1[prev] = 'new';
    frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{prev:prev, curr:curr}, highlights:hl1, msg:'① 保存 next=节点' + nodes[curr+1] + '；② 让节点' + nodes[curr] + '.next 指向 prev'});
    // 第2步：prev 前移、curr 后移（用真实索引高亮，修正原来用字面量 'curr' 的 bug）
    var hl2 = {}; hl2[prev >= 0 ? prev : curr] = 'done';
    frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{prev:curr, curr:curr+1}, highlights:hl2, msg:'③ prev 移到 curr(节点' + nodes[curr] + ')，curr 移到 next'});
    prev = curr; curr++;
  }
  frames.push({type:'linkedlist', nodes:nodes.slice().reverse(), result:'✅ 反转完成: 5→4→3→2→1', msg:'✅ 反转完成！prev 现在指向新的头节点 5'});
  return frames;
};

// #234 回文链表
VIZ_TRACES["234"] = function() {
  var nodes = [1,2,2,1], frames = [];
  frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{slow:0, fast:0}, msg:'快慢指针找中点'});
  var slow = 0, fast = 0;
  while (fast + 2 < nodes.length) { slow++; fast += 2; }
  frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{slow:slow, fast:fast}, highlights:{slow:'current'}, msg:'中点位置=' + slow});
  var left = nodes.slice(0, slow+1), right = nodes.slice(slow+1).reverse();
  frames.push({type:'linkedlist', nodes:left, highlights:{}, msg:'左半部分: [' + left.join(',') + ']'});
  frames.push({type:'linkedlist', nodes:right, highlights:{}, msg:'右半反转: [' + right.join(',') + ']'});
  var isP = true;
  for (var i = 0; i < right.length; i++) {
    var hl = {}; hl[i] = 'current';
    frames.push({type:'linkedlist', nodes:left.slice(), highlights:hl, msg:'比较 ' + left[i] + ' vs ' + right[i] + (left[i]===right[i]?' ✓':' ✗')});
    if (left[i] !== right[i]) isP = false;
  }
  frames.push({type:'linkedlist', nodes:nodes.slice(), result:'✅ 是回文', msg:'✅ ' + (isP?'是回文':'不是回文')});
  return frames;
};

// #141 环形链表
VIZ_TRACES["141"] = function() {
  var nodes = [3,2,0,-4], frames = [];
  frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{slow:0, fast:0}, msg:'快慢指针: slow走1步, fast走2步, 相遇则有环 (4→2成环)'});
  var steps = [
    {slow:1, fast:2, msg:'step1: slow→2, fast→0'},
    {slow:2, fast:1, msg:'step2: slow→0, fast→2'},
    {slow:3, fast:3, msg:'step3: slow→4, fast→4 ✅ 相遇!'},
  ];
  steps.forEach(function(s) {
    var hl = {}; hl[s.slow] = 'current'; hl[s.fast] = 'swap';
    if (s.slow === s.fast) { hl[s.slow] = 'found'; }
    frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{slow:s.slow, fast:s.fast}, highlights:hl, msg:s.msg});
  });
  frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{slow:3, fast:3}, highlights:{3:'found'}, result:'✅ 有环!', msg:'✅ 检测到环!'});
  return frames;
};

// #142 环形链表 II
VIZ_TRACES["142"] = function() {
  var nodes = [3,2,0,-4], frames = [];
  frames.push({type:'linkedlist', nodes:nodes.slice(), msg:'快慢指针找相遇点, 再从头出发找环入口 (4→2成环, 环入口=节点2)'});
  frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{slow:3, fast:3}, highlights:{3:'found'}, msg:'① 快慢指针相遇在节点4(位置3)'});
  frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{slow:3, curr:0}, highlights:{0:'current'}, msg:'② ptr从头开始, slow从相遇点开始, 同速前进'});
  frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{slow:3, curr:1}, highlights:{1:'current', 3:'compare'}, msg:'ptr=2, slow=4'});
  frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{slow:3, curr:1}, highlights:{1:'found'}, result:'✅ 环入口=节点2(位置1)', msg:'✅ ptr和slow在位置1相遇 → 环入口: 2'});
  return frames;
};

// #21 合并两个有序链表
VIZ_TRACES["21"] = function() {
  var l1 = [1,2,4], l2 = [1,3,4], frames = [];
  var result = [], i = 0, j = 0;
  frames.push({type:'linkedlist', nodes:l1.concat(l2), msg:'合并 [1,2,4] 和 [1,3,4]'});
  while (i < l1.length && j < l2.length) {
    var hl = {}; hl[i] = 'current'; hl[l1.length+j] = 'compare';
    frames.push({type:'linkedlist', nodes:l1.concat(l2), pointers:{i:i, j:l1.length+j}, highlights:hl, msg:'比较 ' + l1[i] + ' vs ' + l2[j]});
    if (l1[i] <= l2[j]) { result.push(l1[i]); i++; } else { result.push(l2[j]); j++; }
    var hl2 = {}; hl2[result.length-1] = 'new';
    frames.push({type:'linkedlist', nodes:result.slice(), highlights:hl2, msg:'结果: [' + result.join('→') + ']'});
  }
  while (i < l1.length) { result.push(l1[i++]); }
  while (j < l2.length) { result.push(l2[j++]); }
  frames.push({type:'linkedlist', nodes:result.slice(), result:'✅ 合并完成', msg:'✅ [' + result.join('→') + ']'});
  return frames;
};

// #2 两数相加
VIZ_TRACES["2"] = function() {
  var l1 = [2,4,3], l2 = [5,6,4], frames = [];
  var result = [], carry = 0;
  frames.push({type:'linkedlist', nodes:l1.concat(['+']).concat(l2), msg:'逆序: 342 + 465 = 807, 逐位相加'});
  for (var i = 0; i < Math.max(l1.length, l2.length) || carry; i++) {
    var a = l1[i] || 0, b = l2[i] || 0;
    var sum = a + b + carry;
    carry = Math.floor(sum / 10);
    result.push(sum % 10);
    frames.push({type:'linkedlist', nodes:result.slice(), highlights:(function(){var h={};h[result.length-1]='new';return h;})(), msg:a + ' + ' + b + ' + carry(' + (carry>0?1:0) + ') = ' + sum + ', 写' + (sum%10) + ' 进' + carry});
  }
  frames.push({type:'linkedlist', nodes:result.slice(), result:'✅ 结果: ' + result.reverse().join('') + ' (逆序存储)', msg:'✅ 结果: [' + result.join('→') + ']'});
  return frames;
};

// #19 删除链表的倒数第N个结点
VIZ_TRACES["19"] = function() {
  var nodes = [1,2,3,4,5], n = 2, frames = [];
  frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{fast:0, slow:0}, msg:'删除倒数第' + n + '个: 快指针先走n步'});
  for (var i = 0; i < n; i++) { /* fast moves */ }
  var fast = n, slow = 0;
  frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{fast:fast, slow:slow}, highlights:{fast:'swap'}, msg:'fast先走了' + n + '步到位置' + fast});
  while (fast < nodes.length - 1) { fast++; slow++; }
  frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{fast:fast, slow:slow}, highlights:(function(){var h={};h[slow]='current';h[slow+1]='pivot';return h;})(), msg:'同时前进直到fast到末尾, slow.next就是要删的'});
  var deleted = nodes.splice(slow+1, 1);
  frames.push({type:'linkedlist', nodes:nodes.slice(), result:'✅ 删除了节点' + deleted[0], msg:'✅ 删除节点' + deleted[0] + ', 结果: [' + nodes.join('→') + ']'});
  return frames;
};

// #24 两两交换链表中的节点
VIZ_TRACES["24"] = function() {
  var nodes = [1,2,3,4], frames = [];
  frames.push({type:'linkedlist', nodes:nodes.slice(), msg:'两两交换: (1,2)→(2,1), (3,4)→(4,3)'});
  for (var i = 0; i < nodes.length - 1; i += 2) {
    var hl = {}; hl[i] = 'swap'; hl[i+1] = 'swap';
    frames.push({type:'linkedlist', nodes:nodes.slice(), pointers:{slow:i}, highlights:hl, msg:'交换 ' + nodes[i] + ' ↔ ' + nodes[i+1]});
    var t = nodes[i]; nodes[i] = nodes[i+1]; nodes[i+1] = t;
    hl[i] = 'sorted'; hl[i+1] = 'sorted';
    frames.push({type:'linkedlist', nodes:nodes.slice(), highlights:hl, msg:'→ [' + nodes.join('→') + ']'});
  }
  frames.push({type:'linkedlist', nodes:nodes.slice(), result:'✅ 交换完成', msg:'✅ [' + nodes.join('→') + ']'});
  return frames;
};

// #25 K个一组翻转链表
VIZ_TRACES["25"] = function() {
  var nodes = [1,2,3,4,5], k = 2, frames = [];
  frames.push({type:'linkedlist', nodes:nodes.slice(), msg:k + '个一组翻转, 不足k个保持原样'});
  var result = [];
  for (var i = 0; i < nodes.length; i += k) {
    var group = nodes.slice(i, i+k);
    if (group.length === k) group.reverse();
    var hl = {};
    for (var j = 0; j < group.length; j++) hl[result.length+j] = 'new';
    result = result.concat(group);
    frames.push({type:'linkedlist', nodes:result.concat(nodes.slice(i+k)), highlights:hl, msg:group.length===k ? '翻转[' + i + '~' + (i+k-1) + '] → [' + group.join('→') + ']' : '不足' + k + '个, 保持不变'});
  }
  frames.push({type:'linkedlist', nodes:result, result:'✅ 翻转完成', msg:'✅ [' + result.join('→') + ']'});
  return frames;
};

// #138 随机链表的复制
VIZ_TRACES["138"] = function() {
  var nodes = [7,13,11,10,1], frames = [];
  frames.push({type:'linkedlist', nodes:nodes.slice(), msg:'① 在每个节点后插入复制节点'});
  var interleaved = [];
  nodes.forEach(function(v){ interleaved.push(v, v + "'"); });
  frames.push({type:'linkedlist', nodes:interleaved.slice(), highlights:{}, msg:'插入后: ' + interleaved.join('→')});
  frames.push({type:'linkedlist', nodes:interleaved.slice(), msg:'② 设置random指针 (跳两步)'});
  frames.push({type:'linkedlist', nodes:interleaved.filter(function(_,i){return i%2===1}), msg:'③ 分离复制链表'});
  frames.push({type:'linkedlist', nodes:nodes.slice(), result:'✅ 深拷贝完成', msg:'✅ 深拷贝完成'});
  return frames;
};

// #148 排序链表
VIZ_TRACES["148"] = function() {
  var nodes = [4,2,1,3], frames = [];
  frames.push({type:'linkedlist', nodes:nodes.slice(), msg:'归并排序: 自顶向下递归, 合并有序子链表'});
  // 模拟归并过程
  var arr = nodes.slice();
  function mergeSort(arr, level) {
    if (arr.length <= 1) return arr;
    var mid = Math.floor(arr.length / 2);
    var left = mergeSort(arr.slice(0, mid), level+1);
    var right = mergeSort(arr.slice(mid), level+1);
    var merged = [];
    var i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++]);
      else merged.push(right[j++]);
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);
    frames.push({type:'linkedlist', nodes:merged.slice(), highlights:{}, msg:level === 0 ? '最终合并' : '合并子数组 → [' + merged.join('→') + ']'});
    return merged;
  }
  mergeSort(arr, 0);
  frames.push({type:'linkedlist', nodes:[1,2,3,4], result:'✅ 排序完成', msg:'✅ [1→2→3→4]'});
  return frames;
};

// #23 合并K个升序链表
VIZ_TRACES["23"] = function() {
  var lists = [[1,4,5],[1,3,4],[2,6]], frames = [];
  frames.push({type:'linkedlist', nodes:[].concat.apply([], lists), msg:'K=3个链表, 用小根堆(最小堆)每次取最小节点'});
  var result = [];
  var ptrs = [0,0,0];
  while (true) {
    var minVal = Infinity, minIdx = -1;
    for (var i = 0; i < lists.length; i++) {
      if (ptrs[i] < lists[i].length && lists[i][ptrs[i]] < minVal) {
        minVal = lists[i][ptrs[i]]; minIdx = i;
      }
    }
    if (minIdx === -1) break;
    result.push(lists[minIdx][ptrs[minIdx]]);
    ptrs[minIdx]++;
    frames.push({type:'linkedlist', nodes:result.slice(), highlights:(function(){var h={};h[result.length-1]='new';return h;})(), msg:'取最小值 ' + minVal + ' (来自链表' + (minIdx+1) + ') → [' + result.join('→') + ']'});
  }
  frames.push({type:'linkedlist', nodes:result.slice(), result:'✅ 合并完成', msg:'✅ [' + result.join('→') + ']'});
  return frames;
};

// #146 LRU缓存
VIZ_TRACES["146"] = function() {
  var frames = [];
  var order = [];
  frames.push({type:'linkedlist', nodes:['head ↔ tail'], msg:'双向链表 + 哈希表: 访问过的移到头部, 满了删尾部'});
  var ops = [['put',1,1],['put',2,2],['get',1],['put',3,3],['get',2],['put',4,4],['get',1],['get',3],['get',4]];
  var capacity = 2, cache = [];
  ops.forEach(function(op) {
    if (op[0] === 'put') {
      var key = op[1], val = op[2];
      var idx = cache.indexOf(key);
      if (idx >= 0) { cache.splice(idx, 1); }
      cache.unshift(key);
      if (cache.length > capacity) {
        var evicted = cache.pop();
        frames.push({type:'linkedlist', nodes:cache.slice(), highlights:{0:'new'}, msg:'put(' + key + ',' + val + ') → 缓存满, 淘汰' + evicted});
      } else {
        frames.push({type:'linkedlist', nodes:cache.slice(), highlights:{0:'new'}, msg:'put(' + key + ',' + val + ') → 缓存: [' + cache.join('→') + '] (头部最近使用)'});
      }
    } else {
      var k = op[1];
      var i2 = cache.indexOf(k);
      if (i2 >= 0) {
        cache.splice(i2, 1); cache.unshift(k);
        frames.push({type:'linkedlist', nodes:cache.slice(), highlights:{0:'current'}, msg:'get(' + k + ') = ' + k + ' ✓ 移到头部 → [' + cache.join('→') + ']'});
      } else {
        frames.push({type:'linkedlist', nodes:cache.slice(), msg:'get(' + k + ') = -1 ✗ 未找到'});
      }
    }
  });
  frames.push({type:'linkedlist', nodes:cache.slice(), result:'✅ LRU缓存演示完成', msg:'✅ 最终缓存(最近→最久): [' + cache.join('→') + ']'});
  return frames;
};

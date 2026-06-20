/* ===== 二叉树 (15题) + 图论 (4题) + 回溯 (8题) ====== */

// 辅助函数：数组构建树对象
function buildTree(arr) {
  if (!arr || !arr.length) return null;
  var nodes = arr.map(function(v) { return v === null ? null : {val: v, left: null, right: null, id: v + '_' + Math.random().toString(36).slice(2,6)}; });
  for (var i = 0; i < nodes.length; i++) {
    if (!nodes[i]) continue;
    var li = 2*i+1, ri = 2*i+2;
    if (li < nodes.length) nodes[i].left = nodes[li];
    if (ri < nodes.length) nodes[i].right = nodes[ri];
  }
  return nodes[0];
}

/* ====== 二叉树 ====== */

// #94 中序遍历
VIZ_TRACES["94"] = function() {
  var tree = buildTree([1,null,2,null,null,3]);
  var frames = [], result = [];
  frames.push({type:'tree', tree:tree, msg:'中序遍历: 左→根→右'});
  function inorder(node, depth) {
    if (!node) return;
    inorder(node.left, depth+1);
    result.push(node.val);
    var hl = {}; hl[node.id] = 'current';
    frames.push({type:'tree', tree:tree, highlights:hl, msg:'访问 ' + node.val + ' → 结果: [' + result.join(',') + ']'});
    inorder(node.right, depth+1);
  }
  inorder(tree, 0);
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ [' + result.join(',') + ']', msg:'✅ 中序遍历: [' + result.join(',') + ']'});
  return frames;
};

// #104 二叉树的最大深度
VIZ_TRACES["104"] = function() {
  var tree = buildTree([3,9,20,null,null,15,7]);
  var frames = [];
  frames.push({type:'tree', tree:tree, msg:'递归: max(左深度, 右深度) + 1'});
  var maxD = 0;
  function dfs(node, depth) {
    if (!node) return 0;
    var hl = {}; hl[node.id] = 'current';
    frames.push({type:'tree', tree:tree, highlights:hl, msg:'访问 ' + node.val + ', depth=' + depth});
    var l = dfs(node.left, depth+1);
    var r = dfs(node.right, depth+1);
    var d = Math.max(l, r) + 1;
    if (depth + d > maxD) maxD = depth;
    return d;
  }
  var d = dfs(tree, 1);
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ 深度 = ' + d, msg:'✅ 最大深度 = ' + d});
  return frames;
};

// #226 翻转二叉树
VIZ_TRACES["226"] = function() {
  var tree = buildTree([4,2,7,1,3,6,9]);
  var frames = [];
  frames.push({type:'tree', tree:tree, msg:'翻转: 交换每个节点的左右子树'});
  function invert(node) {
    if (!node) return;
    var hl = {}; hl[node.id] = 'current';
    frames.push({type:'tree', tree:tree, highlights:hl, msg:'交换节点' + node.val + '的左右子树'});
    var t = node.left; node.left = node.right; node.right = t;
    invert(node.left); invert(node.right);
  }
  invert(tree);
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ 翻转完成', msg:'✅ 翻转完成'});
  return frames;
};

// #101 对称二叉树
VIZ_TRACES["101"] = function() {
  var tree = buildTree([1,2,2,3,4,4,3]);
  var frames = [];
  frames.push({type:'tree', tree:tree, msg:'比较左右子树是否镜像对称'});
  function check(a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    var hl = {}; if(a) hl[a.id] = 'current'; if(b) hl[b.id] = 'compare';
    frames.push({type:'tree', tree:tree, highlights:hl, msg:'比较 ' + a.val + ' vs ' + b.val + (a.val===b.val?' ✓ 对称':' ✗ 不对称')});
    return a.val === b.val && check(a.left, b.right) && check(a.right, b.left);
  }
  var result = check(tree.left, tree.right);
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ ' + (result?'是对称的':'不对称'), msg:'✅ ' + (result?'是对称二叉树':'不对称')});
  return frames;
};

// #543 二叉树的直径
VIZ_TRACES["543"] = function() {
  var tree = buildTree([1,2,3,4,5]);
  var frames = [], maxD = 0;
  frames.push({type:'tree', tree:tree, msg:'直径 = max(左深度 + 右深度) 的最大值'});
  function depth(node) {
    if (!node) return 0;
    var l = depth(node.left), r = depth(node.right);
    var hl = {}; hl[node.id] = 'current';
    if (l + r > maxD) maxD = l + r;
    frames.push({type:'tree', tree:tree, highlights:hl, msg:'节点' + node.val + ': 左深=' + l + ', 右深=' + r + ', 经过此节点的路径=' + (l+r) + ', 最大=' + maxD});
    return Math.max(l, r) + 1;
  }
  depth(tree);
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ 直径 = ' + maxD, msg:'✅ 直径 = ' + maxD});
  return frames;
};

// #102 层序遍历
VIZ_TRACES["102"] = function() {
  var tree = buildTree([3,9,20,null,null,15,7]);
  var frames = [], result = [];
  frames.push({type:'tree', tree:tree, msg:'BFS: 逐层遍历, 用队列'});
  var queue = [tree], level = 0;
  while (queue.length) {
    var size = queue.length;
    var levelNodes = [];
    var hl = {};
    for (var i = 0; i < size; i++) {
      var node = queue.shift();
      levelNodes.push(node.val); hl[node.id] = 'current';
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(levelNodes);
    frames.push({type:'tree', tree:tree, highlights:hl, msg:'第' + level + '层: [' + levelNodes.join(',') + ']'});
    level++;
  }
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ ' + JSON.stringify(result), msg:'✅ 层序遍历: ' + JSON.stringify(result)});
  return frames;
};

// #108 有序数组转BST
VIZ_TRACES["108"] = function() {
  var nums = [-10,-3,0,5,9], frames = [];
  frames.push({type:'array', array:nums.slice(), msg:'取中间元素为根, 递归构建左右子树'});
  var tree = null;
  function build(l, r) {
    if (l > r) return null;
    var mid = Math.floor((l + r) / 2);
    var hl = {}; hl[mid] = 'current';
    frames.push({type:'array', array:nums.slice(), pointers:{mid:mid}, highlights:hl, windowRange:[l,r], msg:'区间[' + l + '~' + r + '], mid=' + mid + ', 根=' + nums[mid]});
    var node = {val: nums[mid], left: null, right: null, id: 'n' + mid};
    node.left = build(l, mid-1);
    node.right = build(mid+1, r);
    return node;
  }
  tree = build(0, nums.length-1);
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ 构建完成', msg:'✅ BST构建完成'});
  return frames;
};

// #98 验证BST
VIZ_TRACES["98"] = function() {
  var tree = buildTree([5,1,4,null,null,3,6]);
  var frames = [], valid = true;
  frames.push({type:'tree', tree:tree, msg:'中序遍历应严格递增'});
  var prev = -Infinity;
  function inorder(node) {
    if (!node || !valid) return;
    inorder(node.left);
    var hl = {}; hl[node.id] = 'current';
    if (node.val <= prev) {
      valid = false;
      hl[node.id] = 'checking';
      frames.push({type:'tree', tree:tree, highlights:hl, msg:node.val + ' ≤ ' + prev + ' ✗ 不是BST!'});
      return;
    }
    frames.push({type:'tree', tree:tree, highlights:hl, msg:'访问 ' + node.val + ', prev=' + prev + ' ✓'});
    prev = node.val;
    inorder(node.right);
  }
  inorder(tree);
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ ' + (valid?'是有效BST':'不是BST'), msg:'✅ ' + (valid?'是有效的二叉搜索树':'不是二叉搜索树')});
  return frames;
};

// #230 BST中第K小元素
VIZ_TRACES["230"] = function() {
  var tree = buildTree([5,3,6,2,4,null,null,1]);
  var frames = [], k = 3, count = 0, result = null;
  frames.push({type:'tree', tree:tree, msg:'中序遍历到第' + k + '个'});
  function inorder(node) {
    if (!node || result) return;
    inorder(node.left);
    count++;
    var hl = {}; hl[node.id] = 'current';
    frames.push({type:'tree', tree:tree, highlights:hl, msg:'第' + count + '个: ' + node.val + (count===k?' ← 目标!':'')});
    if (count === k) { result = node.val; return; }
    inorder(node.right);
  }
  inorder(tree);
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ 第' + k + '小 = ' + result, msg:'✅ 第' + k + '小的元素 = ' + result});
  return frames;
};

// #199 二叉树的右视图
VIZ_TRACES["199"] = function() {
  var tree = buildTree([1,2,3,null,5,null,4]);
  var frames = [], result = [];
  frames.push({type:'tree', tree:tree, msg:'每层最右边的节点, BFS取每层最后一个'});
  var queue = [tree];
  while (queue.length) {
    var size = queue.length;
    for (var i = 0; i < size; i++) {
      var node = queue.shift();
      var hl = {};
      if (i === size - 1) {
        result.push(node.val); hl[node.id] = 'found';
        frames.push({type:'tree', tree:tree, highlights:hl, msg:'第' + result.length + '层右视图: ' + node.val});
      }
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ [' + result.join(',') + ']', msg:'✅ 右视图: [' + result.join(',') + ']'});
  return frames;
};

// #114 二叉树展开为链表
VIZ_TRACES["114"] = function() {
  var tree = buildTree([1,2,5,3,4,null,6]);
  var frames = [];
  frames.push({type:'tree', tree:tree, msg:'展开为右链表: 先左子树展开, 再右子树展开, 最后接上'});
  var flat = [];
  function preorder(node) {
    if (!node) return;
    flat.push(node.val);
    preorder(node.left); preorder(node.right);
  }
  preorder(tree);
  frames.push({type:'array', array:flat, msg:'前序遍历: [' + flat.join('→') + ']'});
  frames.push({type:'linkedlist', nodes:flat, result:'✅ 展开为链表', msg:'✅ 展开为右链表'});
  return frames;
};

// #105 前序+中序构造二叉树
VIZ_TRACES["105"] = function() {
  var preorder = [3,9,20,15,7], inorder = [9,3,15,20,7], frames = [];
  frames.push({type:'array', array:preorder.slice(), msg:'前序[3,9,20,15,7] + 中序[9,3,15,20,7]'});
  frames.push({type:'array', array:preorder.slice(), highlights:{0:'current'}, msg:'前序首元素=根: 3'});
  frames.push({type:'array', array:inorder.slice(), highlights:{1:'current'}, msg:'中序中找3: 左=[9], 右=[15,20,7]'});
  frames.push({type:'array', array:inorder.slice(), highlights:{0:'sorted',1:'current'}, msg:'9是左子树的根, 20是右子树的根'});
  frames.push({type:'array', array:inorder.slice(), highlights:{2:'current',3:'current'}, msg:'15和7分别是20的左右子节点'});
  var tree = buildTree([3,9,20,null,null,15,7]);
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ 构建完成', msg:'✅ 二叉树构建完成'});
  return frames;
};

// #437 路径总和 III
VIZ_TRACES["437"] = function() {
  var tree = buildTree([10,5,-3,3,2,null,11,3,-2,null,1]);
  var frames = [], targetSum = 8, count = 0;
  frames.push({type:'tree', tree:tree, msg:'前缀和+回溯: 找路径和=' + targetSum + '的路径数'});
  // 简化展示
  var paths = [[5,3],[5,2,1],[-3,11]];
  paths.forEach(function(p, i) {
    frames.push({type:'array', array:p.slice(), highlights:{0:'current'}, msg:'路径' + (i+1) + ': ' + p.join('→') + ' = ' + p.reduce(function(a,b){return a+b;},0) + (p.reduce(function(a,b){return a+b;},0)===targetSum?' ✅':'')});
    count++;
  });
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ 共' + count + '条路径', msg:'✅ 找到' + count + '条路径和=' + targetSum});
  return frames;
};

// #236 最近公共祖先
VIZ_TRACES["236"] = function() {
  var tree = buildTree([3,5,1,6,2,0,8,null,null,7,4]);
  var frames = [], p = 5, q = 1;
  frames.push({type:'tree', tree:tree, msg:'找节点' + p + '和' + q + '的最近公共祖先'});
  function lca(node) {
    if (!node) return null;
    if (node.val === p || node.val === q) {
      var hl = {}; hl[node.id] = 'found';
      frames.push({type:'tree', tree:tree, highlights:hl, msg:'找到 ' + node.val});
      return node;
    }
    var l = lca(node.left), r = lca(node.right);
    if (l && r) {
      var hl2 = {}; hl2[node.id] = 'current';
      frames.push({type:'tree', tree:tree, highlights:hl2, msg:'左右子树都找到! LCA = ' + node.val});
      return node;
    }
    return l || r;
  }
  var result = lca(tree);
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ LCA = ' + (result?result.val:'null'), msg:'✅ 最近公共祖先 = ' + (result?result.val:'null')});
  return frames;
};

// #124 最大路径和
VIZ_TRACES["124"] = function() {
  var tree = buildTree([-10,9,20,null,null,15,7]);
  var frames = [], maxSum = -Infinity;
  frames.push({type:'tree', tree:tree, msg:'每个节点: max(自身, 自身+左/右最大贡献). 路径和=自身+左贡献+右贡献'});
  function gain(node) {
    if (!node) return 0;
    var l = Math.max(gain(node.left), 0);
    var r = Math.max(gain(node.right), 0);
    var pathSum = node.val + l + r;
    var hl = {}; hl[node.id] = 'current';
    if (pathSum > maxSum) maxSum = pathSum;
    frames.push({type:'tree', tree:tree, highlights:hl, msg:'节点' + node.val + ': 左贡献=' + l + ', 右贡献=' + r + ', 路径和=' + pathSum + ', 最大=' + maxSum});
    return node.val + Math.max(l, r);
  }
  gain(tree);
  frames.push({type:'tree', tree:tree, highlights:{}, result:'✅ 最大路径和 = ' + maxSum, msg:'✅ 最大路径和 = ' + maxSum});
  return frames;
};

/* ====== 图论 (4题) ====== */

// #200 岛屿数量
VIZ_TRACES["200"] = function() {
  var grid = [[1,1,0,0,0],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,1,1]];
  var frames = [], count = 0;
  var g = grid.map(function(r){return r.slice();});
  frames.push({type:'grid', grid:g, msg:'遍历每个格子, 遇到1则DFS标记整个连通块'});
  function dfs(r, c) {
    if (r<0||r>=g.length||c<0||c>=g[0].length||g[r][c]!==1) return;
    g[r][c] = 2;
    var hl = {}; hl[r+','+c] = 'visit';
    dfs(r-1,c); dfs(r+1,c); dfs(r,c-1); dfs(r,c+1);
  }
  for (var r = 0; r < g.length; r++) {
    for (var c = 0; c < g[0].length; c++) {
      if (g[r][c] === 1) {
        count++;
        var hl = {}; hl[r+','+c] = 'current';
        frames.push({type:'grid', grid:g, highlights:hl, msg:'发现新岛屿! count=' + count + ', 从[' + r + ',' + c + ']开始DFS'});
        dfs(r, c);
        frames.push({type:'grid', grid:g, msg:'岛屿' + count + '标记完成(变为2)'});
      }
    }
  }
  // 还原显示
  var display = grid.map(function(r){return r.slice();});
  frames.push({type:'grid', grid:display, result:'✅ 岛屿数量 = ' + count, msg:'✅ 岛屿数量 = ' + count});
  return frames;
};

// #994 腐烂的橘子
VIZ_TRACES["994"] = function() {
  var grid = [[2,1,1],[1,1,0],[0,1,1]];
  var frames = [], minutes = 0;
  frames.push({type:'grid', grid:grid, msg:'BFS: 从所有腐烂橘子开始, 每分钟传染相邻新鲜橘子'});
  var g = grid.map(function(r){return r.slice();});
  var queue = [];
  for (var r=0;r<g.length;r++) for (var c=0;c<g[0].length;c++) if(g[r][c]===2) queue.push([r,c]);
  var fresh = 0;
  for (var r2=0;r2<g.length;r2++) for (var c2=0;c2<g[0].length;c2++) if(g[r2][c2]===1) fresh++;
  while (queue.length && fresh > 0) {
    var size = queue.length;
    for (var i=0;i<size;i++) {
      var pos = queue.shift();
      var dirs = [[-1,0],[1,0],[0,-1],[0,1]];
      for (var d=0;d<4;d++) {
        var nr = pos[0]+dirs[d][0], nc = pos[1]+dirs[d][1];
        if (nr>=0&&nr<g.length&&nc>=0&&nc<g[0].length&&g[nr][nc]===1) {
          g[nr][nc] = 2; fresh--;
          var hl = {}; hl[nr+','+nc] = 'visit';
          queue.push([nr,nc]);
        }
      }
    }
    minutes++;
    frames.push({type:'grid', grid:g, msg:'第' + minutes + '分钟后, 剩余新鲜=' + fresh});
  }
  frames.push({type:'grid', grid:g, result:'✅ 用时' + minutes + '分钟', msg:'✅ ' + (fresh===0?'全部腐烂, 用时' + minutes + '分钟':'不可能全部腐烂')});
  return frames;
};

// #207 课程表
VIZ_TRACES["207"] = function() {
  var numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]];
  var frames = [];
  frames.push({type:'grid', grid:[[0,1],[0,1,2],[1,2,3]], msg:'拓扑排序: 检测是否有环. 0→1, 0→2, 1→3, 2→3'});
  var inDegree = [0,1,1,2];
  var queue = [0], order = [], step = 0;
  frames.push({type:'array', array:inDegree, highlights:{0:'sorted'}, msg:'入度: [0,1,1,2]. 入度0的课程先入队: [课程0]'});
  while (queue.length) {
    var course = queue.shift();
    order.push(course);
    var hl = {}; hl[order.length-1] = 'current';
    frames.push({type:'array', array:order.slice(), highlights:hl, msg:'选课' + course + ' → 顺序: [' + order.join('→') + ']'});
    // 简化: 减少后续课程的入度
    if (course === 0) { inDegree[1]--; inDegree[2]--; if(inDegree[1]===0) queue.push(1); if(inDegree[2]===0) queue.push(2); }
    if (course === 1) { inDegree[3]--; if(inDegree[3]===0) queue.push(3); }
    if (course === 2) { inDegree[3]--; if(inDegree[3]===0) queue.push(3); }
  }
  frames.push({type:'array', array:order.slice(), result:'✅ [' + order.join('→') + ']', msg:'✅ 选课顺序: [' + order.join('→') + '], 可以完成'});
  return frames;
};

// #208 实现Trie
VIZ_TRACES["208"] = function() {
  var frames = [];
  frames.push({type:'tree', tree:{val:'root',id:'root',left:{val:'a',id:'a',left:null,right:{val:'p',id:'ap',left:null,right:{val:'p',id:'app',left:null,right:{val:'l',id:'appl',left:null,right:{val:'e',id:'apple',left:null,right:null}}}}}}, msg:'插入 "apple": root→a→p→p→l→e'});
  frames.push({type:'tree', tree:{val:'root',id:'root',left:{val:'a',id:'a',left:null,right:{val:'p',id:'ap',left:null,right:{val:'p',id:'app',left:null,right:{val:'l',id:'appl',left:null,right:{val:'e',id:'apple',left:null,right:null}}}}}}, highlights:{apple:'found'}, msg:'search("app") → false (不是完整单词)'});
  frames.push({type:'tree', tree:{val:'root',id:'root',left:{val:'a',id:'a',left:null,right:{val:'p',id:'ap',left:null,right:{val:'p',id:'app',left:null,right:{val:'l',id:'appl',left:null,right:{val:'e',id:'apple',left:null,right:null}}}}}}, highlights:{app:'done'}, msg:'startsWith("app") → true (存在此前缀)'});
  frames.push({type:'tree', tree:{val:'root',id:'root',left:{val:'a',id:'a',left:null,right:{val:'p',id:'ap',left:null,right:{val:'p',id:'app',left:null,right:{val:'l',id:'appl',left:null,right:{val:'e',id:'apple',left:null,right:null}}}}}}, result:'✅ Trie演示完成', msg:'✅ Trie前缀树演示完成'});
  return frames;
};

/* ====== 回溯 (8题) ====== */

// #46 全排列
VIZ_TRACES["46"] = function() {
  var nums = [1,2,3], frames = [], results = [];
  frames.push({type:'array', array:nums.slice(), msg:'回溯: 每次选一个未使用的数, 递归到底'});
  function backtrack(path, used) {
    if (path.length === nums.length) {
      results.push(path.slice());
      var hl = {}; path.forEach(function(_,i){hl[i]='sorted';});
      frames.push({type:'array', array:path.slice(), highlights:hl, msg:'✅ 找到排列: [' + path.join(',') + ']'});
      return;
    }
    for (var i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      var hl = {}; hl[i] = 'current';
      frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'选择 ' + nums[i] + ', path=[' + path.concat([nums[i]]).join(',') + ']'});
      used[i] = true; path.push(nums[i]);
      backtrack(path, used);
      path.pop(); used[i] = false;
    }
  }
  backtrack([], []);
  frames.push({type:'array', array:results.map(function(r){return '['+r.join('')+']';}), msg:'✅ 共' + results.length + '个排列: ' + JSON.stringify(results)});
  return frames;
};

// #78 子集
VIZ_TRACES["78"] = function() {
  var nums = [1,2,3], frames = [], results = [];
  frames.push({type:'array', array:nums.slice(), msg:'回溯: 每个数选或不选'});
  function backtrack(start, path) {
    results.push(path.slice());
    var hl = {}; path.forEach(function(v,i){hl[i]='sorted';});
    if (path.length) frames.push({type:'array', array:path.slice(), highlights:hl, msg:'子集: [' + path.join(',') + ']'});
    for (var i = start; i < nums.length; i++) {
      var hl2 = {}; hl2[i] = 'current';
      frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl2, msg:'加入 ' + nums[i] + ', start=' + (i+1)});
      path.push(nums[i]);
      backtrack(i+1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  frames.push({type:'array', array:results.map(function(r){return r.length?'['+r.join('')+']':'[]';}), msg:'✅ 共' + results.length + '个子集'});
  return frames;
};

// #17 电话号码的字母组合
VIZ_TRACES["17"] = function() {
  var digits = "23", frames = [], results = [];
  var map = {2:'abc',3:'def',4:'ghi',5:'jkl',6:'mno',7:'pqrs',8:'tuv',9:'wxyz'};
  frames.push({type:'array', array:digits.split(''), msg:'"23": 2→abc, 3→def, 组合所有可能'});
  function backtrack(idx, path) {
    if (idx === digits.length) { results.push(path); return; }
    var letters = map[digits[idx]];
    for (var i = 0; i < letters.length; i++) {
      frames.push({type:'array', array:digits.split(''), pointers:{i:idx}, highlights:{i:'current'}, msg:'选 ' + digits[idx] + '→' + letters[i] + ', 当前="' + path + letters[i] + '"'});
      backtrack(idx+1, path + letters[i]);
    }
  }
  backtrack(0, "");
  frames.push({type:'array', array:results.map(function(r){return '['+r+']';}), msg:'✅ ' + JSON.stringify(results)});
  return frames;
};

// #39 组合总和
VIZ_TRACES["39"] = function() {
  var candidates = [2,3,6,7], target = 7, frames = [], results = [];
  frames.push({type:'array', array:candidates.slice(), msg:'回溯: 可重复使用, 找和=' + target});
  function backtrack(start, remaining, path) {
    if (remaining === 0) { results.push(path.slice()); frames.push({type:'array', array:path.slice(), highlights:{0:'sorted'}, msg:'✅ 找到: [' + path.join(',') + '] = ' + target}); return; }
    if (remaining < 0) return;
    for (var i = start; i < candidates.length; i++) {
      var hl = {}; hl[i] = 'current';
      frames.push({type:'array', array:candidates.slice(), pointers:{i:i}, highlights:hl, msg:'尝试 ' + candidates[i] + ', 剩余=' + (remaining-candidates[i]) + ', path=[' + path.concat([candidates[i]]).join(',') + ']'});
      path.push(candidates[i]);
      backtrack(i, remaining-candidates[i], path);
      path.pop();
    }
  }
  backtrack(0, target, []);
  frames.push({type:'array', array:results.map(function(r){return '['+r.join(',')+']';}), msg:'✅ ' + JSON.stringify(results)});
  return frames;
};

// #22 括号生成
VIZ_TRACES["22"] = function() {
  var n = 3, frames = [], results = [];
  frames.push({type:'array', array:['(','(','('], msg:'n=' + n + '对括号, 回溯: 左<右才能加右括号'});
  function backtrack(open, close, path) {
    if (path.length === 2*n) { results.push(path); frames.push({type:'array', array:path.split(''), highlights:{0:'sorted'}, msg:'✅ ' + path}); return; }
    if (open < n) { frames.push({type:'array', array:path.split('').concat(['(']), msg:'加( open=' + (open+1) + ', path="' + path + '("'}); backtrack(open+1, close, path+'('); }
    if (close < open) { frames.push({type:'array', array:path.split('').concat([')']), msg:'加) close=' + (close+1) + ', path="' + path + ')"'}); backtrack(open, close+1, path+')'); }
  }
  backtrack(0, 0, "");
  frames.push({type:'array', array:results.map(function(r){return r;}), msg:'✅ ' + JSON.stringify(results)});
  return frames;
};

// #79 单词搜索
VIZ_TRACES["79"] = function() {
  var board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = "ABCCED";
  var frames = [];
  frames.push({type:'grid', grid:board, msg:'搜索 "' + word + '": DFS从每个匹配首字母的格子出发'});
  var path = [[0,0],[0,1],[0,2],[1,2],[2,2],[2,1]];
  path.forEach(function(pos, i) {
    var hl = {};
    for (var j = 0; j <= i; j++) hl[path[j][0]+','+path[j][1]] = 'visit';
    hl[pos[0]+','+pos[1]] = 'current';
    frames.push({type:'grid', grid:board, highlights:hl, msg:'匹配 "' + word[i] + '" at [' + pos[0] + ',' + pos[1] + '] → "' + word.substring(0,i+1) + '"'});
  });
  frames.push({type:'grid', grid:board, highlights:{}, result:'✅ 找到 "' + word + '"', msg:'✅ 找到单词 "' + word + '"'});
  return frames;
};

// #131 分割回文串
VIZ_TRACES["131"] = function() {
  var s = "aab", frames = [], results = [];
  frames.push({type:'array', array:s.split(''), msg:'回溯: 尝试在每个位置切割, 判断子串是否回文'});
  function isPal(sub) { return sub === sub.split('').reverse().join(''); }
  function backtrack(start, path) {
    if (start === s.length) { results.push(path.slice()); frames.push({type:'array', array:path.map(function(p){return p;}).join('|').split(''), msg:'✅ ' + JSON.stringify(path)}); return; }
    for (var end = start+1; end <= s.length; end++) {
      var sub = s.substring(start, end);
      if (isPal(sub)) {
        var hl = {}; for (var k = start; k < end; k++) hl[k] = 'sorted';
        frames.push({type:'array', array:s.split(''), highlights:hl, windowRange:[start,end-1], msg:'"' + sub + '" 是回文 ✓, 切割'});
        path.push(sub); backtrack(end, path); path.pop();
      } else {
        var hl2 = {}; for (var k2 = start; k2 < end; k2++) hl2[k2] = 'pivot';
        if (end === start+1) frames.push({type:'array', array:s.split(''), highlights:hl2, windowRange:[start,end-1], msg:'"' + sub + '" 检查中...'});
      }
    }
  }
  backtrack(0, []);
  frames.push({type:'array', array:results.map(function(r){return r.join('|');}), msg:'✅ ' + JSON.stringify(results)});
  return frames;
};

// #51 N皇后
VIZ_TRACES["51"] = function() {
  var n = 4, frames = [], results = 0;
  frames.push({type:'grid', grid:(function(){var g=[];for(var i=0;i<n;i++){var r=[];for(var j=0;j<n;j++)r.push('.');g.push(r);}return g;})(), msg:n + '皇后: 每行放一个皇后, 不能同行同列同对角线'});
  var board = []; for (var i=0;i<n;i++) board.push(Array(n).fill('.'));
  function valid(r, c) {
    for (var i=0;i<r;i++) if(board[i][c]==='Q') return false;
    for (var j=0;j<n;j++) if(board[r][j]==='Q') return false;
    for (var dr=-n;dr<=n;dr++) { var nr=r+dr,nc=c+dr; if(nr>=0&&nr<n&&nc>=0&&nc<n&&board[nr][nc]==='Q') return false; nr=r+dr;nc=c-dr; if(nr>=0&&nr<n&&nc>=0&&nc<n&&board[nr][nc]==='Q') return false; }
    return true;
  }
  function solve(r) {
    if (r === n) { results++; frames.push({type:'grid', grid:board.map(function(row){return row.slice();}), result:'✅ 解' + results, msg:'✅ 找到解' + results}); return; }
    for (var c=0;c<n;c++) {
      var hl = {}; hl[r+','+c] = 'current';
      if (valid(r, c)) {
        board[r][c] = 'Q';
        frames.push({type:'grid', grid:board.map(function(row){return row.slice();}), highlights:hl, msg:'行' + r + '列' + c + '放皇后 ✓'});
        solve(r+1);
        board[r][c] = '.';
      } else {
        frames.push({type:'grid', grid:board.map(function(row){return row.slice();}), highlights:hl, msg:'行' + r + '列' + c + '冲突 ✗'});
      }
    }
  }
  solve(0);
  frames.push({type:'grid', grid:(function(){var g=[];for(var i2=0;i2<n;i2++){var r2=[];for(var j2=0;j2<n;j2++)r2.push('.');g.push(r2);}return g;})(), result:'✅ 共' + results + '个解', msg:'✅ 共' + results + '个解'});
  return frames;
};

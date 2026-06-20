/* ========================================================================
   Static diagrams for classic problems — inline SVG (self-contained, offline).
   Each entry is a function/string returning an <svg> string. Keys are problem IDs.
   Diagrams are pedagogical: they illustrate the algorithm's mental model,
   not the exact I/O. Colors adapt to light/dark via currentColor + CSS vars.
   ======================================================================== */

var Diagrams = (function() {
  // Shared style block injected once per diagram to keep stroke/fill consistent.
  var STYLE = '<style>' +
    '.dg-node{fill:var(--color-bg,#fff);stroke:var(--color-text,#1d1d1f);stroke-width:1.5}' +
    '.dg-node-hi{fill:#0071e3;stroke:#0071e3;stroke-width:1.5}' +
    '.dg-node-ok{fill:#34c759;stroke:#34c759;stroke-width:1.5}' +
    '.dg-node-warn{fill:#ff9500;stroke:#ff9500;stroke-width:1.5}' +
    '.dg-node-arr{fill:#ff3b30;stroke:#ff3b30;stroke-width:1.5}' +
    '.dg-text{fill:var(--color-text,#1d1d1f);font:600 13px ui-monospace,Menlo,monospace;text-anchor:middle;dominant-baseline:central}' +
    '.dg-text-sm{fill:var(--color-text-secondary,#6e6e73);font:11px -apple-system,sans-serif;text-anchor:middle}' +
    '.dg-label{fill:var(--color-text,#1d1d1f);font:600 12px -apple-system,sans-serif;text-anchor:middle}' +
    '.dg-line{stroke:var(--color-text-tertiary,#a1a1a6);stroke-width:1.5;fill:none}' +
    '.dg-line-hi{stroke:#0071e3;stroke-width:2;fill:none}' +
    '.dg-arr{fill:var(--color-text-tertiary,#a1a1a6)}' +
    '.dg-grid{stroke:var(--color-border,rgba(0,0,0,.1));stroke-width:1;fill:var(--color-bg,#fff)}' +
    '.dg-grid-hi{stroke:#0071e3;stroke-width:2;fill:rgba(0,113,227,.12)}' +
    '</style>';

  var D = {};

  /* 1. 两数之和 — 哈希表查补 */
  D["1"] = function() {
    return '<svg viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg">' + STYLE +
      // array
      '<rect x="20" y="40" width="60" height="50" class="dg-node"/>' +
      '<text x="50" y="65" class="dg-text">2</text><text x="50" y="105" class="dg-text-sm">i=0</text>' +
      '<rect x="80" y="40" width="60" height="50" class="dg-node-hi"/>' +
      '<text x="110" y="65" class="dg-text" fill="#fff">7</text><text x="110" y="105" class="dg-text-sm">i=1 ←</text>' +
      '<rect x="140" y="40" width="60" height="50" class="dg-node"/>' +
      '<text x="170" y="65" class="dg-text">11</text>' +
      '<rect x="200" y="40" width="60" height="50" class="dg-node"/>' +
      '<text x="230" y="65" class="dg-text">15</text>' +
      '<text x="140" y="22" class="dg-label">nums = [2, 7, 11, 15],  target = 9</text>' +
      // hashmap box
      '<rect x="310" y="20" width="190" height="110" rx="10" fill="none" class="dg-line"/>' +
      '<text x="405" y="40" class="dg-label">HashMap</text>' +
      '<text x="330" y="70" class="dg-text" text-anchor="start">key=2 → idx=0</text>' +
      '<text x="330" y="100" class="dg-text" text-anchor="start" fill="#ff3b30">9-7=2 → 命中!</text>' +
      '<text x="260" y="160" class="dg-text-sm">查 complement=target-nums[i] 是否已在表中</text>' +
      '</svg>';
  };

  /* 206. 反转链表 — 三指针迭代 */
  D["206"] = function() {
    return '<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">' + STYLE +
      '<text x="260" y="24" class="dg-label">prev → null,  curr → 1 → 2 → 3 → null</text>' +
      // nodes
      node(80,90,'1')+arrow(130,90)+
      node(200,90,'2')+arrow(250,90)+
      node(320,90,'3')+'<text x="395" y="95" class="dg-text-sm">null</text>' +
      // pointers
      '<text x="80" y="150" class="dg-text-sm" fill="#ff3b30">prev=null</text>' +
      '<text x="80" y="70" class="dg-text-sm" fill="#0071e3">curr</text>' +
      // next = curr.next
      '<text x="260" y="170" class="dg-text-sm">① next = curr.next   ② curr.next = prev   ③ prev = curr, curr = next</text>' +
      '<path d="M200,60 Q140,30 80,30" class="dg-line-hi" marker-end="url(#dgh1)"/>' +
      '<defs><marker id="dgh1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" class="dg-arr"/></marker></defs>' +
      '</svg>';
    function node(x,y,v){return '<rect x="'+x+'" y="'+(y-22)+'" width="60" height="44" rx="8" class="dg-node"/><text x="'+(x+30)+'" y="'+y+'" class="dg-text">'+v+'</text>';}
    function arrow(x,y){return '<line x1="'+x+'" y1="'+y+'" x2="'+(x+40)+'" y2="'+y+'" class="dg-line" marker-end="url(#dga)"/><defs><marker id="dga" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" class="dg-arr"/></marker></defs>';}
  };

  /* 141. 环形链表 — 快慢指针 */
  D["141"] = function() {
    return '<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">' + STYLE +
      '<text x="260" y="24" class="dg-label">快慢指针：slow +1, fast +2；若有环必相遇</text>' +
      n(60,110,'3')+a(120,110)+
      n(180,110,'2')+a(240,110)+
      n(300,110,'0')+
      // cycle back arrow
      '<path d="M300,88 Q380,40 380,110 Q380,160 300,132" class="dg-line-hi" marker-end="url(#dc1)"/>' +
      '<defs><marker id="dc1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" class="dg-arr"/></marker></defs>' +
      '<text x="180" y="80" class="dg-text-sm" fill="#0071e3">🐢 slow</text>' +
      '<text x="300" y="80" class="dg-text-sm" fill="#ff3b30">🐇 fast</text>' +
      '<text x="260" y="180" class="dg-text-sm">相遇 ⇒ 有环</text>' +
      '</svg>';
    function n(x,y,v){return '<rect x="'+x+'" y="'+(y-22)+'" width="60" height="44" rx="8" class="dg-node"/><text x="'+(x+30)+'" y="'+y+'" class="dg-text">'+v+'</text>';}
    function a(x,y){return '<line x1="'+x+'" y1="'+y+'" x2="'+(x+50)+'" y2="'+y+'" class="dg-line" marker-end="url(#dca)"/><defs><marker id="dca" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" class="dg-arr"/></marker></defs>';}
  };

  /* 42. 接雨水 — 双指针 */
  D["42"] = function() {
    var bars=[0,1,0,2,1,0,1,3,2,1,2,1];
    var s='<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg">'+STYLE;
    s+='<text x="270" y="24" class="dg-label">接雨水：左右指针向内收，水 = min(lmax,rmax) − height[i]</text>';
    var bw=40, baseY=180;
    bars.forEach(function(h,i){
      var x=30+i*bw;
      s+='<rect x="'+x+'" y="'+(baseY-h*30)+'" width="'+bw+'" height="'+(h*30)+'" class="dg-node"/>';
      s+='<text x="'+(x+bw/2)+'" y="200" class="dg-text-sm">'+h+'</text>';
      // water above where applicable
      if(i===2){s+='<rect x="'+x+'" y="'+(baseY-30)+'" width="'+bw+'" height="30" fill="rgba(0,113,227,.25)"/>';}
      if(i===5||i===6){s+='<rect x="'+x+'" y="'+(baseY-30)+'" width="'+bw+'" height="30" fill="rgba(0,113,227,.25)"/>';}
    });
    s+='<text x="50" y="55" class="dg-text-sm" fill="#0071e3">← left</text>';
    s+='<text x="430" y="55" class="dg-text-sm" fill="#ff3b30">right →</text>';
    s+='<text x="270" y="215" class="dg-text-sm">蓝色 = 可接的雨水（共 6）</text>';
    s+='</svg>';
    return s;
  };

  /* 53. 最大子数组和 — Kadane */
  D["53"] = function() {
    return '<svg viewBox="0 0 540 180" xmlns="http://www.w3.org/2000/svg">' + STYLE +
      '<text x="270" y="24" class="dg-label">Kadane：dp[i]=max(nums[i], dp[i-1]+nums[i])</text>' +
      '<text x="270" y="70" class="dg-text" text-anchor="middle">nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]</text>' +
      '<text x="270" y="100" class="dg-text" text-anchor="middle" fill="#34c759">子数组 [4, -1, 2, 1] 和 = 6（最大）</text>' +
      '<rect x="180" y="115" width="220" height="30" rx="6" fill="rgba(52,199,89,.15)" stroke="#34c759"/>' +
      '<text x="270" y="135" class="dg-text-sm" fill="#34c759">↑ 连续子数组，不能跳过元素</text>' +
      '<text x="270" y="168" class="dg-text-sm">每步：要么延续，要么从当前元素重新开始</text>' +
      '</svg>';
  };

  /* 70. 爬楼梯 — DP 状态转移 */
  D["70"] = function() {
    var s='<svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg">'+STYLE;
    s+='<text x="210" y="22" class="dg-label">dp[n] = dp[n-1] + dp[n-2]  （斐波那契）</text>';
    var dp=[1,2,3,5,8];
    dp.forEach(function(v,i){
      var x=40+i*72, y=160-i*22;
      s+='<rect x="'+x+'" y="'+(y-30)+'" width="56" height="30" rx="6" class="dg-node-hi"/>';
      s+='<text x="'+(x+28)+'" y="'+(y-15)+'" class="dg-text" fill="#fff">'+v+'</text>';
      s+='<text x="'+(x+28)+'" y="'+(y+10)+'" class="dg-text-sm">n='+(i+1)+'</text>';
      if(i>0){s+='<line x1="'+(x-16)+'" y1="'+(y-15)+'" x2="'+x+'" y2="'+(y-15)+'" class="dg-line-hi" marker-end="url(#dps)"/>';}
    });
    s+='<defs><marker id="dps" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#0071e3"/></marker></defs>';
    s+='</svg>';
    return s;
  };

  /* 102. 二叉树层序遍历 — BFS */
  D["102"] = function() {
    return '<svg viewBox="0 0 420 240" xmlns="http://www.w3.org/2000/svg">' + STYLE +
      '<text x="210" y="22" class="dg-label">BFS：队列逐层出队，结果 [[3],[9,20],[15,7]]</text>' +
      tn(210,50,'3')+
      link(210,62,140,110)+link(210,62,280,110)+
      tn(140,120,'9')+tn(280,120,'20')+
      link(280,132,250,180)+link(280,132,310,180)+
      tn(250,190,'15')+tn(310,190,'7')+
      '<text x="210" y="230" class="dg-text-sm">用 queue，每层处理 size 个节点</text>' +
      '</svg>';
    function tn(cx,cy,v){return '<circle cx="'+cx+'" cy="'+cy+'" r="18" class="dg-node"/><text x="'+cx+'" y="'+cy+'" class="dg-text">'+v+'</text>';}
    function link(x1,y1,x2,y2){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="dg-line"/>';}
  };

  /* 94. 二叉树中序遍历 — 左根右 */
  D["94"] = function() {
    return '<svg viewBox="0 0 420 240" xmlns="http://www.w3.org/2000/svg">' + STYLE +
      '<text x="210" y="22" class="dg-label">中序：左 → 根 → 右  ⇒  [1, 2, 3]（BST 升序）</text>' +
      tn(210,50,'2')+
      link(210,62,140,110)+link(210,62,280,110)+
      tn(140,120,'1')+tn(280,120,'3')+
      '<path d="M140,138 Q60,170 60,120" class="dg-line-hi" fill="none"/>'+
      '<text x="60" y="200" class="dg-text-sm" fill="#0071e3">① 先访问 1</text>'+
      '<text x="160" y="200" class="dg-text-sm" fill="#ff9500">② 访问 2</text>'+
      '<text x="280" y="200" class="dg-text-sm" fill="#34c759">③ 访问 3</text>'+
      '</svg>';
    function tn(cx,cy,v){return '<circle cx="'+cx+'" cy="'+cy+'" r="18" class="dg-node"/><text x="'+cx+'" y="'+cy+'" class="dg-text">'+v+'</text>';}
    function link(x1,y1,x2,y2){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="dg-line"/>';}
  };

  /* 200. 岛屿数量 — DFS/BFS 染色 */
  D["200"] = function() {
    var g=[
      ['1','1','0','0','0'],
      ['1','1','0','0','0'],
      ['0','0','1','0','0'],
      ['0','0','0','1','1']
    ];
    var cs=44, ox=30, oy=50;
    var s='<svg viewBox="0 0 280 250" xmlns="http://www.w3.org/2000/svg">'+STYLE;
    s+='<text x="140" y="22" class="dg-label">DFS 把连成片的 1 染色 → 一个岛</text>';
    for(var r=0;r<g.length;r++)for(var c=0;c<g[r].length;c++){
      var x=ox+c*cs, y=oy+r*cs;
      var isLand=g[r][c]==='1';
      // island 1 = top-left block, island2 = (2,2), island3 = bottom-right two
      var isl = (r<2&&c<2)?'#34c759': (r===2&&c===2)?'#0071e3': (r===3&&c>=3)?'#ff9500': null;
      if(isLand&&isl){s+='<rect x="'+x+'" y="'+y+'" width="'+cs+'" height="'+cs+'" class="dg-grid-hi" stroke="'+isl+'" fill="'+isl+'" fill-opacity=".2"/>';}
      else if(isLand){s+='<rect x="'+x+'" y="'+y+'" width="'+cs+'" height="'+cs+'" class="dg-grid"/><text x="'+(x+cs/2)+'" y="'+(y+cs/2)+'" class="dg-text">1</text>';}
      else{s+='<rect x="'+x+'" y="'+y+'" width="'+cs+'" height="'+cs+'" class="dg-grid"/><text x="'+(x+cs/2)+'" y="'+(y+cs/2)+'" class="dg-text-sm">0</text>';}
    }
    s+='<text x="140" y="240" class="dg-text-sm">三种颜色 = 三个岛屿</text>';
    s+='</svg>';
    return s;
  };

  /* 20. 有效的括号 — 栈 */
  D["20"] = function() {
    return '<svg viewBox="0 0 480 180" xmlns="http://www.w3.org/2000/svg">' + STYLE +
      '<text x="240" y="24" class="dg-label">栈：左括号入栈，右括号必须匹配栈顶</text>' +
      '<text x="240" y="60" class="dg-text">输入: ( { [ ] } )</text>' +
      stack(120,150,'(','#0071e3')+stack(160,150,'{','#0071e3')+stack(200,150,'[','#0071e3')+
      '<text x="360" y="150" class="dg-text-sm" fill="#34c759">遇到 ] → 弹出 [ ✓</text>'+
      '<text x="360" y="170" class="dg-text-sm" fill="#34c759">全部匹配 → 合法</text>'+
      '<text x="240" y="105" class="dg-text-sm">栈底 ←————————→ 栈顶</text>'+
      '</svg>';
    function stack(x,y,v,color){return '<rect x="'+x+'" y="'+(y-26)+'" width="36" height="26" class="dg-node" stroke="'+color+'"/><text x="'+(x+18)+'" y="'+(y-13)+'" class="dg-text">'+v+'</text>';}
  };

  /* 215. 第K大 — 快速选择分区 */
  D["215"] = function() {
    return '<svg viewBox="0 0 520 160" xmlns="http://www.w3.org/2000/svg">' + STYLE +
      '<text x="260" y="24" class="dg-label">快速选择：分区后只递归含目标的一侧，平均 O(n)</text>' +
      '<rect x="20" y="60" width="60" height="40" class="dg-node-ok"/><text x="50" y="85" class="dg-text" fill="#fff">≤p</text>' +
      '<rect x="80" y="60" width="60" height="40" class="dg-node-ok"/><text x="110" y="85" class="dg-text" fill="#fff">≤p</text>' +
      '<rect x="140" y="60" width="60" height="40" class="dg-node-hi"/><text x="170" y="85" class="dg-text" fill="#fff">pivot</text>' +
      '<rect x="200" y="60" width="60" height="40" class="dg-node-warn"/><text x="230" y="85" class="dg-text" fill="#fff">&gt;p</text>' +
      '<rect x="260" y="60" width="60" height="40" class="dg-node-warn"/><text x="290" y="85" class="dg-text" fill="#fff">&gt;p</text>' +
      '<text x="170" y="130" class="dg-text-sm">pivot 落点决定第几大，只递归目标侧</text>' +
      '</svg>';
  };

  /* 3. 无重复最长子串 — 滑动窗口 */
  D["3"] = function() {
    return '<svg viewBox="0 0 520 160" xmlns="http://www.w3.org/2000/svg">' + STYLE +
      '<text x="260" y="24" class="dg-label">滑动窗口：右扩，遇重复则左缩，维护 set</text>' +
      '<rect x="40" y="60" width="44" height="44" class="dg-node-hi"/><text x="62" y="85" class="dg-text" fill="#fff">a</text>' +
      '<rect x="84" y="60" width="44" height="44" class="dg-node-hi"/><text x="106" y="85" class="dg-text" fill="#fff">b</text>' +
      '<rect x="128" y="60" width="44" height="44" class="dg-node-hi"/><text x="150" y="85" class="dg-text" fill="#fff">c</text>' +
      '<rect x="172" y="60" width="44" height="44" class="dg-node"/><text x="194" y="85" class="dg-text">a</text>' +
      '<rect x="216" y="60" width="44" height="44" class="dg-node"/><text x="238" y="85" class="dg-text">b</text>' +
      '<text x="40" y="130" class="dg-text-sm" fill="#0071e3">left</text>' +
      '<text x="216" y="130" class="dg-text-sm" fill="#ff3b30">right</text>' +
      '<text x="260" y="150" class="dg-text-sm">窗口 [a,b,c] 无重复 = 3（最长）</text>' +
      '</svg>';
  };

  /* 15. 三数之和 — 排序+双指针 */
  D["15"] = function() {
    return '<svg viewBox="0 0 520 170" xmlns="http://www.w3.org/2000/svg">' + STYLE +
      '<text x="260" y="24" class="dg-label">排序后固定 i，左右双指针找 -nums[i]</text>' +
      '<rect x="20" y="60" width="50" height="40" class="dg-node"/><text x="45" y="85" class="dg-text">-4</text>' +
      '<rect x="70" y="60" width="50" height="40" class="dg-node"/><text x="95" y="85" class="dg-text">-1</text>' +
      '<rect x="120" y="60" width="50" height="40" class="dg-node-hi"/><text x="145" y="85" class="dg-text" fill="#fff">-1</text>' +
      '<rect x="170" y="60" width="50" height="40" class="dg-node-ok"/><text x="195" y="85" class="dg-text" fill="#fff">0</text>' +
      '<rect x="220" y="60" width="50" height="40" class="dg-node"/><text x="245" y="85" class="dg-text">1</text>' +
      '<rect x="270" y="60" width="50" height="40" class="dg-node"/><text x="295" y="85" class="dg-text">2</text>' +
      '<rect x="320" y="60" width="50" height="40" class="dg-node-warn"/><text x="345" y="85" class="dg-text" fill="#fff">2</text>' +
      '<text x="145" y="125" class="dg-text-sm" fill="#0071e3">i (固定)</text>' +
      '<text x="195" y="125" class="dg-text-sm" fill="#34c759">left</text>' +
      '<text x="345" y="125" class="dg-text-sm" fill="#ff9500">right</text>' +
      '<text x="260" y="155" class="dg-text-sm">和 &lt; 0 → left++；和 &gt; 0 → right--</text>' +
      '</svg>';
  };

  return {
    get: function(id) {
      var v = D[id];
      return v ? (typeof v === 'function' ? v() : v) : null;
    },
    keys: function() { return Object.keys(D); }
  };
})();

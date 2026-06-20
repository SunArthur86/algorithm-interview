/* ===== 二分查找(6) + 栈(5) + 堆(3) ====== */

// #35 搜索插入位置
VIZ_TRACES["35"] = function() {
  var nums = [1,3,5,6], target = 2, frames = [];
  var left = 0, right = nums.length - 1;
  frames.push({type:'array', array:nums.slice(), pointers:{left:left, right:right}, msg:'找 ' + target + ' 的插入位置'});
  while (left <= right) {
    var mid = Math.floor((left + right) / 2);
    var hl = {}; hl[mid] = 'current'; hl[left] = 'sorted'; hl[right] = 'compare';
    frames.push({type:'array', array:nums.slice(), pointers:{left:left, mid:mid, right:right}, highlights:hl, msg:'mid=' + mid + ', nums[mid]=' + nums[mid]});
    if (nums[mid] === target) { frames.push({type:'array', array:nums.slice(), highlights:hl, result:'✅ 插入位置=' + mid, msg:'✅ 找到, 位置=' + mid}); return frames; }
    else if (nums[mid] < target) { frames.push({type:'array', array:nums.slice(), pointers:{left:mid+1, right:right}, msg:nums[mid] + ' < ' + target + ', left=mid+1'}); left = mid+1; }
    else { frames.push({type:'array', array:nums.slice(), pointers:{left:left, right:mid-1}, msg:nums[mid] + ' > ' + target + ', right=mid-1'}); right = mid-1; }
  }
  frames.push({type:'array', array:nums.slice(), result:'✅ 插入位置=' + left, msg:'✅ 插入位置=' + left});
  return frames;
};

// #74 搜索二维矩阵
VIZ_TRACES["74"] = function() {
  var matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3, frames = [];
  var m = matrix.length, n = matrix[0].length, left = 0, right = m*n-1;
  frames.push({type:'grid', grid:matrix, msg:'展开为一维数组二分搜索 ' + target});
  while (left <= right) {
    var mid = Math.floor((left + right) / 2);
    var r = Math.floor(mid / n), c = mid % n;
    var hl = {}; hl[r+','+c] = 'current';
    frames.push({type:'grid', grid:matrix, highlights:hl, pointers:{r:r, c:c}, msg:'mid=' + mid + ' → [' + r + ',' + c + ']=' + matrix[r][c]});
    if (matrix[r][c] === target) { frames.push({type:'grid', grid:matrix, highlights:hl, result:'✅ 找到!', msg:'✅ 找到 ' + target + ' at [' + r + ',' + c + ']'}); return frames; }
    else if (matrix[r][c] < target) left = mid+1;
    else right = mid-1;
  }
  frames.push({type:'grid', grid:matrix, result:'未找到', msg:'未找到'});
  return frames;
};

// #34 查找元素的第一个和最后一个位置
VIZ_TRACES["34"] = function() {
  var nums = [5,7,7,8,8,10], target = 8, frames = [];
  function searchBound(leftBias) {
    var lo = 0, hi = nums.length - 1, ans = -1;
    while (lo <= hi) {
      var mid = Math.floor((lo + hi) / 2);
      var hl = {}; hl[mid] = 'current'; hl[lo] = 'sorted'; hl[hi] = 'compare';
      frames.push({type:'array', array:nums.slice(), pointers:{lo:lo, mid:mid, hi:hi}, highlights:hl, msg:(leftBias?'左':'右') + '边界: mid=' + mid + ', nums[mid]=' + nums[mid]});
      if (nums[mid] > target) hi = mid-1;
      else if (nums[mid] < target) lo = mid+1;
      else { ans = mid; if (leftBias) hi = mid-1; else lo = mid+1; }
    }
    return ans;
  }
  var l = searchBound(true);
  frames.push({type:'array', array:nums.slice(), highlights:{l:'found'}, msg:'✅ 左边界=' + l});
  var r = searchBound(false);
  frames.push({type:'array', array:nums.slice(), highlights:{l:'found', r:'found'}, result:'✅ [' + l + ',' + r + ']', msg:'✅ [' + l + ', ' + r + ']'});
  return frames;
};

// #33 搜索旋转排序数组
VIZ_TRACES["33"] = function() {
  var nums = [4,5,6,7,0,1,2], target = 0, frames = [];
  var left = 0, right = nums.length-1;
  frames.push({type:'array', array:nums.slice(), pointers:{left:left, right:right}, msg:'旋转数组找 ' + target});
  while (left <= right) {
    var mid = Math.floor((left + right) / 2);
    var hl = {}; hl[mid] = 'current'; hl[left] = 'sorted'; hl[right] = 'compare';
    if (nums[mid] === target) { frames.push({type:'array', array:nums.slice(), highlights:hl, result:'✅ 位置=' + mid, msg:'✅ 位置=' + mid}); return frames; }
    if (nums[left] <= nums[mid]) {
      frames.push({type:'array', array:nums.slice(), pointers:{left:left, mid:mid, right:right}, highlights:hl, msg:'左半有序 [' + left + '~' + mid + ']'});
      if (nums[left] <= target && target < nums[mid]) { right = mid-1; } else { left = mid+1; }
    } else {
      frames.push({type:'array', array:nums.slice(), pointers:{left:left, mid:mid, right:right}, highlights:hl, msg:'右半有序 [' + mid + '~' + right + ']'});
      if (nums[mid] < target && target <= nums[right]) { left = mid+1; } else { right = mid-1; }
    }
  }
  frames.push({type:'array', array:nums.slice(), result:'未找到', msg:'未找到'});
  return frames;
};

// #153 寻找旋转数组最小值
VIZ_TRACES["153"] = function() {
  var nums = [3,4,5,1,2], frames = [];
  var left = 0, right = nums.length-1;
  frames.push({type:'array', array:nums.slice(), pointers:{left:left, right:right}, msg:'旋转排序数组找最小值'});
  while (left < right) {
    var mid = Math.floor((left + right) / 2);
    var hl = {}; hl[mid] = 'current'; hl[left] = 'sorted'; hl[right] = 'compare';
    frames.push({type:'array', array:nums.slice(), pointers:{left:left, mid:mid, right:right}, highlights:hl, msg:'nums[mid]=' + nums[mid] + ' vs nums[right]=' + nums[right]});
    if (nums[mid] > nums[right]) { left = mid+1; } else { right = mid; }
  }
  frames.push({type:'array', array:nums.slice(), highlights:{left:'found'}, result:'✅ 最小值=' + nums[left], msg:'✅ 最小值=' + nums[left]});
  return frames;
};

// #4 寻找两个正序数组的中位数
VIZ_TRACES["4"] = function() {
  var nums1 = [1,3], nums2 = [2], frames = [];
  frames.push({type:'array', array:nums1.concat(['|']).concat(nums2), msg:'nums1=[1,3], nums2=[2], 合并后=[1,2,3], 中位数=2'});
  var merged = []; var i=0,j=0;
  while (i<nums1.length&&j<nums2.length) { if(nums1[i]<=nums2[j]) merged.push(nums1[i++]); else merged.push(nums2[j++]); }
  while(i<nums1.length) merged.push(nums1[i++]);
  while(j<nums2.length) merged.push(nums2[j++]);
  var n = merged.length, median = n%2 ? merged[Math.floor(n/2)] : (merged[n/2-1]+merged[n/2])/2;
  var mid1 = Math.floor((n-1)/2), mid2 = Math.ceil((n-1)/2);
  var hl = {}; hl[mid1] = 'current'; hl[mid2] = 'compare';
  frames.push({type:'array', array:merged.slice(), highlights:hl, msg:'合并: [' + merged.join(',') + ']'});
  frames.push({type:'array', array:merged.slice(), result:'✅ 中位数=' + median, msg:'✅ 中位数 = ' + median});
  return frames;
};

/* ====== 栈 (5题) ====== */

// #20 有效的括号
VIZ_TRACES["20"] = function() {
  var s = "()[]{}", frames = [], stack = [];
  var pairs = {')':'(',']':'[','}':'{'};
  frames.push({type:'stack', stacks:[[]], labels:['Stack'], msg:'遍历字符串, 遇左括号入栈, 遇右括号检查栈顶'});
  for (var i = 0; i < s.length; i++) {
    var ch = s[i];
    if (pairs[ch]) {
      if (stack.length && stack[stack.length-1] === pairs[ch]) {
        stack.pop();
        frames.push({type:'stack', stacks:[stack.slice()], labels:['Stack'], msg:s[i] + ' 匹配 ' + pairs[ch] + ' ✓, 弹出'});
      } else {
        frames.push({type:'stack', stacks:[stack.slice()], labels:['Stack'], msg:s[i] + ' 不匹配! ✗'});
        return frames;
      }
    } else {
      stack.push(ch);
      frames.push({type:'stack', stacks:[stack.slice()], labels:['Stack'], msg:ch + ' 入栈'});
    }
  }
  frames.push({type:'stack', stacks:[stack.slice()], labels:['Stack'], result:'✅ 有效', msg:'✅ 有效括号'});
  return frames;
};

// #155 最小栈
VIZ_TRACES["155"] = function() {
  var frames = [], stack = [], minStack = [];
  var ops = [['push',-2],['push',0],['push',-3],['getMin'],['pop'],['top'],['getMin']];
  frames.push({type:'stack', stacks:[[],[]], labels:['Stack','MinStack'], msg:'双栈: 主栈+最小值栈, 同步push/pop'});
  ops.forEach(function(op) {
    if (op[0] === 'push') {
      stack.push(op[1]);
      minStack.push(minStack.length ? Math.min(minStack[minStack.length-1], op[1]) : op[1]);
      frames.push({type:'stack', stacks:[stack.slice(),minStack.slice()], labels:['Stack','MinStack'], msg:'push(' + op[1] + ') → min=' + minStack[minStack.length-1]});
    } else if (op[0] === 'pop') {
      stack.pop(); minStack.pop();
      frames.push({type:'stack', stacks:[stack.slice(),minStack.slice()], labels:['Stack','MinStack'], msg:'pop()'});
    } else if (op[0] === 'getMin') {
      frames.push({type:'stack', stacks:[stack.slice(),minStack.slice()], labels:['Stack','MinStack'], msg:'getMin() = ' + minStack[minStack.length-1]});
    } else if (op[0] === 'top') {
      frames.push({type:'stack', stacks:[stack.slice(),minStack.slice()], labels:['Stack','MinStack'], msg:'top() = ' + stack[stack.length-1]});
    }
  });
  frames.push({type:'stack', stacks:[stack.slice(),minStack.slice()], labels:['Stack','MinStack'], result:'✅ 完成', msg:'✅ 演示完成'});
  return frames;
};

// #394 字符串解码
VIZ_TRACES["394"] = function() {
  var s = "3[a2[c]]", frames = [];
  frames.push({type:'array', array:s.split(''), msg:'解析: 3[a2[c]] = 3[acc] = accaccacc'});
  var steps = [
    {arr:['3','[','a'], msg:'遇到3[, 入栈, 开始记录'},
    {arr:['2','[','c'], msg:'遇到2[, 入栈'},
    {arr:['c'], msg:'c, 记录'},
    {arr:['c','c'], msg:']: cc (2×c)'},
    {arr:['a','c','c'], msg:']: accaccacc (3×acc)'}
  ];
  steps.forEach(function(st) {
    frames.push({type:'array', array:st.arr.slice(), msg:st.msg});
  });
  frames.push({type:'array', array:['a','c','c','a','c','c','a','c','c'], result:'✅ = "accaccacc"', msg:'✅ 解码: accaccacc'});
  return frames;
};

// #739 每日温度
VIZ_TRACES["739"] = function() {
  var temps = [73,74,75,71,69,72,76,73], frames = [];
  var result = new Array(temps.length).fill(0), stack = [];
  frames.push({type:'array', array:temps.slice(), msg:'单调栈: 找每个温度后面第一个更高的温度'});
  for (var i = 0; i < temps.length; i++) {
    while (stack.length && temps[stack[stack.length-1]] < temps[i]) {
      var idx = stack.pop();
      result[idx] = i - idx;
      var hl = {}; hl[idx] = 'current'; hl[i] = 'compare';
      frames.push({type:'array', array:temps.slice(), pointers:{i:i}, highlights:hl, msg:temps[idx] + ' → ' + temps[i] + ', 等待' + (i-idx) + '天'});
    }
    stack.push(i);
    frames.push({type:'array', array:temps.slice(), pointers:{i:i}, highlights:{i:'current'}, msg:'i=' + i + ', 栈=[' + stack.join(',') + ']'});
  }
  frames.push({type:'array', array:result.slice(), result:'✅ [' + result.join(',') + ']', msg:'✅ [' + result.join(',') + ']'});
  return frames;
};

// #84 柱状图中最大的矩形
VIZ_TRACES["84"] = function() {
  var heights = [2,1,5,6,2,3], frames = [];
  var stack = [], maxArea = 0;
  frames.push({type:'array', array:heights.slice(), msg:'单调栈: 对每根柱子, 找左右第一个矮的, 计算面积'});
  for (var i = 0; i <= heights.length; i++) {
    var h = (i === heights.length) ? 0 : heights[i];
    while (stack.length && heights[stack[stack.length-1]] > h) {
      var idx = stack.pop();
      var width = stack.length ? i - stack[stack.length-1] - 1 : i;
      var area = heights[idx] * width;
      var hl = {}; for (var k = idx; k < i; k++) hl[k] = 'sorted'; hl[idx] = 'current';
      if (area > maxArea) maxArea = area;
      frames.push({type:'array', array:heights.slice(), pointers:{i:i}, highlights:hl, msg:'高度=' + heights[idx] + ', 宽度=' + width + ', 面积=' + area + (area>=maxArea?' ✨':'')});
    }
    stack.push(i);
  }
  frames.push({type:'array', array:heights.slice(), result:'✅ 最大面积=' + maxArea, msg:'✅ 最大矩形面积 = ' + maxArea});
  return frames;
};

/* ====== 堆 (3题) ====== */

// #215 数组中第K个最大元素
VIZ_TRACES["215"] = function() {
  var nums = [3,2,1,5,6,4], k = 2, frames = [];
  var arr = nums.slice();
  frames.push({type:'array', array:arr.slice(), msg:'快速选择: 第' + k + '大 = 第' + (nums.length-k+1) + '小'});
  function partition(lo, hi) {
    var pivot = arr[hi], i = lo;
    for (var j = lo; j < hi; j++) {
      var hl = {}; hl[j] = 'current'; hl[hi] = 'pivot';
      frames.push({type:'array', array:arr.slice(), pointers:{i:i, j:j}, highlights:hl, msg:'arr[' + j + ']=' + arr[j] + ' vs pivot=' + pivot});
      if (arr[j] < pivot) {
        var t = arr[i]; arr[i] = arr[j]; arr[j] = t; i++;
      }
    }
    var t2 = arr[i]; arr[i] = arr[hi]; arr[hi] = t2;
    frames.push({type:'array', array:arr.slice(), highlights:{i:'sorted'}, msg:'pivot就位: index=' + i});
    return i;
  }
  var target = nums.length - k, lo = 0, hi = nums.length-1;
  while (lo < hi) {
    var p = partition(lo, hi);
    if (p === target) break;
    else if (p < target) lo = p+1;
    else hi = p-1;
  }
  frames.push({type:'array', array:arr.slice(), highlights:{target:'found'}, result:'✅ 第' + k + '大=' + arr[target], msg:'✅ 第' + k + '大 = ' + arr[target]});
  return frames;
};

// #347 前K个高频元素
VIZ_TRACES["347"] = function() {
  var nums = [1,1,1,2,2,3], k = 2, frames = [];
  var freq = {};
  nums.forEach(function(n) { freq[n] = (freq[n]||0)+1; });
  var entries = Object.entries(freq).map(function(e){return [parseInt(e[0]),e[1]];}).sort(function(a,b){return b[1]-a[1];});
  frames.push({type:'hashmap', array:nums.slice(), map:Object.fromEntries(entries.map(function(e){return [e[0],e[1]];})), msg:'统计频率: ' + JSON.stringify(Object.fromEntries(entries.map(function(e){return [e[0],e[1]];})))});
  var topK = entries.slice(0, k);
  var result = topK.map(function(e){return e[0];});
  frames.push({type:'array', array:result, highlights:{0:'sorted',1:'sorted'}, result:'✅ [' + result.join(',') + ']', msg:'✅ 前' + k + '高频: [' + result.join(',') + ']'});
  return frames;
};

// #295 数据流的中位数
VIZ_TRACES["295"] = function() {
  var frames = [], maxHeap = [], minHeap = [];
  var ops = [1,2,3];
  frames.push({type:'stack', stacks:[[],[]], labels:['MaxHeap(小半)','MinHeap(大半)'], msg:'双堆: 小半用大顶堆, 大半用小顶堆, 中位数=堆顶'});
  ops.forEach(function(num) {
    if (!maxHeap.length || num <= maxHeap[maxHeap.length-1]) maxHeap.push(num);
    else minHeap.push(num);
    maxHeap.sort(function(a,b){return b-a;});
    minHeap.sort(function(a,b){return a-b;});
    if (maxHeap.length > minHeap.length+1) { minHeap.push(maxHeap.shift()); minHeap.sort(function(a,b){return a-b;}); }
    if (minHeap.length > maxHeap.length) { maxHeap.push(minHeap.shift()); maxHeap.sort(function(a,b){return b-a;}); }
    var median = maxHeap.length === minHeap.length ? (maxHeap[0]+minHeap[0])/2 : maxHeap[0];
    frames.push({type:'stack', stacks:[maxHeap.slice(),minHeap.slice()], labels:['MaxHeap(小半)','MinHeap(大半)'], msg:'add(' + num + ') → 中位数=' + median});
  });
  frames.push({type:'stack', stacks:[maxHeap.slice(),minHeap.slice()], labels:['MaxHeap(小半)','MinHeap(大半)'], result:'✅ 中位数=2', msg:'✅ 数据流中位数演示'});
  return frames;
};

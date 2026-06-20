/* ===== 100题可视化轨迹数据 ===== */
/* 每个函数返回 frames[] 数组，VizEngine 逐帧渲染 */
var VIZ_TRACES = {};

/* ====== 哈希 (3题) ====== */

// #1 两数之和
VIZ_TRACES["1"] = function() {
  var nums = [2, 7, 11, 15], target = 9, map = {}, frames = [];
  frames.push({type:'hashmap', array:nums.slice(), map:{}, msg:'目标: ' + target + '。遍历数组，查找 target-nums[i] 是否在哈希表中'});
  for (var i = 0; i < nums.length; i++) {
    var need = target - nums[i];
    frames.push({type:'hashmap', array:nums.slice(), idx:i, map:Object.assign({}, map), need:need, msg:'i=' + i + ', nums[' + i + ']=' + nums[i] + ', 需要 ' + need});
    if (map[need] !== undefined) {
      frames.push({type:'hashmap', array:nums.slice(), idx:i, map:Object.assign({}, map), found:[map[need], i], msg:'✅ 找到! ' + need + '+' + nums[i] + '=' + target + ', 返回 [' + map[need] + ', ' + i + ']'});
      return frames;
    }
    map[nums[i]] = i;
    frames.push({type:'hashmap', array:nums.slice(), idx:i, map:Object.assign({}, map), msg:'未找到 ' + need + ', 存入 ' + nums[i] + '→' + i});
  }
  return frames;
};

// #49 字母异位词分组
VIZ_TRACES["49"] = function() {
  var strs = ["eat","tea","tan","ate","nat","bat"], groups = {}, frames = [];
  frames.push({type:'hashmap', array:strs.slice(), map:{}, msg:'对每个字符串排序，相同排序结果的是字母异位词'});
  strs.forEach(function(s, i) {
    var key = s.split('').sort().join('');
    if (!groups[key]) groups[key] = [];
    var mapCopy = {}; Object.keys(groups).forEach(function(k) { mapCopy[k] = '[' + groups[k].join(',') + ']'; });
    frames.push({type:'hashmap', array:strs.slice(), idx:i, map:mapCopy, msg:'"' + s + '" → 排序: "' + key + '" → 分入该组'});
    groups[key].push(s);
  });
  var result = Object.values(groups);
  frames.push({type:'hashmap', array:strs.slice(), map:{}, msg:'✅ 分组完成: ' + JSON.stringify(result).replace(/"/g,'')});
  return frames;
};

// #128 最长连续序列
VIZ_TRACES["128"] = function() {
  var nums = [100, 4, 200, 1, 3, 2], set = {}, frames = [];
  nums.forEach(function(n) { set[n] = true; });
  frames.push({type:'array', array:nums.slice(), msg:'放入哈希集合: {100,4,200,1,3,2}'});
  var maxLen = 0, maxStart = 0;
  nums.forEach(function(n, i) {
    if (!set[n - 1]) {
      var len = 0, cur = n;
      var hl = {}; hl[i] = 'current';
      frames.push({type:'array', array:nums.slice(), highlights:hl, msg:n + ' 是序列起点 (没有 ' + (n-1) + ')'});
      while (set[cur]) {
        var idx = nums.indexOf(cur);
        hl = {}; if (idx >= 0) hl[idx] = 'sorted';
        frames.push({type:'array', array:nums.slice(), highlights:hl, msg:'检查 ' + cur + ' → 存在! len=' + (len + 1)});
        len++; cur++;
      }
      if (len > maxLen) { maxLen = len; maxStart = n; }
    }
  });
  var seq = []; for (var k = 0; k < maxLen; k++) seq.push(maxStart + k);
  frames.push({type:'array', array:nums.slice(), msg:'✅ 最长连续序列: [' + seq.join(',') + '], 长度=' + maxLen});
  return frames;
};

/* ====== 双指针 (4题) ====== */

// #283 移动零
VIZ_TRACES["283"] = function() {
  var nums = [0, 1, 0, 3, 12], frames = [];
  var slow = 0;
  frames.push({type:'array', array:nums.slice(), pointers:{slow:0, i:0}, msg:'双指针: slow指向非零位置, i遍历数组'});
  for (var i = 0; i < nums.length; i++) {
    frames.push({type:'array', array:nums.slice(), pointers:{slow:slow, i:i}, highlights:frames.length > 1 ? {} : {}, msg:'i=' + i + ', nums[' + i + ']=' + nums[i]});
    if (nums[i] !== 0) {
      var tmp = nums[slow]; nums[slow] = nums[i]; nums[i] = tmp;
      var hl = {}; hl[slow] = 'swap'; hl[i] = 'current';
      frames.push({type:'array', array:nums.slice(), pointers:{slow:slow, i:i}, highlights:hl, msg:'非零! 交换 slow=' + slow + ' 和 i=' + i + ' → [' + nums.join(',') + ']'});
      slow++;
    } else {
      var hl2 = {}; hl2[i] = 'pivot';
      frames.push({type:'array', array:nums.slice(), pointers:{slow:slow, i:i}, highlights:hl2, msg:'零, 跳过. slow 不动'});
    }
  }
  frames.push({type:'array', array:nums.slice(), msg:'✅ 完成! 所有零移到末尾: [' + nums.join(',') + ']'});
  return frames;
};

// #11 盛最多水的容器
VIZ_TRACES["11"] = function() {
  var height = [1, 8, 6, 2, 5, 4, 8, 3, 7], frames = [];
  var left = 0, right = height.length - 1, maxArea = 0;
  frames.push({type:'array', array:height.slice(), pointers:{left:left, right:right}, msg:'左右指针从两端开始'});
  while (left < right) {
    var w = right - left;
    var h = Math.min(height[left], height[right]);
    var area = w * h;
    var hl = {}; hl[left] = 'current'; hl[right] = 'compare';
    frames.push({type:'array', array:height.slice(), pointers:{left:left, right:right}, highlights:hl, msg:'宽=' + w + ', 高=' + h + ', 面积=' + area + (area > maxArea ? ' ✨新最大!' : '')});
    if (area > maxArea) maxArea = area;
    if (height[left] < height[right]) {
      frames.push({type:'array', array:height.slice(), pointers:{left:left+1, right:right}, highlights:{}, msg:'左边矮, left++ (留矮的没意义, 面积受限于矮边)'});
      left++;
    } else {
      frames.push({type:'array', array:height.slice(), pointers:{left:left, right:right-1}, highlights:{}, msg:'右边矮, right--'});
      right--;
    }
  }
  frames.push({type:'array', array:height.slice(), msg:'✅ 最大面积 = ' + maxArea});
  return frames;
};

// #15 三数之和
VIZ_TRACES["15"] = function() {
  var nums = [-1, 0, 1, 2, -1, -4], frames = [];
  nums.sort(function(a,b){return a-b;});
  frames.push({type:'array', array:nums.slice(), msg:'排序: [' + nums.join(',') + ']'});
  var results = [];
  for (var i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i-1]) continue;
    var left = i + 1, right = nums.length - 1;
    var hl = {}; hl[i] = 'pivot';
    frames.push({type:'array', array:nums.slice(), pointers:{i:i, left:left, right:right}, highlights:hl, msg:'固定 nums[' + i + ']=' + nums[i] + ', 双指针找两数之和=' + (-nums[i])});
    while (left < right) {
      var sum = nums[i] + nums[left] + nums[right];
      var hl2 = {}; hl2[i] = 'pivot'; hl2[left] = 'current'; hl2[right] = 'compare';
      if (sum === 0) {
        results.push([nums[i], nums[left], nums[right]]);
        frames.push({type:'array', array:nums.slice(), pointers:{i:i, left:left, right:right}, highlights:hl2, msg:'✅ 找到! [' + nums[i] + ',' + nums[left] + ',' + nums[right] + ']'});
        left++; right--;
      } else if (sum < 0) {
        frames.push({type:'array', array:nums.slice(), pointers:{i:i, left:left+1, right:right}, highlights:hl2, msg:'和=' + sum + '<0, left++'});
        left++;
      } else {
        frames.push({type:'array', array:nums.slice(), pointers:{i:i, left:left, right:right-1}, highlights:hl2, msg:'和=' + sum + '>0, right--'});
        right--;
      }
    }
  }
  frames.push({type:'array', array:nums.slice(), msg:'✅ 结果: ' + JSON.stringify(results)});
  return frames;
};

// #42 接雨水
VIZ_TRACES["42"] = function() {
  var height = [0,1,0,2,1,0,1,3,2,1,2,1], frames = [];
  var left = 0, right = height.length - 1;
  var leftMax = 0, rightMax = 0, water = 0;
  frames.push({type:'array', array:height.slice(), pointers:{left:left, right:right}, msg:'双指针从两端, 记录左右最大高度'});
  while (left < right) {
    var hl = {}; hl[left] = 'current'; hl[right] = 'compare';
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
        frames.push({type:'array', array:height.slice(), pointers:{left:left, right:right}, highlights:hl, msg:'left=' + left + ', 更新 leftMax=' + leftMax});
      } else {
        water += leftMax - height[left];
        frames.push({type:'array', array:height.slice(), pointers:{left:left, right:right}, highlights:hl, msg:'left=' + left + ', 可接水 ' + (leftMax - height[left]) + ', 总计=' + water});
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
        frames.push({type:'array', array:height.slice(), pointers:{left:left, right:right}, highlights:hl, msg:'right=' + right + ', 更新 rightMax=' + rightMax});
      } else {
        water += rightMax - height[right];
        frames.push({type:'array', array:height.slice(), pointers:{left:left, right:right}, highlights:hl, msg:'right=' + right + ', 可接水 ' + (rightMax - height[right]) + ', 总计=' + water});
      }
      right--;
    }
  }
  frames.push({type:'array', array:height.slice(), msg:'✅ 总接雨水量 = ' + water});
  return frames;
};

/* ====== 滑动窗口 (2题) ====== */

// #3 无重复字符的最长子串
VIZ_TRACES["3"] = function() {
  var s = "abcabcbb", frames = [];
  var charSet = {}, left = 0, maxLen = 0, maxStart = 0;
  frames.push({type:'array', array:s.split(''), pointers:{left:0, right:0}, windowRange:[0,0], msg:'滑动窗口: left~right 维护无重复子串'});
  for (var right = 0; right < s.length; right++) {
    while (charSet[s[right]] !== undefined) {
      var hl = {}; for (var k = left; k <= right; k++) hl[k] = 'window';
      frames.push({type:'array', array:s.split(''), pointers:{left:left, right:right}, highlights:hl, windowRange:[left,right], msg:'s[' + right + ']=\'' + s[right] + '\' 重复! 收缩 left'});
      delete charSet[s[left]]; left++;
    }
    charSet[s[right]] = true;
    var len = right - left + 1;
    var hl2 = {}; for (var k2 = left; k2 <= right; k2++) hl2[k2] = 'sorted';
    frames.push({type:'array', array:s.split(''), pointers:{left:left, right:right}, highlights:hl2, windowRange:[left,right], msg:'窗口[' + left + '~' + right + '] 长度=' + len + (len > maxLen ? ' ✨新最大!' : '')});
    if (len > maxLen) { maxLen = len; maxStart = left; }
  }
  frames.push({type:'array', array:s.split(''), msg:'✅ 最长无重复子串: "' + s.substring(maxStart, maxStart + maxLen) + '", 长度=' + maxLen});
  return frames;
};

// #438 找到字符串中所有字母异位词
VIZ_TRACES["438"] = function() {
  var s = "cbaebabacd", p = "abc", frames = [];
  var need = {}, window = {};
  for (var i = 0; i < p.length; i++) { need[p[i]] = (need[p[i]]||0)+1; }
  var left = 0, valid = 0, result = [];
  frames.push({type:'array', array:s.split(''), pointers:{left:0, right:0}, msg:'目标p="abc", 滑动窗口大小=' + p.length});
  for (var right = 0; right < s.length; right++) {
    var c = s[right];
    if (need[c]) { window[c] = (window[c]||0)+1; if (window[c] === need[c]) valid++; }
    if (right - left + 1 >= p.length) {
      var hl = {}; for (var k = left; k <= right; k++) hl[k] = 'window';
      if (valid === Object.keys(need).length) {
        result.push(left);
        frames.push({type:'array', array:s.split(''), pointers:{left:left, right:right}, highlights:hl, windowRange:[left,right], msg:'✅ 匹配! 起始位置=' + left});
      } else {
        frames.push({type:'array', array:s.split(''), pointers:{left:left, right:right}, highlights:hl, windowRange:[left,right], msg:'窗口="' + s.substring(left, right+1) + '", valid=' + valid + '/' + Object.keys(need).length});
      }
      var d = s[left];
      if (need[d]) { if (window[d] === need[d]) valid--; window[d]--; }
      left++;
    }
  }
  frames.push({type:'array', array:s.split(''), msg:'✅ 异位词起始位置: [' + result.join(',') + ']'});
  return frames;
};

/* ====== 子串 (3题) ====== */

// #560 和为K的子数组
VIZ_TRACES["560"] = function() {
  var nums = [1, 1, 1], k = 2, frames = [];
  var prefixSum = 0, countMap = {0: 1}, count = 0;
  frames.push({type:'array', array:nums.slice(), msg:'前缀和+哈希: 记录每个前缀和出现的次数, 初始 {0:1}'});
  for (var i = 0; i < nums.length; i++) {
    prefixSum += nums[i];
    var hl = {}; hl[i] = 'current';
    var mapCopy = {}; Object.keys(countMap).forEach(function(key){ mapCopy[key] = countMap[key]; });
    frames.push({type:'hashmap', array:nums.slice(), idx:i, map:mapCopy, msg:'i=' + i + ', prefixSum=' + prefixSum + ', 查找 ' + (prefixSum - k) + ' 是否在哈希表'});
    if (countMap[prefixSum - k] !== undefined) {
      count += countMap[prefixSum - k];
      frames.push({type:'hashmap', array:nums.slice(), idx:i, map:mapCopy, found:[i, count], msg:'✅ 找到! prefixSum-' + k + '=' + (prefixSum-k) + ' 出现了' + countMap[prefixSum-k] + '次, count=' + count});
    }
    countMap[prefixSum] = (countMap[prefixSum] || 0) + 1;
    var mapCopy2 = {}; Object.keys(countMap).forEach(function(key){ mapCopy2[key] = countMap[key]; });
    frames.push({type:'hashmap', array:nums.slice(), idx:i, map:mapCopy2, msg:'存入 prefixSum=' + prefixSum + '→' + countMap[prefixSum]});
  }
  frames.push({type:'array', array:nums.slice(), msg:'✅ 和为' + k + '的子数组个数 = ' + count});
  return frames;
};

// #239 滑动窗口最大值
VIZ_TRACES["239"] = function() {
  var nums = [1,3,-1,-3,5,3,6,7], k = 3, frames = [];
  var deque = [], result = [];
  frames.push({type:'array', array:nums.slice(), pointers:{}, msg:'单调递减队列: 队首=当前窗口最大值的索引, 窗口k=' + k});
  for (var i = 0; i < nums.length; i++) {
    while (deque.length && nums[deque[deque.length-1]] < nums[i]) deque.pop();
    deque.push(i);
    if (deque[0] <= i - k) deque.shift();
    var hl = {}; deque.forEach(function(d){ hl[d] = 'sorted'; });
    frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'i=' + i + ', 队列(索引)=[' + deque.join(',') + '], 窗口=[' + Math.max(0,i-k+1) + '~' + i + ']'});
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
      frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'窗口最大值=' + nums[deque[0]] + ', 结果=' + JSON.stringify(result)});
    }
  }
  frames.push({type:'array', array:nums.slice(), msg:'✅ 结果: [' + result.join(',') + ']'});
  return frames;
};

// #76 最小覆盖子串
VIZ_TRACES["76"] = function() {
  var s = "ADOBECODEBANC", t = "ABC", frames = [];
  var need = {}, window = {};
  for (var i = 0; i < t.length; i++) need[t[i]] = (need[t[i]]||0)+1;
  var left = 0, valid = 0, minLen = Infinity, minStart = 0;
  frames.push({type:'array', array:s.split(''), pointers:{left:0, right:0}, msg:'目标t="ABC", 滑动窗口找最小覆盖子串'});
  for (var right = 0; right < s.length; right++) {
    var c = s[right];
    if (need[c]) { window[c] = (window[c]||0)+1; if (window[c] === need[c]) valid++; }
    while (valid === Object.keys(need).length) {
      if (right - left + 1 < minLen) { minLen = right - left + 1; minStart = left; }
      var hl = {}; for (var k = left; k <= right; k++) hl[k] = 'sorted';
      frames.push({type:'array', array:s.split(''), pointers:{left:left, right:right}, highlights:hl, windowRange:[left,right], msg:'覆盖! 窗口"' + s.substring(left,right+1) + '" len=' + (right-left+1)});
      var d = s[left];
      if (need[d]) { if (window[d] === need[d]) valid--; window[d]--; }
      left++;
    }
  }
  frames.push({type:'array', array:s.split(''), msg:'✅ 最小覆盖子串: "' + (minLen === Infinity ? '' : s.substring(minStart, minStart + minLen)) + '", 长度=' + minLen});
  return frames;
};

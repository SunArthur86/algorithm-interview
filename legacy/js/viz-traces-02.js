/* ===== 普通数组 (5题) + 技巧 (5题) ====== */

// #53 最大子数组和
VIZ_TRACES["53"] = function() {
  var nums = [-2,1,-3,4,-1,2,1,-5,4], frames = [];
  var dp = nums[0], maxSum = nums[0], maxEnd = 0;
  frames.push({type:'array', array:nums.slice(), pointers:{i:0}, highlights:{0:'current'}, msg:'dp[0]=' + nums[0] + ', maxSum=' + maxSum});
  for (var i = 1; i < nums.length; i++) {
    var prev = dp;
    dp = Math.max(nums[i], dp + nums[i]);
    var hl = {}; hl[i] = 'current';
    frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'dp[' + (i-1) + ']=' + prev + ', nums[' + i + ']=' + nums[i] + ' → max(' + nums[i] + ', ' + prev + '+' + nums[i] + '=' + (prev+nums[i]) + ')=' + dp});
    if (dp > maxSum) { maxSum = dp; maxEnd = i; }
    frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'maxSum=' + maxSum});
  }
  frames.push({type:'array', array:nums.slice(), msg:'✅ 最大子数组和 = ' + maxSum});
  return frames;
};

// #56 合并区间
VIZ_TRACES["56"] = function() {
  var intervals = [[1,3],[2,6],[8,10],[15,18]], frames = [];
  intervals.sort(function(a,b){return a[0]-b[0];});
  var result = [intervals[0]];
  frames.push({type:'array', array:intervals.map(function(v){return '['+v[0]+'-'+v[1]+']';}), highlights:{0:'sorted'}, msg:'排序后, 初始结果: [[' + intervals[0][0] + ',' + intervals[0][1] + ']]'});
  for (var i = 1; i < intervals.length; i++) {
    var last = result[result.length-1];
    var hl = {}; hl[i] = 'current';
    if (intervals[i][0] <= last[1]) {
      frames.push({type:'array', array:intervals.map(function(v){return '['+v[0]+'-'+v[1]+']';}), highlights:hl, msg:'区间[' + intervals[i][0] + ',' + intervals[i][1] + '] 与 [' + last[0] + ',' + last[1] + '] 重叠! 合并'});
      last[1] = Math.max(last[1], intervals[i][1]);
      frames.push({type:'array', array:intervals.map(function(v){return '['+v[0]+'-'+v[1]+']';}), highlights:hl, msg:'合并后: [' + last[0] + ',' + last[1] + ']'});
    } else {
      result.push(intervals[i]);
      frames.push({type:'array', array:intervals.map(function(v){return '['+v[0]+'-'+v[1]+']';}), highlights:hl, msg:'不重叠, 直接加入结果'});
    }
  }
  var resArr = result.map(function(v){return '['+v[0]+'-'+v[1]+']';});
  frames.push({type:'array', array:resArr, msg:'✅ 合并结果: ' + JSON.stringify(result)});
  return frames;
};

// #189 轮转数组
VIZ_TRACES["189"] = function() {
  var nums = [1,2,3,4,5,6,7], k = 3, frames = [];
  var arr = nums.slice();
  frames.push({type:'array', array:arr.slice(), msg:'原数组, k=' + k});
  // 三次翻转法
  function reverse(l, r) {
    while (l < r) { var t = arr[l]; arr[l] = arr[r]; arr[r] = t; l++; r--; }
  }
  frames.push({type:'array', array:arr.slice(), msg:'方法: 三次翻转. ① 翻转整个数组'});
  reverse(0, arr.length-1);
  frames.push({type:'array', array:arr.slice(), msg:'翻转后: [' + arr.join(',') + ']'});
  frames.push({type:'array', array:arr.slice(), highlights:{}, msg:'② 翻转前k个 [0~' + (k-1) + ']'});
  reverse(0, k-1);
  var hl1 = {}; for (var a=0;a<k;a++) hl1[a]='sorted';
  frames.push({type:'array', array:arr.slice(), highlights:hl1, msg:'翻转后: [' + arr.join(',') + ']'});
  frames.push({type:'array', array:arr.slice(), highlights:hl1, msg:'③ 翻转后n-k个 [' + k + '~' + (arr.length-1) + ']'});
  reverse(k, arr.length-1);
  var hl2 = {}; for (var b=k;b<arr.length;b++) hl2[b]='current';
  frames.push({type:'array', array:arr.slice(), highlights:hl2, msg:'✅ 最终: [' + arr.join(',') + ']'});
  return frames;
};

// #238 除自身以外数组的乘积
VIZ_TRACES["238"] = function() {
  var nums = [1,2,3,4], n = nums.length, frames = [];
  var result = new Array(n).fill(1);
  frames.push({type:'array', array:nums.slice(), msg:'前缀乘积: result[i] = 左侧所有数的乘积'});
  var prefix = 1;
  for (var i = 0; i < n; i++) {
    result[i] = prefix;
    var hl = {}; hl[i] = 'current';
    frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'i=' + i + ', result[' + i + '] = prefix = ' + prefix + ', prefix *= ' + nums[i]});
    prefix *= nums[i];
  }
  frames.push({type:'array', array:result.slice(), msg:'前缀乘积完成: [' + result.join(',') + ']'});
  var suffix = 1;
  for (var j = n-1; j >= 0; j--) {
    var hl2 = {}; hl2[j] = 'current';
    frames.push({type:'array', array:result.slice(), pointers:{i:j}, highlights:hl2, msg:'i=' + j + ', result[' + j + '] *= suffix = ' + suffix + ' → ' + (result[j]*suffix)});
    result[j] *= suffix;
    suffix *= nums[j];
  }
  frames.push({type:'array', array:result.slice(), msg:'✅ 结果: [' + result.join(',') + ']'});
  return frames;
};

// #41 缺失的第一个正数
VIZ_TRACES["41"] = function() {
  var nums = [3,4,-1,1], n = nums.length, frames = [];
  frames.push({type:'array', array:nums.slice(), msg:'原地哈希: 让nums[i]放在nums[i]-1的位置'});
  for (var i = 0; i < n; i++) {
    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i]-1] !== nums[i]) {
      var hl = {}; hl[i] = 'current'; hl[nums[i]-1] = 'swap';
      frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'nums[' + i + ']=' + nums[i] + ' 应该放位置' + (nums[i]-1) + ', 交换'});
      var tmp = nums[nums[i]-1]; nums[nums[i]-1] = nums[i]; nums[i] = tmp;
      frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'交换后: [' + nums.join(',') + ']'});
    }
  }
  frames.push({type:'array', array:nums.slice(), msg:'归位完成, 现在找第一个不匹配的'});
  for (var k = 0; k < n; k++) {
    var hl2 = {}; hl2[k] = 'current';
    if (nums[k] !== k+1) {
      frames.push({type:'array', array:nums.slice(), highlights:hl2, msg:'✅ nums[' + k + ']=' + nums[k] + ' ≠ ' + (k+1) + ', 缺失的第一个正数 = ' + (k+1)});
      return frames;
    }
    frames.push({type:'array', array:nums.slice(), highlights:hl2, msg:'nums[' + k + ']=' + nums[k] + ' ✓ 正确'});
  }
  frames.push({type:'array', array:nums.slice(), msg:'✅ 所有位置正确, 缺失的第一个正数 = ' + (n+1)});
  return frames;
};

// #136 只出现一次的数字
VIZ_TRACES["136"] = function() {
  var nums = [4,1,2,1,2], frames = [];
  var result = 0;
  frames.push({type:'array', array:nums.slice(), msg:'异或法: 相同的数异或=0, 最终剩下出现一次的数'});
  for (var i = 0; i < nums.length; i++) {
    var hl = {}; hl[i] = 'current';
    frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:result + ' ⊕ ' + nums[i] + ' = ' + (result ^ nums[i])});
    result ^= nums[i];
  }
  frames.push({type:'array', array:nums.slice(), msg:'✅ 只出现一次的数字 = ' + result});
  return frames;
};

// #169 多数元素
VIZ_TRACES["169"] = function() {
  var nums = [3,2,3], frames = [];
  var candidate = nums[0], count = 1;
  frames.push({type:'array', array:nums.slice(), pointers:{i:0}, highlights:{0:'current'}, msg:'Boyer-Moore 投票: candidate=' + candidate + ', count=' + count});
  for (var i = 1; i < nums.length; i++) {
    var hl = {}; hl[i] = 'current';
    if (count === 0) {
      candidate = nums[i];
      frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'count=0, 新候选人=' + candidate});
    }
    if (nums[i] === candidate) {
      count++;
      frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'nums[' + i + ']=' + nums[i] + ' == candidate, count=' + count});
    } else {
      count--;
      frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'nums[' + i + ']=' + nums[i] + ' ≠ candidate, count=' + count});
    }
  }
  frames.push({type:'array', array:nums.slice(), msg:'✅ 多数元素 = ' + candidate});
  return frames;
};

// #75 颜色分类
VIZ_TRACES["75"] = function() {
  var nums = [2,0,2,1,1,0], frames = [];
  var low = 0, mid = 0, high = nums.length - 1;
  frames.push({type:'array', array:nums.slice(), pointers:{low:0, mid:0, high:high}, msg:'荷兰国旗: low/mid/high 三指针'});
  while (mid <= high) {
    var hl = {}; hl[low] = 'sorted'; hl[mid] = 'current'; hl[high] = 'pivot';
    frames.push({type:'array', array:nums.slice(), pointers:{low:low, mid:mid, high:high}, highlights:hl, msg:'nums[mid]=' + nums[mid]});
    if (nums[mid] === 0) {
      var t = nums[low]; nums[low] = nums[mid]; nums[mid] = t;
      frames.push({type:'array', array:nums.slice(), pointers:{low:low+1, mid:mid+1, high:high}, highlights:hl, msg:'0 → 交换到low位置, low++, mid++'});
      low++; mid++;
    } else if (nums[mid] === 1) {
      frames.push({type:'array', array:nums.slice(), pointers:{low:low, mid:mid+1, high:high}, highlights:hl, msg:'1 → 已就位, mid++'});
      mid++;
    } else {
      var t2 = nums[mid]; nums[mid] = nums[high]; nums[high] = t2;
      frames.push({type:'array', array:nums.slice(), pointers:{low:low, mid:mid, high:high-1}, highlights:hl, msg:'2 → 交换到high位置, high--'});
      high--;
    }
  }
  frames.push({type:'array', array:nums.slice(), msg:'✅ 排序完成: [' + nums.join(',') + ']'});
  return frames;
};

// #31 下一个排列
VIZ_TRACES["31"] = function() {
  var nums = [1,2,3], frames = [];
  var n = nums.length, i = n - 2;
  frames.push({type:'array', array:nums.slice(), msg:'找下一个排列: ①从右往左找第一个降序位置i'});
  while (i >= 0 && nums[i] >= nums[i+1]) i--;
  if (i >= 0) {
    var hl = {}; hl[i] = 'current';
    frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'找到 i=' + i + ', nums[i]=' + nums[i]});
    var j = n - 1;
    while (nums[j] <= nums[i]) j--;
    hl[j] = 'swap';
    frames.push({type:'array', array:nums.slice(), pointers:{i:i, j:j}, highlights:hl, msg:'②从右找第一个>nums[i]的: j=' + j + ', nums[j]=' + nums[j] + ', 交换'});
    var t = nums[i]; nums[i] = nums[j]; nums[j] = t;
    frames.push({type:'array', array:nums.slice(), highlights:hl, msg:'交换后: [' + nums.join(',') + ']'});
  } else {
    frames.push({type:'array', array:nums.slice(), msg:'没有降序位置, 当前已是最大排列'});
  }
  frames.push({type:'array', array:nums.slice(), msg:'③翻转i+1到末尾: [' + nums.slice(i+1).reverse().join(',') + ']'});
  var left = i+1, right = n-1;
  while (left < right) { var t2 = nums[left]; nums[left] = nums[right]; nums[right] = t2; left++; right--; }
  frames.push({type:'array', array:nums.slice(), msg:'✅ 下一个排列: [' + nums.join(',') + ']'});
  return frames;
};

// #287 寻找重复数
VIZ_TRACES["287"] = function() {
  var nums = [1,3,4,2,2], frames = [];
  var slow = nums[0], fast = nums[0];
  frames.push({type:'array', array:nums.slice(), pointers:{slow:0, fast:0}, msg:'快慢指针: 把数组看成链表, nums[i]是next指针, 重复数=环入口'});
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
    frames.push({type:'array', array:nums.slice(), pointers:{slow:slow, fast:fast}, msg:'slow→' + slow + ', fast→' + fast});
  } while (slow !== fast);
  frames.push({type:'array', array:nums.slice(), pointers:{slow:slow, fast:fast}, highlights:{slow:'found'}, msg:'相遇! slow=' + slow + ', fast=' + fast});
  slow = nums[0];
  frames.push({type:'array', array:nums.slice(), pointers:{slow:0, fast:fast}, msg:'重置slow=0, 两指针同速前进'});
  while (slow !== fast) {
    slow = nums[slow]; fast = nums[fast];
    frames.push({type:'array', array:nums.slice(), pointers:{slow:slow, fast:fast}, msg:'slow→' + slow + ', fast→' + fast});
  }
  frames.push({type:'array', array:nums.slice(), msg:'✅ 重复数 = ' + slow});
  return frames;
};

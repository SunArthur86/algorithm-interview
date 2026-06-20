/* ===== 贪心(4) + 动态规划(10) + 多维DP(5) ====== */

// #121 买卖股票最佳时机
VIZ_TRACES["121"] = function() {
  var prices = [7,1,5,3,6,4], frames = [];
  var minPrice = Infinity, maxProfit = 0;
  frames.push({type:'array', array:prices.slice(), msg:'遍历: 维护最低买入价和最大利润'});
  for (var i = 0; i < prices.length; i++) {
    var hl = {}; hl[i] = 'current';
    if (prices[i] < minPrice) {
      minPrice = prices[i];
      frames.push({type:'array', array:prices.slice(), pointers:{i:i}, highlights:hl, msg:'新最低价=' + minPrice});
    }
    var profit = prices[i] - minPrice;
    if (profit > maxProfit) {
      maxProfit = profit;
      frames.push({type:'array', array:prices.slice(), pointers:{i:i}, highlights:hl, msg:'卖出' + prices[i] + '-买入' + minPrice + '=利润' + profit + ' ✨'});
    } else {
      frames.push({type:'array', array:prices.slice(), pointers:{i:i}, highlights:hl, msg:prices[i] + '-' + minPrice + '=' + profit + ', maxProfit=' + maxProfit});
    }
  }
  frames.push({type:'array', array:prices.slice(), result:'✅ 最大利润=' + maxProfit, msg:'✅ 最大利润=' + maxProfit});
  return frames;
};

// #55 跳跃游戏
VIZ_TRACES["55"] = function() {
  var nums = [2,3,1,1,4], frames = [];
  var maxReach = 0;
  frames.push({type:'array', array:nums.slice(), pointers:{i:0}, highlights:{0:'current'}, msg:'贪心: 维护能到达的最远位置'});
  for (var i = 0; i < nums.length; i++) {
    var hl = {}; hl[i] = 'current';
    if (i > maxReach) { frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, result:'✗ 无法到达', msg:'✗ i=' + i + ' > maxReach=' + maxReach}); return frames; }
    maxReach = Math.max(maxReach, i + nums[i]);
    frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'i=' + i + ', nums[i]=' + nums[i] + ', maxReach=' + maxReach + (maxReach>=nums.length-1?' ✅':'')});
    if (maxReach >= nums.length-1) { frames.push({type:'array', array:nums.slice(), result:'✅ 可以到达', msg:'✅ 可以到达末尾'}); return frames; }
  }
  return frames;
};

// #45 跳跃游戏 II
VIZ_TRACES["45"] = function() {
  var nums = [2,3,1,1,4], frames = [];
  var jumps = 0, curEnd = 0, maxReach = 0;
  frames.push({type:'array', array:nums.slice(), pointers:{i:0}, msg:'贪心: 当前跳跃范围的边界, 到达边界则跳跃+1'});
  for (var i = 0; i < nums.length-1; i++) {
    maxReach = Math.max(maxReach, i + nums[i]);
    var hl = {}; hl[i] = 'current';
    frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'i=' + i + ', maxReach=' + maxReach});
    if (i === curEnd) {
      jumps++; curEnd = maxReach;
      var hl2 = {}; for (var k = i; k <= curEnd; k++) hl2[k] = 'sorted';
      frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl2, msg:'到达边界! jumps=' + jumps + ', 新边界=' + curEnd});
    }
  }
  frames.push({type:'array', array:nums.slice(), result:'✅ 最少' + jumps + '步', msg:'✅ 最少跳跃' + jumps + '次'});
  return frames;
};

// #763 划分字母区间
VIZ_TRACES["763"] = function() {
  var s = "ababcbacadefegdehijhklij", frames = [];
  var lastIdx = {};
  for (var i = 0; i < s.length; i++) lastIdx[s[i]] = i;
  frames.push({type:'array', array:s.split(''), msg:'先记录每个字母最后出现的位置, 然后贪心划分'});
  var start = 0, end = 0, parts = [];
  for (var j = 0; j < s.length; j++) {
    end = Math.max(end, lastIdx[s[j]]);
    var hl = {}; for (var k = start; k <= end; k++) hl[k] = 'window'; hl[j] = 'current';
    frames.push({type:'array', array:s.split(''), pointers:{i:j}, highlights:hl, windowRange:[start,end], msg:'s[' + j + ']=\'' + s[j] + '\', 最后位置=' + lastIdx[s[j]] + ', end=' + end});
    if (j === end) {
      parts.push(s.substring(start, end+1));
      frames.push({type:'array', array:s.split(''), highlights:hl, msg:'✅ 划分: "' + s.substring(start, end+1) + '" (len=' + (end-start+1) + ')'});
      start = j + 1;
    }
  }
  frames.push({type:'array', array:parts.map(function(p){return p.length;}), result:'✅ ' + JSON.stringify(parts), msg:'✅ 划分: ' + JSON.stringify(parts.map(function(p){return p.length;}))});
  return frames;
};

/* ====== 动态规划 (10题) ====== */

// #70 爬楼梯
VIZ_TRACES["70"] = function() {
  var n = 5, frames = [];
  var dp = [0,1,2];
  frames.push({type:'dptable', table:[[1],[2]], rowLabels:['n=1','n=2'], msg:'dp[i] = dp[i-1] + dp[i-2], dp[1]=1, dp[2]=2'});
  for (var i = 3; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
    var row = dp.slice(1,i+1).map(function(v){return v;});
    var table2d = [];
    for (var r = 0; r < row.length; r++) table2d.push([row[r]]);
    var hl = {}; hl[(r)+'/'+0] = 'current';
    var rowHL = {}; rowHL[(i-1)+''] = 'current';
    frames.push({type:'dptable', table:table2d, rowLabels:(function(){var l=[];for(var k=1;k<=i;k++)l.push('n='+k);return l;})(), highlights:rowHL, msg:'dp[' + i + '] = dp[' + (i-1) + '] + dp[' + (i-2) + '] = ' + dp[i-1] + '+' + dp[i-2] + '=' + dp[i]});
  }
  var finalTable = dp.slice(1).map(function(v){return [v];});
  frames.push({type:'dptable', table:finalTable, rowLabels:(function(){var l=[];for(var k=1;k<=n;k++)l.push('n='+k);return l;})(), result:'✅ ' + n + '级台阶=' + dp[n] + '种', msg:'✅ ' + n + '级台阶有' + dp[n] + '种方法'});
  return frames;
};

// #118 杨辉三角
VIZ_TRACES["118"] = function() {
  var numRows = 5, frames = [];
  var triangle = [[1]];
  frames.push({type:'dptable', table:triangle, msg:'杨辉三角: 每行首尾=1, 中间=上方两数之和'});
  for (var r = 1; r < numRows; r++) {
    var row = [1];
    for (var c = 1; c < r; c++) row.push(triangle[r-1][c-1] + triangle[r-1][c]);
    row.push(1);
    triangle.push(row);
    var hl = {};
    for (var k = 1; k < row.length-1; k++) hl[r+','+k] = 'current';
    frames.push({type:'dptable', table:triangle.slice(), highlights:hl, msg:'第' + r + '行: [' + row.join(',') + ']'});
  }
  frames.push({type:'dptable', table:triangle, result:'✅ 完成', msg:'✅ 杨辉三角构建完成'});
  return frames;
};

// #198 打家劫舍
VIZ_TRACES["198"] = function() {
  var nums = [2,7,9,3,1], frames = [];
  var dp = [nums[0], Math.max(nums[0], nums[1])];
  var table = [[nums[0], Math.max(nums[0],nums[1])]];
  frames.push({type:'dptable', table:table, colLabels:['0','1'], rowLabels:['dp'], msg:'dp[i] = max(dp[i-1], dp[i-2]+nums[i])'});
  for (var i = 2; i < nums.length; i++) {
    var prev1 = dp[i-1], prev2 = dp[i-2];
    dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    var hl = {}; hl['0,'+(i-1)] = 'dep1'; hl['0,'+(i-2)] = 'dep2'; hl['0,'+i] = 'current';
    frames.push({type:'dptable', table:[dp.slice()], colLabels:(function(){var l=[];for(var k=0;k<=i;k++)l.push(k);return l;})(), rowLabels:['dp'], highlights:hl, msg:'dp[' + i + '] = max(' + prev1 + ', ' + prev2 + '+' + nums[i] + '=' + (prev2+nums[i]) + ') = ' + dp[i]});
  }
  var ansHL = {}; ansHL['0,'+(nums.length-1)] = 'answer';
  frames.push({type:'dptable', table:[dp.slice()], colLabels:(function(){var l=[];for(var k=0;k<nums.length;k++)l.push(k);return l;})(), rowLabels:['dp'], highlights:ansHL, result:'✅ 最大=' + dp[nums.length-1], msg:'✅ 最大金额=' + dp[nums.length-1]});
  return frames;
};

// #279 完全平方数
VIZ_TRACES["279"] = function() {
  var n = 12, frames = [];
  var dp = new Array(n+1).fill(Infinity);
  dp[0] = 0;
  frames.push({type:'dptable', table:[dp.slice()], colLabels:(function(){var l=[];for(var k=0;k<=n;k++)l.push(k);return l;})(), rowLabels:['dp'], msg:'dp[i] = min(dp[i-j*j]+1), j从1到√i'});
  for (var i = 1; i <= n; i++) {
    for (var j = 1; j*j <= i; j++) {
      if (dp[i-j*j]+1 < dp[i]) dp[i] = dp[i-j*j]+1;
    }
    var hl = {}; hl['0,'+i] = 'current';
    frames.push({type:'dptable', table:[dp.slice()], colLabels:(function(){var l=[];for(var k=0;k<=n;k++)l.push(k);return l;})(), rowLabels:['dp'], highlights:hl, msg:'dp[' + i + '] = ' + dp[i] + ' (最少' + dp[i] + '个平方数)'});
  }
  frames.push({type:'dptable', table:[dp.slice()], colLabels:(function(){var l=[];for(var k=0;k<=n;k++)l.push(k);return l;})(), rowLabels:['dp'], highlights:(function(){var h={};h['0,'+n]='answer';return h;})(), result:'✅ ' + dp[n], msg:'✅ n=' + n + '最少需要' + dp[n] + '个完全平方数 (4+4+4)'});
  return frames;
};

// #322 零钱兑换
VIZ_TRACES["322"] = function() {
  var coins = [1,5,10], amount = 11, frames = [];
  var dp = new Array(amount+1).fill(Infinity);
  dp[0] = 0;
  for (var i = 1; i <= amount; i++) {
    for (var j = 0; j < coins.length; j++) {
      if (coins[j] <= i && dp[i-coins[j]]+1 < dp[i]) dp[i] = dp[i-coins[j]]+1;
    }
  }
  frames.push({type:'dptable', table:[dp.slice()], colLabels:(function(){var l=[];for(var k=0;k<=amount;k++)l.push(k);return l;})(), rowLabels:['dp'], msg:'coins=[1,5,10], dp[i]=min(dp[i-coin]+1)'});
  // 回溯展示几个关键步骤
  [1,5,6,10,11].forEach(function(i) {
    var hl = {}; hl['0,'+i] = 'current';
    frames.push({type:'dptable', table:[dp.slice()], colLabels:(function(){var l=[];for(var k=0;k<=amount;k++)l.push(k);return l;})(), rowLabels:['dp'], highlights:hl, msg:'dp[' + i + '] = ' + dp[i]});
  });
  frames.push({type:'dptable', table:[dp.slice()], highlights:(function(){var h={};h['0,'+amount]='answer';return h;})(), result:'✅ ' + dp[amount] + '枚 (10+1)', msg:'✅ 最少' + dp[amount] + '枚硬币 (10+1)'});
  return frames;
};

// #139 单词拆分
VIZ_TRACES["139"] = function() {
  var s = "leetcode", wordDict = ["leet","code"], frames = [];
  var n = s.length, dp = new Array(n+1).fill(false);
  dp[0] = true;
  frames.push({type:'array', array:s.split(''), msg:'dp[i]=true表示s[0~i-1]可拆分, 词典=[' + wordDict.join(',') + ']'});
  for (var i = 1; i <= n; i++) {
    for (var j = 0; j < wordDict.length; j++) {
      var w = wordDict[j];
      if (i >= w.length && dp[i-w.length] && s.substring(i-w.length,i) === w) {
        dp[i] = true;
        var hl = {}; for (var k = i-w.length; k < i; k++) hl[k] = 'sorted';
        frames.push({type:'array', array:s.split(''), highlights:hl, windowRange:[i-w.length,i-1], msg:'匹配"' + w + '" ✓ dp[' + i + ']=true'});
        break;
      }
    }
    if (!dp[i]) frames.push({type:'array', array:s.split(''), windowRange:[0,i-1], msg:'s[0~' + (i-1) + '] 暂不可拆分'});
  }
  frames.push({type:'array', array:s.split(''), result:'✅ 可拆分: leet+code', msg:'✅ 可以拆分为 leet+code'});
  return frames;
};

// #300 最长递增子序列
VIZ_TRACES["300"] = function() {
  var nums = [10,9,2,5,3,7,101,18], frames = [];
  var n = nums.length, dp = new Array(n).fill(1), maxLen = 1;
  frames.push({type:'dptable', table:[dp.slice()], colLabels:(function(){var l=[];for(var k=0;k<n;k++)l.push(k);return l;})(), rowLabels:['dp'], msg:'dp[i] = 以nums[i]结尾的最长递增子序列长度'});
  for (var i = 1; i < n; i++) {
    for (var j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j]+1 > dp[i]) {
        dp[i] = dp[j]+1;
      }
    }
    var hl = {}; hl['0,'+i] = 'current';
    frames.push({type:'dptable', table:[dp.slice()], colLabels:(function(){var l=[];for(var k=0;k<n;k++)l.push(k);return l;})(), rowLabels:['dp'], highlights:hl, msg:'nums[' + i + ']=' + nums[i] + ', dp[' + i + ']=' + dp[i]});
    if (dp[i] > maxLen) maxLen = dp[i];
  }
  frames.push({type:'dptable', table:[dp.slice()], colLabels:(function(){var l=[];for(var k=0;k<n;k++)l.push(k);return l;})(), rowLabels:['dp'], result:'✅ LIS=' + maxLen, msg:'✅ 最长递增子序列长度=' + maxLen + ' [2,3,7,101]'});
  return frames;
};

// #152 乘积最大子数组
VIZ_TRACES["152"] = function() {
  var nums = [2,3,-2,4], frames = [];
  var maxP = nums[0], minP = nums[0], result = nums[0];
  frames.push({type:'array', array:nums.slice(), pointers:{i:0}, highlights:{0:'current'}, msg:'维护max和min: 负数时max和min交换'});
  for (var i = 1; i < nums.length; i++) {
    if (nums[i] < 0) { var t = maxP; maxP = minP; minP = t; }
    maxP = Math.max(nums[i], maxP * nums[i]);
    minP = Math.min(nums[i], minP * nums[i]);
    var hl = {}; hl[i] = 'current';
    result = Math.max(result, maxP);
    frames.push({type:'array', array:nums.slice(), pointers:{i:i}, highlights:hl, msg:'nums[' + i + ']=' + nums[i] + ', maxP=' + maxP + ', minP=' + minP + ', result=' + result});
  }
  frames.push({type:'array', array:nums.slice(), result:'✅ 最大乘积=' + result, msg:'✅ 最大乘积=' + result});
  return frames;
};

// #416 分割等和子集
VIZ_TRACES["416"] = function() {
  var nums = [1,5,11,5], frames = [];
  var sum = nums.reduce(function(a,b){return a+b;}, 0);
  if (sum % 2 !== 0) { frames.push({type:'array', array:nums.slice(), msg:'sum=' + sum + ' 奇数, 不可分割'}); return frames; }
  var target = sum / 2;
  var dp = new Array(target+1).fill(false);
  dp[0] = true;
  frames.push({type:'dptable', table:[dp.slice()], colLabels:(function(){var l=[];for(var k=0;k<=target;k++)l.push(k);return l;})(), rowLabels:['dp'], msg:'sum=' + sum + ', target=' + target + '. 0-1背包: dp[j]表示能否凑出j'});
  for (var i = 0; i < nums.length; i++) {
    for (var j = target; j >= nums[i]; j--) {
      dp[j] = dp[j] || dp[j-nums[i]];
    }
    var hl = {}; hl['0,'+target] = 'current';
    frames.push({type:'dptable', table:[dp.slice()], colLabels:(function(){var l=[];for(var k=0;k<=target;k++)l.push(k);return l;})(), rowLabels:['dp'], highlights:hl, msg:'考虑nums[' + i + ']=' + nums[i] + ', dp[' + target + ']=' + dp[target]});
  }
  frames.push({type:'dptable', table:[dp.slice()], highlights:(function(){var h={};h['0,'+target]='answer';return h;})(), result:'✅ ' + dp[target], msg:'✅ ' + (dp[target]?'可以分割: [1,5,5]和[11]':'不可分割')});
  return frames;
};

// #32 最长有效括号
VIZ_TRACES["32"] = function() {
  var s = ")()())", frames = [];
  var n = s.length, dp = new Array(n).fill(0), maxLen = 0;
  frames.push({type:'array', array:s.split(''), msg:'dp[i] = 以s[i]结尾的最长有效括号长度'});
  for (var i = 1; i < n; i++) {
    if (s[i] === ')') {
      if (s[i-1] === '(') {
        dp[i] = (i >= 2 ? dp[i-2] : 0) + 2;
        var hl = {}; hl[i-1] = 'sorted'; hl[i] = 'current';
        frames.push({type:'array', array:s.split(''), highlights:hl, msg:'"()" 匹配, dp[' + i + ']=' + dp[i]});
      } else if (dp[i-1] > 0) {
        var match = i - dp[i-1] - 1;
        if (match >= 0 && s[match] === '(') {
          dp[i] = dp[i-1] + 2 + (match > 0 ? dp[match-1] : 0);
          var hl2 = {}; hl2[match] = 'sorted'; hl2[i] = 'current';
          frames.push({type:'array', array:s.split(''), highlights:hl2, msg:'")...(" 匹配, dp[' + i + ']=' + dp[i]});
        }
      }
      if (dp[i] > maxLen) maxLen = dp[i];
    }
  }
  frames.push({type:'array', array:s.split(''), result:'✅ ' + maxLen, msg:'✅ 最长有效括号=' + maxLen});
  return frames;
};

/* ====== 多维动态规划 (5题) ====== */

// #62 不同路径
VIZ_TRACES["62"] = function() {
  var m = 3, n = 7, frames = [];
  var dp = [];
  for (var i = 0; i < m; i++) dp.push(new Array(n).fill(1));
  frames.push({type:'dptable', table:dp.slice(), colLabels:(function(){var l=[];for(var k=0;k<n;k++)l.push(k);return l;})(), rowLabels:(function(){var l=[];for(var k=0;k<m;k++)l.push(k);return l;})(), msg:'第一行和第一列都=1, dp[i][j]=dp[i-1][j]+dp[i][j-1]'});
  for (var r = 1; r < m; r++) {
    for (var c = 1; c < n; c++) {
      dp[r][c] = dp[r-1][c] + dp[r][c-1];
      var hl = {}; hl[r+','+c] = 'current'; hl[(r-1)+','+c] = 'dep1'; hl[r+','+(c-1)] = 'dep2';
      frames.push({type:'dptable', table:dp.map(function(row){return row.slice();}), colLabels:(function(){var l=[];for(var k=0;k<n;k++)l.push(k);return l;})(), rowLabels:(function(){var l=[];for(var k=0;k<m;k++)l.push(k);return l;})(), highlights:hl, msg:'dp[' + r + '][' + c + '] = ' + dp[r-1][c] + '+' + dp[r][c-1] + ' = ' + dp[r][c]});
    }
  }
  frames.push({type:'dptable', table:dp, highlights:(function(){var h={};h[(m-1)+','+(n-1)]='answer';return h;})(), result:'✅ ' + dp[m-1][n-1] + '条路径', msg:'✅ 共' + dp[m-1][n-1] + '条路径'});
  return frames;
};

// #64 最小路径和
VIZ_TRACES["64"] = function() {
  var grid = [[1,3,1],[1,5,1],[4,2,1]];
  var m = grid.length, n = grid[0].length, frames = [];
  var dp = []; for (var i = 0; i < m; i++) dp.push(grid[i].slice());
  for (var j = 1; j < n; j++) dp[0][j] += dp[0][j-1];
  for (var i2 = 1; i2 < m; i2++) dp[i2][0] += dp[i2-1][0];
  frames.push({type:'dptable', table:dp.map(function(r){return r.slice();}), rowLabels:(function(){var l=[];for(var k=0;k<m;k++)l.push(k);return l;})(), colLabels:(function(){var l=[];for(var k=0;k<n;k++)l.push(k);return l;})(), msg:'dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])'});
  for (var r = 1; r < m; r++) {
    for (var c = 1; c < n; c++) {
      dp[r][c] = grid[r][c] + Math.min(dp[r-1][c], dp[r][c-1]);
      var hl = {}; hl[r+','+c] = 'current'; hl[(r-1)+','+c] = 'dep1'; hl[r+','+(c-1)] = 'dep2';
      frames.push({type:'dptable', table:dp.map(function(row){return row.slice();}), rowLabels:(function(){var l=[];for(var k=0;k<m;k++)l.push(k);return l;})(), colLabels:(function(){var l=[];for(var k=0;k<n;k++)l.push(k);return l;})(), highlights:hl, msg:'dp[' + r + '][' + c + '] = ' + grid[r][c] + '+min(' + dp[r-1][c] + ',' + dp[r][c-1] + ')=' + dp[r][c]});
    }
  }
  frames.push({type:'dptable', table:dp, highlights:(function(){var h={};h[(m-1)+','+(n-1)]='answer';return h;})(), result:'✅ 最小和=' + dp[m-1][n-1], msg:'✅ 最小路径和=' + dp[m-1][n-1]});
  return frames;
};

// #5 最长回文子串
VIZ_TRACES["5"] = function() {
  var s = "babad", frames = [];
  var n = s.length, dp = [], maxLen = 1, start = 0;
  for (var i = 0; i < n; i++) { dp.push(new Array(n).fill(false)); dp[i][i] = true; }
  frames.push({type:'dptable', table:dp.map(function(r){return r.map(function(v){return v?'T':'F';});}), rowLabels:s.split(''), colLabels:s.split(''), msg:'dp[i][j]=true表示s[i~j]是回文, 对角线=true'});
  for (var len = 2; len <= n; len++) {
    for (var i2 = 0; i2 <= n - len; i2++) {
      var j = i2 + len - 1;
      if (s[i2] === s[j] && (len === 2 || dp[i2+1][j-1])) {
        dp[i2][j] = true;
        if (len > maxLen) { maxLen = len; start = i2; }
        var hl = {}; hl[i2+','+j] = 'current';
        frames.push({type:'dptable', table:dp.map(function(r){return r.map(function(v){return v?'T':'F';});}), rowLabels:s.split(''), colLabels:s.split(''), highlights:hl, msg:'s[' + i2 + '~' + j + ']="' + s.substring(i2,j+1) + '" 是回文 ✓ len=' + len});
      }
    }
  }
  frames.push({type:'array', array:s.split(''), highlights:(function(){var h={};for(var k=start;k<start+maxLen;k++)h[k]='sorted';return h;})(), result:'✅ "' + s.substring(start,start+maxLen) + '"', msg:'✅ 最长回文子串: "' + s.substring(start,start+maxLen) + '", 长度=' + maxLen});
  return frames;
};

// #1143 最长公共子序列
VIZ_TRACES["1143"] = function() {
  var text1 = "abcde", text2 = "ace";
  var m = text1.length, n = text2.length, frames = [];
  var dp = [];
  for (var i = 0; i <= m; i++) dp.push(new Array(n+1).fill(0));
  frames.push({type:'dptable', table:dp, rowLabels:[''].concat(text1.split('')), colLabels:[''].concat(text2.split('')), msg:'dp[i][j] = text1[0~i-1]和text2[0~j-1]的LCS长度'});
  for (var r = 1; r <= m; r++) {
    for (var c = 1; c <= n; c++) {
      if (text1[r-1] === text2[c-1]) {
        dp[r][c] = dp[r-1][c-1] + 1;
        var hl = {}; hl[r+','+c] = 'current'; hl[(r-1)+','+(c-1)] = 'dep1';
        frames.push({type:'dptable', table:dp.map(function(row){return row.slice();}), rowLabels:[''].concat(text1.split('')), colLabels:[''].concat(text2.split('')), highlights:hl, msg:'匹配! \'' + text1[r-1] + '\' → dp[' + r + '][' + c + ']=' + dp[r][c]});
      } else {
        dp[r][c] = Math.max(dp[r-1][c], dp[r][c-1]);
        var hl2 = {}; hl2[r+','+c] = 'current'; hl2[(r-1)+','+c] = 'dep1'; hl2[r+','+(c-1)] = 'dep2';
        frames.push({type:'dptable', table:dp.map(function(row){return row.slice();}), rowLabels:[''].concat(text1.split('')), colLabels:[''].concat(text2.split('')), highlights:hl2, msg:'不匹配 → max(' + dp[r-1][c] + ',' + dp[r][c-1] + ')=' + dp[r][c]});
      }
    }
  }
  frames.push({type:'dptable', table:dp, highlights:(function(){var h={};h[m+','+n]='answer';return h;})(), result:'✅ LCS=' + dp[m][n], msg:'✅ LCS长度=' + dp[m][n] + ' (ace)'});
  return frames;
};

// #72 编辑距离
VIZ_TRACES["72"] = function() {
  var word1 = "horse", word2 = "ros";
  var m = word1.length, n = word2.length, frames = [];
  var dp = [];
  for (var i = 0; i <= m; i++) dp.push(new Array(n+1).fill(0));
  for (var i2 = 0; i2 <= m; i2++) dp[i2][0] = i2;
  for (var j = 0; j <= n; j++) dp[0][j] = j;
  frames.push({type:'dptable', table:dp, rowLabels:[''].concat(word1.split('')), colLabels:[''].concat(word2.split('')), msg:'dp[0][j]=j, dp[i][0]=i (空串到j需要j步)'});
  for (var r = 1; r <= m; r++) {
    for (var c = 1; c <= n; c++) {
      if (word1[r-1] === word2[c-1]) {
        dp[r][c] = dp[r-1][c-1];
        var hl = {}; hl[r+','+c] = 'current'; hl[(r-1)+','+(c-1)] = 'dep1';
        frames.push({type:'dptable', table:dp.map(function(row){return row.slice();}), rowLabels:[''].concat(word1.split('')), colLabels:[''].concat(word2.split('')), highlights:hl, msg:'相同字符, 不操作 → dp=' + dp[r][c]});
      } else {
        dp[r][c] = 1 + Math.min(dp[r-1][c-1], Math.min(dp[r-1][c], dp[r][c-1]));
        var hl2 = {}; hl2[r+','+c] = 'current'; hl2[(r-1)+','+(c-1)] = 'dep1'; hl2[(r-1)+','+c] = 'dep2'; hl2[r+','+(c-1)] = 'dep2';
        frames.push({type:'dptable', table:dp.map(function(row){return row.slice();}), rowLabels:[''].concat(word1.split('')), colLabels:[''].concat(word2.split('')), highlights:hl2, msg:'min(替换' + dp[r-1][c-1] + ', 删除' + dp[r-1][c] + ', 插入' + dp[r][c-1] + ')+1 = ' + dp[r][c]});
      }
    }
  }
  frames.push({type:'dptable', table:dp, highlights:(function(){var h={};h[m+','+n]='answer';return h;})(), result:'✅ 编辑距离=' + dp[m][n], msg:'✅ 编辑距离=' + dp[m][n] + ' (horse→rorse→rose→ros)'});
  return frames;
};

/* Batch 7a: 贪心(4) + DP前5 = 9题 */

SOLUTIONS["121"] = {
  thinking: "买卖股票最佳时机。一次遍历维护最低价和最大利润。",
  approaches: [{
    name: "贪心（一次遍历）",
    desc: "维护历史最低价minPrice。每天计算profit=price-minPrice，更新最大利润。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE, maxProfit = 0;
        for (int price : prices) {
            minPrice = Math.min(minPrice, price);
            maxProfit = Math.max(maxProfit, price - minPrice);
        }
        return maxProfit;
    }
}`,
    keyPoints: ["维护历史最低价", "每天算卖出的利润", "更新最大值"],
    steps: ["遍历每天价格", "更新最低价", "计算利润取max"]
  }],
  pitfalls: ["minPrice初始为MAX_VALUE"]
};

SOLUTIONS["55"] = {
  thinking: "跳跃游戏。维护当前能到达的最远位置。遍历时如果i超过最远位置则不能到达。",
  approaches: [{
    name: "贪心（最远可达）",
    desc: "遍历时维护maxReach=i+nums[i]。如果i>maxReach则失败。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false;
            maxReach = Math.max(maxReach, i + nums[i]);
        }
        return true;
    }
}`,
    keyPoints: ["maxReach=i+nums[i]", "i>maxReach→无法到达"],
    steps: ["遍历", "更新maxReach", "i超过maxReach返回false"]
  }],
  pitfalls: ["先判断i>maxReach再更新"]
};

SOLUTIONS["45"] = {
  thinking: "跳跃游戏II（最少步数）。贪心：每次在当前范围内找下一步能到达最远的位置。",
  approaches: [{
    name: "贪心（BFS层序）",
    desc: "维护当前跳跃边界currEnd。遍历到边界时必须跳，步数+1，新边界=currFarthest。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int jump(int[] nums) {
        int jumps = 0, currEnd = 0, currFarthest = 0;
        for (int i = 0; i < nums.length - 1; i++) {
            currFarthest = Math.max(currFarthest, i + nums[i]);
            if (i == currEnd) { jumps++; currEnd = currFarthest; }
        }
        return jumps;
    }
}`,
    keyPoints: ["遍历到n-1（最后一个不用跳）", "i==currEnd 时跳一步", "新边界=currFarthest"],
    steps: ["遍历更新最远", "到达边界时跳跃", "更新边界"]
  }],
  pitfalls: ["遍历到n-2不是n-1——最后位置不用再跳"]
};

SOLUTIONS["763"] = {
  thinking: "划分字母区间。每个字母最后一次出现的位置决定了片段的边界。",
  approaches: [{
    name: "贪心（记录最后位置）",
    desc: "先记录每个字母最后出现位置。遍历时维护当前片段的结束边界，到达边界时切割。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
        List<Integer> result = new ArrayList<>();
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) { result.add(end - start + 1); start = i + 1; }
        }
        return result;
    }
}`,
    keyPoints: ["先记录每个字母最后出现位置", "end=max(end, last[char])", "i==end时切割"],
    steps: ["预记录最后位置", "遍历更新end", "到达end切割"]
  }],
  pitfalls: ["必须先遍历一次记录所有最后位置"]
};

SOLUTIONS["70"] = {
  thinking: "爬楼梯。dp[i]=dp[i-1]+dp[i-2]，本质就是斐波那契。",
  approaches: [{
    name: "动态规划（空间优化）",
    desc: "f(n)=f(n-1)+f(n-2)。用两个变量滚动。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1; prev1 = curr;
        }
        return prev1;
    }
}`,
    keyPoints: ["斐波那契数列", "两个变量滚动", "n<=2直接返回"],
    steps: ["prev2=1, prev1=2", "滚动更新", "返回prev1"]
  }],
  pitfalls: ["n=1和n=2的base case"]
};

SOLUTIONS["118"] = {
  thinking: "杨辉三角。每行首尾为1，中间=上方两个之和。",
  approaches: [{
    name: "逐行构建",
    desc: "每行首尾为1，中间元素=上一行[j-1]+上一行[j]。",
    complexity: { time: "O(n²)", space: "O(n²)" },
    lang: "java",
    code: `class Solution {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> result = new ArrayList<>();
        for (int i = 0; i < numRows; i++) {
            List<Integer> row = new ArrayList<>();
            for (int j = 0; j <= i; j++) {
                if (j == 0 || j == i) row.add(1);
                else row.add(result.get(i-1).get(j-1) + result.get(i-1).get(j));
            }
            result.add(row);
        }
        return result;
    }
}`,
    keyPoints: ["首尾为1", "中间=上一行相邻两数之和"],
    steps: ["逐行构建", "首尾填1", "中间取上一行之和"]
  }],
  pitfalls: ["注意索引边界"]
};

SOLUTIONS["198"] = {
  thinking: "打家劫舍。不能偷相邻的。dp[i]=max(dp[i-1], dp[i-2]+nums[i])。",
  approaches: [{
    name: "动态规划（空间优化）",
    desc: "dp[i]=max(不偷=dp[i-1], 偷=dp[i-2]+nums[i])。两个变量滚动。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        int prev2 = nums[0], prev1 = Math.max(nums[0], nums[1]);
        for (int i = 2; i < nums.length; i++) {
            int curr = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1; prev1 = curr;
        }
        return prev1;
    }
}`,
    keyPoints: ["dp[i]=max(dp[i-1], dp[i-2]+nums[i])", "偷或不偷两种选择", "两个变量滚动"],
    steps: ["base case: dp[0]=nums[0], dp[1]=max(nums[0],nums[1])", "递推", "返回dp[n-1]"]
  }],
  pitfalls: ["n=1直接返回nums[0]"]
};

SOLUTIONS["279"] = {
  thinking: "完全平方数。dp[i]=min(dp[i-j²]+1) for all j²<=i。BFS也可以。",
  approaches: [{
    name: "动态规划",
    desc: "dp[i]表示i最少需要几个完全平方数。枚举所有j²<=i，dp[i]=min(dp[i-j²]+1)。",
    complexity: { time: "O(n√n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public int numSquares(int n) {
        int[] dp = new int[n + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int i = 1; i <= n; i++)
            for (int j = 1; j * j <= i; j++)
                dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
        return dp[n];
    }
}`,
    keyPoints: ["枚举j*j<=i的所有j", "dp[i]=min(dp[i-j²]+1)", "初始化MAX_VALUE"],
    steps: ["初始化dp数组", "双重循环枚举平方数", "取最小值"]
  }],
  pitfalls: ["dp[0]=0 是base case", "Arrays.fill初始化为MAX_VALUE"]
};

SOLUTIONS["322"] = {
  thinking: "零钱兑换。完全背包：dp[i]=min(dp[i-coin]+1) for each coin。",
  approaches: [{
    name: "动态规划（完全背包）",
    desc: "dp[i]表示凑成金额i的最少硬币数。对每个金额枚举所有面值。",
    complexity: { time: "O(n×amount)", space: "O(amount)" },
    lang: "java",
    code: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++)
            for (int coin : coins)
                if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
    keyPoints: ["初始化amount+1表示不可达", "完全背包：正向遍历", "最后检查是否可达"],
    steps: ["初始化dp", "对每个金额枚举面值", "返回dp[amount]或-1"]
  }],
  pitfalls: ["用amount+1初始化比MAX_VALUE更安全", "coin<=i 才能使用"]
};

/* Batch 7b: DP后5 + 多维DP(5) = 10题 */

SOLUTIONS["139"] = {
  thinking: "单词拆分。dp[i]表示s[0..i)能否被拆分。对每个位置i，检查所有单词。",
  approaches: [{
    name: "动态规划",
    desc: "dp[i]=true表示s[0..i)可拆分。对每个i，检查是否存在单词w使得s[i-w.len..i)==w 且 dp[i-w.len]==true。",
    complexity: { time: "O(n×m)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++)
            for (int j = 0; j < i; j++)
                if (dp[j] && dict.contains(s.substring(j, i))) {
                    dp[i] = true; break;
                }
        return dp[s.length()];
    }
}`,
    keyPoints: ["dp[0]=true 空串可拆分", "双重循环i和j", "substring(j,i)"],
    steps: ["dp[0]=true", "对每个i枚举j", "dp[j]==true且s[j..i)在字典中→dp[i]=true"]
  }],
  pitfalls: ["dp[0]=true 是关键base case"]
};

SOLUTIONS["300"] = {
  thinking: "最长递增子序列。dp[i]=以nums[i]结尾的最长LIS。也可二分优化到O(n log n)。",
  approaches: [
    {
      name: "动态规划 O(n²)",
      desc: "dp[i]=max(dp[j]+1) for all j<i and nums[j]<nums[i]。",
      complexity: { time: "O(n²)", space: "O(n)" },
      lang: "java",
      code: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] dp = new int[nums.length];
        Arrays.fill(dp, 1);
        int maxLen = 1;
        for (int i = 1; i < nums.length; i++) {
            for (int j = 0; j < i; j++)
                if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            maxLen = Math.max(maxLen, dp[i]);
        }
        return maxLen;
    }
}`,
      keyPoints: ["dp[i]=以i结尾的最长LIS", "双重循环", "取全局最大值"],
      steps: ["初始化dp全1", "枚举j<i", "nums[j]<nums[i]时更新dp[i]", "返回max"]
    },
    {
      name: "二分查找 O(n log n)",
      desc: "维护一个递增数组tails，对每个nums[i]二分找位置替换。",
      complexity: { time: "O(n log n)", space: "O(n)" },
      lang: "java",
      code: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int num : nums) {
            int lo = 0, hi = size;
            while (lo < hi) {
                int mid = (lo + hi) / 2;
                if (tails[mid] < num) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = num;
            if (lo == size) size++;
        }
        return size;
    }
}`,
      keyPoints: ["tails数组始终有序", "二分找第一个>=num的位置", "lo==size 时数组扩展"],
      steps: ["对每个num二分", "替换或扩展tails", "返回size"]
    }
  ],
  pitfalls: ["dp法是'以i结尾'不是'前i个'", "二分法找的是第一个>=num的位置"]
};

SOLUTIONS["152"] = {
  thinking: "乘积最大子数组。因为有负数，需要同时维护最大积和最小积。",
  approaches: [{
    name: "动态规划（双状态）",
    desc: "维护maxProd和minProd。负数时交换。maxProd=max(num, maxProd*num)，minProd=min(num, minProd*num)。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int maxProduct(int[] nums) {
        int maxProd = nums[0], minProd = nums[0], result = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int num = nums[i];
            if (num < 0) { int t = maxProd; maxProd = minProd; minProd = t; } // 负数交换
            maxProd = Math.max(num, maxProd * num);
            minProd = Math.min(num, minProd * num);
            result = Math.max(result, maxProd);
        }
        return result;
    }
}`,
    keyPoints: ["同时维护最大积和最小积", "负数时交换max和min", "更新result"],
    steps: ["遇负数交换max和min", "更新maxProd和minProd", "更新全局最大值"]
  }],
  pitfalls: ["负数会让最小变最大——必须交换", "先交换再计算"]
};

SOLUTIONS["416"] = {
  thinking: "分割等和子集。0-1背包：能否选一些数使和=总和/2。",
  approaches: [{
    name: "0-1背包（布尔dp）",
    desc: "target=sum/2。dp[j]表示能否凑成和j。倒序遍历防重复使用。",
    complexity: { time: "O(n×target)", space: "O(target)" },
    lang: "java",
    code: `class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int n : nums) sum += n;
        if (sum % 2 != 0) return false;
        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int num : nums)
            for (int j = target; j >= num; j--)
                dp[j] = dp[j] || dp[j - num];
        return dp[target];
    }
}`,
    keyPoints: ["总和为奇数直接false", "0-1背包倒序遍历", "dp[j]=dp[j]||dp[j-num]"],
    steps: ["计算总和判断奇偶", "初始化dp", "倒序背包", "返回dp[target]"]
  }],
  pitfalls: ["倒序遍历防止重复使用同一元素", "总和为奇直接返回false"]
};

SOLUTIONS["32"] = {
  thinking: "最长有效括号。dp[i]=以i结尾的最长有效括号长度。",
  approaches: [{
    name: "动态规划",
    desc: "s[i]=')'时：若s[i-1]='('则dp[i]=dp[i-2]+2。若s[i-1]=')'且s[i-dp[i-1]-1]='('则dp[i]=dp[i-1]+2+dp[i-dp[i-1]-2]。",
    complexity: { time: "O(n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public int longestValidParentheses(String s) {
        int maxLen = 0;
        int[] dp = new int[s.length()];
        for (int i = 1; i < s.length(); i++) {
            if (s.charAt(i) == ')') {
                if (s.charAt(i - 1) == '(') {
                    dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
                } else if (i - dp[i - 1] - 1 >= 0 && s.charAt(i - dp[i - 1] - 1) == '(') {
                    dp[i] = dp[i - 1] + 2 + (i - dp[i - 1] - 2 >= 0 ? dp[i - dp[i - 1] - 2] : 0);
                }
                maxLen = Math.max(maxLen, dp[i]);
            }
        }
        return maxLen;
    }
}`,
    keyPoints: ["两种情况：()和))", "情况2：检查匹配的( 位置", "加上匹配( 之前的dp值"],
    steps: ["s[i]==)时", "s[i-1]==( → dp[i]=dp[i-2]+2", "s[i-1]==) → 检查匹配位置"]
  }],
  pitfalls: ["边界检查：i-dp[i-1]-1>=0", "加上匹配位置之前的dp值"]
};

SOLUTIONS["62"] = {
  thinking: "不同路径。dp[i][j]=dp[i-1][j]+dp[i][j-1]。第一行第一列全1。",
  approaches: [{
    name: "动态规划（空间优化）",
    desc: "dp[j]=dp[j]+dp[j-1]。一维数组滚动。",
    complexity: { time: "O(m×n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                dp[j] += dp[j - 1];
        return dp[n - 1];
    }
}`,
    keyPoints: ["一维数组", "dp[j]+=dp[j-1]", "第一行全1初始化"],
    steps: ["初始化全1", "逐行累加", "返回dp[n-1]"]
  }],
  pitfalls: ["一维数组从1开始j"]
};

SOLUTIONS["64"] = {
  thinking: "最小路径和。dp[i][j]=grid[i][j]+min(dp[i-1][j], dp[i][j-1])。",
  approaches: [{
    name: "动态规划（原地修改）",
    desc: "直接在grid上修改。grid[i][j]+=min(grid[i-1][j], grid[i][j-1])。",
    complexity: { time: "O(m×n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                if (i == 0 && j > 0) grid[i][j] += grid[i][j-1];
                else if (j == 0 && i > 0) grid[i][j] += grid[i-1][j];
                else if (i > 0 && j > 0) grid[i][j] += Math.min(grid[i-1][j], grid[i][j-1]);
            }
        return grid[m-1][n-1];
    }
}`,
    keyPoints: ["原地修改O(1)空间", "第一行只加左边", "第一列只加上边"],
    steps: ["第一行累加", "第一列累加", "内部取min累加"]
  }],
  pitfalls: ["第一行和第一列的base case"]
};

SOLUTIONS["5"] = {
  thinking: "最长回文子串。中心扩展法：对每个位置（和间隙）向两边扩展。",
  approaches: [{
    name: "中心扩展法",
    desc: "对每个中心（奇数和偶数两种），向两边扩展找最长回文。",
    complexity: { time: "O(n²)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public String longestPalindrome(String s) {
        int start = 0, maxLen = 1;
        for (int i = 0; i < s.length(); i++) {
            int len1 = expand(s, i, i);     // 奇数
            int len2 = expand(s, i, i + 1); // 偶数
            int len = Math.max(len1, len2);
            if (len > maxLen) {
                maxLen = len;
                start = i - (len - 1) / 2;
            }
        }
        return s.substring(start, start + maxLen);
    }
    private int expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
        return r - l - 1;
    }
}`,
    keyPoints: ["两种中心：i和i,i+1", "expand返回长度", "start = i-(len-1)/2"],
    steps: ["遍历每个中心", "奇偶两种扩展", "更新最大值和起点"]
  }],
  pitfalls: ["start = i-(len-1)/2 不是 i-len/2", "expand返回r-l-1 不是r-l+1"]
};

SOLUTIONS["1143"] = {
  thinking: "最长公共子序列。dp[i][j]表示text1前i个和text2前j个的LCS。",
  approaches: [{
    name: "动态规划",
    desc: "字符相等：dp[i][j]=dp[i-1][j-1]+1。不等：dp[i][j]=max(dp[i-1][j], dp[i][j-1])。",
    complexity: { time: "O(m×n)", space: "O(m×n)" },
    lang: "java",
    code: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i-1) == text2.charAt(j-1))
                    dp[i][j] = dp[i-1][j-1] + 1;
                else
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        return dp[m][n];
    }
}`,
    keyPoints: ["相等取对角线+1", "不等取上和左的最大", "dp从1开始，字符串从0索引"],
    steps: ["双重循环", "字符相等→dp[i-1][j-1]+1", "不等→max(up,left)"]
  }],
  pitfalls: ["dp索引从1开始，字符串索引差1"]
};

SOLUTIONS["72"] = {
  thinking: "编辑距离。dp[i][j]表示word1前i个变成word2前j个的最少操作数。",
  approaches: [{
    name: "动态规划",
    desc: "字符相等：dp[i][j]=dp[i-1][j-1]。不等：dp[i][j]=1+min(替换dp[i-1][j-1], 删除dp[i-1][j], 插入dp[i][j-1])。",
    complexity: { time: "O(m×n)", space: "O(m×n)" },
    lang: "java",
    code: `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i-1) == word2.charAt(j-1))
                    dp[i][j] = dp[i-1][j-1];
                else
                    dp[i][j] = 1 + Math.min(dp[i-1][j-1], Math.min(dp[i-1][j], dp[i][j-1]));
            }
        return dp[m][n];
    }
}`,
    keyPoints: ["三种操作：替换/删除/插入", "base case: dp[i][0]=i, dp[0][j]=j", "相等不操作"],
    steps: ["初始化第一行第一列", "字符相等→dp[i-1][j-1]", "不等→1+min(三方向)"]
  }],
  pitfalls: ["三种操作分别对应三个方向：dp[i-1][j-1], dp[i-1][j], dp[i][j-1]"]
};

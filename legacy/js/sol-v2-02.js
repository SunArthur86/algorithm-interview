/* Batch 2: 子串(3) + 普通数组(5) + 矩阵(4) = 12题
   (注：#88 合并两个有序数组 不在 LeetCode 热题 100 列表中，
   其题解已迁移至 js/extra-solutions.js 作为扩展练习) */

SOLUTIONS["560"] = {
  thinking: "求和为 k 的子数组个数。暴力 O(n²)，但可以用前缀和+哈希表优化到 O(n)。核心：prefix[j]-prefix[i]=k 等价于找之前有多少个前缀和等于 prefix[j]-k。",
  approaches: [{
    name: "前缀和 + 哈希表（最优）",
    desc: "边遍历边计算前缀和，用哈希表记录每个前缀和出现的次数。对当前位置 j，查找 prefix-k 出现了多少次，即为以 j 结尾的和为 k 的子数组个数。",
    complexity: { time: "O(n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0, 1); // 前缀和为0出现1次（空前缀）
        int sum = 0, count = 0;
        for (int num : nums) {
            sum += num;
            count += map.getOrDefault(sum - k, 0);
            map.merge(sum, 1, Integer::sum);
        }
        return count;
    }
}`,
    keyPoints: ["map.put(0,1) 处理从头开始的子数组", "sum-k 表示前面有多少个前缀和使得差值为k", "map.merge 简化计数"],
    steps: ["初始化 map{0:1}", "遍历累加 sum", "count += map[sum-k]", "map[sum]++"]
  }],
  pitfalls: ["忘记 map.put(0,1) 会导致漏算从头开始的子数组", "不能用滑动窗口——数组有负数"]
};

SOLUTIONS["239"] = {
  thinking: "滑动窗口最大值。窗口大小 k 滑动，每次返回窗口内最大值。用单调递减队列：队首始终是当前窗口最大值。",
  approaches: [{
    name: "单调队列（双端队列）",
    desc: "维护一个单调递减的双端队列。队首是最大值的索引。新元素入队时，从队尾弹出所有比它小的。队首超出窗口范围则弹出。",
    complexity: { time: "O(n)", space: "O(k)" },
    lang: "java",
    code: `class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>(); // 存索引
        for (int i = 0; i < n; i++) {
            // 移除超出窗口的队首
            while (!dq.isEmpty() && dq.peekFirst() < i - k + 1)
                dq.pollFirst();
            // 维护单调递减：弹出比当前小的
            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i])
                dq.pollLast();
            dq.offerLast(i);
            // 窗口满后记录队首（最大值）
            if (i >= k - 1)
                result[i - k + 1] = nums[dq.peekFirst()];
        }
        return result;
    }
}`,
    keyPoints: ["队列存索引不是值", "维护单调递减", "队首始终是窗口最大值"],
    steps: ["遍历每个元素", "移除超出窗口范围的队首", "从队尾弹出比当前元素小的", "当前索引入队", "窗口满后取队首为结果"]
  }],
  pitfalls: ["队列存索引不是值——需要用索引判断是否过期", "不是大顶堆——大顶堆删除超时元素是 O(k)"]
};

SOLUTIONS["76"] = {
  thinking: "最小覆盖子串。在 s 中找包含 t 所有字符的最短子串。滑动窗口：先扩展右指针直到包含所有字符，再收缩左指针找最短。",
  approaches: [{
    name: "滑动窗口（模板）",
    desc: "用两个指针维护窗口。右指针扩展直到窗口包含 t 的所有字符，然后左指针收缩到最短。用 needMap 和 have 计数器跟踪。",
    complexity: { time: "O(n)", space: "O(m)" },
    lang: "java",
    code: `class Solution {
    public String minWindow(String s, String t) {
        Map<Character, Integer> need = new HashMap<>();
        Map<Character, Integer> window = new HashMap<>();
        for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);
        int left = 0, right = 0, valid = 0;
        int start = 0, minLen = Integer.MAX_VALUE;
        while (right < s.length()) {
            char c = s.charAt(right++);
            if (need.containsKey(c)) {
                window.merge(c, 1, Integer::sum);
                if (window.get(c).equals(need.get(c))) valid++;
            }
            // 所有字符都满足时收缩
            while (valid == need.size()) {
                if (right - left < minLen) {
                    start = left;
                    minLen = right - left;
                }
                char d = s.charAt(left++);
                if (need.containsKey(d)) {
                    if (window.get(d).equals(need.get(d))) valid--;
                    window.merge(d, -1, Integer::sum);
                }
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
    }
}`,
    keyPoints: ["need 记录需要的字符及数量", "valid 记录已满足的字符种类数", "先扩展再收缩的滑动窗口模板"],
    steps: ["统计 t 的字符频率", "右指针扩展加入字符", "valid==need.size() 时开始收缩", "收缩时更新最短长度"]
  }],
  pitfalls: ["valid 是满足的种类数不是总数", "收缩后要检查 valid 是否仍满足"]
};

SOLUTIONS["189"] = {
  thinking: "轮转数组：将数组向右轮转 k 步。三种方法：额外数组、数组翻转、环状替换。翻转法最优。",
  approaches: [
    {
      name: "三次翻转（最优）",
      desc: "先翻转整个数组，再翻转前 k 个，再翻转后 n-k 个。k 需取模。",
      complexity: { time: "O(n)", space: "O(1)" },
      lang: "java",
      code: `class Solution {
    public void rotate(int[] nums, int k) {
        k %= nums.length;
        reverse(nums, 0, nums.length - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, nums.length - 1);
    }
    private void reverse(int[] nums, int l, int r) {
        while (l < r) {
            int t = nums[l]; nums[l] = nums[r]; nums[r] = t;
            l++; r--;
        }
    }
}`,
      keyPoints: ["k %= n 处理 k>n", "三次翻转：全翻+前k翻+后n-k翻", "O(1) 空间"],
      steps: ["k 取模", "翻转整个数组", "翻转前 k 个", "翻转剩余部分"]
    }
  ],
  pitfalls: ["忘记 k %= nums.length", "翻转的边界不要搞错"]
};

SOLUTIONS["41"] = {
  thinking: "找缺失的第一个正数，要求 O(n) 时间 O(1) 空间。核心思路：把每个合法的正数放到它应该在的位置（nums[i] 放到 nums[nums[i]-1]），再扫描找第一个不匹配的。",
  approaches: [{
    name: "原地哈希（标记法）",
    desc: "遍历数组，将每个在 [1,n] 范围内的数交换到正确位置 nums[i]→nums[nums[i]-1]。最终扫描第一个 nums[i]!=i+1 的位置。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n; i++) {
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int temp = nums[nums[i] - 1];
                nums[nums[i] - 1] = nums[i];
                nums[i] = temp;
            }
        }
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) return i + 1;
        }
        return n + 1;
    }
}`,
    keyPoints: ["把 nums[i] 放到索引 nums[i]-1 的位置", "while 循环持续交换直到位置正确", "最终扫描找不匹配的"],
    steps: ["遍历每个位置", "若值在 [1,n] 且目标位置值不对，交换", "扫描第一个 nums[i]!=i+1", "都匹配则返回 n+1"]
  }],
  pitfalls: ["while 条件必须包含 nums[nums[i]-1]!=nums[i] 防死循环", "值不在 [1,n] 的跳过"]
};

SOLUTIONS["73"] = {
  thinking: "矩阵置零：如果一个元素为 0，则将其所在行和列全设为 0。用第一行和第一列作为标记数组，实现 O(1) 空间。",
  approaches: [{
    name: "原地标记（O(1)空间）",
    desc: "用第一行/列记录是否有零。先检查第一行列自身是否有零，然后用它们标记其他行列，最后根据标记置零。",
    complexity: { time: "O(m×n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public void setZeroes(int[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        boolean firstRowZero = false, firstColZero = false;
        for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRowZero = true;
        for (int i = 0; i < m; i++) if (matrix[i][0] == 0) firstColZero = true;
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][j] == 0) { matrix[i][0] = 0; matrix[0][j] = 0; }
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
        if (firstRowZero) for (int j = 0; j < n; j++) matrix[0][j] = 0;
        if (firstColZero) for (int i = 0; i < m; i++) matrix[i][0] = 0;
    }
}`,
    keyPoints: ["用第一行/列做标记数组", "先记录第一行列自身是否有零", "最后处理第一行列"],
    steps: ["检查第一行列是否有零", "用第一行列标记其他位置", "根据标记置零", "最后处理第一行列"]
  }],
  pitfalls: ["必须先记录第一行列的状态再标记", "最后处理第一行列防止覆盖标记"]
};

SOLUTIONS["54"] = {
  thinking: "螺旋矩阵：按顺时针螺旋顺序返回矩阵元素。维护四个边界 top/bottom/left/right，逐层遍历。",
  approaches: [{
    name: "边界收缩法",
    desc: "维护四个边界，按 右→下→左→上 顺序遍历，每次遍历完一条边就收缩对应边界。",
    complexity: { time: "O(m×n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) result.add(matrix[top][j]);
            top++;
            for (int i = top; i <= bottom; i++) result.add(matrix[i][right]);
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) result.add(matrix[bottom][j]);
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) result.add(matrix[i][left]);
                left++;
            }
        }
        return result;
    }
}`,
    keyPoints: ["四边界收缩", "右→下→左→上循环", "下和左方向需要额外检查边界"],
    steps: ["初始化 top/bottom/left/right", "向右遍历 top 行，top++", "向下遍历 right 列，right--", "向左遍历 bottom 行（如果还有），bottom--", "向上遍历 left 列（如果还有），left++"]
  }],
  pitfalls: ["向左和向上时需要 if 检查防止重复遍历", "单行/单列的边界条件"]
};

SOLUTIONS["48"] = {
  thinking: "顺时针旋转图像 90°。先转置（沿主对角线翻转），再水平翻转每行。或者直接找旋转规律：matrix[i][j]→matrix[j][n-1-i]。",
  approaches: [{
    name: "转置 + 翻转",
    desc: "先沿主对角线转置（matrix[i][j]↔matrix[j][i]），再对每行做水平翻转。",
    complexity: { time: "O(n²)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        // 转置
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) {
                int t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t;
            }
        // 水平翻转每行
        for (int i = 0; i < n; i++) {
            int l = 0, r = n - 1;
            while (l < r) {
                int t = matrix[i][l]; matrix[i][l] = matrix[i][r]; matrix[i][r] = t;
                l++; r--;
            }
        }
    }
}`,
    keyPoints: ["转置：沿主对角线交换", "翻转：每行左右翻转", "两步组合等价于旋转90°"],
    steps: ["转置：matrix[i][j]↔matrix[j][i]", "每行水平翻转", "验证：(i,j)→(j,i)→(j,n-1-i)"]
  }],
  pitfalls: ["转置时 j 从 i+1 开始防止交换两次", "翻转是对每行操作不是整体"]
};

SOLUTIONS["240"] = {
  thinking: "在二维矩阵中搜索目标值。矩阵特性：每行从左到右递增，每列从上到下递增。从右上角开始搜索，比目标大就左移，比目标小就下移。",
  approaches: [{
    name: "右上角搜索（Z形查找）",
    desc: "从右上角出发，当前值比 target 大就左移（减小），比 target 小就下移（增大）。",
    complexity: { time: "O(m+n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length;
        int row = 0, col = n - 1; // 从右上角开始
        while (row < m && col >= 0) {
            if (matrix[row][col] == target) return true;
            else if (matrix[row][col] > target) col--;
            else row++;
        }
        return false;
    }
}`,
    keyPoints: ["右上角是分界点：左小右大下大", "每次排除一行或一列", "O(m+n) 时间"],
    steps: ["从右上角 (0,n-1) 开始", "等于 target 返回 true", "大于 target 左移 col--", "小于 target 下移 row++"]
  }],
  pitfalls: ["不能从左上角或右下角开始——两个方向同增/同减", "左下角也可以作为起点"]
};

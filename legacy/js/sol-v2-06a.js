/* Batch 6a: 普通数组(3) + 二分查找(4) = 7题 */

SOLUTIONS["53"] = {
  thinking: "最大子数组和。Kadane算法：dp[i]=max(nums[i], dp[i-1]+nums[i])。用单变量优化空间。",
  approaches: [{
    name: "Kadane算法（动态规划）",
    desc: "遍历时维护当前连续和。如果当前和为负，不如从当前元素重新开始。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0], currSum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currSum = Math.max(nums[i], currSum + nums[i]);
            maxSum = Math.max(maxSum, currSum);
        }
        return maxSum;
    }
}`,
    keyPoints: ["currSum=max(nums[i], currSum+nums[i])", "负数前缀不如丢弃", "O(1)空间"],
    steps: ["遍历每个元素", "当前和=max(自己, 当前和+自己)", "更新全局最大值"]
  }],
  pitfalls: ["初始值用nums[0]不是0（可能有全负数组）", "先更新currSum再更新maxSum"]
};

SOLUTIONS["56"] = {
  thinking: "合并区间。按起点排序后，重叠的区间合并。",
  approaches: [{
    name: "排序 + 合并",
    desc: "按区间起点排序。遍历时如果当前区间起点<=上一个的终点，合并；否则新增。",
    complexity: { time: "O(n log n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> result = new ArrayList<>();
        for (int[] interval : intervals) {
            if (!result.isEmpty() && interval[0] <= result.get(result.size()-1)[1])
                result.get(result.size()-1)[1] = Math.max(result.get(result.size()-1)[1], interval[1]);
            else
                result.add(interval);
        }
        return result.toArray(new int[0][]);
    }
}`,
    keyPoints: ["按起点排序", "重叠条件：当前start<=上一end", "合并时取较大的end"],
    steps: ["按起点排序", "遍历比较与前一个的终点", "重叠则合并，否则新增"]
  }],
  pitfalls: ["合并时要更新end为max不是覆盖"]
};

SOLUTIONS["238"] = {
  thinking: "除自身以外数组的乘积。不能使用除法。用前缀积×后缀积。",
  approaches: [{
    name: "前缀积 × 后缀积",
    desc: "result[i] = 左边所有数的积 × 右边所有数的积。两次遍历：先正向求前缀积，再反向乘后缀积。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        result[0] = 1;
        // 前缀积
        for (int i = 1; i < n; i++)
            result[i] = result[i-1] * nums[i-1];
        // 后缀积
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= right;
            right *= nums[i];
        }
        return result;
    }
}`,
    keyPoints: ["先填前缀积", "再用right变量反向乘后缀积", "result数组不算额外空间→O(1)"],
    steps: ["result[i] = nums[0..i-1]的积", "反向遍历乘以nums[i+1..n-1]的积"]
  }],
  pitfalls: ["right 变量初始化为1", "O(1)空间需要用result数组本身"]
};

SOLUTIONS["35"] = {
  thinking: "搜索插入位置。标准二分查找，找不到时left就是插入位置。",
  approaches: [{
    name: "二分查找",
    desc: "标准二分。循环结束后left即为插入位置。",
    complexity: { time: "O(log n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int searchInsert(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return left; // 插入位置
    }
}`,
    keyPoints: ["while left<=right", "找不到时left就是插入点", "mid=left+(right-left)/2 防溢出"],
    steps: ["标准二分", "target不存在时返回left"]
  }],
  pitfalls: ["循环条件是<=不是<", "找不到返回left不是-1"]
};

SOLUTIONS["74"] = {
  thinking: "二维矩阵搜索。矩阵可看作一个有序一维数组，直接二分。",
  approaches: [{
    name: "二分查找（展平）",
    desc: "将二维索引映射到一维：mid→(mid/cols, mid%cols)。标准二分。",
    complexity: { time: "O(log(m×n))", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int m = matrix.length, n = matrix[0].length;
        int left = 0, right = m * n - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            int val = matrix[mid / n][mid % n];
            if (val == target) return true;
            else if (val < target) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    }
}`,
    keyPoints: ["mid/n 得行，mid%n 得列", "本质就是一个有序一维数组"],
    steps: ["二分0到m*n-1", "mid映射到二维", "比较并移动"]
  }],
  pitfalls: ["矩阵列数n不是m", "mid/n 和 mid%n 不要搞反"]
};

SOLUTIONS["34"] = {
  thinking: "查找元素的第一个和最后一个位置。两次二分：一次找左边界，一次找右边界。",
  approaches: [{
    name: "两次二分",
    desc: "第一次二分找左边界（找到target后继续向左），第二次找右边界（找到target后继续向右）。",
    complexity: { time: "O(log n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int[] searchRange(int[] nums, int target) {
        int left = findLeft(nums, target);
        int right = findRight(nums, target);
        return new int[]{left, right};
    }
    private int findLeft(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1, idx = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] >= target) hi = mid - 1;
            else lo = mid + 1;
            if (nums[mid] == target) idx = mid;
        }
        return idx;
    }
    private int findRight(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1, idx = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] <= target) lo = mid + 1;
            else hi = mid - 1;
            if (nums[mid] == target) idx = mid;
        }
        return idx;
    }
}`,
    keyPoints: ["findLeft: nums[mid]>=target 时hi=mid-1", "findRight: nums[mid]<=target 时lo=mid+1", "记录最后的匹配位置"],
    steps: ["二分找左边界", "二分找右边界", "返回[left, right]"]
  }],
  pitfalls: ["找到target后不立即返回——继续搜索更靠左/右的位置"]
};

SOLUTIONS["33"] = {
  thinking: "搜索旋转排序数组。旋转后有一半是有序的。判断哪一半有序，确定target在哪个范围。",
  approaches: [{
    name: "二分（判断有序半段）",
    desc: "每次二分时，判断左半还是右半有序。然后判断target是否在有序的那一半里。",
    complexity: { time: "O(log n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            // 左半有序
            if (nums[left] <= nums[mid]) {
                if (target >= nums[left] && target < nums[mid]) right = mid - 1;
                else left = mid + 1;
            }
            // 右半有序
            else {
                if (target > nums[mid] && target <= nums[right]) left = mid + 1;
                else right = mid - 1;
            }
        }
        return -1;
    }
}`,
    keyPoints: ["nums[left]<=nums[mid] 判断左半有序", "target在有序半段则搜该半", "否则搜另一半"],
    steps: ["二分mid", "判断哪半有序", "判断target在哪个范围", "缩小搜索范围"]
  }],
  pitfalls: ["nums[left]<=nums[mid] 用<=处理left==mid的情况", "边界用>=和<="]
};

/* Batch 1: 哈希(3) + 双指针(4) + 滑动窗口(2) = 9题 */
/* 以下代码会追加到 SOLUTIONS 对象上 */

SOLUTIONS["1"] = {
  thinking: "给定数组和目标值，找两个数使其和等于目标。最直观的思路是双重循环暴力枚举，但时间复杂度 O(n²)。更优的方案是用哈希表——对每个元素 nums[i]，只需检查 target - nums[i] 是否已经在哈希表中，这样只需一次遍历。",
  approaches: [
    {
      name: "哈希表一次遍历（最优）",
      desc: "边遍历边查哈希表。对每个元素 nums[i]，检查 target - nums[i] 是否已在表中。如果在，直接返回；不在则将当前元素存入表中。这样不会用到自己（因为存入发生在检查之后）。",
      complexity: { time: "O(n)", space: "O(n)" },
      lang: "java",
      code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[0]; // 题目保证有解，不会执行到这
    }
}`,
      keyPoints: ["一次遍历完成", "先查再存避免用到自己", "HashMap 查找 O(1)"],
      steps: ["初始化空 HashMap", "遍历每个元素 nums[i]", "计算 complement = target - nums[i]", "若 complement 在 map 中，返回结果", "否则将 nums[i]:i 存入 map"]
    },
    {
      name: "暴力双重循环",
      desc: "枚举所有两两组合，检查和是否等于 target。简单直观但效率低。",
      complexity: { time: "O(n²)", space: "O(1)" },
      lang: "java",
      code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[0];
    }
}`,
      keyPoints: ["最简单的思路", "无需额外空间", "大数据量超时"],
      steps: ["外层循环 i 从 0 到 n-1", "内层循环 j 从 i+1 到 n-1", "检查 nums[i]+nums[j]==target"]
    }
  ],
  pitfalls: ["不要先存完再查——会导致可能用到自己", "注意返回的是索引不是值"]
};

SOLUTIONS["49"] = {
  thinking: "字母异位词是指字母相同但排列不同的字符串。如果把每个字符串的字符排序，那么所有互为异位词的字符串排序后结果相同。因此可以用排序后的字符串作为哈希键来分组。另一种方法是统计每个字母的出现次数作为键。",
  approaches: [
    {
      name: "排序字符串作为哈希键",
      desc: "对每个字符串排序，排序结果相同的即为异位词，分到同一组。",
      complexity: { time: "O(n·k·log k)", space: "O(n·k)" },
      lang: "java",
      code: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`,
      keyPoints: ["排序后字符串作为 key", "computeIfAbsent 简化代码", "字母异位词排序后一定相同"],
      steps: ["遍历每个字符串", "转为 char[] 排序得到 key", "用 HashMap 分组", "返回所有分组列表"]
    },
    {
      name: "字符计数数组作为键",
      desc: "统计每个字母出现次数，用 26 长度数组转字符串作为 key，避免排序开销。",
      complexity: { time: "O(n·k)", space: "O(n·k)" },
      lang: "java",
      code: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            int[] count = new int[26];
            for (char c : s.toCharArray()) count[c - 'a']++;
            String key = Arrays.toString(count);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`,
      keyPoints: ["26字母计数代替排序", "时间复杂度更优", "key 用 Arrays.toString 转换"],
      steps: ["遍历每个字符串", "统计26个字母出现频率", "频率数组转字符串作为 key", "HashMap 分组"]
    }
  ],
  pitfalls: ["排序用 Arrays.sort(chars) 不是 String 排序", "注意空字符串的处理"]
};

SOLUTIONS["128"] = {
  thinking: "找最长的连续整数序列。暴力排序后遍历是 O(n log n)，但可以做到 O(n)。关键观察：从序列的起点（即 num-1 不在集合中）开始向后数，每个元素最多被访问两次。",
  approaches: [
    {
      name: "HashSet 枚举序列起点",
      desc: "把所有数放入 HashSet。只从序列起点（num-1 不在集合中）开始向后枚举，保证 O(n)。",
      complexity: { time: "O(n)", space: "O(n)" },
      lang: "java",
      code: `class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int n : nums) set.add(n);
        int maxLen = 0;
        for (int n : set) {
            // 只有序列起点才开始计数
            if (!set.contains(n - 1)) {
                int cur = n, len = 1;
                while (set.contains(cur + 1)) {
                    cur++; len++;
                }
                maxLen = Math.max(maxLen, len);
            }
        }
        return maxLen;
    }
}`,
      keyPoints: ["只从序列起点开始计数", "每个元素最多被访问两次 → O(n)", "set.contains(n-1) 判断是否为起点"],
      steps: ["全部元素放入 HashSet", "遍历集合中每个元素", "若 num-1 不在集合中 → 这是序列起点", "从起点向后数连续序列长度", "更新最大值"]
    }
  ],
  pitfalls: ["不要对每个元素都向后枚举——会变成 O(n²)", "起点判断条件是 n-1 不在集合中"]
};

SOLUTIONS["283"] = {
  thinking: "把所有 0 移到数组末尾，保持非零元素相对顺序。快慢指针：快指针遍历，慢指针指向下一个非零元素应放的位置。",
  approaches: [
    {
      name: "双指针一次遍历",
      desc: "慢指针指向下一个非零位置。快指针遍历数组，遇到非零就交换到慢指针位置，慢指针前进。",
      complexity: { time: "O(n)", space: "O(1)" },
      lang: "java",
      code: `class Solution {
    public void moveZeroes(int[] nums) {
        int slow = 0;
        for (int fast = 0; fast < nums.length; fast++) {
            if (nums[fast] != 0) {
                int temp = nums[slow];
                nums[slow] = nums[fast];
                nums[fast] = temp;
                slow++;
            }
        }
    }
}`,
      keyPoints: ["原地操作 O(1) 空间", "交换而非覆盖——保持非零元素顺序", "慢指针始终指向下一个非零应放的位置"],
      steps: ["slow=0, fast=0", "fast 遍历数组", "遇到非零：交换 nums[slow] 和 nums[fast]，slow++", "fast 继续前进"]
    }
  ],
  pitfalls: ["不能用覆盖法后补零——题目要求原地修改", "交换确保非零元素顺序不变"]
};

SOLUTIONS["11"] = {
  thinking: "两条线段和 x 轴围成的容器，水量 = min(h[i],h[j]) × (j-i)。要最大化水量。双指针从两端出发，每次移动较短的一边——因为移动较长的一边不可能让水量增加。",
  approaches: [
    {
      name: "贪心双指针",
      desc: "左右指针从两端出发。每次移动较短的一边（因为移动较长边不可能获得更大水量），记录最大值。",
      complexity: { time: "O(n)", space: "O(1)" },
      lang: "java",
      code: `class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxWater = 0;
        while (left < right) {
            int h = Math.min(height[left], height[right]);
            int w = right - left;
            maxWater = Math.max(maxWater, h * w);
            if (height[left] < height[right]) left++;
            else right--;
        }
        return maxWater;
    }
}`,
      keyPoints: ["面积 = min(h[left],h[right]) × 宽度", "移动较短的一边", "一次遍历 O(n)"],
      steps: ["left=0, right=n-1", "计算当前水量并更新最大值", "移动较短的一边", "直到 left >= right"]
    }
  ],
  pitfalls: ["不是移动较长边！移动较长边宽度减少但高度不会增加", "宽度是 right-left 不是 right-left+1"]
};

SOLUTIONS["15"] = {
  thinking: "找三个数之和为 0 的所有不重复三元组。排序后固定一个数，另外两个用双指针找。关键去重：固定的数和移动的指针都要跳过重复值。",
  approaches: [
    {
      name: "排序 + 双指针",
      desc: "排序数组。固定第一个数 nums[i]，在 i+1 到末尾用双指针找两数之和等于 -nums[i]。跳过重复值去重。",
      complexity: { time: "O(n²)", space: "O(1)" },
      lang: "java",
      code: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums);
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue; // 去重
            if (nums[i] > 0) break; // 剪枝：最小的都>0
            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++; right--;
                } else if (sum < 0) left++;
                else right--;
            }
        }
        return result;
    }
}`,
      keyPoints: ["排序是双指针的前提", "三处去重：i、left、right", "nums[i]>0 提前剪枝"],
      steps: ["排序", "固定 i 从 0 遍历", "left=i+1, right=n-1", "sum<0 则 left++, sum>0 则 right--", "sum==0 记录结果并跳过重复值"]
    }
  ],
  pitfalls: ["忘记去重导致重复结果", "去重条件是 nums[i]==nums[i-1] 不是 nums[i]==nums[i+1]"]
};

SOLUTIONS["42"] = {
  thinking: "接雨水问题。每个位置能接的雨水量 = min(左侧最高, 右侧最高) - 当前高度。三种解法：动态规划预处理左右最大值、双指针、单调栈。",
  approaches: [
    {
      name: "动态规划（左右最大值数组）",
      desc: "预处理 leftMax[] 和 rightMax[] 数组。每个位置雨水量 = min(leftMax[i], rightMax[i]) - height[i]。",
      complexity: { time: "O(n)", space: "O(n)" },
      lang: "java",
      code: `class Solution {
    public int trap(int[] height) {
        int n = height.length;
        if (n == 0) return 0;
        int[] leftMax = new int[n], rightMax = new int[n];
        leftMax[0] = height[0];
        for (int i = 1; i < n; i++)
            leftMax[i] = Math.max(leftMax[i - 1], height[i]);
        rightMax[n - 1] = height[n - 1];
        for (int i = n - 2; i >= 0; i--)
            rightMax[i] = Math.max(rightMax[i + 1], height[i]);
        int water = 0;
        for (int i = 0; i < n; i++)
            water += Math.min(leftMax[i], rightMax[i]) - height[i];
        return water;
    }
}`,
      keyPoints: ["预处理左右最大值数组", "雨水量 = min(leftMax,rightMax) - height", "三次遍历"],
      steps: ["正向遍历求 leftMax[]", "逆向遍历求 rightMax[]", "每个位置计算雨水量并累加"]
    },
    {
      name: "双指针（空间优化）",
      desc: "左右指针从两端出发，维护 leftMax 和 rightMax 变量。移动较小的一边，因为较小边的雨水已经可以确定。",
      complexity: { time: "O(n)", space: "O(1)" },
      lang: "java",
      code: `class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                leftMax = Math.max(leftMax, height[left]);
                water += leftMax - height[left];
                left++;
            } else {
                rightMax = Math.max(rightMax, height[right]);
                water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
}`,
      keyPoints: ["O(1) 空间", "移动较小边", "leftMax-height[left] >= 0"],
      steps: ["left=0, right=n-1", "比较两边高度", "较小边：更新 max，累加雨水，移动指针"]
    }
  ],
  pitfalls: ["双指针中 leftMax 是左侧实际最大值，不是假设值", "空数组直接返回 0"]
};

SOLUTIONS["3"] = {
  thinking: "找无重复字符的最长子串。滑动窗口：用 HashSet 维护窗口内的字符，右指针扩展窗口，遇到重复时左指针收缩。",
  approaches: [
    {
      name: "滑动窗口 + HashSet",
      desc: "左右指针维护无重复窗口。右指针尝试扩展，若遇到重复则左指针收缩直到无重复。记录窗口最大长度。",
      complexity: { time: "O(n)", space: "O(min(m,n))" },
      lang: "java",
      code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> set = new HashSet<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            while (set.contains(s.charAt(right))) {
                set.remove(s.charAt(left));
                left++;
            }
            set.add(s.charAt(right));
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
      keyPoints: ["HashSet 维护窗口内字符", "遇到重复时左指针收缩", "窗口大小 = right - left + 1"],
      steps: ["left=0, 遍历 right", "若 s[right] 在 set 中，移除 s[left] 并 left++", "将 s[right] 加入 set", "更新最大窗口长度"]
    },
    {
      name: "滑动窗口 + HashMap（优化跳转）",
      desc: "用 HashMap 记录字符最新位置，遇到重复时直接跳到重复字符的下一个位置，避免逐步收缩。",
      complexity: { time: "O(n)", space: "O(min(m,n))" },
      lang: "java",
      code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int left = 0, maxLen = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c)) {
                left = Math.max(left, map.get(c) + 1);
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
      keyPoints: ["HashMap 直接记录位置", "left = Math.max(left, map.get(c)+1)", "避免重复字符在 left 之前的情况"],
      steps: ["遍历 right", "若字符在 map 中，left 跳到 max(left, 重复位置+1)", "更新 map 和最大长度"]
    }
  ],
  pitfalls: ["left 跳转时用 Math.max 防止回退", "HashSet 方案中 while 不是 if"]
};

SOLUTIONS["438"] = {
  thinking: "找 p 的所有字母异位词在 s 中的起始位置。滑动窗口：窗口大小固定为 p 的长度，用频率数组比较窗口内字符是否与 p 相同。",
  approaches: [
    {
      name: "固定窗口 + 频率数组",
      desc: "维护大小为 p.length() 的窗口，用 26 长度频率数组记录窗口内字符频率，与 p 的频率比较。",
      complexity: { time: "O(n·26) = O(n)", space: "O(1)" },
      lang: "java",
      code: `class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> result = new ArrayList<>();
        if (s.length() < p.length()) return result;
        int[] pCount = new int[26], sCount = new int[26];
        for (char c : p.toCharArray()) pCount[c - 'a']++;
        int window = p.length();
        for (int i = 0; i < s.length(); i++) {
            sCount[s.charAt(i) - 'a']++;
            if (i >= window) sCount[s.charAt(i - window) - 'a']--;
            if (i >= window - 1 && Arrays.equals(sCount, pCount))
                result.add(i - window + 1);
        }
        return result;
    }
}`,
      keyPoints: ["窗口大小固定 = p.length()", "用 Arrays.equals 比较频率数组", "i >= window 时移除窗口最左字符"],
      steps: ["统计 p 的字符频率", "滑动窗口遍历 s", "窗口满时比较频率数组", "匹配则记录起始位置"]
    }
  ],
  pitfalls: ["s 长度小于 p 时直接返回空", "频率数组比较用 Arrays.equals"]
};

/* Batch 6b: 二分查找(2) + 栈(5) + 堆(3) = 10题 */

SOLUTIONS["153"] = {
  thinking: "旋转排序数组找最小值。二分：如果nums[mid]>nums[right]，最小值在右半；否则在左半。",
  approaches: [{
    name: "二分（与右端比较）",
    desc: "每次与nums[right]比较。nums[mid]>nums[right]→最小在右半(left=mid+1)，否则在左半(right=mid)。",
    complexity: { time: "O(log n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int findMin(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) left = mid + 1;
            else right = mid;
        }
        return nums[left];
    }
}`,
    keyPoints: ["与nums[right]比较不是nums[left]", "right=mid 不是 mid-1（mid可能是答案）", "循环条件 left<right"],
    steps: ["二分", "nums[mid]>nums[right]→left=mid+1", "否则right=mid", "返回nums[left]"]
  }],
  pitfalls: ["right=mid不是mid-1因为mid可能就是最小值"]
};

SOLUTIONS["4"] = {
  thinking: "两个有序数组的中位数。二分在较短数组上切分，保证左半元素数=右半，且左半最大<=右半最小。",
  approaches: [{
    name: "二分切分（O(log(min(m,n)))）",
    desc: "在较短数组上二分切分位置i，另一个数组切分位置j=(m+n+1)/2-i。检查边界条件。",
    complexity: { time: "O(log(min(m,n)))", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
        int m = nums1.length, n = nums2.length;
        int left = 0, right = m;
        while (left <= right) {
            int i = (left + right) / 2, j = (m + n + 1) / 2 - i;
            int left1 = i == 0 ? Integer.MIN_VALUE : nums1[i-1];
            int right1 = i == m ? Integer.MAX_VALUE : nums1[i];
            int left2 = j == 0 ? Integer.MIN_VALUE : nums2[j-1];
            int right2 = j == n ? Integer.MAX_VALUE : nums2[j];
            if (left1 <= right2 && left2 <= right1) {
                if ((m + n) % 2 == 1) return Math.max(left1, left2);
                return (Math.max(left1, left2) + Math.min(right1, right2)) / 2.0;
            } else if (left1 > right2) right = i - 1;
            else left = i + 1;
        }
        return 0.0;
    }
}`,
    keyPoints: ["在较短数组上二分", "j=(m+n+1)/2-i 保证左半>=右半", "left1<=right2 && left2<=right1 为正确切分"],
    steps: ["二分切分位置i", "计算j", "检查边界条件", "奇数取max(left)，偶数取avg"]
  }],
  pitfalls: ["确保nums1是较短数组", "边界用MIN_VALUE/MAX_VALUE处理"]
};

SOLUTIONS["20"] = {
  thinking: "有效的括号。用栈匹配：遇到左括号入栈，遇到右括号检查栈顶是否匹配。",
  approaches: [{
    name: "栈",
    desc: "遍历字符串，左括号入栈，右括号弹出栈顶检查是否匹配。最后栈必须为空。",
    complexity: { time: "O(n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
        for (char c : s.toCharArray()) {
            if (pairs.containsValue(c)) stack.push(c);
            else if (pairs.containsKey(c)) {
                if (stack.isEmpty() || stack.pop() != pairs.get(c)) return false;
            }
        }
        return stack.isEmpty();
    }
}`,
    keyPoints: ["右括号→左括号的映射", "弹出时检查匹配", "最后栈为空才有效"],
    steps: ["左括号入栈", "右括号弹出栈顶比较", "遍历完栈必须为空"]
  }],
  pitfalls: ["右括号时栈可能为空", "Map.of 是Java9+特性"]
};

SOLUTIONS["155"] = {
  thinking: "最小栈。在普通栈基础上要O(1)获取最小值。用一个辅助栈同步记录每步的最小值。",
  approaches: [{
    name: "辅助栈",
    desc: "主栈存数据，辅助栈同步存当前最小值。push时辅助栈push min(val, 当前栈顶)，pop时两个栈同步弹。",
    complexity: { time: "O(1) all ops", space: "O(n)" },
    lang: "java",
    code: `class MinStack {
    Deque<Integer> stack, minStack;
    public MinStack() { stack = new ArrayDeque<>(); minStack = new ArrayDeque<>(); }
    public void push(int val) {
        stack.push(val);
        minStack.push(minStack.isEmpty() ? val : Math.min(val, minStack.peek()));
    }
    public void pop() { stack.pop(); minStack.pop(); }
    public int top() { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
}`,
    keyPoints: ["辅助栈同步记录最小值", "push时与辅助栈顶比较取min"],
    steps: ["push: 两栈同时push", "pop: 两栈同时pop", "getMin: 返回辅助栈顶"]
  }],
  pitfalls: ["push第一个元素时辅助栈为空要特殊处理"]
};

SOLUTIONS["394"] = {
  thinking: "字符串解码。如3[a2[c]]→accaccacc。用两个栈：数字栈和字符串栈。",
  approaches: [{
    name: "双栈",
    desc: "遍历字符串：数字入数字栈，字母拼接当前串，[时把当前串和数字入栈并重置，]时弹出拼接。",
    complexity: { time: "O(n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public String decodeString(String s) {
        Deque<Integer> countStack = new ArrayDeque<>();
        Deque<StringBuilder> strStack = new ArrayDeque<>();
        StringBuilder curr = new StringBuilder();
        int num = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) num = num * 10 + c - '0';
            else if (c == '[') { countStack.push(num); strStack.push(curr); curr = new StringBuilder(); num = 0; }
            else if (c == ']') {
                int repeat = countStack.pop();
                StringBuilder prev = strStack.pop();
                for (int i = 0; i < repeat; i++) prev.append(curr);
                curr = prev;
            } else curr.append(c);
        }
        return curr.toString();
    }
}`,
    keyPoints: ["两个栈：数字栈+字符串栈", "[时保存当前状态并重置", "]时弹出重复拼接"],
    steps: ["数字累加", "[: 入栈+重置", "]: 弹出重复拼接", "字母: 拼接当前串"]
  }],
  pitfalls: ["数字可能多位——num=num*10+c-'0'", "]时是prev.append(curr)不是反过来"]
};

SOLUTIONS["739"] = {
  thinking: "每日温度。找下一个更高温度在第几天。单调栈：栈中存索引，遇到更高温时弹出。",
  approaches: [{
    name: "单调递减栈",
    desc: "栈存索引，栈内温度递减。遇到比栈顶高的温度时弹出，计算天数差。",
    complexity: { time: "O(n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] result = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int idx = stack.pop();
                result[idx] = i - idx;
            }
            stack.push(i);
        }
        return result;
    }
}`,
    keyPoints: ["单调递减栈", "遇到更高温弹出", "天数差 = 当前索引 - 弹出索引"],
    steps: ["遍历每天温度", "比栈顶高时弹出计算天数差", "当前索引入栈"]
  }],
  pitfalls: ["栈存索引不是温度值", "用while不是if"]
};

SOLUTIONS["84"] = {
  thinking: "柱状图最大矩形。对每根柱子，找左右第一个更矮的柱子。用单调递增栈一次遍历。",
  approaches: [{
    name: "单调递增栈",
    desc: "栈存索引，高度递增。遇到比栈顶矮的柱子时弹出，计算以弹出柱子为高的矩形面积。",
    complexity: { time: "O(n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public int largestRectangleArea(int[] heights) {
        Deque<Integer> stack = new ArrayDeque<>();
        int maxArea = 0;
        for (int i = 0; i <= heights.length; i++) {
            int h = i == heights.length ? 0 : heights[i];
            while (!stack.isEmpty() && h < heights[stack.peek()]) {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        return maxArea;
    }
}`,
    keyPoints: ["单调递增栈", "i==n 时 h=0 强制清空栈", "宽度 = i - stack.peek() - 1"],
    steps: ["遍历到i+1（含末尾哨兵0）", "比栈顶矮→弹出计算面积", "宽=当前i-新栈顶-1"]
  }],
  pitfalls: ["末尾哨兵h=0确保栈清空", "栈空时宽度=i"]
};

SOLUTIONS["215"] = {
  thinking: "数组中第K个最大元素。小顶堆维护K个最大的，或者快速选择。",
  approaches: [
    {
      name: "小顶堆（大小K）",
      desc: "维护大小为K的小顶堆。堆满后新元素比堆顶大就替换。最终堆顶即第K大。",
      complexity: { time: "O(n log k)", space: "O(k)" },
      lang: "java",
      code: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int num : nums) {
            pq.offer(num);
            if (pq.size() > k) pq.poll();
        }
        return pq.peek();
    }
}`,
      keyPoints: ["小顶堆大小K", "堆顶是K个中最小的=第K大", "pq.size()>k 弹出堆顶"],
      steps: ["遍历每个元素入堆", "堆超过k弹出最小", "返回堆顶"]
    },
    {
      name: "快速选择（Hoare）",
      desc: "类似快排的partition，每次只递归包含第K大的一侧。平均O(n)。",
      complexity: { time: "O(n) avg", space: "O(1)" },
      lang: "java",
      code: `class Solution {
    public int findKthLargest(int[] nums, int k) {
        return quickSelect(nums, 0, nums.length - 1, k);
    }
    private int quickSelect(int[] nums, int lo, int hi, int k) {
        int pivot = nums[lo], i = lo + 1, j = hi;
        while (i <= j) {
            if (nums[i] < pivot && nums[j] > pivot) swap(nums, i++, j--);
            if (nums[i] >= pivot) i++;
            if (nums[j] <= pivot) j--;
        }
        swap(nums, lo, j);
        if (j == k - 1) return nums[j];
        return j < k - 1 ? quickSelect(nums, j + 1, hi, k) : quickSelect(nums, lo, j - 1, k);
    }
    private void swap(int[] nums, int i, int j) { int t = nums[i]; nums[i] = nums[j]; nums[j] = t; }
}`,
      keyPoints: ["partition只递归一侧", "降序排列，找第K大=k-1位置", "平均O(n)"],
      steps: ["partition选pivot", "判断pivot位置", "只递归目标侧"]
    }
  ],
  pitfalls: ["第K大对应降序索引k-1", "快速选择最坏O(n²)，随机化pivot可优化"]
};

SOLUTIONS["347"] = {
  thinking: "前K个高频元素。先统计频率，然后用堆或桶排序。",
  approaches: [{
    name: "频率Map + 小顶堆",
    desc: "统计频率后，用大小K的小顶堆按频率排序，保留频率最高的K个。",
    complexity: { time: "O(n log k)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int n : nums) freq.merge(n, 1, Integer::sum);
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
        for (var entry : freq.entrySet()) {
            pq.offer(new int[]{entry.getKey(), entry.getValue()});
            if (pq.size() > k) pq.poll();
        }
        int[] result = new int[k];
        for (int i = 0; i < k; i++) result[i] = pq.poll()[0];
        return result;
    }
}`,
    keyPoints: ["先统计频率", "小顶堆按频率排序", "堆大小K保留最高频"],
    steps: ["统计频率", "入小顶堆（按频率）", "保留K个", "返回堆中元素"]
  }],
  pitfalls: ["Comparator比较频率不是值", "堆中存[val, freq]对"]
};

SOLUTIONS["295"] = {
  thinking: "数据流中位数。用两个堆：大顶堆存左半（较小），小顶堆存右半（较大）。",
  approaches: [{
    name: "双堆（大顶+小顶）",
    desc: "大顶堆存较小的一半，小顶堆存较大的一半。两堆大小差不超过1。大顶堆可以多一个。",
    complexity: { time: "O(log n) add", space: "O(n)" },
    lang: "java",
    code: `class MedianFinder {
    PriorityQueue<Integer> left;  // 大顶堆（较小的一半）
    PriorityQueue<Integer> right; // 小顶堆（较大的一半）
    public MedianFinder() {
        left = new PriorityQueue<>(Collections.reverseOrder());
        right = new PriorityQueue<>();
    }
    public void addNum(int num) {
        left.offer(num);
        right.offer(left.poll()); // 先放大顶堆，再把大顶堆最大值移到小顶堆
        if (left.size() < right.size()) left.offer(right.poll()); // 平衡
    }
    public double findMedian() {
        return left.size() > right.size() ? left.peek() : (left.peek() + right.peek()) / 2.0;
    }
}`,
    keyPoints: ["left大顶堆存较小半，right小顶堆存较大半", "先入left→移到right→平衡回left", "left可以多一个"],
    steps: ["新元素先入left", "left.poll移到right", "若left少则right.poll移回left", "中位数看堆顶"]
  }],
  pitfalls: ["平衡条件：left.size() >= right.size()", "addNum的三步操作顺序不能错"]
};

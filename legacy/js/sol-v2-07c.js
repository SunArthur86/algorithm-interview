/* Batch 7c: 技巧(5) = 5题 */

SOLUTIONS["136"] = {
  thinking: "只出现一次的数字。其他数字出现两次。异或：a^a=0, a^0=a。全部异或一遍即可。",
  approaches: [{
    name: "异或",
    desc: "所有数字异或，出现两次的互相抵消为0，最后剩下的就是出现一次的。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int singleNumber(int[] nums) {
        int result = 0;
        for (int num : nums) result ^= num;
        return result;
    }
}`,
    keyPoints: ["异或性质：a^a=0", "0^a=a", "交换律和结合律"],
    steps: ["遍历所有数", "异或累加", "返回结果"]
  }],
  pitfalls: ["初始值必须为0"]
};

SOLUTIONS["169"] = {
  thinking: "多数元素（出现超过n/2次）。Boyer-Moore投票算法：候选人+计数器。",
  approaches: [{
    name: "Boyer-Moore 投票",
    desc: "维护候选人和计数器。相同+1，不同-1，计数器归零换候选人。多数元素一定最后留下。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int majorityElement(int[] nums) {
        int candidate = nums[0], count = 1;
        for (int i = 1; i < nums.length; i++) {
            if (count == 0) { candidate = nums[i]; count = 1; }
            else if (nums[i] == candidate) count++;
            else count--;
        }
        return candidate;
    }
}`,
    keyPoints: ["count归零换候选人", "多数元素出现>n/2次一定存活", "无需验证"],
    steps: ["遍历", "相同+1不同-1", "归零换人", "返回候选人"]
  }],
  pitfalls: ["题目保证一定有多数元素，所以不用验证"]
};

SOLUTIONS["75"] = {
  thinking: "颜色分类（荷兰国旗问题）。三路分区：0放左，2放右，1在中间。",
  approaches: [{
    name: "三指针（荷兰国旗）",
    desc: "三个指针：left指向0的右边界，right指向2的左边界，curr遍历。遇到0交换到left，遇到2交换到right。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public void sortColors(int[] nums) {
        int left = 0, right = nums.length - 1, curr = 0;
        while (curr <= right) {
            if (nums[curr] == 0) {
                swap(nums, curr++, left++);
            } else if (nums[curr] == 2) {
                swap(nums, curr, right--);
            } else {
                curr++;
            }
        }
    }
    private void swap(int[] nums, int i, int j) {
        int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
    }
}`,
    keyPoints: ["遇到0: swap(curr,left),curr++left++", "遇到2: swap(curr,right),right--", "遇到1: curr++"],
    steps: ["curr遍历", "0→交换到左边", "2→交换到右边", "1→跳过"]
  }],
  pitfalls: ["交换2后curr不自增——交换来的元素还需检查", "while条件curr<=right"]
};

SOLUTIONS["31"] = {
  thinking: "下一个排列。从右找第一个下降的i，再从右找第一个大于nums[i]的j，交换，反转i+1到末尾。",
  approaches: [{
    name: "三步法",
    desc: "1. 从右找第一个i使得nums[i]<nums[i+1]。2. 从右找第一个j使得nums[j]>nums[i]。3. 交换i和j，反转i+1到末尾。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public void nextPermutation(int[] nums) {
        // 1. 找下降点
        int i = nums.length - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;
        if (i >= 0) {
            // 2. 找比nums[i]大的最小值
            int j = nums.length - 1;
            while (nums[j] <= nums[i]) j--;
            // 3. 交换
            swap(nums, i, j);
        }
        // 4. 反转i+1到末尾
        reverse(nums, i + 1, nums.length - 1);
    }
    private void swap(int[] nums, int i, int j) { int t = nums[i]; nums[i] = nums[j]; nums[j] = t; }
    private void reverse(int[] nums, int l, int r) { while (l < r) swap(nums, l++, r--); }
}`,
    keyPoints: ["从右找第一个下降", "从右找第一个比它大的", "交换后反转后面"],
    steps: ["找i（第一个下降点）", "找j（大于nums[i]的最右值）", "交换", "反转i+1到末尾"]
  }],
  pitfalls: ["i<0说明整体降序→全反转得到最小", "反转不是排序——后面已经是降序"]
};

SOLUTIONS["287"] = {
  thinking: "寻找重复数。不能修改数组。Floyd判圈算法：把数组看作链表，nums[i]是next指针。",
  approaches: [{
    name: "Floyd判圈（快慢指针）",
    desc: "把nums[i]看作i→nums[i]的链表。重复元素造成环。快慢指针找相遇点，再找入环点。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public int findDuplicate(int[] nums) {
        // 快慢指针找相遇点
        int slow = nums[0], fast = nums[0];
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        // 找入环点
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}`,
    keyPoints: ["nums[i]作为链表指针", "do-while找相遇点", "第二次同速找入环点=重复值"],
    steps: ["快慢指针找相遇点", "一个指针回头", "同速走找入环点"]
  }],
  pitfalls: ["do-while不是while（初始slow==fast）", "入环点就是重复元素"]
};

/* ========================================================================
   扩展练习 (Bonus) — 不在 LeetCode 热题 100 列表中，但面试高频、值得掌握。
   这些题解独立挂载在 EXTRA_SOLUTIONS 对象上，由 app.js 单独渲染。
   每题仍遵循与主列表一致的格式：thinking / approaches / pitfalls。
   ======================================================================== */

var EXTRA_SOLUTIONS = EXTRA_SOLUTIONS || {};

/* 88. 合并两个有序数组 —— 双指针经典，从原 sol-v2-02.js 迁移而来 */
EXTRA_SOLUTIONS["88"] = {
  slug: "merge-sorted-array",
  title: "合并两个有序数组",
  diff: "Easy",
  cat: "双指针",
  tags: ["数组", "双指针", "排序"],
  url: "https://leetcode.cn/problems/merge-sorted-array/",
  thinking: "把有序数组 nums2 合并进 nums1 的尾部（nums1 末尾预留了 n 个位置）。正向合并需要拷贝 nums1 的待处理元素，避免被覆盖。关键观察：nums1 后半段是空的，所以从后往前填充可以直接写，永远不会覆盖尚未处理的元素。",
  approaches: [{
    name: "逆向双指针（最优）",
    desc: "三指针：p1 指向 nums1 有效末尾(m-1)、p2 指向 nums2 末尾(n-1)、p 指向合并后末尾(m+n-1)。每次把较大的填到 p，并向左移动。",
    complexity: { time: "O(m+n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int p1 = m - 1, p2 = n - 1, p = m + n - 1;
        while (p1 >= 0 && p2 >= 0) {
            nums1[p--] = nums1[p1] > nums2[p2] ? nums1[p1--] : nums2[p2--];
        }
        // nums2 还有剩余就继续拷贝；nums1 有剩余时无需处理，因为它本来就在正确位置
        while (p2 >= 0) nums1[p--] = nums2[p2--];
    }
}`,
    keyPoints: ["从后往前填，永远不覆盖未处理元素", "三个指针：p1、p2、p", "只需处理 nums2 的剩余"],
    steps: ["p1=m-1, p2=n-1, p=m+n-1", "比较 nums1[p1] 与 nums2[p2]，较大者填入 p 位置", "p2 有剩余继续填入（p1 剩余无需移动）"]
  }],
  pitfalls: ["从前往后填会覆盖 nums1 未处理元素", "p1 有剩余不用管——它已经在正确位置"]
};

/* 232. 用栈实现队列 —— 双栈倒腾的经典模型，Hot 100 之外的常考题 */
EXTRA_SOLUTIONS["232"] = {
  slug: "implement-queue-using-stacks",
  title: "用栈实现队列",
  diff: "Easy",
  cat: "栈",
  tags: ["栈", "设计", "队列"],
  url: "https://leetcode.cn/problems/implement-queue-using-stacks/",
  thinking: "栈是后进先出(LIFO)，队列是先进先出(FIFO)。一个栈无法反向，但两个栈串联即可：入栈只写 inStack，出栈只从 outStack 读；outStack 空时把 inStack 全部倒进来。每个元素最多被搬运两次，均摊 O(1)。",
  approaches: [{
    name: "双栈（均摊 O(1)）",
    desc: "inStack 负责入队，outStack 负责出队。出队时若 outStack 为空，把 inStack 逐个 pop 并 push 到 outStack，顺序就被反转了一次。",
    complexity: { time: "均摊 O(1)", space: "O(n)" },
    lang: "java",
    code: `class MyQueue {
    private Deque<Integer> in = new ArrayDeque<>();
    private Deque<Integer> out = new ArrayDeque<>();

    public void push(int x) {
        in.push(x);
    }

    public int pop() {
        moveIfEmpty();
        return out.pop();
    }

    public int peek() {
        moveIfEmpty();
        return out.peek();
    }

    public boolean empty() {
        return in.isEmpty() && out.isEmpty();
    }

    private void moveIfEmpty() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());
        }
    }
}`,
    keyPoints: ["入队写 in，出队读 out", "out 空时才倒栈（懒倒栈）", "每个元素至多搬运 2 次 → 均摊 O(1)"],
    steps: ["push → inStack.push", "pop/peek → 若 outStack 空则倒栈", "倒栈：while !in.empty() out.push(in.pop())"]
  }],
  pitfalls: ["每次出队都倒栈会退化成 O(n)", "用 Deque 而非 Stack（Stack 继承 Vector，已过时）"]
};

/* 1+ : 912. 排序数组 —— 把"排序"作为可测的扩展题，串起多种排序算法 */
EXTRA_SOLUTIONS["912"] = {
  slug: "sort-an-array",
  title: "排序数组",
  diff: "Medium",
  cat: "普通数组",
  tags: ["数组", "分治", "排序", "堆", "快速排序", "归并排序"],
  url: "https://leetcode.cn/problems/sort-an-array/",
  thinking: "把一组整数排成升序。这是所有排序算法的练兵场：快排、归并、堆排都能过。理解三者的取舍——快排平均最快但不稳定，归并稳定但需 O(n) 额外空间，堆排原地且最坏 O(n log n)。",
  approaches: [
    {
      name: "快速排序（随机化 pivot）",
      desc: "随机选 pivot 避免最坏 O(n²)。三路划分处理重复元素更高效。",
      complexity: { time: "O(n log n) 期望", space: "O(log n)" },
      lang: "java",
      code: `class Solution {
    public int[] sortArray(int[] nums) {
        shuffle(nums);
        quickSort(nums, 0, nums.length - 1);
        return nums;
    }

    private void quickSort(int[] nums, int lo, int hi) {
        if (lo >= hi) return;
        int pivot = nums[lo + (hi - lo) / 2];
        int i = lo, j = hi;
        while (i <= j) {
            while (nums[i] < pivot) i++;
            while (nums[j] > pivot) j--;
            if (i <= j) {
                int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
                i++; j--;
            }
        }
        quickSort(nums, lo, j);
        quickSort(nums, i, hi);
    }

    private void shuffle(int[] nums) {
        Random rnd = new Random();
        for (int i = nums.length - 1; i > 0; i--) {
            int j = rnd.nextInt(i + 1);
            int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
        }
    }
}`,
      keyPoints: ["先 shuffle 避免 O(n²) 最坏情况", "Hoare 双指针划分", "递归两侧"],
      steps: ["随机打乱", "选 pivot（取中点）", "双指针左右扫描并交换", "递归排序左右两段"]
    },
    {
      name: "归并排序",
      desc: "分治：拆到单元素，再两两合并。稳定排序，但需 O(n) 辅助空间。",
      complexity: { time: "O(n log n)", space: "O(n)" },
      lang: "java",
      code: `class Solution {
    private int[] tmp;

    public int[] sortArray(int[] nums) {
        tmp = new int[nums.length];
        mergeSort(nums, 0, nums.length - 1);
        return nums;
    }

    private void mergeSort(int[] nums, int lo, int hi) {
        if (lo >= hi) return;
        int mid = lo + (hi - lo) / 2;
        mergeSort(nums, lo, mid);
        mergeSort(nums, mid + 1, hi);
        // 合并 [lo,mid] 与 [mid+1,hi]
        int i = lo, j = mid + 1, k = lo;
        for (; i <= mid && j <= hi; k++) {
            tmp[k] = nums[i] <= nums[j] ? nums[i++] : nums[j++];
        }
        while (i <= mid) tmp[k++] = nums[i++];
        while (j <= hi) tmp[k++] = nums[j++];
        System.arraycopy(tmp, lo, nums, lo, hi - lo + 1);
    }
}`,
      keyPoints: ["稳定排序", "需 O(n) 辅助数组", "最坏也是 O(n log n)"],
      steps: ["拆分到单个元素", "两段合并到 tmp", "拷回原数组"]
    }
  ],
  pitfalls: ["快排不 shuffle 在已排序输入上会 O(n²) 甚至栈溢出", "归并的辅助数组可复用，避免每次递归都 new"]
};

/* 169 的延伸：229. 多数元素 II —— 摩尔投票的进阶（>⌊n/3⌋） */
EXTRA_SOLUTIONS["229"] = {
  slug: "majority-element-ii",
  title: "多数元素 II",
  diff: "Medium",
  cat: "技巧",
  tags: ["数组", "哈希表", "计数", "排序"],
  url: "https://leetcode.cn/problems/majority-element-ii/",
  thinking: "找出现次数 > ⌊n/3⌋ 的所有元素。这类元素至多 2 个。摩尔投票可推广：维护两个候选 + 两个计数器，相同的票累加，遇到第三个不同值时三方对消。",
  approaches: [{
    name: "摩尔投票（两个候选）",
    desc: "至多有 2 个众数。两两配对消除，最后剩的两个候选再各扫一遍数组验证是否真 > n/3。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public List<Integer> majorityElement(int[] nums) {
        int cand1 = 0, cand2 = 0, cnt1 = 0, cnt2 = 0;
        for (int v : nums) {
            if (v == cand1) cnt1++;
            else if (v == cand2) cnt2++;
            else if (cnt1 == 0) { cand1 = v; cnt1 = 1; }
            else if (cnt2 == 0) { cand2 = v; cnt2 = 1; }
            else { cnt1--; cnt2--; }
        }
        // 二次验证
        cnt1 = 0; cnt2 = 0;
        for (int v : nums) {
            if (v == cand1) cnt1++;
            else if (v == cand2) cnt2++;
        }
        List<Integer> res = new ArrayList<>();
        int n = nums.length;
        if (cnt1 > n / 3) res.add(cand1);
        if (cnt2 > n / 3) res.add(cand2);
        return res;
    }
}`,
    keyPoints: ["至多 2 个候选（>n/3 的数最多 2 个）", "三个不同值对消", "投票完必须二次验证计数"],
    steps: ["维护 cand1/cand2 与 cnt1/cnt2", "遍历更新或对消", "二次遍历统计真实次数", "保留 >n/3 的候选"]
  }],
  pitfalls: ["先判断 v==cand 再判断 cnt==0，否则两个候选会被设成同一个值", "必须二次验证——投票后剩下的不一定真过半门槛"]
};

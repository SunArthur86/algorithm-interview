/* Batch 4a: 二叉树前8题 */

SOLUTIONS["94"] = {
  thinking: "二叉树中序遍历：左→根→右。递归最直观，迭代用栈模拟。",
  approaches: [
    {
      name: "递归",
      desc: "递归访问左子树、记录当前节点、递归访问右子树。",
      complexity: { time: "O(n)", space: "O(h)" },
      lang: "java",
      code: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        inorder(root, result);
        return result;
    }
    private void inorder(TreeNode node, List<Integer> result) {
        if (node == null) return;
        inorder(node.left, result);
        result.add(node.val);
        inorder(node.right, result);
    }
}`,
      keyPoints: ["左→根→右顺序", "递归终止条件 node==null"],
      steps: ["递归左子树", "访问当前节点", "递归右子树"]
    },
    {
      name: "迭代（栈）",
      desc: "用栈模拟递归。一路向左走到底，弹出访问，再转向右子树。",
      complexity: { time: "O(n)", space: "O(h)" },
      lang: "java",
      code: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode curr = root;
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.pop();
            result.add(curr.val);
            curr = curr.right;
        }
        return result;
    }
}`,
      keyPoints: ["一路向左压栈", "弹出时访问", "转向右子树"],
      steps: ["一路向左压栈", "弹出栈顶访问", "转向右子树继续"]
    }
  ],
  pitfalls: ["迭代法外层 while 条件是 curr!=null || !stack.isEmpty()"]
};

SOLUTIONS["104"] = {
  thinking: "求二叉树最大深度。递归：max(左子树深度, 右子树深度)+1。BFS也可以。",
  approaches: [
    {
      name: "DFS 递归",
      desc: "树的深度 = max(左子树深度, 右子树深度) + 1。空节点深度为0。",
      complexity: { time: "O(n)", space: "O(h)" },
      lang: "java",
      code: `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
      keyPoints: ["max(left, right) + 1", "空节点返回0"],
      steps: ["空节点返回0", "递归求左右子树深度", "取最大值+1"]
    },
    {
      name: "BFS 层序遍历",
      desc: "逐层遍历，层数即为深度。",
      complexity: { time: "O(n)", space: "O(n)" },
      lang: "java",
      code: `class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        int depth = 0;
        while (!q.isEmpty()) {
            int size = q.size();
            depth++;
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
        }
        return depth;
    }
}`,
      keyPoints: ["BFS 逐层计数", "每层 size 固定后再处理"],
      steps: ["入队根节点", "逐层弹出并计数", "子节点入队"]
    }
  ],
  pitfalls: ["递归终止条件 root==null 返回0"]
};

SOLUTIONS["226"] = {
  thinking: "翻转二叉树：每个节点的左右子树交换。递归秒杀。",
  approaches: [{
    name: "递归交换",
    desc: "交换当前节点的左右子树，递归翻转左右子树。",
    complexity: { time: "O(n)", space: "O(h)" },
    lang: "java",
    code: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode temp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(temp);
        return root;
    }
}`,
    keyPoints: ["交换左右子树", "递归处理子树"],
    steps: ["保存左子树引用", "left=递归翻转右子树", "right=递归翻转保存的左子树"]
  }],
  pitfalls: ["先保存 left 再赋值，否则会丢失引用"]
};

SOLUTIONS["101"] = {
  thinking: "判断对称二叉树。左右子树是否互为镜像：左子树的左 = 右子树的右，左子树的右 = 右子树的左。",
  approaches: [{
    name: "递归比较镜像",
    desc: "比较左子树和右子树是否镜像对称。mirror(left,right): left.val==right.val 且 mirror(left.left,right.right) 且 mirror(left.right,right.left)。",
    complexity: { time: "O(n)", space: "O(h)" },
    lang: "java",
    code: `class Solution {
    public boolean isSymmetric(TreeNode root) {
        return mirror(root.left, root.right);
    }
    private boolean mirror(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val
            && mirror(a.left, b.right)
            && mirror(a.right, b.left);
    }
}`,
    keyPoints: ["mirror(left.left, right.right)", "mirror(left.right, right.left)", "同时为 null 返回 true"],
    steps: ["比较根的左右子树", "递归交叉比较", "值相等且子树镜像对称"]
  }],
  pitfalls: ["一个为 null 一个不为 null 返回 false"]
};

SOLUTIONS["543"] = {
  thinking: "二叉树直径：任意两节点间最长路径的边数。等于某个节点的左子树深度+右子树深度。DFS过程中维护全局最大值。",
  approaches: [{
    name: "DFS + 全局最大值",
    desc: "DFS 返回以当前节点为端点的最大深度。过程中用 left+right 更新直径最大值。",
    complexity: { time: "O(n)", space: "O(h)" },
    lang: "java",
    code: `class Solution {
    int maxDiameter = 0;
    public int diameterOfBinaryTree(TreeNode root) {
        depth(root);
        return maxDiameter;
    }
    private int depth(TreeNode node) {
        if (node == null) return 0;
        int left = depth(node.left);
        int right = depth(node.right);
        maxDiameter = Math.max(maxDiameter, left + right);
        return 1 + Math.max(left, right);
    }
}`,
    keyPoints: ["直径 = 经过某节点的 left+right", "depth返回子树深度", "全局变量更新最大直径"],
    steps: ["DFS求深度", "过程中 left+right 更新直径", "返回 1+max(left,right)"]
  }],
  pitfalls: ["直径是边数不是节点数", "不一定经过根节点"]
};

SOLUTIONS["102"] = {
  thinking: "二叉树层序遍历。BFS用队列，逐层处理。",
  approaches: [{
    name: "BFS 队列",
    desc: "用队列逐层处理。每轮记录当前层大小，全部弹出后进入下一层。",
    complexity: { time: "O(n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }
}`,
    keyPoints: ["每层先记录 size 再处理", "size 固定确保每层分离"],
    steps: ["根节点入队", "记录当前层 size", "弹出 size 个节点加入 level", "子节点入队"]
  }],
  pitfalls: ["不记录 size 会导致层混在一起"]
};

SOLUTIONS["108"] = {
  thinking: "有序数组转平衡BST。取中间元素为根，递归构建左右子树。",
  approaches: [{
    name: "分治（取中点为根）",
    desc: "每次取数组中间元素作为当前根，左半部分递归构建左子树，右半部分构建右子树。这样保证平衡。",
    complexity: { time: "O(n)", space: "O(log n)" },
    lang: "java",
    code: `class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }
    private TreeNode build(int[] nums, int left, int right) {
        if (left > right) return null;
        int mid = left + (right - left) / 2;
        TreeNode root = new TreeNode(nums[mid]);
        root.left = build(nums, left, mid - 1);
        root.right = build(nums, mid + 1, right);
        return root;
    }
}`,
    keyPoints: ["中点为根保证平衡", "左半→左子树，右半→右子树", "mid = left + (right-left)/2 防溢出"],
    steps: ["取中点为根", "递归构建左子树", "递归构建右子树"]
  }],
  pitfalls: ["mid = left + (right-left)/2 防止整数溢出"]
};

SOLUTIONS["98"] = {
  thinking: "验证BST。中序遍历必须严格递增。或者递归传 (min,max) 范围约束。",
  approaches: [
    {
      name: "递归 + 范围约束",
      desc: "每个节点的值必须在 (min, max) 范围内。左子树上限更新为当前值，右子树下限更新为当前值。",
      complexity: { time: "O(n)", space: "O(h)" },
      lang: "java",
      code: `class Solution {
    public boolean isValidBST(TreeNode root) {
        return valid(root, null, null);
    }
    private boolean valid(TreeNode node, Integer min, Integer max) {
        if (node == null) return true;
        if (min != null && node.val <= min) return false;
        if (max != null && node.val >= max) return false;
        return valid(node.left, min, (Integer) node.val)
            && valid(node.right, (Integer) node.val, max);
    }
}`,
      keyPoints: ["用 Integer 而非 int（处理边界 null）", "左子树 max=当前值", "右子树 min=当前值"],
      steps: ["传入 (min, max) 范围", "当前值不在范围内返回 false", "递归更新范围约束"]
    },
    {
      name: "中序遍历（迭代）",
      desc: "BST中序遍历必须严格递增。用一个 prev 变量记录前一个值。",
      complexity: { time: "O(n)", space: "O(h)" },
      lang: "java",
      code: `class Solution {
    long prev = Long.MIN_VALUE;
    public boolean isValidBST(TreeNode root) {
        if (root == null) return true;
        if (!isValidBST(root.left)) return false;
        if (root.val <= prev) return false;
        prev = root.val;
        return isValidBST(root.right);
    }
}`,
      keyPoints: ["prev 初始化为 Long.MIN_VALUE", "中序遍历必须严格递增"],
      steps: ["中序遍历", "与 prev 比较", "更新 prev"]
    }
  ],
  pitfalls: ["不能只比较节点和左右子节点——子树中可能有更远的违反", "用 long 避免整数边界值"]
};

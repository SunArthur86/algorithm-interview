/* Batch 4b: 二叉树后7题 */

SOLUTIONS["230"] = {
  thinking: "BST中找第K小元素。中序遍历BST得到升序序列，第K个即为答案。",
  approaches: [{
    name: "中序遍历（提前终止）",
    desc: "中序遍历BST，遍历到第k个时返回。不需要遍历完整棵树。",
    complexity: { time: "O(h+k)", space: "O(h)" },
    lang: "java",
    code: `class Solution {
    int count = 0, result = 0;
    public int kthSmallest(TreeNode root, int k) {
        inorder(root, k);
        return result;
    }
    private void inorder(TreeNode node, int k) {
        if (node == null) return;
        inorder(node.left, k);
        count++;
        if (count == k) { result = node.val; return; }
        if (count < k) inorder(node.right, k);
    }
}`,
    keyPoints: ["中序遍历BST是升序", "count==k 时提前终止"],
    steps: ["中序遍历", "计数到 k 时记录结果", "提前终止避免不必要的遍历"]
  }],
  pitfalls: ["找到后要终止递归避免浪费"]
};

SOLUTIONS["199"] = {
  thinking: "二叉树右视图。BFS层序遍历每层最右边的节点。",
  approaches: [{
    name: "BFS 每层最后节点",
    desc: "层序遍历，每层最后一个节点就是右视图看到的节点。",
    complexity: { time: "O(n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                if (i == size - 1) result.add(node.val); // 每层最后一个
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
        }
        return result;
    }
}`,
    keyPoints: ["BFS每层最后一个节点", "i == size-1 时记录"],
    steps: ["BFS层序遍历", "每层最后一个节点加入结果"]
  }],
  pitfalls: ["空树返回空列表"]
};

SOLUTIONS["114"] = {
  thinking: "二叉树展开为链表（右链）。前序遍历顺序，每个节点只有右孩子。",
  approaches: [{
    name: "反向后序遍历（O(1)空间）",
    desc: "按 右→左→根 的顺序遍历（后序的逆序），用全局 prev 指针连接。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    TreeNode prev = null;
    public void flatten(TreeNode root) {
        if (root == null) return;
        flatten(root.right);
        flatten(root.left);
        root.right = prev;
        root.left = null;
        prev = root;
    }
}`,
    keyPoints: ["先右后左的后序遍历", "prev 指向前一个处理的节点", "处理顺序：最右→→根"],
    steps: ["递归右子树", "递归左子树", "root.right=prev, root.left=null", "prev=root"]
  }],
  pitfalls: ["先递归右再递归左", "记得 left=null"]
};

SOLUTIONS["105"] = {
  thinking: "前序+中序重建二叉树。前序第一个是根，在中序中找到根位置，左边是左子树，右边是右子树。",
  approaches: [{
    name: "递归 + HashMap",
    desc: "用 HashMap 存中序值到索引的映射。前序第一个是根，中序中定位根划分左右子树，递归构建。",
    complexity: { time: "O(n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    int preIdx = 0;
    Map<Integer, Integer> inMap;
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        inMap = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);
        return build(preorder, 0, inorder.length - 1);
    }
    private TreeNode build(int[] pre, int inLeft, int inRight) {
        if (inLeft > inRight) return null;
        TreeNode root = new TreeNode(pre[preIdx++]);
        int inMid = inMap.get(root.val);
        root.left = build(pre, inLeft, inMid - 1);
        root.right = build(pre, inMid + 1, inRight);
        return root;
    }
}`,
    keyPoints: ["前序第一个是根", "HashMap存中序索引→O(1)查找", "preIdx 全局递增"],
    steps: ["前序取根节点", "中序定位根划分左右", "递归构建左子树", "递归构建右子树"]
  }],
  pitfalls: ["preIdx 必须在递归左子树之前递增", "递归构建顺序：先左后右"]
};

SOLUTIONS["437"] = {
  thinking: "路径总和III：找路径和等于目标值的数量。前缀和+DFS：路径和 = prefix[j]-prefix[i]，找 prefix[j]-target 的个数。",
  approaches: [{
    name: "前缀和 + DFS",
    desc: "DFS过程中用 HashMap 记录前缀和出现次数。对每个节点，查找当前前缀和-target 出现次数。",
    complexity: { time: "O(n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public int pathSum(TreeNode root, int targetSum) {
        Map<Long, Integer> prefixCount = new HashMap<>();
        prefixCount.put(0L, 1);
        return dfs(root, 0, targetSum, prefixCount);
    }
    private int dfs(TreeNode node, long currSum, int target, Map<Long, Integer> map) {
        if (node == null) return 0;
        currSum += node.val;
        int count = map.getOrDefault(currSum - target, 0);
        map.merge(currSum, 1, Integer::sum);
        count += dfs(node.left, currSum, target, map);
        count += dfs(node.right, currSum, target, map);
        map.merge(currSum, -1, Integer::sum); // 回溯
        return count;
    }
}`,
    keyPoints: ["前缀和差等于target", "HashMap记录前缀和频率", "回溯时移除当前前缀和"],
    steps: ["DFS遍历", "累加前缀和", "查找 currSum-target 的出现次数", "回溯移除"]
  }],
  pitfalls: ["必须回溯——否则会统计非路径上的前缀和", "用 long 防溢出"]
};

SOLUTIONS["236"] = {
  thinking: "二叉树最近公共祖先。递归：如果在左右子树分别找到了p和q，当前节点就是LCA。",
  approaches: [{
    name: "递归后序遍历",
    desc: "递归查找p和q。如果当前节点等于p或q返回。如果左右子树各返回非null，当前节点就是LCA。",
    complexity: { time: "O(n)", space: "O(h)" },
    lang: "java",
    code: `class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }
}`,
    keyPoints: ["root==p 或 root==q 时返回", "左右都非null→当前是LCA", "一边为null→答案在另一边"],
    steps: ["递归在左右子树中找p和q", "如果当前是p或q直接返回", "左右都找到→当前是LCA", "只有一边找到→返回那一边"]
  }],
  pitfalls: ["p或q本身就是祖先的情况也能处理——因为遇到就返回"]
};

SOLUTIONS["124"] = {
  thinking: "二叉树最大路径和。对每个节点，路径可能是：只走左+自己、只走右+自己、左+自己+右（横跨）。用全局变量维护最大值。",
  approaches: [{
    name: "DFS + 全局最大值",
    desc: "DFS返回以当前节点为端点的最大贡献值。过程中用 left+right+val 更新全局最大路径和。",
    complexity: { time: "O(n)", space: "O(h)" },
    lang: "java",
    code: `class Solution {
    int maxSum = Integer.MIN_VALUE;
    public int maxPathSum(TreeNode root) {
        dfs(root);
        return maxSum;
    }
    private int dfs(TreeNode node) {
        if (node == null) return 0;
        int left = Math.max(0, dfs(node.left));   // 负贡献直接剪掉
        int right = Math.max(0, dfs(node.right));
        maxSum = Math.max(maxSum, left + right + node.val); // 横跨路径
        return Math.max(left, right) + node.val; // 只能选一条路向上
    }
}`,
    keyPoints: ["负贡献取0（不选）", "横跨路径 = left+right+val", "返回只能选一边向上"],
    steps: ["DFS求左右子树最大贡献", "更新全局最大（横跨路径）", "返回 max(left,right)+val"]
  }],
  pitfalls: ["负数贡献要取0", "返回值和更新全局最大值不同——返回只能选一边"]
};

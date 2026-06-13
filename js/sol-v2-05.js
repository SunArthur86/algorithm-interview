/* Batch 5: 图论(4) + 回溯(8) = 12题 */

SOLUTIONS["200"] = {
  thinking: "岛屿数量。二维网格中1是陆地、0是水。遇到1就把整个连通的陆DFS标记为已访问，计数+1。",
  approaches: [{
    name: "DFS 洪水填充",
    desc: "遍历网格，遇到'1'就DFS把整个岛标记为'0'（沉岛），岛屿数+1。",
    complexity: { time: "O(m×n)", space: "O(m×n)" },
    lang: "java",
    code: `class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int i = 0; i < grid.length; i++)
            for (int j = 0; j < grid[0].length; j++)
                if (grid[i][j] == '1') {
                    dfs(grid, i, j);
                    count++;
                }
        return count;
    }
    private void dfs(char[][] grid, int i, int j) {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] != '1')
            return;
        grid[i][j] = '0'; // 沉岛
        dfs(grid, i+1, j); dfs(grid, i-1, j);
        dfs(grid, i, j+1); dfs(grid, i, j-1);
    }
}`,
    keyPoints: ["沉岛法：访问过的直接改为'0'", "四个方向DFS", "每个岛只需触发一次DFS"],
    steps: ["遍历每个格子", "遇到'1'→DFS标记整个岛为'0'", "计数+1"]
  }],
  pitfalls: ["grid是char不是int，用'1'不是1", "DFS终止条件要先检查边界"]
};

SOLUTIONS["994"] = {
  thinking: "腐烂橘子。BFS多源最短路径：所有初始腐烂橘子同时向四周扩散，求全部腐烂的时间。",
  approaches: [{
    name: "多源 BFS",
    desc: "所有初始腐烂橘子同时入队，BFS逐层扩散。层数即分钟数。",
    complexity: { time: "O(m×n)", space: "O(m×n)" },
    lang: "java",
    code: `class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        Queue<int[]> q = new LinkedList<>();
        int fresh = 0;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) q.offer(new int[]{i, j});
                else if (grid[i][j] == 1) fresh++;
            }
        int minutes = 0;
        int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
        while (!q.isEmpty() && fresh > 0) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                int[] cur = q.poll();
                for (int[] d : dirs) {
                    int r = cur[0]+d[0], c = cur[1]+d[1];
                    if (r>=0 && r<m && c>=0 && c<n && grid[r][c]==1) {
                        grid[r][c] = 2;
                        fresh--;
                        q.offer(new int[]{r, c});
                    }
                }
            }
            minutes++;
        }
        return fresh == 0 ? minutes : -1;
    }
}`,
    keyPoints: ["多源同时BFS", "层数=分钟数", "fresh==0 判断是否全部腐烂"],
    steps: ["所有腐烂橘子入队", "BFS逐层扩散", "每层minutes++", "fresh>0 则返回-1"]
  }],
  pitfalls: ["初始没有新鲜橘子时返回0", "queue判空和 fresh>0 双条件"]
};

SOLUTIONS["207"] = {
  thinking: "课程安排（拓扑排序检测环）。BFS入度法：入度为0的课先修，修完后减少后续课的入度。",
  approaches: [{
    name: "BFS 拓扑排序（Kahn算法）",
    desc: "建图+入度数组。入度为0的入队，弹出时减少邻居入度。最终已修课程数=总数则无环。",
    complexity: { time: "O(V+E)", space: "O(V+E)" },
    lang: "java",
    code: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        int[] inDegree = new int[numCourses];
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
        for (int[] pre : prerequisites) {
            graph.get(pre[1]).add(pre[0]);
            inDegree[pre[0]]++;
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++)
            if (inDegree[i] == 0) q.offer(i);
        int count = 0;
        while (!q.isEmpty()) {
            int course = q.poll();
            count++;
            for (int next : graph.get(course))
                if (--inDegree[next] == 0) q.offer(next);
        }
        return count == numCourses;
    }
}`,
    keyPoints: ["入度为0先入队", "弹出后邻居入度-1", "count==numCourses 表示无环"],
    steps: ["建图+入度数组", "入度0的入队", "BFS弹出减少邻居入度", "判断已修课程数"]
  }],
  pitfalls: ["prerequisites[i] = [a,b] 表示先修b再修a", "count==numCourses 才说明无环"]
};

SOLUTIONS["208"] = {
  thinking: "Trie前缀树。每个节点有26个子节点指针和isEnd标记。",
  approaches: [{
    name: "标准Trie实现",
    desc: "每个节点维护children[26]和isEnd。insert逐字符创建节点，search和startsWith逐字符查找。",
    complexity: { time: "O(m) per op", space: "O(m×n)" },
    lang: "java",
    code: `class Trie {
    class Node { Node[] children = new Node[26]; boolean isEnd; }
    private Node root;
    public Trie() { root = new Node(); }
    public void insert(String word) {
        Node curr = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) curr.children[idx] = new Node();
            curr = curr.children[idx];
        }
        curr.isEnd = true;
    }
    public boolean search(String word) {
        Node node = find(word);
        return node != null && node.isEnd;
    }
    public boolean startsWith(String prefix) {
        return find(prefix) != null;
    }
    private Node find(String s) {
        Node curr = root;
        for (char c : s.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) return null;
            curr = curr.children[idx];
        }
        return curr;
    }
}`,
    keyPoints: ["children[26] 子节点数组", "isEnd 标记单词结束", "search vs startsWith 区别"],
    steps: ["insert: 逐字符创建/遍历节点", "search: 找到节点且isEnd=true", "startsWith: 只需找到节点"]
  }],
  pitfalls: ["search 要检查 isEnd，startsWith 不需要"]
};

SOLUTIONS["46"] = {
  thinking: "全排列。回溯：用 visited 数组标记已使用，递归选择每个未使用的数。",
  approaches: [{
    name: "回溯",
    desc: "DFS选择每个未使用的数，加入path，标记visited，递归后回溯。",
    complexity: { time: "O(n!×n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), result);
        return result;
    }
    private void backtrack(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> result) {
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true; path.add(nums[i]);
            backtrack(nums, used, path, result);
            path.remove(path.size() - 1); used[i] = false;
        }
    }
}`,
    keyPoints: ["visited数组标记", "path.size()==nums.length 收集结果", "回溯：移除+取消标记"],
    steps: ["遍历每个未使用的数", "加入path+标记", "递归", "回溯"]
  }],
  pitfalls: ["结果要 new ArrayList<>(path) 创建副本", "回溯时先 remove 再 set used=false"]
};

SOLUTIONS["78"] = {
  thinking: "子集。回溯：每个元素选或不选。",
  approaches: [{
    name: "回溯（选/不选）",
    desc: "从index开始，每个元素都可以选或不选。每次进入递归先收集当前子集。",
    complexity: { time: "O(2ⁿ×n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }
    private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
        result.add(new ArrayList<>(path)); // 每步都收集
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(nums, i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }
}`,
    keyPoints: ["每次进入都收集（包括空集）", "for循环从start开始避免重复", "不需要终止条件——遍历完自然结束"],
    steps: ["收集当前path", "从start遍历选下一个元素", "递归+回溯"]
  }],
  pitfalls: ["和全排列不同——for从start开始不是0"]
};

SOLUTIONS["17"] = {
  thinking: "电话号码字母组合。每个数字对应多个字母，回溯枚举所有组合。",
  approaches: [{
    name: "回溯",
    desc: "用数组存数字到字母的映射，回溯枚举每个数字对应的字母。",
    complexity: { time: "O(3ⁿ×4ᵐ)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    private String[] mapping = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    public List<String> letterCombinations(String digits) {
        List<String> result = new ArrayList<>();
        if (digits.isEmpty()) return result;
        backtrack(digits, 0, new StringBuilder(), result);
        return result;
    }
    private void backtrack(String digits, int idx, StringBuilder sb, List<String> result) {
        if (idx == digits.length()) { result.add(sb.toString()); return; }
        String letters = mapping[digits.charAt(idx) - '0'];
        for (char c : letters.toCharArray()) {
            sb.append(c);
            backtrack(digits, idx + 1, sb, result);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}`,
    keyPoints: ["数字到字母映射", "idx==digits.length() 收集结果", "StringBuilder append/delete 回溯"],
    steps: ["取当前数字对应的字母", "遍历每个字母", "递归+回溯"]
  }],
  pitfalls: ["空字符串返回空列表不是返回['']", "StringBuilder 要回溯删除"]
};

SOLUTIONS["39"] = {
  thinking: "组合总和（元素可重复使用）。回溯：每次从当前位置（不是下一个）继续选，因为可以重复。",
  approaches: [{
    name: "回溯（可重复选取）",
    desc: "从start开始选，选了后递归还是从start（不是start+1）因为可以重复。减去当前值，等于0时收集。",
    complexity: { time: "O(n^(T/M))", space: "O(T/M)" },
    lang: "java",
    code: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }
    private void backtrack(int[] candidates, int remain, int start, List<Integer> path, List<List<Integer>> result) {
        if (remain == 0) { result.add(new ArrayList<>(path)); return; }
        if (remain < 0) return;
        for (int i = start; i < candidates.length; i++) {
            path.add(candidates[i]);
            backtrack(candidates, remain - candidates[i], i, path, result); // i 不是 i+1
            path.remove(path.size() - 1);
        }
    }
}`,
    keyPoints: ["递归传 i 不是 i+1（可重复选）", "remain<0 剪枝", "排序后可更早剪枝"],
    steps: ["遍历从start开始", "减去当前值", "递归（还是从i）", "回溯"]
  }],
  pitfalls: ["递归传 i 不是 i+1——允许重复选同一元素"]
};

SOLUTIONS["22"] = {
  thinking: "括号生成。回溯：维护左右括号计数，左括号<n才能加左，右括号<左括号数才能加右。",
  approaches: [{
    name: "回溯",
    desc: "open<n 时可以加左括号，close<open 时可以加右括号。open==close==n 时收集。",
    complexity: { time: "O(4ⁿ/√n)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        backtrack(n, 0, 0, new StringBuilder(), result);
        return result;
    }
    private void backtrack(int n, int open, int close, StringBuilder sb, List<String> result) {
        if (sb.length() == 2 * n) { result.add(sb.toString()); return; }
        if (open < n) { sb.append('('); backtrack(n, open+1, close, sb, result); sb.deleteCharAt(sb.length()-1); }
        if (close < open) { sb.append(')'); backtrack(n, open, close+1, sb, result); sb.deleteCharAt(sb.length()-1); }
    }
}`,
    keyPoints: ["open<n 才能加左括号", "close<open 才能加右括号", "sb.length()==2n 收集"],
    steps: ["open<n→加左递归", "close<open→加右递归", "回溯删除"]
  }],
  pitfalls: ["close<open 不是 close<n——保证合法性"]
};

SOLUTIONS["79"] = {
  thinking: "单词搜索。在二维网格中找单词。DFS+回溯：从每个格子出发尝试匹配。",
  approaches: [{
    name: "DFS + 回溯",
    desc: "遍历每个格子作为起点，DFS匹配单词。用visited或原地修改标记已访问。",
    complexity: { time: "O(m×n×3^L)", space: "O(L)" },
    lang: "java",
    code: `class Solution {
    public boolean exist(char[][] board, String word) {
        for (int i = 0; i < board.length; i++)
            for (int j = 0; j < board[0].length; j++)
                if (dfs(board, word, 0, i, j)) return true;
        return false;
    }
    private boolean dfs(char[][] board, String word, int idx, int i, int j) {
        if (idx == word.length()) return true;
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length || board[i][j] != word.charAt(idx))
            return false;
        char temp = board[i][j];
        board[i][j] = '#'; // 标记
        boolean found = dfs(board, word, idx+1, i+1, j) || dfs(board, word, idx+1, i-1, j)
                     || dfs(board, word, idx+1, i, j+1) || dfs(board, word, idx+1, i, j-1);
        board[i][j] = temp; // 恢复
        return found;
    }
}`,
    keyPoints: ["原地修改board标记访问", "四个方向DFS", "匹配失败恢复board"],
    steps: ["每个格子作为起点尝试", "匹配第一个字符", "DFS四个方向", "回溯恢复"]
  }],
  pitfalls: ["board[i][j]='#' 要恢复，否则影响其他路径", "先检查board[i][j]!=word[idx]"]
};

SOLUTIONS["131"] = {
  thinking: "分割回文串。回溯：从start开始找所有可能的回文子串，递归分割剩余部分。",
  approaches: [{
    name: "回溯 + 回文判断",
    desc: "从start遍历end，如果s[start..end]是回文，递归分割end+1后面的部分。",
    complexity: { time: "O(n×2ⁿ)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> result = new ArrayList<>();
        backtrack(s, 0, new ArrayList<>(), result);
        return result;
    }
    private void backtrack(String s, int start, List<String> path, List<List<String>> result) {
        if (start == s.length()) { result.add(new ArrayList<>(path)); return; }
        for (int end = start; end < s.length(); end++) {
            if (isPalindrome(s, start, end)) {
                path.add(s.substring(start, end + 1));
                backtrack(s, end + 1, path, result);
                path.remove(path.size() - 1);
            }
        }
    }
    private boolean isPalindrome(String s, int l, int r) {
        while (l < r) if (s.charAt(l++) != s.charAt(r--)) return false;
        return true;
    }
}`,
    keyPoints: ["遍历所有可能的分割点", "只对回文子串递归", "start==s.length() 收集结果"],
    steps: ["从start遍历end", "判断s[start..end]是否回文", "是→递归分割剩余", "回溯"]
  }],
  pitfalls: ["substring(start, end+1) 注意+1", "只对回文子串才继续分割"]
};

SOLUTIONS["51"] = {
  thinking: "N皇后。回溯：逐行放置，检查列、对角线冲突。用3个数组标记。",
  approaches: [{
    name: "回溯 + 列/对角线标记",
    desc: "逐行放置皇后。用colUsed、diag1、diag2三个数组检查冲突。O(n)检查。",
    complexity: { time: "O(n!)", space: "O(n)" },
    lang: "java",
    code: `class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        boolean[] col = new boolean[n], d1 = new boolean[2*n], d2 = new boolean[2*n];
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        solve(n, 0, col, d1, d2, board, result);
        return result;
    }
    private void solve(int n, int row, boolean[] col, boolean[] d1, boolean[] d2,
                        char[][] board, List<List<String>> result) {
        if (row == n) {
            List<String> solution = new ArrayList<>();
            for (char[] r : board) solution.add(new String(r));
            result.add(solution);
            return;
        }
        for (int c = 0; c < n; c++) {
            int diag1 = row + c, diag2 = row - c + n - 1;
            if (col[c] || d1[diag1] || d2[diag2]) continue;
            board[row][c] = 'Q'; col[c] = true; d1[diag1] = true; d2[diag2] = true;
            solve(n, row + 1, col, d1, d2, board, result);
            board[row][c] = '.'; col[c] = false; d1[diag1] = false; d2[diag2] = false;
        }
    }
}`,
    keyPoints: ["逐行放置", "3个数组标记列和对角线", "对角线索引: row+c 和 row-c+n-1"],
    steps: ["逐行遍历每列", "检查列和对角线冲突", "放置+标记", "递归下一行", "回溯"]
  }],
  pitfalls: ["对角线索引公式：d1=row+c, d2=row-c+n-1", "char数组转String构建棋盘"]
};

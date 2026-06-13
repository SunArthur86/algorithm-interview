# 🧮 Algorithm Hub

> LeetCode Hot 100 完整题解 + 18种算法动画可视化

## ✨ 特性

### 📋 100题完整题解
- **Java 为主要语言**，每题包含完整 Java 代码
- **多种解法**：经典题提供2-3种不同方法（如哈希法/暴力法、递归/迭代）
- **详细描述**：每题包含解题思路、方法详解、执行步骤、关键点
- **常见陷阱**：每题列出容易犯的错误和注意事项
- **复杂度分析**：时间和空间复杂度
- **语法高亮**：Java 代码自动高亮（关键字/字符串/注释/注解）

### 🎬 18种算法动画
- **排序算法**（8种）：冒泡、选择、插入、希尔、快速、归并、堆、计数
- **搜索算法**：二分查找
- **图算法**：BFS广搜、DFS深搜
- **动态规划**：0-1背包、LCS最长公共子序列、爬楼梯
- **数据结构**：链表反转、二叉树遍历
- **技巧**：双指针、滑动窗口

### 🎮 互动学习
- **随堂练习**：每题配套选择题，即时反馈
- **动画演示**：从题解直接跳转到相关算法动画
- **进度追踪**：完成进度环、分类掌握度、连续学习天数
- **收藏标记**：重点题目收藏
- **深色模式**：护眼夜间模式

## 🛠️ 技术栈
- 纯前端（HTML + CSS + JavaScript）
- Canvas 动画渲染
- localStorage 进度持久化
- `defer` 异步脚本加载，零阻塞渲染
- 响应式设计，支持深色模式

## 📂 项目结构
```
├── index.html              # 主页面
├── css/
│   ├── main.css            # 主样式 + Java语法高亮
│   ├── algorithm.css       # 可视化样式
│   ├── solutions-v2.css    # 题解样式
│   └── interactive.css     # 互动练习样式
├── js/
│   ├── safe-ls.js          # localStorage 安全封装
│   ├── app.js              # 主逻辑 + 题解渲染
│   ├── problems-data.js    # 100题数据
│   ├── solutions-v2.js     # 题解框架
│   ├── sol-v2-01~07c.js    # 12批次Java题解
│   ├── algorithm-visualizer.js  # 11种基础动画
│   └── visualizer-extended.js   # 7种扩展动画
└── data/
    └── hot100-raw.json     # 原始数据
```

## 🔗 在线访问
GitHub Pages: https://sunarthur86.github.io/algorithm-hub/

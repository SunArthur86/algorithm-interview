# 🧮 Algorithm Hub

> LeetCode Hot 100 **完整 Java 题解** + **18 种算法动画可视化** + **100 题逐题动画演示**

🔗 **在线访问**: [https://sunarthur86.github.io/algorithm-hub/](https://sunarthur86.github.io/algorithm-hub/)

## ✨ 特性

### 📋 100 题完整题解
- **Java 为主要语言**，每题包含完整 `class Solution`
- **多种解法**：经典题提供 2-3 种不同方法
- **5 部分描述**：解题思路、方法详解、执行步骤、关键点、常见陷阱
- **复杂度分析**：时间和空间复杂度
- **语法高亮**：Java 代码自动高亮

### 🎬 18 种算法动画
| 类型 | 算法 |
|------|------|
| 排序 (8种) | 冒泡、选择、插入、希尔、快速、归并、堆、计数 |
| 搜索 | 二分查找 |
| 图算法 | BFS 广搜、DFS 深搜 |
| 动态规划 | 0-1 背包、LCS、爬楼梯 |
| 数据结构 | 链表反转、二叉树遍历 |
| 技巧 | 双指针、滑动窗口 |

### 🎬 100 题逐题动画
- 统一 viz-engine.js Canvas 渲染器
- 7 种可视化类型：数组+指针(44题) / 链表(14题) / 二叉树(14题) / DP表格(12题) / 矩阵(10题) / 哈希表(3题) / 栈(3题)

### 🎮 互动学习
- 随堂练习（选择题 + 即时反馈）
- 进度追踪（完成进度环、分类掌握度、连续学习天数）
- 收藏标记
- 深色模式

### 📱 PWA 离线支持
- Service Worker 缓存
- 可安装到桌面

## 🛠️ 技术栈
- 纯前端（HTML + CSS + JavaScript）
- Canvas 动画渲染
- localStorage 进度持久化
- PWA（manifest.json + sw.js）
- 响应式设计 + 深色模式

## 📂 项目结构
```
├── index.html              # 主页面
├── manifest.json           # PWA 配置
├── sw.js                   # Service Worker
├── css/                    # 样式文件 (5个)
├── js/
│   ├── safe-ls.js          # localStorage 安全封装
│   ├── app.js              # 主逻辑 + 题解渲染
│   ├── problems-data.js    # 100 题数据
│   ├── sol-v2-*.js         # 12 批次 Java 题解
│   ├── algorithm-visualizer.js  # 基础动画
│   ├── visualizer-extended.js   # 扩展动画
│   ├── viz-engine.js       # 逐题动画 Canvas 渲染器
│   └── viz-traces-*.js     # 100 题动画轨迹 (6 文件)
└── data/
    └── hot100-raw.json     # 原始数据
```

## 📊 数据统计
- **100 题**：20 Easy / 68 Medium / 12 Hard
- **17 分类**
- **18 种算法动画**
- **100 题逐题动画**
- **~600KB** 纯前端，零依赖

## ⌨ 快捷键
| 快捷键 | 功能 |
|--------|------|
| `←` `→` | 上一题 / 下一题 |
| `Esc` | 关闭弹窗 |

---

📅 2026 · 面试刷题一站搞定

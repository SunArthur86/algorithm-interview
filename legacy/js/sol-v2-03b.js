/* Batch 3b: 链表后7题 */

SOLUTIONS["19"] = {
  thinking: "删除倒数第 N 个节点。快慢指针：快指针先走 N 步，然后快慢一起走，快指针到末尾时慢指针正好在倒数第 N 个。",
  approaches: [{
    name: "快慢指针 + dummy",
    desc: "快指针先走 n 步，然后快慢同时走。快指针到 null 时，慢指针的 next 就是要删除的。用 dummy 处理删头节点的情况。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode fast = dummy, slow = dummy;
        for (int i = 0; i < n; i++) fast = fast.next;
        while (fast.next != null) { fast = fast.next; slow = slow.next; }
        slow.next = slow.next.next;
        return dummy.next;
    }
}`,
    keyPoints: ["dummy 处理删除头节点", "fast 先走 n 步", "fast.next!=null 条件让 slow 停在被删节点前一个"],
    steps: ["dummy 指向 head", "fast 先走 n 步", "fast 和 slow 同时走直到 fast.next=null", "删除 slow.next"]
  }],
  pitfalls: ["不用 dummy 时删除头节点会出错", "fast 先走 n 步不是 n+1 步"]
};

SOLUTIONS["24"] = {
  thinking: "两两交换链表中相邻节点。迭代法：每次处理两个节点，用 prev 连接。",
  approaches: [{
    name: "迭代交换",
    desc: "用 dummy 头。每次取两个节点交换，prev 指向交换后的第一个节点。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;
        while (prev.next != null && prev.next.next != null) {
            ListNode first = prev.next, second = prev.next.next;
            first.next = second.next;
            second.next = first;
            prev.next = second;
            prev = first;
        }
        return dummy.next;
    }
}`,
    keyPoints: ["三个指针：prev, first, second", "second.next=first 完成交换", "prev 移到 first（交换后的第二个）"],
    steps: ["取 first 和 second", "first.next=second.next", "second.next=first", "prev.next=second", "prev=first"]
  }],
  pitfalls: ["指针操作顺序错误导致环", "prev 要移动到交换后的第二个节点"]
};

SOLUTIONS["25"] = {
  thinking: "K 个一组翻转链表。每 k 个节点一组进行翻转，不足 k 个不翻转。先数 k 个，翻转这一组，再递归/迭代处理下一组。",
  approaches: [{
    name: "迭代分组翻转",
    desc: "每次找到 k 个节点的区间，翻转这一段，连接前后。用 dummy 简化。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;
        while (true) {
            // 检查是否有 k 个节点
            ListNode tail = prev;
            for (int i = 0; i < k; i++) {
                tail = tail.next;
                if (tail == null) return dummy.next;
            }
            ListNode next = tail.next;
            // 翻转 prev.next 到 tail
            ListNode curr = prev.next, newTail = curr;
            prev.next = null;
            for (int i = 0; i < k; i++) {
                ListNode temp = curr.next;
                curr.next = prev.next;
                prev.next = curr;
                curr = temp;
            }
            newTail.next = next;
            prev = newTail;
        }
    }
}`,
    keyPoints: ["先检查是否有 k 个", "翻转区间内链表", "连接前后段"],
    steps: ["检查是否有 k 个节点", "翻转这 k 个", "连接前段和后段", "prev 移到当前段的末尾"]
  }],
  pitfalls: ["不足 k 个不翻转", "翻转后要正确连接前后段"]
};

SOLUTIONS["138"] = {
  thinking: "复制带随机指针的链表。关键是处理 random 指针。方法：先在每个节点后面插入复制节点，然后设置 random，最后拆分。",
  approaches: [{
    name: "插入复制节点 + 拆分",
    desc: "第一步：在每个节点后插入复制节点。第二步：设置 random 指针（copy.random = original.random.next）。第三步：拆分两个链表。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) return null;
        // 1. 插入复制节点
        Node curr = head;
        while (curr != null) {
            Node copy = new Node(curr.val);
            copy.next = curr.next;
            curr.next = copy;
            curr = copy.next;
        }
        // 2. 设置 random
        curr = head;
        while (curr != null) {
            if (curr.random != null) curr.next.random = curr.random.next;
            curr = curr.next.next;
        }
        // 3. 拆分
        curr = head;
        Node newHead = head.next;
        while (curr != null) {
            Node copy = curr.next;
            curr.next = copy.next;
            if (copy.next != null) copy.next = copy.next.next;
            curr = curr.next;
        }
        return newHead;
    }
}`,
    keyPoints: ["三步走：插入→设置random→拆分", "O(1) 空间不使用 HashMap", "copy.random = curr.random.next"],
    steps: ["每个节点后插入复制节点", "设置复制节点的 random", "拆分两个链表"]
  }],
  pitfalls: ["random 可能为 null 要检查", "拆分时注意 copy.next 的更新"]
};

SOLUTIONS["148"] = {
  thinking: "排序链表。要求 O(n log n) 时间 O(1) 空间。归并排序：找中点→分治排序→合并。",
  approaches: [{
    name: "归并排序（递归）",
    desc: "快慢指针找中点切分，递归排序左右两半，然后合并两个有序链表。",
    complexity: { time: "O(n log n)", space: "O(log n)" },
    lang: "java",
    code: `class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) return head;
        // 找中点
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next; fast = fast.next.next;
        }
        ListNode mid = slow.next;
        slow.next = null;
        // 递归排序
        ListNode left = sortList(head);
        ListNode right = sortList(mid);
        // 合并
        return merge(left, right);
    }
    private ListNode merge(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0), tail = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = a != null ? a : b;
        return dummy.next;
    }
}`,
    keyPoints: ["快慢指针找中点", "递归分治", "合并两个有序链表"],
    steps: ["快慢指针找中点", "断开成两段", "递归排序左右", "合并"]
  }],
  pitfalls: ["fast 初始是 head.next 不是 head（避免栈溢出）", "slow.next=null 断开链表"]
};

SOLUTIONS["146"] = {
  thinking: "LRU 缓存。需要 O(1) 的 get 和 put。HashMap + 双向链表：HashMap 存键值映射，双向链表维护访问顺序。",
  approaches: [{
    name: "HashMap + 双向链表",
    desc: "HashMap 提供 O(1) 查找，双向链表维护 LRU 顺序。最近访问的放头部，尾部是最久未使用的。",
    complexity: { time: "O(1) get/put", space: "O(capacity)" },
    lang: "java",
    code: `class LRUCache {
    class DNode {
        int key, val; DNode prev, next;
        DNode(int k, int v) { key = k; val = v; }
    }
    private int capacity;
    private Map<Integer, DNode> map = new HashMap<>();
    private DNode head, tail; // dummy

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head = new DNode(0, 0);
        tail = new DNode(0, 0);
        head.next = tail; tail.prev = head;
    }
    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        DNode node = map.get(key);
        moveToHead(node);
        return node.val;
    }
    public void put(int key, int value) {
        if (map.containsKey(key)) {
            DNode node = map.get(key);
            node.val = value;
            moveToHead(node);
        } else {
            DNode node = new DNode(key, value);
            map.put(key, node);
            addToHead(node);
            if (map.size() > capacity) {
                DNode lru = tail.prev;
                removeNode(lru);
                map.remove(lru.key);
            }
        }
    }
    private void addToHead(DNode node) {
        node.next = head.next; node.prev = head;
        head.next.prev = node; head.next = node;
    }
    private void removeNode(DNode node) {
        node.prev.next = node.next; node.next.prev = node.prev;
    }
    private void moveToHead(DNode node) {
        removeNode(node); addToHead(node);
    }
}`,
    keyPoints: ["HashMap + 双向链表", "dummy head 和 tail 简化边界", "get/put 都是 O(1)"],
    steps: ["get: HashMap 查找 → moveToHead", "put: 新建→addToHead→超容量删 tail.prev", "head 端是最近访问，tail 端是最久未用"]
  }],
  pitfalls: ["双向链表需要 dummy head/tail 避免 null 判断", "删除时要从 map 中也删除"]
};

SOLUTIONS["23"] = {
  thinking: "合并 K 个有序链表。暴力逐一合并 O(kN)。最优用小顶堆：每次取最小节点。",
  approaches: [{
    name: "小顶堆（优先队列）",
    desc: "把每个链表的头节点放入小顶堆。每次弹出最小的，接到结果后面，然后把它的 next 放入堆。",
    complexity: { time: "O(N log k)", space: "O(k)" },
    lang: "java",
    code: `class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
        for (ListNode l : lists) if (l != null) pq.offer(l);
        ListNode dummy = new ListNode(0), tail = dummy;
        while (!pq.isEmpty()) {
            ListNode node = pq.poll();
            tail.next = node;
            tail = tail.next;
            if (node.next != null) pq.offer(node.next);
        }
        return dummy.next;
    }
}`,
    keyPoints: ["堆中始终有 k 个元素（每个链表一个）", "弹出最小→接上→放入 next", "O(N log k)"],
    steps: ["所有头节点入堆", "弹最小节点接到结果", "该节点 next 入堆", "重复直到堆空"]
  }],
  pitfalls: ["空链表不要入堆", "Comparator 用 lambda 比较值"]
};

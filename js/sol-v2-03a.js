/* Batch 3a: 链表前7题 */

SOLUTIONS["160"] = {
  thinking: "找两个链表的交点。双指针法：pA 走完 A 链表后转到 B 链表，pB 走完 B 后转到 A。两指针走的总长度相同，必然在交点相遇。",
  approaches: [{
    name: "双指针交叉走",
    desc: "pA 从 headA 出发走完 A 转 B，pB 从 headB 出发走完 B 转 A。如果没有交点，两指针最终同时为 null。",
    complexity: { time: "O(m+n)", space: "O(1)" },
    lang: "java",
    code: `public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        if (headA == null || headB == null) return null;
        ListNode pA = headA, pB = headB;
        while (pA != pB) {
            pA = pA == null ? headB : pA.next;
            pB = pB == null ? headA : pB.next;
        }
        return pA;
    }
}`,
    keyPoints: ["pA 走完 A 转 B", "pB 走完 B 转 A", "走的总路程相同，必在交点相遇"],
    steps: ["pA=headA, pB=headB", "pA 到 null 转 headB", "pB 到 null 转 headA", "pA==pB 时即为交点"]
  }],
  pitfalls: ["无交点时两指针最终都为 null（同时走完 m+n）", "不要修改链表结构"]
};

SOLUTIONS["206"] = {
  thinking: "反转链表。迭代法：用 prev/curr 双指针逐步翻转。递归法也经典。",
  approaches: [
    {
      name: "迭代（推荐）",
      desc: "用 prev=null, curr=head。每次保存 next，翻转 curr.next=prev，然后 prev=curr, curr=next。",
      complexity: { time: "O(n)", space: "O(1)" },
      lang: "java",
      code: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`,
      keyPoints: ["三指针：prev, curr, next", "先存 next 再翻转", "prev 最终是新头节点"],
      steps: ["prev=null, curr=head", "保存 next=curr.next", "翻转 curr.next=prev", "前进 prev=curr, curr=next"]
    },
    {
      name: "递归",
      desc: "递归反转后面的链表，然后让当前节点的 next 指回自己。",
      complexity: { time: "O(n)", space: "O(n)" },
      lang: "java",
      code: `class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode newHead = reverseList(head.next);
        head.next.next = head;
        head.next = null;
        return newHead;
    }
}`,
      keyPoints: ["递归到底再回溯翻转", "head.next.next=head 是核心", "head.next=null 断开原方向"],
      steps: ["递归到链表末尾", "回溯时 head.next.next=head", "head.next=null"]
    }
  ],
  pitfalls: ["迭代法忘记先保存 next", "递归法忘记 head.next=null"]
};

SOLUTIONS["234"] = {
  thinking: "判断回文链表。找中点→反转后半部分→比较前后两半。O(1) 空间。",
  approaches: [{
    name: "快慢指针 + 反转后半部分",
    desc: "快慢指针找中点，反转后半部分链表，然后双指针比较前后两半。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public boolean isPalindrome(ListNode head) {
        // 快慢指针找中点
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next; fast = fast.next.next;
        }
        // 反转后半部分
        ListNode second = reverse(slow.next);
        // 比较
        ListNode p1 = head, p2 = second;
        while (p2 != null) {
            if (p1.val != p2.val) return false;
            p1 = p1.next; p2 = p2.next;
        }
        return true;
    }
    private ListNode reverse(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr; curr = next;
        }
        return prev;
    }
}`,
    keyPoints: ["快慢指针找中点", "反转后半部分与前半比较", "O(1) 空间"],
    steps: ["快慢指针找中点", "反转后半部分", "双指针逐个比较"]
  }],
  pitfalls: ["奇数长度时 slow 停在前半的最后一个", "fast.next 和 fast.next.next 都要判空"]
};

SOLUTIONS["141"] = {
  thinking: "判断链表是否有环。快慢指针：快指针每次走两步，慢指针走一步。有环则必然相遇。",
  approaches: [{
    name: "快慢指针（Floyd判圈）",
    desc: "slow 走一步，fast 走两步。如果有环，fast 必然追上 slow。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`,
    keyPoints: ["快指针走两步，慢指针走一步", "相遇则有环", "fast 或 fast.next 为 null 则无环"],
    steps: ["slow=head, fast=head", "slow+1, fast+2", "slow==fast 返回 true", "fast 到 null 返回 false"]
  }],
  pitfalls: ["要先走再比较，否则初始就相等", "while 条件检查 fast 和 fast.next"]
};

SOLUTIONS["142"] = {
  thinking: "找环的入口节点。快慢指针相遇后，将一个指针放回头部，两指针同速走，再次相遇即为入口。",
  approaches: [{
    name: "快慢指针 + 数学推导",
    desc: "快慢指针相遇后，一个指针从头出发，另一个从相遇点出发，同速走再次相遇即为环入口。数学证明：a=(n-1)(b+c)+c。",
    complexity: { time: "O(n)", space: "O(1)" },
    lang: "java",
    code: `public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                ListNode p = head;
                while (p != slow) { p = p.next; slow = slow.next; }
                return p;
            }
        }
        return null;
    }
}`,
    keyPoints: ["第一次相遇后", "一个指针从头开始", "同速走再次相遇即入口"],
    steps: ["快慢指针找相遇点", "一个指针放回头部", "同速走直到相遇", "相遇点即环入口"]
  }],
  pitfalls: ["相遇判断不能在初始位置——要先走", "第二次相遇用同速不是快慢"]
};

SOLUTIONS["21"] = {
  thinking: "合并两个有序链表。用 dummy 头节点简化边界处理，逐个比较拼接。",
  approaches: [{
    name: "迭代 + dummy 节点",
    desc: "创建 dummy 头节点，逐个比较两个链表的节点，较小的接到结果链表后面。",
    complexity: { time: "O(m+n)", space: "O(1)" },
    lang: "java",
    code: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0), tail = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }
            else { tail.next = list2; list2 = list2.next; }
            tail = tail.next;
        }
        tail.next = list1 != null ? list1 : list2;
        return dummy.next;
    }
}`,
    keyPoints: ["dummy 节点简化头节点处理", "比较值小的先接", "剩余部分直接拼接"],
    steps: ["创建 dummy 头", "比较两个链表当前节点", "较小的接到 tail 后面", "剩余直接拼接"]
  }],
  pitfalls: ["忘记 dummy 节点导致头节点处理复杂", "剩余链表直接接上不用再遍历"]
};

SOLUTIONS["2"] = {
  thinking: "两数相加（链表逆序存储）。模拟竖式加法，维护进位。",
  approaches: [{
    name: "模拟加法 + 进位",
    desc: "遍历两个链表，逐位相加加上进位。 carry = sum / 10, new digit = sum % 10。",
    complexity: { time: "O(max(m,n))", space: "O(max(m,n))" },
    lang: "java",
    code: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), curr = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) { sum += l1.val; l1 = l1.next; }
            if (l2 != null) { sum += l2.val; l2 = l2.next; }
            curr.next = new ListNode(sum % 10);
            carry = sum / 10;
            curr = curr.next;
        }
        return dummy.next;
    }
}`,
    keyPoints: ["carry = sum / 10", "digit = sum % 10", "循环条件包含 carry!=0 处理最高位进位"],
    steps: ["逐位相加+进位", "创建新节点存储当前位", "更新进位", "遍历完链表后处理剩余进位"]
  }],
  pitfalls: ["忘记 carry!=0 条件导致最高位进位丢失", "dummy 节点简化代码"]
};

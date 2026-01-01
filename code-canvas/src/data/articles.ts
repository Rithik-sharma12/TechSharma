export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorBio: string;
  date: string;
  readTime: string;
  section: string;
  subsection?: string;
  imageUrl?: string;
  tags: string[];
}

export const articles: Article[] = [
  {
    id: "understanding-buffer-overflows",
    title: "Understanding Buffer Overflows: A Deep Dive into Memory Exploitation",
    excerpt: "Buffer overflows remain one of the most critical vulnerabilities in software security. This comprehensive guide explores how they work, why they're dangerous, and modern mitigation techniques.",
    content: `Buffer overflows have been a cornerstone of software exploitation for decades. Despite advances in compiler protections and operating system security measures, understanding these vulnerabilities remains essential for any security professional or serious developer.

## What is a Buffer Overflow?

A buffer overflow occurs when a program writes data beyond the boundaries of allocated memory. This seemingly simple error can have devastating consequences, allowing attackers to execute arbitrary code, crash applications, or gain unauthorized access to systems.

## The Stack and Memory Layout

To understand buffer overflows, we must first understand how programs use memory. When a function is called, the system creates a "stack frame" containing local variables, return addresses, and saved registers.

\`\`\`c
void vulnerable_function(char *input) {
    char buffer[64];
    strcpy(buffer, input);  // Dangerous!
}
\`\`\`

In this example, if \`input\` exceeds 64 bytes, it will overflow into adjacent memory, potentially overwriting the return address.

## Modern Mitigations

Operating systems and compilers now implement several protections:

- **Stack Canaries**: Random values placed between buffers and control data
- **ASLR**: Address Space Layout Randomization
- **DEP/NX**: Data Execution Prevention
- **Safe Functions**: Using \`strncpy\` instead of \`strcpy\`

Understanding these mitigations is just as important as understanding the vulnerability itself.`,
    author: "Alex Chen",
    authorBio: "Security researcher specializing in binary exploitation and vulnerability analysis.",
    date: "Dec 28, 2025",
    readTime: "12 min read",
    section: "Security",
    subsection: "Exploitation",
    tags: ["security", "exploitation", "memory", "c"],
  },
  {
    id: "building-mechanical-keyboard",
    title: "Building Your First Custom Mechanical Keyboard: A Complete Guide",
    excerpt: "From selecting switches to programming firmware, everything you need to know about building a custom mechanical keyboard from scratch.",
    content: `Building a custom mechanical keyboard is a rewarding journey that combines hardware craftsmanship with software configuration. This guide will walk you through every step of the process.

## Choosing Your Components

### Switches
The heart of any mechanical keyboard. Popular options include:
- **Cherry MX Blue**: Tactile and clicky
- **Gateron Yellow**: Smooth linear
- **Zealios V2**: Premium tactile

### PCB and Plate
The PCB determines your keyboard's capabilities. Look for hot-swap sockets if you want to experiment with different switches.

### Keycaps
PBT keycaps offer durability and a premium feel, while ABS provides more color options and legends that won't fade.

## Assembly Process

1. Flash your firmware (QMK or VIA)
2. Install stabilizers
3. Mount switches
4. Test each switch
5. Install keycaps

## Programming Your Layout

\`\`\`c
const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = LAYOUT_60_ansi(
        KC_ESC, KC_1, KC_2, KC_3, KC_4, KC_5, KC_6, KC_7, KC_8, KC_9, KC_0
    )
};
\`\`\`

The beauty of custom keyboards is endless customization. Make it truly yours.`,
    author: "Jordan Martinez",
    authorBio: "Mechanical keyboard enthusiast and hardware tinkerer.",
    date: "Dec 26, 2025",
    readTime: "8 min read",
    section: "Hardware",
    subsection: "DIY",
    tags: ["keyboard", "hardware", "diy", "firmware"],
  },
  {
    id: "rust-ownership-explained",
    title: "Rust Ownership Explained: Memory Safety Without Garbage Collection",
    excerpt: "Rust's ownership system is revolutionary but can be confusing at first. Let's break down ownership, borrowing, and lifetimes with practical examples.",
    content: `Rust's ownership system is what sets it apart from other systems programming languages. It provides memory safety guarantees without the runtime cost of garbage collection.

## The Three Rules of Ownership

1. Each value in Rust has an owner
2. There can only be one owner at a time
3. When the owner goes out of scope, the value is dropped

## Understanding Moves

\`\`\`rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;  // s1 is moved to s2
    
    // println!("{}", s1);  // This would error!
    println!("{}", s2);  // This works
}
\`\`\`

When we assign s1 to s2, we're not copying the data—we're moving ownership.

## Borrowing

Instead of taking ownership, we can borrow references:

\`\`\`rust
fn calculate_length(s: &String) -> usize {
    s.len()
}

fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s);
    println!("Length of '{}' is {}", s, len);
}
\`\`\`

The \`&\` symbol creates a reference that borrows the value without taking ownership.

## Lifetimes

Lifetimes ensure references are valid for as long as they're used. The compiler usually infers them, but sometimes you need to be explicit:

\`\`\`rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
\`\`\`

Once you internalize these concepts, you'll write safer, faster code.`,
    author: "Sam Wilson",
    authorBio: "Systems programmer and Rust evangelist.",
    date: "Dec 24, 2025",
    readTime: "10 min read",
    section: "Programming",
    subsection: "Languages",
    tags: ["rust", "programming", "memory", "systems"],
  },
  {
    id: "linux-kernel-debugging",
    title: "Linux Kernel Debugging: Tools and Techniques for the Brave",
    excerpt: "Debugging the Linux kernel requires specialized tools and techniques. This guide covers everything from printk to KGDB and beyond.",
    content: `Debugging kernel code is fundamentally different from debugging userspace applications. Let's explore the tools available and when to use each.

## The Humble printk

The simplest debugging tool, yet incredibly effective:

\`\`\`c
printk(KERN_DEBUG "my_driver: value is %d\\n", value);
\`\`\`

Check output with \`dmesg\` or in \`/var/log/kern.log\`.

## Dynamic Debug

Enable debug messages at runtime without recompiling:

\`\`\`bash
echo 'module my_driver +p' > /sys/kernel/debug/dynamic_debug/control
\`\`\`

## Using KGDB

For serious debugging, KGDB provides GDB integration:

1. Configure kernel with CONFIG_KGDB=y
2. Add \`kgdboc=ttyS0,115200\` to boot parameters
3. Connect from another machine

## Ftrace and Perf

For tracing and profiling:

\`\`\`bash
# Enable function tracing
echo function > /sys/kernel/debug/tracing/current_tracer
cat /sys/kernel/debug/tracing/trace
\`\`\`

Master these tools and the kernel becomes less mysterious.`,
    author: "Alex Chen",
    authorBio: "Security researcher specializing in binary exploitation and vulnerability analysis.",
    date: "Dec 22, 2025",
    readTime: "15 min read",
    section: "Software",
    subsection: "Linux",
    tags: ["linux", "kernel", "debugging", "systems"],
  },
  {
    id: "homelab-network-security",
    title: "Securing Your Homelab: Network Segmentation and Monitoring",
    excerpt: "Your homelab is a playground for learning, but it can also be a security risk. Learn how to properly segment and monitor your home network.",
    content: `A homelab is an excellent way to learn about IT infrastructure, but without proper security measures, it can become a liability. Let's build a secure foundation.

## Network Segmentation with VLANs

Separate your networks by function:

- **VLAN 10**: Trusted devices (workstations)
- **VLAN 20**: IoT devices
- **VLAN 30**: Lab/experimental systems
- **VLAN 40**: Guest network

## Firewall Rules

Create strict rules between VLANs:

\`\`\`
# Allow lab to reach internet, block internal
pass in on vlan30 to any
block in on vlan30 to 192.168.0.0/16
\`\`\`

## Monitoring with Suricata

Deploy an IDS to watch traffic:

\`\`\`yaml
# /etc/suricata/suricata.yaml
af-packet:
  - interface: eth0
    cluster-id: 99
    cluster-type: cluster_flow
\`\`\`

## Logging and Alerting

Centralize logs with a SIEM like Graylog or Wazuh. Set up alerts for:

- Failed authentication attempts
- Unusual outbound connections
- Port scans

Your homelab should be a learning environment, not a backdoor into your home network.`,
    author: "Morgan Lee",
    authorBio: "Network engineer and homelab enthusiast building infrastructure at home.",
    date: "Dec 20, 2025",
    readTime: "9 min read",
    section: "Security",
    subsection: "Network",
    tags: ["homelab", "networking", "security", "firewall"],
  },
];

export const getArticleById = (id: string): Article | undefined => {
  return articles.find((article) => article.id === id);
};

export const getArticlesBySection = (section: string): Article[] => {
  return articles.filter(
    (article) => article.section.toLowerCase() === section.toLowerCase()
  );
};

export const getFeaturedArticle = (): Article => {
  return articles[0];
};

export const getLatestArticles = (count: number = 5): Article[] => {
  return articles.slice(0, count);
};

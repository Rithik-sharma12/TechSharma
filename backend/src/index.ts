import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   * Seeds sample data if none exists.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Check if sections exist
    const existingSections = await strapi.documents('api::section.section').findMany({});
    
    if (existingSections.length === 0) {
      console.log('🌱 Seeding database with sample data...');
      
      // Create sections
      const sections = [
        { name: 'Hardware', slug: 'hardware', description: 'Deep dives into computer hardware, DIY projects, and the physical side of technology.', order: 1 },
        { name: 'Software', slug: 'software', description: 'Exploring operating systems, development tools, and the software that powers our world.', order: 2 },
        { name: 'Security', slug: 'security', description: 'Cybersecurity insights, vulnerability research, and staying safe in a digital world.', order: 3 },
        { name: 'Programming', slug: 'programming', description: 'Programming languages, paradigms, and the art of writing better code.', order: 4 },
      ];

      const createdSections: Record<string, any> = {};
      for (const section of sections) {
        const created = await strapi.documents('api::section.section').create({
          data: section,
        });
        createdSections[section.slug] = created;
      }

      // Create sample articles
      const articles = [
        {
          title: 'Understanding Buffer Overflows: A Deep Dive into Memory Exploitation',
          slug: 'understanding-buffer-overflows',
          excerpt: 'Buffer overflows remain one of the most critical vulnerabilities in software security. This comprehensive guide explores how they work, why they\'re dangerous, and modern mitigation techniques.',
          content: `Buffer overflows have been a cornerstone of software exploitation for decades. Despite advances in compiler protections and operating system security measures, understanding these vulnerabilities remains essential for any security professional or serious developer.

## What is a Buffer Overflow?

A buffer overflow occurs when a program writes data beyond the boundaries of allocated memory. This seemingly simple error can have devastating consequences, allowing attackers to execute arbitrary code, crash applications, or gain unauthorized access to systems.

## The Stack and Memory Layout

To understand buffer overflows, we must first understand how programs use memory. When a function is called, the system creates a "stack frame" containing local variables, return addresses, and saved registers.

## Modern Mitigations

Operating systems and compilers now implement several protections:

- **Stack Canaries**: Random values placed between buffers and control data
- **ASLR**: Address Space Layout Randomization
- **DEP/NX**: Data Execution Prevention
- **Safe Functions**: Using strncpy instead of strcpy`,
          author: 'Alex Chen',
          authorBio: 'Security researcher specializing in binary exploitation and vulnerability analysis.',
          readTime: '12 min read',
          section: createdSections['security'].documentId,
          subsection: 'Exploitation',
          imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop',
          tags: ['security', 'exploitation', 'memory', 'c'],
          featured: true,
        },
        {
          title: 'Building Your First Custom Mechanical Keyboard: A Complete Guide',
          slug: 'building-mechanical-keyboard',
          excerpt: 'From selecting switches to programming firmware, everything you need to know about building a custom mechanical keyboard from scratch.',
          content: `Building a custom mechanical keyboard is a rewarding journey that combines hardware craftsmanship with software configuration. This guide will walk you through every step of the process.

## Choosing Your Components

### Switches
The heart of any mechanical keyboard. Popular options include:
- **Cherry MX Blue**: Tactile and clicky
- **Gateron Yellow**: Smooth linear
- **Zealios V2**: Premium tactile

### PCB and Plate
The PCB determines your keyboard's capabilities. Look for hot-swap sockets if you want to experiment with different switches.

The beauty of custom keyboards is endless customization. Make it truly yours.`,
          author: 'Jordan Martinez',
          authorBio: 'Mechanical keyboard enthusiast and hardware tinkerer.',
          readTime: '8 min read',
          section: createdSections['hardware'].documentId,
          subsection: 'DIY',
          imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=300&fit=crop',
          tags: ['keyboard', 'hardware', 'diy', 'firmware'],
          featured: false,
        },
        {
          title: 'Rust Ownership Explained: Memory Safety Without Garbage Collection',
          slug: 'rust-ownership-explained',
          excerpt: 'Rust\'s ownership system is revolutionary but can be confusing at first. Let\'s break down ownership, borrowing, and lifetimes with practical examples.',
          content: `Rust's ownership system is what sets it apart from other systems programming languages. It provides memory safety guarantees without the runtime cost of garbage collection.

## The Three Rules of Ownership

1. Each value in Rust has an owner
2. There can only be one owner at a time
3. When the owner goes out of scope, the value is dropped

Once you internalize these concepts, you'll write safer, faster code.`,
          author: 'Sam Wilson',
          authorBio: 'Systems programmer and Rust evangelist.',
          readTime: '10 min read',
          section: createdSections['programming'].documentId,
          subsection: 'Languages',
          imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
          tags: ['rust', 'programming', 'memory', 'systems'],
          featured: false,
        },
        {
          title: 'Linux Kernel Debugging: Tools and Techniques for the Brave',
          slug: 'linux-kernel-debugging',
          excerpt: 'Debugging the Linux kernel requires specialized tools and techniques. This guide covers everything from printk to KGDB and beyond.',
          content: `Debugging kernel code is fundamentally different from debugging userspace applications. Let's explore the tools available and when to use each.

## The Humble printk

The simplest debugging tool, yet incredibly effective.

## Dynamic Debug

Enable debug messages at runtime without recompiling.

## Using KGDB

For serious debugging, KGDB provides GDB integration.

Master these tools and the kernel becomes less mysterious.`,
          author: 'Alex Chen',
          authorBio: 'Security researcher specializing in binary exploitation and vulnerability analysis.',
          readTime: '15 min read',
          section: createdSections['software'].documentId,
          subsection: 'Linux',
          imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=300&fit=crop',
          tags: ['linux', 'kernel', 'debugging', 'systems'],
          featured: false,
        },
      ];

      for (const article of articles) {
        await strapi.documents('api::article.article').create({
          data: {
            ...article,
            section: article.section,
          },
          status: 'published',
        });
      }

      console.log('✅ Database seeded successfully!');
    }
  },
};

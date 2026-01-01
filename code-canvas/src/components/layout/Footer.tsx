import { Github, Twitter, Linkedin, Rss } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="font-sans text-lg font-bold text-foreground">TechSharma</span>
            <p className="text-sm text-muted-foreground">
              Exploring the depths of technology, one article at a time.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="/rss"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="RSS Feed"
            >
              <Rss className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TechSharma. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

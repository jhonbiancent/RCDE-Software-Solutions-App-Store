export default function AboutPage() {
  return (
    <div className="container py-16 max-w-3xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">About Me</h1>
        <p className="text-xl text-muted-foreground">
          Developer, builder, and lifelong learner.
        </p>
      </div>

      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>
          I'm a software developer who loves building useful things — whether that's a web app,
          a desktop tool, or a small utility that saves time. AppShelf is my personal space to share
          what I've built, document the lessons learned, and provide downloads for my software.
        </p>
        <p>
          I focus on shipping working software fast, iterating based on real feedback, and keeping things
          simple. Every project here comes with a case study covering the problem, the approach, and the
          tech choices behind it.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Skills & Stack</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Next.js", "React", "TypeScript", "Node.js",
            "PostgreSQL", "Prisma", "Tailwind CSS",
            "Python", "Electron", "Docker", "Git",
          ].map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-muted/50 hover:bg-muted transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Links</h2>
        <div className="flex flex-col gap-3 text-muted-foreground">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <span className="font-medium">GitHub →</span>
          </a>
        </div>
      </div>
    </div>
  );
}

# RCDE Software Solutions App Store — Personal App Store & Portfolio

## Project Brief (read this first)

A Next.js website that functions as:

1. A personal **app store** — showcases web apps, desktop software, and websites the owner has built
2. A **portfolio** — each app doubles as a case study
3. Solo-publisher only for MVP (owner uploads via a protected `/admin` area — no public submission flow)
4. Downloads for desktop/binary releases are **not self-hosted**. Each app links to its GitHub repo; the site reads release assets and download counts live from the GitHub REST API. No S3/blob storage needed for MVP.
5. Visitors can leave star ratings + written reviews and comments (comments via Giscus/GitHub Discussions to avoid building a comment system from scratch in MVP).

Priority for this build: **ship a working MVP fast**, not a fully scaled multi-tenant platform. Design choices below optimize for that, with clear seams to extend later (noted inline as `// FUTURE:`).

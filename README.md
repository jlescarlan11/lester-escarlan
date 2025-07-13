This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Next.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
```

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a storage bucket named `project-preview` in your Supabase dashboard
3. Set the bucket's privacy settings to allow public access for reading
4. Add your Supabase URL and anon key to the environment variables

## Database Setup

1. Run the database migrations:
```bash
npx prisma migrate dev
```

2. Generate the Prisma client:
```bash
npx prisma generate
```

## Contact Form Setup

The contact form uses [Resend](https://resend.com) for email delivery. To set it up:

1. Create a free account at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add the API key to your environment variables as `RESEND_API_KEY`
4. The contact form will send emails to `jlescarlan11@gmail.com` (you can change this in `app/api/contact/route.ts`)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Resume Builder

This project includes a script to generate a PDF resume from the data in `app/_data/`.

### Requirements
- Node.js
- `pdflatex` installed and available in your system PATH (for LaTeX PDF generation)

### Usage

To generate the resume PDF in `public/resume.pdf`, run:

```
npm run build:resume
```

This is also included in the main build step:

```
npm run build
```

The script will read your data files and output a LaTeX-styled PDF resume to `public/`.

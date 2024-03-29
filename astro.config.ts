import { defineConfig } from 'astro/config';
import { rawFonts } from './src/utils/misc';
import { base } from './src/site.config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// Rehype and Remark plugins
import a11yEmoji from '@fec/remark-a11y-emoji';
import figureCaption from '@microflash/remark-figure-caption';
import autolinkHeadings from 'rehype-autolink-headings';
import externalLinks from 'rehype-external-links';
import slug from 'rehype-slug';
import codeTitle from 'remark-code-title';
import tableOfContents from 'remark-toc';
import readingTime from './src/utils/article';

import autoImport from 'astro-auto-import';
import compress from 'astro-compress';
import icon from 'astro-icon';
import workerLinks from 'astro-worker-links';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  site: base.site.url,
  markdown: {
    shikiConfig: {
      theme: 'material-theme-ocean',
    },
    remarkPlugins: [
      a11yEmoji,
      codeTitle,
      figureCaption,
      [
        tableOfContents,
        {
          tight: true,
        },
      ],
      readingTime,
    ],
    rehypePlugins: [
      slug,
      [
        autolinkHeadings,
        {
          behavior: 'append',
          content: {
            type: 'text',
            value: '#',
          },
        },
      ],
      [
        externalLinks,
        {
          contentProperties: { className: ['external-link'] },
          content: { type: 'text', value: ' ↗' },
        },
      ],
    ],
  },
  integrations: [
    tailwind(),
    autoImport({
      imports: [{ 'astro-icon/components': ['Icon'] }, './src/components/mdx/Caption.astro'],
    }),
    mdx(),
    keystatic(),
    react(),
    icon({
      include: {
        mdi: ['*'],
        'simple-icons': ['paypal', 'kofi'],
      },
    }),
    sitemap(),
    compress(),
    workerLinks({
      domain: 'https://solstice.tf',
      secret: process.env.WORKER_SECRET!,
      getPageMapping(pages) {
        return pages
          .filter(
            (url) =>
              url.pathname !== '/article/' &&
              url.pathname.includes('/article') &&
              !url.pathname.includes('/article/tag')
          )
          .map((url) => {
            return {
              page: url.href,
              shortlink: url.pathname.replace('/article', ''),
            };
          });
      },
    }),
    // TODO: Re-enable later
    // simpleStackStream(),
  ],
  vite: {
    plugins: [rawFonts(['.ttf'])],
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
});

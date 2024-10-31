# Kite - Community curated categories

This repository contains community curated categories for [Kite](https://kagi.com), Kagi's news app.

To edit sources, submit a pull request editing `kite_feeds.json`. If you do not know how to do that, you can [open an issue](https://github.com/kagisearch/kite-public/issues/new/choose) and share the feeds there.

This file contains RSS feeds for various categories.

To add a new category or modify existing ones, follow this structure:
```
{
  "Category Name": {
    "feeds": [
      "https://example.com/rss-feed-1",
      "https://example.com/rss-feed-2",
      ...
    ]
  },
  "Another Category": {
    "feeds": [
      "https://another-example.com/rss-feed-1",
      "https://another-example.com/rss-feed-2",
      ...
    ]
  }
}
```

## Adding a new category

1. Create a new object with the category name as the key
2. Add a "feeds" array containing the RSS feed URLs for that category
3. Ensure proper JSON formatting (commas between objects, no trailing comma)

All categories are created equal and will appear as top level categories in the Kite app.

Ideas for categories:
- Local news (city/state level)
- Regional news (country/region)
- Topical news (health, machine learning, aviation ...)

**Important**

We require at least **25 feeds** for a category in order to surface it in Kite news. This is to make sure we maintain high level of events covered in the app. The more high quality feeds exist for a category, the better Kite coverage will be. The feeds should be using the same language.


## Guidelines for RSS feeds

Kite does not scrape websites, but only publicly avaialble RSS feeds.

When adding an RSS feed make sure to:

- Check that feed is working and has recent (daily) content.
- Choose sources that have high quality content. Do not use low quality/gossip/SEO content.
- Feeds should be in the same language as the rest of the feeds in that category (do not mix languages)


# kite-public

This repository contains community curated categories for
[Kite](https://kagi.com), Kagi's news
app.

To edit the source, submit a pull request editing kite_feeds.json.

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

To add a new category:
1. Create a new object with the category name as the key
2. Add a "feeds" array containing the RSS feed URLs for that category
3. Ensure proper JSON formatting (commas between objects, no trailing comma)

Guidelines:

- Use only RSS feeds
- Choose publications that have high quality content

**Important**

We require at least 20 feeds for a category, to consider it for processing
and showing inside the Kite app.

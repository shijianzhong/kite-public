# Kite - News. Elevated.

This repository contains public files for [Kite](https://kite.kagi.com), Kagi's news app. [Kagi](https://kagi.com) is a premium web search engine.

# Install & run Kite front-end

Kite front end is a statically served app and is fully open source.

Here is how to run it locally.

```
pip install Jinja2
python generate.py
open index.html
```

This will load utilize the data of the Kite app that can be found at https://kite.kagi.com/kite.json. Note that kite.json and files referenced by it are licensed under [CC BY-NC license](https://creativecommons.org/licenses/by-nc/4.0/). This means that this data can be used free of charge with attribution and for non-commercial use.

Our front ened is just one example front end that one can run on top of this data. We encourage others to contribute improvements to it as well as create their own front ends and add them to this Readme file.

## Editing categories

To edit community curated categories, submit a pull request editing `kite_feeds.json`. If you do not know how to do that, you can [open an issue](https://github.com/kagisearch/kite-public/issues/new/choose) and share the feeds you want to add there.

This file contains RSS feeds for various categories.

To add a new category or modify existing ones, follow this structure:

```jsonc
{
  "Category Name": {
    "feeds": [
      "https://example.com/rss-feed-1",
      "https://example.com/rss-feed-2"
      // ...
    ]
  },
  "Another Category": {
    "feeds": [
      "https://another-example.com/rss-feed-1",
      "https://another-example.com/rss-feed-2"
      // ...
    ]
  }
}
```

### Adding a new category

1. Create a new object with the category name as the key
2. Add a "feeds" array containing the RSS feed URLs for that category
3. Ensure proper JSON formatting (commas between objects, no trailing comma)

All categories are created equal and will appear as top level categories in the Kite app.

Ideas for categories:

- Local news (city/state level)
- Regional news (country/region)
- Topical news (health, machine learning, aviation ...)

#### Important

We require at least **25 feeds** for a category in order to surface it in Kite news. This is to make sure we maintain high level of quality of events covered in the app. The more high quality feeds exist for a category, the better Kite coverage will be. The feeds should be using the same language.

Kite does not scrape news websites, it only uses publicly available information in RSS feeds.

### Guidelines for adding RSS feeds

Kite does not scrape websites, but only publicly available RSS feeds.

When adding an RSS feed make sure to:

- Check that feed is working and has recent (daily) content.
- Choose sources that have high quality content. Do not use low quality/gossip/SEO content.
- Feeds should be in the same language as the rest of the feeds in that category (do not mix languages)


## Guideline for editing media_data.json

Kite uses contents of `media_data.jso`n to show additional information about sources of information. Initial information has been sources from https://statemediamonitor.com/ and the classification methodology  is explained here https://statemediamonitor.com/methodology/

Feel free to add additional information (by editing `media_data.json`) both for privatly owned and state funded media organization. Add your sources of information in the pull request.

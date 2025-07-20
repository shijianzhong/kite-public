#!/usr/bin/env node

import fs from 'fs';

const FEEDS_FILE = 'kite_feeds.json';

// Define the order of category types - add new types here as needed
const CATEGORY_TYPE_ORDER = [
  'country',
  'region', 
  'city',
  'topic'
];

function getCategoryType(categoryData) {
  return categoryData.category_type || 'topic';
}

function getCategoryTypeOrder(categoryType) {
  const index = CATEGORY_TYPE_ORDER.indexOf(categoryType);
  return index === -1 ? CATEGORY_TYPE_ORDER.length : index;
}

function sortCategories(categories) {
  const entries = Object.entries(categories);
  
  // Sort by category type order first, then alphabetically within each type
  return entries.sort(([nameA, dataA], [nameB, dataB]) => {
    const typeA = getCategoryType(dataA);
    const typeB = getCategoryType(dataB);
    
    const orderA = getCategoryTypeOrder(typeA);
    const orderB = getCategoryTypeOrder(typeB);
    
    // First sort by category type order
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // Then sort alphabetically within the same category type
    return nameA.localeCompare(nameB);
  });
}

function sortAndDeduplicateFeeds(feeds) {
  // Remove duplicates and sort alphabetically by URL
  const uniqueFeeds = [...new Set(feeds)];
  return uniqueFeeds.sort((a, b) => a.localeCompare(b));
}

function main() {
  try {
    console.log('📄 Reading kite_feeds.json...');
    const feedsData = JSON.parse(fs.readFileSync(FEEDS_FILE, 'utf8'));
    
    console.log('🔄 Processing categories and feeds...');
    
    // Sort categories (countries/regions first, then topics)
    const sortedCategories = sortCategories(feedsData);
    
    // Create new sorted object
    const sortedFeedsData = {};
    let totalDuplicatesRemoved = 0;
    
    for (const [categoryName, categoryData] of sortedCategories) {
      const originalFeedCount = categoryData.feeds.length;
      
      // Sort and deduplicate feeds within this category
      const sortedFeeds = sortAndDeduplicateFeeds(categoryData.feeds);
      const duplicatesRemoved = originalFeedCount - sortedFeeds.length;
      totalDuplicatesRemoved += duplicatesRemoved;
      
      if (duplicatesRemoved > 0) {
        console.log(`  📁 ${categoryName}: removed ${duplicatesRemoved} duplicate(s)`);
      }
      
      sortedFeedsData[categoryName] = {
        ...categoryData,
        feeds: sortedFeeds
      };
    }
    
    console.log('💾 Writing sorted data back to file...');
    
    // Write back with proper formatting
    fs.writeFileSync(
      FEEDS_FILE, 
      JSON.stringify(sortedFeedsData, null, 2) + '\n',
      'utf8'
    );
    
    console.log('✅ Feed sorting completed!');
    console.log(`📊 Categories: ${Object.keys(sortedFeedsData).length}`);
    console.log(`🗑️  Total duplicates removed: ${totalDuplicatesRemoved}`);
    
    // Show category breakdown by type
    const categoriesByType = {};
    Object.entries(sortedFeedsData).forEach(([name, data]) => {
      const type = getCategoryType(data);
      if (!categoriesByType[type]) categoriesByType[type] = [];
      categoriesByType[type].push(name);
    });
    
    CATEGORY_TYPE_ORDER.forEach(type => {
      if (categoriesByType[type]) {
        console.log(`📂 ${type} (${categoriesByType[type].length}): ${categoriesByType[type].slice(0, 5).join(', ')}${categoriesByType[type].length > 5 ? '...' : ''}`);
      }
    });
    
    // Show any unknown types at the end
    Object.keys(categoriesByType).forEach(type => {
      if (!CATEGORY_TYPE_ORDER.includes(type)) {
        console.log(`❓ ${type} (${categoriesByType[type].length}): ${categoriesByType[type].slice(0, 5).join(', ')}${categoriesByType[type].length > 5 ? '...' : ''}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error processing feeds:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
/**
 * Test script for schema parser library
 * Run with: node src/lib/test.mjs
 */

import { readFile } from 'fs/promises';
import { parseSchema, presetsToArray } from './schemaParser.js';
import { createSchemaContext } from './schemaUtils.js';

async function runTests() {
  console.log('🧪 Testing OSM Schema Parser Library\n');

  try {
    // Load sample schema
    console.log('📄 Loading sample schema...');
    const schemaData = JSON.parse(
      await readFile('./src/data/sampleSchema.json', 'utf-8')
    );
    console.log('✅ Schema loaded\n');

    // Parse schema
    console.log('🔍 Parsing schema...');
    const parsed = parseSchema(schemaData);
    console.log(`✅ Parsed ${parsed.metadata.presetCount} presets`);
    console.log(`✅ Parsed ${parsed.metadata.fieldCount} fields`);
    console.log(`✅ Found ${parsed.metadata.categoryCount} categories\n`);

    // Create context
    console.log('🏗️  Creating schema context...');
    const context = createSchemaContext(parsed);
    console.log('✅ Context created\n');

    // Test getPresetById
    console.log('🔎 Testing getPresetById()...');
    const restaurant = context.getPresetById('amenity/restaurant');
    if (restaurant) {
      console.log(`✅ Found: ${restaurant.name}`);
      console.log(`   Category: ${restaurant.category}`);
      console.log(`   Tags: ${JSON.stringify(restaurant.tags)}`);
      console.log(`   Fields: ${restaurant.fields.length}`);
      console.log(`   Inherited from: ${restaurant.reference || 'none'}\n`);
    } else {
      console.log('❌ Restaurant preset not found\n');
    }

    // Test inheritance resolution
    console.log('🔗 Testing inheritance resolution...');
    const cafe = context.getPresetById('amenity/cafe');
    if (cafe) {
      console.log(`✅ Cafe preset:`);
      console.log(`   Name field inherited: ${cafe.fields.includes('name')}`);
      console.log(`   Total fields: ${cafe.fields.length}`);
      console.log(`   More fields: ${cafe.moreFields.length}\n`);
    }

    // Test searchPresets
    console.log('🔍 Testing searchPresets()...');
    const coffeeResults = context.searchPresets('coffee');
    console.log(`✅ Found ${coffeeResults.length} results for "coffee"`);
    coffeeResults.forEach(p => {
      console.log(`   - ${p.name} (${p.category})`);
    });
    console.log('');

    // Test category filter
    console.log('🏷️  Testing category filter...');
    const amenities = context.searchPresets('', { category: 'Amenity' });
    console.log(`✅ Found ${amenities.length} amenities`);
    console.log('');

    // Test getFieldsByPreset
    console.log('📝 Testing getFieldsByPreset()...');
    const restaurantFields = context.getFieldsByPreset('amenity/restaurant');
    console.log(`✅ Restaurant has ${restaurantFields.fields.length} main fields`);
    console.log(`   First 5: ${restaurantFields.fields.slice(0, 5).map(f => f.label).join(', ')}`);
    console.log('');

    // Test getCategorizedPresets
    console.log('📊 Testing getCategorizedPresets()...');
    const categorized = context.getCategorizedPresets();
    Object.entries(categorized).forEach(([cat, presets]) => {
      console.log(`   ${cat}: ${presets.length} presets`);
    });
    console.log('');

    // Test statistics
    console.log('📈 Getting statistics...');
    const stats = context.getStatistics();
    console.log(`✅ Statistics:`);
    console.log(`   Total presets: ${stats.presetCount}`);
    console.log(`   Total fields: ${stats.fieldCount}`);
    console.log(`   Total categories: ${stats.categoryCount}`);
    console.log('');

    // Test findPresetByTags
    console.log('🎯 Testing findPresetByTags()...');
    const foundPreset = context.findPresetByTags({ amenity: 'restaurant' });
    if (foundPreset) {
      console.log(`✅ Found preset by tags: ${foundPreset.name}`);
    }
    console.log('');

    console.log('✨ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();

/**
 * KuzuInMemorySync Test File
 * 
 * This file contains tests for the KuzuInMemorySync class functionality,
 * testing initialization, query execution, and cleanup.
 */

import KuzuInMemorySync from '../../src/wasm/Kuzu/services/KuzuInMemorySync.js';

// Simple test schema and data
const TEST_SCHEMA = [
  `CREATE NODE TABLE Person (
    id INT64,
    name STRING,
    PRIMARY KEY (id)
  )`
];

describe('KuzuInMemorySync', () => {
  let kuzuService;

  beforeEach(async () => {
    kuzuService = new KuzuInMemorySync();
    await kuzuService.initialize();
  });

  afterEach(() => {
    kuzuService.cleanup();
  });

  test('initializes successfully', async () => {
    expect(kuzuService.initialized).toBe(true);
    expect(kuzuService.db).toBeTruthy();
    expect(kuzuService.connection).toBeTruthy();
    expect(kuzuService.helper).toBeTruthy();
  });

  test('prevents double initialization', async () => {
    const result = await kuzuService.initialize();
    expect(result).toBe(true);
  });

  test('executes query successfully', () => {
    const result = kuzuService.executeQuery('CREATE (n:TestNode {value: 1}) RETURN n');
    expect(result.success).toBe(true);
  });

  test('handles invalid query', () => {
    const result = kuzuService.executeQuery('INVALID QUERY');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  test('creates schema successfully', () => {
    const result = kuzuService.setupSchema(TEST_SCHEMA);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Schema created successfully!');
  });

  test('executes helper function successfully', () => {
    const result = kuzuService.executeHelper('createNode', 'Person', { id: 1, name: 'Alice' });
    expect(result.success).toBe(true);
  });

  test('deletes all data successfully', async () => {
    // First create some test data
    await kuzuService.setupSchema(TEST_SCHEMA);
    kuzuService.executeQuery('CREATE (n:Person {id: 1, name: "Alice"})');
    
    const result = kuzuService.deleteAllData();
    expect(result.success).toBe(true);
    expect(result.message).toBe('All data deleted successfully');
  });

  test('gets helper functions list', () => {
    const result = kuzuService.getHelperFunctions();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
  });

  test('cleanup works correctly', () => {
    kuzuService.cleanup();
    expect(kuzuService.initialized).toBe(false);
  });
});

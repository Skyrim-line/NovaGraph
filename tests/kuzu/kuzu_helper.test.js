/**
 * KuzuGraphHelper Test File
 * 
 * This file contains tests for all the functions in the KuzuGraphHelper class.
 * It tests database connection, schema creation, data manipulation, and graph queries.
 */

// Required imports
const kuzu = require('kuzu-wasm/sync');
const KuzuGraphHelper = require('../../src/wasm/Kuzu/helpers/KuzuGraphHelper.js');

// Test data constants
const SCHEMA = [
  `CREATE NODE TABLE Person (
    id INT64, 
    name STRING, 
    age INT64, 
    PRIMARY KEY (id)
  )`,
  `CREATE NODE TABLE Post (
    id INT64, 
    content STRING, 
    timestamp STRING, 
    PRIMARY KEY (id)
  )`,
  `CREATE REL TABLE Follows (
    FROM Person TO Person,
    since STRING
  )`,
  `CREATE REL TABLE Created (
    FROM Person TO Post
  )`,
  `CREATE REL TABLE Likes (
    FROM Person TO Post,
    timestamp STRING
  )`
];

const PEOPLE = [
  { id: 1, name: "Alice", age: 28 },
  { id: 2, name: "Bob", age: 32 },
  { id: 3, name: "Charlie", age: 25 },
  { id: 4, name: "Diana", age: 30 },
  { id: 5, name: "Eva", age: 27 }
];

const POSTS = [
  { id: 101, content: "Hello graph world!", timestamp: "2023-01-15T10:30:00" },
  { id: 102, content: "Graphs are awesome", timestamp: "2023-01-16T14:20:00" },
  { id: 103, content: "Learning Kuzu today", timestamp: "2023-01-17T09:45:00" },
  { id: 104, content: "Graph databases rock!", timestamp: "2023-01-18T16:05:00" },
  { id: 105, content: "Cypher query language is powerful", timestamp: "2023-01-19T11:15:00" }
];

const FOLLOWS = [
  { from: 1, to: 2, since: "2022-05-10" },
  { from: 1, to: 3, since: "2022-06-15" },
  { from: 2, to: 4, since: "2022-04-20" },
  { from: 3, to: 1, since: "2022-07-05" },
  { from: 4, to: 5, since: "2022-08-12" },
  { from: 5, to: 1, since: "2022-09-30" }
];

const POSTS_AUTHORSHIP = [
  { person: 1, post: 101 },
  { person: 2, post: 102 },
  { person: 3, post: 103 },
  { person: 1, post: 104 },
  { person: 5, post: 105 }
];

const LIKES = [
  { person: 2, post: 101, timestamp: "2023-01-15T11:00:00" },
  { person: 3, post: 101, timestamp: "2023-01-15T12:30:00" },
  { person: 1, post: 102, timestamp: "2023-01-16T15:00:00" },
  { person: 4, post: 103, timestamp: "2023-01-17T10:15:00" },
  { person: 5, post: 104, timestamp: "2023-01-18T17:20:00" },
  { person: 3, post: 105, timestamp: "2023-01-19T13:45:00" }
];

describe('KuzuGraphHelper', () => {
  let connection;
  let helper;
  
  beforeEach(() => {
    connection = new kuzu.Connection();
    helper = new KuzuGraphHelper(connection);
  });
  
  test('constructor throws error with invalid connection', () => {
    expect(() => new KuzuGraphHelper(null)).toThrow();
    expect(() => new KuzuGraphHelper(undefined)).toThrow();
  });
  
  test('creates nodes successfully', () => {
    const result = helper.createNode("Person", { name: "Frank", age: 35 });
    expect(result.success).toBe(true);
  });

  test('creates relationships successfully', () => {
    const result = helper.createRelationship(
      "Person", { id: 1 }, 
      "Person", { id: 4 }, 
      "Follows", { since: "2023-03-20" }
    );
    
    expect(result.success).toBe(true);
  });

  test('finds nodes by label and properties', () => {
    const result = helper.findNodes("Person", { age: 28 });
    expect(result.success).toBe(true);
  });

  test('gets neighbors of a node', () => {
    const result = helper.getNeighbors("Person", { id: 1 }, "outgoing", "Follows");
    expect(result.success).toBe(true);
  });

  test('executes raw Cypher queries', () => {
    const result = helper.executeQuery("MATCH (p:Person) RETURN COUNT(p) as count");
    expect(result.success).toBe(true);
  });

  test('deletes nodes', () => {
    const result = helper.deleteNodes("Person", { id: 100 });
    expect(result.success).toBe(true);
  });

  test('updates node properties', () => {
    const result = helper.updateNode("Person", { id: 1 }, { age: 29 });
    expect(result.success).toBe(true);
  });

  test('finds nodes by relationships', () => {
    const result = helper.findNodesByRelationships("Person", ["Created"], 10);
    expect(result.success).toBe(true);
  });

  test('recommends similar nodes', () => {
    const result = helper.recommendSimilarNodes("Person", { id: 1 }, 5);
    expect(result.success).toBe(true);
  });

  test('_formatPropertyConditions creates proper WHERE conditions', () => {
    const conditions = helper._formatPropertyConditions({ name: "Alice", age: 29 });
    expect(conditions).toBe("n.name = 'Alice' AND n.age = 29");
    
    const emptyConditions = helper._formatPropertyConditions({});
    expect(emptyConditions).toBe("1=1");
  });
});
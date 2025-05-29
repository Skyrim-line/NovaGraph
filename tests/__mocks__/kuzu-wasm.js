// Default mock response for queries
const defaultQueryResponse = {
    isSuccess: () => true,
    getErrorMessage: () => null,
    getAllObjects: () => [],
    getQuerySummary: () => ({})
  };
  
  // Mock count query response
  const countQueryResponse = {
    ...defaultQueryResponse,
    getAllObjects: () => [{count: 5}]
  };
  
  // Create mock connection
  const createMockConnection = () => ({
    query: jest.fn().mockImplementation((query) => 
      query.toLowerCase().includes('count') ? countQueryResponse : defaultQueryResponse
    ),
    close: jest.fn()
  });
  
  // Main mock object
  const kuzuMock = {
    init: jest.fn().mockResolvedValue(undefined),
    Database: jest.fn(),
    Connection: jest.fn().mockImplementation(() => createMockConnection()),
    getVersion: jest.fn().mockReturnValue('1.0.0')
  };
  
  module.exports = kuzuMock; 
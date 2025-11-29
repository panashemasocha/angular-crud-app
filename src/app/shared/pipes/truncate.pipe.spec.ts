// Import the TruncatePipe class that needs to be tested
import { TruncatePipe } from './truncate.pipe';

/**
 * Test suite for TruncatePipe
 * Tests the pipe's ability to truncate text strings to a specified length
 */
describe('TruncatePipe', () => {
  // Variable to hold the TruncatePipe instance being tested
  let pipe: TruncatePipe;

  // Setup function that runs before each test
  beforeEach(() => {
    // Instantiate a new TruncatePipe for each test to ensure clean state
    pipe = new TruncatePipe();
  });

  // Test that the pipe is created successfully
  it('create an instance', () => {
    // Verify the pipe instance exists and is truthy
    expect(pipe).toBeTruthy();
  });

  // Test that the pipe truncates text longer than the specified limit
  it('should truncate long text', () => {
    // Create a test string that exceeds the truncation limit
    const longText = 'This is a very long text that should be truncated';
    // Call the pipe's transform method with text and limit of 20 characters
    const result = pipe.transform(longText, 20);
    // Verify the result is truncated to 20 characters with ellipsis added
    expect(result).toBe('This is a very long ...');
  });

  // Test that the pipe leaves short text unchanged
  it('should not truncate short text', () => {
    // Create a test string that is shorter than the truncation limit
    const shortText = 'Short text';
    // Call the pipe's transform method with text and limit of 20 characters
    const result = pipe.transform(shortText, 20);
    // Verify the result remains unchanged since it's within the limit
    expect(result).toBe('Short text');
  });
});
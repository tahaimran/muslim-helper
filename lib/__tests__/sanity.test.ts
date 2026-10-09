describe('test environment', () => {
  it('runs in America/New_York', () => {
    // Jan offset is UTC-5 => 300 minutes
    expect(new Date(2026, 0, 15).getTimezoneOffset()).toBe(300);
  });
});

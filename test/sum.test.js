const sum = require('../utils/sum')

test.skip('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('adds nothing', () => {
    expect(sum()).toBe(0);
  });
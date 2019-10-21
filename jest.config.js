module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  coverageReporters: ['json', 'html'],
  collectCoverage: false,
  testEnvironment: 'node',
  transform: { '^.+\\.ts$': 'ts-jest' },
  testRegex: './tests/.+\\.test\\.ts$',
}

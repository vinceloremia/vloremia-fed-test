module.exports = {
	clearMocks: true,
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.js'],
	coverageReporters: ['text', 'lcov'],
	coverageThreshold: {
		global: {
			statements: 90,
			branches: 90,
			functions: 90,
			lines: 90
		}
	},
	coverageDirectory: 'test-reports',
	setupFilesAfterEnv: ['jest-extended', 'jest-enzyme'],
	testEnvironment: 'enzyme',
	testEnvironmentOptions: {
		enzymeAdapter: 'react16'
	},
	snapshotSerializers: ['enzyme-to-json/serializer'],
	moduleDirectories: ['node_modules', 'src']
};

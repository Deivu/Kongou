// @ts-check
import config from '@shipgirl/eslint-config';

export default [
	...config(
		import.meta.dirname,
		{
			files: ['** /*.ts'],
			rules: {
				'import-x/extensions': 'off',
				'import-x/no-default-export': 'off',
			}
		}
	)
];

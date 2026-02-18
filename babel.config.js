module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }], 
      'nativewind/babel'
    ], 
    plugins: [
      // 3. Module Resolver (REQUIRED for "@/..." imports to work)
      [
        'module-resolver',
        {
          alias: {
            '@': './src', 
          },
        },
      ],
    ], 
  };
};
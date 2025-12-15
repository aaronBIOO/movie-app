module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }], 
      'nativewind/babel'
    ], 
    plugins: [
      // 3. Module Resolver (REQUIRED for your "@/..." imports to work)
      [
        'module-resolver',
        {
          alias: {
            '@': './src', // Maps "@/components/..." to "./src/components/..."
          },
        },
      ],
      // (Optional) If you installed Reanimated for animations, its plugin goes here at the end:
      // 'react-native-reanimated/plugin',
    ], 
  };
};
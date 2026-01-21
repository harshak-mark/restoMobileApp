const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath =
  require.resolve('react-native-svg-transformer');

config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
);

config.resolver.sourceExts.push('svg');

// Configure platform-specific file resolution
config.resolver.platforms = ['native', 'ios', 'android', 'web'];

// Add resolver to exclude native Stripe file and @stripe/stripe-react-native on web
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // On web, exclude native-only modules
  if (platform === 'web') {
    // Skip native Stripe service file
    if (moduleName && (moduleName.includes('stripeService.native') || moduleName.endsWith('stripeService.native'))) {
      return { type: 'empty' };
    }
    // Skip @stripe/stripe-react-native package on web
    if (moduleName === '@stripe/stripe-react-native' || 
        (typeof moduleName === 'string' && moduleName.startsWith('@stripe/stripe-react-native'))) {
      return { type: 'empty' };
    }
  }
  
  // Use default resolver
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
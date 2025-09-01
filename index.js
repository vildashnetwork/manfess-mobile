import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriatel https://cli.github.com/?utm_source=chatgpt.com
registerRootComponent(App);
// rm -rf .git     git pull origin main --allow-unrelated-histories
//llk


// git remote add origin git@github.com:vildashnetwork/manfess-mobile2.git
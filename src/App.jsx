import React, { useState, useEffect, useContext } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import { GlobalContext, GlobalProvider } from './context';
import Home from './panels/Home';
import CatDetails from './panels/CatDetails';
import RandomCat from './panels/RandomCat';

import '@vkontakte/vkui/dist/vkui.css';

const Error = React.lazy(() => import('./panels/Error'));

const App = () => {
  const { path, appearance, Appearance, fetchCats } = useContext(GlobalContext);
  const [fetchedUser, setUser] = useState(null);

  const VKBridgeSubscribeHandler = ({ detail: { type, data } }) => {
    if (type === 'VKWebAppUpdateConfig') {
      Appearance(data.appearance);
    }
  };

  useEffect(() => {
    bridge.subscribe(VKBridgeSubscribeHandler);
    bridge.send('VKWebAppGetUserInfo').then(setUser);
    fetchCats();
    return () => bridge.unsubscribe(VKBridgeSubscribeHandler);
  }, []);

  return (
      <ConfigProvider appearance={appearance}>
        <AdaptivityProvider>
          <AppRoot>
            <SplitLayout>
              <SplitCol>
                <View activePanel={path}>
                  <Home id='home' fetchedUser={fetchedUser} />
                  <CatDetails id='catDetails' />
                  <RandomCat id='randomCat' />
                  <Error id='404' />
                </View>
              </SplitCol>
            </SplitLayout>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
  );
};

export default App;

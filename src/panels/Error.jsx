import React, {useEffect, useContext} from 'react';

import { Panel, Placeholder, Button } from '@vkontakte/vkui';
import { Icon56FileBrokenOutline } from '@vkontakte/icons';
import { GlobalContext } from "../context"

export default ({id}) => {
	const { go, index } = useContext(GlobalContext)

	return <Panel id={id}>
		<Placeholder
      icon={<Icon56FileBrokenOutline />}
      action={
        <Button stretched size="l" mode="secondary" onClick={()=>go(index)}>
          Вернуться на главную
        </Button>
      }
      stretched
    >
      Страница, которую Вы пытались <br/>
      открыть, не существует! Пожалуйста,<br/>
      вернитесь на главную страницу!
    </Placeholder>
	</Panel>
}
import React, { createContext, useContext, useEffect, useState } from 'react';

// Help from https://github.com/project-error/pe-utils
interface NuiMessageData<T = any> {
  action: string;
  data: T;
}

export const useNuiEvent = <T = any>(action: string, handler: (data: T) => void) => {
  const savedHandler = React.useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: MessageEvent<NuiMessageData<T>>) => {
      const { action: eventAction, data } = event.data;

      if (savedHandler.current && eventAction === action) {
        savedHandler.current(data);
      }
    };

    window.addEventListener('message', eventListener);
    return () => window.removeEventListener('message', eventListener);
  }, [action]);
};

export const fetchNui = async <T = any>(eventName: string, data?: any): Promise<T> => {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  const resourceName = (window as any).GetParentResourceName ? (window as any).GetParentResourceName() : 'nui-frame-app';

  const resp = await fetch(`https://${resourceName}/${eventName}`, options);

  const respFormatted = await resp.json();

  return respFormatted;
};

export const NuiContext = createContext<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
}>({
  visible: false,
  setVisible: () => {},
});

export const NuiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);

  useNuiEvent('setVisible', (data: boolean) => {
    setVisible(data);
  });

  return (
    <NuiContext.Provider value={{ visible, setVisible }}>
      <div className={visible ? 'visible' : ''} style={{ display: visible ? 'flex' : 'none', width: '100%', height: '100%' }}>
        {children}
      </div>
    </NuiContext.Provider>
  );
};

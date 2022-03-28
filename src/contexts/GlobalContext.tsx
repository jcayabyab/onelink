import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/router';

export interface IUser {
  username: String;
  password: String;
}

export interface GlobalContextInterface {
  user?: IUser | null;
  setUser: (user: IUser) => void;
}

export declare interface GlobalContextProviderProps {
  children: React.ReactNode;
}

export const GlobalContext = createContext<GlobalContextInterface>({
  setUser: () => {},
});

export const GlobalContextProvider = ({
  children,
}: GlobalContextProviderProps) => {
  const [user, setUserState] = useState<IUser | null>(null);
  const router = useRouter();

  const setUser = useCallback(
    (inputUser: IUser) => {
      setUserState(inputUser);
      localStorage.setItem('user', JSON.stringify(inputUser));
    },
    [setUserState]
  );

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem('user');

    if (router && userFromLocalStorage) {
      setUser(JSON.parse(userFromLocalStorage));
    } else {
      router.push('/login');
    }
  }, [setUser, router]);

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextInterface => {
  return useContext(GlobalContext);
};

import { createContext, useCallback, useContext, useState } from 'react';

interface IDrawerContextData{
    isOpen: boolean;
    drawerOptions: IDrawerOptions[];
    toggleOpen: () => void;
    setDrawerOptions: (newDrawerOptions: IDrawerOptions[]) => void;
}

interface IDrawerOptions{
    label: string;
    icon: string;
    path: string;
}

export const DrawerContext = createContext({} as IDrawerContextData);

export const useDrawerContext = () => {
	return useContext(DrawerContext);
};

interface IDrawerProviderProps{
    children: React.ReactNode;
}

export const DrawerProvider: React.FC<IDrawerProviderProps> = ({ children }) => {

	const [isOpen, setIsOpen] = useState(false);
	const [drawerOptions, setDrawerOptions] = useState<IDrawerOptions[]>([]);

	const toggleOpen = useCallback(() => {
		setIsOpen(oldOpen => !oldOpen);
	}, []);

	const handleSetDrawerOptions = useCallback((newDrawerOptions: IDrawerOptions[]) => {
		setDrawerOptions(newDrawerOptions);
	}, []);

	return (
		<DrawerContext.Provider value={{isOpen, drawerOptions, toggleOpen, setDrawerOptions: handleSetDrawerOptions }}>
			{children}
		</DrawerContext.Provider>
	);
};
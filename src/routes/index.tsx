import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard } from '../pages';
import { useDrawerContext } from '../shared/contexts';


export const AppRoutes = () => {

	const { setDrawerOptions } = useDrawerContext();

	useEffect(() => {
		setDrawerOptions([
			{
				label: 'Página Inicial',
				icon: 'home',
				path: '/pagina-inicial'
			}
		]);
	}, []);

	return(
		<Routes>
			<Route path='/pagina-inicial' element={<Dashboard />} />


			<Route path='*' element={<Navigate to='/pagina-inicial' />} />
		</Routes>
	);
};
import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard, ListagemCarteiras, ListagemCategorias, ListagemSubcategorias } from '../pages';
import { useDrawerContext } from '../shared/contexts';


export const AppRoutes = () => {

	const { setDrawerOptions } = useDrawerContext();

	useEffect(() => {
		setDrawerOptions([
			{
				label: 'Página Inicial',
				icon: 'home',
				path: '/pagina-inicial'
			},
			{
				label: 'Carteiras',
				icon: 'wallet',
				path: '/carteiras'
			},
			{
				label: 'Categorias',
				icon: 'category',
				path: '/categorias'
			},
			{
				label: 'Subcategorias',
				icon: 'device_hub',
				path: '/subcategorias'
			}
		]);
	}, []);

	return(
		<Routes>
			<Route path='/pagina-inicial' element={<Dashboard />} />
			<Route path='/carteiras' element={<ListagemCarteiras />} />
			<Route path='/categorias' element={<ListagemCategorias />} />
			<Route path='/subcategorias' element={<ListagemSubcategorias />} />


			<Route path='*' element={<Navigate to='/pagina-inicial' />} />
		</Routes>
	);
};
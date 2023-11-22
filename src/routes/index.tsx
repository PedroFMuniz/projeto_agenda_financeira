import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Dashboard, ListagemCarteiras, ListagemCategorias, ListagemSubcategorias, ListagemformasDePagamento, ListagemTitulos } from '../pages';
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
			},
			{
				label: 'Formas de pagamento',
				icon: 'money',
				path: '/formas-de-pagamento'
			},
			{
				label: 'Títulos',
				icon: 'title',
				path:'/titulos'
			}
		]);
	}, []);

	return(
		<Routes>
			<Route path='/pagina-inicial' element={<Dashboard />} />
			<Route path='/carteiras' element={<ListagemCarteiras />} />
			<Route path='/categorias' element={<ListagemCategorias />} />
			<Route path='/subcategorias' element={<ListagemSubcategorias />} />
			<Route path='/formas-de-pagamento' element={<ListagemformasDePagamento />} />
			<Route path='/titulos' element={<ListagemTitulos />} />


			<Route path='*' element={<Navigate to='/pagina-inicial' />} />
		</Routes>
	);
};
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FerramentasListagem } from '../../shared/components';
import { Environment } from '../../shared/environment';
import { useDebounce } from '../../shared/hooks';
import { LayoutBase } from '../../shared/layouts/LayoutBase';
import { CategoriasService, ICategoriaData } from '../../shared/services/categorias/CategoriasService';


export const ListagemCategorias:React.FC = () =>{

	const [searchParams, setSearchParams] = useSearchParams();

	const [categorias, setCategorias] = useState<ICategoriaData[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	const { debounce }= useDebounce();

	const navigate = useNavigate();

	const busca = useMemo(() => {
		return searchParams.get('busca') || '';
	}, [searchParams]);

	const pagina = useMemo(() => {
		return Number(searchParams.get('pagina') || '1');
	}, [searchParams]);
	
	useEffect(() => {
		debounce(() => {
			setIsLoading(true);

			CategoriasService.getAll(pagina, busca)
				.then((result) => {
					setIsLoading(false);
					if(result instanceof Error){
						alert(result.message);
					}else{
						setCategorias(result.data);
						setTotalCount(result.totalCount);
					}
				});
		});

	}, [busca, pagina]);

	const handleDelete = useCallback((id: number) => {
		setIsLoading(true);
		CategoriasService.deleteById(id)
			.then((result) =>{
				setIsLoading(false);
				if(result instanceof Error){
					alert(result.message);
				}else{
					setCategorias((oldCategorias) => ([...oldCategorias.filter(
						categoria => categoria.id !== id
					)]));
				}
			});
	}, []);

	return(
		<LayoutBase
			title='Listagem de categorias'
			toolBar={<FerramentasListagem 
				mostrarInputBusca
				textoBotaoNovo='Nova'
				textoInputBusca={busca}
				onChangeInputBusca={(e) => setSearchParams({busca: e, pagina: '1'}, {replace: true})}
				onCLickBotaoNovo={() => navigate('/categorias/detalhe/nova')}
			/>}
		>
			<TableContainer component={Paper} variant='outlined' sx={{m: 1, width: 'auto'}}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell width={100}>Ações</TableCell>
							<TableCell width={150}>Tipo</TableCell>
							<TableCell>Nome da categoria</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{categorias.map(
							categoria => (
								<TableRow
									key={categoria.id}
								>
									<TableCell>
										<IconButton
											size='small'
											onClick={() => navigate(`/categorias/detalhe/${categoria.id}`)}
										>
											<Icon>edit</Icon>
										</IconButton>
										<IconButton
											size='small'
											onClick={() => handleDelete(categoria.id)}
										>
											<Icon>delete</Icon>
										</IconButton>
									</TableCell>
									<TableCell>{categoria.tipo}</TableCell>
									<TableCell>{categoria.nome}</TableCell>
								</TableRow>
							)
						)}
					</TableBody>
					{
						(!isLoading && totalCount === 0) && (
							<caption>Não há registros.</caption>
						)
					}
					<TableFooter>
						{isLoading && (
							<TableRow>
								<TableCell colSpan={2}>
									<LinearProgress variant='indeterminate' />
								</TableCell>
							</TableRow>
						)}
						{(!isLoading && totalCount > 0) && (
							<TableRow>
								<TableCell colSpan={3}>
									<Pagination 
										count={Math.ceil(totalCount/Environment.LIMITE_DE_LINHAS)}
										page={pagina}
										onChange={(_, e) => setSearchParams({busca: busca, pagina: String(e)}, {replace: true})}
									/>
								</TableCell>
							</TableRow>
						)}
					</TableFooter>
				</Table>
			</TableContainer>
		</LayoutBase>
	);
};
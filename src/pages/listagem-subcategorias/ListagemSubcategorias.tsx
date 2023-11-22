import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FerramentasListagem } from '../../shared/components';
import { Environment } from '../../shared/environment';
import { useDebounce } from '../../shared/hooks';
import { LayoutBase } from '../../shared/layouts/LayoutBase';
import { CategoriasService, ICategoriaData } from '../../shared/services/categorias/CategoriasService';
import { SubcategoriasService, ISubcategoriaData } from '../../shared/services/subcategorias/SubcategoriasService';

export const ListagemSubcategorias:React.FC = () =>{

	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));
	const mdDown = useMediaQuery(theme.breakpoints.down('md'));

	const [searchParams, setSearchParams] = useSearchParams();

	const [subcategorias, setSubcategorias] = useState<ISubcategoriaData[]>([]);
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
		setIsLoading(true);

		CategoriasService.getAll(pagina, busca)
			.then((result) =>{
				if(result instanceof Error){
					alert(result.message);
				}else{
					setIsLoading(false);
					setCategorias(result.data);
				}
			});
	}, []);
	
	useEffect(() => {
		debounce(() => {
			setIsLoading(true);

			SubcategoriasService.getAll(pagina, busca)
				.then((result) => {
					setIsLoading(false);
					if(result instanceof Error){
						alert(result.message);
					}else{
						setSubcategorias(result.data);
						setTotalCount(result.totalCount);
					}
				});
		});

	}, [busca, pagina]);

	const handleDelete = useCallback((id: number) => {
		setIsLoading(true);
		SubcategoriasService.deleteById(id)
			.then((result) =>{
				setIsLoading(false);
				if(result instanceof Error){
					alert(result.message);
				}else{
					setSubcategorias((oldSubcategorias) => ([...oldSubcategorias.filter(
						subcategoria => subcategoria.id !== id
					)]));
				}
			});
	}, []);

	return(
		<LayoutBase
			title='Subcategorias'
			toolBar={<FerramentasListagem 
				mostrarInputBusca
				textoBotaoNovo='Nova'
				textoInputBusca={busca}
				onChangeInputBusca={(e) => setSearchParams({busca: e, pagina: '1'}, {replace: true})}
				onCLickBotaoNovo={() => navigate('/subcategorias/detalhe/nova')}
			/>}
		>
			<TableContainer component={Paper} variant='outlined' sx={{m: 1, width: 'auto'}}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell width={theme.spacing(10)}>Ações</TableCell>
							<TableCell>Categoria</TableCell>
							<TableCell>Nome</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{subcategorias.map(
							subcategoria => (
								<TableRow
									key={subcategoria.id}
								>
									<TableCell>
										<IconButton
											size='small'
											onClick={() => navigate(`/subcategorias/detalhe/${subcategoria.id}`)}
										>
											<Icon>edit</Icon>
										</IconButton>
										<IconButton
											size='small'
											onClick={() => handleDelete(subcategoria.id)}
										>
											<Icon>delete</Icon>
										</IconButton>
									</TableCell>
									<TableCell><Typography width={smDown ? theme.spacing(9) : (mdDown ? theme.spacing(20) : undefined)} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>{categorias.find(categoria => categoria.id === subcategoria.categoriaId)?.nome}</Typography></TableCell>
									<TableCell><Typography width={smDown ? theme.spacing(15) : (mdDown ? theme.spacing(30) : undefined)} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>{subcategoria.nome}</Typography></TableCell>
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
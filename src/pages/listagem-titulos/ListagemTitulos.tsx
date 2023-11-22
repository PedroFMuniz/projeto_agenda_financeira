import { useCallback, useEffect, useMemo, useState } from 'react';
import { Collapse, Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dayjs } from 'dayjs';

import { ISubcategoriaData, SubcategoriasService } from '../../shared/services/subcategorias/SubcategoriasService';
import { CategoriasService, ICategoriaData } from '../../shared/services/categorias/CategoriasService';
import { IListagemTitulo, TitulosService } from '../../shared/services/titulos/TitulosService';
import { IContaData } from '../../shared/services/contas/ContasService';
import { FerramentasListagem } from '../../shared/components';
import { LayoutBase } from '../../shared/layouts/LayoutBase';
import { Environment } from '../../shared/environment';
import { useDebounce } from '../../shared/hooks';

interface IRowProps {
	titulo: IListagemTitulo,
	categorias: ICategoriaData[],
	subcategorias: ISubcategoriaData[],
	contas: IContaData[],
	onClickDelete: (id: number) => void,
	onClickEdit: (id: number) => void,
}
const Row: React.FC<IRowProps> = ({ titulo: { id, subcategoriaId, contaId, valor, descricao, vencimento, pago }, categorias, subcategorias, contas, onClickEdit, onClickDelete }) => {

	const [open, setOpen] = useState(false);

	const subcategoria = subcategorias.find(subcategoria => subcategoria.id === subcategoriaId);
	const categoria = categorias.find(categoria => categoria.id === subcategoria?.categoriaId);
	const conta = contas.find(conta => conta.id === contaId);

	return (
		<>
			<TableRow>
				<TableCell>
					<IconButton
						size='small'
						onClick={() => setOpen(!open)}
					>
						{open ? (<Icon>keyboard_arrow_up</Icon>) : (<Icon>keyboard_arrow_down</Icon>)}
					</IconButton>
				</TableCell>
				<TableCell>
					<IconButton
						size='small'
						onClick={() => onClickEdit(id)}
					>
						<Icon>edit</Icon>
					</IconButton>
					<IconButton
						size='small'
						onClick={() => onClickDelete(id)}
					>
						<Icon>delete</Icon>
					</IconButton>
				</TableCell>
				<TableCell><Typography variant='body1'>{subcategoria?.nome}</Typography></TableCell>
				<TableCell><Typography variant='body1'>{'R$ ' + valor.toFixed(2)}</Typography></TableCell>
				<TableCell><Typography variant='body1'>{vencimento.format('DD/MM/YYYY')}</Typography></TableCell>
			</TableRow>
			<TableRow>
				<TableCell colSpan={5}>
					<Collapse
						in={open}
						timeout='auto'
						unmountOnExit
					>
						<TableContainer>
							<Table size='small'>
								<TableHead>
									<TableRow>
										<TableCell><Typography variant='body1'>Categoria</Typography></TableCell>
										<TableCell><Typography variant='body1'>Conta</Typography></TableCell>
										<TableCell><Typography variant='body1'>Pago</Typography></TableCell>
										<TableCell><Typography variant='body1'>Descrição</Typography></TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
									<TableCell><Typography variant='body1'>{categoria?.nome}</Typography></TableCell>
									<TableCell><Typography variant='body1'>{conta?.nome}</Typography></TableCell>
									<TableCell><Typography variant='body1'>Categoria</Typography></TableCell>
									<TableCell><Typography variant='body1'>Categoria</Typography></TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};

export const ListagemTitulos: React.FC = () => {

	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));
	const mdDown = useMediaQuery(theme.breakpoints.down('md'));

	const [searchParams, setSearchParams] = useSearchParams();

	const [titulos, setTitulos] = useState<IListagemTitulo[]>([]);
	const [categorias, setCategorias] = useState<ICategoriaData[]>([]);
	const [subcategorias, setSubcategorias] = useState<ISubcategoriaData[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	const { debounce } = useDebounce();

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
			.then((result) => {
				if (result instanceof Error) {
					alert(result.message);
				} else {
					setIsLoading(false);
					setCategorias(result.data);
				}
			});
	}, []);

	useEffect(() => {
		setIsLoading(true);

		SubcategoriasService.getAll(pagina, busca)
			.then((result) => {
				if (result instanceof Error) {
					alert(result.message);
				} else {
					setIsLoading(false);
					setSubcategorias(result.data);
				}
			});
	}, []);

	useEffect(() => {
		debounce(() => {
			setIsLoading(true);

			TitulosService.getAll(pagina, busca)
				.then((result) => {
					setIsLoading(false);
					if (result instanceof Error) {
						alert(result.message);
					} else {
						setTitulos(result.data);
						setTotalCount(result.totalCount);
					}
				});
		});

	}, [busca, pagina]);

	const handleDelete = useCallback((id: number) => {
		setIsLoading(true);
		TitulosService.deleteById(id)
			.then((result) => {
				setIsLoading(false);
				if (result instanceof Error) {
					alert(result.message);
				} else {
					setTitulos((oldTitulos) => ([...oldTitulos.filter(
						titulo => titulo.id !== id
					)]));
				}
			});
	}, []);

	return (
		<LayoutBase
			title='Titulos'
			toolBar={<FerramentasListagem
				mostrarInputBusca
				textoBotaoNovo='Nova'
				textoInputBusca={busca}
				onChangeInputBusca={(e) => setSearchParams({ busca: e, pagina: '1' }, { replace: true })}
				onCLickBotaoNovo={() => navigate('/titulos/detalhe/nova')}
			/>}
		>
			<TableContainer component={Paper} variant='outlined' sx={{ m: 1, width: 'auto' }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell width={theme.spacing(10)}>Ações</TableCell>
							{!smDown && (<TableCell>Categoria</TableCell>)}
							<TableCell>Subcategoria</TableCell>
							<TableCell>Valor</TableCell>
							<TableCell>Pago</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{titulos.map(
							titulo => (
								<TableRow
									key={titulo.id}
								>

								</TableCell>
									{!smDown && (<TableCell><Typography width={smDown ? theme.spacing(9) : (mdDown ? theme.spacing(20) : undefined)} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>{categorias.find(categoria => categoria.id === (subcategorias.find(subcategoria => subcategoria.id === titulo.subcategoriaId)?.categoriaId))?.nome}</Typography></TableCell>)}
						<TableCell><Typography width={smDown ? theme.spacing(9) : (mdDown ? theme.spacing(20) : undefined)} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>{subcategorias.find(subcategoria => subcategoria.id === titulo.subcategoriaId)?.nome}</Typography></TableCell>
						<TableCell><Typography width={smDown ? theme.spacing(15) : (mdDown ? theme.spacing(30) : undefined)} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>{'R$' + titulo.valor.toFixed(2)}</Typography></TableCell>
						<TableCell>{smDown ? (<Icon color={titulo.pago ? 'success' : 'error'} fontSize='small'>circle</Icon>) : (titulo.pago ? 'Sim' : 'Não')}</TableCell>
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
									count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
									page={pagina}
									onChange={(_, e) => setSearchParams({ busca: busca, pagina: String(e) }, { replace: true })}
								/>
							</TableCell>
						</TableRow>
					)}
				</TableFooter>
			</Table>
		</TableContainer>
		</LayoutBase >
	);
};
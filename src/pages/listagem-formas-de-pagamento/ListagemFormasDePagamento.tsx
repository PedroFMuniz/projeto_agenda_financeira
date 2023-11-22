import { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FormasDePagamentoService, IListagemFormaDePagamento } from '../../shared/services/formas-de-pagamento/FormasDePagamentoService';
import { FerramentasListagem } from '../../shared/components';
import { LayoutBase } from '../../shared/layouts/LayoutBase';
import { Environment } from '../../shared/environment';
import { useDebounce } from '../../shared/hooks';


export const ListagemformasDePagamento:React.FC = () =>{

	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));
	const mdDown = useMediaQuery(theme.breakpoints.down('md'));

	const [searchParams, setSearchParams] = useSearchParams();

	const [formasDePagamento, setformasDePagamento] = useState<IListagemFormaDePagamento[]>([]);
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

			FormasDePagamentoService.getAll(pagina, busca)
				.then((result) => {
					setIsLoading(false);
					if(result instanceof Error){
						alert(result.message);
					}else{
						setformasDePagamento(result.data);
						setTotalCount(result.totalCount);
					}
				});
		});

	}, [busca, pagina]);

	const handleDelete = useCallback((id: number) => {
		setIsLoading(true);
		FormasDePagamentoService.deleteById(id)
			.then((result) =>{
				setIsLoading(false);
				if(result instanceof Error){
					alert(result.message);
				}else{
					setformasDePagamento((oldformasDePagamento) => ([...oldformasDePagamento.filter(
						categoria => categoria.id !== id
					)]));
				}
			});
	}, []);

	return(
		<LayoutBase
			title='Formas De Pagamento'
			toolBar={<FerramentasListagem 
				mostrarInputBusca
				textoBotaoNovo='Nova'
				textoInputBusca={busca}
				onChangeInputBusca={(e) => setSearchParams({busca: e, pagina: '1'}, {replace: true})}
				onCLickBotaoNovo={() => navigate('/formasDePagamento/detalhe/nova')}
			/>}
		>
			<TableContainer component={Paper} variant='outlined' sx={{m: 1, width: 'auto'}}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell width={theme.spacing(10)}>Ações</TableCell>
							<TableCell>Tipo</TableCell>
							<TableCell>Nome</TableCell>
							{!smDown && (<TableCell>Parcelada?</TableCell>)}
							{!smDown && (<TableCell>Intervalo para recebimento</TableCell>)}
						</TableRow>
					</TableHead>
					<TableBody>
						{formasDePagamento.map(
							formaDePagamento => (
								<TableRow
									key={formaDePagamento.id}
								>
									<TableCell>
										<IconButton
											size='small'
											onClick={() => navigate(`/formasDePagamento/detalhe/${formaDePagamento.id}`)}
										>
											<Icon>edit</Icon>
										</IconButton>
										<IconButton
											size='small'
											onClick={() => handleDelete(formaDePagamento.id)}
										>
											<Icon>delete</Icon>
										</IconButton>
									</TableCell>
									<TableCell>{smDown ? (<Icon fontSize='small' color={formaDePagamento.tipo === 'Entrada' ? 'success' : 'error'}>circle</Icon>) : formaDePagamento.tipo}</TableCell>
									<TableCell><Typography  width={smDown ? theme.spacing(20) : (mdDown ? theme.spacing(40) : undefined)} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>{formaDePagamento.nome}</Typography></TableCell>
									{!smDown && (<TableCell>{formaDePagamento.parcelado ? 'Sim' : 'Não'}</TableCell>)}
									{!smDown && (<TableCell>{formaDePagamento.recebimento + ' dias'}</TableCell>)}
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
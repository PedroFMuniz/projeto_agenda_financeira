import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FerramentasListagem } from '../../shared/components';
import { Environment } from '../../shared/environment';
import { useDebounce } from '../../shared/hooks';
import { LayoutBase } from '../../shared/layouts/LayoutBase';
import { CarteirasService, ICarteiraData } from '../../shared/services/carteiras/CarteirasService';


export const ListagemCarteiras:React.FC = () =>{

	const [searchParams, setSearchParams] = useSearchParams();

	const [carteiras, setCarteiras] = useState<ICarteiraData[]>([]);
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

			CarteirasService.getAll(pagina, busca)
				.then((result) => {
					setIsLoading(false);
					if(result instanceof Error){
						alert(result.message);
					}else{
						setCarteiras(result.data);
						setTotalCount(result.totalCount);
					}
				});
		});

	}, [busca, pagina]);

	const handleDelete = useCallback((id: number) => {
		setIsLoading(true);
		CarteirasService.deleteById(id)
			.then((result) =>{
				setIsLoading(false);
				if(result instanceof Error){
					alert(result.message);
				}else{
					setCarteiras((oldCarteiras) => ([...oldCarteiras.filter(
						carteira => carteira.id !== id
					)]));
				}
			});
	}, []);

	return(
		<LayoutBase
			title='Listagem de carteiras'
			toolBar={<FerramentasListagem 
				mostrarInputBusca
				textoBotaoNovo='Nova'
				textoInputBusca={busca}
				onChangeInputBusca={(e) => setSearchParams({busca: e, pagina: '1'}, {replace: true})}
				onCLickBotaoNovo={() => navigate('/carteiras/detalhe/nova')}
			/>}
		>
			<TableContainer component={Paper} variant='outlined' sx={{m: 1, width: 'auto'}}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell width={100}>Ações</TableCell>
							<TableCell>Nome da carteira</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{carteiras.map(
							carteira => (
								<TableRow
									key={carteira.id}
								>
									<TableCell>
										<IconButton
											size='small'
											onClick={() => navigate(`/carteiras/detalhe/${carteira.id}`)}
										>
											<Icon>edit</Icon>
										</IconButton>
										<IconButton
											size='small'
											onClick={() => handleDelete(carteira.id)}
										>
											<Icon>delete</Icon>
										</IconButton>
									</TableCell>
									<TableCell>{carteira.nome}</TableCell>
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
								<TableCell colSpan={2}>
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
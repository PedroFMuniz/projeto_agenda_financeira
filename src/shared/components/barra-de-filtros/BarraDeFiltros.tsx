import { Accordion, AccordionActions, AccordionSummary, Box, Button, Grid, Icon, Typography, useMediaQuery, useTheme } from '@mui/material';

interface IBarraDeFiltros{
    filtros: React.ReactNode[];
}
export const BarraDeFiltros: React.FC<IBarraDeFiltros> = ({ filtros }) =>{

	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));

	return(
		<Box
			marginX={1}
		>
			<Accordion>
				<AccordionSummary
					expandIcon={<Icon>expand_more</Icon>}
				>
					<Box
						display='flex'
						alignItems='center'
					>
						<Icon>filter_alt</Icon>
						<Typography variant='button'>
                    Filtros
						</Typography>
					</Box>
				</AccordionSummary>
				<AccordionActions>
					<Grid container>
						<Grid item container 
							spacing={1} 
							marginX={smDown ? theme.spacing(2) : undefined} 
							marginRight={!smDown ? theme.spacing(5) : undefined} 
							alignItems={!smDown ? 'center' : ''}>
							{filtros.map(
								(filtro, index) => (
									<Grid key={index} item xs={12} sm={4} xl={3}>
										{filtro}
									</Grid>
								)
							)}
							<Grid item flex={1}>
								<Box display='flex' justifyContent='flex-end'>
									<Button>Filtrar</Button>
								</Box>
							</Grid>
						</Grid>
					</Grid>
				</AccordionActions>
			</Accordion>
		</Box>
	);
};
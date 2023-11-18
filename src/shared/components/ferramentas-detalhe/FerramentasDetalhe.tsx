import { Box, Button, Divider, Icon, Paper, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography, useMediaQuery, useTheme } from '@mui/material';


interface IFerramentasDetalhe{
    mostrarBotaoSalvar?: boolean;
    mostrarBotaoDeletar?: boolean;
    mostrarBotaoVoltar?: boolean;

    onClickBotaoSalvar?: () => void;
    onClickBotaoDeletar?: () => void;
    onClickBotaoVoltar?: () => void;
}
export const FerramentasDetalhe: React.FC<IFerramentasDetalhe> = ({
	mostrarBotaoSalvar = true,
	mostrarBotaoDeletar = true,
	mostrarBotaoVoltar = true,

	onClickBotaoSalvar,
	onClickBotaoDeletar,
	onClickBotaoVoltar,
}) => {

	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));

	if(!smDown){
		return(
			<Box
				component={Paper}
				marginX={1}
				padding={1}
				paddingX={2}
				display='flex'
				alignItems='center'
				gap={1}
				height={theme.spacing(5)}
			>
				{mostrarBotaoSalvar && (
					<Button
						variant='contained'
						disableElevation
						startIcon={<Icon>save</Icon>}
						onClick={onClickBotaoSalvar}
					>
						<Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
							Salvar
						</Typography>
					</Button>
				)}
				{mostrarBotaoDeletar && (
					<Button
						variant='outlined'
						disableElevation
						startIcon={<Icon>delete</Icon>}
						onClick={onClickBotaoDeletar}
					>
						<Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
							Deletar
						</Typography>
					</Button>
				)}
				<Divider variant='middle' orientation='vertical' />
				{mostrarBotaoVoltar && (
					<Button
						variant='outlined'
						disableElevation
						startIcon={<Icon>arrow_back</Icon>}
						onClick={onClickBotaoVoltar}
					>
						<Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
							Voltar
						</Typography>
					</Button>
				)}
			</Box>
		);
	}

	return(
		<SpeedDial
			ariaLabel='SpeedDial'
			sx={{ position: 'absolute', bottom: 16, right: 16 }}
			icon={<SpeedDialIcon />}
		>
			<SpeedDialAction
				icon={<Icon>arrow_back</Icon>}
				onClick={onClickBotaoVoltar}
			/>
			<SpeedDialAction
				icon={<Icon>delete</Icon>}
				onClick={onClickBotaoDeletar}
			/>
			<SpeedDialAction
				icon={<Icon>save</Icon>}
				onClick={onClickBotaoSalvar}
			/>
		</SpeedDial>
	);
};
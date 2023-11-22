import { Box, Button, Icon, Paper, TextField, useTheme } from '@mui/material';

import { Environment } from '../../environment';


interface IFerramentasListagem{
    textoBotaoNovo?: string;

    mostrarBotaoNovo?: boolean;
    mostrarInputBusca?: boolean;

    textoInputBusca?: string;
    onChangeInputBusca?: (newValue: string) => void;

    onCLickBotaoNovo?: () => void;
}
export const FerramentasListagem:React.FC<IFerramentasListagem> = ({
	textoBotaoNovo = 'Novo',

	mostrarBotaoNovo = true,
	mostrarInputBusca = false,

	textoInputBusca = '',

	onCLickBotaoNovo,
	onChangeInputBusca
}) =>{

	const theme = useTheme();

	return (
		<Box 
			component={Paper}
			display='flex'
			alignContent='center'
			justifyContent='space-between'
			marginX={1}
			padding={1}
			paddingX={2}
			height={theme.spacing(5)}
		>
			{mostrarInputBusca && (
				<TextField 
					placeholder={Environment.INPUT_DE_BUSCA}
					value={textoInputBusca}
					onChange={(e) => onChangeInputBusca?.(e.target.value)}

					size='small'
				/>)}

			{mostrarBotaoNovo && (
				<Button
					startIcon={<Icon>add</Icon>}
					onClick={onCLickBotaoNovo}
					variant='contained'
					disableElevation
				>
					{textoBotaoNovo}
				</Button>)}
		</Box>
	);
};
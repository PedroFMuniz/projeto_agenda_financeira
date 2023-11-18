import { Box, Icon, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useDrawerContext } from '../contexts';


interface ILayoutBase{
    title: string,
    toolBar?: React.ReactNode;
    filterBar?: React.ReactNode;
    children: React.ReactNode;
}
export const LayoutBase: React.FC<ILayoutBase> = ({ children, title, filterBar, toolBar }) =>{
	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));
	const mdDown = useMediaQuery(theme.breakpoints.down('md'));

	const {toggleOpen} = useDrawerContext();

	return (
		<Box height="100%" display="flex" flexDirection="column" gap={1}>
			<Box padding={1} height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)} display='flex' alignItems='center' gap={3}>

				{smDown && (
					<IconButton onClick={toggleOpen}>
						<Icon>menu</Icon>
					</IconButton>
				)}

				<Typography 
					variant={smDown ? 'h5' : mdDown ? 'h4' : 'h3'} 
					component='h1'
					whiteSpace='nowrap'
					overflow='hidden'
					textOverflow='ellipsis'
				>
					{title}
				</Typography>
			</Box>

			{toolBar && (
				<Box>
					{toolBar}
				</Box>
			)}

			{filterBar && (
				<Box>
					{filterBar}
				</Box>
			)}

			<Box flex={1} overflow='auto'>
				{children}
			</Box>

		</Box>
	);
};
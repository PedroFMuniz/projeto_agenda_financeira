import { Drawer, Box, useTheme, useMediaQuery, ListItemButton, ListItemIcon, Icon, ListItemText, List, Divider } from '@mui/material';
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom';
import { useDrawerContext } from '../../contexts';

interface IItemLinkProps{
	label: string;
	icon: string;
	to: string;
	onClick: (() => void) | undefined;
}

const ItemLink: React.FC<IItemLinkProps> = ({ label, icon, to, onClick }) => {

	const navigate = useNavigate();

	const resolvedPath = useResolvedPath(to);
	const match = useMatch({path: resolvedPath.pathname, end: false});

	const handleClick = () => {
		navigate(to);
		onClick?.();
	};

	return (
		<ListItemButton onClick={handleClick} selected={!!match}>
			<ListItemIcon>
				<Icon>{icon}</Icon>
			</ListItemIcon>
			<ListItemText primary={label}/>
		</ListItemButton>
	);
};

interface IMenuLateralProps{
    children: React.ReactNode;
}

export const MenuLateral: React.FC<IMenuLateralProps> = ({ children }) => {

	const theme = useTheme();
	const smDown = useMediaQuery(theme.breakpoints.down('sm'));

	const { isOpen, toggleOpen, drawerOptions } = useDrawerContext();

	return(
		<>
			<Drawer 
				variant={smDown ? 'temporary' : 'permanent'} 
				open={isOpen} 
				onClose={toggleOpen}
			>
				<Box height='100%' width={theme.spacing(28)} display='flex' flexDirection='column'>
					<Box width='100%' height={theme.spacing(20)} display='flex' alignItems='center' justifyContent='center'>
						<img 
							src={require('../../../assets/logo.png')}
							alt='Logo Irene Bellus'
							width={theme.spacing(15)}
							height={theme.spacing(15)}
						/>
					</Box>

					<Divider />

					<Box flex={1}>
						<List component='nav'>
							{drawerOptions.map(drawerOption => (
								<ItemLink 
									key={drawerOption.path}
									label={drawerOption.label}
									icon={drawerOption.icon}
									to={drawerOption.path}
									onClick={smDown ? toggleOpen : undefined}
								/>
							))}
						</List>
					</Box>
				</Box>
			</Drawer>
			<Box height='100vh' marginLeft={smDown ? 0 : theme.spacing(28)}>
				{children}
			</Box>
		</>
	);
};
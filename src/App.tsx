/* eslint-disable linebreak-style */

import { Box, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import { MenuLateral } from './shared/components/menu-lateral/MenuLateral';
import { DrawerProvider } from './shared/contexts';
import { DefaultTheme } from './shared/themes';
import { AppRoutes } from './routes';


export const App = () => {
	return (
		<ThemeProvider theme={DefaultTheme}>
			<Box width='100vw' height='100vh' bgcolor={DefaultTheme.palette.background.default}>
				<DrawerProvider>
					<BrowserRouter>
						<MenuLateral>
							<AppRoutes />
						</MenuLateral>
					</BrowserRouter>
				</DrawerProvider>
			</Box>
		</ThemeProvider>
	);
};


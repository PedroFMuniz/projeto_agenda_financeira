import { createTheme } from '@mui/material';
import { blue, cyan, green, red } from '@mui/material/colors';

export const DefaultTheme = createTheme({
	palette: {
		primary: {
			main: blue[700],
			dark: blue[800],
			light: blue[500],
			contrastText: '#ffffff',
		},
		secondary: {
			main: cyan[700],
			dark: cyan[800],
			light: cyan[500],
			contrastText: '#ffffff',
		},
		background: {
			default: '#f7f6f3',
			paper: '#ffffff',
		},
		success: {
			main: green[700],
		},
		error: {
			main: red[700],
		}
	}
});
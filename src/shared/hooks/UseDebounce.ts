import { useRef } from 'react';
import { useCallback } from 'react';


export const useDebounce = (delay = 300, notDelayInFirstTime = true) =>{

	const debouncing = useRef<NodeJS.Timeout>();
	const isFirstTime = useRef(notDelayInFirstTime);

	if(debouncing.current){
		clearTimeout(debouncing.current);
	}

	const debounce = useCallback((func: () => void) => {
		if(isFirstTime.current){
			isFirstTime.current = false;
			func();
		}else{
			debouncing.current = setTimeout(() => func(), delay);
		}
	}, [delay]);


	return { debounce };
};
import { Environment } from '../../environment';
import { Api } from '../api/axios-config';


export interface ICarteiraData{
	id: number,
	nome: string,
}

type TCarteirasETotalCount = {
	data: ICarteiraData[],
	totalCount: number,
}

const getAll = async(page = 1, filter = ''): Promise<TCarteirasETotalCount | Error> => {
	try{
		const { data, headers } = await Api.get(`/carteiras?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nomeCompleto_like=${filter}`);

		if(data){
			return{
				data: data,
				totalCount: Number(headers['x-total-count']),
			};
		}

		return new Error('Erro ao listar os registros.');
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao listar os registros.');
	}
};

const getById = async(id: number): Promise<ICarteiraData | Error> => {
	try{
		const { data } = await Api.get(`/carteiras/${id}`);

		if(data){
			return data;
		}

		return new Error('Erro ao listar o registro.');
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao listar os registros.');
	}
};

const create = async(dados: Omit<ICarteiraData, 'id'>): Promise<number | Error> => {
	try{
		const { data } = await Api.post('/carteiras', dados);

		if(data){
			return data;
		}

		return new Error('Erro ao criar o registro.');
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
	}
};

const updateById = async(dados: ICarteiraData): Promise<void | Error> => {
	try{
		await Api.put(`/carteiras/${dados.id}`, dados);
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
	}
};

const deleteById = async(id: number): Promise<void | Error> => {
	try{
		await Api.delete(`/carteiras/${id}`);
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao deletar o registro.');
	}
};

export const CarteirasService = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
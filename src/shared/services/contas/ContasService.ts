import { Environment } from '../../environment';
import { Api } from '../api/axios-config';


export interface IContaData{
	id: number,
	nome: string,
}

type TContasETotalCount = {
	data: IContaData[],
	totalCount: number,
}

const getAll = async(page = 1, filter = ''): Promise<TContasETotalCount | Error> => {
	try{

		const { data, headers } = await Api.get( `/contas?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nomeCompleto_like=${filter}`);

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

const getById = async(id: number): Promise<IContaData | Error> => {
	try{
		const { data } = await Api.get(`/contas/${id}`);

		if(data){
			return data;
		}

		return new Error('Erro ao listar o registro.');
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao listar os registros.');
	}
};

const create = async(dados: Omit<IContaData, 'id'>): Promise<number | Error> => {
	try{
		const { data } = await Api.post('/contas', dados);

		if(data){
			return data;
		}

		return new Error('Erro ao criar o registro.');
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
	}
};

const updateById = async(dados: IContaData): Promise<void | Error> => {
	try{
		await Api.put(`/contas/${dados.id}`, dados);
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
	}
};

const deleteById = async(id: number): Promise<void | Error> => {
	try{
		await Api.delete(`/contas/${id}`);
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao deletar o registro.');
	}
};

export const ContasService = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
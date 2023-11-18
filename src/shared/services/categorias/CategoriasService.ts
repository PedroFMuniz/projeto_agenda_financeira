import { Environment } from '../../environment';
import { Api } from '../api/axios-config';


export interface ICategoriaData{
	id: number,
	nome: string,
	carteiraId: number,
	tipo: 'Entrada' | 'Saida',
}

type TCategoriasETotalCount = {
	data: ICategoriaData[],
	totalCount: number,
}

const getAll = async(page = 1, filter = '', carteiraId?: number, tipo?: 'Entrada' | 'Saida'): Promise<TCategoriasETotalCount | Error> => {
	try{
		const filtro = carteiraId ? `carteiraId=${carteiraId}` : '' + tipo ? `&tipo=${tipo}` : '';

		const { data, headers } = await Api.get( `/categorias?${filtro}_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nomeCompleto_like=${filter}`);

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

const getById = async(id: number): Promise<ICategoriaData | Error> => {
	try{
		const { data } = await Api.get(`/categorias/${id}`);

		if(data){
			return data;
		}

		return new Error('Erro ao listar o registro.');
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao listar os registros.');
	}
};

const create = async(dados: Omit<ICategoriaData, 'id'>): Promise<number | Error> => {
	try{
		const { data } = await Api.post('/categorias', dados);

		if(data){
			return data;
		}

		return new Error('Erro ao criar o registro.');
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
	}
};

const updateById = async(dados: ICategoriaData): Promise<void | Error> => {
	try{
		await Api.put(`/categorias/${dados.id}`, dados);
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
	}
};

const deleteById = async(id: number): Promise<void | Error> => {
	try{
		await Api.delete(`/categorias/${id}`);
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao deletar o registro.');
	}
};

export const CategoriasService = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
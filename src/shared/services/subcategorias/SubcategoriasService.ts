import { Environment } from '../../environment';
import { Api } from '../api/axios-config';


export interface ISubcategoriaData{
	id: number,
	nome: string,
	categoriaId: number,
}

type TSubcategoriasETotalCount = {
	data: ISubcategoriaData[],
	totalCount: number,
}

const getAll = async(page = 1, filter = '', categoriaId?: number): Promise<TSubcategoriasETotalCount | Error> => {
	try{
		const filtro = categoriaId ? `categoriaId=${categoriaId}` : '';

		const { data, headers } = await Api.get( `/subcategorias?${filtro}_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`);

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

const getById = async(id: number): Promise<ISubcategoriaData | Error> => {
	try{
		const { data } = await Api.get(`/subcategorias/${id}`);

		if(data){
			return data;
		}

		return new Error('Erro ao listar o registro.');
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao listar os registros.');
	}
};

const create = async(dados: Omit<ISubcategoriaData, 'id'>): Promise<number | Error> => {
	try{
		const { data } = await Api.post('/subcategorias', dados);

		if(data){
			return data;
		}

		return new Error('Erro ao criar o registro.');
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
	}
};

const updateById = async(dados: ISubcategoriaData): Promise<void | Error> => {
	try{
		await Api.put(`/subcategorias/${dados.id}`, dados);
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
	}
};

const deleteById = async(id: number): Promise<void | Error> => {
	try{
		await Api.delete(`/subcategorias/${id}`);
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao deletar o registro.');
	}
};

export const SubcategoriasService = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
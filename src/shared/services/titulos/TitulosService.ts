import { Dayjs } from 'dayjs';
import { Environment } from '../../environment';
import { Api } from '../api/axios-config';


export interface IListagemTitulo{
	id: number,
	subcategoriaId: number,
	contaId: number,
	valor: number,
	descricao: string,
	vencimento: Dayjs,
	pago: boolean
}

export interface IDetalheTitulo{
	id: number,
    contaId: number,
	paiId: number | null,
	parcelas: number,
	subcategoriaId: number,
	valor: number,
	descricao: string,
	formaDePagamentoId: number,
	vencimento: Dayjs,
	pago: boolean
}

type TTitulosETotalCount = {
	data: IListagemTitulo[],
	totalCount: number,
}

const getAll = async(page = 1, filter = '', subcategoriaId?: number, contaId?: number): Promise<TTitulosETotalCount | Error> => {
	try{
		const filtro = subcategoriaId ? `subcategoriaId=${subcategoriaId}&` : '' + (contaId ? `contaId=${contaId}&` : '');

		const { data, headers } = await Api.get( `/titulos?${filtro}_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&descricao_like=${filter}`);

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

const getById = async(id: number): Promise<IDetalheTitulo | Error> => {
	try{
		const { data } = await Api.get(`/titulos/${id}`);

		if(data){
			return data;
		}

		return new Error('Erro ao listar o registro.');
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao listar os registros.');
	}
};

const create = async(dados: Omit<IDetalheTitulo, 'id'>): Promise<number | Error> => {
	try{
		const { data } = await Api.post('/titulos', dados);

		if(data){
			return data;
		}

		return new Error('Erro ao criar o registro.');
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
	}
};

const updateById = async(dados: IDetalheTitulo): Promise<void | Error> => {
	try{
		await Api.put(`/titulos/${dados.id}`, dados);
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
	}
};

const deleteById = async(id: number): Promise<void | Error> => {
	try{
		await Api.delete(`/titulos/${id}`);
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao deletar o registro.');
	}
};

export const TitulosService = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
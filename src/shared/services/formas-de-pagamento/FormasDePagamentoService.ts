import { Environment } from '../../environment';
import { Api } from '../api/axios-config';


export interface IListagemFormaDePagamento{
	id: number,
	nome: string,
	tipo: 'Entrada' | 'Saida',
	parcelado: boolean,
	recebimento: number,
}

export interface IDetalheFormaDePagamento{
	id: number,
	nome: string,
	tipo: 'Entrada' | 'Saida',
	taxa:{
		aVista: number,
		prazoFixa: number,
		porParcela: number,
		fixa: number,
	},
	parcelado: boolean,
	recebimento: number,
}

type TFormaDePagamentosETotalCount = {
	data: IListagemFormaDePagamento[],
	totalCount: number,
}

const getAll = async(page = 1, filter = '', tipo?: 'Entrada' | 'Saida'): Promise<TFormaDePagamentosETotalCount | Error> => {
	try{
		const filtro = tipo ? `tipo=${tipo}` : '';

		const { data, headers } = await Api.get( `/formas_de_pagamento?${filtro}_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`);

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

const getById = async(id: number): Promise<IDetalheFormaDePagamento | Error> => {
	try{
		const { data } = await Api.get(`/formas_de_pagamento/${id}`);

		if(data){
			return data;
		}

		return new Error('Erro ao listar o registro.');
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao listar os registros.');
	}
};

const create = async(dados: Omit<IDetalheFormaDePagamento, 'id'>): Promise<number | Error> => {
	try{
		const { data } = await Api.post('/formas_de_pagamento', dados);

		if(data){
			return data;
		}

		return new Error('Erro ao criar o registro.');
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
	}
};

const updateById = async(dados: IDetalheFormaDePagamento): Promise<void | Error> => {
	try{
		await Api.put(`/formas_de_pagamento/${dados.id}`, dados);
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
	}
};

const deleteById = async(id: number): Promise<void | Error> => {
	try{
		await Api.delete(`/formas_de_pagamento/${id}`);
	}catch(error){
		return new Error((error as {message: string}).message || 'Erro ao deletar o registro.');
	}
};

export const FormasDePagamentoService = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
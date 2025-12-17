import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ChurnPrediction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    data_analise: Date;

    // Resultado
    @Column()
    previsao: string; // 'Vai cancelar' | 'Vai continuar'

    @Column('float')
    probabilidade: number;

    @Column()
    risco_alto: boolean;

    // Dados do Cliente (Input)
    @Column()
    cliente_id_origem: string; // ID original do CSV/Input se houver

    @Column({ nullable: true })
    idade: number;

    @Column({ nullable: true })
    genero: string;

    @Column({ nullable: true })
    regiao: string;

    @Column({ nullable: true })
    tipo_contrato: string;

    @Column({ nullable: true })
    metodo_pagamento: string;

    @Column({ nullable: true })
    plano_assinatura: string;

    @Column('float', { nullable: true })
    valor_mensal: number;

    @Column({ nullable: true })
    tempo_assinatura_meses: number;

    @Column({ nullable: true })
    dias_ultimo_acesso: number;

    @Column({ nullable: true })
    visualizacoes_mes: number;

    @Column({ nullable: true })
    contatos_suporte: number;

    @Column({ nullable: true })
    dispositivo_principal: string;

    @Column({ nullable: true })
    categoria_favorita: string;

    @Column('float', { nullable: true })
    avaliacao_plataforma: number;
}

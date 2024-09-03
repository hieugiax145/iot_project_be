import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('activity')
export class ActivityEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    device: string

    @Column('int')
    action: number

    @CreateDateColumn({ type: 'timestamp' })
    time: Date
}
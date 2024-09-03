import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('sensorsdata')
export class SensorsDataEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('float')
    temp: number

    @Column('float')
    hum: number

    @Column('float')
    light: number

    @CreateDateColumn({type:'timestamp'})
    time: Date;
}

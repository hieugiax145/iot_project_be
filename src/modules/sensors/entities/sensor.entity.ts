import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sensorsdata')
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  temp: number;

  @Column('float')
  hum: number;

  @Column('float')
  light: number;

  @Column('float')
  dust: number;

  @CreateDateColumn({ type: 'timestamp' })
  time: Date;

  @BeforeInsert()
  convertTimeToGMT7() {
    this.time = new Date(new Date().getTime() + 7 * 60 * 60 * 1000); // convert time to GMT+7
  }
}

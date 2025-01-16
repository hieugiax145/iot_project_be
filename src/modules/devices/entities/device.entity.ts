import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('activity')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device: string;

  @Column('int')
  action: number;

  @CreateDateColumn({ type: 'timestamp' })
  time: Date;

  @BeforeInsert()
  convertTimeToGMT7() {
    this.time = new Date(new Date().getTime() + 7 * 60 * 60 * 1000); // convert time to GMT+7
  }
}

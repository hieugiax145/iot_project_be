import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sensorsdata')
export class Sensor {
  @ApiProperty({ example: 122 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 25 })
  @Column('float')
  temp: number;

  @ApiProperty({ example: 25 })
  @Column('float')
  hum: number;

  @ApiProperty({ example: 25 })
  @Column('float')
  light: number;

  @ApiProperty({ example: 25 })
  @Column('float')
  dust: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  time: Date;

  @BeforeInsert()
  convertTimeToGMT7() {
    this.time = new Date(new Date().getTime() + 7 * 60 * 60 * 1000); // convert time to GMT+7
  }
}

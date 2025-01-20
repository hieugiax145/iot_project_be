import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('activity')
export class Device {
  @ApiProperty({
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'led1',
  })
  @Column()
  device: string;

  @ApiProperty({
    example: 1,
  })
  @Column('int')
  action: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  time: Date;

  @BeforeInsert()
  convertTimeToGMT7() {
    this.time = new Date(new Date().getTime() + 7 * 60 * 60 * 1000); // convert time to GMT+7
  }
}

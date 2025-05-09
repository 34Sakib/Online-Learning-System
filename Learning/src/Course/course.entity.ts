import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  instructor: string;

  @Column()
  startingdate: Date;

  @Column()
  type: string;

  @Column({ default: 'available' })
  status: 'available' | 'filledup';
}
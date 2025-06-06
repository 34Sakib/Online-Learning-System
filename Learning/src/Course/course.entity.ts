import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  instructor: string;

  @Column()
  enrollmentDeadline: string;

  @Column()
  startingdate: Date;

  @Column()
  type: string;

  @Column({ default: 'available' })
  status: 'available' | 'filledup';

  @Column({ type: 'float', default: 99 })
  price: number;
}
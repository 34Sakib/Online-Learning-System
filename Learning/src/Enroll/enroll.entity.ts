import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Enroll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column()
  studentName: string;

  @Column()
  courseId: number;

  @Column()
  courseName: string;

  @Column()
  payment: number;
}

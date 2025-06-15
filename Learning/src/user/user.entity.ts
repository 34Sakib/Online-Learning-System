import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  gender: string;
  
  @Column()
  phoneNumber: string;
  
  @Column({ unique: true })
  username: string;
  
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  role: string; // Admin, Student
}

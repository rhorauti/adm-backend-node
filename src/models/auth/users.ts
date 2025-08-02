import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 256, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 256 })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 256 })
  @Exclude()
  photoUrl?: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  createdAt: Timestamp;

  @Column()
  @Exclude()
  accessLevel: number;

  @Column()
  @Exclude()
  isActive: boolean;

  @Column()
  @Exclude()
  emailConfirmed: boolean;
}

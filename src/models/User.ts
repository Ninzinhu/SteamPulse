import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Acquisition } from "./Acquisition";
import { Alert } from "./Alert";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  steamId!: string;

  @Column({ nullable: true })
  email?: string;

  @OneToMany(() => Acquisition, (a) => a.user)
  acquisitions?: Acquisition[];

  @OneToMany(() => Alert, (alert) => alert.user)
  alerts?: Alert[];
}

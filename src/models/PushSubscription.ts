import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class PushSubscription {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column("text")
  endpoint!: string;

  @Column("text")
  keys!: string; // should store JSON string of {p256dh, auth}
}

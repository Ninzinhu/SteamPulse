import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./Game";
import { User } from "./User";

@Entity()
export class Acquisition {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.acquisitions)
  user!: User;

  @ManyToOne(() => Game, (game) => game.acquisitions)
  game!: Game;

  @Column("decimal", { precision: 10, scale: 2 })
  cost!: number;

  @Column({ type: "timestamp" })
  date!: Date;
}

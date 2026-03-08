import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./Game";
import { PriceSnapshot } from "./PriceSnapshot";
import { User } from "./User";

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.alerts)
  user!: User;

  @ManyToOne(() => Game, (game) => game.alerts)
  game!: Game;

  @ManyToOne(() => PriceSnapshot)
  snapshot!: PriceSnapshot;

  @Column({ type: "boolean", default: false })
  seen!: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}

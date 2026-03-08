import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./Game";

@Entity()
export class PriceSnapshot {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Game, (game) => game.snapshots)
  game!: Game;

  @Column("decimal", { precision: 10, scale: 2 })
  priceUsd!: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  priceBrl?: number;

  @Column({ type: "timestamp" })
  timestamp!: Date;
}

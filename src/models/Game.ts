import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Acquisition } from "./Acquisition";
import { Alert } from "./Alert";
import { PriceSnapshot } from "./PriceSnapshot";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  appId!: number;

  @Column()
  name!: string;

  @OneToMany(() => Acquisition, (a) => a.game)
  acquisitions?: Acquisition[];

  @OneToMany(() => PriceSnapshot, (ps) => ps.game)
  snapshots?: PriceSnapshot[];

  @OneToMany(() => Alert, (alert) => alert.game)
  alerts?: Alert[];
}

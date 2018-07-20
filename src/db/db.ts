import ndarray from "ndarray";
import { Dimension, View1D, View2D, Views } from "../api";
import { Interval } from "../basic";

export type DbResult<V> = Map<
  V,
  {
    hists: ndarray;
    noBrush: ndarray;
  }
>;

export interface DataBase<V extends string, D extends string> {
  initialize(): Promise<void>;
  length(): Promise<number>;
  histogram(dimension: Dimension<D>): Promise<ndarray>;
  heatmap(dimensions: [Dimension<D>, Dimension<D>]): Promise<ndarray>;

  loadData1D(
    activeView: View1D<D>,
    pixels: number,
    views: Views<V, D>,
    brushes: Map<D, Interval<number>>
  ): DbResult<V>;

  loadData2D(
    activeView: View2D<D>,
    pixels: [number, number],
    views: Views<V, D>,
    brushes: Map<D, Interval<number>>
  ): DbResult<V>;
}
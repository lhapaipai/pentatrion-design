import { BBox, Geometry } from "geojson";

export type OptionLike = Option | GeoOption;

export type Option = {
  type?: "Option";
  value: string | number;
  label: string;
};

export type NoDataOption = {
  id: string;
  type: "nodata";
};

/** For compatibility with OptionLike. get original types from pentatrion-geo */
type GeoOption<G extends Geometry | null = Geometry, T extends string = string> = {
  id: string;
  type: "Feature";
  properties: FeatureProperties<T>;
  geometry: G;
  bbox?: BBox | undefined;
};

type FeatureProperties<T extends string = string> = {
  id: string;

  /** computed name + short context for input string */
  label: string;
  name: string;
  context: string | null;
  score: number;
  type: T;
  originalProperties?: any;
};

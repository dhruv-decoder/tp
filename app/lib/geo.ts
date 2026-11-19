import { geoConicConformal, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import topo from "@/data/india-states.topo.json";
import jurisdictions from "@/data/jurisdictions.json";

export const MAP_W = 760;
export const MAP_H = 820;

interface StateProps {
  st_nm: string;
  st_code: string;
}

const nameToCode = new Map<string, string>();
for (const j of jurisdictions as { code: string; map_name: string | null }[]) {
  if (j.map_name) nameToCode.set(j.map_name, j.code);
}

const topology = topo as unknown as Topology<{ states: GeometryCollection<StateProps> }>;
const fc = feature(topology, topology.objects.states);

/* Lambert conformal conic on India's standard meridian (82°30′E). */
const projection = geoConicConformal()
  .parallels([12, 32])
  .rotate([-82.5, 0])
  .fitExtent(
    [
      [12, 12],
      [MAP_W - 12, MAP_H - 12],
    ],
    fc as GeoPermissibleObjects,
  );

const pathGen = geoPath(projection);

export interface StateShape {
  code: string;
  name: string;
  d: string;
  centroid: [number, number];
  bbox: [[number, number], [number, number]];
  area: number;
}

export const STATE_SHAPES: StateShape[] = fc.features
  .map((f) => {
    const code = nameToCode.get(f.properties.st_nm);
    if (!code) return null;
    const d = pathGen(f) ?? "";
    const c = pathGen.centroid(f) as [number, number];
    const b = pathGen.bounds(f) as [[number, number], [number, number]];
    return { code, name: f.properties.st_nm, d, centroid: c, bbox: b, area: pathGen.area(f) };
  })
  .filter((s): s is StateShape => s !== null)
  // draw big first so small states sit on top
  .sort((a, b) => b.area - a.area);

export const SHAPE_BY_CODE = new Map(STATE_SHAPES.map((s) => [s.code, s]));

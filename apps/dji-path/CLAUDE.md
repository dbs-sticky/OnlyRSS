# dji-path — architectural notes

## KML altitude mode: `relativeToGround` not `absolute`

DJI SRT files contain two altitude fields:

- `rel_alt` — height above the takeoff point (AGL). Used for KML coordinates.
- `abs_alt` — WGS84 ellipsoidal height. **Not used for KML coordinates.**

The KML uses `altitudeMode=relativeToGround` with `rel_alt` values. Using `abs_alt` with `altitudeMode=absolute` was tried and rejected: DJI reports `abs_alt` as a WGS84 ellipsoidal height, but KML `absolute` mode interprets altitude relative to the EGM96 geoid. In the UK the difference is roughly +47–50 m, which places the entire flight path underground in Google Earth.

## Vertical indicator lines: explicit `LineString` elements, not `extrude`

Each sampled point along the flight path has a paired 2-point `LineString` placemark that runs from `rel_altitude=0` to `rel_altitude=<drone altitude>` at the same lat/lon. This creates visible vertical lines whose height indicates the drone's altitude at that point.

The KML `extrude=1` property on a `LineString` would achieve the same effect in Google Earth Desktop, but **Google Earth Web does not render `extrude` with `altitudeMode=relativeToGround`**. Because the app directs users to Google Earth Web, the vertical lines must be generated explicitly rather than relying on `extrude`.

`extrude=1` and `tessellate=1` are kept on the main flight-path `LineString` for users who open the KML in Google Earth Desktop, where they do render correctly.

## `abs_alt` is optional in the SRT parser

The parser only requires `latitude`, `longitude`, and `rel_alt` to accept a data point. `abs_alt` is captured when present but is not required. Some DJI drone models or firmware versions omit `abs_alt` from their SRT output; making it mandatory would silently drop every data point from those files, producing an empty KML.
